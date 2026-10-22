---
titulo: El portafolio por dentro
seccion: Portafolio
resumen: Secciones del sitio, componentes, contenido en JSON y su validación, idiomas, los casos MIGOZZ, ARIA, DevPanel y Portafolio, los proyectos propios y los de clientes, imágenes y pruebas.
orden: 3
---

El portafolio es una página principal bilingüe en React 19 + TypeScript + Vite, sin librerías de interfaz, más cuatro casos de estudio (MIGOZZ, ARIA, DevPanel y el propio portafolio). El diseño sigue una línea del metro de Medellín que recorre la página: una estación por capítulo (`portfolio/README.md`).

## Secciones

`portfolio/src/App.tsx` solo compone: hooks y un componente por sección, en este orden.

| # | Capítulo (`chapters` en `site.json`) | Componente |
| :-- | :-- | :-- |
| 01 | Inicio | `Hero.tsx` (con `LineArt.tsx`) |
| 02 | Oficio | `Practice.tsx` (retrato, bento y marquesina) |
| 03 | Startup | `Startup.tsx` (MIGOZZ y botón al caso) |
| 04 | Cargo | `Tenure.tsx` (cargo anterior) |
| 05 | Proyectos | `Projects.tsx`: primero «Proyectos propios» (una franja `OwnProject` por cada uno) y después «Para clientes e instituciones» (`ProjectCard`: los `featured` y el resto tras «ver más»). Ver abajo. |
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
| `projects.json` | Proyectos propios y de clientes (campos comunes y textos por idioma) | `content/projects.ts` |
| `stack.json` | Tecnologías e íconos por grupo | `content/stack.ts` |
| `migozz.json` | Página del caso MIGOZZ | `content/migozz.ts` |
| `migozz-public.json` | Versiones de la App Store y comunidad de creadores destacados | `content/migozzPublic.ts` |
| `migozz-users.json` | Cifras de usuarios de MIGOZZ (ocultas mientras `visible` sea `false`) | `content/migozzUsers.ts` |
| `aria.json` | Página del caso ARIA | `content/aria.ts` |
| `devpanel.json` | Página del caso DevPanel | `content/devpanel.ts` |
| `portafolio.json` | Página del caso del propio portafolio | `content/portafolio.ts` |
| `seo.json` | Identidad del sitio, enlaces, códigos de Search Console y textos de cada página | `seo/pages.ts` |

### Validación

JSON pierde los tipos literales, así que `checked()` en `src/content/json.ts` compara cada archivo con una copia «ensanchada» del tipo real (`Widen<T>`). Una clave que falta o está mal escrita hace fallar `tsc` y, por tanto, el build. Así un dato roto nunca llega a publicarse.

`projects.ts` normaliza las entradas: el admin puede dejar campos opcionales como `""` o `null`, y `projectsFrom()` los quita antes de llegar a los componentes. `hidden: true` deja el proyecto en el archivo pero fuera del sitio; `featured: true` lo pone entre los destacados; `own: true` lo saca de la cuadrícula y lo muestra como franja de proyecto propio.

### Campos opcionales de un proyecto

`case` y `code` llegaron el 2026-10-21; `own`, `download` y `points`, el 2026-10-22 (commit `e88c874`). Los tipos están en `ProjectEntry` (`src/content/projects.ts`) y en `Project` (`src/content/types.ts`).

