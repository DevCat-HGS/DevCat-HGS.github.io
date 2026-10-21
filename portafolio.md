---
titulo: El portafolio por dentro
seccion: Portafolio
resumen: Secciones del sitio, componentes, contenido en JSON y su validación, idiomas, la página de MIGOZZ, imágenes y pruebas.
orden: 3
---

El portafolio es una sola página bilingüe en React 19 + TypeScript + Vite, sin librerías de interfaz. El diseño sigue una línea del metro de Medellín que recorre la página: una estación por capítulo (`portfolio/README.md`).

## Secciones

`portfolio/src/App.tsx` solo compone: hooks y un componente por sección, en este orden.

| # | Capítulo (`chapters` en `site.json`) | Componente |
| :-- | :-- | :-- |
| 01 | Inicio | `Hero.tsx` (con `LineArt.tsx`) |
| 02 | Oficio | `Practice.tsx` (retrato, bento y marquesina) |
| 03 | Startup | `Startup.tsx` (MIGOZZ y botón al caso) |
| 04 | Cargo | `Tenure.tsx` (cargo anterior) |
| 05 | Proyectos | `Projects.tsx` (dos destacados y el resto tras «ver más») |
| 06 | Credenciales | `Credentials.tsx` y `Lightbox.tsx` (carga diferida) |
| 07 | Stack | `Stack.tsx` (acordeón por grupo) |
| 08 | Cierre | `Close.tsx` con `ContactForm.tsx`, `Socials.tsx` y `GithubStats.tsx` |

`Nav.tsx` es el mapa de la línea con el cambio de idioma. Los ids de los capítulos están en `CHAPTER_IDS` (`src/content/types.ts`) y una prueba comprueba que el menú los sigue en orden.

`GithubStats.tsx` muestra repos públicos, lenguajes y último push desde `src/data/github.json`, y se oculta mientras haya menos de 3 repos públicos (`MIN_REPOS`).

## Contenido en JSON

Todo el texto visible vive en `portfolio/src/content/data/`:

| Archivo | Qué contiene | Quién lo lee |
| :-- | :-- | :-- |
| `site.json` | Textos del sitio en `es` y `en`, incluidos `credGroups` y `stackGroups` | `content/es.ts`, `content/en.ts` |
| `projects.json` | Proyectos (campos comunes y textos por idioma) | `content/projects.ts` |
| `stack.json` | Tecnologías e íconos por grupo | `content/stack.ts` |
| `migozz.json` | Página del caso MIGOZZ | `content/migozz.ts` |
| `migozz-public.json` | Versiones de la App Store y comunidad de creadores destacados | `content/migozzPublic.ts` |
| `migozz-users.json` | Cifras de usuarios de MIGOZZ (ocultas mientras `visible` sea `false`) | `content/migozzUsers.ts` |
| `seo.json` | Identidad del sitio, enlaces, códigos de Search Console y textos de cada página | `seo/pages.ts` |

### Validación

JSON pierde los tipos literales, así que `checked()` en `src/content/json.ts` compara cada archivo con una copia «ensanchada» del tipo real (`Widen<T>`). Una clave que falta o está mal escrita hace fallar `tsc` y, por tanto, el build. Así un dato roto nunca llega a publicarse.

`projects.ts` normaliza las entradas: el admin puede dejar campos opcionales como `""` o `null`, y `projectsFrom()` los quita antes de llegar a los componentes. `hidden: true` deja el proyecto en el archivo pero fuera del sitio; `featured: true` lo pone entre los destacados.

Las pruebas de `tests/content.test.ts` añaden: misma estructura en los dos idiomas, ningún texto vacío, ids de proyectos iguales en ambos idiomas, enlaces solo `https`, y que existan las imágenes, íconos y PDF referenciados.

## Idiomas

- Español en `/` y inglés en `/en/`: dos páginas estáticas con su propio título, descripción, canonical, `hreflang`, Open Graph, datos estructurados y texto de respaldo.
- La URL decide el idioma (`useLocale`, `public/splash.js` y el build usan la misma regla). El botón cambia sin recargar y actualiza la dirección.
- `portfolio/netlify.toml` redirige (302) a `/en/` a quien llega por primera vez con el navegador en inglés. El botón de idioma fija la cookie `nf_lang`, que Netlify lee antes que el idioma del navegador. Los rastreadores no mandan idioma y reciben `/`.

## Página de MIGOZZ

`/migozz/` y `/en/migozz/` son una segunda entrada de Vite (`portfolio/migozz/index.html`, `src/migozz.tsx`, `src/MigozzPage.tsx`). Tiene portada animada, cifras públicas con su fuente, gráficas (`components/migozz/UserCharts.tsx`), flujo de uso (`Flow.tsx`), problema, funciones, cronología, capturas y el rol de Harol. Usa `motion` para las animaciones.

Desde el commit `fc4b004` sigue la identidad actual de la marca: fondo blanco, morado como color principal y fucsia de acento, con contraste AA.

- Las gráficas de usuarios solo aparecen con `visible: true` en `migozz-users.json`, para no mostrar cifras inventadas.
- `shots` en `migozz.json` está vacío hoy, así que la sección de capturas no aparece.

## Imágenes

Los originales van en `portfolio/images/<tipo>/` y `npm run images` (`scripts/images.mjs`, con `sharp`) escribe los WebP en `public/`:

