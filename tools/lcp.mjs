import puppeteer from 'puppeteer-core';
const b = await puppeteer.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true });
const page = await b.newPage(); await page.setViewport({ width: 390, height: 844, isMobile: true, deviceScaleFactor: 2 });
await page.evaluateOnNewDocument(() => { new PerformanceObserver(l => { for (const e of l.getEntries()) window.__el = (e.element && (e.element.tagName + ' ' + (e.element.currentSrc || e.element.textContent.slice(0, 60)))) + ' @' + Math.round(e.startTime); }).observe({ type: 'largest-contentful-paint', buffered: true }); });
await page.goto(process.argv[2], { waitUntil: 'networkidle0' }); await new Promise(r => setTimeout(r, 800));
console.log(await page.evaluate(() => window.__el));
console.log((await page.evaluate(() => performance.getEntriesByType('resource').filter(r => r.initiatorType === 'link' || r.initiatorType === 'script' || r.initiatorType === 'css').map(r => r.name.split('/').pop().slice(0, 40) + ' ' + Math.round(r.responseEnd))).join(' | ')));
await b.close();
