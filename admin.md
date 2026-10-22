---
titulo: El admin, la cabina de control del contenido
seccion: Admin
resumen: Para qué sirve el editor de admin.hgsportafolio.site, qué se edita en cada estación, cómo se revisa y publica un cambio y el resumen semanal por correo.
orden: 4
---

El admin es un editor propio en React + Vite (`admin/`), con la misma identidad de línea de metro del portafolio. Lee y guarda directamente en este repositorio, así que Harol cambia textos, proyectos, credenciales, stack, CV, los casos MIGOZZ, ARIA y DevPanel, y SEO sin tocar código. También recibe los mensajes del formulario de contacto del portafolio y envía sus correos (ver [correos](correos.md)) y, cada lunes, le manda a Harol un resumen de la semana. Se despliega como segundo sitio de Netlify (`admin-hgs`) en `admin.hgsportafolio.site`.

Reemplazó el 2026-10-21 a un primer editor basado en Sveltia CMS (commits `3a1e1e4` y `c1629bf`).

## Entrar

1. Escribir el PIN.
2. Escribir el código de 6 dígitos que llega al correo del dueño (vence en 10 minutos).
3. Queda abierta una sesión de 12 horas en una cookie que la página no puede leer.

Si la sesión termina mientras se edita, el admin vuelve a la entrada y los cambios sin publicar siguen guardados en el navegador. El detalle y los límites están en [seguridad](seguridad.md).

## Estaciones

Cada estación del mapa de la izquierda es una sección (`STATIONS` en `admin/src/schema.ts`):

| Estación | Archivo |
| :-- | :-- |
| Mensajes | Ninguno: lee los mensajes del formulario de contacto guardados en Netlify Blobs (ver abajo). |
| Textos del sitio | `portfolio/src/content/data/site.json`, sin `credGroups` ni `stackGroups`. Agrupado en Portada, Oficio, MIGOZZ en la página principal, Cargo anterior, Encabezados, Contacto, Navegación y pie. Las claves sin grupo en `schema.ts` caen en «Otros textos» (`components/Fields.tsx`); ahí están los textos de la franja de DevPanel (`sideProject`). |
| Proyectos | `portfolio/src/content/data/projects.json`. El orden de la lista es el del sitio. Incluye los campos `case` (id del caso de estudio: `aria` o `devpanel`) y `code` (repositorio público: solo código propio, nunca de un cliente); ver [portafolio](portafolio.md). |
| Credenciales | `site.json` → `credGroups`. |
| Stack | `site.json` → `stackGroups` (grupos) y `stack.json` (tecnologías de cada grupo, con el mismo identificador). |
| Hoja de vida | `curriculum/cv_data.json`. El PDF se regenera solo al publicar. |
| MIGOZZ | `migozz.json` (página del caso), `migozz-public.json` (cifras públicas) y `migozz-users.json` (usuarios). |
| ARIA | `aria.json` (página del caso `/aria/`). Nueva desde el commit `b9d13b1`. La nota del panel pide solo cifras medidas y con su contexto, y nada de IDs de AWS, URLs internas ni nombres del equipo. |
| DevPanel | `devpanel.json` (página del caso `/devpanel/`). Nueva desde el commit `90ff404`. La nota del panel pide solo cifras que se puedan comprobar en el repositorio de DevPanel; el texto de la estación recuerda que la franja de la portada está en «Textos del sitio». |
| SEO | `portfolio/src/content/data/seo.json`, incluidos los textos de las páginas de MIGOZZ, de ARIA (`ariaPages`) y de DevPanel (`devpanelPages`). |

## Mensajes

La primera estación no edita archivos. `admin/src/components/Inbox.tsx` pide a `GET /api/messages` (`admin/netlify/functions/messages.mts`) los mensajes que dejó `/api/contact` en el almacén `contact-messages`, del más nuevo al más viejo (hasta 200).

- Cada mensaje muestra nombre, correo, fecha y hora de Bogotá, lugar aproximado (geolocalización de Netlify) e idioma de la página.
- **Responder** abre el correo con el asunto «Re: tu mensaje» o «Re: your message», según el idioma.
- **Borrar** pide confirmación y llama a `DELETE /api/messages/:id`. No se puede deshacer.
- **Actualizar** vuelve a traer la lista. Si la sesión terminó, la estación lo dice y hay que recargar.

