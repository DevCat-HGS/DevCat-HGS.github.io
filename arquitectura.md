---
titulo: Cómo está armado el repositorio
seccion: Arquitectura
resumen: Mapa de carpetas, tecnologías de cada pieza y el recorrido de un cambio desde el admin o un commit hasta el sitio en línea.
orden: 2
---

## Mapa de carpetas

| Carpeta o archivo | Contenido |
| :-- | :-- |
| `portfolio/` | Sitio web. `src/` (React), `src/content/data/*.json` (contenido), `seo/` (cabeceras, head, sitemap), `migozz/`, `aria/`, `devpanel/` y `portafolio/` (HTML de cada caso de estudio), `scripts/` (imágenes, Lighthouse, og.png, datos de GitHub), `tests/` (Vitest), `e2e/` (Playwright), `images/` (originales de imágenes), `public/` (archivos servidos). |
| `admin/` | Editor de contenido privado, con sus funciones serverless. No va al espejo público. |
| `curriculum/` | `cv_data.json` (fuente del CV), `generate_cv.py`, `fonts/` (Inter), `output/` (PDF versionados). |
| `profile/` | SVG del README del perfil (`banner.svg`, `languages.svg`, `languages.es.svg`). |
| `privacity/` | Lista elegida de repos privados para el README del perfil (`featured.json`) y su script. |
| `scripts/` | `generate_language_charts.py`, que dibuja las gráficas de lenguajes del perfil. |
| `linkedin/` | Guía, plantillas HTML, PNG exportados y `exportar.mjs`. |
| `.github/` | Workflows, `dependabot.yml`, plantilla de pull request y `mirror/` (lista blanca y README del espejo público del código). |
| `.claude/agents/` | Agentes de Claude Code del proyecto (`documentador.md`, `rrhh-estricto.md`). |
| `release-please-config.json`, `.release-please-manifest.json` | Configuración de Release Please. |
| `Doc/` | Esta documentación y su generador `build.mjs`; su edición pública se publica en `DevCat-HGS.github.io`, servido en `https://docs.hgsportafolio.site`. |


## Tecnologías

| Pieza | Tecnologías (versiones en su `package.json` o `requirements.txt`) |
| :-- | :-- |
| Portafolio | React 19, TypeScript, Vite, `motion` (solo en la página de MIGOZZ), fuente Archivo autoalojada, `sharp` para imágenes, Vitest, Playwright con axe, Lighthouse, ESLint y Prettier. |
| Admin | React 19, TypeScript y Vite, sin librerías de interfaz. Funciones serverless en Netlify, una de ellas programada; Resend para correos; Umami Cloud y Search Console para el resumen semanal. El portafolio no tiene funciones. |
| Hoja de vida | Python 3 con ReportLab. |
| Perfil | Python sin dependencias externas (`urllib`), API REST de GitHub. |


## Dos sitios de Netlify

- `portafolio-hgs` construye `portfolio/` con `portfolio/netlify.toml` (`npm run images && npm run build`, publica `dist`).
- `admin-hgs` construye `admin/` y solo se reconstruye cuando cambia esa carpeta, no con cada cambio de contenido.

Van separados para que el admin tenga su propia política de seguridad y no se republique con cada cambio de contenido.


## Cómo fluye un cambio

### Desde el admin

1. Harol entra en `admin.hgsportafolio.site` con dos factores.
2. El admin lee los JSON de `main` a través de una función del servidor, que guarda el token de GitHub.
3. Al publicar, hace un solo commit en `main` con todos los archivos e imágenes.
4. El push a `main` dispara:
   - el deploy de Netlify del portafolio, cuyo build corre `npm run images` (convierte originales a WebP) y `tsc --noEmit` (valida la forma de cada JSON);
   - `Curriculum`, que regenera los PDF y hace commit si cambiaron;
   - `Images`, si hay originales nuevos en `portfolio/images/`, que commitea los WebP y lanza `Portfolio CI`;
   - `Portfolio CI`, si cambió algo en `portfolio/**`.
5. El admin sigue las ejecuciones de Actions de ese commit.


Si un JSON tiene la forma equivocada, el typecheck falla y Netlify no publica esa versión: el sitio se queda con la anterior. Que un check de GitHub Actions bloquee o no el deploy de Netlify depende de la configuración del panel de Netlify, que no está en el repositorio (por confirmar).

### Desde un commit

Un cambio de código sigue el mismo camino. En un pull request, además, Netlify publica un deploy preview por sitio y `preview-comment.yml` deja un comentario con el enlace. Ver [CI/CD](ci-cd.md).

### Un mensaje del formulario

El formulario del portafolio envía JSON a `https://admin.hgsportafolio.site/api/contact`. Una función del admin lo filtra, lo guarda y envía dos correos por Resend: la copia a Harol y la confirmación al visitante. El portafolio sigue siendo estático; por eso su CSP permite conectarse al dominio del admin.


### El resumen semanal

Cada lunes a las 8:00 de Bogotá, Netlify corre una función programada en el sitio del admin: lee la semana anterior en Umami Cloud y Search Console y envía un correo por Resend. No depende de ningún commit.


### El perfil de GitHub

Va por un camino aparte: `Metrics` y `Privacity` actualizan `README.md`, `README.es.md` y las gráficas en este repo, y `Publish profile` copia esos archivos al repositorio público `DevCat-HGS/DevCat-HGS`. Ver [perfil de GitHub](perfil-github.md).

### El espejo del código

Cada push a `main` que toque el sitio corre `Publish code`, que copia una lista blanca de archivos (`portfolio/`, seis workflows y un README propio) al repositorio público `DevCat-HGS/hgsportafolio`. Ese es el código que enlazan los botones «Ver código» del caso y de la franja del portafolio. Ver [CI/CD](ci-cd.md).