| Campo | Dónde va | Qué guarda | Qué muestra |
| :-- | :-- | :-- | :-- |
| `case` | Común | Id del caso de estudio en el sitio (hoy `"aria"`, `"devpanel"` y `"portafolio"`). `projectsFrom()` lo convierte en `/<id>/` o `/en/<id>/` según el idioma. | Enlace «Ver el caso completo» / «Read the case study». |
| `code` | Común | URL de un repositorio público. Solo código propio, nunca de un cliente (comentario de `ProjectEntry` y ayuda del campo en el admin). Hoy lo usan DevPanel, SENA Cloud y SensoresAPP. | Enlace «Ver código» / «View code», que abre en otra pestaña. |
| `own` | Común | `true` en un producto propio de Harol. Hoy lo tienen DevPanel y el portafolio. | El proyecto sale en «Proyectos propios» como franja, no en la cuadrícula. |
| `download` | Común | URL de descarga de un producto propio que es una app; `projectsFrom()` la pasa a `downloadHref`. Hoy solo DevPanel, hacia el release `installer` de su repositorio. | Botón «Descargar para Windows» (`downloadLabel` en `site.json`). |
| `points` | Dentro de `es` y `en` | Lista de puntos destacados de la franja. `projectsFrom()` recorta espacios y quita los vacíos. | Lista con viñetas en la franja. |

Antes toda tarjeta con sitio en línea era un enlace completo. Un enlace no puede contener otros enlaces, así que una tarjeta con caso o con código pasa a ser un `<article>` con enlaces separados (sitio, caso, código); las demás siguen siendo un enlace completo (`ProjectCard` en `components/Projects.tsx`, commit `94f0f6a`).

Las pruebas de `tests/content.test.ts` añaden: misma estructura en los dos idiomas, ningún texto vacío, ids de proyectos iguales en ambos idiomas, enlaces solo `https`, y que existan las imágenes, íconos y PDF referenciados.

## Idiomas

- Español en `/` y inglés en `/en/`: dos páginas estáticas con su propio título, descripción, canonical, `hreflang`, Open Graph, datos estructurados y texto de respaldo.
- La URL decide el idioma (`useLocale`, `public/splash.js` y el build usan la misma regla). El botón cambia sin recargar y actualiza la dirección.
- `portfolio/netlify.toml` redirige (302) `/` a `/en/`, `/migozz/` a `/en/migozz/`, `/aria/` a `/en/aria/`, `/devpanel/` a `/en/devpanel/` y `/portafolio/` a `/en/portafolio/` solo si el navegador pide inglés o tiene la cookie `nf_lang=en`. El botón de idioma fija esa cookie, que Netlify lee antes que el idioma del navegador. Los rastreadores no mandan idioma y reciben la versión en español. La regla de `/aria/` llegó en `574e51b` y la de `/devpanel/` en `90ff404` y la de `/portafolio/` en `433174c` (ver [dominio y SEO](dominio-y-seo.md)).

## Casos de estudio

### MIGOZZ

`/migozz/` y `/en/migozz/` son una segunda entrada de Vite (`portfolio/migozz/index.html`, `src/migozz.tsx`, `src/MigozzPage.tsx`). Tiene portada animada, cifras públicas con su fuente, gráficas (`components/migozz/UserCharts.tsx`), flujo de uso (`Flow.tsx`), problema, funciones, cronología, capturas y el rol de Harol. Usa `motion` para las animaciones.

Desde el commit `fc4b004` sigue la identidad actual de la marca: fondo blanco, morado como color principal y fucsia de acento, con contraste AA.

- Las gráficas de usuarios solo aparecen con `visible: true` en `migozz-users.json`, para no mostrar cifras inventadas.
- `shots` en `migozz.json` está vacío hoy, así que la sección de capturas no aparece.

### Plantilla compartida de los casos

Desde el commit `90ff404`, ARIA y DevPanel usan la misma página, y desde `433174c` también el caso del portafolio: `src/CaseStudyPage.tsx`, con los tipos en `src/content/caseStudy.ts` (`CaseCopy`) y los estilos en `src/styles/case-study.css`. Antes eran `AriaPage.tsx` y `aria.css`. MIGOZZ sigue con su página propia.

Cada caso tiene:

| Pieza | ARIA | DevPanel | Portafolio |
| :-- | :-- | :-- | :-- |
| HTML (entrada de Vite) | `portfolio/aria/index.html` | `portfolio/devpanel/index.html` | `portfolio/portafolio/index.html` |
| Entrada de React | `src/aria.tsx` | `src/devpanel.tsx` | `src/portafolio.tsx` |
| Textos (es y en) | `src/content/data/aria.json` | `src/content/data/devpanel.json` | `src/content/data/portafolio.json` |
| Carga y validación | `src/content/aria.ts` | `src/content/devpanel.ts` | `src/content/portafolio.ts` |
| Textos SEO (`seo.json`) | `ariaPages` | `devpanelPages` | `portafolioPages` |
| Estación del admin | ARIA | DevPanel | Portafolio |

