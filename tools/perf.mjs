// Lab Core Web Vitals estimate (LCP, CLS, TBT as INP proxy) with mobile emulation: 4x CPU slowdown + "Fast 4G"-like network.
// usage: node tools/perf.mjs <baseUrl> [paths...]
import puppeteer from 'puppeteer-core';
const [base, ...rest] = process.argv.slice(2);
const paths = rest.length ? rest : ['/', '/walk-in-clinic-doctor-cabo-san-lucas/', '/home-doctor/', '/iv-therapy/', '/radiology-x-ray-cabo-san-lucas/', '/es/'];
const b = await puppeteer.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true });
for (const p of paths) {
  const page = await b.newPage();
  await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true, deviceScaleFactor: 2 });
  const cdp = await page.createCDPSession();
  await cdp.send('Network.enable');
  await cdp.send('Network.emulateNetworkConditions', { offline: false, latency: 150, downloadThroughput: 1.6 * 1024 * 1024 / 8 * 4, uploadThroughput: 750 * 1024 / 8 });
  await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 });
  await page.evaluateOnNewDocument(() => {
    window.__lcp = 0; window.__cls = 0; window.__tbt = 0;
    new PerformanceObserver(l => { for (const e of l.getEntries()) window.__lcp = e.startTime; }).observe({ type: 'largest-contentful-paint', buffered: true });
    new PerformanceObserver(l => { for (const e of l.getEntries()) if (!e.hadRecentInput) window.__cls += e.value; }).observe({ type: 'layout-shift', buffered: true });
    new PerformanceObserver(l => { for (const e of l.getEntries()) window.__tbt += Math.max(0, e.duration - 50); }).observe({ type: 'longtask', buffered: true });
  });
  const t0 = Date.now();
  await page.goto(base.replace(/\/$/, '') + p, { waitUntil: 'load', timeout: 90000 });
  await new Promise(r => setTimeout(r, 3000));
  const m = await page.evaluate(() => ({ lcp: Math.round(window.__lcp), cls: +window.__cls.toFixed(3), tbt: Math.round(window.__tbt), bytes: performance.getEntriesByType('resource').reduce((a, r) => a + (r.transferSize || 0), 0) }));
  console.log(`${p.padEnd(42)} LCP ${m.lcp}ms  CLS ${m.cls}  TBT ${m.tbt}ms  load ${Date.now() - t0}ms`);
  await page.close();
}
await b.close();
