// Build the Spanish equivalents of the core pages (V4 §5: EN/ES equivalents).
// Content is written for Spanish speakers, not machine-translated; same facts and prices as the EN pages.
// usage: node tools/es.mjs && node tools/chrome.mjs
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(fileURLToPath(new URL('..', import.meta.url)));
const BASE = 'https://www.cabowalkinclinic.com';
const WA = (t) => `https://wa.me/5216242261023?text=${encodeURIComponent(t)}`;
const MAPS = 'https://maps.app.goo.gl/6KLir6R7JC4PyAMd6';
const home = readFileSync(join(root, 'index.html'), 'utf8');
const headTpl = home.slice(0, home.indexOf('</head>'));
const tail = home.slice(home.indexOf('</main>') + 7); // footer, sticky bar, scripts

const esc = (s) => s.replace(/&[a-z]+;/g, (m) => ({ '&aacute;': 'á', '&eacute;': 'é', '&iacute;': 'í', '&oacute;': 'ó', '&uacute;': 'ú', '&ntilde;': 'ñ', '&uuml;': 'ü', '&mdash;': '—', '&ndash;': '–', '&rsquo;': '’', '&middot;': '·', '&amp;': '&', '&iquest;': '¿', '&iexcl;': '¡', '&nbsp;': ' ' }[m] || m)).replace(/<[^>]+>/g, '').replace(/"/g, '\\"');

function page({ path, title, desc, crumb, main, faqs = [], sticky }) {
  let h = headTpl
    .replace(/<html lang="[^"]*"/, '<html lang="es"')
    .replace(/<title>[\s\S]*?<\/title>/, `<title>${title}</title>`)
    .replace(/<meta name="description" content="[^"]*"/, `<meta name="description" content="${desc}"`)
    .replace(/<link rel="canonical" href="[^"]*"/, `<link rel="canonical" href="${BASE}${path}"`)
    .replace(/<meta property="og:title" content="[^"]*"/, `<meta property="og:title" content="${title}"`)
    .replace(/<meta property="og:description" content="[^"]*"/, `<meta property="og:description" content="${desc}"`)
    .replace(/<meta property="og:url" content="[^"]*"/, `<meta property="og:url" content="${BASE}${path}"`)
    .replace(/<script type="application\/ld\+json">\{"@context": "https:\/\/schema\.org", "@type": "(BreadcrumbList|FAQPage)"[\s\S]*?<\/script>\n?/g, '');
  if (!/og:locale/.test(h)) h = h.replace('<meta property="og:type"', '<meta property="og:locale" content="es_MX"><meta property="og:type"');
  const bc = { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Inicio', item: `${BASE}/es/` }, ...(crumb ? [{ '@type': 'ListItem', position: 2, name: crumb, item: `${BASE}${path}` }] : [])] };
  h += `<script type="application/ld+json">${JSON.stringify(bc)}</script>\n`;
  if (faqs.length) {
    const fq = { '@context': 'https://schema.org', '@type': 'FAQPage', inLanguage: 'es', mainEntity: faqs.map(([q, a]) => ({ '@type': 'Question', name: esc(q).replace(/\\"/g, '"'), acceptedAnswer: { '@type': 'Answer', text: esc(a).replace(/\\"/g, '"') } })) };
    h += `<script type="application/ld+json">${JSON.stringify(fq)}</script>\n`;
  }
  const faqHtml = faqs.length ? `<section class="sec alt"><div class="wrap"><h2>Preguntas frecuentes</h2>${faqs.map(([q, a]) => `<details class="faq"><summary>${q}</summary><p>${a}</p></details>`).join('')}</div></section>` : '';
  let t = tail.replace(/<div class="stickybar">[\s\S]*?<\/div>(?=s*<script)/, `<div class="stickybar">${sticky}</div>`)
    .replace(/aria-label="Chat with us on WhatsApp"/, 'aria-label="Escríbenos por WhatsApp"').replace(/<span>Chat on WhatsApp<\/span>/, '<span>WhatsApp</span>')
    .replace(/https:\/\/wa\.me\/5216242261023\?text=[^"]*/g, WA('Hola, tengo una pregunta para Cabo Walk-In Clinic.'));
  const html = `${h}</head>\n<body><a class="skip-link" href="#main">Ir al contenido</a><header class="top"><div class="wrap"></div></header><main id="main" class="home4" lang="es">${main}${faqHtml}</main>${t.replace(/^[\s\S]*?(<footer class="site">)/, '$1')}`;
  mkdirSync(join(root, path), { recursive: true });
  writeFileSync(join(root, path, 'index.html'), html);
  console.log('es page', path);
}

const clinicCard = `<div class="clinic-card"><div data-open-status><small>Horario</small><b><span class="open-dot" aria-hidden="true"></span><span class="st">Abierto todos los días, 9 AM – 5 PM</span></b><span>Fuera de horario: con cita, confirmada por un médico</span></div><div><small>Dirección</small><b>Francisco I. Madero S/N, Centro</b><span>Entre Vicente Guerrero y Miguel Hidalgo · <a href="tel:+526242261023">Llamar +52 624 226 1023</a></span></div></div>`;
const dirBtn = `<a class="btn btn--line" href="${MAPS}" target="_blank" rel="noopener">Cómo llegar</a>`;
const waBtn = (t, l = 'WhatsApp') => `<a class="btn btn--wa" href="${WA(t)}" target="_blank" rel="noopener">${l}</a>`;
const board = `<div class="board"><div class="row"><span class="n">Consulta en clínica<small>Sin cita, 9 AM – 5 PM</small></span><span class="dots"></span><span class="v">$99</span></div><div class="row"><span class="n">Videoconsulta<small>Con el Dr. Kevin González Adame</small></span><span class="dots"></span><span class="v">$59</span></div><div class="row"><span class="n">Médico a domicilio<small>Hotel, villa o yate en Los Cabos</small></span><span class="dots"></span><span class="v">$189</span></div><div class="row"><span class="n">Terapia IV<small>Tras valoración médica · NAD+ $279</small></span><span class="dots"></span><span class="v">desde $159</span></div><div class="row"><span class="n">Laboratorio, rayos X, enfermería<small>Se confirma antes del servicio</small></span><span class="dots"></span><span class="v q">Cotización</span></div></div><p style="margin-top:12px;font-size:14px;color:var(--mute)">Precios en dólares (USD) con impuestos incluidos. Las reservas en línea piden un depósito del 50%; el resto se paga después del servicio.</p>`;
const team = `<div class="docs"><div class="dcard"><img src="/images/dr-kevin-adame-portrait.jpg" alt="Dr. Kevin González Adame" width="600" height="800" loading="lazy"><div class="b"><h3>Dr. Kevin González Adame</h3><span class="role">Médico Cirujano y Partero · Instituto Politécnico Nacional</span><span class="meta">Clínica, domicilio y videoconsulta · Español e inglés</span><span class="lic">Cédula 14796516</span></div></div><div class="dcard"><img src="/images/dra-myriam.webp" alt="Dra. Myriam Aisse Palacios Alarcón" width="480" height="480" loading="lazy"><div class="b"><h3>Dra. Myriam Aisse Palacios Alarcón</h3><span class="role">Médico General · Centro de Estudios Universitarios Xochicalco</span><span class="meta">Médica, sujeta a disponibilidad · Español e inglés</span><span class="lic">Cédula 11664989</span></div></div></div><p style="margin-top:14px;font-size:14.5px;color:var(--mute)">Puedes verificar cada cédula en el <a href="https://www.cedulaprofesional.sep.gob.mx/" target="_blank" rel="noopener">Registro Nacional de Profesionistas</a>.</p>`;
const emerg = `<p class="note">Dolor de pecho, dificultad para respirar, sangrado abundante o señales de infarto cerebral son emergencias: <strong>llama al 911</strong>. No somos sala de urgencias.</p>`;

// 1. Home
page({
  path: '/es/', crumb: null,
  title: 'Clínica médica en Cabo San Lucas | Cabo Walk-In Clinic',
  desc: 'Clínica médica sin cita en el centro de Cabo San Lucas: consulta $99, videoconsulta $59, médico a domicilio $189. Médicos con cédula. Abierto 9 AM a 5 PM.',
  sticky: `<a class="btn btn--call" href="/book/?service=clinic-consult" data-book="clinic-consult">Reservar consulta</a>`,
  main: `<section class="h4"><div class="wrap"><div><span class="eyebrow">Clínica sin cita · Centro de Cabo San Lucas</span><h1>Médicos bilingües en <em>Cabo San Lucas</em>, hoy mismo</h1><p class="lead">Consulta en nuestra clínica del centro, videoconsulta desde tu habitación o médico a domicilio en tu hotel o villa. Precios en dólares con impuestos incluidos y factura detallada para tu seguro.</p><div class="ctas"><a class="btn btn--navy" href="/book/?service=clinic-consult" data-book="clinic-consult">Reservar consulta · $99</a>${dirBtn}${waBtn('Hola, tengo una pregunta para Cabo Walk-In Clinic.')}</div>${clinicCard}</div><div class="doc-visual"><div class="ph"><img src="/images/dr-kevin-adame-portrait.jpg" alt="Dr. Kevin González Adame con uniforme de Cabo Walk-In Clinic" width="600" height="800" fetchpriority="high"></div><div class="hero-cred"><span class="x" aria-hidden="true"><svg viewBox="0 0 24 24" width="20" height="20"><g fill="#D32F2F"><rect x="9.5" y="2" width="5" height="20" rx="1"/><rect x="2" y="9.5" width="20" height="5" rx="1"/></g></svg></span><span><b>Dr. Kevin González Adame</b><small>Médico Cirujano y Partero · IPN<br>Cédula 14796516</small></span></div></div></div></section>
<section class="sec"><div class="wrap"><span class="eyebrow">Para empezar</span><h2>¿Qué te trae hoy?</h2><p class="sub">Elige lo que más se parece a tu caso y te llevamos al tipo de atención adecuado.</p><ul class="chips2"><li><a href="/es/clinica-medica-cabo-san-lucas/">Fiebre, tos o dolor de garganta <span>Clínica · $99</span></a></li><li><a href="/es/medico-a-domicilio-cabo-san-lucas/">Me siento muy mal para salir del hotel <span>Domicilio · $189</span></a></li><li><a href="/es/videoconsulta-medica/">Una duda o una receta <span>Video · $59</span></a></li><li><a href="/es/clinica-medica-cabo-san-lucas/">Infección estomacal <span>Clínica o domicilio</span></a></li><li><a href="/radiology-x-ray-cabo-san-lucas/">Una caída o torcedura <span>Rayos X · cotización</span></a></li><li><a href="/es/seguros-medicos-internacionales-cabo/">Trámite de seguro de viaje <span>Verificación</span></a></li></ul>${emerg}</div></section>
<section class="sec alt"><div class="wrap split2"><div><span class="eyebrow">Precios</span><h2>Conoce el precio antes de la consulta</h2><p class="sub">Sin costos ocultos. Medicamentos, laboratorio e imagen no están incluidos en el precio de la consulta; el médico te avisa antes de indicarlos.</p><a class="btn btn--line" href="/book/" data-book="">Reservar en línea</a></div>${board}</div></section>
<section class="sec" id="equipo"><div class="wrap"><span class="eyebrow">Nuestros médicos</span><h2>Médicos con cédula, con nombre y apellido</h2>${team}</div></section>
<section class="sec alt"><div class="wrap"><span class="eyebrow">Cómo funciona</span><h2>Tres pasos, sin sorpresas</h2><ol class="steps4"><li><b>Ven, reserva o escríbenos</b><span>Visítanos de 9 AM a 5 PM, reserva en línea o cuéntanos por WhatsApp qué necesitas.</span></li><li><b>Confirmamos precio y horario</b><span>Ves el precio en USD con impuestos antes de cualquier servicio.</span></li><li><b>Consulta y documentos</b><span>Diagnóstico y plan, receta si hace falta y factura detallada para tu aseguradora.</span></li></ol></div></section>`,
  faqs: [
    ['¿Necesito cita?', 'No. Recibimos pacientes sin cita de 9 AM a 5 PM todos los días. También puedes reservar en línea o escribirnos por WhatsApp.'],
    ['¿Cuánto cuesta la consulta?', 'La consulta en clínica cuesta $99 USD, la videoconsulta $59 USD y el médico a domicilio $189 USD, con impuestos incluidos.'],
    ['¿Aceptan seguros?', 'Aceptamos seguros médicos y de viaje de Estados Unidos y Canadá, sujetos a verificación de la póliza y confirmación de cobertura. No aceptamos seguros nacionales mexicanos. Siempre puedes pagar como paciente particular.'],
    ['¿Atienden emergencias?', 'No somos sala de urgencias. En una emergencia llama al 911 o acude al hospital más cercano.'],
  ],
});

// 2. Clinic
page({
  path: '/es/clinica-medica-cabo-san-lucas/', crumb: 'Clínica médica',
  title: 'Clínica médica sin cita en Cabo San Lucas | Consulta $99',
  desc: 'Consulta médica sin cita en el centro de Cabo San Lucas por $99 USD con impuestos. Médicos bilingües con cédula, receta y factura. Abierto 9 AM a 5 PM.',
  sticky: `<a class="btn btn--call" href="/book/?service=clinic-consult" data-book="clinic-consult">Reservar consulta · $99</a>`,
  main: `<section class="h4"><div class="wrap" style="grid-template-columns:1.1fr .9fr"><div><span class="eyebrow">Consulta en clínica · $99</span><h1>Clínica médica sin cita en el centro de Cabo San Lucas</h1><p class="lead">Llega sin cita de 9 AM a 5 PM. Un médico te revisa, te explica el diagnóstico y el tratamiento, y te da receta y factura si las necesitas.</p><div class="ctas"><a class="btn btn--navy" href="/book/?service=clinic-consult" data-book="clinic-consult">Reservar consulta · $99</a>${dirBtn}${waBtn('Hola, quiero una consulta en la clínica.')}</div>${clinicCard}</div>${board}</div></section>
<section class="sec"><div class="wrap"><span class="eyebrow">Qué atendemos</span><h2>Problemas comunes durante un viaje</h2><ul class="chips2"><li><a href="#">Fiebre e infecciones respiratorias</a></li><li><a href="#">Infección estomacal o intoxicación</a></li><li><a href="#">Infección urinaria</a></li><li><a href="#">Heridas leves y curaciones</a></li><li><a href="#">Torceduras</a></li><li><a href="#">Reacciones alérgicas leves</a></li><li><a href="#">Insolación y deshidratación</a></li><li><a href="#">Renovación de recetas</a></li></ul>${emerg}</div></section>
<section class="sec alt"><div class="wrap"><span class="eyebrow">Equipo</span><h2>Te atiende un médico con cédula</h2>${team}</div></section>`.replace(/<a href="#">/g, '<a href="/book/?service=clinic-consult" data-book="clinic-consult">'),
  faqs: [
    ['¿Necesito cita?', 'No. Puedes llegar sin cita de 9 AM a 5 PM todos los días.'],
    ['¿Qué incluye la consulta de $99?', 'La valoración por un médico, el diagnóstico, el plan de tratamiento y la receta si es necesaria. Medicamentos, estudios de laboratorio e imagen se cotizan aparte y te los explicamos antes.'],
    ['¿Atienden a niños?', 'Sí. Nuestros médicos atienden adultos y niños con problemas comunes de salud.'],
    ['¿Puedo pagar con tarjeta?', 'Sí, con tarjeta o en efectivo. Te damos factura detallada para tu seguro.'],
  ],
});

// 3. House call
page({
  path: '/es/medico-a-domicilio-cabo-san-lucas/', crumb: 'Médico a domicilio',
  title: 'Médico a domicilio en Cabo San Lucas | Hotel o villa $189',
  desc: 'Médico a domicilio en Los Cabos: un médico bilingüe va a tu hotel, villa o yate por $189 USD con impuestos. Fuera de horario con cita, confirmada por un médico.',
  sticky: `<a class="btn btn--call" href="/book/?service=home-doctor" data-book="home-doctor">Reservar médico a domicilio</a>`,
  main: `<section class="h4"><div class="wrap" style="grid-template-columns:1.1fr .9fr"><div><span class="eyebrow">Médico a domicilio · $189</span><h1>Médico a domicilio en tu hotel o villa en Los Cabos</h1><p class="lead">Si te sientes muy mal para salir, viajas con niños o con familiares mayores, un médico va a tu hotel, villa, condominio o yate. Te confirmamos la ventana de llegada al reservar.</p><div class="ctas"><a class="btn btn--navy" href="/book/?service=home-doctor" data-book="home-doctor">Reservar · $189</a>${waBtn('Hola, necesito un médico en mi hotel. Mi hotel es: ', 'Pedir por WhatsApp')}</div>${clinicCard}</div>${board}</div></section>
<section class="sec"><div class="wrap"><span class="eyebrow">Cobertura</span><h2>Dónde atendemos</h2><div class="svc2" style="margin-top:0"><a href="#"><b>Centro, Marina y Médano</b><small>Cerca de la clínica</small></a><a href="#"><b>Pedregal y Quivira</b><small>Coordinamos el acceso</small></a><a href="#"><b>Corredor turístico</b><small>Resorts y villas</small></a><a href="#"><b>San José del Cabo</b><small>Zona hotelera y centro</small></a></div><p class="sub" style="margin-top:18px">Horario de la clínica: 9 AM a 5 PM. Visitas fuera de horario (17:00 a 08:00): con cita, sujetas a confirmación médica.</p>${emerg}</div></section>
<section class="sec alt"><div class="wrap"><span class="eyebrow">Cómo funciona</span><h2>Así llega el médico</h2><ol class="steps4"><li><b>Reserva o escríbenos</b><span>Dinos tu hotel, número de habitación y síntomas principales.</span></li><li><b>Confirmamos precio y llegada</b><span>$189 USD con impuestos; depósito del 50% al reservar en línea.</span></li><li><b>Consulta en tu habitación</b><span>Diagnóstico, tratamiento, receta y factura detallada para tu seguro.</span></li></ol></div></section>`.replace(/<a href="#">/g, '<a href="/book/?service=home-doctor" data-book="home-doctor">'),
  faqs: [
    ['¿Cuánto cuesta el médico a domicilio?', '$189 USD con impuestos incluidos. Medicamentos y estudios se cotizan aparte y te los explicamos antes.'],
    ['¿Van a todos los hoteles?', 'Atendemos hoteles, resorts todo incluido, villas, condominios y yates en Cabo San Lucas, el Corredor Turístico y San José del Cabo. Coordinamos con la recepción.'],
    ['¿Atienden de noche?', 'Las visitas fuera de horario (17:00 a 08:00) son con cita y se confirman con un médico. No ofrecemos atención inmediata garantizada.'],
    ['¿Es una emergencia?', 'Si hay riesgo para la vida, llama al 911. No somos un servicio de urgencias.'],
  ],
});

// 4. Video
page({
  path: '/es/videoconsulta-medica/', crumb: 'Videoconsulta',
  title: 'Videoconsulta médica en Los Cabos | $59 con médico bilingüe',
  desc: 'Videoconsulta con el Dr. Kevin González Adame (cédula 14796516) por $59 USD con impuestos. Para dudas, síntomas leves y recetas. Tiene límites: puede pedirte acudir.',
  sticky: `<a class="btn btn--call" href="/book/?service=video-consult" data-book="video-consult">Reservar videoconsulta · $59</a>`,
  main: `<section class="h4"><div class="wrap" style="grid-template-columns:1.1fr .9fr"><div><span class="eyebrow">Videoconsulta · $59</span><h1>Videoconsulta médica desde tu habitación</h1><p class="lead">Habla por video con el Dr. Kevin González Adame. Útil para dudas, síntomas leves, seguimiento y recetas. Si el médico necesita revisarte en persona, te lo dice y te orienta a la clínica, a una visita a domicilio o a un hospital.</p><div class="ctas"><a class="btn btn--navy" href="/book/?service=video-consult" data-book="video-consult">Reservar videoconsulta · $59</a>${waBtn('Hola, quiero una videoconsulta.')}</div></div><div class="docs" style="grid-template-columns:1fr"><div class="dcard"><img src="/images/dr-kevin-adame-portrait.jpg" alt="Dr. Kevin González Adame" width="600" height="800" loading="eager"><div class="b"><h3>Dr. Kevin González Adame</h3><span class="role">Médico Cirujano y Partero · IPN</span><span class="meta">Español e inglés</span><span class="lic">Cédula 14796516</span></div></div></div></div></section>
<section class="sec"><div class="wrap"><span class="eyebrow">Límites</span><h2>Cuándo sí y cuándo no</h2><table class="choose"><thead><tr><th scope="col">Situación</th><th scope="col">Recomendación</th></tr></thead><tbody><tr><th scope="row">Dudas, síntomas leves, recetas</th><td>Videoconsulta $59</td></tr><tr><th scope="row">Necesitas exploración física</th><td><a href="/es/clinica-medica-cabo-san-lucas/">Consulta en clínica $99</a> o <a href="/es/medico-a-domicilio-cabo-san-lucas/">médico a domicilio $189</a></td></tr><tr class="er"><th scope="row">Dolor de pecho, falta de aire, sangrado</th><td><strong>Llama al 911</strong></td></tr></tbody></table></div></section>`,
  faqs: [
    ['¿Cuánto cuesta la videoconsulta?', '$59 USD con impuestos incluidos.'],
    ['¿Pueden darme receta por video?', 'El médico decide si es seguro indicar un tratamiento por video. Algunos casos requieren revisión en persona.'],
    ['¿Qué necesito?', 'Un teléfono o computadora con cámara y buena conexión.'],
  ],
});

// 5. Insurance
page({
  path: '/es/seguros-medicos-internacionales-cabo/', crumb: 'Seguros internacionales',
  title: 'Seguros médicos de EE. UU. y Canadá en Cabo | Verificación',
  desc: 'Aceptamos seguros médicos y de viaje de Estados Unidos y Canadá, sujetos a verificación de la póliza y confirmación de cobertura. Factura detallada en inglés.',
  sticky: `<a class="btn btn--call" href="/book/" data-book="">Reservar en línea</a>`,
  main: `<section class="h4"><div class="wrap" style="grid-template-columns:1.1fr .9fr"><div><span class="eyebrow">Seguros</span><h1>Seguros de Estados Unidos y Canadá, sujetos a verificación</h1><p class="lead">Antes de una consulta no urgente revisamos tu póliza de forma privada y confirmamos la cobertura y la forma de pago. No prometemos cobertura, pago directo ni reembolso hasta que tu aseguradora lo confirme por escrito.</p><div class="ctas">${waBtn('Hola, quiero verificar mi seguro. Mi aseguradora es: ', 'Verificar mi seguro')}<a class="btn btn--line" href="/book/" data-book="">Pagar como particular</a></div></div><ul class="board" style="list-style:none;margin:0"><li class="row"><span class="n">1. Dinos el nombre de tu aseguradora<small>No envíes documentos de tu póliza en formularios públicos</small></span></li><li class="row"><span class="n">2. Verificamos cobertura y forma de pago<small>Pago directo solo si tu aseguradora lo confirma</small></span></li><li class="row"><span class="n">3. Recibes factura detallada<small>En inglés, para tu reclamación</small></span></li></ul></div></section>
<section class="sec"><div class="wrap"><span class="eyebrow">Particular</span><h2>Precios como paciente particular</h2>${board}<p class="note">No aceptamos seguros nacionales mexicanos (IMSS, ISSSTE u otros). La aseguradora decide la cobertura; te ayudamos con la documentación.</p></div></section>`,
  faqs: [
    ['¿Aceptan mi seguro de viaje?', 'Aceptamos seguros médicos y de viaje de Estados Unidos y Canadá, sujetos a verificación de la póliza y confirmación de cobertura.'],
    ['¿Tienen pago directo con aseguradoras?', 'Solo cuando tu aseguradora lo confirma por escrito para tu caso. Si no, pagas como particular y recibes factura detallada para tu reembolso.'],
    ['¿Aceptan seguros mexicanos?', 'No aceptamos seguros nacionales mexicanos. Puedes pagar como paciente particular.'],
  ],
});

// 6. Contact
page({
  path: '/es/contacto/', crumb: 'Contacto',
  title: 'Contacto y ubicación | Cabo Walk-In Clinic, Cabo San Lucas',
  desc: 'Cabo Walk-In Clinic: Francisco I. Madero S/N, entre Vicente Guerrero y Miguel Hidalgo, Centro, Cabo San Lucas. Abierto 9 AM a 5 PM. WhatsApp +52 624 226 1023.',
  sticky: `<a class="btn btn--call" href="/book/" data-book="">Reservar</a>`,
  main: `<section class="h4"><div class="wrap" style="grid-template-columns:1.1fr .9fr"><div><span class="eyebrow">Contacto</span><h1>Contacto y ubicación</h1><p class="lead">Visítanos en el centro de Cabo San Lucas, escríbenos por WhatsApp o llámanos. Te responde una persona, en español o inglés.</p><div class="ctas">${waBtn('Hola, tengo una pregunta para Cabo Walk-In Clinic.', 'WhatsApp +52 624 226 1023')}<a class="btn btn--line" href="tel:+526242261023">Llamar</a>${dirBtn}</div>${clinicCard}</div>${board}</div></section>
<section class="sec" id="ubicacion"><div class="wrap"><span class="eyebrow">Ubicación</span><h2>Cómo llegar</h2><div class="loc"><div class="info"><dl><dt>Dirección</dt><dd>Francisco I. Madero S/N, entre Vicente Guerrero y Miguel Hidalgo, Centro, 23450 Cabo San Lucas, B.C.S.</dd><dt>Plus Code</dt><dd>V3MP+4M Cabo San Lucas</dd><dt>Horario</dt><dd>9:00 a 17:00 todos los días. Fuera de horario con cita.</dd><dt>Teléfono</dt><dd><a href="tel:+526242261023">+52 624 226 1023</a> (llamadas y WhatsApp)</dd></dl><div style="margin-top:22px"><a class="btn btn--navy" href="${MAPS}" target="_blank" rel="noopener">Abrir en Google Maps</a></div></div><div class="map" id="map-slot"><div class="ph"><b style="color:var(--navy)">Cabo Walk-In Clinic · Centro</b><button class="btn btn--line" type="button" id="map-load">Mostrar mapa</button><small style="color:var(--mute)">Carga Google Maps</small></div></div></div><script>(function(){var b=document.getElementById('map-load');if(!b)return;b.addEventListener('click',function(){document.getElementById('map-slot').innerHTML='<iframe title="Mapa: Cabo Walk-In Clinic" src="https://www.google.com/maps?q=22.8827602,-109.9133287&z=17&output=embed" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>';});})();</script>${emerg}</div></section>`,
});
