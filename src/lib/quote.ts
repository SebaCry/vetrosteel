import { verticalSlugs, verticalLabel } from '../data/verticals';

/**
 * The quote endpoint's whole implementation, in plain Web Request/Response.
 *
 * It lives here rather than in `api/quote.ts` for two reasons: the hosting
 * adapter stays a five-line file, and this module can be imported and exercised
 * straight from Node — the deployed function needs no emulator to be tested.
 *
 * Environment (Vercel → Project → Settings → Environment Variables):
 *   RESEND_API_KEY   Resend API key.                                 required
 *   QUOTE_TO         Inbox that receives the requests.               required
 *   QUOTE_FROM       Verified sender, "Vetro Steel <quotes@…>".      required
 *   QUOTE_BCC        Second inbox copied on every request.           optional
 *   QUOTE_REPLY_TO   Where the visitor's acknowledgement replies to. optional
 *                    Defaults to QUOTE_TO.
 *
 * With the required three unset it fails loudly with a 503 rather than
 * swallowing a lead — the form then tells the visitor to email directly.
 */

export interface QuoteEnv {
  RESEND_API_KEY?: string;
  QUOTE_TO?: string;
  QUOTE_FROM?: string;
  QUOTE_BCC?: string;
  QUOTE_REPLY_TO?: string;
}

type Payload = Record<string, unknown>;

// Kept in step with the site: the form renders one option per vertical, so the
// server accepts exactly those and nothing else.
const VERTICALS = new Set<string>(verticalSlugs);
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

/**
 * Header injection guard. A newline in the display name of a From/Reply-To
 * would let a submitted value start a header of its own, so anything that
 * reaches an address field gets flattened first.
 */
const oneLine = (s: string) => s.replace(/[\r\n]+/g, ' ').trim();

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
    if (str(data[key]).length > limit)
      fields[key] = `That is longer than we can accept (${limit} characters).`;
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

type Mail = {
  from: string;
  to: string[];
  bcc?: string[];
  reply_to?: string;
  subject: string;
  html: string;
  text: string;
};

async function send(apiKey: string, mail: Mail) {
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(mail),
  });
  if (!res.ok) {
    throw new Error(`Resend ${res.status}: ${await res.text()}`);
  }
  return res;
}

export async function handleQuote(request: Request, env: QuoteEnv): Promise<Response> {
  // Without this, an unmatched method falls through to the static handler and a
  // GET /api/quote answers with a page instead of an error.
  if (request.method !== 'POST') {
    return json({ error: 'This endpoint only accepts POST.' }, 405);
  }

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

  const { RESEND_API_KEY, QUOTE_TO, QUOTE_FROM, QUOTE_BCC, QUOTE_REPLY_TO } = env;
  if (!RESEND_API_KEY || !QUOTE_TO || !QUOTE_FROM) {
    console.error('[quote] Missing RESEND_API_KEY / QUOTE_TO / QUOTE_FROM');
    return json({ error: 'Our quote inbox is not reachable right now.' }, 503);
  }

  const line = verticalLabel(clean.vertical);
  const rows: [string, string][] = [
    ['Name', clean.name],
    ['Email', clean.email],
    ['Phone', clean.phone || '—'],
    ['City / ZIP', clean.city || '—'],
    ['Line of work', line],
    ['Project type', clean.projectType || '—'],
  ];

  const internalHtml = `
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

  const internalText = [
    'New quote request',
    '',
    ...rows.map(([k, v]) => `${k}: ${v}`),
    '',
    'Message:',
    clean.message,
  ].join('\n');

  // The internal notification is the one that must not fail: if it throws, the
  // visitor is told the send did not go through.
  try {
    await send(RESEND_API_KEY, {
      from: QUOTE_FROM,
      to: [QUOTE_TO],
      ...(QUOTE_BCC ? { bcc: [QUOTE_BCC] } : {}),
      reply_to: clean.email,
      subject: `Quote request — ${line} — ${oneLine(clean.name)}`,
      html: internalHtml,
      text: internalText,
    });
  } catch (err) {
    console.error('[quote] Delivery failed', err);
    return json({ error: 'We could not deliver that just now.' }, 502);
  }

  /* ------------------------------------------------------------------ */
  /*  Acknowledgement to the visitor.                                    */
  /*  Secondary: the lead is already safe in the inbox above, so a       */
  /*  failure here is logged and never shown to the visitor.             */
  /* ------------------------------------------------------------------ */
  const firstName = clean.name.split(/\s+/)[0];
  const ackHtml = `
    <div style="font-family:system-ui,sans-serif;font-size:15px;line-height:1.65;color:#111827">
      <p style="font-family:Georgia,serif;font-size:20px;color:#0f3b46;margin:0 0 18px">
        Thank you, ${escapeHtml(firstName)} — we have your request.
      </p>
      <p style="margin:0 0 18px">
        This is confirmation that it reached Vetro Steel Design Studio. A person reads
        every one of these; we will come back to you within one business day, and if we
        need a dimension or a photo to price it properly, that is what we will ask for.
      </p>
      <p style="margin:0 0 8px;color:#6b7280;font-size:13px">What you sent us</p>
      <table style="font-size:14px;border-collapse:collapse;margin:0 0 18px">
        <tr><td style="padding:5px 16px 5px 0;color:#6b7280">Line of work</td><td style="padding:5px 0"><strong>${escapeHtml(line)}</strong></td></tr>
        ${clean.projectType ? `<tr><td style="padding:5px 16px 5px 0;color:#6b7280">Project type</td><td style="padding:5px 0"><strong>${escapeHtml(clean.projectType)}</strong></td></tr>` : ''}
      </table>
      <p style="font-size:15px;line-height:1.6;white-space:pre-wrap;border-left:2px solid #c8b28a;padding-left:16px;margin:0 0 22px;color:#374151">${escapeHtml(clean.message)}</p>
      <p style="margin:0;color:#6b7280;font-size:13px">
        Replying to this email reaches us directly.<br />
        Vetro Steel Design Studio LLC — Utah, USA
      </p>
    </div>
  `;

  await send(RESEND_API_KEY, {
    from: QUOTE_FROM,
    to: [clean.email],
    reply_to: QUOTE_REPLY_TO || QUOTE_TO,
    subject: 'We received your request — Vetro Steel',
    html: ackHtml,
    text: [
      `Thank you, ${firstName} — we have your request.`,
      '',
      'This is confirmation that it reached Vetro Steel Design Studio. We will come back to you within one business day.',
      '',
      `Line of work: ${line}`,
      ...(clean.projectType ? [`Project type: ${clean.projectType}`] : []),
      '',
      'What you sent us:',
      clean.message,
      '',
      'Replying to this email reaches us directly.',
      'Vetro Steel Design Studio LLC — Utah, USA',
    ].join('\n'),
  }).catch((err) => {
    // A bounced acknowledgement is not the visitor's problem: the request is
    // already in our inbox, so this is logged and nothing else.
    console.error('[quote] Acknowledgement failed', err);
  });

  return json({ ok: true });
}