La entrada solo monta `<CaseStudyPage name=… copy=… titles=… />`. El título de pestaña es el mismo de los resultados de búsqueda (`seo.json` → `ariaPages`, `devpanelPages` o `portafolioPages`). No usa `motion` ni pantalla de carga.

Secciones de la plantilla, en orden: portada, cifras con su nota de contexto, problema y solución, capturas, la arquitectura como dos líneas de metro con su estación de transbordo, decisiones, lo que se rompió, la parte de Harol, lo que falta y el stack. Tres campos de `CaseCopy` son opcionales:

- `links`: botones en la portada (etiqueta, enlace y nombre del evento de Umami).
- `shotsTitle` y `shots`: capturas bajo `public/`; la plantilla usa también la variante `-480.webp` que está al lado. Sin capturas, la sección no aparece.
- `teamNote`: quién hizo qué, cuando el proyecto fue de equipo. ARIA la tiene; DevPanel y Portafolio no.

Agregar un caso nuevo exige también su entrada en la capa SEO (ver [dominio y SEO](dominio-y-seo.md)).

### ARIA

`/aria/` y `/en/aria/` (commit `b9d13b1`). ARIA es un asistente de soporte SAP hecho en equipo para Arix Group. Sus dos líneas de metro son la consulta y la ingesta diaria. La nota del admin para esta estación pide solo cifras medidas y nada de IDs de AWS, URLs internas ni nombres del equipo.

### DevPanel

`/devpanel/` y `/en/devpanel/` (commit `90ff404`). DevPanel es una app de escritorio de código abierto de Harol, para Windows: repos de GitHub, proyectos locales y herramientas en un panel con entrada por rostro. Su página tiene enlaces en la portada al código y a la descarga (eventos `devpanel-code` y `devpanel-download`), tres capturas (`shots/devpanel.webp`, `devpanel-lock.webp`, `devpanel-tools.webp`) y dos líneas de metro: instalación y uso diario. No tiene nota de equipo. La nota del admin pide solo cifras que se puedan comprobar en el repositorio de DevPanel.

Las capturas salen de las pruebas e2e del propio DevPanel, con datos de prueba (mensaje del commit `06a3e2b`). Están directamente en `portfolio/public/shots/`, cada una con su variante `-480.webp`.

### Portafolio

`/portafolio/` y `/en/portafolio/` (commit `433174c`). Es el caso de estudio de este mismo sitio, tratado como producto: admin propio, workflows de GitHub Actions, Lighthouse y accesibilidad exigidos en cada cambio. Sus dos líneas de metro son «Cada cambio» y «Solo, sin tocarlo» (en inglés, «Every change» y «On its own»): lo que pasa con un commit y lo que corre programado. No tiene nota de equipo.

Como el código del portafolio es privado, el registro público de cómo está hecho es esta documentación. Por eso la portada del caso tiene un solo botón, «Leer la documentación técnica», hacia `https://docs.hgsportafolio.site` (evento `portafolio-docs`), y el pie del caso, la tarjeta y el texto de respaldo apuntan al mismo sitio. La nota del admin pide solo cifras que se puedan comprobar en este repositorio o en su documentación; las cifras del texto (número de workflows, de pruebas) se actualizan a mano en `portafolio.json`, `projects.json` y `seo.json`.

Tiene tres capturas: `shots/portafolio.webp` (la portada), `portafolio-case.webp` (un caso de estudio) y `portafolio-docs.webp` (esta documentación), cada una con su variante `-480.webp`. Están directamente en `portfolio/public/shots/`, sin original en `images/`: son capturas del sitio local y de `docs.hgsportafolio.site`, y el repositorio no guarda el script que las tomó, así que al cambiar el diseño hay que rehacerlas a mano.

