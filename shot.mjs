import { chromium } from 'playwright';
const url = process.argv[2] || 'http://localhost:4321/';
const browser = await chromium.launch();
const reveal = () => document.querySelectorAll('[data-reveal]').forEach((e) => e.classList.add('is-visible'));

const desk = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 });
const p1 = await desk.newPage();
await p1.goto(url, { waitUntil: 'networkidle' });
await p1.waitForTimeout(2500);
await p1.screenshot({ path: 'shot-hero.png' });
await p1.evaluate(reveal);
await p1.waitForTimeout(500);
const shots = [['about', '#about'], ['mission', 'section:has(blockquote)'], ['vision', 'section:has(#work)'], ['work', '#work'], ['team', '#team']];
for (const [file, sel] of shots) {
  const el = await p1.$(sel);
  if (el) { await el.scrollIntoViewIfNeeded(); await p1.waitForTimeout(200); await el.screenshot({ path: `shot-${file}.png` }); }
}
const mob = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
const p2 = await mob.newPage();
await p2.goto(url, { waitUntil: 'networkidle' });
await p2.waitForTimeout(1500);
await p2.evaluate(reveal);
await p2.waitForTimeout(500);
await p2.screenshot({ path: 'shot-mobile.png', fullPage: true });
await browser.close();
console.log('done');
