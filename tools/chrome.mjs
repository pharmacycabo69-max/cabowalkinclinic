// Apply the v4 site chrome (utility bar, header, footer, v4 assets, hreflang) to every live page.
// usage: node tools/chrome.mjs            (idempotent: re-running replaces the same blocks)
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(fileURLToPath(new URL('..', import.meta.url)));
const vercel = JSON.parse(readFileSync(join(root, 'vercel.json'), 'utf8'));
const redirected = new Set((vercel.redirects || []).map(r => r.source.replace(/\/?$/, '/')));

// EN <-> ES equivalents (only pages that really exist in both languages)
export const PAIRS = {
  '/': '/es/',
  '/walk-in-clinic-doctor-cabo-san-lucas/': '/es/clinica-medica-cabo-san-lucas/',
  '/home-doctor/': '/es/medico-a-domicilio-cabo-san-lucas/',
  '/video-doctor-consultation/': '/es/videoconsulta-medica/',
  '/insurance-billing-cabo/': '/es/seguros-medicos-internacionales-cabo/',
  '/contact/': '/es/contacto/',
};
const ES2EN = Object.fromEntries(Object.entries(PAIRS).map(([a, b]) => [b, a]));

const WA = 'https://wa.me/5216242261023';
const MAPS = 'https://maps.app.goo.gl/6KLir6R7JC4PyAMd6';
const CROSS = '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><g fill="#D32F2F"><rect x="9.5" y="2" width="5" height="20" rx="1"></rect><rect x="2" y="9.5" width="20" height="5" rx="1"></rect></g></svg>';
const I = {
  clock: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2a10 10 0 100 20 10 10 0 000-20zm1 5v5.4l4 2.4-.8 1.3L11 13V7h2z"/></svg>',
  pin: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2C8.1 2 5 5.1 5 9c0 5.2 7 13 7 13s7-7.8 7-13c0-3.9-3.1-7-7-7zm0 9.5a2.5 2.5 0 110-5 2.5 2.5 0 010 5z"/></svg>',
  phone: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6.6 10.8a15.1 15.1 0 006.6 6.6l2.2-2.2a1 1 0 011-.25 11.4 11.4 0 003.6.57 1 1 0 011 1V20a1 1 0 01-1 1A17 17 0 013 4a1 1 0 011-1h3.5a1 1 0 011 1c0 1.25.2 2.45.57 3.57a1 1 0 01-.25 1z"/></svg>',
};

