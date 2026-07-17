# Vetro Steel Design Studio — Landing Page

Landing page corporativa de **Vetro Steel Design Studio LLC**, construida con
**Astro + Tailwind CSS v4 + astro-icon** y animaciones de scroll.

Diseño, tipografía (Cinzel + Montserrat) y paleta (deep teal / sand) tomados
directamente del brand board oficial.

---

## Stack

| Pieza              | Tecnología                                   |
| ------------------ | -------------------------------------------- |
| Framework          | Astro 7 (salida estática)                    |
| Estilos            | Tailwind CSS v4 (`@tailwindcss/vite`)        |
| Iconos             | astro-icon + Lucide (`@iconify-json/lucide`) |
| Tipografías        | `@fontsource` Cinzel + Montserrat (self-host)|
| Animaciones        | IntersectionObserver + CSS keyframes         |
| SEO                | `@astrojs/sitemap`, meta OG, canonical       |
| Hosting            | Cloudflare Pages                             |

## Desarrollo local

```bash
npm install
npm run dev        # http://localhost:4321
npm run build      # genera /dist
npm run preview    # sirve /dist localmente
```

---

> El sitio está en **inglés**. El contenido vive dentro de cada componente en
> `src/components/`.

## Antes de publicar — personaliza estos datos

1. **Dominio**: en `astro.config.mjs`, cambia `site: 'https://vetrosteel.com'`
   por el dominio final. Actualiza también `public/robots.txt`.
2. **Email de contacto**: reemplaza `info@vetrosteel.com` en
   `src/components/Contact.astro` y `src/components/Footer.astro`.
3. **Fotos del equipo**: coloca las 4 fotos en `public/images/team/` con estos
   nombres exactos y aparecen automáticamente (mientras no existan, se muestra
   el monograma de iniciales como respaldo):
   - `wilson.png` — Wilson Avila
   - `eyenrivera.png` — Eyen Rivera
   - `simonavila.png` — Simon Avila
   - `jacoboavila.png` — Jacobo Avila
   > Formato ideal: vertical (retrato), ~800×1000px. Puedes cambiar los nombres
   > en `src/components/Team.astro` si prefieres otros.
4. **Imágenes arquitectónicas** (About, Mission, Vision, Work): están en
   `public/images/arch/` (`tower-1`, `tower-2`, `dome`, `corridor`, `mission`,
   `about`). Son fotografía de referencia (Unsplash) con tratamiento monocromo;
   reemplázalas por fotos reales de proyectos manteniendo el mismo nombre.
5. **Teléfono / redes**: agrégalos en `Contact.astro` / `Footer.astro` si aplica.
6. **Logo real**: el monograma VS es un SVG vectorial en `src/components/Logo.astro`.
   Si tienes el logo oficial en SVG, reemplaza los `<path>` por los del archivo.

---

## Desplegar en Cloudflare Pages

### Opción A — Conectar repositorio (recomendado, con CI automático)

1. Sube este proyecto a un repo de GitHub/GitLab.
2. En el dashboard de Cloudflare: **Workers & Pages → Create → Pages →
   Connect to Git**.
3. Configura el build:
   - **Framework preset**: `Astro`
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`
4. **Save and Deploy**. Cada `git push` re-despliega automáticamente.

### Opción B — Subida directa con Wrangler (sin repo)

```bash
npm run build
npx wrangler pages deploy dist --project-name vetro-steel
```

La primera vez, Wrangler pedirá login con tu cuenta de Cloudflare.

### Dominio propio

En el proyecto de Pages → **Custom domains → Set up a domain** → escribe tu
dominio. Si el DNS ya está en Cloudflare, el registro se crea solo; si no,
apunta el `CNAME` al subdominio `*.pages.dev` indicado.

---

## Estructura

```
src/
├─ layouts/Layout.astro        # <head>, fuentes, script de scroll-reveal
├─ components/
│  ├─ Logo.astro               # monograma VS + wordmark (SVG)
│  ├─ Nav.astro                # nav fijo + menú móvil
│  ├─ Hero.astro               # hero con "cables" radiantes animados
│  ├─ About.astro  Mission.astro  Vision.astro
│  ├─ Services.astro  Gallery.astro  Values.astro  Team.astro
│  └─ Contact.astro  Footer.astro
├─ pages/index.astro           # ensambla la página
└─ styles/global.css           # tokens de marca + utilidades + animaciones

public/images/
├─ arch/                       # fotografía arquitectónica (secciones + Work)
└─ team/                       # ← coloca aquí las fotos del equipo
```
