import { handleQuote } from '../src/lib/quote';

/**
 * POST /api/quote — Vercel Function.
 *
 * Vercel picks up any file in this root-level `api/` directory and deploys it
 * as a function, independent of the Astro static build; no entry in
 * vercel.json is needed. The Web-standard `fetch` export means the handler is
 * plain Request → Response, which is why the logic itself lives in
 * src/lib/quote.ts and can be tested without an emulator.
 *
 * Environment variables are documented there. They are set in the Vercel
 * project (Settings → Environment Variables), never in the repo.
 */
export default {
  fetch(request: Request): Promise<Response> {
    return handleQuote(request, process.env);
  },
};
