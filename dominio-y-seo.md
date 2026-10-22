---
titulo: Dominio, DNS y posicionamiento
seccion: Operación
resumen: El dominio hgsportafolio.site en Hostinger y Netlify, Search Console, sitemap, canonical, hreflang, datos estructurados y por qué Google aún no muestra el favicon.
orden: 10
---

## Dominio

- **Producción:** `https://hgsportafolio.site`, fijado en `portfolio/netlify.toml` como `VITE_SITE_URL`. De ahí salen canonical, `hreflang`, Open Graph, JSON-LD y sitemap.
- **Respaldo:** `portafolio-hgs.netlify.app` sigue abierto. No compite en Google porque cada página declara como canonical su versión en `hgsportafolio.site` (commit `8d5a3db`, que quitó la redirección 301 añadida en `73be47d`).
- **Admin:** `admin.hgsportafolio.site`, con un registro `CNAME` en Hostinger hacia `admin-hgs.netlify.app` (`admin/README.md`).
- **Documentación:** `docs.hgsportafolio.site`, con un registro `CNAME` en Hostinger hacia `DevCat-HGS.github.io`. El dominio lo fija el archivo `CNAME` que `publish-docs.yml` escribe en cada publicación, porque el workflow reemplaza toda la raíz del sitio.

El registrador y el DNS están en Hostinger. Los registros del dominio raíz hacia Netlify no están escritos en el repositorio (por confirmar en el panel de Hostinger).

### Registros para Resend

Para que salgan los correos, `hgsportafolio.site` debe estar verificado en Resend: Resend entrega unos registros DNS (normalmente SPF, DKIM y, opcional, DMARC) que se agregan en Hostinger. Esos registros no están en el repositorio; es un paso pendiente de Harol. Ver [configuración](configuracion.md).

## Search Console

`seo.json` → `site.verification` guarda dos códigos de verificación de Google Search Console, que se emiten como `<meta name="google-site-verification">` en cada página. Se editan en el admin, estación SEO. Sus valores no se copian aquí.

Search Console también alimenta el resumen semanal por correo del admin, si se configura una cuenta de servicio (ver [admin](admin.md)).

## Páginas e idiomas

| URL | Página |
| :-- | :-- |
| `/` | Portafolio en español |
| `/en/` | Portafolio en inglés |
| `/migozz/` | Caso MIGOZZ en español |
| `/en/migozz/` | Caso MIGOZZ en inglés |
| `/aria/` | Caso ARIA en español |
| `/en/aria/` | Caso ARIA en inglés |
| `/devpanel/` | Caso DevPanel en español |
| `/en/devpanel/` | Caso DevPanel en inglés |
| `/portafolio/` | Caso del propio portafolio en español |
| `/en/portafolio/` | Caso del propio portafolio en inglés |

`index.html` es la fuente HTML de la portada; cada caso de estudio tiene la suya (`migozz/index.html`, `aria/index.html`, `devpanel/index.html`, `portafolio/index.html`). `vite.config.ts` llena sus bloques marcados (`<!--seo-head-->`, `<!--seo-body-->`) para cada idioma y página. Cada página trae su head completo en el HTML estático, antes de que corra JavaScript, para que los buscadores y las vistas previas lo lean.

### Subpáginas genéricas

Desde el commit `b9d13b1` los casos de estudio no se programan uno por uno. `portfolio/seo/pages.ts` define:

- `SUBPAGE_IDS` (hoy `migozz`, `aria`, `devpanel` y `portafolio`; `PAGE_IDS` suma `home`): de esa lista salen el head, el JSON-LD, el sitemap, el texto de respaldo, las rutas del servidor de desarrollo y las entradas del build en `vite.config.ts`.
- `SUBPAGES`: por cada caso, sus textos (`migozzPages`, `ariaPages`, `devpanelPages` y `portafolioPages` en `seo.json`), el nombre corto para la miga de pan, el enlace del producto, de su cliente o de su código (`siteUrl`, que el texto de respaldo muestra como enlace), el nodo schema.org del producto y `relation`. En el caso `portafolio` el nombre es «Portafolio HGS» y `siteUrl` es `https://docs.hgsportafolio.site`: según el comentario de `pages.ts`, el código es privado y el registro público de cómo está hecho es la documentación.

`relation` (desde `90ff404`) dice cómo se relaciona Harol con el producto: `author` si es su proyecto propio (DevPanel y Portafolio) o `contributor` si trabajó en él con un equipo (MIGOZZ y ARIA). `structuredData()` en `seo/render.ts` usa ese valor como nombre de la propiedad que enlaza el producto con la `Person`.

Agregar un caso nuevo es, según el comentario de `pages.ts`, un id nuevo en `SUBPAGE_IDS`, su entrada en `SUBPAGES` y su propio `<id>/index.html`. Del lado de la página hacen falta además su `src/<id>.tsx`, su JSON y su carga en `src/content/` (ver [portafolio](portafolio.md)), sus textos en `seo.json`, su regla de idioma en `netlify.toml` y su estación en el admin, como hizo `90ff404` con DevPanel y `433174c` con Portafolio.

### Enfoque de los textos

