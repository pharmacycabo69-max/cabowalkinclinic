import puppeteer from 'puppeteer-core';
const b = await puppeteer.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true });
const p = await b.newPage(); await p.setViewport({ width: 1440, height: 900 });
await p.goto(process.argv[2], { waitUntil: 'networkidle2' });
console.log(await p.evaluate(() => { const a = document.querySelector('.hero .ctas a, .h4 .ctas a'); const cs = getComputedStyle(a); return JSON.stringify({ style: a.getAttribute('style'), bg: cs.backgroundColor, color: cs.color, vis: cs.visibility, op: cs.opacity, text: a.textContent, rect: a.getBoundingClientRect().toJSON() }); }));
await p.screenshot({ path: 'C:/Users/ZenBook/AppData/Local/Temp/claude/dd86dc9640af033c/2af32f6c-6f65-45e2-9673-cb8551f8b0e0/scratchpad/probe.png', clip: { x: 0, y: 0, width: 1440, height: 900 } });
await b.close();
