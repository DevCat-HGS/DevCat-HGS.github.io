---
titulo: Seguridad del admin y del sitio
seccion: Seguridad
resumen: Entrada con PIN y código por correo, sesiones, límites, intermediario de GitHub, CSP, cabeceras, formulario, dependencias, búsqueda de secretos y qué haría falta para publicar el repositorio.
orden: 5
---

## Principio

El token de GitHub nunca llega al navegador. Vive en Netlify (`ADMIN_GITHUB_TOKEN`) y solo lo usa la función `/api/github`, para sesiones abiertas y para una lista cerrada de llamadas. Antes del commit `bf84696` (2026-10-21) el admin pedía el token en el navegador; ese modelo ya no existe.

Las reglas están en `admin/netlify/lib/auth.ts`, escritas como lógica pura con dependencias inyectadas (almacén, correo, reloj) para probarlas sin Netlify en `portfolio/tests/admin-auth.test.ts`.

## Entrada en dos pasos

| Paso | Ruta | Qué pasa |
| :-- | :-- | :-- |
| PIN | `POST /api/auth/pin` | Compara el PIN con `ADMIN_PIN` en tiempo constante. Si es correcto, genera un código de 6 dígitos uniforme, guarda solo su HMAC, lo envía a `ADMIN_EMAIL` y pone la cookie `hgs_challenge` (10 minutos, solo para `/api/auth`). |
| Código | `POST /api/auth/code` | Verifica la cookie de reto y el código. Si es correcto, gasta el reto y abre una sesión de 12 horas en la cookie `hgs_session`. |
| Sesión | `GET /api/auth/session` | Dice si el navegador tiene una sesión válida. |
| Salir | `POST /api/auth/logout` | Borra la sesión del almacén y la cookie. |

Por qué dos pasos: un PIN corto tiene pocos valores posibles (uno de 4 dígitos, 10.000). Aun acertándolo, solo se envía un código al correo del dueño, así que el PIN solo nunca abre el editor (comentario de `auth.ts`).

El correo con el código dice desde qué lugar e IP se pidió (geolocalización de Netlify) y avisa que, si no fue Harol, alguien conoce el PIN y hay que cambiar `ADMIN_PIN`. La pantalla de entrada muestra la dirección de destino enmascarada (`maskEmail`), suficiente para reconocerla pero no para leerla.

### Cómo elegir el PIN

Los límites frenan a quien prueba PIN al azar, no a quien lo adivina en pocos intentos. Por eso `ADMIN_PIN` no debe poder deducirse de datos públicos del dueño: ni los números de nombres de usuario actuales o anteriores, ni fechas, teléfonos o años que aparezcan en el sitio, el CV o las redes. Conviene un PIN sin relación con nada publicado y de más de 4 dígitos (el mínimo que pide `admin/.env.example`). Se cambia en las variables de entorno del sitio `admin-hgs` en Netlify.

## Límites

Definidos en `LIMITS` (`admin/netlify/lib/auth.ts`):

| Límite | Valor |
| :-- | :-- |
| PIN fallidos por dirección IP | 5, luego bloqueo de 15 minutos para esa dirección |
| PIN fallidos en total (todas las direcciones) | 20 en una hora, luego bloqueo del paso del PIN para todos durante 1 hora |
| Vida del código | 10 minutos |
| Intentos por código | 5, luego el código se quema y hay que pedir otro |
| Espera entre códigos | 30 segundos por dirección |
| Duración de la sesión | 12 horas |

Cuando se produce un bloqueo, llega un correo de aviso al dueño una vez por bloqueo. Los contadores, retos y sesiones se guardan en Netlify Blobs (almacén `admin-auth`) con consistencia fuerte, para que un bloqueo o un código gastado se vean en la petición siguiente (`admin/netlify/lib/netlify.ts`).

## Sesiones

- Cookie `hgs_session` con `HttpOnly`, `Secure`, `SameSite=Strict` y `Path=/`.
- El valor lleva id, vencimiento y firma HMAC-SHA256 con `SESSION_SECRET` (mínimo 32 caracteres).
- La sesión también existe en el almacén: «Salir» la borra, así que una cookie copiada deja de servir.
- Cambiar `SESSION_SECRET` cierra todas las sesiones abiertas.
- Sin `ADMIN_PIN` o sin un `SESSION_SECRET` de 32+ caracteres, la función responde 503 y nadie entra.

