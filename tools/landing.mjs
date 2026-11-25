// Ads/SEO landing template. Regenerates <main> of the core service pages from data in tools/landings.data.mjs.
// Keeps each page's URL, <head> (title/description/canonical/schema) unless the data overrides title/desc.
// usage: node tools/landing.mjs && node tools/chrome.mjs
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { PAGES } from './landings.data.mjs';

const root = resolve(fileURLToPath(new URL('..', import.meta.url)));
const MAPS = 'https://maps.app.goo.gl/6KLir6R7JC4PyAMd6';
const WA = (t) => `https://wa.me/5216242261023?text=${encodeURIComponent(t)}`;
const CROSS = '<svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><g fill="#D32F2F"><rect x="9.5" y="2" width="5" height="20" rx="1"/><rect x="2" y="9.5" width="20" height="5" rx="1"/></g></svg>';
const IC = {
  cal: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 2h2v2h6V2h2v2h3a1 1 0 011 1v15a1 1 0 01-1 1H4a1 1 0 01-1-1V5a1 1 0 011-1h3V2zm12 8H5v9h14v-9z"/></svg>',
  phone: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6.6 10.8a15.1 15.1 0 006.6 6.6l2.2-2.2a1 1 0 011-.25 11.4 11.4 0 003.6.57 1 1 0 011 1V20a1 1 0 01-1 1A17 17 0 013 4a1 1 0 011-1h3.5a1 1 0 011 1c0 1.25.2 2.45.57 3.57a1 1 0 01-.25 1z"/></svg>',
  pin: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2C8.1 2 5 5.1 5 9c0 5.2 7 13 7 13s7-7.8 7-13c0-3.9-3.1-7-7-7zm0 9.5a2.5 2.5 0 110-5 2.5 2.5 0 010 5z"/></svg>',
  wa: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12.05 0A11.9 11.9 0 001.74 17.84L.06 24l6.3-1.65A11.9 11.9 0 1012.05 0zm0 21.8a9.9 9.9 0 01-5.04-1.38l-.36-.21-3.74.98 1-3.65-.24-.37a9.9 9.9 0 1118.27-5.27 9.9 9.9 0 01-9.89 9.9z"/></svg>',
  shield: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2l8 3v6c0 5-3.4 9.4-8 11-4.6-1.6-8-6-8-11V5l8-3zm-1 13l6-6-1.4-1.4L11 12.2 8.4 9.6 7 11l4 4z"/></svg>',
};
const PEOPLE = {
  kevin: { img: '/images/dr-kevin-adame-portrait.jpg', w: 600, h: 800, name: 'Dr. Kevin Gonz&aacute;lez Adame', role: 'M&eacute;dico Cirujano y Partero &middot; Instituto Polit&eacute;cnico Nacional', meta: 'Clinic, house calls and video visits &middot; English &amp; Spanish', lic: '14796516' },
  myriam: { img: '/images/dra-myriam.webp', w: 480, h: 480, name: 'Dra. Myriam Aisse Palacios Alarc&oacute;n', role: 'M&eacute;dico General &middot; Centro de Estudios Universitarios Xochicalco', meta: 'Physician, subject to availability &middot; English &amp; Spanish', lic: '11664989' },
  jenifer: { img: '/images/jenifer-arciga-portrait.jpg', w: 600, h: 800, name: 'Lic. Jenifer Alexandra Arciga Acosta', role: 'Lic. en Radiolog&iacute;a e Imagenolog&iacute;a &middot; Universidad ITEC', meta: 'External imaging collaborator (not a medical specialist)', lic: '13435891' },
  luis: { img: '/images/luis-camacho-portrait.jpg', w: 600, h: 800, name: 'Luis Antonio Camacho Villegas', role: 'T&eacute;cnico Radi&oacute;logo', meta: 'External imaging collaborator', lic: '4359616' },
};
const REVIEWS = [
  ['Christina V.', 'House call', 'The medical team was very fast with our house call, professional, and friendly. I&rsquo;m already feeling better.'],
  ['Estefany N.', 'Clinic visit', 'I came in feeling very sick due to low blood pressure and dehydration&hellip; I was seen quickly, which was such a relief.'],
  ['Anny P.', 'Clinic visit', 'Excellent service, very efficient staff, everyone is very attentive and kind, and the prices are affordable.'],
  ['Bryan D.', 'Insurance &amp; coordination', 'Very professional, knowledgeable, and pleasant to work with&hellip; insurance, medical transports and international moving parts.'],
];

