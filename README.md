# Vetro Steel Design Studio — Sitio web

Sitio de **Vetro Steel Design Studio LLC**, construido con **Astro + Tailwind
CSS v4**. El sitio está en **inglés**; esta documentación en español.

Terminología, paleta y taxonomía de producto salen del catálogo del cliente
(*PRODUCT CATALOG — MAY 2026, "Premium Glass Hardware & Architectural Systems"*):
**Sliding Systems · Shower Hardware · Pull Handles · Railings · Entrance Systems**.

---

## Arquitectura

El sitio pasó de landing de una página a multipágina, con una entrada propia
por vertical de negocio.

```
/              Home — hero, bifurcación de verticales, estudio, capacidades,
               obra destacada, valores, CTA
/commercial    Vertical comercial    ┐
/residential   Vertical residencial  ├ misma plantilla, distinta data
/maintenance   Mantenimiento B2B     ┘
/projects      Obra ejecutada + el arco dibujo → construido
/about         Estudio completo: about, misión, visión, capacidades, valores
/quote         Formulario de cotización
```

### Añadir una línea de negocio

Todo lo que define una vertical vive en [`src/data/verticals.ts`](src/data/verticals.ts).
Añadir una entrada al array `verticals` genera automáticamente:

- la página en `/<slug>` (vía [`src/pages/[vertical].astro`](src/pages/[vertical].astro))
- su URL en el sitemap
- su opción en el `<select>` del formulario de cotización
- su nodo `Service` en el JSON-LD
- su imagen de compartir en `/og/<slug>.png`
- su aceptación en el endpoint del formulario, que importa `verticalSlugs` en
  vez de mantener su propia lista

A mano quedan dos pasos: `mainNav` / `footerNav` en
[`src/data/site.ts`](src/data/site.ts) y la entrada en `routeSeo` de
[`src/data/seo.ts`](src/data/seo.ts) — sin ella la página hereda el `<title>`
del home.

No toda línea vende ferretería. `products`, `plans` y `planIntro` son
opcionales; una línea de servicio lleva `programs` y `serviceGroups` en su
lugar, y la plantilla omite el visor de planos y la parrilla de producto.

### Mantenimiento operativo B2B

`/maintenance` es la línea de suscripción, sacada del brief del cliente
(`requeriments/servicios.pdf`, "Mantenimiento Operativo B2B"). El brief está en
español y el sitio en inglés: la copia es esa traducción, no una ampliación.
Cubre servicios generales (pintura, yeso, mobiliario) y todo lo relacionado con
vidrio (limpieza, montaje/desmontaje, vinilos esmerilados, cambio de herrajes,
mantenimiento preventivo de bisagras, manijas, soportes, chapas y topes).

Lo que el brief promete y todavía no existe — panel directivo, tarifas, fotos
del equipo trabajando — está declarado en `gaps`, no descrito como si estuviera
hecho.

### Sistema de componentes

| Componente | Rol |
| ---------- | --- |
| `ui/Figure.astro` | **Único** punto donde se renderiza imagen. Todo pasa por `astro:assets` → AVIF/WebP + `srcset` |
| `ui/SectionHeader.astro` | Eyebrow + regla + titular, con `tone` claro/oscuro |
| `ui/CTABand.astro` | Bloque de cierre; `vertical` preselecciona el formulario |
| `ui/PageHeader.astro` | Cabecera de páginas sin hero fotográfico |
| `ui/MaterialNote.astro` | Marca de material pendiente (ver abajo) |
| `VerticalSplit` | Bifurcación de verticales en el home |
| `VerticalHero` `CategoryRow` `ProductGrid` `ProcessSteps` `ProjectGallery` | Secciones de vertical, alimentadas por datos |
| `ProgramGrid` | Los cinco compromisos de la suscripción (líneas de servicio) |
| `ServiceChecklist` | Alcance cubierto por visita, agrupado (líneas de servicio) |
| `PlanViewer` | Visor de planos técnicos: zoom, paneo, leyenda, escala |
| `QuoteForm` | Formulario con validación y estados |

Las imágenes se referencian **por clave de texto** (`'scenes/storefront-entrance.jpg'`)
y se resuelven en [`src/lib/images.ts`](src/lib/images.ts), de modo que los
archivos de datos no necesitan `import`.