Cada mensaje también llega por correo; esta estación es el archivo, y conserva el mensaje aunque el correo falle.

## Cómo se edita

- Los campos salen de los propios datos: si se agrega una clave a un JSON, el admin la muestra sola. `schema.ts` solo pone nombres en español, ayudas, campos de solo lectura, listas de opciones y editores especiales.
- Español e inglés van lado a lado. Las listas permiten agregar, subir, bajar y quitar elementos; un elemento nuevo copia las claves que comparten los existentes, vacías.
- Las estaciones con cambios sin publicar se pintan de amarillo en el mapa.

## Imágenes

| Campo | Se sube a | Valor que queda en el JSON |
| :-- | :-- | :-- |
| Captura de proyecto (`projects[].shot`) | `portfolio/images/shots/` | `shots/<nombre>.webp` |
| Certificado (`credGroups[].items[].img`) | `portfolio/images/credentials/` | `<nombre>` |
| Captura de MIGOZZ (`shots[].src`) | `portfolio/images/migozz/` | `migozz/<nombre>.webp` |
| Ícono del stack | `portfolio/public/icons/<nombre>.svg` (saneado, sin conversión) | `<nombre>` |

- Acepta PNG, JPG o WebP de hasta 8 MB; los íconos, SVG de hasta 25 KB.
- Antes de guardarlo, `cleanSvg()` (`admin/src/svg.ts`) quita del SVG scripts, manejadores `on*`, enlaces externos o `javascript:`, documentos incrustados y estilos con `@import` o URL externas, y avisa cuántos elementos quitó (commit `2d942c4`). El ícono se sirve desde el dominio del portafolio, así que un script dentro correría ahí si alguien abriera el archivo directamente.
- El nombre del archivo se normaliza (`slug` en `admin/src/data.ts`): «Mi Captura 2.PNG» queda `mi-captura-2`.
- La conversión a WebP la hacen el build de Netlify y el workflow `Images` (ver [portafolio](portafolio.md), sección Imágenes).

## Borradores

Lo que no se alcanza a publicar se guarda en `localStorage` (clave `hgs-admin-draft:<rama>`), junto con la versión del archivo sobre la que se editó. Al volver, si el archivo en GitHub no cambió, el admin recupera el borrador y lo avisa. Si cambió, el borrador se descarta. El navegador avisa antes de cerrar la pestaña con cambios pendientes.

Las imágenes subidas no se guardan como borrador: solo viven hasta recargar.

## Revisar y publicar

El **tablero de salida** (abajo, `components/Departure.tsx`) cuenta los cambios y ofrece:

- **Revisar:** cada cambio con su antes y ahora, y un aviso de los textos que quedaron vacíos. Permite escribir el mensaje del commit; si se deja vacío, usa `content: actualizar <estaciones> desde el admin`.
- **Publicar:** un solo commit en la rama con todos los archivos e imágenes, hecho con la Git Data API (blobs → árbol → commit → mover la rama). Si la rama se movió entretanto (por ejemplo el commit del CV), reintenta hasta 3 veces sobre la cabeza nueva.
- **Conflictos:** si alguien cambió en GitHub uno de los archivos editados desde que se abrió, no publica nada y ofrece «Recargar <archivo>», que trae la versión nueva y descarta los cambios de ese archivo.
- **Seguimiento:** después de publicar, el tablero consulta cada 10 segundos (hasta 20 minutos) las ejecuciones de GitHub Actions de ese commit y muestra su estado.

Si GitHub rechaza la publicación, el tablero lo explica: ante un 401 la sesión terminó y hay que entrar de nuevo (los cambios siguen guardados como borrador); ante un 403 el token del servidor (`ADMIN_GITHUB_TOKEN` en Netlify) no tiene permiso «Contents: Read and write».

Netlify pone el sitio en línea en uno o dos minutos. Si un JSON quedó con la forma equivocada, el build falla y el sitio sigue con la versión anterior (ver [arquitectura](arquitectura.md)).

