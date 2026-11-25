// Automated checks for the V4 rules. No network, no real payments (Stripe is mocked).
// usage: node tools/test.mjs
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const root = resolve(fileURLToPath(new URL('..', import.meta.url)));
const require = createRequire(join(root, 'api', 'x.js'));
let pass = 0, fail = 0;
const ok = (c, m) => { if (c) pass++; else { fail++; console.log('FAIL', m); } };

// ---------- live pages ----------
const vercel = JSON.parse(readFileSync(join(root, 'vercel.json'), 'utf8'));
const redirected = new Set(vercel.redirects.map(r => r.source.replace(/\/?$/, '/')));
const walk = (dir, rel = '') => readdirSync(dir, { withFileTypes: true }).flatMap(e => {
  if (!e.isDirectory() || /^(\.|node_modules|tools|docs|_drafts|assets|api|images|wp-)/.test(e.name)) return [];
  const r = rel + '/' + e.name;
  return [...(existsSync(join(dir, e.name, 'index.html')) ? [r + '/'] : []), ...walk(join(dir, e.name), r)];
});
const pages = ['/', ...walk(root)].filter(p => !redirected.has(p)).map(p => ({ p, h: readFileSync(join(root, p, 'index.html'), 'utf8') }));
const live = pages.filter(x => !/noindex/.test(x.h) || x.p === '/thanks/');
const text = h => h.replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>/gi, ' ').replace(/<[^>]+>/g, ' ');
const main = h => (h.match(/<main[\s\S]*<\/main>/) || [''])[0];
ok(live.length >= 40, 'expected >=40 live pages, got ' + live.length);

// ---------- 1. prices consistent across checkout, wizard and pages ----------
const prices = require('./_prices.json');
const wiz = readFileSync(join(root, 'assets/book/book.v9.js'), 'utf8');
for (const [k, v] of Object.entries(prices)) {
  const m = wiz.match(new RegExp(`k: '${k}'[^}]*p: (\\d+)`));
  ok(m && +m[1] === v.price, `wizard price for ${k} matches checkout (${v.price})`);
}
ok(prices['home-doctor'].price === 189 && prices['clinic-consult'].price === 99 && prices['video-consult'].price === 59, 'V4 commercial policy: 189 / 99 / 59');
for (const { p, h } of live) {
  ok(!/\$199\b/.test(text(h)), `${p}: no $199 house-call price`);
  ok(!/\$80\b|\$149\b|\$129\b|\$119\b/.test(text(main(h))), `${p}: no outdated prices ($80/$149/$129/$119)`);
}

// ---------- 2. claims ----------
for (const { p, h } of live) {
  const t = text(main(h));
  const bad = t.match(/24\/7(?! emergency)|round-the-clock|around the clock|within (the|an) hour|in \d+ minutes|immediate (response|availability)|COFEPRIS[- ](certified|licensed|approved)|certified by COFEPRIS|\bBotox\b|guaranteed results|we bill your insurance directly|no deductible/i);
  ok(!bad, `${p}: forbidden claim "${bad && bad[0]}"`);
}

// ---------- 3. Dra. Rosibel visibility (V4 §6.1) ----------
for (const { p, h } of live) {
  const t = text(h);
  if (/Guadalajara/.test(t)) ok(p === '/aesthetic-medicine-cabo/', `${p}: Rosibel university only on aesthetics`);
  const withoutLegal = h.replace(/<p class="cwc-legal"[\s\S]*?<\/p>/g, '');
  if (/7408277/.test(text(withoutLegal))) ok(['/aesthetic-medicine-cabo/', '/about/'].includes(p), `${p}: Rosibel cedula only in legal footer, About licences or aesthetics`);
  ok(!/responsable sanitari[ao][^.<]{0,80}(PharmacyDoctors|Cabo Pharmacy|CVU|RMC|CMC)/i.test(t), `${p}: sanitary role never attributed to another establishment`);
}

// ---------- 4. Ads landing pages do not link to aesthetics in the body ----------
for (const p of ['/', '/walk-in-clinic-doctor-cabo-san-lucas/', '/home-doctor/', '/video-doctor-consultation/', '/iv-therapy/', '/urgent-care-near-me-cabo-san-lucas/']) {
  const x = live.find(y => y.p === p);
  ok(x && !/aesthetic-medicine-cabo/.test(main(x.h)), `${p}: no aesthetics link in main content`);
}