---

## Stack

| Pieza | Tecnología |
| ----- | ---------- |
| Framework | Astro 7 (salida estática) |
| Estilos | Tailwind CSS v4 (`@tailwindcss/vite`) |
| Imagen | `astro:assets` + sharp → AVIF/WebP, `srcset` y lazy loading |
| Smooth scroll | Lenis (desactivado bajo `prefers-reduced-motion`) |
| Reveals / parallax | IntersectionObserver + CSS, parallax a medida (44px de recorrido) |
| Iconos | astro-icon + Lucide |
| Tipografías | `@fontsource` Cinzel + Montserrat (self-host) |
| Formulario | Cloudflare Pages Function + Resend |
| Hosting | Cloudflare Pages |

---

## Desarrollo

```bash
npm install
npm run dev        # http://localhost:4321
npm run build      # genera /dist
npm run preview    # sirve /dist (sin Pages Functions)
```

**Ojo:** `astro preview` no ejecuta las Pages Functions, así que el formulario
devolverá 404 al enviar. Para probarlo de verdad:

```bash
npm run build
npm run preview:functions -- \
  --binding RESEND_API_KEY=re_xxx \
  --binding QUOTE_TO=contact@vetrosteelut.com \
  --binding "QUOTE_FROM=Vetro Steel <quotes@vetrosteelut.com>"
```

Wrangler está en `devDependencies`, así que no hace falta `npx` a un paquete
remoto. Sin `RESEND_API_KEY` válida el endpoint responde 502 y el formulario lo
dice — es la señal de que la clave falta, no de que el código esté roto.

### Capturas de verificación

```bash
node shot.mjs http://localhost:4399 shots
```

Recorre las 5 páginas en desktop y móvil, fuerza la carga diferida, y captura
además el visor de planos (reposo, con zoom, segunda hoja) y los estados de
error del formulario.

---

## Material pendiente

El sitio se maquetó con el material disponible y **marca explícitamente lo que
falta** en lugar de rellenarlo con contenido genérico. Los huecos están
declarados en el campo `gaps` de cada vertical y los pinta `MaterialNote`.

Se muestran en `npm run dev` y en cualquier build lanzado con
`PUBLIC_SHOW_GAPS=true`. Un `npm run build` normal **no los renderiza**, así que
producción nunca los enseña.

```bash
PUBLIC_SHOW_GAPS=true npm run build   # preview para el cliente, con los huecos visibles
npm run build                          # producción, limpio
```

Lo que falta hoy:

1. **Fotografía de obra real.** No hay ninguna instalación ejecutada
   documentada. Todo lo que se ve es fotografía de catálogo.
2. **Planos de divisiones de oficina** en vectorial cotado (PDF o DWG). La
   isométrica entregada no tiene cotas, escala ni leyenda, así que no puede
   alimentar el visor. Hoy el visor usa las plantillas de corte de vidrio y las
   vistas de bisagra del catálogo, que sí están cotadas.
3. **Fichas técnicas**: espesor de vidrio, carga admisible y códigos de acabado
   por herraje. Los acabados listados se leyeron de la fotografía del catálogo.
4. **Pares antes/después** de un mismo baño. El componente comparador no se
   construyó: emparejar fotos no relacionadas sería inventar.
5. **Fotografía de mantenimiento.** El brief de servicios marca cinco puntos con
   "(imagen)" y no llegó ninguna: pintura, reparación de yeso, movimiento de
   mobiliario, montaje e instalación, mantenimiento general.
6. **Tarifas del plan de mantenimiento**: frecuencia de visita, horas incluidas
   y bandas de precio por superficie. El brief afirma "tarifa plana fija" sin un
   solo número, así que la página afirma el principio y nada más.
7. **Panel directivo** para asignar tareas prioritarias. El brief lo promete;
   no existe, así que se describe como servicio, no como producto.

---

## Despliegue en Cloudflare Pages

### Build

- **Framework preset**: `Astro`
- **Build command**: `npm run build`
- **Build output directory**: `dist`

El directorio `functions/` de la raíz lo recoge Pages automáticamente; no forma
parte del build de Astro.