### Tarjeta de ARIA

La tarjeta de ARIA en `projects.json` se corrigió el mismo día: dice S3 Vectors en vez de OpenSearch (que el proyecto no usó), cambia el resultado «Escalamiento humano incluido» (que no se construyó) por un tiempo de respuesta medido, describe la parte de Harol en el equipo y enlaza al caso con `case: "aria"`. OpenSearch también salió del stack del sitio (`stack.json`, el texto de `site.json` y su ícono) en el commit `8bbfdbf`.

## Sección Proyectos: propios y para clientes

Desde el commit `e88c874` (2026-10-22), `src/components/Projects.tsx` divide la sección 05 en dos subsecciones, bajo el encabezado común (`selectedEyebrow`, `selectedTitle` y `selectedLead` en `site.json`; la introducción habla de dos productos propios y ocho proyectos para clientes e instituciones, y esas cifras se escriben a mano):

| Subsección | Textos en `site.json` | Qué entra | Cómo se ve |
| :-- | :-- | :-- | :-- |
| Proyectos propios | `ownTitle` y `ownLead` | Los proyectos con `own: true`, en el orden de `projects.json` | Una franja oscura por proyecto (`OwnProject`). Si no hay ninguno, la subsección no aparece. |
| Para clientes e instituciones | `clientTitle` | El resto | La cuadrícula de tarjetas (`ProjectCard`): los `featured` siempre y los demás tras «Ver más proyectos». |

Antes DevPanel tenía, además de su tarjeta, una franja suelta después de Proyectos (`SideProject.tsx`, con sus textos en la clave `sideProject` de `site.json`). Ese componente y esa clave se borraron, así que DevPanel ya no sale dos veces. `downloadLabel` pasó a ser una clave de primer nivel de `site.json`.

### Franja de proyecto propio

`OwnProject` (en `Projects.tsx`; estilos en `src/styles/own-project.css`, que antes se llamaba `side-project.css`) arma cada franja con los datos del proyecto en `projects.json`:

- Etiqueta (`tag`), título (`title`) y descripción (`dek`).
- Los puntos destacados (`points`), si los hay.
- Botones: «Ver el caso completo» si hay `case`, «Ver código» si hay `code` y «Descargar para Windows» si hay `download`.
- Las tecnologías (`stack`) y la captura (`shot`, con su variante `-480.webp`).

La franja no muestra el campo `result`. Cada una lleva el id `own-<id>`. En escritorio (desde 960 px) la segunda franja pone la captura a la izquierda, para que las dos no se lean como copias (comentario de `own-project.css`, regla `:nth-child(even)`).

Las letras de línea de metro de las tarjetas se calculan solo sobre la lista de clientes: los proyectos propios no gastan letras y cada tarjeta conserva la suya al desplegar «Ver más».

### Altura estimada de la sección

Las secciones usan `content-visibility` con un estimado de altura de 1600 px (`src/styles/layout.css`). Con las franjas, Proyectos mide mucho más: con ese estimado el contenido de abajo se corría al pintarse y axe medía Credenciales sobre una franja oscura que ya no estaba ahí, lo que daba un fallo de contraste en e2e. Por eso `#selected` tiene `contain-intrinsic-size: auto 4600px` en móvil y `auto 3500px` desde 960 px. Si se agregan más proyectos propios, hay que subir esos valores.

### DevPanel en Proyectos

DevPanel entró a `projects.json` como proyecto destacado en `06a3e2b` (el mensaje del commit explica por qué: es el código público más sólido de Harol), con la captura `shots/devpanel.webp` y su código (`code`); su caso (`case: "devpanel"`) llegó en `90ff404`. Desde `e88c874` es el primero de la lista, con `own: true`, tres puntos por idioma y `download` hacia el release `installer`. Sale como la primera franja de «Proyectos propios», con los tres botones.

### El portafolio en Proyectos