const T = {
  en: {
    skip: 'Skip to main content', home: 'Cabo Walk-In Clinic &mdash; Home', status: 'Clinic open daily 9 AM &ndash; 5 PM',
    addr: 'Francisco I. Madero, Downtown Cabo San Lucas', services: 'Services', doctors: 'Doctors', insurance: 'Insurance', location: 'Location',
    book: 'Book Visit', menu: 'Menu', lang: 'Espa&ntilde;ol', langCode: 'es', navLabel: 'Main',
    svc: [
      ['/walk-in-clinic-doctor-cabo-san-lucas/', 'Walk-in clinic', 'See a doctor today, downtown', '$99'],
      ['/video-doctor-consultation/', 'Video visit', 'A doctor by video, from your room', '$59'],
      ['/home-doctor/', 'Doctor house call', 'Hotel, villa or yacht', '$189'],
      ['/iv-therapy/', 'IV therapy', 'After a medical screening', 'from $159'],
      ['/lab-tests/', 'Lab tests', 'Blood draws, hotel or clinic', 'Quote'],
      ['/radiology-x-ray-cabo-san-lucas/', 'X-ray', 'Licensed radiology team', 'Quote'],
      ['/nurse-care/', 'Nurse care', 'Wound care, injections, post-op', 'Quote'],
      ['/insurance-billing-cabo/', 'Insurance &amp; billing', 'US &amp; Canada, subject to verification', ''],
    ],
    links: { doctors: '/about/#team', insurance: '/insurance-billing-cabo/', location: '/contact/#location', book: '/book/' },
    foot: {
      tag: 'English-speaking doctors in downtown Cabo San Lucas. Walk-in visits, video visits and house calls.',
      visit: 'Visit', addr: 'Francisco I. Madero S/N, between Vicente Guerrero &amp; Miguel Hidalgo, Centro, 23450, Cabo San Lucas, B.C.S., Mexico',
      hours: 'Clinic: 9:00 AM &ndash; 5:00 PM daily<br>After hours (5 PM &ndash; 8 AM): by appointment, confirmed by a doctor',
      maps: 'Get directions', care: 'Care', company: 'Clinic',
      careLinks: [['/walk-in-clinic-doctor-cabo-san-lucas/', 'Walk-in clinic'], ['/video-doctor-consultation/', 'Video visit'], ['/home-doctor/', 'Doctor house call'], ['/iv-therapy/', 'IV therapy'], ['/lab-tests/', 'Lab tests'], ['/radiology-x-ray-cabo-san-lucas/', 'X-ray'], ['/nurse-care/', 'Nurse care'], ['/aesthetic-medicine-cabo/', 'Aesthetic medicine']],
      coLinks: [['/about/', 'About &amp; team'], ['/insurance-billing-cabo/', 'Insurance &amp; billing'], ['/contact/', 'Contact &amp; location'], ['/book/', 'Book online'], ['/privacy-policy/', 'Privacy policy'], ['/terms-of-service/', 'Terms of service'], ['/refund-policy/', 'Refund policy'], ['/medical-disclaimer/', 'Medical disclaimer']],
      badges: ['Prices in USD, tax included', 'Licensed physicians', 'US &amp; Canada insurance, subject to verification'],
      fine: '&copy; 2026 Cabo Walk-In Clinic. This site provides general information and does not replace professional medical advice. Video visits have limits: the doctor may ask you to come in or go to a hospital. <strong>Not for emergencies &mdash; call 911.</strong>',
      legal: 'Responsable sanitaria: Dra. Rosibel N&uacute;&ntilde;ez Rojo &middot; C&eacute;dula profesional 7408277 &middot; Aviso de funcionamiento 2603045036X00153',
      wa: 'WhatsApp or call',
    },
  },
  es: {
    skip: 'Ir al contenido', home: 'Cabo Walk-In Clinic &mdash; Inicio', status: 'Cl&iacute;nica abierta todos los d&iacute;as, 9 AM &ndash; 5 PM',
    addr: 'Francisco I. Madero, Centro de Cabo San Lucas', services: 'Servicios', doctors: 'M&eacute;dicos', insurance: 'Seguros', location: 'Ubicaci&oacute;n',
    book: 'Reservar', menu: 'Men&uacute;', lang: 'English', langCode: 'en', navLabel: 'Principal',
    svc: [
      ['/es/clinica-medica-cabo-san-lucas/', 'Consulta en cl&iacute;nica', 'Sin cita, en el centro', '$99'],
      ['/es/videoconsulta-medica/', 'Videoconsulta', 'Un m&eacute;dico por video', '$59'],
      ['/es/medico-a-domicilio-cabo-san-lucas/', 'M&eacute;dico a domicilio', 'Hotel, villa o yate', '$189'],
      ['/iv-therapy/', 'Terapia IV', 'Tras valoraci&oacute;n m&eacute;dica (en ingl&eacute;s)', 'desde $159'],
      ['/lab-tests/', 'Laboratorio', 'Toma de muestras (en ingl&eacute;s)', 'Cotizaci&oacute;n'],
      ['/radiology-x-ray-cabo-san-lucas/', 'Rayos X', 'Equipo de radiolog&iacute;a (en ingl&eacute;s)', 'Cotizaci&oacute;n'],
      ['/es/seguros-medicos-internacionales-cabo/', 'Seguros internacionales', 'EE. UU. y Canad&aacute;, sujeto a verificaci&oacute;n', ''],
      ['/es/contacto/', 'Contacto y ubicaci&oacute;n', 'C&oacute;mo llegar', ''],
    ],
    links: { doctors: '/es/#equipo', insurance: '/es/seguros-medicos-internacionales-cabo/', location: '/es/contacto/#ubicacion', book: '/book/' },
    foot: {
      tag: 'M&eacute;dicos biling&uuml;es en el centro de Cabo San Lucas. Consulta en cl&iacute;nica, videoconsulta y m&eacute;dico a domicilio.',
      visit: 'Vis&iacute;tanos', addr: 'Francisco I. Madero S/N, entre Vicente Guerrero y Miguel Hidalgo, Centro, 23450, Cabo San Lucas, B.C.S., M&eacute;xico',
      hours: 'Cl&iacute;nica: 9:00 a 17:00 todos los d&iacute;as<br>Fuera de horario (17:00 a 08:00): con cita, confirmada por un m&eacute;dico',
      maps: 'C&oacute;mo llegar', care: 'Atenci&oacute;n', company: 'Cl&iacute;nica',
      careLinks: [['/es/clinica-medica-cabo-san-lucas/', 'Consulta en cl&iacute;nica'], ['/es/videoconsulta-medica/', 'Videoconsulta'], ['/es/medico-a-domicilio-cabo-san-lucas/', 'M&eacute;dico a domicilio'], ['/iv-therapy/', 'Terapia IV (EN)'], ['/lab-tests/', 'Laboratorio (EN)'], ['/radiology-x-ray-cabo-san-lucas/', 'Rayos X (EN)'], ['/aesthetic-medicine-cabo/', 'Medicina est&eacute;tica (EN)']],
      coLinks: [['/about/', 'Equipo (EN)'], ['/es/seguros-medicos-internacionales-cabo/', 'Seguros internacionales'], ['/es/contacto/', 'Contacto y ubicaci&oacute;n'], ['/book/', 'Reservar en l&iacute;nea'], ['/privacy-policy/', 'Aviso de privacidad (EN)'], ['/refund-policy/', 'Reembolsos (EN)']],
      badges: ['Precios en USD con impuestos incluidos', 'M&eacute;dicos con c&eacute;dula', 'Seguros de EE. UU. y Canad&aacute;, sujeto a verificaci&oacute;n'],
      fine: '&copy; 2026 Cabo Walk-In Clinic. Este sitio ofrece informaci&oacute;n general y no sustituye una consulta m&eacute;dica. La videoconsulta tiene l&iacute;mites: el m&eacute;dico puede pedirte acudir a la cl&iacute;nica o a un hospital. <strong>No es un servicio de emergencias &mdash; llama al 911.</strong>',
      legal: 'Responsable sanitaria: Dra. Rosibel N&uacute;&ntilde;ez Rojo &middot; C&eacute;dula profesional 7408277 &middot; Aviso de funcionamiento 2603045036X00153',
      wa: 'WhatsApp o llamada',
    },
  },
};

