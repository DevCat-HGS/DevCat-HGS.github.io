---
titulo: Workflows, despliegues y ramas
seccion: Operación
resumen: Qué hace cada workflow de GitHub Actions, cuándo corre y qué bloquea; los dos sitios de Netlify con sus previews; Dependabot y las ramas main y desarrollo.
orden: 9
---

## Ramas

Solo hay dos: `main` (producción, la que despliega Netlify y la que edita el admin) y `desarrollo`. Los workflows `Curriculum`, `Privacity` y `Secret scan` corren en las dos; los demás, en pull requests y en `main`. El commit `bf84696` actualizó los workflows al nombre `desarrollo` (antes `portafolio`).

## Workflows

Todos en `.github/workflows/`.

| Workflow | Cuándo corre | Qué hace | Qué bloquea |
| :-- | :-- | :-- | :-- |
| `portfolio-ci.yml` (Portfolio CI) | PR y push a `main` que toquen `portfolio/**`, `admin/netlify/**` o el workflow; a mano (lo lanza `Images`) | Job `check`: typecheck, lint, formato, `npm run images`, pruebas y build. Job `quality`: Lighthouse (5 corridas), axe, teclado y capturas; sube reportes y comenta el PR con las cifras frente a `main`. | El check del PR falla si falla cualquier paso, un presupuesto de Lighthouse o una prueba de navegador. |
| `admin-ci.yml` (Admin CI) | PR y push a `main` que toquen `admin/**` o el workflow | `npm ci` y `npm run build` del admin (incluye typecheck de la app y de las funciones). | Check del PR. |
| `images.yml` (Images) | PR que toque `portfolio/images/**` o `scripts/images.mjs`; push a `main` que toque `portfolio/images/**` | Regenera todos los WebP, comprueba los presupuestos de peso y commitea `public/` en la misma rama; después lanza `Portfolio CI` sobre el commit nuevo (un push con `GITHUB_TOKEN` no dispara otros workflows). En forks falla si las imágenes no están al día. | Check del PR si un WebP excede su presupuesto. |
| `curriculum.yml` (Curriculum) | Push a `main` o `desarrollo` (ignora cambios solo en los PDF); a mano | Genera los PDF del CV y commitea si cambiaron. | Nada. |
| `links.yml` (Links) | Lunes 12:00 UTC, a mano, PR que toque `portfolio/src/content/**` o `curriculum/cv_data.json` | Revisa con lychee las URL de `portfolio/src/content/*.ts`, `portfolio/src/content/data/*.json`, `curriculum/cv_data.json` y los dos README. Fuera de PR abre, actualiza o cierra un único issue `broken-links`. Excluye LinkedIn, wa.me, shields.io, `mailto:`, hechoensabaneta.com y páginas `/blob/` del repo público. | En PR, falla si hay enlaces rotos. |
| `og.yml` (Open Graph image) | Push a `main` que toque `scripts/og-template.html` u `og.mjs`; a mano | Renderiza `public/og.png` con Playwright y lo commitea. | Nada. |
| `github-data.yml` (GitHub data) | Lunes 06:15 UTC; a mano | Actualiza `portfolio/src/data/github.json` y commitea si cambió. | Nada. |
| `preview-comment.yml` (Preview comment) | Evento `status` de Netlify | Un comentario por sitio (Portafolio, Admin) y por PR con el enlace del deploy preview, editado en cada deploy. | Nada. |
| `release.yml` (Release) | Solo a mano | Release Please: PR de versión con `CHANGELOG.md` desde los mensajes Conventional Commits. | Nada. |
| `secret-scan.yml` (Secret scan) | Push a `main` o `desarrollo`, todo PR; a mano | gitleaks 8.30.1 (en Docker) revisa todo el historial en busca de claves, tokens y llaves privadas, con los valores tapados en el registro. | Check del PR si encuentra un secreto. |
| `publish-docs.yml` (Publish docs) | Push a `main` que toque `Doc/**` o el workflow; a mano | Corre `node Doc/build.mjs` y reemplaza la raíz de `DevCat-HGS/DevCat-HGS.github.io` con los `.md` y el `index.html` de `Doc/`, usando el secreto `DOCS_DEPLOY_KEY`. | Nada. |
| `metrics.yml`, `privacity.yml`, `publish-profile.yml` | Ver [perfil de GitHub](perfil-github.md) | Gráficas, repos privados y copia al repo público. | Nada. |

Notas:

- `preview-comment.yml` corre siempre desde la rama por defecto: un cambio en él solo surte efecto al llegar a `main`.
- La línea base de Lighthouse se guarda como artefacto `lighthouse-baseline` (90 días) en cada push a `main`; los PR la descargan para comparar.
- Release Please parte de la versión `1.0.0` (`.release-please-manifest.json`) con `release-type: simple`.

## Netlify

| Sitio | Carpeta | Dominio | Build |
| :-- | :-- | :-- | :-- |
| `portafolio-hgs` | `portfolio/` | `hgsportafolio.site` (y `portafolio-hgs.netlify.app` como respaldo) | `npm run images && npm run build`, publica `dist`. |
| `admin-hgs` | `admin/` (base directory) | `admin.hgsportafolio.site` | `npm run build`, publica `dist`. Solo construye si cambió `admin/`. |

- **Deploy previews:** Netlify publica un preview por PR en cada sitio y lo reporta como estado `netlify/<sitio>/deploy-preview`; `preview-comment.yml` lo convierte en comentario. El preview del admin entra con el mismo PIN y código y puede apuntar a la rama del PR con `?branch=<rama>`.
- **Funciones:** solo en el admin: `auth.mts` (entrada), `github.mts` (intermediario de GitHub), `contact.mts` (formulario del portafolio), `messages.mts` (estación «Mensajes») y `weekly-digest.mts` (función programada, lunes 13:00 UTC = 8:00 de Bogotá; se lanza a mano con Run now), en `admin/netlify/functions/`. El portafolio ya no tiene funciones (commit `f4be780`). Como `admin-hgs` solo se reconstruye cuando cambia `admin/`, un cambio en la lógica del formulario despliega el admin, no el portafolio.
- **Caché:** los archivos con hash (`/assets/*`) se guardan un año; imágenes, íconos, MIGOZZ y CV se revalidan en cada visita (`portfolio/netlify.toml`).
- Si un check de GitHub Actions detiene o no un deploy de producción depende del panel de Netlify (por confirmar). Lo que sí detiene un deploy es que falle el build de Netlify, que incluye el typecheck.

## Dependabot

`.github/dependabot.yml` revisa cada semana:

- npm en `/portfolio` (máximo 5 PR abiertos, dependencias de desarrollo agrupadas en `dev-tooling`);
- npm en `/admin`, con las mismas reglas;
- GitHub Actions en `/`.

El 2026-10-21 (`f3089f8`) se subió Vite a 8.3.5 en los dos proyectos a mano, lo que cerró las 12 alertas abiertas (ver [seguridad](seguridad.md)).

## Plantilla de pull request

`.github/pull_request_template.md` pide resumen, cambios, tipo de cambio y verificación: build del portafolio, revisión en móvil y escritorio, en ES y EN, y sin regresiones de accesibilidad.