const btn = {
  book: (svc, label) => `<a class="btn btn--navy" href="/book/${svc ? `?service=${svc}` : ''}" data-book="${svc || ''}">${IC.cal}${label}</a>`,
  call: () => `<a class="btn btn--line" href="tel:+526242261023">${IC.phone}Call the clinic</a>`,
  wa: (t, label = 'WhatsApp') => `<a class="btn btn--wa" href="${WA(t)}" target="_blank" rel="noopener">${IC.wa}${label}</a>`,
  dir: () => `<a class="btn btn--line" href="${MAPS}" target="_blank" rel="noopener">${IC.pin}Directions</a>`,
};
const clinicCard = `<div class="clinic-card"><div data-open-status><small>Clinic hours</small><b><span class="open-dot" aria-hidden="true"></span><span class="st">Open daily 9 AM &ndash; 5 PM</span></b><span>After hours by appointment, confirmed by a doctor</span></div><div><small>Address</small><b>Francisco I. Madero S/N, Centro</b><span>Downtown Cabo San Lucas &middot; <a href="tel:+526242261023">+52 624 226 1023</a></span></div></div>`;
const person = (k, big) => { const p = PEOPLE[k]; return `<div class="dcard${big ? ' rise' : ''}"><img src="${p.img}" alt="${p.name}" width="${p.w}" height="${p.h}" loading="lazy"><div class="b"><h3>${p.name}</h3><span class="role">${p.role}</span><span class="meta">${p.meta}</span><span class="lic">C&eacute;dula ${p.lic}</span></div></div>`; };