export function chrome(path, lang) {
  const t = T[lang];
  const other = lang === 'en' ? (PAIRS[path] || '/es/') : (ES2EN[path] || '/');
  const cur = (href) => (href === path ? ' aria-current="page"' : '');
  const svcLinks = t.svc.map(([h, n, d, p]) => `<a href="${h}"${cur(h)}><b>${n}</b><small>${d}${p ? ` &middot; <span class="pr">${p}</span>` : ''}</small></a>`).join('');
  const util = `<div class="utilbar"><div class="wrap"><span class="ub-st" data-open-status><span class="open-dot" aria-hidden="true"></span><span class="st">${t.status}</span></span><span class="ub-sep" aria-hidden="true">|</span><a class="ub-addr" href="${MAPS}" target="_blank" rel="noopener">${I.pin}${t.addr}</a><a href="tel:+526242261023">${I.phone}+52 624 226 1023</a><a class="ub-lang" href="${other}" hreflang="${t.langCode}" lang="${t.langCode}">${t.lang}</a></div></div>`;
  const header = `<header class="top"><div class="wrap">
<a class="brand cwc-logo" href="${lang === 'es' ? '/es/' : '/'}" aria-label="${t.home}"><span>CABO</span><span class="cwc-logo-cross" aria-hidden="true">${CROSS}</span><span>WALK-IN CLINIC</span></a>
<nav class="main" id="site-nav" aria-label="${t.navLabel}"><div class="nav-svc"><button type="button" aria-expanded="false" aria-controls="svc-panel">${t.services}</button><div class="svc-panel" id="svc-panel">${svcLinks}</div></div><a href="${t.links.doctors}">${t.doctors}</a><a href="${t.links.insurance}"${cur(t.links.insurance)}>${t.insurance}</a><a href="${t.links.location}">${t.location}</a></nav><div class="hdr-actions"><a class="btn hdr-book" href="${t.links.book}" data-book="">${t.book}</a><button class="nav-toggle" type="button" aria-label="${t.menu}" aria-expanded="false" aria-controls="site-nav"><span class="nt-bars" aria-hidden="true"></span><span class="nt-label">${t.menu}</span></button></div>
</div></header>`;
  const f = t.foot;
  const col = (h, links) => `<div><h2 class="ft-h">${h}</h2><p>${links.map(([u, n]) => `<a href="${u}">${n}</a>`).join('<br>')}</p></div>`;
  const footer = `<footer class="site"><div class="wrap">
<div class="cols">
<div><p class="ft-brand">CABO <span style="color:#e57373">+</span> WALK-IN CLINIC</p><p>${f.tag}</p><div class="ft-badges">${f.badges.map(b => `<span>${b}</span>`).join('')}</div></div>
<div><h2 class="ft-h">${f.visit}</h2><p>${f.addr}<br><a href="${MAPS}" target="_blank" rel="noopener">${f.maps}</a></p><p>${f.hours}</p><p>${f.wa}: <a href="${WA}" target="_blank" rel="noopener">+52 624 226 1023</a></p></div>
${col(f.care, f.careLinks)}
${col(f.company, f.coLinks)}
</div>
<p class="cwc-legal" style="font-size:13px;opacity:.85;margin:22px 0 0;line-height:1.6">${f.legal}</p><div class="fine">${f.fine}</div>
</div></footer>`;
  return { util, header, footer, other };
}

