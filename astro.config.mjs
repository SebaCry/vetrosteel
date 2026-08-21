// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import icon from 'astro-icon';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  // Canonical origin — must match site.origin in src/data/site.ts.
  site: 'https://www.vetrosteelut.com',
  output: 'static',
  // A trailing-slash policy has to be picked and held: canonical, sitemap and
  // the served URL must agree, or one page competes with itself.
  trailingSlash: 'never',
  build: { format: 'file' },
  integrations: [
    icon(),
    sitemap({
      // The generated share images are assets, not pages.
      filter: (page) => !page.includes('/og/'),
      changefreq: 'monthly',
      lastmod: new Date(),
      serialize(item) {
        const path = new URL(item.url).pathname.replace(/\/+$/, '') || '/';
        // Priority follows commercial intent, not depth: the two service pages
        // and the quote form are what we want crawled and ranked hardest.
        const priority =
          path === '/' ? 1.0
          : path === '/commercial' || path === '/residential' ? 0.9
          : path === '/quote' ? 0.8
          : path === '/projects' ? 0.7
          : 0.5;
        return { ...item, priority, changefreq: path === '/projects' ? 'weekly' : 'monthly' };
      },
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});