La entrada `portafolio` («Este portafolio» / «This portfolio») llegó en `433174c`, con la captura `shots/portafolio.webp` y `case: "portafolio"`. Desde `e88c874` va segunda, con `own: true` y tres puntos por idioma. No tiene `href`, `code` ni `download`, porque el código es privado, así que su franja solo tiene el botón al caso. Las cifras de sus puntos (número de workflows y de pruebas) se escriben a mano.

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
| `case-<id>` | `Projects.tsx` | Clic en «Ver el caso completo» de una tarjeta o de una franja de proyecto propio (`case-devpanel`, `case-portafolio`). |
| `code-<id>` | `Projects.tsx` | Clic en «Ver código» de una tarjeta o de una franja (en DevPanel, `code-devpanel`). |
| `<id>-download` | `Projects.tsx` (franja `OwnProject`) | Clic en la descarga de un proyecto propio. Hoy solo `devpanel-download`. |
| `devpanel-code`, `devpanel-download` | Portada del caso DevPanel (`devpanel.json` → `links`) | Clic en el código o en la descarga desde la página del caso. |
| `portafolio-docs` | Portada del caso Portafolio (`portafolio.json` → `links`) | Clic en «Leer la documentación técnica». |
| `migozz-play`, `migozz-appstore` | `Startup.tsx` | Clic en Google Play o App Store de MIGOZZ. |
| `migozz-case` | `Startup.tsx` | Clic en el botón al caso de MIGOZZ. |
| `contact` | `ContactForm.tsx` | Clic en enviar el formulario. |
| `contact-sent` | `ContactForm.tsx` | El mensaje se envió bien (`window.umami.track`). |

Desde `e88c874` el código de DevPanel cuenta con dos nombres: `code-devpanel` desde la franja de la portada (antes `devpanel-code`) y `devpanel-code` desde la página del caso. La descarga usa `devpanel-download` en los dos lugares. El resumen semanal del admin traduce cada nombre por separado (ver [admin](admin.md)).

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
| `tests/seo.test.ts` | Títulos por idioma, canonical, `hreflang`, Open Graph, JSON-LD, sitemap, texto de respaldo y páginas de ARIA, DevPanel y Portafolio (en DevPanel, que Harol figure como `author` y no como `contributor`; en Portafolio, largos de título y descripción, las dos URL en el sitemap, `author` y `subjectOf` hacia la documentación en el JSON-LD, y los enlaces del texto de respaldo). |
| `tests/github-data.test.ts` | Forma de `src/data/github.json`. |
| `tests/contact-email.test.ts` | Lógica del formulario en el admin (`admin/netlify/lib/contact.ts`): correos, descarte de bots, límites y orígenes permitidos. |
| `tests/admin-auth.test.ts` | Reglas de entrada del admin y lista de llamadas a GitHub permitidas. |
| `tests/digest.test.ts` | Resumen semanal del admin (`admin/netlify/lib/digest.ts`): rango de fechas, lectura de Umami y Search Console, y el correo. |
| `tests/security-txt.test.ts` | `public/.well-known/security.txt` tiene contacto y dirección canónica, y falla un mes antes de que venza. |
| `e2e/a11y.spec.ts` | Sin violaciones WCAG A/AA con axe, en ES y EN, móvil y escritorio, en la portada, MIGOZZ, ARIA, DevPanel y Portafolio. |
| `e2e/keyboard.spec.ts` | Enlace de salto, nombres accesibles, foco del visor de certificados, cambio de idioma. |
| `e2e/features.spec.ts` | Envío del formulario (JSON a la función del admin, simulada), modo de alto contraste e impresión. |
| `e2e/seo.spec.ts` | Idioma por URL, rutas de recursos, head estático y política de seguridad sin violaciones. |
| `e2e/screenshots.spec.ts` | Capturas por sección para el comentario del PR. |

Los presupuestos de Lighthouse están en `scripts/lighthouse.mjs`: móvil rendimiento 0.90, escritorio 0.95, accesibilidad 1, buenas prácticas y SEO 0.95. Cada corrida fallida se reintenta hasta 3 veces.
