import { handleQuote, LINES } from '../api/quote.ts';
import { verticals } from '../src/data/verticals.ts';

/**
 * Exercises every branch of the quote endpoint against the real handler.
 *
 * There is no local emulator for a Vercel Function, and `vercel dev` needs the
 * CLI and a linked project — so the handler is written as plain
 * Request → Response and checked here instead. Run it after touching
 * api/quote.ts:
 *
 *   npm run test:quote                 # no key: delivery is expected to fail
 *   RESEND_API_KEY=re_… npm run test:quote   # real key: actually sends
 *
 * Without a valid key the three "valid" rows come back 502, which is the
 * correct result: it proves the request reached Resend and was refused for the
 * key alone. With a real key they return 200 and mail actually goes out — so
 * only do that with an address you want to receive it.
 */

const env = {
  RESEND_API_KEY: process.env.RESEND_API_KEY || 're_test_fake_key',
  QUOTE_TO: process.env.QUOTE_TO || 'contact@vetrosteelut.com',
  QUOTE_FROM: process.env.QUOTE_FROM || 'Vetro Steel <quotes@vetrosteelut.com>',
};

const good = {
  name: 'Ana Restrepo',
  email: process.env.QUOTE_TEST_TO || 'ana@example.com',
  vertical: 'maintenance',
  projectType: 'Monthly maintenance plan',
  city: 'Salt Lake City',
  phone: '801-555-0134',
  message: 'We manage a 12,000 sq ft office floor with glazed partitions and need a monthly plan.',
};

const req = (body, method = 'POST') =>
  new Request('https://www.vetrosteelut.com/api/quote', {
    method,
    headers: { 'Content-Type': 'application/json' },
    ...(method === 'POST' ? { body: typeof body === 'string' ? body : JSON.stringify(body) } : {}),
  });

/** [label, expected status, body, method, env override] */
const cases = [
  ['GET is rejected', 405, null, 'GET'],
  ['malformed JSON', 400, '{nope'],
  ['empty submission', 422, {}],
  ['bad email', 422, { ...good, email: 'nope' }],
  ['unknown line of work', 422, { ...good, vertical: 'skylights' }],
  ['prototype key as line of work', 422, { ...good, vertical: 'toString' }],
  ['message too short', 422, { ...good, message: 'hi' }],
  ['name over the limit', 422, { ...good, name: 'x'.repeat(200) }],
  ['honeypot filled, dropped silently', 200, { ...good, website: 'http://spam.example' }],
  ['unconfigured environment', 503, good, 'POST', {}],
  ['valid — maintenance', null, good],
  ['valid — commercial', null, { ...good, vertical: 'commercial' }],
  ['valid — residential', null, { ...good, vertical: 'residential' }],
];

const real = Boolean(process.env.RESEND_API_KEY);
let failed = 0;

// api/quote.ts cannot import the site's data (see its header), so its copy of
// the lines of work is checked against the source of truth here.
const site = Object.fromEntries(verticals.map((v) => [v.slug, v.nav]));
const drift = JSON.stringify(site) !== JSON.stringify(LINES);
if (drift) failed++;
console.log(`${drift ? '  FAIL' : '  ok  '} ---- LINES matches src/data/verticals.ts${drift ? `  (site ${JSON.stringify(site)})` : ''}`);

for (const [label, expected, body, method, envOverride] of cases) {
  const res = await handleQuote(req(body, method), envOverride ?? env);
  // The "valid" rows depend on whether a real key is present.
  const want = expected ?? (real ? 200 : 502);
  const ok = res.status === want;
  if (!ok) failed++;
  console.log(`${ok ? '  ok  ' : '  FAIL'} ${String(res.status).padEnd(4)} ${label}${ok ? '' : `  (expected ${want})`}`);
}

console.log(
  failed
    ? `\n${failed} of ${cases.length} checks failed.`
    : `\nAll ${cases.length} checks passed${real ? ' (live key: mail was sent).' : ' (no key: delivery refused as expected).'}`
);
process.exit(failed ? 1 : 0);