function build(d) {
  const ctas = d.ctas.map(c => c === 'book' ? btn.book(d.svc, d.bookLabel) : c === 'call' ? btn.call() : c === 'dir' ? btn.dir() : c === 'wa' ? btn.wa(d.waText, d.waLabel) : c).join('');
  const visual = d.visual === 'pair'
    ? `<div class="pair-visual">${['jenifer', 'luis'].map(k => `<figure><img src="${PEOPLE[k].img}" alt="${PEOPLE[k].name}" width="600" height="800" ${k === 'jenifer' ? 'fetchpriority="high"' : 'loading="lazy"'}><figcaption><b>${PEOPLE[k].name.replace('Lic. Jenifer Alexandra Arciga Acosta', 'Lic. Jenifer Arciga').replace('Luis Antonio Camacho Villegas', 'Luis Camacho')}</b>C&eacute;dula ${PEOPLE[k].lic}</figcaption></figure>`).join('')}</div>`
    : d.visual === 'img'
      ? `<figure class="lp-img"><img src="${d.img}" alt="${d.imgAlt}" width="${d.imgW}" height="${d.imgH}" fetchpriority="high">${d.imgNote ? `<figcaption>${d.imgNote}</figcaption>` : ''}</figure>`
      : `<div class="doc-visual"><div class="ph"><img src="${PEOPLE.kevin.img}" alt="Dr. Kevin Gonz&aacute;lez Adame in Cabo Walk-In Clinic scrubs" width="600" height="800" fetchpriority="high"></div><div class="hero-cred"><span class="x" aria-hidden="true">${CROSS}</span><span><b>Dr. Kevin Gonz&aacute;lez Adame</b><small>M&eacute;dico Cirujano y Partero &middot; IPN<br>C&eacute;dula 14796516 &middot; English &amp; Spanish</small></span></div><div class="hero-rating"><b>4.9 &#9733;</b>40 Google reviews</div></div>`;
  const offer = d.offer ? `<div class="offer"><span class="offer-price">${d.offer[0]}</span><span class="offer-text">${d.offer[1]}</span></div>` : '';
  const chips = d.chips ? `<section class="sec" aria-labelledby="hw-t"><div class="wrap"><span class="eyebrow">${d.chipsEyebrow || 'What we help with'}</span><h2 id="hw-t">${d.chipsTitle}</h2>${d.chipsSub ? `<p class="sub">${d.chipsSub}</p>` : ''}<ul class="chips2">${d.chips.map(c => `<li><a href="${c[1] || `/book/${d.svc ? `?service=${d.svc}` : ''}`}"${c[1] ? '' : ` data-book="${d.svc || ''}"`}>${c[0]}${c[2] ? ` <span>${c[2]}</span>` : ''}</a></li>`).join('')}</ul>${d.emerg !== false ? '<p class="note">Chest pain, trouble breathing, severe bleeding or stroke signs are emergencies: <strong>call 911</strong>. We are not an emergency room.</p>' : ''}</div></section>` : '';
  const prices = d.prices ? `<section class="sec alt" aria-labelledby="pr-t"><div class="wrap split2"><div><span class="eyebrow">Price</span><h2 id="pr-t">${d.pricesTitle || 'Clear prices, before you are seen'}</h2><p class="sub">${d.pricesSub || 'US dollars, tax included. Online bookings take a 50% card deposit; the balance is paid after the service.'}</p>${d.incl ? `<div class="incl"><div><b>Included</b><ul>${d.incl[0].map(x => `<li>${x}</li>`).join('')}</ul></div><div><b>Not included</b><ul>${d.incl[1].map(x => `<li>${x}</li>`).join('')}</ul></div></div>` : ''}</div><div class="board">${d.prices.map(r => `<div class="row"><span class="n">${r[0]}<small>${r[1]}</small></span><span class="dots"></span><span class="v${/quote|free/i.test(r[2]) ? ' q' : ''}">${r[2]}</span></div>`).join('')}</div></div></section>` : '';
  const why = d.why ? `<section class="sec" aria-labelledby="why-t"><div class="wrap"><span class="eyebrow">${d.whyEyebrow || 'Why patients choose us'}</span><h2 id="why-t">${d.whyTitle}</h2><div class="why4g">${d.why.map(w => `<div class="w rise"><span class="ic" aria-hidden="true">${IC.shield}</span><h3>${w[0]}</h3><p>${w[1]}</p></div>`).join('')}</div>${d.body ? `<div class="seo-copy">${d.body}</div>` : ''}</div></section>` : '';
  const steps = d.steps ? `<section class="sec alt" aria-labelledby="st-t"><div class="wrap"><span class="eyebrow">How it works</span><h2 id="st-t">${d.stepsTitle || 'Three steps, no surprises'}</h2><ol class="steps4">${d.steps.map(s => `<li><b>${s[0]}</b><span>${s[1]}</span></li>`).join('')}</ol></div></section>` : '';
  const team = d.team ? `<section class="sec" aria-labelledby="tm-t"><div class="wrap"><span class="eyebrow">${d.teamEyebrow || 'Your clinicians'}</span><h2 id="tm-t">${d.teamTitle || 'Licensed, bilingual and named'}</h2><p class="sub">Every c&eacute;dula can be checked in Mexico&rsquo;s <a href="https://www.cedulaprofesional.sep.gob.mx/" target="_blank" rel="noopener">public registry</a>.</p><div class="docs">${d.team.map(k => person(k, true)).join('')}</div>${d.teamNote ? `<p style="margin-top:14px;font-size:14.5px;color:var(--mute)">${d.teamNote}</p>` : ''}</div></section>` : '';
  const revs = (d.reviews || [0, 1, 2]).map(i => REVIEWS[i]);
  const reviews = `<section class="sec alt" aria-labelledby="rv-t"><div class="wrap"><div class="rvh"><div><span class="eyebrow">Reviews</span><h2 id="rv-t">What patients say on Google</h2></div><a class="rv-badge" href="https://maps.app.goo.gl/6KLir6R7JC4PyAMd6" target="_blank" rel="noopener"><b>4.9</b><span><span aria-hidden="true" style="color:#F4B400">&#9733;&#9733;&#9733;&#9733;&#9733;</span><small>40 Google reviews</small></span></a></div><div class="rv3">${revs.map(r => `<figure><blockquote>&ldquo;${r[2]}&rdquo;</blockquote><figcaption><b>${r[0]}</b> &middot; ${r[1]}</figcaption></figure>`).join('')}</div><p style="font-size:13px;color:var(--mute);margin-top:12px">Excerpts from public Google reviews, shortened.</p></div></section>`;
  const loc = `<section class="sec" aria-labelledby="lc-t"><div class="wrap"><span class="eyebrow">Location &amp; hours</span><h2 id="lc-t">${d.locTitle || 'Downtown Cabo San Lucas, a few blocks from the marina'}</h2><div class="loc"><div class="info"><dl><dt>Address</dt><dd>Francisco I. Madero S/N, between Vicente Guerrero &amp; Miguel Hidalgo, Centro, 23450 Cabo San Lucas, B.C.S.</dd><dt>Hours</dt><dd><span data-open-status><span class="open-dot" aria-hidden="true"></span><span class="st">Open daily 9 AM &ndash; 5 PM</span></span><br><span style="color:var(--mute);font-size:14px">After hours (5 PM &ndash; 8 AM) by appointment, confirmed by a doctor</span></dd><dt>Contact</dt><dd><a href="tel:+526242261023">+52 624 226 1023</a> &middot; <a href="${WA('Hi! I have a question for Cabo Walk-In Clinic.')}" target="_blank" rel="noopener">WhatsApp</a></dd></dl><div style="display:flex;flex-wrap:wrap;gap:10px;margin-top:20px">${btn.dir()}${btn.book(d.svc, d.bookLabel)}</div></div><div class="map"><div class="ph">${IC.pin.replace('<svg', '<svg width="40" height="40" style="fill:#0b2a4a"')}<b style="color:var(--navy)">Cabo Walk-In Clinic &middot; Centro</b><span style="color:var(--mute);font-size:14px">Plus Code V3MP+4M</span><a class="btn btn--line" href="${MAPS}" target="_blank" rel="noopener">Open in Google Maps</a></div></div></div></div></section>`;
  const faq = `<section class="sec alt"><div class="wrap"><h2>Frequently asked questions</h2>${d.faqs.map(f => `<details class="faq"><summary>${f[0]}</summary><p>${f[1]}</p></details>`).join('')}</div></section>`;
  const fin = `<section class="sec"><div class="wrap"><div class="final4"><div><h2>${d.finalTitle}</h2><p>${d.finalText}</p></div><div class="ctas">${btn.book(d.svc, d.bookLabel)}${btn.wa(d.waText, d.waLabel)}${btn.call()}</div></div></div></section>`;
  return `<main id="main" class="home4 lp">
<section class="h4" aria-labelledby="h1"><div class="wrap"><div>
<span class="eyebrow">${d.eyebrow}</span>
<h1 id="h1">${d.h1}</h1>
<p class="lead">${d.lead}</p>
${offer}<div class="ctas">${ctas}</div>
${d.noClinicCard ? '' : clinicCard}
</div>${visual}</div></section>
<section class="trust" aria-label="Why patients trust us"><div class="wrap">${(d.trust || [['Tax included', 'Published USD prices.'], ['Named doctors', 'Public, verifiable c&eacute;dulas.'], ['US &amp; Canada', 'Insurance, subject to verification.'], ['4.9 &#9733; Google', '40 reviews from patients.']]).map(t => `<div class="t"><b>${t[0]}</b><span>${t[1]}</span></div>`).join('')}</div></section>
${chips}${prices}${why}${steps}${team}${d.extra || ''}${reviews}${d.noLoc ? '' : loc}${faq}${fin}
</main>`;
}

