// Full-page screenshots for before/after design review (mobile 390px + desktop 1440px).
// usage: node tools/capture.mjs <baseUrl> <outDir> [pathsFile]
// Uses the locally installed Chrome through puppeteer-core. Only visits baseUrl.
import puppeteer from 'puppeteer-core';
import { mkdirSync, readFileSync, existsSync } from 'node:fs';
import { join, resolve } from 'node:path';

const [base, out, list] = process.argv.slice(2);
if (!base || !out) { console.error('usage: node tools/capture.mjs <baseUrl> <outDir> [pathsFile]'); process.exit(1); }
const executablePath = ['C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe'].find(existsSync);
const paths = list ? readFileSync(list, 'utf8').split(/\r?\n/).map(s => s.trim()).filter(Boolean)
  : ['/', '/book/', '/walk-in-clinic-doctor-cabo-san-lucas/', '/home-doctor/', '/video-doctor-consultation/',
     '/iv-therapy/', '/insurance-billing-cabo/', '/about/', '/contact/', '/lab-tests/',
     '/radiology-x-ray-cabo-san-lucas/', '/aesthetic-medicine-cabo/', '/nurse-care/'];
const views = [
  ['mobile', { width: 390, height: 844, deviceScaleFactor: 1, isMobile: true, hasTouch: true }],
  ['desktop', { width: 1440, height: 900, deviceScaleFactor: 1 }],
];
mkdirSync(resolve(out), { recursive: true });
const browser = await puppeteer.launch({ executablePath, headless: true, args: ['--hide-scrollbars'] });
const page = await browser.newPage();
for (const p of paths) {
  const slug = p === '/' ? 'home' : p.replace(/^\/|\/$/g, '').replace(/\//g, '_');
  for (const [name, vp] of views) {
    const file = join(resolve(out), `${slug}.${name}.jpg`);
    try {
      await page.setViewport(vp);
      await page.goto(base.replace(/\/$/, '') + p, { waitUntil: 'networkidle2', timeout: 45000 });
      // scroll to trigger lazy images and reveal animations, then back to top
      await page.evaluate(async () => {
        for (let y = 0; y < document.body.scrollHeight; y += 600) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 60)); }
        window.scrollTo(0, 0); await new Promise(r => setTimeout(r, 400));
      });
      await page.screenshot({ path: file, fullPage: true, type: 'jpeg', quality: 60 });
      console.log('ok', file);
    } catch (e) { console.log('FAIL', file, e.message); }
  }
}
await browser.close();
