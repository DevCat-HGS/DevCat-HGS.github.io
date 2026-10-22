---
titulo: Marca personal en LinkedIn
seccion: Marca personal
resumen: La guía para el perfil de LinkedIn, los banners y la publicación del portafolio, y cómo se regeneran sus imágenes.
orden: 12
---

La carpeta `linkedin/` busca que el perfil de LinkedIn, el portafolio y el GitHub se vean como una sola marca: la misma tipografía (Archivo condensada), los mismos colores (papel, tinta, amarillo de señal y verde del metro) y el mismo mensaje (`linkedin/GUIA.md`).

## Qué hay

| Archivo | Para qué |
| :-- | :-- |
| `GUIA.md` | Guía paso a paso: banner, foto, titular, Acerca de, Destacados, Experiencia, Proyectos y certificaciones, Aptitudes, Recomendaciones, configuración, actividad y lista de comprobación. |
| `PUBLICACION.md` | Texto de la publicación del portafolio en español e inglés, cómo publicarla e ideas para las siguientes. |
| `banner-es.png`, `banner-en.png` | Banner del perfil, 1584 × 396 px. |
| `publicacion-es.png`, `publicacion-en.png` | Imagen de la publicación, 1080 × 1350 px. |
| `banner.html`, `publicacion.html` | Plantillas; el texto se cambia aquí. |
| `capturas/` | Capturas del portafolio en vivo que usa la publicación: portada en escritorio y móvil, y el caso `/portafolio/` (`caso.png`). |
| `fuente/` | Archivo, la fuente del portafolio, para que las plantillas se vean igual. |
| `exportar.mjs` | Regenera los PNG. |

## Regenerar las imágenes

```bash
node linkedin/exportar.mjs             # banners y publicación
node linkedin/exportar.mjs --capturas  # además, nuevas capturas de hgsportafolio.site
```

Usa el Playwright instalado en `portfolio/` (no instala nada nuevo) con el canal `msedge`, así que necesita Microsoft Edge. Las capturas se toman de `https://hgsportafolio.site` a 1440 × 900 y 390 × 844.

## Publicación

## Mensaje actual

Desde el 2026-10-22 el banner y la publicación siguen el mensaje central del sitio: «Llevo productos a producción» (en inglés, «I take products to production»).

- **Banner:** debajo del mensaje nombra los casos de estudio (MIGOZZ, ARIA, DevPanel y el propio portafolio).
- **Publicación:** trata del caso `/portafolio/` («Mi portafolio se publica solo»), con tres cifras de ese caso: 14 workflows, más de 100 pruebas y accesibilidad 100 exigida.
- **Primer comentario:** enlaza el caso y `docs.hgsportafolio.site`.
- **Guía:** suma DevPanel y el portafolio al Acerca de, a Destacados y a Proyectos. ARIA aparece como trabajo en equipo y sin cifras hasta que Arix Group las confirme (ver [pendientes](pendientes.md)).

Esas cifras están escritas a mano en `publicacion.html` y en `PUBLICACION.md`: si cambian en el caso, hay que cambiarlas aquí también y volver a exportar.

LinkedIn no tiene API en este flujo: banner, textos y publicación se suben a mano siguiendo `GUIA.md` y `PUBLICACION.md`.

Los commits `dd6e9b6` y `e55f47e` (2026-10-13) quitaron detalles confidenciales de trabajo del texto de la publicación y del perfil; cualquier cambio futuro debe mantener ese criterio. El agente `.claude/agents/rrhh-estricto.md` sirve para auditar CV, LinkedIn, README o portafolio como lo haría un filtro de reclutamiento, incluida una revisión de confidencialidad.
