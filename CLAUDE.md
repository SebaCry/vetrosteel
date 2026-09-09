# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Marketing site for **Vetro Steel Design Studio LLC** (glass hardware & architectural systems, Utah).
Astro 7 static output + Tailwind v4, deployed to **Vercel** from GitHub. **The site content is in English**;
[README.md](README.md) — the fuller project document, worth reading — is in Spanish.

Product terminology, taxonomy and palette come from the client's own catalog (*PRODUCT CATALOG — MAY 2026*).
Do not invent product names, finishes or specs: if the material is missing, it gets declared as a gap
(see "Material gaps" below) rather than filled with plausible copy.

## Commands

```bash
npm run dev        # astro dev — http://localhost:4321
npm run build      # static build into /dist
npm run preview    # serves /dist, but WITHOUT Pages Functions (the quote form 404s)
```

Test the quote endpoint (12 cases against the real handler — no emulator, no Vercel CLI):

```bash
npm run test:quote                        # no key: the three "valid" rows expect 502
RESEND_API_KEY=re_xxx npm run test:quote  # real key: expects 200 and actually sends mail
```

A fake key exercises everything but delivery: 502 with `Resend 401` in the log proves the request reached
Resend. **`/api/quote` does not exist under `astro dev` or `astro preview`** — it is a Vercel Function, not
an Astro route, so the form 404s locally by design and this script is how it gets checked.

Visual verification (there is no test suite, no linter and no formatter — screenshots are the check):

```bash
node shot.mjs http://localhost:4321 shots   # Playwright: all 7 routes × desktop/mobile, plan viewer states, form errors
```

## Architecture

### Data drives routes, components render them

Two files hold nearly all content:

- [src/data/verticals.ts](src/data/verticals.ts) — the business verticals (`commercial`, `residential`,
  `maintenance`). Adding an entry to the `verticals` array automatically produces the page (via
  [src/pages/[vertical].astro](src/pages/[vertical].astro)), its sitemap URL, its `Service` node in the
  JSON-LD graph, its `/og/<slug>.png` share image, its option in the quote form's `<select>` and its
  acceptance by the Pages Function (which imports `verticalSlugs` rather than keeping its own list).
  The manual steps are `mainNav`/`footerNav` in [src/data/site.ts](src/data/site.ts) **and** a `routeSeo`
  entry in [src/data/seo.ts](src/data/seo.ts) — without the latter the page silently inherits the home
  page's title and description.

  Not every line sells hardware: `products`, `plans` and `planIntro` are optional, and a service line
  carries `programs` + `serviceGroups` instead (rendered by `ProgramGrid` and `ServiceChecklist`). The
  template guards each of those sections, and `VerticalHero`'s secondary CTA points at whatever the page
  actually renders — it used to hard-code `#technical`, the plan viewer's id, which scrolled nowhere on a
  line that ships no drawings. `maintenance` is the client's B2B subscription brief
  (`requeriments/servicios.pdf`), translated rather than expanded; what the brief promises but does not
  yet evidence is declared in `gaps`.
- [src/data/site.ts](src/data/site.ts) — identity, contact email, canonical `origin`, navigation,
  `areaServed`, catalog taxonomy. Single source of truth: Footer, CTA, form, schema.org and robots all read it.
- [src/data/showcase.ts](src/data/showcase.ts) — the `/projects` page material. Read its header comment
  before touching it: `stages`/`transitions` are **AI-generated (Veo) visualisations**, deliberately
  labelled as such in the UI and trimmed to their first few usable seconds; `projects` is real
  photography of completed installs. Keep that distinction intact.

### Images are referenced by string key

Data files never `import` an image. They carry a key like `'scenes/storefront-entrance.jpg'`, resolved by
[src/lib/images.ts](src/lib/images.ts) through an eager `import.meta.glob` of `src/assets/**`. That keeps
everything on `astro:assets` (AVIF/WebP + `srcset`) while letting content stay pure data. A missing key
throws at build time with the list of available keys.

`ui/Figure.astro` is the **only** place an image is rendered — new imagery goes through it, not raw `<img>`.

Note the split: `src/assets/` is catalog/real photography that goes through the image pipeline;
`public/` holds the mp4 clips (`public/video/`, ~17MB, served raw) plus legacy `public/images/arch|team|comparative`
that nothing references any more.

### SEO is centralised, not per-page

[src/components/Seo.astro](src/components/Seo.astro) emits every head tag and one JSON-LD `@graph`
(Organization/LocalBusiness + WebSite + WebPage + BreadcrumbList + per-vertical Service + optional FAQPage,
cross-referenced by `@id`). Pages pass only overrides through `Layout.astro` props
(`title`, `description`, `breadcrumbs`, `includeFaq`, `noindex`). Defaults live in the `routeSeo` table in
[src/data/seo.ts](src/data/seo.ts) — **a new route without an entry there silently falls back to the home
page's metadata.**

