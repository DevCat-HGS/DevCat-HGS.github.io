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
| Portafolio | `portfolio/` | `https://hgsportafolio.site` (sitio de Netlify `portafolio-hgs`) | Página bilingüe en React 19 + Vite, con la página del caso MIGOZZ en `/migozz/`. |
| Admin | `admin/` | `admin.hgsportafolio.site` (sitio de Netlify `admin-hgs`) | Editor propio en React que lee y publica el contenido del portafolio y del CV en este repositorio. También recibe el formulario de contacto, envía sus correos y guarda los mensajes. |
| Hoja de vida | `curriculum/` | `portfolio/public/cv/` (botón de descarga del sitio) | Generador en Python que produce el CV en PDF en español e inglés desde `cv_data.json`. |
| Perfil de GitHub | `README.md`, `README.es.md`, `profile/`, `privacity/`, `scripts/` | Repositorio público `DevCat-HGS/DevCat-HGS` | README del perfil, con gráficas de lenguajes generadas y copiado al repo público por un workflow. |
| LinkedIn | `linkedin/` | Perfil de LinkedIn (manual) | Guía, banners y publicación con la misma identidad visual del sitio. |

## Cómo se conectan

1. El contenido visible del portafolio vive en `portfolio/src/content/data/*.json` y el del CV en `curriculum/cv_data.json`.
2. El admin edita esos JSON y publica un solo commit en `main` a través de una función de Netlify que guarda el token de GitHub.
3. Ese commit dispara los workflows de GitHub Actions (CV, imágenes, pruebas) y el deploy de Netlify del portafolio.
4. El formulario de contacto del portafolio envía cada mensaje a una función del admin, que lo guarda y manda los correos.
5. El README del perfil se regenera aparte (gráficas diarias) y se copia al repositorio público.

El detalle está en [arquitectura](arquitectura.md).

## Estado actual

- El portafolio está en línea en el dominio propio `hgsportafolio.site`; `portafolio-hgs.netlify.app` sigue abierto como respaldo (ver [dominio y SEO](dominio-y-seo.md)).
- El admin acaba de pasar a entrada con PIN más código por correo y sesión firmada; el token de GitHub ya no pasa por el navegador (commit `bf84696`, 2026-10-21).
- El formulario de contacto ya no usa Netlify Forms: envía al admin, que guarda el mensaje (estación «Mensajes») y, con Resend configurado, envía la copia a Harol y la confirmación al visitante (commit `f4be780`, 2026-10-21).
- La analítica con Umami está lista en el código pero apagada hasta que se configure `VITE_UMAMI_WEBSITE_ID`.
- La carpeta `img/` ya no está en el repositorio (commit `236c9d3`).
- **Falta configuración de Harol:** las variables del admin en Netlify (incluidas las del formulario) y la verificación del dominio en Resend. Mientras falten, el admin no deja entrar y el formulario no envía correos. Lista completa en [configuración](configuracion.md) y [pendientes](pendientes.md).
- Ramas: solo `main` (producción) y `desarrollo`.

## Índice de artículos

| # | Artículo | De qué va |
| :-- | :-- | :-- |
| 2 | [Arquitectura](arquitectura.md) | Carpetas, tecnologías y el camino de un cambio hasta el sitio. |
| 3 | [Portafolio](portafolio.md) | Secciones, componentes, contenido en JSON, idiomas, MIGOZZ, imágenes, formulario, analítica y pruebas. |
| 4 | [Admin](admin.md) | Estaciones (incluida «Mensajes»), edición, imágenes, borradores, revisión y publicación. |
| 5 | [Seguridad](seguridad.md) | Entrada al admin, sesiones, límites, intermediario de GitHub, CSP y cabeceras. |
| 6 | [Correos](correos.md) | Formulario de contacto atendido por el admin y códigos de acceso, con Resend. |
| 7 | [Hoja de vida](curriculum.md) | Fuente única, generación de los PDF y diseño para ATS. |
| 8 | [Perfil de GitHub](perfil-github.md) | README del perfil, gráficas y publicación al repo público. |
| 9 | [CI/CD](ci-cd.md) | Workflows, Netlify, Dependabot y ramas. |
| 10 | [Dominio y SEO](dominio-y-seo.md) | Dominio, DNS, Search Console, sitemap y datos estructurados. |
| 11 | [Configuración](configuracion.md) | Variables de entorno por sitio y lo que falta configurar. |
| 12 | [LinkedIn](linkedin.md) | Guía, banners y publicación. |
| 13 | [Historial](historial.md) | Cronología del repositorio según `git log`. |
| 14 | [Pendientes](pendientes.md) | Lo que falta, lo que depende de Harol y mejoras sugeridas. |