// ---------- 5. tracking + tags ----------
const track = readFileSync(join(root, 'assets/shared/track.v3.js'), 'utf8');
ok(/link_url:h\.split\('\?'\)\[0\]/.test(track), 'track.v3 strips WhatsApp ?text= from analytics');
for (const { p, h } of live) {
  ok(/AW-16881895258/.test(h), `${p}: Google Ads tag present`);
  ok(/\/assets\/shared\/track\.v3\.js/.test(h), `${p}: conversion tracking script present`);
  ok(!/track\.v2\.js|book\.v8\.js|site\.v2\.js/.test(h), `${p}: no stale asset versions`);
}

// ---------- 6. hreflang pairs reciprocal ----------
for (const { p, h } of live) {
  const alts = [...h.matchAll(/<link rel="alternate" hreflang="(en|es)" href="https:\/\/www\.cabowalkinclinic\.com([^"]+)">/g)].map(m => [m[1], m[2]]);
  for (const [, u] of alts) {
    const other = live.find(y => y.p === u);
    ok(other && other.h.includes(`hreflang="${p.startsWith('/es/') ? 'es' : 'en'}" href="https://www.cabowalkinclinic.com${p}"`), `${p}: hreflang reciprocal with ${u}`);
  }
}

// ---------- 7. one H1, canonical, title ----------
for (const { p, h } of live.filter(x => !/noindex/.test(x.h))) {
  ok((h.match(/<h1[\s>]/g) || []).length === 1, `${p}: exactly one H1`);
  ok(new RegExp(`<link rel="canonical" href="https://www\\.cabowalkinclinic\\.com${p.replace(/[/.]/g, '\\$&')}"`).test(h), `${p}: self canonical`);
  for (const m of h.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) { let good = true; try { JSON.parse(m[1]); } catch { good = false; } ok(good, `${p}: JSON-LD parses`); }
}

// ---------- 8. checkout (Stripe mocked) ----------
const checkout = require('./checkout.js');
const mkRes = () => { const r = { code: 200, headers: {}, loc: '', body: '' }; r.status = c => (r.code = c, r); r.send = b => (r.body = b, r); r.setHeader = (k, v) => (r.headers[k] = v); r.redirect = (c, l) => (r.code = c, r.loc = l, r); return r; };
const calls = [];
globalThis.fetch = async (url, opt) => { calls.push({ url, body: new URLSearchParams(opt.body.toString()) }); return { ok: true, status: 200, json: async () => ({ url: 'https://checkout.stripe.test/session' }) }; };
const silence = console.error; console.error = () => {};
let r = mkRes(); await checkout({ method: 'GET', body: {} }, r); ok(r.code === 405, 'checkout: GET -> 405');
r = mkRes(); await checkout({ method: 'POST', body: { option: 'nope' } }, r); ok(r.code === 400, 'checkout: unknown option -> 400');
delete process.env.STRIPE_SECRET_KEY;
r = mkRes(); await checkout({ method: 'POST', body: { option: 'clinic-consult' } }, r); ok(r.code === 303 && /wa\.me/.test(r.loc), 'checkout: no secret -> WhatsApp fallback');
process.env.STRIPE_SECRET_KEY = 'sk_test_mock_only';
r = mkRes(); await checkout({ method: 'POST', body: { option: 'home-doctor', name: 'Test Person', phone: '+1 555 0100', location: 'Hotel test', notes: 'fever and vomiting', date: '2026-12-01', time: '10:00' } }, r);
const b = calls.at(-1).body;
ok(r.code === 303 && r.loc === 'https://checkout.stripe.test/session', 'checkout: redirects to Stripe session');
ok(b.get('line_items[0][price_data][unit_amount]') === '9450', 'checkout: house call deposit is 50% of $189 = 9450 cents');
ok(b.get('metadata[total_usd]') === null && b.get('payment_intent_data[metadata][total_usd]') === '189', 'checkout: total 189 in metadata');
ok(![...b.keys()].some(k => /notes/.test(k)) && ![...b.values()].some(v => /fever|vomit/.test(v)), 'checkout: free-text notes never sent to Stripe');
r = mkRes(); await checkout({ method: 'POST', body: { option: 'clinic-consult' } }, r);
ok(calls.at(-1).body.get('line_items[0][price_data][unit_amount]') === '4950', 'checkout: clinic deposit 4950 cents');
globalThis.fetch = async () => ({ ok: false, status: 402, json: async () => ({ error: { message: 'card_declined' } }) });
r = mkRes(); await checkout({ method: 'POST', body: { option: 'video-consult' } }, r); ok(r.code === 303 && /wa\.me/.test(r.loc), 'checkout: Stripe error -> WhatsApp fallback, no crash');
globalThis.fetch = async () => { throw new Error('network'); };
r = mkRes(); await checkout({ method: 'POST', body: { option: 'video-consult' } }, r); ok(r.code === 303 && /wa\.me/.test(r.loc), 'checkout: network failure -> WhatsApp fallback');
console.error = silence;

console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
