---
titulo: El README del perfil de GitHub
seccion: Perfil de GitHub
resumen: Cómo se arman el README del perfil y sus gráficas, cómo se publica en el repositorio público, qué workflows lo mantienen al día y qué código se publica.
orden: 8
---

## Dos repositorios

- **Este repo privado** (`DevCat-HGS/portfolio-hgs`) tiene la fuente: `README.md` (inglés), `README.es.md` (español), `profile/`, `privacity/` y `scripts/`.
- **El repo público** `DevCat-HGS/DevCat-HGS` solo recibe el README y sus imágenes (comentario de `publish-profile.yml`). El código del portafolio sale por otro camino, el espejo `DevCat-HGS/hgsportafolio`, que nunca lleva el perfil (ver [CI/CD](ci-cd.md)).

## Repos públicos de proyectos

El 2026-10-21 se publicaron dos proyectos de la formación en el SENA como repos públicos nuevos:

| Repo | Proyecto | Enlazado desde |
| :-- | :-- | :-- |
| `DevCat-HGS/sena-cloud` | SENA Cloud | Tarjeta «SENA Cloud» del portafolio (`code` en `projects.json`) |
| `DevCat-HGS/sensores-app` | SensoresAPP | Tarjeta «SensoresAPP» del portafolio |

Son copias limpias en un solo commit, no los repos originales con la visibilidad cambiada: sin archivos `.env` (solo plantillas `.env.example`), sin la IP ni el dominio del servidor, sin contraseñas de prueba y sin documentos de compañeros. Así el historial de los originales no sale a la luz. Las tarjetas los enlazan con «Ver código» (commit `94f0f6a`).

### Regla: los repos de clientes se quedan privados

Por decisión de Harol, el código de los proyectos de clientes no se publica: Hecho en Sabaneta, ARIA, Arcoiris, CashWin y Farmacia siguen privados y sus tarjetas no llevan enlace de código. El campo `code` de un proyecto es solo para código propio (lo dicen el comentario de `ProjectEntry` en `portfolio/src/content/projects.ts` y la ayuda del campo en el admin). Si un proyecto de cliente debe mostrarse, se hace con un caso de estudio (como `/aria/`), no con el código.

### Cifra de repos públicos en el portafolio

`GithubStats.tsx` se oculta con menos de 3 repos públicos. `portfolio/src/data/github.json` lo actualiza el workflow `GitHub data` cada lunes; mientras no corra después de esta publicación, el archivo sigue con la cifra anterior. Se puede lanzar a mano desde Actions.

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
| `metrics.yml` (Metrics) | Diario 06:00 UTC, a mano, o al cambiar el script o el workflow en `main` | Corre `generate_language_charts.py` con un token guardado como secreto del repositorio y commitea las gráficas si cambiaron. |
| `privacity.yml` (Privacity) | Diario 06:30 UTC, a mano, o al cambiar `featured.json`, el script o el workflow en `main` o `desarrollo` | Actualiza la tabla de repos privados y commitea los README si cambiaron. |
| `publish-profile.yml` (Publish profile) | Push a `main` que toque `README.md`, `README.es.md`, `profile/*.svg` o el workflow; al terminar bien Metrics o Privacity; a mano | Clona `DevCat-HGS/DevCat-HGS` con el mismo token, copia los dos README, `banner.svg` y las dos gráficas, y hace push si hay cambios. |

El token es un secreto del repositorio en GitHub; su valor no está en el código.


## Archivos sin uso

`profile/stats.svg` y `profile/calendar.svg` no los referencia ningún README ni workflow (vienen de commits del 2026-09-21). La carpeta `img/` (imágenes del README antiguo) salió del repositorio en el commit `236c9d3` y ahora está en `.gitignore`: solo existe en el equipo de Harol.
