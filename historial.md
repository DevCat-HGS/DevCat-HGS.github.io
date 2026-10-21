---
titulo: Cronología del repositorio
seccion: Historial
resumen: Los hitos del proyecto por fecha, tomados de git log, desde el README del perfil en 2024 hasta el formulario de contacto atendido por el admin en octubre de 2026.
orden: 13
---

Fuente: `git log --format="%h %ad %s" --date=short`. Se omiten los commits automáticos repetidos (gráficas de lenguajes, CV, datos de GitHub) y los merges de Dependabot, salvo cuando marcan algo.

## 2024-12 a 2025-10: el README del perfil

- **2024-12-14** `82abbd8` Commit inicial. Ese día y los siguientes, decenas de ediciones de `README.md` desde la web de GitHub.
- **2025-01 a 2025-07** Ediciones sueltas del README y subida de imágenes a `img/` (fondos, logos, código QR). En total hay 93 commits «Update README.md».
- **2025-10-21** `3d30eed` Última edición de esa etapa.

## 2026-09: renovación del perfil

- **2026-09-21** README reescrito con nueva marca personal, generación de gráficas de lenguajes y limpieza de imágenes sin uso (`fcbf852`, `e39c105`, `818d23c`, `9d5f4e3`).
- **2026-09-29** Experiencia en Mitsubishi Electric y correo de contacto en el README (`01db10f`).

## 2026-10-01: nace el portafolio

- `54b15c8` Primera versión del portafolio con la sección de MIGOZZ, tarjetas y capturas.
- `dbc3ded` Generador del CV, su workflow y el botón de descarga.
- `b64b7b7` Sección de credenciales.
- `7a38214` CV rediseñado con Inter incrustada.
- `4759508` Imágenes WebP, fuentes propias y pantalla de bienvenida.
- `d7352cb` Stack en acordeón, SEO y datos estructurados.
- `7df5731` Sección opcional de repos privados en el perfil (`privacity/`).
- `213eca1`, `b199ff1` Verificación de Google Search Console.

## 2026-10-07: línea de metro, calidad y CI

- `857354f` Rediseño alrededor de una línea del metro de Medellín.
- `6dac778` App dividida en componentes y hooks, contenido tipado, CSS por sección.
- `ec543d6` ESLint, Prettier, Vitest, CI, Dependabot y README del portafolio.
- `42692f4` Copia del README del perfil al repositorio público.
- `84dc422` Comentario de deploy preview desde los estados de Netlify.
- `f765c77` Presupuestos de Lighthouse, axe, pruebas de teclado, capturas en PR, generador de `og.png`, Release Please, revisión de enlaces y datos de GitHub.
- `6f98ab2` Release Please solo a mano.
- `ee130d5` Página `/en/` con `hreflang`, más datos estructurados, CSP y cabeceras de seguridad.
- Merge del PR #1 (`testing`) y primeros PR de Dependabot.

## 2026-10-10: MIGOZZ, formulario y automatización de imágenes

- `0390adc` Página del caso MIGOZZ en `/migozz/` y `/en/migozz/`.
- `b6073f7` Formulario de contacto con Netlify Forms.
- `8fdee63` Analítica opcional con Umami, apagada hasta configurarla.
- `7f5f8ab` Modo de alto contraste e impresión.
- `1de4fe7` Workflow de imágenes y presupuestos de peso.
- `0b87eb7` Comparación de Lighthouse contra `main` en el comentario del PR.
- `2a45a15` Un solo issue de enlaces rotos.
- `39b7332` Revalidación de imágenes, íconos y CV en cada visita.
- `c10c5d4` Rediseño de MIGOZZ con Motion, gráficas públicas y pantalla de carga.
- PR #13 a #15 y #27 a #29.

## 2026-10-13 a 2026-10-15: retrato, LinkedIn y revisión de RR. HH.

- `d686b89`, `8f4afa5` Retrato en la sección Oficio.
- `88659a3` Nueva URL de LinkedIn en portafolio, SEO y CV.
- `b182da1` Carpeta `linkedin/`: banner, publicación y guía.
- `dd6e9b6`, `e55f47e`, `ffae6f7` Se quitan detalles confidenciales y cifras; título real y un solo nombre en todas partes (PR #31).
- `b1ba0c0` Dos proyectos destacados y el resto tras «ver más» (PR #32).
- **2026-10-14** Merges de Dependabot que suben las acciones a `checkout@v7`, `setup-node@v7`, `github-script@v9`, `upload-artifact@v7` y `release-please-action@v5`.
- **2026-10-15** `4f652c0` `favicon.ico` real y nombre del sitio consistente para Google.

## 2026-10-19 a 2026-10-21: dominio propio y admin

- **2026-10-19** `5806c65` Contenido afinado, stack reorganizado en Web, Backend, Mobile y Cloud, nuevo correo de contacto.
- **2026-10-21** `73be47d` El sitio pasa a `hgsportafolio.site`.
- **2026-10-21** `8d5a3db` `netlify.app` queda como respaldo y se emiten los dos códigos de Search Console.
- **2026-10-21** `3a1e1e4` Primer admin con Sveltia CMS; los proyectos pasan a `projects.json`.
- **2026-10-21** `c1629bf` Admin propio en React para todo el portafolio; todo el texto visible pasa a `src/content/data/*.json` validado con `checked()`.
- **2026-10-21** `fc4b004` Correos del formulario con Resend y caso MIGOZZ en blanco con los colores actuales de la marca.
- **2026-10-21** `4d8f465` Formato del README del portafolio y reintentos de Lighthouse.
- **2026-10-21** `bf84696` Entrada al admin con PIN y código por correo, token de GitHub solo en el servidor, bloqueos en Netlify Blobs, `.env.example` en los dos sitios, un comentario de preview por sitio y workflows con la rama `desarrollo`.
- **2026-10-21** `fa72716`, `4ceff81` Primeros commits hechos desde el admin («content: actualizar textos del sitio desde el admin»): un cambio de prueba en `site.json` y su corrección.
- **2026-10-21** `5ba4d50` Carpeta `Doc/` con el agente documentador y la vista de periódico; Dependabot también revisa `admin/`.
- **2026-10-21** `f4be780` El formulario de contacto deja Netlify Forms, que no lo detectaba, y envía al admin (`/api/contact`), que guarda el mensaje y manda los dos correos. Nueva estación «Mensajes». El portafolio se queda sin funciones y registra el evento `contact-sent` en Umami.
- **2026-10-21** `236c9d3` La carpeta `img/` (imágenes personales) sale del repositorio y queda en `.gitignore`.

## Commits automáticos

A la fecha: 18 de gráficas de lenguajes, 2 del CV, 1 de datos de GitHub y 10 actualizaciones de Dependabot (`Bump`).
