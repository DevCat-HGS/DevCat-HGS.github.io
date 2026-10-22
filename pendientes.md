---
titulo: Lo que falta y lo que conviene mejorar
seccion: Pendientes
resumen: Pasos que dependen de Harol y mejoras sugeridas, cada una con su porqué.
orden: 14
---

## Depende de Harol

| Pendiente | Por qué importa |
| :-- | :-- |
| Configurar en `admin-hgs` las variables `ADMIN_GITHUB_TOKEN`, `ADMIN_PIN`, `SESSION_SECRET`, `ADMIN_EMAIL`, `RESEND_API_KEY` y `ADMIN_MAIL_FROM`, más `CONTACT_TO` y `CONTACT_FROM` para el formulario. | Sin ellas el admin no deja entrar (sin PIN o secreto responde 503 y sin Resend no llega el código) y el formulario no envía correos. |
| Elegir un `ADMIN_PIN` que no se pueda deducir de datos públicos (ni números de nombres de usuario actuales o anteriores, ni fechas o teléfonos publicados) y de más de 4 dígitos. | Los límites solo frenan los intentos al azar; un PIN deducible se acierta en pocos intentos y deja como única barrera el correo. Ver [seguridad](seguridad.md). |
| Quitar de `portafolio-hgs` `RESEND_API_KEY`, `CONTACT_TO` y `CONTACT_FROM`, si se llegaron a poner. | Desde `f4be780` el portafolio no las usa; dejarlas solo deja una copia más de la clave de Resend. |
| Enviar un mensaje de prueba desde `hgsportafolio.site` (en español y en inglés) y confirmar que llegan los dos correos: la copia a Harol y la confirmación al visitante. | Es la prueba real del flujo nuevo; las pruebas automáticas simulan Resend y la función. Si no llegan, el mensaje debe verse igual en la estación «Mensajes», y el error queda en el registro de la función `contact` en Netlify. |
| Verificar `hgsportafolio.site` en Resend y copiar sus registros DNS en Hostinger. | Resend solo envía desde dominios verificados; sin eso no salen ni los códigos del admin ni los correos del formulario. |
| Confirmar el `CNAME` de `admin.hgsportafolio.site` y que `admin-hgs` use base directory `admin`. | Es lo que hace que el admin exista en su dominio (`admin/README.md`). |
| Confirmar que `METRICS_TOKEN` puede escribir en `DevCat-HGS/DevCat-HGS`. | `publish-profile.yml` lo usa para hacer push al repo público. |
| Llenar `migozz-users.json` con cifras reales y su fuente, y activar `visible`. | Las gráficas de usuarios del caso MIGOZZ están ocultas hasta entonces, a propósito. |
| Subir capturas de la app a MIGOZZ (`shots`). | La sección de capturas del caso no aparece mientras la lista esté vacía. |
| Activar Umami: crear el sitio en `cloud.umami.is` (Add website) y poner en `VITE_UMAMI_WEBSITE_ID` del sitio `portafolio-hgs` solo el UUID del sitio (no el `<script>` completo); luego volver a desplegar. | Los eventos ya están en el código. Desde `b7461ec` el build extrae el UUID aunque se pegue el fragmento entero, pero dejar solo el UUID evita sorpresas si ese código cambia. Ver [portafolio](portafolio.md). |
| Activar el resumen semanal: en el sitio `admin-hgs`, configurar `UMAMI_API_KEY` y `UMAMI_WEBSITE_ID` (y, opcional, `GSC_SERVICE_ACCOUNT`, con el correo de esa cuenta agregado como usuario en Search Console), y, si se quiere otro destino que el del formulario, `DIGEST_TO`. Probar con Run now. | Sin al menos una fuente la función `weekly-digest` falla cada lunes y no llega ningún correo. Ver [admin](admin.md). |
| Pedir en Search Console la indexación de `/`, de `/aria/`, de `/devpanel/` y de `/portafolio/` (y sus versiones `/en/`). | La portada cambió de textos, de respaldo y ganó la franja de DevPanel y la tarjeta del portafolio, y `/aria/`, `/devpanel/` y `/portafolio/` son nuevas; pedirlo acelera que Google las lea. También puede adelantar el cambio del globo por el favicon (ver [dominio y SEO](dominio-y-seo.md)). |
| Confirmar con Arix Group las cifras publicadas en `/aria/` y en la tarjeta (tiempos de respuesta, número de SAP Notes, stacks). | Es un proyecto de cliente: las cifras deben estar aprobadas por ellos antes de que circulen. Se corrigen en la estación ARIA del admin. |
| Decidir si el portafolio tendrá un repositorio público (aplazado por Harol). | Hacerlo exige un repo nuevo con historial limpio, no cambiar la visibilidad de este. Ver [seguridad](seguridad.md). |
| Dar los datos para las cifras de los proyectos: un resultado medible por proyecto (usuarios, tiempos, volumen, ahorro) con su fuente y fecha. | Salvo ARIA, que ya tiene un tiempo medido, el campo `result` de `projects.json` es cualitativo (por ejemplo «Entregado al cliente»). Una cifra con fuente pesa más ante un reclutador, y el sitio no muestra cifras inventadas. |

Detalle de variables en [configuración](configuracion.md).

## Mejoras sugeridas

- **Archivos sin uso.** `profile/stats.svg` y `profile/calendar.svg` no los referencia nada. Borrarlos aligera el repo y evita confusiones.
- **Limpieza del almacén `contact-messages`.** Los contadores diarios (`limit:day:<fecha>`) y por IP nunca se borran, y la estación «Mensajes» solo muestra los 200 más nuevos. No es urgente, pero una limpieza periódica evita que crezca sin fin y que haya mensajes viejos que no se ven.
- **Cifras escritas a mano en el caso Portafolio.** «14 workflows» y «más de 100 pruebas» están en `portafolio.json`, `projects.json` y `seo.json` como texto fijo. Hoy coinciden con `.github/workflows/` (14 archivos) y con las pruebas de `portfolio/tests/`, pero envejecen con cada workflow o prueba nueva. Una prueba que compare la cifra con el número de archivos en `.github/workflows/` avisaría del desfase.
- **Cifras de Lighthouse en el README del portafolio.** Están escritas a mano y envejecen; el comentario del PR y el artefacto `lighthouse-baseline` ya tienen las actuales.
- **Borradores de imágenes.** Las imágenes subidas en el admin se pierden al recargar (solo los JSON se guardan como borrador). Avisarlo en la interfaz evita sorpresas.
- **Release Please.** Corre solo a mano y aún no hay `CHANGELOG.md`. Si se quieren versiones, hay que lanzarlo o agregar el disparador `push` a `main` que ya está comentado en `release.yml`.
- **Ramas y PR de Dependabot.** Las ramas `dependabot/.../vite-8.3.5` siguen en el remoto aunque sus PR ya no están abiertos (Vite subió en `f3089f8`); se pueden borrar. Quedan PR abiertos de Dependabot (React 19.3.1 y `@netlify/blobs` en el admin, herramientas de desarrollo en los dos); revisarlos con `gh pr list` y fusionarlos si pasan CI.
