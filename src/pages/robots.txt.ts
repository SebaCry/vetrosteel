import type { APIRoute } from 'astro';
import { site } from '../data/site';

/**
 * Generated rather than hand-written so the sitemap URL can never drift from
 * the canonical origin the rest of the site uses — the old static file still
 * pointed at a domain the client does not own.
 */
export const prerender = true;

export const GET: APIRoute = () =>
  new Response(
    [
      'User-agent: *',
      'Allow: /',
      '',
      '# Generated share images are not search results.',
      'Disallow: /og/',
      '',
      `Sitemap: ${site.origin}/sitemap-index.xml`,
      '',
    ].join('\n'),
    { headers: { 'Content-Type': 'text/plain; charset=utf-8' } }
  );
