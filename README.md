---
titulo: Todo el sistema de Harol en un vistazo
seccion: Portada
resumen: Qué piezas viven en este repositorio, cómo se conectan, dónde corre cada una y en qué estado están.
orden: 1
---

Este repositorio privado (`DevCat-HGS/portfolio-hgs` en GitHub) reúne la presencia profesional de Harol Guerrero Salgado: el portafolio web, el editor de contenido, la hoja de vida en PDF, el README del perfil de GitHub y el material de LinkedIn. Todo sale de los mismos datos y se publica con un commit en `main`.

## Las piezas

| Pieza | Carpeta | Dónde se ve | Qué es |
| :-- | :-- | :-- | :-- |
| Portafolio | `portfolio/` | `https://hgsportafolio.site` (sitio de Netlify `portafolio-hgs`) | Página bilingüe en React 19 + Vite, con los casos de estudio de MIGOZZ (`/migozz/`), ARIA (`/aria/`) y DevPanel (`/devpanel/`). |
| Admin | `admin/` | `admin.hgsportafolio.site` (sitio de Netlify `admin-hgs`) | Editor propio en React que lee y publica el contenido del portafolio y del CV en este repositorio. También recibe el formulario de contacto, envía sus correos, guarda los mensajes y manda un resumen semanal por correo. |
| Hoja de vida | `curriculum/` | `portfolio/public/cv/` (botón de descarga del sitio) | Generador en Python que produce el CV en PDF en español e inglés desde `cv_data.json`. |
| Perfil de GitHub | `README.md`, `README.es.md`, `profile/`, `privacity/`, `scripts/` | Repositorio público `DevCat-HGS/DevCat-HGS` | README del perfil, con gráficas de lenguajes generadas y copiado al repo público por un workflow. |
| LinkedIn | `linkedin/` | Perfil de LinkedIn (manual) | Guía, banners y publicación con la misma identidad visual del sitio. |
| Documentación | `Doc/` | `https://docs.hgsportafolio.site` (repo público `DevCat-HGS.github.io`) | Estos artículos y su página `index.html`, publicados por el workflow `Publish docs` en cada push a `main` que toque `Doc/`. |

## Cómo se conectan

1. El contenido visible del portafolio vive en `portfolio/src/content/data/*.json` y el del CV en `curriculum/cv_data.json`.
2. El admin edita esos JSON y publica un solo commit en `main` a través de una función de Netlify que guarda el token de GitHub.
3. Ese commit dispara los workflows de GitHub Actions (CV, imágenes, pruebas) y el deploy de Netlify del portafolio.
4. El formulario de contacto del portafolio envía cada mensaje a una función del admin, que lo guarda y manda los correos.
5. El README del perfil se regenera aparte (gráficas diarias) y se copia al repositorio público.
6. Cada lunes, una función programada del admin lee Umami y Search Console y le manda a Harol un resumen de la semana.

El detalle está en [arquitectura](arquitectura.md).

## Estado actual

- El portafolio está en línea en el dominio propio `hgsportafolio.site`; `portafolio-hgs.netlify.app` sigue abierto como respaldo (ver [dominio y SEO](dominio-y-seo.md)).
- El admin acaba de pasar a entrada con PIN más código por correo y sesión firmada; el token de GitHub ya no pasa por el navegador (commit `bf84696`, 2026-10-21).
- El formulario de contacto ya no usa Netlify Forms: envía al admin, que guarda el mensaje (estación «Mensajes») y, con Resend configurado, envía la copia a Harol y la confirmación al visitante (commit `f4be780`, 2026-10-21).
- El caso de estudio de ARIA está en `/aria/` y `/en/aria/`, editable desde el admin; la tarjeta y el CV describen ARIA como trabajo de equipo, con S3 Vectors y un tiempo medido (commits `b9d13b1` y `8bbfdbf`, 2026-10-21).
- DevPanel, la app de escritorio de código abierto de Harol, tiene caso de estudio en `/devpanel/` y `/en/devpanel/`, tarjeta destacada y una franja propia en la portada después de los proyectos. ARIA y DevPanel comparten la plantilla `CaseStudyPage` (commits `06a3e2b` y `90ff404`, 2026-10-21).
- SENA Cloud y SensoresAPP tienen repos públicos nuevos y limpios, enlazados desde sus tarjetas. Los repos de clientes se quedan privados (ver [perfil de GitHub](perfil-github.md)).
- La analítica con Umami está lista en el código; se activa con `VITE_UMAMI_WEBSITE_ID` (solo el UUID) en `portafolio-hgs`.
- El resumen semanal por correo (`weekly-digest`) está desplegado, pero no envía nada hasta que se configuren sus variables en `admin-hgs`.
- Vite 8.3.5 en los dos proyectos; sin alertas abiertas de Dependabot tras `f3089f8`. gitleaks revisa el historial en cada push.
- El repo sigue privado: hacerlo público pide un repo nuevo con historial limpio, decisión aplazada (ver [seguridad](seguridad.md)).
- La carpeta `img/` ya no está en el repositorio (commit `236c9d3`).
- **Falta configuración de Harol:** las variables del admin en Netlify (incluidas las del formulario y del resumen semanal) y la verificación del dominio en Resend. Mientras falten, el admin no deja entrar y el formulario no envía correos. Lista completa en [configuración](configuracion.md) y [pendientes](pendientes.md).
- Ramas: solo `main` (producción) y `desarrollo`.

## Índice de artículos

| # | Artículo | De qué va |
| :-- | :-- | :-- |
| 2 | [Arquitectura](arquitectura.md) | Carpetas, tecnologías y el camino de un cambio hasta el sitio. |
| 3 | [Portafolio](portafolio.md) | Secciones, componentes, contenido en JSON, idiomas, casos MIGOZZ, ARIA y DevPanel, imágenes, formulario, analítica y pruebas. |
| 4 | [Admin](admin.md) | Estaciones (incluidas «Mensajes», ARIA y DevPanel), edición, imágenes, borradores, publicación y resumen semanal. |
| 5 | [Seguridad](seguridad.md) | Entrada al admin, sesiones, límites, intermediario de GitHub, CSP, cabeceras, dependencias, gitleaks y publicación del repo. |
| 6 | [Correos](correos.md) | Formulario de contacto, códigos de acceso y resumen semanal, con Resend. |
| 7 | [Hoja de vida](curriculum.md) | Fuente única, generación de los PDF y diseño para ATS. |
| 8 | [Perfil de GitHub](perfil-github.md) | README del perfil, gráficas, publicación y qué código se hace público. |
| 9 | [CI/CD](ci-cd.md) | Workflows, Netlify, Dependabot y ramas. |
| 10 | [Dominio y SEO](dominio-y-seo.md) | Dominio, DNS, Search Console, sitemap y datos estructurados. |
| 11 | [Configuración](configuracion.md) | Variables de entorno por sitio y lo que falta configurar. |
| 12 | [LinkedIn](linkedin.md) | Guía, banners y publicación. |
| 13 | [Historial](historial.md) | Cronología del repositorio según `git log`. |
| 14 | [Pendientes](pendientes.md) | Lo que falta, lo que depende de Harol y mejoras sugeridas. |
