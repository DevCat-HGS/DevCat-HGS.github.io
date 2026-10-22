---
titulo: Workflows, despliegues y ramas
seccion: Operación
resumen: Qué hace cada workflow de GitHub Actions, cuándo corre y qué bloquea; el espejo público del código; los dos sitios de Netlify con sus previews; Dependabot y las ramas main y desarrollo.
orden: 9
---

## Ramas

Solo hay dos: `main` (producción, la que despliega Netlify y la que edita el admin) y `desarrollo`. Los workflows `Curriculum`, `Privacity` y `Secret scan` corren en las dos; los demás, en pull requests y en `main`. El commit `bf84696` actualizó los workflows al nombre `desarrollo` (antes `portafolio`).

## Workflows

Todos en `.github/workflows/`.

| Workflow | Cuándo corre | Qué hace | Qué bloquea |
| :-- | :-- | :-- | :-- |
| `portfolio-ci.yml` (Portfolio CI) | PR y push a `main` que toquen `portfolio/**`, el código de servidor del admin (sus pruebas viven en `portfolio/tests/`) o el workflow; a mano (lo lanza `Images`) | Job `check`: typecheck, lint, formato, `npm run images`, pruebas y build. Job `quality`: Lighthouse (5 corridas), axe, teclado y capturas; sube reportes y comenta el PR con las cifras frente a `main`. | El check del PR falla si falla cualquier paso, un presupuesto de Lighthouse o una prueba de navegador. |
| `admin-ci.yml` (Admin CI) | PR y push a `main` que toquen `admin/**` o el workflow | `npm ci` y `npm run build` del admin (incluye typecheck de la app y de las funciones). | Check del PR. |
| `images.yml` (Images) | PR que toque `portfolio/images/**` o `scripts/images.mjs`; push a `main` que toque `portfolio/images/**` | Regenera todos los WebP, comprueba los presupuestos de peso y commitea `public/` en la misma rama; después lanza `Portfolio CI` sobre el commit nuevo (un push con `GITHUB_TOKEN` no dispara otros workflows). En forks falla si las imágenes no están al día. | Check del PR si un WebP excede su presupuesto. |
| `curriculum.yml` (Curriculum) | Push a `main` o `desarrollo` (ignora cambios solo en los PDF); a mano | Genera los PDF del CV y commitea si cambiaron. | Nada. |
| `links.yml` (Links) | Lunes 12:00 UTC, a mano, PR que toque `portfolio/src/content/**` o `curriculum/cv_data.json` | Revisa con lychee las URL de `portfolio/src/content/*.ts`, `portfolio/src/content/data/*.json`, `curriculum/cv_data.json` y los dos README. Fuera de PR abre, actualiza o cierra un único issue `broken-links`. Excluye LinkedIn, wa.me, shields.io, `mailto:`, hechoensabaneta.com y páginas `/blob/` del repo público. | En PR, falla si hay enlaces rotos. |
| `og.yml` (Open Graph image) | Push a `main` que toque `scripts/og-template.html` u `og.mjs`; a mano | Renderiza `public/og.png` con Playwright y lo commitea. | Nada. |
| `github-data.yml` (GitHub data) | Lunes 06:15 UTC; a mano | Actualiza `portfolio/src/data/github.json` y commitea si cambió. | Nada. |
| `preview-comment.yml` (Preview comment) | Evento `status` de Netlify | Un comentario por sitio (Portafolio, Admin) y por PR con el enlace del deploy preview, editado en cada deploy. | Nada. |
| `release.yml` (Release) | Solo a mano | Release Please: PR de versión con `CHANGELOG.md` desde los mensajes Conventional Commits. | Nada. |
| `secret-scan.yml` (Secret scan) | Push a `main` o `desarrollo`, todo PR; a mano | gitleaks 8.30.1 (en Docker) revisa todo el historial en busca de claves, tokens y llaves privadas, con los valores tapados en el registro. | Check del PR si encuentra un secreto. |
| `publish-docs.yml` (Publish docs) | Push a `main` que toque `Doc/**` o el workflow; a mano | Vacía la raíz de `DevCat-HGS/DevCat-HGS.github.io` y escribe ahí la edición pública con `node Doc/build.mjs --public site` (su `index.html` y sus `.md`), más `.nojekyll` y el `CNAME` de `docs.hgsportafolio.site`. Empuja con una llave de despliegue que solo escribe en ese repositorio. | Nada. |
| `publish-code.yml` (Publish code) | Push a `main` que toque `portfolio/**`, `.gitattributes`, `.github/mirror/**`, los seis workflows del sitio o el propio workflow; a mano | Copia la lista blanca de `.github/mirror/build.sh` al espejo público `DevCat-HGS/hgsportafolio` y hace un commit si algo cambió. Ver abajo. | Nada. |
| `metrics.yml`, `privacity.yml`, `publish-profile.yml` | Ver [perfil de GitHub](perfil-github.md) | Gráficas, repos privados y copia al repo público. | Nada. |

Notas:

- `preview-comment.yml` corre siempre desde la rama por defecto: un cambio en él solo surte efecto al llegar a `main`.
- La línea base de Lighthouse se guarda como artefacto `lighthouse-baseline` (90 días) en cada push a `main`; los PR la descargan para comparar.
- Release Please parte de la versión `1.0.0` (`.release-please-manifest.json`) con `release-type: simple`.

## Espejo público del código

Desde el commit `5795692` (2026-10-22), el código del sitio se puede leer en `https://github.com/DevCat-HGS/hgsportafolio`, un repositorio público de solo lectura. Este repositorio sigue privado; el espejo es una copia parcial que se rehace en cada push.