| Carpeta de originales | Salida |
| :-- | :-- |
| `images/shots/` | `public/shots/<nombre>.webp` (960 px) y `-480.webp` |
| `images/credentials/` | `public/credentials/<nombre>.webp` (1100 px), `thumb/<nombre>.webp` (560) y `thumb/<nombre>-360.webp` |
| `images/migozz/` | `public/migozz/<nombre>.webp` (780 px) |
| `images/portrait/` | `public/portrait/<nombre>.webp` (cuadrado, hasta 600 px) |

Los certificados (fotos de celular) pasan antes por un filtro de mediana. Los presupuestos de peso están en `tests/assets.test.ts`. El build de Netlify corre `npm run images` antes de compilar, así una imagen subida desde el admin se sirve aunque el commit del workflow `Images` aún no haya llegado.

`src/lib/asset.ts` arma rutas absolutas desde la raíz, porque la página en inglés vive un nivel más abajo. La tarjeta para compartir (`public/og.png`) se genera desde `scripts/og-template.html`.

## Formulario de contacto

`ContactForm.tsx` envía JSON a `https://admin.hgsportafolio.site/api/contact` (`src/lib/endpoints.ts`). El portafolio no tiene funciones de Netlify propias: guardar el mensaje y enviar los correos lo hace el admin. Además de nombre, correo y mensaje, manda el idioma de la página, un campo trampa invisible (`website`) y el tiempo de llenado (`elapsed`). La CSP permite esa conexión (`seo/headers.ts`). Detalle en [correos](correos.md).

## Analítica

Umami Cloud, sin cookies, por eso no hace falta aviso de consentimiento (comentario de `seo/headers.ts`). Está apagada mientras `VITE_UMAMI_WEBSITE_ID` esté vacía. Con un valor, el build agrega el script de `cloud.umami.is` con `data-domains` del dominio de producción, así los previews y `localhost` no cuentan (`vite.config.ts`), y la CSP abre los orígenes de Umami.

Eventos que ya se registran (atributos `data-umami-event` y llamadas a `umami.track`):

| Evento | Dónde | Cuándo |
| :-- | :-- | :-- |
| `cv-download` | `Socials.tsx` | Clic en descargar el CV. |
| `social-<red>` | `Socials.tsx` | Clic en una red social (nombre de la red en minúsculas). |
| `project-<id>` | `Projects.tsx` | Clic en un proyecto con enlace. |
| `migozz-play`, `migozz-appstore` | `Startup.tsx` | Clic en Google Play o App Store de MIGOZZ. |
| `migozz-case` | `Startup.tsx` | Clic en el botón al caso de MIGOZZ. |
| `contact` | `ContactForm.tsx` | Clic en enviar el formulario. |
| `contact-sent` | `ContactForm.tsx` | El mensaje se envió bien (`window.umami.track`). |

Para activarla: crear el sitio en `cloud.umami.is` (Add website), copiar su Website ID, ponerlo como `VITE_UMAMI_WEBSITE_ID` en el sitio `portafolio-hgs` de Netlify y volver a desplegar, porque se lee al construir. Ver [configuración](configuracion.md).

## Estilos

`src/styles/index.css` importa un archivo por sección en orden de cascada; los últimos refinan a los primeros. El desenfoque `backdrop-filter` solo se usa con puntero fino en pantallas anchas (`glass-touch.css` lo cambia por fondos opacos en táctiles). Hay modo de alto contraste (`contrast.css`) y hoja de impresión (`print.css`). Las animaciones se apagan con `prefers-reduced-motion`.

## Comandos

```bash
cd portfolio
npm install
npm run dev              # http://localhost:5173
npm run build            # typecheck + build en dist/
npm run check            # typecheck, lint, formato y pruebas
npm run e2e              # axe y teclado contra el build
npm run lighthouse       # mediana de varias corridas contra los presupuestos
npm run images           # originales → WebP
```

Requiere Node 20.19 o superior; CI usa Node 22.

## Pruebas

| Archivo | Qué comprueba |
| :-- | :-- |
| `tests/content.test.ts` | Integridad del contenido (ver arriba). |
| `tests/assets.test.ts` | Peso de capturas, certificados, íconos, capturas de MIGOZZ y retrato. |
| `tests/seo.test.ts` | Títulos por idioma, canonical, `hreflang`, Open Graph y JSON-LD. |
| `tests/github-data.test.ts` | Forma de `src/data/github.json`. |
| `tests/contact-email.test.ts` | Lógica del formulario en el admin (`admin/netlify/lib/contact.ts`): correos, descarte de bots, límites y orígenes permitidos. |
| `tests/admin-auth.test.ts` | Reglas de entrada del admin y lista de llamadas a GitHub permitidas. |
| `e2e/a11y.spec.ts` | Sin violaciones WCAG A/AA con axe, en ES y EN, móvil y escritorio, y en MIGOZZ. |
| `e2e/keyboard.spec.ts` | Enlace de salto, nombres accesibles, foco del visor de certificados, cambio de idioma. |
| `e2e/features.spec.ts` | Envío del formulario (JSON a la función del admin, simulada), modo de alto contraste e impresión. |
| `e2e/seo.spec.ts` | Idioma por URL, rutas de recursos, head estático y política de seguridad sin violaciones. |
| `e2e/screenshots.spec.ts` | Capturas por sección para el comentario del PR. |

Los presupuestos de Lighthouse están en `scripts/lighthouse.mjs`: móvil rendimiento 0.90, escritorio 0.95, accesibilidad 1, buenas prácticas y SEO 0.95. Cada corrida fallida se reintenta hasta 3 veces.