Los títulos, descripciones y texto de respaldo salen de `portfolio/src/content/data/seo.json` (se editan en el admin, estación SEO). Desde `b9d13b1` el mensaje central es «llevo productos web y móviles a producción, con backend serverless e IA» (en inglés, «takes web and mobile products to production, with serverless backends and AI»), y la descripción de la portada menciona los casos MIGOZZ y ARIA. `tests/seo.test.ts` comprueba los largos de título y descripción.

## Lo que genera el build

Todo en `portfolio/seo/render.ts`, con pruebas en `portfolio/tests/seo.test.ts`:

- **Head:** título, descripción, canonical, `hreflang` para `es`, `en` y `x-default`, Open Graph (con `og:locale` y alternativo) y tarjeta para compartir (`og.png`, 1200 × 630).
- **Datos estructurados (JSON-LD):** `Person` (con `worksFor` MIGOZZ, `alumniOf` SENA y dirección en Medellín) y `SoftwareApplication` de MIGOZZ en todas las páginas. En la portada se suman `WebSite` y `ProfilePage`. En un caso de estudio, `WebPage` y `BreadcrumbList`; en ARIA y DevPanel, además, un `SoftwareApplication` propio, y en Portafolio un `WebApplication` («Portafolio HGS», en `es` y `en`, con `url` en la portada del sitio y `subjectOf` hacia un `TechArticle` «Documentación técnica» en `https://docs.hgsportafolio.site`). En ARIA, Arix Group es el creador y Harol colaborador (`contributor`). En DevPanel, Harol es el autor (`author`), y el nodo lleva categoría `DeveloperApplication`, sistema Windows, licencia MIT, enlace de descarga y el repositorio en `sameAs`. En Portafolio Harol también es `author`. Pruebas de `tests/seo.test.ts` comprueban que DevPanel tenga `author` y no `contributor`, y que el nodo del portafolio tenga `author` y `subjectOf.url` hacia la documentación.
- **Texto de respaldo:** lo que queda dentro de `#root` para buscadores y lectores sin JavaScript. En la portada lista todos los proyectos visibles con una línea (enlace al caso de estudio si lo tiene, si no al sitio del proyecto, si no a su código —desde `06a3e2b`—, si no solo el nombre) y enlaza a cada caso de estudio. Así un rastreador o una IA que lee el HTML sin ejecutar nada ve el mismo trabajo que un visitante.
- **Pantalla de carga:** el HTML estático ya trae «Bienvenido / Cargando…» o «Welcome / Loading…» según el idioma de la página (`localizeHtml`), porque es lo primero que lee un rastreador sin JavaScript. Antes salía en inglés en todas.
- **`sitemap.xml`:** las páginas de cada idioma, con sus alternativas de idioma y `lastmod`.
- **`robots.txt`:** permite todo y apunta al sitemap.

Si no hay dirección del sitio en el build (ni `VITE_SITE_URL` ni la variable `URL` de Netlify), las etiquetas que necesitan una dirección se omiten en vez de quedar vacías.

### Fecha del sitemap

`contentDate()` en `portfolio/vite.config.ts` toma la fecha del último commit que tocó contenido visible (`src`, `public`, `seo`, `index.html` y las carpetas de cada caso). Antes era la fecha del build; según el comentario del código, una fecha que cambia en cada despliegue enseña a Google a ignorarla. Si el build no tiene historial de git, `lastmod` se omite.

## Etiqueta de Umami

`umamiId()` en `portfolio/seo/headers.ts` toma de `VITE_UMAMI_WEBSITE_ID` solo el UUID del sitio. Así, si alguien pega en la variable el `<script>` completo que da Umami, la etiqueta sigue siendo válida en vez de romper el `<head>` de todas las páginas (commit `b7461ec`). Lo correcto sigue siendo dejar solo el UUID (ver [pendientes](pendientes.md)).

## Redirección por idioma

En `portfolio/netlify.toml`, `/` redirige con un 302 a `/en/` solo cuando el navegador pide inglés o tiene la cookie `nf_lang=en` (condición `Language = ["en"]`, que Netlify evalúa leyendo primero esa cookie). El botón de idioma fija la cookie, así la elección manual se mantiene. Los rastreadores no mandan idioma y reciben `/`, que es la versión en español.

Lo mismo pasa con `/migozz/` hacia `/en/migozz/`, con `/aria/` hacia `/en/aria/` (commit `574e51b`) con `/devpanel/` hacia `/en/devpanel/` (commit `90ff404`) y con `/portafolio/` hacia `/en/portafolio/` (commit `433174c`). Cada caso nuevo necesita su propia regla.

## Por qué Google muestra un globo y no el favicon

En los resultados de Google el sitio aparece con un globo genérico. El favicon está bien: `public/favicon.ico` (48 × 48), `favicon-192.png`, `favicon.svg` y `apple-touch-icon.png` existen y se declaran en el `<head>` de cada página (commit `4f652c0`). Google guarda y actualiza los favicones con un rastreador aparte y a su propio ritmo, así que el globo puede tardar días o semanas en cambiar después de que el ícono es correcto. No hace falta tocar el código; pedir la indexación de la portada en Search Console puede acelerarlo.

## Otros detalles

- `public/404.html` es la página de error que sirve Netlify.
- `public/.well-known/security.txt` publica el contacto de seguridad (ver [seguridad](seguridad.md)).
- El admin no se indexa: `X-Robots-Tag: noindex, nofollow` y `admin/public/robots.txt`.
