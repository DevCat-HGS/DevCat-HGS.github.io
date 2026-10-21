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
| Activar Umami: crear el sitio en `cloud.umami.is` (Add website), copiar el Website ID, ponerlo como `VITE_UMAMI_WEBSITE_ID` en el sitio `portafolio-hgs` y volver a desplegar. | Los eventos (descarga del CV, clics en proyectos, redes, MIGOZZ y envío del formulario) ya están en el código, pero sin el ID no se registra nada. Ver [portafolio](portafolio.md). |
| Dar los datos para las cifras de los proyectos: un resultado medible por proyecto (usuarios, tiempos, volumen, ahorro) con su fuente y fecha. | Hoy el campo `result` de `projects.json` es cualitativo («Entregado al cliente», «Escalamiento humano incluido»). Una cifra con fuente pesa más ante un reclutador, y el sitio no muestra cifras inventadas. |
| Dar los datos del caso de estudio de ARIA: problema, papel de Harol, arquitectura, resultados, fechas y qué es confidencial. | ARIA hoy es solo una tarjeta en `projects.json` (cliente Arix Group, stack AWS, Bedrock, OpenSearch). Sin esos datos no se puede escribir el caso, y lo confidencial debe quedar fuera desde el principio. |

Detalle de variables en [configuración](configuracion.md).

## Mejoras sugeridas

- **Sanear los SVG subidos desde el admin.** Los íconos se guardan tal cual en `portfolio/public/icons/`. La CSP del portafolio bloquea scripts en línea, pero limpiar el SVG (o rechazar los que traen `<script>` o manejadores `on*`) cierra la puerta del todo.
- **Archivos sin uso.** `profile/stats.svg` y `profile/calendar.svg` no los referencia nada. Borrarlos aligera el repo y evita confusiones. (La carpeta `img/` ya salió del repositorio en `236c9d3`, aunque sigue en el historial de git.)
- **Limpieza del almacén `contact-messages`.** Los contadores diarios (`limit:day:<fecha>`) y por IP nunca se borran, y la estación «Mensajes» solo muestra los 200 más nuevos. No es urgente, pero una limpieza periódica evita que crezca sin fin y que haya mensajes viejos que no se ven.
- **Cifras de Lighthouse en el README del portafolio.** Están escritas a mano y envejecen; el comentario del PR y el artefacto `lighthouse-baseline` ya tienen las actuales.
- **Borradores de imágenes.** Las imágenes subidas en el admin se pierden al recargar (solo los JSON se guardan como borrador). Avisarlo en la interfaz evita sorpresas.
- **Release Please.** Corre solo a mano y aún no hay `CHANGELOG.md`. Si se quieren versiones, hay que lanzarlo o agregar el disparador `push` a `main` que ya está comentado en `release.yml`.
