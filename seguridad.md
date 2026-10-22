---
titulo: Seguridad del sitio y del admin
seccion: Seguridad
resumen: CSP y cabeceras del sitio, el formulario de contacto, los SVG saneados, dependencias, búsqueda de secretos y qué código se publica.
orden: 5
---

## Principio

El admin es privado y se entra con dos factores; su detalle no se publica. El token de GitHub nunca llega al navegador: los commits salen de una función del servidor. Antes del commit `bf84696` (2026-10-21) el admin pedía el token en el navegador; ese modelo ya no existe.


## Cabeceras del portafolio

`portfolio/seo/headers.ts` es la única fuente: `vite preview` las sirve para las pruebas y el build las escribe en `dist/_headers` para Netlify.

- CSP sin scripts en línea ni `unsafe-eval`. Por eso los scripts de la pantalla de bienvenida y del 404 son archivos (`public/splash.js`, `public/404.js`). `style-src` admite `'unsafe-inline'` por los bloques `<style>` de `index.html` y los atributos `style` de React.
- `connect-src` permite `'self'` y `https://admin.hgsportafolio.site` (`CONTACT_ORIGIN` en `src/lib/endpoints.ts`), porque el formulario de contacto envía ahí. La misma constante alimenta el formulario y la política, así no se desalinean.
- Si `VITE_UMAMI_WEBSITE_ID` trae un UUID válido, la CSP abre solo los orígenes de Umami: `https://cloud.umami.is` en `script-src` y, en `connect-src`, además `https://gateway.umami.is` (adonde el script envía los eventos desde el commit `7837484`) y `https://api-gateway.umami.dev` (el host anterior). Sin UUID, la analítica está apagada y la CSP no abre nada.
- `nosniff`, `X-Frame-Options: DENY`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy`, COOP y HSTS.

`e2e/seo.spec.ts` comprueba que cada página envía la política y corre sin violaciones.

El admin tiene su propia política, más cerrada, y no se indexa.

## Formulario de contacto

El formulario del portafolio le escribe al admin (`POST https://admin.hgsportafolio.site/api/contact`), que manda los correos con Resend. Es la ruta del admin que atiende al público, y se protege así:

- **Origen:** solo acepta el portafolio, su dirección de Netlify y sus deploy previews; las cabeceras CORS solo se envían a esos orígenes.
- **Bots:** un campo trampa invisible y un tiempo mínimo de llenado. Los bots reciben la misma respuesta que una persona.
- **Límites:** tiene un tope de mensajes por dirección y por día.
- **Confirmación sin eco:** el correo al visitante nunca repite lo que escribió (ni el mensaje, ni un nombre que no parezca nombre), para que el formulario no sirva para mandar texto a desconocidos.


## Íconos SVG subidos desde el admin

Cada SVG se limpia antes del commit: se quitan scripts, manejadores `on*`, enlaces externos y `javascript:`, documentos incrustados y estilos con `@import` o URL externas, y se rechazan archivos de más de 25 KB (commit `2d942c4`). La CSP del portafolio ya bloquea scripts en línea; esto cierra el caso de alguien que abra el SVG directamente.


## security.txt

`portfolio/public/.well-known/security.txt` (RFC 9116) dice a quién avisar de un problema de seguridad. Tiene fecha de vencimiento: `tests/security-txt.test.ts` falla un mes antes, como recordatorio para renovarla.

## Dependencias

- Dependabot revisa cada semana `portfolio/`, `admin/` y las acciones de GitHub (ver [CI/CD](ci-cd.md)). Según el mensaje del commit `2d942c4`, las alertas de vulnerabilidades y los arreglos automáticos de seguridad de Dependabot están activados en `portfolio-hgs` (configuración de GitHub, fuera del código).
- **Vite 8.3.5** (commit `f3089f8`, 2026-10-21): el portafolio y el admin subieron a esa versión, que cerró las 12 alertas abiertas de Dependabot (servidor de desarrollo de Vite y `launch-editor`). Las ramas de Dependabot `.../vite-8.3.5` siguen en el remoto, ya sin PR abierto.

## Búsqueda de secretos

El escaneo de secretos de GitHub no está disponible en repos privados del plan gratuito, así que `.github/workflows/secret-scan.yml` corre gitleaks sobre todo el historial en cada push a `main` o `desarrollo` y en cada pull request. Si encuentra una clave o un token, el check falla y el valor sale tapado en el registro. Según el commit `2d942c4`, el historial actual sale limpio.

El mismo commit registra reglas de GitHub (fuera del código) que impiden borrar o reescribir con force-push la rama `main` en `DevCat-HGS` y `DevCat-HGS.github.io`.

## Qué código es público

El 2026-10-21 se revisó el historial de `portfolio-hgs` para ver si podía pasar a público. No hay credenciales (coincide con gitleaks), pero el historial guarda archivos que salieron del árbol y no deben publicarse, y GitHub conserva cada PR en referencias `refs/pull/*` que el dueño no puede borrar, así que reescribir el historial no basta.

Por eso este repositorio sigue privado y, desde el commit `5795692` (2026-10-22), el código del sitio se publica en un repositorio nuevo, `DevCat-HGS/hgsportafolio`: un espejo de solo lectura con historial propio, armado con una lista blanca que nunca incluye el admin, los datos del CV ni el perfil, y con una revisión final que aborta la publicación si se cuela una ruta privada. Detalle en [CI/CD](ci-cd.md).

La documentación sigue la misma idea: lo que se publica en `docs.hgsportafolio.site` es una edición que deja fuera cómo está hecho el admin.

### Regla para el código público

Solo se publica código propio. Los repos de clientes se quedan privados (ver [perfil de GitHub](perfil-github.md)). Los repos públicos de proyectos de formación se publican como copias nuevas en un solo commit, sin archivos `.env`, direcciones del servidor ni contraseñas, nunca cambiando la visibilidad del repo original, cuyo historial puede guardar credenciales.

## Lo que nunca llega al navegador

Los secretos solo los leen las funciones del servidor, y los archivos `.env` están en `.gitignore`; solo se versionan las plantillas `.env.example`, sin valores secretos.

