---
titulo: La hoja de vida, de un JSON a dos PDF
seccion: Hoja de vida
resumen: Fuente única en cv_data.json, generación automática de los PDF en español e inglés y las decisiones para pasar filtros ATS.
orden: 7
---

## Fuente única

`curriculum/cv_data.json` es la única fuente del CV. Tiene los datos de contacto y, por idioma (`es` y `en`): `title`, `location`, `labels`, `summary`, `experience`, `skills`, `projects`, `education`, `certifications` y `awards`. La clave `files` dice el nombre del PDF de cada idioma.

Se edita desde el admin (estación «Hoja de vida», ver [admin](admin.md)) o a mano.

## Generación

`curriculum/generate_cv.py` usa ReportLab y escribe:

| Salida | Para qué |
| :-- | :-- |
| `curriculum/output/Harol_Guerrero_CV_ES.pdf` y `_EN.pdf` | Fuente versionada de los PDF. |
| `portfolio/public/cv/` (mismos nombres) | Copia que descarga el botón del portafolio. |

```bash
pip install -r curriculum/requirements.txt
python curriculum/generate_cv.py
```

Opciones: `--data` (otro JSON), `--out` (otra carpeta), `--site-dir` (otra carpeta para la copia) y `--no-site-copy`.

El PDF es determinista (`invariant=1`): si `cv_data.json` no cambió, el archivo sale idéntico y no hay commit.

## Automático

El workflow `.github/workflows/curriculum.yml` corre en cada push a `main` o `desarrollo` (salvo cuando solo cambian los propios PDF) y a mano. Instala ReportLab, genera los PDF y, si cambiaron, hace commit `chore: update CV` y push a la misma rama.

`portfolio/netlify.toml` sirve `/cv/*` con `must-revalidate`, así el visitante siempre baja la última versión.

## Pensado para ATS

- Una sola columna, sin tablas ni imágenes.
- Texto real y seleccionable: la fuente Inter (`curriculum/fonts/`, licencia OFL) va incrustada con su mapa Unicode, así el texto se puede extraer.
- Encabezados convencionales y fechas con formato uniforme.
- Metadatos del PDF (título y autor) completos.
- Colores sobrios, legibles también en blanco y negro.

## Datos personales

El JSON incluye teléfono y correo porque van impresos en el CV. Esta documentación no los repite.
