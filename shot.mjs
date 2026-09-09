import { chromium } from 'playwright';
import fs from 'node:fs';

const base = (process.argv[2] || 'http://localhost:4321').replace(/\/$/, '');
const out = process.argv[3] || 'shots';
fs.mkdirSync(out, { recursive: true });

const browser = await chromium.launch();
const reveal = () =>
  document.querySelectorAll('[data-reveal]').forEach((e) => e.classList.add('is-visible'));

/** Walk the page so lazy images decode before a fullPage capture. */
async function settle(page) {
  await page.evaluate(async () => {
    const step = window.innerHeight * 0.8;
    for (let y = 0; y < document.body.scrollHeight; y += step) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 120));
    }
    window.scrollTo(0, 0);
  });
  await page.evaluate(reveal);
  await page
    .waitForFunction(() => Array.from(document.images).every((i) => i.complete), { timeout: 15000 })
    .catch(() => {});
  await page.waitForTimeout(700);
}

const pages = [
  ['home', '/'],
  ['commercial', '/commercial'],
  ['residential', '/residential'],
  ['maintenance', '/maintenance'],
  ['projects', '/projects'],
  ['about', '/about'],
  ['quote', '/quote'],
];

/* ---- desktop, full page ---- */
const desk = await browser.newContext({ viewport: { width: 1440, height: 900 } });
for (const [name, path] of pages) {
  const p = await desk.newPage();
  await p.goto(base + path, { waitUntil: 'networkidle' });
  await p.waitForTimeout(800);
  await settle(p);
  await p.screenshot({ path: `${out}/${name}.png`, fullPage: true });
  await p.close();
}

/* ---- plan viewer: idle, zoomed, second sheet ---- */
const p = await desk.newPage();
await p.goto(`${base}/commercial`, { waitUntil: 'networkidle' });
await p.evaluate(reveal);
await p.waitForTimeout(600);
const viewer = await p.$('#technical');
if (viewer) {
  await viewer.scrollIntoViewIfNeeded();
  await p.waitForTimeout(400);
  await viewer.screenshot({ path: `${out}/plan-viewer.png` });
  await p.click('[data-zoom="in"]');
  await p.click('[data-zoom="in"]');
  await p.waitForTimeout(800);
  await viewer.screenshot({ path: `${out}/plan-viewer-zoomed.png` });
  await p.click('[data-tab="1"]');
  await p.waitForTimeout(800);
  await viewer.screenshot({ path: `${out}/plan-viewer-sheet2.png` });
}
await p.close();

/* ---- form validation state ---- */
const f = await desk.newPage();
await f.goto(`${base}/quote?for=residential`, { waitUntil: 'networkidle' });
await f.evaluate(reveal);
await f.waitForTimeout(500);
await f.fill('#q-email', 'not-an-email');
await f.fill('#q-message', 'too short');
await f.click('[data-submit]');
await f.waitForTimeout(900);
await f.screenshot({ path: `${out}/quote-errors.png`, fullPage: true });

// Server unreachable in `astro preview` (no Pages Functions) — that is exactly
// the error path we want to see rendered.
await f.fill('#q-name', 'Sebastián Pérez');
await f.fill('#q-email', 'sebastian@example.com');
await f.selectOption('#q-vertical', 'residential');
await f.fill('#q-message', 'Frameless shower enclosure, roughly 1200 x 2000, brushed nickel.');
await f.click('[data-submit]');
await f.waitForTimeout(1500);
await f.screenshot({ path: `${out}/quote-network-error.png`, fullPage: true });
await f.close();

/* ---- mobile ---- */
const mob = await browser.newContext({
  viewport: { width: 390, height: 844 },
  deviceScaleFactor: 2,
  isMobile: true,
  hasTouch: true,
});
for (const [name, path] of [
  ['home', '/'],
  ['residential', '/residential'],
]) {
  const m = await mob.newPage();
  await m.goto(base + path, { waitUntil: 'networkidle' });
  await m.waitForTimeout(800);
  await settle(m);
  await m.screenshot({ path: `${out}/mobile-${name}.png`, fullPage: true });
  await m.close();
}

/* ---- mobile plan viewer ---- */
const mp = await mob.newPage();
await mp.goto(`${base}/residential`, { waitUntil: 'networkidle' });
await mp.evaluate(reveal);
await mp.waitForTimeout(600);
const mv = await mp.$('#technical');
if (mv) {
  await mv.scrollIntoViewIfNeeded();
  await mp.waitForTimeout(400);
  await mv.screenshot({ path: `${out}/mobile-plan-viewer.png` });
}
await mp.close();

await browser.close();
console.log('screenshots ->', out);
