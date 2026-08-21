import type { APIRoute } from 'astro';
import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';
import fs from 'node:fs';
import path from 'node:path';
import { routeSeo } from '../../data/seo';
import { site } from '../../data/site';

/**
 * Share images, rendered at build time.
 *
 * Astro prerenders this endpoint, so every page ships a real 1200x630 PNG at a
 * stable URL with no runtime cost and no third-party screenshot service. The
 * font is read straight out of @fontsource, not from the machine's installed
 * fonts, so the build produces identical output on any CI box.
 */
export const prerender = true;

const fontDir = 'node_modules/@fontsource/cinzel/files';
const cinzel = (weight: number) =>
  fs.readFileSync(path.join(process.cwd(), fontDir, `cinzel-latin-${weight}-normal.woff`));

const INK = '#071e24';
const DEEP = '#0f3b46';
const SAND = '#c8b28a';
const PAPER = '#e8e6e3';

export function getStaticPaths() {
  return Object.keys(routeSeo).map((route) => ({
    params: { slug: route === '/' ? 'home' : route.slice(1).replace(/\//g, '-') },
    props: { route },
  }));
}

export const GET: APIRoute = async ({ props }) => {
  const route = (props as { route: string }).route;
  const meta = routeSeo[route];

  const svg = await satori(
    {
      type: 'div',
      props: {
        style: {
          width: 1200,
          height: 630,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: 72,
          backgroundColor: INK,
          // Mirrors the site's hero: teal light falling from the upper right.
          backgroundImage: `radial-gradient(circle at 78% 0%, ${DEEP} 0%, ${INK} 62%)`,
          fontFamily: 'Cinzel',
        },
        children: [
          {
            type: 'div',
            props: {
              style: { display: 'flex', alignItems: 'center', gap: 18 },
              children: [
                { type: 'div', props: { style: { width: 56, height: 2, backgroundColor: SAND } } },
                {
                  type: 'div',
                  props: {
                    style: { fontSize: 22, letterSpacing: 6, color: SAND, textTransform: 'uppercase' },
                    children: site.name,
                  },
                },
              ],
            },
          },
          {
            type: 'div',
            props: {
              style: { display: 'flex', flexDirection: 'column', gap: 26 },
              children: [
                {
                  type: 'div',
                  props: {
                    style: { fontSize: 68, lineHeight: 1.12, color: PAPER, maxWidth: 940 },
                    children: meta.focus,
                  },
                },
                {
                  type: 'div',
                  props: {
                    style: { width: 96, height: 3, backgroundColor: SAND },
                  },
                },
              ],
            },
          },
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-end',
                fontSize: 21,
                letterSpacing: 3,
                color: 'rgba(232,230,227,0.62)',
                textTransform: 'uppercase',
              },
              children: [
                { type: 'div', props: { children: site.tagline } },
                { type: 'div', props: { style: { color: SAND }, children: site.location } },
              ],
            },
          },
        ],
      },
    },
    {
      width: 1200,
      height: 630,
      fonts: [
        { name: 'Cinzel', data: cinzel(400), weight: 400, style: 'normal' },
        { name: 'Cinzel', data: cinzel(600), weight: 600, style: 'normal' },
      ],
    }
  );

  const png = new Resvg(svg, { fitTo: { mode: 'width', value: 1200 } }).render().asPng();

  return new Response(new Uint8Array(png), {
    headers: {
      'Content-Type': 'image/png',
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  });
};
