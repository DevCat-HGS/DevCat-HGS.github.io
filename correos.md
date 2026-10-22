---
titulo: Los correos que envía el sistema
seccion: Correos
resumen: Cuándo se envía cada correo del formulario de contacto, del admin y del resumen semanal, a quién, con qué proveedor y cómo se evita el abuso.
orden: 6
---

Todos los correos salen del sitio del admin (`admin-hgs`) con [Resend](https://resend.com), por su API (`https://api.resend.com/emails`), con la clave `RESEND_API_KEY` y el dominio `hgsportafolio.site`, que debe estar verificado en Resend. Mientras no lo esté, no sale ningún correo. La función que llama a Resend es `resend()` en `admin/netlify/lib/netlify.ts`. Ver [configuración](configuracion.md).

Desde el commit `f4be780` (2026-10-21) el portafolio ya no envía correos ni tiene funciones de Netlify: su formulario le escribe al admin.

## Resumen

| Correo | Cuándo | A quién | Remitente |
| :-- | :-- | :-- | :-- |
| Mensaje nuevo | Llega un mensaje válido a `/api/contact` | `CONTACT_TO` (si falta, `ADMIN_EMAIL`) | `CONTACT_FROM` |
| Confirmación | El mismo mensaje | El correo que escribió el visitante | `CONTACT_FROM` |
| Código de acceso | PIN correcto en el admin | `ADMIN_EMAIL` | `ADMIN_MAIL_FROM` |
| Intentos fallidos | Se bloquea el PIN | `ADMIN_EMAIL` | `ADMIN_MAIL_FROM` |
| Resumen semanal | Lunes 8:00 de Bogotá (función programada) | `DIGEST_TO` (si falta, `CONTACT_TO`) | `CONTACT_FROM` (sin valor por defecto) |

Si una variable no está definida, el código del formulario y de los códigos usa un valor por defecto: el destino es el correo de contacto de Harol, y los remitentes son `contacto@hgsportafolio.site` (formulario) y `admin@hgsportafolio.site` (códigos).

## Formulario de contacto

### El recorrido

1. El visitante llena el formulario de la sección Cierre (`portfolio/src/components/ContactForm.tsx`): nombre (máx. 120), correo (máx. 200) y mensaje (máx. 4000).
2. El formulario envía JSON por `fetch` a `https://admin.hgsportafolio.site/api/contact` (constante `CONTACT_API` en `portfolio/src/lib/endpoints.ts`), sin recargar la página. Además de los campos manda `lang` (idioma de la página), `website` (campo trampa, invisible) y `elapsed` (milisegundos desde que se abrió la página hasta el envío). Si la respuesta no es correcta, el formulario pide escribir por correo.
3. Responde `admin/netlify/functions/contact.mts`. Solo acepta orígenes del portafolio (`allowedOrigin`) y contesta las peticiones CORS previas (`OPTIONS`).
4. `receiveContact()` en `admin/netlify/lib/contact.ts` descarta bots, valida, aplica los límites, guarda el mensaje en Netlify Blobs (almacén `contact-messages`, clave `msg:<id>`) y envía los dos correos en paralelo.
5. El mensaje queda en la estación «Mensajes» del admin aunque falle el envío de los correos (ver [admin](admin.md)).

Por qué cambió: el formulario anterior usaba Netlify Forms, que no detectaba el formulario (respondía 404) y redirigía los envíos de la página en inglés, así que no se guardaba ni se enviaba nada (mensaje del commit `f4be780`).

### Los dos correos

- **A Harol:** asunto «Nuevo mensaje de <nombre> desde el portafolio», con el nombre, el correo, el mensaje escapado, la fecha en hora de Bogotá y el idioma de la página. «Responder» va directo al visitante (`reply_to`).
- **Al visitante:** «Recibí tu mensaje» o «I got your message», según el idioma de la página. Agradece, dice que la respuesta llega en uno o dos días hábiles y firma Harol. «Responder» va a Harol.

La copia de Harol se envía primero en la lista, pero los dos van con `Promise.allSettled`: si uno falla, el otro sale igual y el error queda en el registro de la función.

### Protecciones contra abuso

| Protección | Cómo funciona |
| :-- | :-- |
| Origen | Solo `https://hgsportafolio.site`, `https://portafolio-hgs.netlify.app` y sus deploy previews (`<algo>--portafolio-hgs.netlify.app`). Otro origen recibe 403. |
| Campo trampa | Si `website` (o el antiguo `bot-field`) trae algo, el envío se descarta. |
| Tiempo mínimo | Un envío hecho en menos de 2,5 segundos (`minFillMs`) se descarta. Si la petición no trae `elapsed`, esta revisión no se aplica. |
| Respuesta a bots | Los bots descartados reciben el mismo `200 ok` que una persona, para que no descubran la trampa. No se guarda nada ni se envía nada. |
| Por dirección IP | 3 mensajes cada 10 minutos (`perIp`, `ipWindowMs`). Luego responde 429. |
| Por día | 40 mensajes en total (`perDay`), para no gastar la cuota diaria gratuita de Resend (100, según el comentario del código). |
| Contenido de la confirmación | Nunca repite lo que escribió el visitante: ni el mensaje, y el nombre solo si es una palabra de letras (`safeFirstName`). Así el formulario no sirve para mandar texto a desconocidos. |
| Duplicados | Cada correo lleva una `Idempotency-Key` (SHA-256 de tipo, correo, nombre y mensaje); Resend no envía dos veces la misma en 24 horas. |

Los límites están en `CONTACT_LIMITS` (`admin/netlify/lib/contact.ts`). Los contadores se guardan en el mismo almacén `contact-messages` (claves `limit:ip:<ip>` y `limit:day:<fecha>`).

Pruebas: `portfolio/tests/contact-email.test.ts` (importa `admin/netlify/lib/contact.ts`: correos, bots, límites y orígenes) y `portfolio/e2e/features.spec.ts` (el formulario envía el JSON esperado y avisa si falla; la función se simula).

## Correos del admin

Los arma `admin/netlify/lib/auth.ts` y los envía `send()` en `admin/netlify/lib/netlify.ts`.

- **Código de acceso:** asunto «<código> es tu código del admin», con el código en grande, la advertencia de que vence en 10 minutos, y el lugar, la IP y la hora (Bogotá) de la petición. El pie dice que, si no fue Harol, alguien conoce el PIN y hay que cambiar `ADMIN_PIN`.
- **Intentos fallidos:** asunto «Intentos fallidos en el admin». Avisa si se bloqueó una dirección 15 minutos tras 5 intentos o si se bloqueó el PIN para todos durante una hora. Se envía una vez por bloqueo.

Si el envío del código falla, el reto se borra y la pantalla muestra «No se pudo enviar el código. Revisa RESEND_API_KEY.». Un fallo al enviar el aviso de bloqueo se ignora para no romper la respuesta.

Límites que frenan el abuso: un código cada 30 segundos por dirección y los bloqueos del PIN descritos en [seguridad](seguridad.md).

## Resumen semanal

`admin/netlify/functions/weekly-digest.mts` corre cada lunes a las 8:00 de Bogotá y envía un correo con las visitas de la semana anterior (Umami Cloud) y cómo apareció el sitio en Google (Search Console). Asunto: «Tu portafolio esta semana: <n> visitantes, <n> descargas del CV». Lo arma `digestEmail()` en `admin/netlify/lib/digest.ts`, con el mismo marco visual que los correos del formulario (`layout()` de `contact.ts`), en HTML y en texto plano.

- **Destino y remitente:** `DIGEST_TO` (o `CONTACT_TO`) y `CONTACT_FROM`. A diferencia del formulario, aquí no hay valores por defecto: si faltan, la función falla y no se envía nada.
- **Fuentes:** `UMAMI_API_KEY` + `UMAMI_WEBSITE_ID` para visitas y `GSC_SERVICE_ACCOUNT` (opcional `GSC_SITE`) para Google. Sin ninguna fuente, la función falla en vez de mandar un correo vacío. Si una fuente responde con error, el correo lo dice en una sección «No se pudo leer».
- **Lo que se escapa:** lo que viene de fuera (sitios de origen, búsquedas) se escapa antes de ir al HTML; hay prueba de eso en `portfolio/tests/digest.test.ts`.
- **Duplicados:** clave de idempotencia `weekly-digest-<inicio de la semana>`.
- **Privacidad:** el pie aclara que Umami no usa cookies ni identifica a nadie: son conteos.

Hoy no se envía: faltan esas variables en `admin-hgs`. Cómo probarlo y el detalle de cada variable, en [admin](admin.md).
