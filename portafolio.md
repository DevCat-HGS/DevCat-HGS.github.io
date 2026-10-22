---
titulo: El portafolio por dentro
seccion: Portafolio
resumen: Secciones del sitio, componentes, contenido en JSON y su validación, idiomas, los casos MIGOZZ, ARIA y DevPanel, la franja de DevPanel, imágenes y pruebas.
orden: 3
---

El portafolio es una página principal bilingüe en React 19 + TypeScript + Vite, sin librerías de interfaz, más tres casos de estudio (MIGOZZ, ARIA y DevPanel). El diseño sigue una línea del metro de Medellín que recorre la página: una estación por capítulo (`portfolio/README.md`).

## Secciones

`portfolio/src/App.tsx` solo compone: hooks y un componente por sección, en este orden.

| # | Capítulo (`chapters` en `site.json`) | Componente |
| :-- | :-- | :-- |
| 01 | Inicio | `Hero.tsx` (con `LineArt.tsx`) |
| 02 | Oficio | `Practice.tsx` (retrato, bento y marquesina) |
| 03 | Startup | `Startup.tsx` (MIGOZZ y botón al caso) |
| 04 | Cargo | `Tenure.tsx` (cargo anterior) |
| 05 | Proyectos | `Projects.tsx` (los marcados `featured` y el resto tras «ver más») |
| — | (sin capítulo) | `SideProject.tsx` (franja de DevPanel, ver abajo) |
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
| `aria.json` | Página del caso ARIA | `content/aria.ts` |
| `devpanel.json` | Página del caso DevPanel | `content/devpanel.ts` |
| `seo.json` | Identidad del sitio, enlaces, códigos de Search Console y textos de cada página | `seo/pages.ts` |

### Validación

JSON pierde los tipos literales, así que `checked()` en `src/content/json.ts` compara cada archivo con una copia «ensanchada» del tipo real (`Widen<T>`). Una clave que falta o está mal escrita hace fallar `tsc` y, por tanto, el build. Así un dato roto nunca llega a publicarse.

`projects.ts` normaliza las entradas: el admin puede dejar campos opcionales como `""` o `null`, y `projectsFrom()` los quita antes de llegar a los componentes. `hidden: true` deja el proyecto en el archivo pero fuera del sitio; `featured: true` lo pone entre los destacados.

### Campos `case` y `code` de un proyecto

Dos campos opcionales de `projects.json`, agregados el 2026-10-21:

| Campo | Qué guarda | Qué muestra la tarjeta |
| :-- | :-- | :-- |
| `case` | Id del caso de estudio en el sitio (hoy `"aria"` y `"devpanel"`). `projectsFrom()` lo convierte en `/<id>/` o `/en/<id>/` según el idioma. | Enlace «Ver el caso completo» / «Read the case study». |
| `code` | URL de un repositorio público. Solo código propio, nunca de un cliente (comentario de `ProjectEntry` y ayuda del campo en el admin). Hoy lo usan SENA Cloud, SensoresAPP y DevPanel. | Enlace «Ver código» / «View code», que abre en otra pestaña. |

Antes toda tarjeta con sitio en línea era un enlace completo. Un enlace no puede contener otros enlaces, así que una tarjeta con caso o con código pasa a ser un `<article>` con enlaces separados (sitio, caso, código); las demás siguen siendo un enlace completo (`ProjectCard` en `components/Projects.tsx`, commit `94f0f6a`).

Las pruebas de `tests/content.test.ts` añaden: misma estructura en los dos idiomas, ningún texto vacío, ids de proyectos iguales en ambos idiomas, enlaces solo `https`, y que existan las imágenes, íconos y PDF referenciados.

## Idiomas

- Español en `/` y inglés en `/en/`: dos páginas estáticas con su propio título, descripción, canonical, `hreflang`, Open Graph, datos estructurados y texto de respaldo.
- La URL decide el idioma (`useLocale`, `public/splash.js` y el build usan la misma regla). El botón cambia sin recargar y actualiza la dirección.
- `portfolio/netlify.toml` redirige (302) `/` a `/en/`, `/migozz/` a `/en/migozz/`, `/aria/` a `/en/aria/` y `/devpanel/` a `/en/devpanel/` solo si el navegador pide inglés o tiene la cookie `nf_lang=en`. El botón de idioma fija esa cookie, que Netlify lee antes que el idioma del navegador. Los rastreadores no mandan idioma y reciben la versión en español. La regla de `/aria/` llegó en `574e51b` y la de `/devpanel/` en `90ff404` (ver [dominio y SEO](dominio-y-seo.md)).

## Casos de estudio

### MIGOZZ