Two invariants that must not drift apart: `site` in `astro.config.mjs`, `site.origin` in `src/data/site.ts`,
and the `trailingSlash: 'never'` + `build.format: 'file'` pair. `Seo.astro` normalises `.html`/trailing
slashes so canonical, sitemap and OG slug agree; changing the build format means re-checking that
normalisation. [src/pages/robots.txt.ts](src/pages/robots.txt.ts) and the sitemap are both generated from
`site.origin`.

Share images are generated at build time by [src/pages/og/[slug].png.ts](src/pages/og/[slug].png.ts)
(satori → resvg, Cinzel read from `node_modules/@fontsource`), one per `routeSeo` key, excluded from the
sitemap and disallowed in robots.txt.

### Motion

[src/layouts/Layout.astro](src/layouts/Layout.astro) owns all scroll behaviour in one inline script: Lenis
smooth scroll, `[data-reveal]` IntersectionObserver, and a parallax loop writing `--py` (44px of travel) on
`[data-parallax]`. Under `prefers-reduced-motion` Lenis is never started and the parallax loop removes its
inline property — the loop has to stand down in JS, because an inline custom property outranks the CSS
media-query rule. Anchor clicks are intercepted and routed through Lenis when it is running.

Design tokens (brand palette, Cinzel/Montserrat, `.eyebrow`, `.blueprint-grid`, `.tick-frame`) are Tailwind
v4 `@theme` variables in [src/styles/global.css](src/styles/global.css). There is no `tailwind.config.js`.

The header is fixed and 113px tall on desktop, so anchors need an offset in two independent places: a
`scroll-margin-top` rule in `global.css` (the only thing acting on a cross-page jump like
`/about#capabilities`, which no script sees) and the measured offset in `Layout.astro`'s Lenis handler.
Changing the nav's height means both. The desktop nav is held back to `lg` — five items plus the quote
button need ~990px beside the lockup, and at `md` the button fell off the right edge.

### Quote form

The logic is in [src/lib/quote.ts](src/lib/quote.ts) as a plain `handleQuote(request, env)` —
[api/quote.ts](api/quote.ts) is a five-line Vercel adapter over it. That split exists so the endpoint can be
tested without an emulator (`npm run test:quote`); keep new logic in the lib, not the adapter. Vercel deploys
anything in the root `api/` directory as a function with no `vercel.json` entry, and the Web-standard `fetch`
export means it is Request → Response throughout.

Validates, honeypots (`website` field → silent `200`), and relays through Resend. Requires `RESEND_API_KEY`,
`QUOTE_TO`, `QUOTE_FROM` (optional: `QUOTE_BCC`, `QUOTE_REPLY_TO`); without the required three it returns
**503 on purpose** so the form can tell the visitor to email directly rather than swallowing a lead.
Responses: `400` bad JSON · `405` non-POST · `422` field errors · `502` delivery failure · `503`
unconfigured · `200` ok.

Two emails go out per accepted request: the internal notification (`reply_to` set to the visitor) decides
the HTTP response, and the visitor's acknowledgement is awaited afterwards with its own `.catch` — a bounced
acknowledgement must never turn a captured lead into an error the visitor sees. It imports from
`src/data/verticals`, which is what keeps the accepted `vertical` values in step with the options the form
renders.

## Material gaps

The site marks missing client material instead of faking it. Gaps are declared in each vertical's `gaps`
field and rendered by `ui/MaterialNote.astro`, which shows **only** in `astro dev` or when built with
`PUBLIC_SHOW_GAPS=true` (that build is what the client preview deploys). A plain `npm run build` renders
nothing, so production never leaks them.

```bash
PUBLIC_SHOW_GAPS=true npm run build          # bash
$env:PUBLIC_SHOW_GAPS='true'; npm run build  # PowerShell
```

Outstanding: real installed-work photography, dimensioned office-partition drawings, per-hardware technical
sheets, and matched before/after pairs (README has the detail).

## Deploy

Vercel, Astro preset, build `npm run build`, output `dist`, auto-deploying from GitHub
(`SebaCry/project_johan`) on push to `main`. Env vars live in the Vercel project, never in the repo.

**[vercel.json](vercel.json) is load-bearing, do not delete it.** `build.format: 'file'` emits
`dist/commercial.html`, and Vercel will not serve that at `/commercial` without `cleanUrls: true` — without
it every subpage 404s while only `/commercial.html` resolves, which is exactly the production bug it was
added to fix. `trailingSlash: false` keeps that agreeing with Astro's `trailingSlash: 'never'`.

The repo was originally written for Cloudflare Pages; that is gone (no `functions/`, no `wrangler.jsonc`, no
wrangler dependency). If a Cloudflare reference turns up anywhere, it is stale.

README's "Antes de publicar" list is partly stale — the domain and robots.txt items are already done
(canonical is `https://www.vetrosteelut.com`, robots is generated). The unreferenced `public/images/arch/`
(~24MB) is still deletable.
