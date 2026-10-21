---
titulo: Variables de entorno y lo que falta configurar
seccion: Operación
resumen: Cada variable de cada sitio, qué hace y dónde se pone, sin valores, y la lista de pasos pendientes para que el admin, los correos y la analítica funcionen.
orden: 11
---

Las variables de producción van en Netlify: *sitio → Project configuration → Environment variables*. Para probar en local se copia el `.env.example` de cada carpeta a `.env` (ignorado por git) y se usa `npx netlify dev`. Nunca se sube un `.env` con valores reales.

## Sitio del admin (`admin-hgs`)

Plantilla: `admin/.env.example`.

| Variable | Obligatoria | Qué hace |
| :-- | :-- | :-- |
| `ADMIN_GITHUB_TOKEN` | Sí | Token de GitHub que usa `/api/github` para leer y publicar. Fine-grained, solo el repo `portfolio-hgs`, permiso «Contents: Read and write». El navegador nunca lo ve. |
| `ADMIN_PIN` | Sí | PIN de entrada, 4 o más dígitos. Sin él nadie entra (respuesta 503). |
| `SESSION_SECRET` | Sí | Firma de sesiones y retos. 32 caracteres aleatorios o más; cambiarlo cierra todas las sesiones. `.env.example` trae el comando de Node para generarlo. |
| `ADMIN_EMAIL` | No | Correo que recibe los códigos y los avisos de bloqueo. Tiene un valor por defecto en el código. |
| `RESEND_API_KEY` | Sí | Clave de Resend para todos los correos: los códigos de acceso y los dos del formulario de contacto. Sin ella el PIN correcto devuelve error de correo y el formulario guarda el mensaje pero no envía correos. |
| `ADMIN_MAIL_FROM` | No | Remitente de los códigos, en el dominio verificado. Por defecto `Admin HGS <admin@hgsportafolio.site>`. |
| `CONTACT_TO` | No | Dónde llegan los mensajes del formulario. Si falta, usa `ADMIN_EMAIL` (y si también falta, un valor por defecto del código). |
| `CONTACT_FROM` | No | Remitente de la copia a Harol y de la confirmación al visitante. Por defecto `Harol Guerrero Salgado <contacto@hgsportafolio.site>`. |

El estado de la entrada (contadores, retos, sesiones) va en Netlify Blobs, almacén `admin-auth`; los mensajes del formulario y sus límites, en el almacén `contact-messages`. Ninguno necesita configuración.

## Sitio del portafolio (`portafolio-hgs`)

Plantilla: `portfolio/.env.example`. Desde el commit `f4be780` el portafolio ya no envía correos: `RESEND_API_KEY`, `CONTACT_TO` y `CONTACT_FROM` van en `admin-hgs`, no aquí. Si quedaron puestas en `portafolio-hgs`, ya no las usa nada y se pueden borrar.

| Variable | Obligatoria | Qué hace |
| :-- | :-- | :-- |
| `VITE_SITE_URL` | Ya fijada | Dominio de producción. Está en `portfolio/netlify.toml`, no hace falta ponerla en el panel. |
| `VITE_UMAMI_WEBSITE_ID` | No | Website ID de Umami Cloud (`cloud.umami.is` → Add website). Activa la analítica sin cookies y abre sus orígenes en la CSP. Se lee al construir: tras ponerla hay que volver a desplegar. Vacía = apagada. Eventos en [portafolio](portafolio.md). |

Netlify define además `URL`, que el build usa solo si falta `VITE_SITE_URL`.

## Variables de pruebas locales

| Variable | Dónde | Qué hace |
| :-- | :-- | :-- |
| `PW_CHANNEL` | Playwright | `chrome` para usar el Chrome instalado. |
| `CHROME_PATH` | Lighthouse | Ruta del navegador. |
| `LH_URL`, `LH_RUNS` | `scripts/lighthouse.mjs` | Dirección y número de corridas (3 por defecto; CI usa 5). |
| `SCREENSHOTS` | Playwright | En CI, `1` para guardar capturas. |

## Secretos de GitHub Actions

| Secreto | Lo usan | Para qué |
| :-- | :-- | :-- |
| `METRICS_TOKEN` | `metrics.yml`, `privacity.yml`, `publish-profile.yml` | Leer repos (incluidos privados) para gráficas y tabla, y hacer push al repo público del perfil. |

Los demás workflows usan el `GITHUB_TOKEN` automático.

## Checklist de lo que falta

Pendiente de Harol a la fecha de esta edición (según `admin/README.md`, los `.env.example` y los commits `bf84696` y `f4be780`). No se puede comprobar desde el repositorio qué variables ya están puestas en Netlify:

- [ ] En `admin-hgs`: `ADMIN_GITHUB_TOKEN`, `ADMIN_PIN`, `SESSION_SECRET`, `ADMIN_EMAIL`, `RESEND_API_KEY`, `ADMIN_MAIL_FROM`, `CONTACT_TO`, `CONTACT_FROM`.
- [ ] En `portafolio-hgs`: `VITE_UMAMI_WEBSITE_ID`, si se quiere analítica. Quitar `RESEND_API_KEY`, `CONTACT_TO` y `CONTACT_FROM` si siguen ahí.
- [ ] Enviar un mensaje de prueba desde el formulario y confirmar que llegan los dos correos (la copia y la confirmación) y que aparece en la estación «Mensajes».
- [ ] En Resend: agregar y verificar el dominio `hgsportafolio.site`, copiando sus registros DNS en Hostinger.
- [ ] Confirmar que `admin.hgsportafolio.site` tiene su `CNAME` hacia `admin-hgs.netlify.app` y que `admin-hgs` tiene base directory `admin`.
- [ ] Dejar activos los deploy previews de PR en los dos sitios.

**Mientras falten:** el admin no deja entrar (sin PIN ni secreto responde 503; sin Resend no llega el código) y el formulario no envía correos, aunque sí guarda los mensajes en el almacén `contact-messages` para leerlos en «Mensajes» cuando se pueda entrar.

Después de cambiar variables en Netlify hay que volver a desplegar el sitio para que las funciones las tomen (comportamiento de Netlify, por confirmar en el panel si se aplica solo).