## Intermediario de GitHub

`admin/netlify/functions/github.mts` atiende `/api/github/*` y reenvía a `api.github.com` agregando el token. Antes revisa:

1. Que la petición traiga `X-Requested-With: hgs-admin` (`fromAdmin`). Un formulario de otro sitio no puede poner esa cabecera.
2. Que haya una sesión válida (si no, 401 y el admin vuelve a la entrada).
3. Que la llamada esté permitida por `allowedGitHubCall`:

| Método | Rutas permitidas |
| :-- | :-- |
| `GET` | `/user`, `/repos/DevCat-HGS/portfolio-hgs` y todo lo que cuelga de ella |
| `POST` | `.../git/blobs`, `.../git/trees`, `.../git/commits` |
| `PATCH` | `.../git/refs/heads/<rama>` |

Nada más: ni borrar, ni configuraciones, ni otros repositorios. Rutas con `..` o que no empiezan con `/` se rechazan. Las respuestas salen con `Cache-Control: no-store`.

El token recomendado en `admin/.env.example` es fine-grained, solo para el repo `portfolio-hgs`, con permiso «Contents: Read and write». El admin comprueba al cargar que tenga permiso de escritura.

## Cabeceras del admin

En `admin/netlify.toml`, para todas las rutas:

- `Content-Security-Policy`: `default-src 'self'`, `script-src 'self'`, `connect-src 'self'` (la interfaz solo habla con sus funciones), imágenes de `self`, `data:`, `blob:`, `https://hgsportafolio.site` y `https://avatars.githubusercontent.com`, `frame-ancestors 'none'`.
- `X-Robots-Tag: noindex, nofollow`, `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Referrer-Policy: no-referrer`, `Permissions-Policy` restrictiva, `Cross-Origin-Opener-Policy: same-origin`, `Strict-Transport-Security` de un año con subdominios.

## Cabeceras del portafolio

`portfolio/seo/headers.ts` es la única fuente: `vite preview` las sirve para las pruebas y el build las escribe en `dist/_headers` para Netlify.

- CSP sin scripts en línea ni `unsafe-eval`. Por eso los scripts de la pantalla de bienvenida y del 404 son archivos (`public/splash.js`, `public/404.js`). `style-src` admite `'unsafe-inline'` por los bloques `<style>` de `index.html` y los atributos `style` de React.
- `connect-src` permite `'self'` y `https://admin.hgsportafolio.site` (`CONTACT_ORIGIN` en `src/lib/endpoints.ts`), porque el formulario de contacto envía ahí. La misma constante alimenta el formulario y la política, así no se desalinean.
- Si `VITE_UMAMI_WEBSITE_ID` trae un UUID válido, la CSP abre solo los orígenes de Umami: `https://cloud.umami.is` en `script-src` y, en `connect-src`, además `https://gateway.umami.is` (adonde el script envía los eventos desde el commit `7837484`) y `https://api-gateway.umami.dev` (el host anterior). Sin UUID, la analítica está apagada y la CSP no abre nada.
- `nosniff`, `X-Frame-Options: DENY`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy`, COOP y HSTS.

`e2e/seo.spec.ts` comprueba que cada página envía la política y corre sin violaciones.

## Formulario de contacto

El formulario del portafolio le escribe al admin (`POST https://admin.hgsportafolio.site/api/contact`). Junto con la entrada (`/api/auth/*`), es la única ruta del admin que responde sin sesión, y se protege así:

- **Origen:** `allowedOrigin` en `admin/netlify/lib/contact.ts` solo acepta el portafolio, su dirección de Netlify y sus deploy previews; las cabeceras CORS solo se envían a esos orígenes. Una prueba comprueba que un dominio que imita el nombre (`...netlify.app.evil.example`) se rechaza.
- **Bots:** campo trampa `website` y tiempo mínimo de llenado de 2,5 segundos. Los bots reciben la misma respuesta que una persona.
- **Límites:** 3 mensajes por IP cada 10 minutos y 40 por día en total.
- **Confirmación sin eco:** el correo al visitante nunca repite lo que escribió (ni el mensaje, ni un nombre que no parezca nombre), para que el formulario no sirva para mandar texto a desconocidos.

