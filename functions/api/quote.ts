/**
 * POST /api/quote — Cloudflare Pages Function.
 *
 * Deployed automatically alongside the static build: Pages picks up this
 * `functions/` directory from the repo root, independent of Astro's `dist`.
 *
 * Required environment variables (Pages project → Settings → Variables):
 *   RESEND_API_KEY   Resend API key.
 *   QUOTE_TO         Inbox that receives the requests.
 *   QUOTE_FROM       Verified sender, e.g. "Vetro Steel <quotes@vetrosteelut.com>".
 *
 * With those unset the endpoint fails loudly with a 503 rather than swallowing
 * a lead — the form then tells the visitor to email directly.
 */

interface Env {
  RESEND_API_KEY?: string;
  QUOTE_TO?: string;
  QUOTE_FROM?: string;
}

type Payload = Record<string, unknown>;

const VERTICALS = new Set(['commercial', 'residential']);
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const MAX = { name: 120, email: 200, phone: 60, city: 120, projectType: 80, message: 5000 };

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
  });

const str = (v: unknown): string => (typeof v === 'string' ? v.trim() : '');

const escapeHtml = (s: string) =>
  s.replace(/[&<>"']/g, (c) =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c] as string
  );

function validate(data: Payload) {
  const fields: Record<string, string> = {};

  const name = str(data.name);
  const email = str(data.email);
  const vertical = str(data.vertical);
  const message = str(data.message);

  if (name.length < 2) fields.name = 'Please tell us your name.';
  if (!EMAIL.test(email)) fields.email = 'That email address does not look right.';
  if (!VERTICALS.has(vertical)) fields.vertical = 'Pick the line of work this falls under.';
  if (message.length < 15) fields.message = 'A sentence or two about the project, please.';

  for (const [key, limit] of Object.entries(MAX)) {
    if (str(data[key]).length > limit) fields[key] = `That is longer than we can accept (${limit} characters).`;
  }

  return {
    fields,
    clean: {
      name,
      email,
      vertical,
      message,
      phone: str(data.phone),
      city: str(data.city),
      projectType: str(data.projectType),
    },
  };
}

/**
 * Anything that is not a POST: without this, Pages falls through to the static
 * asset handler and answers a GET /api/quote with the home page.
 */
export const onRequest: () => Response = () =>
  json({ error: 'This endpoint only accepts POST.' }, 405);

export const onRequestPost: (ctx: {
  request: Request;
  env: Env;
}) => Promise<Response> = async ({ request, env }) => {
  let data: Payload;
  try {
    data = (await request.json()) as Payload;
  } catch {
    return json({ error: 'We could not read that submission.' }, 400);
  }

  // Honeypot — a real person never fills this in.
  if (str(data.website)) return json({ ok: true });

  const { fields, clean } = validate(data);
  if (Object.keys(fields).length) {
    return json({ error: 'Some fields need another look.', fields }, 422);
  }

  const { RESEND_API_KEY, QUOTE_TO, QUOTE_FROM } = env;
  if (!RESEND_API_KEY || !QUOTE_TO || !QUOTE_FROM) {
    console.error('[quote] Missing RESEND_API_KEY / QUOTE_TO / QUOTE_FROM');
    return json(
      { error: 'Our quote inbox is not reachable right now.' },
      503
    );
  }

  const rows: [string, string][] = [
    ['Name', clean.name],
    ['Email', clean.email],
    ['Phone', clean.phone || '—'],
    ['City / ZIP', clean.city || '—'],
    ['Line of work', clean.vertical],
    ['Project type', clean.projectType || '—'],
  ];

  const html = `
    <h2 style="font-family:Georgia,serif;color:#0f3b46;margin:0 0 16px">New quote request</h2>
    <table style="font-family:system-ui,sans-serif;font-size:14px;border-collapse:collapse">
      ${rows
        .map(
          ([k, v]) =>
            `<tr><td style="padding:6px 16px 6px 0;color:#6b7280">${k}</td><td style="padding:6px 0"><strong>${escapeHtml(v)}</strong></td></tr>`
        )
        .join('')}
    </table>
    <p style="font-family:system-ui,sans-serif;font-size:14px;color:#6b7280;margin:24px 0 6px">Message</p>
    <p style="font-family:system-ui,sans-serif;font-size:15px;line-height:1.6;white-space:pre-wrap">${escapeHtml(clean.message)}</p>
  `;

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: QUOTE_FROM,
        to: [QUOTE_TO],
        reply_to: clean.email,
        subject: `Quote request — ${clean.vertical} — ${clean.name}`,
        html,
      }),
    });

    if (!res.ok) {
      console.error('[quote] Resend responded', res.status, await res.text());
      return json({ error: 'We could not deliver that just now.' }, 502);
    }
  } catch (err) {
    console.error('[quote] Delivery threw', err);
    return json({ error: 'We could not deliver that just now.' }, 502);
  }

  return json({ ok: true });
};
