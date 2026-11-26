// Automated checks for the V4/V6 rules. No network, no real payments: Stripe, Resend, CRM, QuickTurno and UltraMsg are
// mocked, and the register uses the in-memory backend. These are SIMULATED integrations: they prove our code paths,
// not that the external services are configured (see docs/V6_TEST_RESULTS.md).
// usage: node tools/test.mjs
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
import crypto from 'node:crypto';

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

// ---------- 1. master catalog: one source for checkout, request API and wizard ----------
const CAT = require('./_catalog.json');
const S = CAT.services;
const wiz = readFileSync(join(root, 'assets/book/book.v10.js'), 'utf8');
const SVm = wiz.match(/\/\*SV\*\/var SV = (\[[\s\S]*?\]);\/\*SV-END\*\//);
const SV = SVm ? JSON.parse(SVm[1]) : [];
ok(SV.length === Object.keys(S).length, 'wizard catalog generated from api/_catalog.json (run node tools/catalog.mjs)');
for (const [k, v] of Object.entries(S)) {
  const w = SV.find(x => x.k === k);
  ok(w && w.p === v.price && w.pay === v.payment && w.n.es === v.es && w.n.en === v.en, `wizard entry for ${k} matches the master catalog`);
}
ok(S['home-doctor'].price === 189 && S['clinic-consult'].price === 99 && S['video-consult'].price === 59 && S['iv-nad'].price === 279 && S['iv-hydration'].price === 159, 'V6 master prices: 189 / 99 / 59 / NAD+ 279 / IV 159');
ok(S['video-consult'].payment === 'request', 'V6: video consultations are not charged with Stripe');
ok(S['clinic-consult'].payment === 'optional', 'V6: walk-in patients are never required to prepay');
ok(['lab', 'xray', 'nursing', 'iv-group'].every(k => S[k].price === null && S[k].payment === 'quote'), 'V6: lab, X-ray, nursing and IV groups are quote-based');
ok(S['iv-total-wellness'].public === false, 'Total Wellness IV hidden until the owner confirms it applies to the clinic');
ok(!/cost|margin|costo|margen/i.test(JSON.stringify(S)), 'catalog holds no internal costs or margins (public repo)');
ok(!existsSync(join(root, 'api/_prices.json')), 'old price file removed (single source)');
for (const { p, h } of live) {
  ok(!/\$199\b/.test(text(h)), `${p}: no $199 house-call price`);
  ok(!/\$80\b|\$149\b|\$129\b|\$119\b/.test(text(main(h))), `${p}: no outdated prices ($80/$149/$129/$119)`);
}

// ---------- 2. claims ----------
for (const { p, h } of live) {
  const t = text(main(h)).replace(/(online requests( received)?|solicitudes en l(?:í|&iacute;)nea) 24\/7/gi, '');
  const bad = t.match(/24\/7(?! emergency)|round-the-clock|around the clock|within (the|an) hour|in \d+ minutes|immediate (response|availability)|COFEPRIS[- ](certified|licensed|approved)|certified by COFEPRIS|\bBotox\b|guaranteed results|we bill your insurance directly|no deductible/i);
  ok(!bad, `${p}: forbidden claim "${bad && bad[0]}"`);
}

// ---------- 3. Dra. Rosibel visibility (V6 §8: responsable sanitaria on the team page) ----------
for (const { p, h } of live) {
  const t = text(h);
  if (/Guadalajara/.test(t)) ok(p === '/about/', `${p}: Rosibel university only on the team page`);
  const withoutLegal = h.replace(/<p class="cwc-legal"[\s\S]*?<\/p>/g, '');
  if (/7408277/.test(text(withoutLegal))) ok(p === '/about/', `${p}: Rosibel cedula only in legal footer and the team page`);
  ok(!/responsable sanitari[ao][^.<]{0,80}(PharmacyDoctors|Cabo Pharmacy|CVU|RMC|CMC)/i.test(t), `${p}: sanitary role never attributed to another establishment`);
}

// ---------- 4. aesthetic medicine retired from this brand (V6 §3) and V6 §9 radiology limits ----------
ok(!existsSync(join(root, 'aesthetic-medicine-cabo', 'index.html')), 'aesthetics page removed');
ok(!existsSync(join(root, 'images', 'aesthetics')), 'aesthetics images removed');
ok((vercel.rewrites || []).some(r => r.source === '/aesthetic-medicine-cabo/' && r.destination === '/api/gone'), 'aesthetics URL answers 410 Gone (no redirect to an unrelated page)');
ok(!vercel.redirects.some(r => /aesthetic/.test(r.source + r.destination)), 'no redirect into or out of aesthetics');
ok(!/aesthetic-medicine-cabo/.test(readFileSync(join(root, 'sitemap.xml'), 'utf8')), 'aesthetics URL out of the sitemap');
ok(!/aesthetic|estética|botox|filler|relleno/i.test(wiz), 'booking wizard and bot have no aesthetics');
for (const { p, h } of pages) ok(!/aesthetic-medicine-cabo|\bBotox\b|dermal filler|lip filler|aumento de labios|toxina botul/i.test(h), `${p}: no aesthetics links or treatments`);
ok(!/T(?:&eacute;|é)cnico Radi(?:&oacute;|ó)logo/.test(pages.map(x => x.h).join('')), 'unverified radiology title not published (V6 §9)');
for (const { p, h } of live) ok(!/(\bCT\b|\bMRI\b|ultrasound|tomograf|resonancia|ultrasonido)[^.<]{0,60}(Quote|Cotizaci)/i.test(text(main(h))), `${p}: no CT / MRI / ultrasound offer until confirmed`);
for (const { p, h } of live) ok(!/X-ray at our|portable unit at your|our X-ray room|in-house X-ray|rayos X en nuestra cl/i.test(h), `${p}: no own radiology facility or unconfirmed portable X-ray claim (incl. schema)`);

// ---------- 5. tracking + tags ----------
const track = readFileSync(join(root, 'assets/shared/track.v3.js'), 'utf8');
ok(/link_url:h\.split\('\?'\)\[0\]/.test(track), 'track.v3 strips WhatsApp ?text= from analytics');
for (const { p, h } of live) {
  ok(/AW-16881895258/.test(h), `${p}: Google Ads tag present`);
  ok(/\/assets\/shared\/track\.v3\.js/.test(h), `${p}: conversion tracking script present`);
  ok(!/track\.v2\.js|book\.v[89]\.js|site\.v2\.js/.test(h), `${p}: no stale asset versions`);
  if (/data-book/.test(h)) ok(/\/assets\/book\/book\.v10\.js/.test(h), `${p}: booking wizard v10 loaded`);
  const sb = (h.match(/<div class="stickybar">[\s\S]*?<\/div>/) || [''])[0];
  if (sb) ok(/tel:\+526242261023/.test(sb) && /maps\.app\.goo\.gl/.test(sb) && /wa\.me/.test(sb), `${p}: mobile bar has call, directions and WhatsApp`);
}
ok(!/gclid|gbraid|wbraid/.test(readFileSync(join(root, 'api/checkout.js'), 'utf8').replace(/\/\/.*$/gm, '')), 'no ad click identifiers sent to Stripe');

// ---------- 6. hreflang pairs reciprocal ----------
for (const { p, h } of live) {
  const alts = [...h.matchAll(/<link rel="alternate" hreflang="(en|es)" href="https:\/\/www\.cabowalkinclinic\.com([^"]+)">/g)].map(m => [m[1], m[2]]);
  for (const [, u] of alts) {
    const other = live.find(y => y.p === u);
    ok(other && other.h.includes(`hreflang="${p.startsWith('/es/') ? 'es' : 'en'}" href="https://www.cabowalkinclinic.com${p}"`), `${p}: hreflang reciprocal with ${u}`);
  }
}
ok(live.some(x => x.p === '/es/reservar/') && /<html lang="es"/.test(live.find(x => x.p === '/es/reservar/').h), 'Spanish booking page exists');
ok(/okStatus: 'Estado: recibida, pendiente de confirmación/.test(wiz) && /failT: 'No pudimos registrar/.test(wiz), 'wizard confirmations and errors translated to Spanish');

// ---------- 7. one H1, canonical, title ----------
for (const { p, h } of live.filter(x => !/noindex/.test(x.h))) {
  ok((h.match(/<h1[\s>]/g) || []).length === 1, `${p}: exactly one H1`);
  ok(new RegExp(`<link rel="canonical" href="https://www\\.cabowalkinclinic\\.com${p.replace(/[/.]/g, '\\$&')}"`).test(h), `${p}: self canonical`);
  for (const m of h.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) { let good = true; try { JSON.parse(m[1]); } catch { good = false; } ok(good, `${p}: JSON-LD parses`); }
}

// ============ server: mocks ============
const mkRes = () => { const r = { code: 200, headers: {}, loc: '', body: '' }; r.status = c => (r.code = c, r); r.send = b => (r.body = b, r); r.json = b => (r.body = b, r); r.end = b => (r.body = b, r); r.setHeader = (k, v) => (r.headers[k] = v); r.redirect = (c, l) => (r.code = c, r.loc = l, r); return r; };
let calls = [];
let failHosts = new Set();
globalThis.fetch = async (url, opt = {}) => {
  const u = String(url); const host = new URL(u).host;
  const body = opt.body == null ? '' : String(opt.body);
  calls.push({ url: u, host, headers: opt.headers || {}, body, form: /stripe/.test(host) ? new URLSearchParams(body) : null });
  if (failHosts.has(host)) return { ok: false, status: 500, json: async () => ({ error: { type: 'api_error' } }), text: async () => '' };
  if (/stripe/.test(host)) return { ok: true, status: 200, json: async () => ({ url: 'https://checkout.stripe.test/session' }) };
  return { ok: true, status: 200, json: async () => ({ id: 'x' }), text: async () => '' };
};
const resetEnv = () => {
  for (const k of ['STRIPE_SECRET_KEY', 'RESEND_API_KEY', 'NOTIFY_EMAIL', 'KV_REST_API_URL', 'KV_REST_API_TOKEN', 'REQUEST_ENCRYPTION_KEY', 'CWC_MEMORY_STORE', 'TURNO_WEBHOOK_URL', 'WEB_PAYMENT_SECRET', 'ULTRAMSG_INSTANCE', 'ULTRAMSG_TOKEN', 'NOTIFY_WHATSAPP', 'REQUEST_WEBHOOK_URL', 'STRIPE_WEBHOOK_SECRET', 'CRON_SECRET', 'PAYMENT_FULL_APPROVED', 'VERCEL']) delete process.env[k];
  globalThis.__cwcMem = new Map(); calls = []; failHosts = new Set();
};
const withStore = () => { process.env.CWC_MEMORY_STORE = '1'; process.env.REQUEST_ENCRYPTION_KEY = 'test-only-key-0123456789abcdef0123456789'; };
const silence = console.error; console.error = () => {};
const today = new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Mazatlan' }).format(new Date());
const plus = (n) => { const d = new Date(today + 'T12:00:00Z'); d.setUTCDate(d.getUTCDate() + n); return d.toISOString().slice(0, 10); };
const stripeCall = () => calls.find(c => /stripe/.test(c.host)) || { headers: {}, form: new URLSearchParams() };

// ---------- 8. checkout (Stripe mocked) ----------
resetEnv();
const checkout = require('./checkout.js');
let r = mkRes(); await checkout({ method: 'GET', body: {} }, r); ok(r.code === 405, 'checkout: GET -> 405');
r = mkRes(); await checkout({ method: 'POST', body: { option: 'nope' } }, r); ok(r.code === 400, 'checkout: unknown option -> 400');
r = mkRes(); await checkout({ method: 'POST', body: { option: 'clinic-consult' } }, r); ok(r.code === 303 && /wa\.me/.test(r.loc), 'checkout: no secret -> WhatsApp fallback');
process.env.STRIPE_SECRET_KEY = 'sk_test_mock_only';
for (const k of ['video-consult', 'lab', 'xray', 'iv-group', 'iv-nad', 'insurance-check']) {
  calls = []; r = mkRes(); await checkout({ method: 'POST', body: { option: k } }, r);
  ok(r.code === 303 && r.loc.endsWith('/book/?service=' + k) && !calls.some(c => /stripe/.test(c.host)), `checkout: ${k} is never charged online (request flow)`);
}
calls = []; r = mkRes(); await checkout({ method: 'POST', body: { option: 'home-doctor', name: 'Test Person', phone: '+1 555 0100', location: 'Hotel test', notes: 'fever and vomiting', gclid: 'G-123', price: '1', amount: '1', date: plus(3), time: '10:00' } }, r);
let st = stripeCall(); let b = st.form;
ok(r.code === 303 && r.loc === 'https://checkout.stripe.test/session', 'checkout: redirects to Stripe session');
ok(b.get('line_items[0][price_data][unit_amount]') === '9450', 'checkout: house call deposit is 50% of $189 = 9450 cents (client price ignored)');
ok(b.get('line_items[0][price_data][currency]') === 'usd', 'checkout: currency fixed to USD on the server');
ok(/^CWC-[2-9A-Z]{4}-[2-9A-Z]{4}$/.test(b.get('client_reference_id') || '') && b.get('metadata[folio]') === b.get('client_reference_id'), 'checkout: opaque folio in client_reference_id and metadata');
ok(/^cwc-[0-9a-f]{40}$/.test(st.headers['Idempotency-Key'] || ''), 'checkout: Stripe idempotency key sent');
ok(+b.get('expires_at') > Date.now() / 1000 + 30 * 60, 'checkout: session expires (>= 30 min, Stripe minimum)');
ok(b.get('payment_intent_data[metadata][total_usd]') === '189', 'checkout: total 189 in metadata');
ok(![...b.keys()].some(k => /notes|gclid|gbraid|wbraid|utm/.test(k)) && ![...b.values()].some(v => /fever|vomit|G-123/.test(v)), 'checkout: notes and ad identifiers never sent to Stripe');
const k1 = st.headers['Idempotency-Key'];
const same = { option: 'home-doctor', ref: 'CWC-2345-6789', name: 'Test Person', phone: '+1 555 0100', location: 'Hotel test', date: plus(3), time: '10:00' };
calls = []; r = mkRes(); await checkout({ method: 'POST', body: { ...same } }, r);
const kA = stripeCall().headers['Idempotency-Key'];
calls = []; r = mkRes(); await checkout({ method: 'POST', body: { ...same } }, r);
ok(stripeCall().headers['Idempotency-Key'] === kA, 'checkout: double submit with the same folio reuses the same Stripe session');
ok(k1 !== kA, 'checkout: different folio, different session');
calls = []; r = mkRes(); await checkout({ method: 'POST', body: { option: 'clinic-consult' } }, r);
ok(stripeCall().form.get('line_items[0][price_data][unit_amount]') === '4950', 'checkout: optional clinic deposit 4950 cents');
process.env.PAYMENT_FULL_APPROVED = 'yes';
calls = []; r = mkRes(); await checkout({ method: 'POST', body: { option: 'home-doctor', location: 'x' } }, r);
ok(stripeCall().form.get('line_items[0][price_data][unit_amount]') === '18900', 'checkout: 100% charge only when PAYMENT_FULL_APPROVED=yes (prepared, off by default)');
delete process.env.PAYMENT_FULL_APPROVED;
failHosts.add('api.stripe.com');
r = mkRes(); await checkout({ method: 'POST', body: { option: 'home-doctor', location: 'x' } }, r); ok(r.code === 303 && /wa\.me/.test(r.loc), 'checkout: Stripe error -> WhatsApp fallback, no crash');
failHosts = new Set();
const realFetch = globalThis.fetch; globalThis.fetch = async () => { throw new Error('network'); };
r = mkRes(); await checkout({ method: 'POST', body: { option: 'home-doctor', location: 'x' } }, r); ok(r.code === 303 && /wa\.me/.test(r.loc), 'checkout: network failure -> WhatsApp fallback');
globalThis.fetch = realFetch;
withStore(); calls = [];
r = mkRes(); await checkout({ method: 'POST', body: { option: 'home-doctor', location: 'x' } }, r);
const folio = stripeCall().form.get('client_reference_id');
const { getStore, loadRecord } = require('./_lib/store.js');
ok(((await loadRecord(getStore(), folio)) || {}).status === 'payment_pending', 'checkout: payment-pending folio recorded in the register');

// ---------- 9. request API (register + notifications, mocked) ----------
resetEnv();
const request = require('./request.js');
const reqBody = (o = {}) => ({ service: 'home-doctor', name: 'Ana Test', phone: '+1 555 0101', email: 'ana@example.test', location: 'Hotel Test 101', date: plus(2), time: '10:00', notes: 'Gate code 1234', lang: 'en', ...o });
const post = async (body, ip = '1.1.1.1') => { const res = mkRes(); await request({ method: 'POST', headers: { 'x-forwarded-for': ip }, body }, res); return res; };
r = await post(reqBody());
ok(r.code === 503 && r.body.ok === false, 'request: no register and no channel -> 503, never claims it was received');
process.env.RESEND_API_KEY = 're_test'; process.env.NOTIFY_EMAIL = 'team@example.test';
r = await post(reqBody());
ok(r.code === 200 && r.body.ok && r.body.saved === false && r.body.delivered === true, 'request: email only -> received (delivered, not stored)');
withStore();
process.env.ULTRAMSG_INSTANCE = 'i'; process.env.ULTRAMSG_TOKEN = 't'; process.env.NOTIFY_WHATSAPP = '5210000000000';
calls = [];
r = await post(reqBody({ price: 1, amount: 1 }), '2.2.2.2');
const ref1 = r.body.ref;
ok(r.code === 200 && r.body.ok && r.body.saved && r.body.delivered && /^CWC-/.test(ref1 || '') && r.body.status === 'received_pending_confirmation', 'request: stored, delivered, folio and status returned');
const teamMail = calls.find(c => /resend/.test(c.host) && (JSON.parse(c.body).to || []).includes('team@example.test'));
ok(teamMail && teamMail.body.includes(ref1) && teamMail.headers['idempotency-key'] === `req-${ref1}`, 'request: team email carries the folio and an idempotency key');
const clientMail = calls.find(c => /resend/.test(c.host) && (JSON.parse(c.body).to || []).includes('ana@example.test'));
ok(clientMail && /pending confirmation/.test(clientMail.body) && !/Gate code/.test(clientMail.body), 'request: client receipt says pending confirmation, without notes');
const wa = calls.find(c => /ultramsg/.test(c.host));
const waText = wa ? new URLSearchParams(wa.body).get('body') : '';
ok(wa && waText.includes(ref1) && !/Gate code|Ana Test|555/.test(waText), 'request: internal WhatsApp has folio only (no name, phone or notes)');
const rec1 = await loadRecord(getStore(), ref1);
ok(rec1 && rec1.status === 'received' && rec1.sealed && !JSON.stringify(rec1).includes('Ana Test') && !JSON.stringify(rec1).includes('Gate code'), 'request: contact data sealed (encrypted) in the register');
ok(!calls.some(c => /google|doubleclick|facebook/.test(c.host)), 'request: nothing sent to ad platforms');
r = await post(reqBody({ price: 1 }), '2.2.2.2');
ok(r.body.ok && r.body.duplicate && r.body.ref === ref1, 'request: duplicate within 15 min returns the same folio');
r = await post(reqBody({ service: 'home-doctor', location: '' }), '3.3.3.3'); ok(r.code === 400 && r.body.errors && r.body.errors.location, 'request: house call without location -> 400');
r = await post(reqBody({ service: 'test-pago' }), '3.3.3.3'); ok(r.code === 400, 'request: internal test product rejected');
r = await post(reqBody({ service: '../etc' }), '3.3.3.3'); ok(r.code === 400, 'request: unknown service rejected');
r = await post(reqBody({ date: '2020-01-01' }), '3.3.3.3'); ok(r.code === 400 && r.body.errors && r.body.errors.date, 'request: past date rejected');
r = await post(reqBody({ phone: '12' }), '3.3.3.3'); ok(r.code === 400, 'request: invalid phone rejected');
r = await post(reqBody({ website: 'spam' }), '3.3.3.3'); ok(r.code === 400, 'request: honeypot rejected');
calls = []; r = await post(reqBody({ service: 'lab', location: '', name: '<b>Lab</b> User', phone: '+52 624 000 0001' }), '4.4.4.4');
ok(r.body.ok && !calls.some(c => /resend/.test(c.host) && /<b>/.test(c.body)), 'request: HTML stripped from fields');
calls = []; r = await post(reqBody({ service: 'xray', location: '', phone: '+52 624 000 0002', lang: 'es' }), '4.4.4.4');
ok(r.body.ok && /Hola%2C%20envi%C3%A9%20la%20solicitud/.test(r.body.whatsapp || ''), 'request: Spanish folio message for WhatsApp');
r = await post(reqBody({ service: 'partner', company: '', phone: '+52 624 000 0003' }), '4.4.4.4'); ok(r.code === 400 && r.body.errors && r.body.errors.company, 'request: partnership needs a company');
r = await post(reqBody({ service: 'partner', company: 'Hotel Test', location: '', phone: '+52 624 000 0004' }), '4.4.4.4'); ok(r.body.ok, 'request: hotel/concierge partnership request accepted');
let last; for (let i = 0; i < 9; i++) last = await post(reqBody({ phone: '+1 555 01' + (10 + i) }), '9.9.9.9');
ok(last.code === 429, 'request: rate limited after 8 per hour per IP');
calls = []; r = await post(reqBody({ service: 'home-doctor', intent: 'pay', phone: '+1 555 0199' }), '5.5.5.5');
ok(r.body.ok && r.body.status === 'payment_pending' && !calls.some(c => /ultramsg/.test(c.host)) && calls.some(c => /resend/.test(c.host) && /Card deposit started/.test(c.body)), 'request: pay intent records payment_pending and tells the team');
calls = []; r = await post(reqBody({ service: 'video-consult', intent: 'pay', location: '', phone: '+1 555 0198' }), '5.5.5.5');
ok(r.body.status === 'received_pending_confirmation', 'request: pay intent ignored for services that are not charged online');
failHosts = new Set(['api.resend.com', 'api.ultramsg.com', 'crm.example.test']); process.env.REQUEST_WEBHOOK_URL = 'https://crm.example.test/hook';
r = await post(reqBody({ phone: '+1 555 0177' }), '6.6.6.6');
ok(r.body.ok && r.body.saved && !r.body.delivered, 'request: all channels down -> still stored (honest: saved, not delivered)');
const queued = await getStore().kv.range('idx:notify-retry', 10);
ok(queued.includes(r.body.ref), 'request: undelivered notice queued for retry');
failHosts = new Set(); delete process.env.REQUEST_WEBHOOK_URL;

// ---------- 10. daily reconcile (cron) ----------
const reconcile = require('./reconcile.js');
r = mkRes(); await reconcile({ headers: {} }, r); ok(r.code === 401, 'reconcile: requires CRON_SECRET');
process.env.CRON_SECRET = 'cron-test';
calls = []; r = mkRes(); await reconcile({ headers: { authorization: 'Bearer cron-test' } }, r);
ok(r.code === 200 && r.body.retried >= 1 && calls.some(c => /resend/.test(c.host) && /\(retry\)/.test(c.body)), 'reconcile: failed notices re-sent from the persistent queue');
ok(r.body.digestSent !== undefined && !calls.some(c => /daily check/.test(c.body) && /Ana Test|555/.test(c.body)), 'reconcile: digest has folios only');

// ---------- 11. Stripe webhook ----------
resetEnv(); withStore();
process.env.STRIPE_WEBHOOK_SECRET = 'whsec_test'; process.env.RESEND_API_KEY = 're_test'; process.env.NOTIFY_EMAIL = 'team@example.test';
process.env.TURNO_WEBHOOK_URL = 'https://turno.example.test/hook'; process.env.WEB_PAYMENT_SECRET = 'wps';
const webhook = require('./stripe-webhook.js');
const sign = (raw, secret = 'whsec_test') => { const t = Math.floor(Date.now() / 1000); return `t=${t},v1=${crypto.createHmac('sha256', secret).update(`${t}.${raw}`).digest('hex')}`; };
const hook = async (evt, sig) => { const raw = JSON.stringify(evt); const res = mkRes(); await webhook({ method: 'POST', headers: { 'stripe-signature': sig || sign(raw) }, body: Buffer.from(raw) }, res); return res; };
const session = (o = {}) => ({ id: 'cs_test_1', object: 'checkout.session', payment_status: 'paid', amount_total: 9450, currency: 'usd', payment_intent: 'pi_test_1', client_reference_id: 'CWC-ABCD-EFGH', customer_details: { email: 'p@example.test' }, metadata: { option: 'home-doctor', folio: 'CWC-ABCD-EFGH', service_name: 'Doctor house call', service_total_usd: '189', customer_name: 'Pat', customer_phone: '+1 555' }, ...o });
const mails = () => calls.filter(c => /resend/.test(c.host));
r = await hook({ id: 'evt_bad', type: 'checkout.session.completed', data: { object: session() } }, 't=1,v1=00'); ok(r.code === 400, 'webhook: invalid signature rejected');
r = await hook({ id: 'evt_old', type: 'checkout.session.completed', data: { object: session() } }, sign('{}', 'other')); ok(r.code === 400, 'webhook: signature from another secret rejected');
calls = []; r = await hook({ id: 'evt_1', type: 'checkout.session.completed', data: { object: session() } });
ok(r.code === 200 && calls.filter(c => /turno/.test(c.host)).length === 1 && mails().length === 1, 'webhook: paid booking -> one QuickTurno entry and one email');
ok(mails()[0] && /\[CWC-ABCD-EFGH\]/.test(mails()[0].body), 'webhook: email subject carries the folio');
calls = []; r = await hook({ id: 'evt_1', type: 'checkout.session.completed', data: { object: session() } });
ok(r.body === 'duplicate' && calls.length === 0, 'webhook: duplicate event -> no second notice');
failHosts = new Set(['api.resend.com']); calls = [];
r = await hook({ id: 'evt_2', type: 'checkout.session.completed', data: { object: session({ id: 'cs_test_2', payment_intent: 'pi_test_2' }) } });
ok(r.code === 500, 'webhook: email failure -> 500 so Stripe retries');
failHosts = new Set(); calls = [];
r = await hook({ id: 'evt_2', type: 'checkout.session.completed', data: { object: session({ id: 'cs_test_2', payment_intent: 'pi_test_2' }) } });
ok(r.code === 200 && calls.filter(c => /turno/.test(c.host)).length === 0 && mails().length === 1, 'webhook: retry sends only the failed channel (no duplicate QuickTurno entry)');
calls = []; r = await hook({ id: 'evt_3', type: 'checkout.session.completed', data: { object: session({ id: 'cs_other', metadata: {} }) } });
ok(/not a clinic booking/.test(r.body) && calls.length === 0, 'webhook: payments of other services on the account are ignored');
calls = []; r = await hook({ id: 'evt_4', type: 'checkout.session.completed', data: { object: session({ id: 'cs_nofolio', client_reference_id: null, payment_intent: 'pi_nf', metadata: { option: 'home-doctor', service_name: 'Doctor house call' } }) } });
ok(r.code === 200 && mails()[0] && /NO FOLIO/.test(mails()[0].body), 'webhook: payment without an associated request is flagged');
calls = []; r = await hook({ id: 'evt_5', type: 'checkout.session.expired', data: { object: session({ payment_status: 'unpaid' }) } });
ok(r.code === 200 && mails()[0] && /Checkout not completed/.test(mails()[0].body), 'webhook: abandoned checkout -> team alert to call the patient');
calls = []; r = await hook({ id: 'evt_6', type: 'checkout.session.async_payment_failed', data: { object: session() } });
ok(mails()[0] && /Payment FAILED/.test(mails()[0].body), 'webhook: failed payment -> team alert');
calls = []; r = await hook({ id: 'evt_7', type: 'charge.refunded', data: { object: { object: 'charge', payment_intent: 'pi_test_1', amount_refunded: 9450, currency: 'usd', description: 'Deposit — Doctor house call (total $189 USD) — CWC-ABCD-EFGH' } } });
ok(mails()[0] && /Refund issued/.test(mails()[0].body), 'webhook: refund -> team notice');
ok(((await loadRecord(getStore(), 'CWC-ABCD-EFGH')) || {}).status === 'refunded', 'webhook: refund recorded in the register');
calls = []; r = await hook({ id: 'evt_8', type: 'charge.dispute.created', data: { object: { object: 'dispute', payment_intent: 'pi_test_1', amount: 9450, reason: 'fraudulent' } } });
ok(mails()[0] && /DISPUTE/.test(mails()[0].body), 'webhook: dispute -> urgent team notice (found by payment intent)');
calls = []; r = await hook({ id: 'evt_9', type: 'charge.refunded', data: { object: { object: 'charge', payment_intent: 'pi_unrelated', amount_refunded: 100, description: 'Other business' } } });
ok(/not a clinic payment/.test(r.body) && calls.length === 0, 'webhook: refunds of other businesses ignored');

// ---------- 12. 410 page ----------
const gone = require('./gone.js'); r = mkRes(); gone({}, r);
ok(r.statusCode === 410 && /no longer offered/.test(r.body), 'gone: answers 410 with a helpful page');

console.error = silence;
console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