Los mensajes guardados solo se leen y se borran con sesión abierta: `admin/netlify/functions/messages.mts` (`GET /api/messages`, `DELETE /api/messages/:id`) exige la cabecera `X-Requested-With: hgs-admin` y una sesión válida, igual que el intermediario de GitHub. El borrado solo acepta ids de letras, números, `_` y `-`.

Detalle en [correos](correos.md).

## Íconos SVG subidos desde el admin

`cleanSvg()` (`admin/src/svg.ts`) limpia cada SVG antes del commit: quita scripts, manejadores `on*`, enlaces externos y `javascript:`, documentos incrustados y estilos con `@import` o URL externas, y rechaza archivos de más de 25 KB (commit `2d942c4`). La CSP del portafolio ya bloquea scripts en línea; esto cierra el caso de alguien que abra el SVG directamente.

## security.txt

`portfolio/public/.well-known/security.txt` (RFC 9116) dice a quién avisar de un problema de seguridad. Tiene fecha de vencimiento: `tests/security-txt.test.ts` falla un mes antes, como recordatorio para renovarla.

## Dependencias

- Dependabot revisa cada semana `portfolio/`, `admin/` y las acciones de GitHub (ver [CI/CD](ci-cd.md)). Según el mensaje del commit `2d942c4`, las alertas de vulnerabilidades y los arreglos automáticos de seguridad de Dependabot están activados en `portfolio-hgs` (configuración de GitHub, fuera del código).
- **Vite 8.3.5** (commit `f3089f8`, 2026-10-21): el portafolio y el admin subieron a esa versión, que cerró las 12 alertas abiertas de Dependabot (servidor de desarrollo de Vite y `launch-editor`). Las ramas de Dependabot `.../vite-8.3.5` siguen en el remoto, ya sin PR abierto.

## Búsqueda de secretos

El escaneo de secretos de GitHub no está disponible en repos privados del plan gratuito, así que `.github/workflows/secret-scan.yml` corre gitleaks sobre todo el historial en cada push a `main` o `desarrollo` y en cada pull request. Si encuentra una clave o un token, el check falla y el valor sale tapado en el registro. Según el commit `2d942c4`, el historial actual sale limpio.

El mismo commit registra reglas de GitHub (fuera del código) que impiden borrar o reescribir con force-push la rama `main` en `DevCat-HGS` y `DevCat-HGS.github.io`.

## ¿Se puede hacer público este repositorio?

El 2026-10-21 se revisó el historial de `portfolio-hgs` para ver si podía pasar a público. No hay credenciales (coincide con gitleaks), pero el historial guarda archivos que salieron del árbol y no deben publicarse, y GitHub conserva cada PR en referencias `refs/pull/*` que el dueño no puede borrar, así que reescribir el historial no basta.

Por eso hacerlo público exige crear un repositorio nuevo con un historial limpio, no cambiar la visibilidad de este. Harol aplazó la decisión (ver [pendientes](pendientes.md)).

### Regla para el código público

Solo se publica código propio. Los repos de clientes se quedan privados (ver [perfil de GitHub](perfil-github.md)). Los repos públicos de proyectos de formación se publican como copias nuevas en un solo commit, sin archivos `.env`, direcciones del servidor ni contraseñas, nunca cambiando la visibilidad del repo original, cuyo historial puede guardar credenciales.

## Lo que nunca llega al navegador

- `ADMIN_GITHUB_TOKEN`, `ADMIN_PIN`, `SESSION_SECRET`, `RESEND_API_KEY`, y las del resumen semanal (`UMAMI_API_KEY`, `GSC_SERVICE_ACCOUNT`): solo las leen las funciones del admin.
- Las cookies de sesión y de reto (son `HttpOnly`).
- El código de acceso en claro: el servidor solo guarda su HMAC.

Los archivos `.env` están en `.gitignore`; solo se versionan las plantillas `.env.example`, sin valores secretos.