- **Lista blanca.** `.github/mirror/build.sh` copia solo lo que nombra: los archivos versionados de `portfolio/` (con `git ls-files`, así nada ignorado como `node_modules`, `dist` o `.env` puede colarse), `.gitattributes` y seis workflows (`portfolio-ci`, `images`, `og`, `links`, `secret-scan` y `github-data`). Todo lo nuevo en el repositorio queda privado hasta que se agregue ahí. Nunca copia el admin, los datos del CV (`cv_data.json` lleva teléfono y correo), el perfil de GitHub ni la lista de repos privados.
- **Pruebas que se quedan.** Las tres pruebas de `portfolio/tests/` que importan código del admin no se copian, porque el espejo no tiene `admin/`.
- **Última barrera.** Al terminar, el script busca en la copia rutas `admin/`, `cv_data.json` o `privacity/`; si encuentra una, falla y no se publica nada.
- **README propio.** `.github/mirror/README.md` pasa a ser el `README.md` del espejo: dice qué hay, qué falta a propósito y cómo correr el sitio.
- **Historial limpio.** Cada corrida añade un solo commit al espejo, así su historial empieza limpio y no arrastra el de este repositorio. El asunto del commit es el del commit de origen, salvo que mencione el admin: entonces queda «Actualiza el sitio». El cuerpo dice «Espejo de» y el hash corto de origen. Si no cambió nada, no hay commit.
- **Actions apagadas.** El espejo tiene GitHub Actions desactivadas (comentario de `publish-code.yml`; es configuración de GitHub, fuera del código): sus workflows están para leerse y corren aquí.
- **Una llave por repositorio.** El workflow empuja con una llave de despliegue SSH que solo puede escribir en `DevCat-HGS/hgsportafolio`.


## Netlify

| Sitio | Carpeta | Dominio | Build |
| :-- | :-- | :-- | :-- |
| `portafolio-hgs` | `portfolio/` | `hgsportafolio.site` (y `portafolio-hgs.netlify.app` como respaldo) | `npm run images && npm run build`, publica `dist`. |
| `admin-hgs` | `admin/` (base directory) | `admin.hgsportafolio.site` | `npm run build`, publica `dist`. Solo construye si cambió `admin/`. |

- **Deploy previews:** Netlify publica un preview por PR en cada sitio y lo reporta como estado `netlify/<sitio>/deploy-preview`; `preview-comment.yml` lo convierte en comentario. El preview del admin pide la misma entrada que producción y puede apuntar a la rama del PR.
- **Funciones:** solo el admin tiene funciones serverless: la entrada, el intermediario de GitHub, el formulario del portafolio, la lectura de mensajes y el resumen semanal programado (lunes 13:00 UTC = 8:00 de Bogotá). El portafolio ya no tiene funciones (commit `f4be780`). Como `admin-hgs` solo se reconstruye cuando cambia `admin/`, un cambio en la lógica del formulario despliega el admin, no el portafolio.
- **Caché:** los archivos con hash (`/assets/*`) se guardan un año; imágenes, íconos, MIGOZZ y CV se revalidan en cada visita (`portfolio/netlify.toml`).
- Si un check de GitHub Actions detiene o no un deploy de producción depende del panel de Netlify (por confirmar). Lo que sí detiene un deploy es que falle el build de Netlify, que incluye el typecheck.


## Página de la documentación

`Doc/` no se despliega en Netlify sino en GitHub Pages, con el workflow `publish-docs.yml`: el repositorio público `DevCat-HGS/DevCat-HGS.github.io`, servido en `https://docs.hgsportafolio.site`. El workflow escribe el archivo `CNAME` en cada publicación porque reemplaza toda la raíz del sitio; antes, la siguiente publicación borraba el dominio (commit `83ccd6b`). El historial de ese repositorio guarda las ediciones anteriores.

`Doc/build.mjs` arma la página a partir de los `.md`, en dos ediciones:

| Edición | Comando | Dónde queda | Qué lleva |
| :-- | :-- | :-- | :-- |
| Completa | `node Doc/build.mjs` | `Doc/index.html`, solo en este repositorio privado | Todo. Solo quita las líneas de marcado. |
| Pública | `node Doc/build.mjs --public <carpeta>` | La carpeta indicada; `publish-docs.yml` la escribe en la raíz de `DevCat-HGS.github.io` | Deja fuera los artículos marcados como privados y los trozos marcados dentro de los demás; los enlaces a artículos que faltan salen como texto. También escribe los `.md` con los mismos cortes. |

Así la documentación pública no explica cómo está hecho el admin. Desde `6a21775` la página es siempre clara (`color-scheme: light`, sin modo oscuro), con tinta oscura sobre papel crema (`--paper: #f6efe4`), para que se lea igual en todos los sistemas. El caso de estudio `/portafolio/` enlaza a esta página y al espejo del código (ver [portafolio](portafolio.md)).


## Dependabot

`.github/dependabot.yml` revisa cada semana:

- npm en `/portfolio` (máximo 5 PR abiertos, dependencias de desarrollo agrupadas en `dev-tooling`);
- npm en `/admin`, con las mismas reglas;
- GitHub Actions en `/`.

El 2026-10-21 (`f3089f8`) se subió Vite a 8.3.5 en los dos proyectos a mano, lo que cerró las 12 alertas abiertas (ver [seguridad](seguridad.md)).

## Plantilla de pull request

`.github/pull_request_template.md` pide resumen, cambios, tipo de cambio y verificación: build del portafolio, revisión en móvil y escritorio, en ES y EN, y sin regresiones de accesibilidad.
