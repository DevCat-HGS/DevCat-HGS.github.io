---
titulo: Dominio, DNS y posicionamiento
seccion: Operación
resumen: El dominio hgsportafolio.site en Hostinger y Netlify, Search Console, sitemap, canonical, hreflang y datos estructurados.
orden: 10
---

## Dominio

- **Producción:** `https://hgsportafolio.site`, fijado en `portfolio/netlify.toml` como `VITE_SITE_URL`. De ahí salen canonical, `hreflang`, Open Graph, JSON-LD y sitemap.
- **Respaldo:** `portafolio-hgs.netlify.app` sigue abierto. No compite en Google porque cada página declara como canonical su versión en `hgsportafolio.site` (commit `8d5a3db`, que quitó la redirección 301 añadida en `73be47d`).
- **Admin:** `admin.hgsportafolio.site`, con un registro `CNAME` en Hostinger hacia `admin-hgs.netlify.app` (`admin/README.md`).

El registrador y el DNS están en Hostinger. Los registros del dominio raíz hacia Netlify no están escritos en el repositorio (por confirmar en el panel de Hostinger).

### Registros para Resend

Para que salgan los correos, `hgsportafolio.site` debe estar verificado en Resend: Resend entrega unos registros DNS (normalmente SPF, DKIM y, opcional, DMARC) que se agregan en Hostinger. Esos registros no están en el repositorio; es un paso pendiente de Harol. Ver [configuración](configuracion.md).

## Search Console

`seo.json` → `site.verification` guarda dos códigos de verificación de Google Search Console, que se emiten como `<meta name="google-site-verification">` en cada página. Se editan en el admin, estación SEO. Sus valores no se copian aquí.

## Páginas e idiomas

| URL | Página |
| :-- | :-- |
| `/` | Portafolio en español |
| `/en/` | Portafolio en inglés |
| `/migozz/` | Caso MIGOZZ en español |
| `/en/migozz/` | Caso MIGOZZ en inglés |

`index.html` es la única fuente HTML del portafolio. `vite.config.ts` llena sus bloques marcados (`<!--seo-head-->`, `<!--seo-body-->`) para cada idioma y página. Cada página trae su head completo en el HTML estático, antes de que corra JavaScript, para que los buscadores y las vistas previas lo lean.

Los textos de título, descripción y respaldo salen de `portfolio/src/content/data/seo.json` (`pages` y `migozzPages`), a través de `portfolio/seo/pages.ts`.

## Lo que genera el build

Todo en `portfolio/seo/render.ts`, con pruebas en `portfolio/tests/seo.test.ts`:

- **Head:** título, descripción, canonical, `hreflang` para `es`, `en` y `x-default`, Open Graph (con `og:locale` y alternativo) y tarjeta para compartir (`og.png`, 1200 × 630).
- **Datos estructurados (JSON-LD):** `Person` (con `worksFor` MIGOZZ, `alumniOf` SENA y dirección en Medellín), `SoftwareApplication` (MIGOZZ con sus dos tiendas), `WebSite` y `ProfilePage`; en la página de MIGOZZ, `WebPage` y `BreadcrumbList`.
- **`sitemap.xml`:** las páginas de cada idioma, con `lastmod`.
- **`robots.txt`:** permite todo y apunta al sitemap.

Si no hay dirección del sitio en el build (ni `VITE_SITE_URL` ni la variable `URL` de Netlify), las etiquetas que necesitan una dirección se omiten en vez de quedar vacías.

## Redirección por idioma

Quien llega por primera vez con el navegador en inglés va a `/en/` (o `/en/migozz/`) con un 302. El botón de idioma fija la cookie `nf_lang`, que Netlify lee antes, así la elección manual se mantiene. Los rastreadores reciben `/`.

## Otros detalles

- `public/favicon.ico` real y nombre del sitio consistente para Google (commit `4f652c0`).
- `public/404.html` es la página de error que sirve Netlify.
- El admin no se indexa: `X-Robots-Tag: noindex, nofollow` y `admin/public/robots.txt`.