const tpl = readFileSync(join(root, 'walk-in-clinic-doctor-cabo-san-lucas', 'index.html'), 'utf8');
for (const d of PAGES) {
  const f = join(root, d.path, 'index.html');
  let h;
  if (existsSync(f)) h = readFileSync(f, 'utf8');
  else { // new page from the walk-in template head
    mkdirSync(join(root, d.path), { recursive: true });
    h = tpl.replace(/https:\/\/www\.cabowalkinclinic\.com\/walk-in-clinic-doctor-cabo-san-lucas\//g, `https://www.cabowalkinclinic.com${d.path}`)
      .replace(/"position": 2, "name": "[^"]*"/, `"position": 2, "name": "${d.crumb}"`).replace(/<link rel="alternate"[^>]*>\n?/g, '');
  }
  h = h.replace(/<main id="main"[\s\S]*<\/main>/, build(d));
  if (d.title) h = h.replace(/<title>[\s\S]*?<\/title>/, `<title>${d.title}</title>`).replace(/(<meta property="og:title" content=")[^"]*/, `$1${d.title}`);
  if (d.desc) h = h.replace(/(<meta name="description" content=")[^"]*/, `$1${d.desc}`).replace(/(<meta property="og:description" content=")[^"]*/, `$1${d.desc}`);
  const sb = d.ctas[0] === 'wa'
    ? `<a class="btn btn--wa" href="${WA(d.waText)}" target="_blank" rel="noopener">${d.stickyLabel}</a>`
    : `<a class="btn btn--call" href="/book/${d.svc ? `?service=${d.svc}` : ''}" data-book="${d.svc || ''}">${d.stickyLabel || d.bookLabel}</a>`;
  h = h.replace(/<div class="stickybar">[\s\S]*?<\/div>(?=\s*<script)/, `<div class="stickybar">${sb}</div>`);
  writeFileSync(f, h);
  console.log('landing', d.path);
}
