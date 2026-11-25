// Crawl every public route (sitemap + every */index.html in the repo) and export SEO/Ads facts.
// usage: node tools/crawl.mjs <baseUrl> <out.csv>
import { readdirSync, existsSync, writeFileSync, readFileSync } from 'node:fs';
import { join, resolve } from 'node:path';

const [base, outFile] = process.argv.slice(2);
import { fileURLToPath } from 'node:url';
const root = resolve(fileURLToPath(new URL('..', import.meta.url)));
const B = base.replace(/\/$/, '');

function walk(dir, rel = '') {
  const res = [];
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    if (!e.isDirectory() || /^(\.|node_modules|tools|docs|_drafts|assets|api|images|wp-content|wp-includes|wp-json)/.test(e.name)) continue;
    const r = rel + '/' + e.name;
    if (existsSync(join(dir, e.name, 'index.html'))) res.push(r + '/');
    res.push(...walk(join(dir, e.name), r));
  }
  return res;
}
const routes = ['/', ...walk(root)];
const vercel = JSON.parse(readFileSync(join(root, 'vercel.json'), 'utf8'));
const redirects = new Map((vercel.redirects || []).map(r => [r.source.replace(/\/?$/, '/'), r.destination]));
const sm = await (await fetch(B + '/sitemap.xml')).text().catch(() => '');
const inSitemap = new Set([...sm.matchAll(/<loc>https:\/\/www\.cabowalkinclinic\.com(\/[^<]*)<\/loc>/g)].map(m => m[1]));

const pick = (re, s) => (s.match(re) || [, ''])[1].replace(/\s+/g, ' ').trim();
const esc = v => '"' + String(v).replace(/"/g, '""') + '"';
const rows = [['url', 'status', 'redirect_to', 'in_sitemap', 'robots', 'canonical_ok', 'title', 'title_len', 'description', 'desc_len', 'h1', 'h1_count', 'hreflang', 'schema_types', 'gtag_aw', 'conversion_js', 'book_cta', 'wa_cta', 'internal_links', 'words']];
for (const u of [...new Set([...routes, ...inSitemap])].sort()) {
  let r; try { r = await fetch(B + u, { redirect: 'manual' }); } catch (e) { rows.push([u, 'ERR']); continue; }
  const loc = r.headers.get('location') || '';
  if (r.status >= 300 && r.status < 400) { rows.push([u, r.status, loc, inSitemap.has(u)]); continue; }
  const h = await r.text();
  const main = pick(/<main[^>]*>([\s\S]*)<\/main>/i, h) || h;
  const words = main.replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>/gi, ' ').replace(/<[^>]+>/g, ' ').split(/\s+/).filter(Boolean).length;
  const types = [...h.matchAll(/"@type":\s*(\[[^\]]*\]|"[^"]+")/g)].map(m => m[1].replace(/[\[\]"\s]/g, '')).filter((v, i, a) => a.indexOf(v) === i).join('|');
  const canon = pick(/<link rel="canonical" href="([^"]+)"/i, h);
  rows.push([u, r.status, redirects.get(u) || '', inSitemap.has(u), pick(/<meta name="robots" content="([^"]+)"/i, h) || r.headers.get('x-robots-tag') || '',
    canon.endsWith(u), pick(/<title>([\s\S]*?)<\/title>/i, h), pick(/<title>([\s\S]*?)<\/title>/i, h).length,
    pick(/<meta name="description" content="([^"]*)"/i, h), pick(/<meta name="description" content="([^"]*)"/i, h).length,
    pick(/<h1[^>]*>([\s\S]*?)<\/h1>/i, h).replace(/<[^>]+>/g, ''), (h.match(/<h1[\s>]/gi) || []).length,
    (h.match(/hreflang="([^"]+)"/g) || []).join(' '), types, (h.match(/AW-\d+/) || [''])[0], /track\.v\d+\.js/.test(h),
    /data-book|\/book\//.test(main), /wa\.me\//.test(h), (main.match(/href="\//g) || []).length, words]);
}
writeFileSync(outFile, rows.map(r => r.map(esc).join(',')).join('\n'));
console.log('rows', rows.length - 1);