## Resumen semanal por correo

La función programada `admin/netlify/functions/weekly-digest.mts` (commit `ba00cb5`) le envía a Harol un correo con cómo le fue al portafolio la semana anterior. La lógica está en `admin/netlify/lib/digest.ts` y la firma para Google en `admin/netlify/lib/google.ts`; las pruebas, en `portfolio/tests/digest.test.ts`.

### Cuándo

Cada lunes a las 8:00 de Bogotá (`schedule: "0 13 * * 1"`, en UTC). Cubre los siete días completos anteriores, de medianoche a medianoche en Bogotá.

### Qué manda

- **Asunto:** visitantes y descargas del CV de la semana.
- **Visitas (Umami Cloud):** visitantes, visitas, páginas vistas y tiempo medio por visita, comparados con la semana anterior; páginas más vistas, de dónde llegaron, países y los eventos del sitio. `eventLabel()` traduce a palabras los de descarga del CV, formulario, MIGOZZ, redes, proyectos, casos (`case-<id>`, desde `574e51b`) y código (`code-<id>`); los demás (como `devpanel-code` y `devpanel-download`) salen con su nombre tal cual.
- **Google (Search Console):** apariciones en resultados, clics, posición media y las 5 búsquedas que más mostraron el sitio. Search Console va dos o tres días atrasado, así que su semana termina antes y el correo lo dice.
- **Lo que falló:** si una fuente responde con error, el correo lo dice en «No se pudo leer» en vez de mostrar ceros.

Cada fuente es opcional: lo que no está configurado se deja fuera, nunca se inventa. Se envía por Resend con una clave de idempotencia por semana (`weekly-digest-<inicio de la semana>`): un reintento o una segunda corrida a mano dentro de las 24 horas en que Resend recuerda la clave no envía otro correo.

### Variables que necesita

En el sitio `admin-hgs` de Netlify (ver [configuración](configuracion.md)):

| Variable | Para qué |
| :-- | :-- |
| `UMAMI_API_KEY` y `UMAMI_WEBSITE_ID` | Las dos activan la parte de visitas. Es la API de Umami Cloud (`api.umami.is`), distinta de `VITE_UMAMI_WEBSITE_ID` del portafolio aunque el id del sitio sea el mismo. |
| `GSC_SERVICE_ACCOUNT` | Opcional. El JSON de una cuenta de servicio de Google Cloud con lectura de Search Console. El correo de esa cuenta debe agregarse como usuario de la propiedad en Search Console. |
| `GSC_SITE` | Opcional. Propiedad de Search Console; por defecto la de dominio de `hgsportafolio.site`. |
| `DIGEST_TO` | A quién llega. Si falta, usa `CONTACT_TO`, luego `ADMIN_EMAIL` y, al final, una dirección fija en el código (desde `574e51b`). |
| `CONTACT_FROM` | Remitente. Si falta, usa el mismo remitente por defecto del formulario. |

Además usa `RESEND_API_KEY`, como todos los correos del admin.

### Estado

El código está desplegado, pero el resumen no llega hasta que se configuren esas variables: sin ninguna fuente (Umami o Search Console) la función falla con «No source configured». Destinatario y remitente ya tienen valores por defecto. Es un pendiente de Harol (ver [pendientes](pendientes.md)).

### Cómo probarlo

En Netlify: sitio `admin-hgs` → Functions → `weekly-digest` → **Run now**. El registro de la función muestra el error si falta algo. Por la clave de idempotencia, otra corrida en las 24 horas siguientes no envía un segundo correo.

## Probar contra otra rama

`?branch=nombre` en la URL hace que el admin lea y publique en esa rama; la barra superior lo muestra como «Rama de prueba». El comentario del deploy preview del admin lo recuerda.

## Desarrollo local

```bash
cd admin
npm install
cp .env.example .env   # y llenar los valores
npx netlify dev        # interfaz y funciones /api con el .env
```

`npm run dev` levanta solo la interfaz (puerto 5600), sin funciones, así que no deja entrar. `npm run build` corre antes el typecheck de la app y de las funciones (`tsconfig.netlify.json`).