const HEAD_ADD = '<link rel="preload" href="/assets/fonts/source-serif-4-600-latin.woff2" as="font" type="font/woff2" crossorigin>\n<link rel="stylesheet" href="/assets/shared/site.v4.css">';

export function applyChrome(html, path) {
  const lang = path.startsWith('/es/') ? 'es' : 'en';
  const c = chrome(path, lang);
  let h = html;
  // remove an earlier utility bar, then replace header + footer
  h = h.replace(/<div class="utilbar">[\s\S]*?<\/div><\/div>(?=<header class="top">)/, '');
  if (!/<header class="top">[\s\S]*?<\/header>/.test(h)) throw new Error('no header ' + path);
  h = h.replace(/<header class="top">[\s\S]*?<\/header>/, c.util + c.header);
  if (!/<footer class="site">[\s\S]*?<\/footer>/.test(h)) throw new Error('no footer ' + path);
  h = h.replace(/<footer class="site">[\s\S]*?<\/footer>/, c.footer);
  h = h.replace(/<a class="skip-link" href="#main">[^<]*<\/a>/, `<a class="skip-link" href="#main">${T[lang].skip}</a>`);
  // assets
  if (!h.includes('/assets/shared/site.v4.css')) {
    if (h.includes('<link rel="stylesheet" href="/assets/shared/site.v3.css">')) h = h.replace('<link rel="stylesheet" href="/assets/shared/site.v3.css">', '<link rel="stylesheet" href="/assets/shared/site.v3.css">\n' + HEAD_ADD);
    else h = h.replace('</head>', HEAD_ADD + '\n</head>');
  }
  h = h.replace(/\/assets\/shared\/site\.v2\.js/g, '/assets/shared/site.v3.js');
  // hreflang for real pairs only
  h = h.replace(/<link rel="alternate" hreflang="[^"]+" href="[^"]+">\n?/g, '');
  const en = lang === 'en' ? path : ES2EN[path], es = lang === 'es' ? path : PAIRS[path];
  if (en && es && existsSync(join(root, es, 'index.html'))) {
    const base = 'https://www.cabowalkinclinic.com';
    const alt = `<link rel="alternate" hreflang="en" href="${base}${en}">\n<link rel="alternate" hreflang="es" href="${base}${es}">\n<link rel="alternate" hreflang="x-default" href="${base}${en}">\n`;
    h = h.replace(/(<link rel="canonical"[^>]*>)\n?/, `$1\n${alt}`);
  }
  if (lang === 'es') h = h.replace(/<html lang="[^"]*"/, '<html lang="es"');
  return h;
}

// CLI
if (process.argv[1] && resolve(process.argv[1]) === resolve(fileURLToPath(import.meta.url))) {
  const { readdirSync } = await import('node:fs');
  const walk = (dir, rel = '') => readdirSync(dir, { withFileTypes: true }).flatMap(e => {
    if (!e.isDirectory() || /^(\.|node_modules|tools|docs|_drafts|assets|api|images|wp-|customer-cabinet)/.test(e.name)) return [];
    const r = rel + '/' + e.name;
    return [...(existsSync(join(dir, e.name, 'index.html')) ? [r + '/'] : []), ...walk(join(dir, e.name), r)];
  });
  const pages = ['/', ...walk(root)].filter(p => !redirected.has(p));
  let n = 0;
  for (const p of pages) {
    const f = join(root, p, 'index.html');
    const src = readFileSync(f, 'utf8');
    if (/noindex/.test(src) && p !== '/thanks/') continue;
    writeFileSync(f, applyChrome(src, p)); n++;
  }
  console.log('chrome applied to', n, 'pages');
}
