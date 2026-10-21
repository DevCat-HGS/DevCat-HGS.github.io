---
titulo: El README del perfil de GitHub
seccion: Perfil de GitHub
resumen: Cómo se arman el README del perfil y sus gráficas, cómo se publica en el repositorio público y qué workflows lo mantienen al día.
orden: 8
---

## Dos repositorios

- **Este repo privado** (`DevCat-HGS/portfolio-hgs`) tiene la fuente: `README.md` (inglés), `README.es.md` (español), `profile/`, `privacity/` y `scripts/`.
- **El repo público** `DevCat-HGS/DevCat-HGS` solo recibe el README y sus imágenes. El código del portafolio, los workflows y el historial no salen de aquí (comentario de `publish-profile.yml`).

## Qué tiene el README

Banner (`profile/banner.svg`), insignias (portafolio, LinkedIn, DevPanel, estado de Netlify, visitas), tecnologías con íconos de skillicons.dev, experiencia (MIGOZZ y Mitsubishi Electric de Colombia), proyectos destacados, la sección de repos privados elegidos, gráficas de lenguajes, racha de contribuciones y contacto.

`README.md` y `README.es.md` se editan a mano, salvo el bloque entre `<!-- PRIVATE-REPOS:START -->` y `<!-- PRIVATE-REPOS:END -->`.

## Gráficas de lenguajes

`scripts/generate_language_charts.py` consulta la API de GitHub y dibuja `profile/languages.svg` y `profile/languages.es.svg`. Mide dos cosas: volumen de código (bytes por lenguaje) y amplitud de uso (en cuántos repos aparece).

Para no deformar los datos descarta:

- repos copiados o con artefactos (`SKIPPED_REPOS`: GameDB, UnityCW, GameExp, RespaldoGame);
- lenguajes generados por motores o sistemas de build, y SVG (`IGNORED_LANGUAGES`);
- repos subidos desde otros proyectos donde la mayoría de los commits humanos no son propios (cuenta los de `DevCat-HGS` y la cuenta anterior `Catnova0106`).

## Repos privados elegidos

`privacity/update_private_repos.py` escribe la tabla de repos privados en los dos README a partir de `privacity/featured.json`. Nada se publica por defecto: un repo aparece solo si se agrega ahí, con título y descripción públicos en los dos idiomas. Los privados salen sin enlace. `blocked_terms` lista palabras prohibidas (por ejemplo nombres de clientes): si aparece una, el script falla. Hoy `featured.json` no tiene repos, así que la sección no se muestra.

Opciones: `--check` (no escribe, falla si algo está desactualizado) y `--no-verify` (sin llamadas a la API).

## Workflows

| Workflow | Cuándo | Qué hace |
| :-- | :-- | :-- |
| `metrics.yml` (Metrics) | Diario 06:00 UTC, a mano, o al cambiar el script o el workflow en `main` | Corre `generate_language_charts.py` con `METRICS_TOKEN` y commitea las gráficas si cambiaron. |
| `privacity.yml` (Privacity) | Diario 06:30 UTC, a mano, o al cambiar `featured.json`, el script o el workflow en `main` o `desarrollo` | Actualiza la tabla de repos privados y commitea los README si cambiaron. |
| `publish-profile.yml` (Publish profile) | Push a `main` que toque `README.md`, `README.es.md`, `profile/*.svg` o el workflow; al terminar bien Metrics o Privacity; a mano | Clona `DevCat-HGS/DevCat-HGS` con `METRICS_TOKEN`, copia los dos README, `banner.svg` y las dos gráficas, y hace push si hay cambios. |

`METRICS_TOKEN` es un secreto del repositorio en GitHub (no está en el código). Según `privacity/README.md`, sirve un token clásico con alcance `repo` o uno fine-grained con lectura de metadatos; para publicar el perfil además necesita escribir en `DevCat-HGS/DevCat-HGS` (por confirmar en GitHub).

## Archivos sin uso

`profile/stats.svg` y `profile/calendar.svg` no los referencia ningún README ni workflow (vienen de commits del 2026-09-21). La carpeta `img/` (imágenes del README antiguo) salió del repositorio en el commit `236c9d3` y ahora está en `.gitignore`: solo existe en el equipo de Harol. Ver [pendientes](pendientes.md).