`/migozz/` y `/en/migozz/` son una segunda entrada de Vite (`portfolio/migozz/index.html`, `src/migozz.tsx`, `src/MigozzPage.tsx`). Tiene portada animada, cifras públicas con su fuente, gráficas (`components/migozz/UserCharts.tsx`), flujo de uso (`Flow.tsx`), problema, funciones, cronología, capturas y el rol de Harol. Usa `motion` para las animaciones.

Desde el commit `fc4b004` sigue la identidad actual de la marca: fondo blanco, morado como color principal y fucsia de acento, con contraste AA.

- Las gráficas de usuarios solo aparecen con `visible: true` en `migozz-users.json`, para no mostrar cifras inventadas.
- `shots` en `migozz.json` está vacío hoy, así que la sección de capturas no aparece.

### Plantilla compartida de los casos

Desde el commit `90ff404`, ARIA y DevPanel usan la misma página: `src/CaseStudyPage.tsx`, con los tipos en `src/content/caseStudy.ts` (`CaseCopy`) y los estilos en `src/styles/case-study.css`. Antes eran `AriaPage.tsx` y `aria.css`. MIGOZZ sigue con su página propia.

Cada caso tiene:

| Pieza | ARIA | DevPanel |
| :-- | :-- | :-- |
| HTML (entrada de Vite) | `portfolio/aria/index.html` | `portfolio/devpanel/index.html` |
| Entrada de React | `src/aria.tsx` | `src/devpanel.tsx` |
| Textos (es y en) | `src/content/data/aria.json` | `src/content/data/devpanel.json` |
| Carga y validación | `src/content/aria.ts` | `src/content/devpanel.ts` |
| Estación del admin | ARIA | DevPanel |

La entrada solo monta `<CaseStudyPage name=… copy=… titles=… />`. El título de pestaña es el mismo de los resultados de búsqueda (`seo.json` → `ariaPages` o `devpanelPages`). No usa `motion` ni pantalla de carga.

Secciones de la plantilla, en orden: portada, cifras con su nota de contexto, problema y solución, capturas, la arquitectura como dos líneas de metro con su estación de transbordo, decisiones, lo que se rompió, la parte de Harol, lo que falta y el stack. Tres campos de `CaseCopy` son opcionales:

- `links`: botones en la portada (etiqueta, enlace y nombre del evento de Umami).
- `shotsTitle` y `shots`: capturas bajo `public/`; la plantilla usa también la variante `-480.webp` que está al lado. Sin capturas, la sección no aparece.
- `teamNote`: quién hizo qué, cuando el proyecto fue de equipo. ARIA la tiene; DevPanel no.

Agregar un caso nuevo exige también su entrada en la capa SEO (ver [dominio y SEO](dominio-y-seo.md)).

### ARIA

`/aria/` y `/en/aria/` (commit `b9d13b1`). ARIA es un asistente de soporte SAP hecho en equipo para Arix Group. Sus dos líneas de metro son la consulta y la ingesta diaria. La nota del admin para esta estación pide solo cifras medidas y nada de IDs de AWS, URLs internas ni nombres del equipo.

### DevPanel

`/devpanel/` y `/en/devpanel/` (commit `90ff404`). DevPanel es una app de escritorio de código abierto de Harol, para Windows: repos de GitHub, proyectos locales y herramientas en un panel con entrada por rostro. Su página tiene enlaces en la portada al código y a la descarga (eventos `devpanel-code` y `devpanel-download`), tres capturas (`shots/devpanel.webp`, `devpanel-lock.webp`, `devpanel-tools.webp`) y dos líneas de metro: instalación y uso diario. No tiene nota de equipo. La nota del admin pide solo cifras que se puedan comprobar en el repositorio de DevPanel.

Las capturas salen de las pruebas e2e del propio DevPanel, con datos de prueba (mensaje del commit `06a3e2b`). Están directamente en `portfolio/public/shots/`, cada una con su variante `-480.webp`.

### Franja de DevPanel en la portada

`src/components/SideProject.tsx` (estilos en `src/styles/side-project.css`) es una franja oscura justo después de Proyectos, con el ancla `#devpanel`. No es un capítulo de la línea: no está en `CHAPTER_IDS` ni en el menú. Sus textos están en `site.json`, clave `sideProject` (antetítulo, título, frase, tres puntos, etiquetas y la captura), y se editan en la estación «Textos del sitio» del admin, en el grupo «Otros textos» (`admin/src/components/Fields.tsx` junta ahí las claves que `schema.ts` no asigna a ningún grupo).

Tiene tres enlaces:

| Enlace | Destino | Evento de Umami |
| :-- | :-- | :-- |
| Ver el caso | `sideProject.caseHref` (`/devpanel/` o `/en/devpanel/`) | `case-devpanel` |
| Código | `DEVPANEL_LINKS.code` | `devpanel-code` |
| Descargar para Windows | `DEVPANEL_LINKS.download` (release `installer` del repositorio) | `devpanel-download` |

`DEVPANEL_LINKS` vive en `src/content/devpanel.ts`; las direcciones del código y de la descarga no se editan en el admin desde la franja (los enlaces de la portada del caso sí, en `devpanel.json`).

### Tarjeta de ARIA

La tarjeta de ARIA en `projects.json` se corrigió el mismo día: dice S3 Vectors en vez de OpenSearch (que el proyecto no usó), cambia el resultado «Escalamiento humano incluido» (que no se construyó) por un tiempo de respuesta medido, describe la parte de Harol en el equipo y enlaza al caso con `case: "aria"`. OpenSearch también salió del stack del sitio (`stack.json`, el texto de `site.json` y su ícono) en el commit `8bbfdbf`.

### Tarjeta de DevPanel

Desde `06a3e2b`, DevPanel es un proyecto destacado (`featured: true`) en `projects.json`, con la captura `shots/devpanel.webp`, enlace a su código (`code`) y, desde `90ff404`, a su caso (`case: "devpanel"`). El mensaje del commit explica por qué: es el código público más sólido de Harol.

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
| `case-<id>` | `Projects.tsx` | Clic en «Ver el caso completo» de una tarjeta. |
| `case-devpanel` | `SideProject.tsx` | Clic en «Ver el caso» de la franja de DevPanel (mismo nombre que el de su tarjeta). |
| `devpanel-code`, `devpanel-download` | `SideProject.tsx` y portada del caso DevPanel | Clic en el código o en la descarga de DevPanel. |
| `code-<id>` | `Projects.tsx` | Clic en «Ver código» de una tarjeta. |
| `migozz-play`, `migozz-appstore` | `Startup.tsx` | Clic en Google Play o App Store de MIGOZZ. |
| `migozz-case` | `Startup.tsx` | Clic en el botón al caso de MIGOZZ. |
| `contact` | `ContactForm.tsx` | Clic en enviar el formulario. |
| `contact-sent` | `ContactForm.tsx` | El mensaje se envió bien (`window.umami.track`). |

`umamiId()` (`seo/headers.ts`) extrae de la variable solo el UUID, así que un fragmento `<script>` pegado completo no rompe el `<head>`.

Para activarla: crear el sitio en `cloud.umami.is` (Add website), copiar su Website ID (solo el UUID), ponerlo como `VITE_UMAMI_WEBSITE_ID` en el sitio `portafolio-hgs` de Netlify y volver a desplegar, porque se lee al construir. Ver [configuración](configuracion.md).

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
| `tests/seo.test.ts` | Títulos por idioma, canonical, `hreflang`, Open Graph, JSON-LD, sitemap, texto de respaldo y páginas de ARIA y DevPanel (en DevPanel, que Harol figure como `author` y no como `contributor`). |
| `tests/github-data.test.ts` | Forma de `src/data/github.json`. |
| `tests/contact-email.test.ts` | Lógica del formulario en el admin (`admin/netlify/lib/contact.ts`): correos, descarte de bots, límites y orígenes permitidos. |
| `tests/admin-auth.test.ts` | Reglas de entrada del admin y lista de llamadas a GitHub permitidas. |
| `tests/digest.test.ts` | Resumen semanal del admin (`admin/netlify/lib/digest.ts`): rango de fechas, lectura de Umami y Search Console, y el correo. |
| `tests/security-txt.test.ts` | `public/.well-known/security.txt` tiene contacto y dirección canónica, y falla un mes antes de que venza. |
| `e2e/a11y.spec.ts` | Sin violaciones WCAG A/AA con axe, en ES y EN, móvil y escritorio, en la portada, MIGOZZ, ARIA y DevPanel. |
| `e2e/keyboard.spec.ts` | Enlace de salto, nombres accesibles, foco del visor de certificados, cambio de idioma. |
| `e2e/features.spec.ts` | Envío del formulario (JSON a la función del admin, simulada), modo de alto contraste e impresión. |
| `e2e/seo.spec.ts` | Idioma por URL, rutas de recursos, head estático y política de seguridad sin violaciones. |
| `e2e/screenshots.spec.ts` | Capturas por sección para el comentario del PR. |

Los presupuestos de Lighthouse están en `scripts/lighthouse.mjs`: móvil rendimiento 0.90, escritorio 0.95, accesibilidad 1, buenas prácticas y SEO 0.95. Cada corrida fallida se reintenta hasta 3 veces.