### Variables de entorno (Settings → Variables and Secrets)

| Variable | Obligatoria | Uso |
| -------- | ----------- | --- |
| `RESEND_API_KEY` | sí | API key de [Resend](https://resend.com) |
| `QUOTE_TO` | sí | Buzón que recibe las solicitudes |
| `QUOTE_FROM` | sí | Remitente verificado, p. ej. `Vetro Steel <quotes@vetrosteelut.com>` |
| `QUOTE_BCC` | no | Segundo buzón en copia oculta de cada solicitud |
| `QUOTE_REPLY_TO` | no | Dirección a la que responde el acuse del visitante (por defecto `QUOTE_TO`) |

Sin las tres obligatorias el endpoint responde **503** y el formulario le dice
al visitante que escriba por email, en vez de tragarse el lead en silencio.

### Poner el correo en marcha (Resend)

1. Crear cuenta en [resend.com](https://resend.com) y en **Domains** añadir
   `vetrosteelut.com`.
2. Resend entrega tres registros DNS (SPF/`MX` de retorno y dos DKIM). Cargarlos
   en el DNS del dominio — si está en Cloudflare, en **DNS → Records**, con el
   proxy **desactivado** (nube gris). Sin dominio verificado Resend solo deja
   enviar a la dirección de la propia cuenta.
3. **API Keys → Create**, permiso *Sending access*. La clave se ve una sola vez.
4. En el proyecto de Pages: **Settings → Variables and Secrets**, añadir las
   tres variables. `RESEND_API_KEY` como **Secret**, las otras como texto.
   Marcarlas para *Production* y *Preview*.
5. Re-desplegar (las variables no se aplican al build ya publicado) y enviar una
   solicitud de prueba desde `/quote`.

Cada envío correcto manda **dos correos**: la notificación interna a `QUOTE_TO`
(con `reply_to` puesto al visitante, así que basta responder) y un acuse de
recibo al visitante. El acuse se envía después de decidir la respuesta HTTP: si
rebota, el lead ya está a salvo en la bandeja y el fallo solo queda en el log.

Respuestas del endpoint: `400` JSON inválido · `405` método distinto de POST ·
`422` validación con errores por campo · `502` fallo de entrega · `503` sin
configurar · `200` correcto (y también con el honeypot lleno, que se descarta
en silencio).

---

## Antes de publicar

1. **Dominio**: en `astro.config.mjs` cambia `site: 'https://vetrosteel.com'`
   por el dominio final. Actualiza también `public/robots.txt`.
2. **Email de contacto**: `site.email` en [`src/data/site.ts`](src/data/site.ts)
   (un solo sitio; Footer, CTA y formulario lo leen de ahí).
3. **Fotografía Unsplash sobrante**: `public/images/arch/` (24 MB) ya no lo
   referencia nadie — se sustituyó por fotografía real del catálogo en
   `src/assets/`. Se puede borrar entero para bajar el peso del despliegue.
4. **Fotos de equipo**: siguen en `public/images/team/` pero no hay componente
   `Team` que las muestre. Si se quiere sección de equipo, va en `/about`.

---

## Estructura

```
src/
├─ data/
│  ├─ site.ts                  # identidad, contacto, navegación
│  ├─ seo.ts                   # tabla de metadatos por ruta, FAQ y grafo JSON-LD
│  ├─ showcase.ts              # material de /projects (clips generados vs. obra real)
│  └─ verticals.ts             # LAS VERTICALES: copy, producto, planos, proceso, huecos
├─ lib/images.ts               # resolución de assets por clave
├─ assets/                     # fotografía y planos del catálogo (pasa por astro:assets)
│  ├─ scenes/  products/  plans/
├─ layouts/Layout.astro        # <head>, Lenis, parallax, scroll-reveal
├─ components/
│  ├─ ui/                      # primitivas reutilizables
│  └─ *.astro                  # secciones
├─ pages/
│  ├─ index.astro  about.astro  quote.astro
│  └─ [vertical].astro         # genera /commercial y /residential
└─ styles/global.css           # tokens de marca, utilidades, animaciones

functions/api/quote.ts         # Pages Function del formulario
```
