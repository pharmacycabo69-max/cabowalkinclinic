/* Cabo Walk-In Clinic booking wizard v10 (vanilla JS, EN/ES). Mounts as a modal on [data-book] clicks, or inline in #cwcb-inline.
   The service list between the SV markers is generated from api/_catalog.json by tools/catalog.mjs (do not edit by hand).
   Prices are for display only: /api/checkout and /api/request read the catalog on the server.
   Flow (V6): request with folio (no charge) -> team confirms -> payment when it applies. Card deposits stay available for
   the services the catalog allows; video consultations and quotes are never charged here. */
(function () {
  'use strict';
  var TZ = 'America/Mazatlan';
  var WA = '5216242261023';
  /*SV*/var SV = [{"k":"clinic-consult","n":{"en":"Walk-in clinic visit","es":"Consulta en clínica"},"p":99,"g":"doctor","m":false,"pay":"optional"},{"k":"home-doctor","n":{"en":"Doctor house call","es":"Médico a domicilio"},"p":189,"g":"doctor","m":true,"pay":"deposit"},{"k":"video-consult","n":{"en":"Video doctor consultation","es":"Videoconsulta médica"},"p":59,"g":"doctor","m":false,"pay":"request"},{"k":"iv-hydration","n":{"en":"IV Hydration Drip","es":"Suero de hidratación"},"p":159,"g":"iv","m":true,"pay":"deposit"},{"k":"iv-recovery","n":{"en":"IV Recovery Drip","es":"Suero de recuperación"},"p":159,"g":"iv","m":true,"pay":"deposit"},{"k":"iv-immune","n":{"en":"IV Immune Support","es":"Suero de apoyo inmune"},"p":169,"g":"iv","m":true,"pay":"deposit"},{"k":"iv-postflight","n":{"en":"IV Post-Flight Reset","es":"Suero post-vuelo"},"p":169,"g":"iv","m":true,"pay":"deposit"},{"k":"iv-glow","n":{"en":"IV Glow Drip","es":"Suero Glow"},"p":169,"g":"iv","m":true,"pay":"deposit"},{"k":"iv-athletic","n":{"en":"IV Athletic Recovery","es":"Suero de recuperación deportiva"},"p":169,"g":"iv","m":true,"pay":"deposit"},{"k":"iv-nad","n":{"en":"NAD+ IV","es":"Suero NAD+"},"p":279,"g":"iv","m":true,"pay":"request"},{"k":"iv-total-wellness","n":{"en":"Total Wellness IV","es":"Suero Total Wellness"},"p":189,"g":"iv","m":true,"pay":"request","hidden":true},{"k":"iv-group","n":{"en":"Group IV (3+ people)","es":"Suero para grupos (3+)"},"p":null,"g":"iv","m":true,"pay":"quote"},{"k":"nursing","n":{"en":"Nursing care","es":"Enfermería"},"p":null,"g":"care","m":true,"pay":"quote"},{"k":"lab","n":{"en":"Laboratory tests","es":"Estudios de laboratorio"},"p":null,"g":"care","m":false,"pay":"quote"},{"k":"xray","n":{"en":"X-ray (with radiology partners)","es":"Rayos X (con radiólogos colaboradores)"},"p":null,"g":"care","m":false,"pay":"quote"},{"k":"insurance-check","n":{"en":"Insurance verification","es":"Verificación de seguro"},"p":0,"g":"care","m":false,"pay":"request"},{"k":"partner","n":{"en":"Hotel / concierge partnership","es":"Convenio con hotel o concierge"},"p":null,"g":"b2b","m":false,"pay":"quote","hidden":true},{"k":"test-pago","n":{"en":"Test payment (internal)","es":"Pago de prueba (interno)"},"p":2,"g":"test","m":false,"pay":"deposit","hidden":true}];/*SV-END*/
  var L = /^es/i.test(document.documentElement.lang || '') ? 'es' : 'en';
  var T = {
    en: {
      months: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
      wd: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'], locale: 'en-US',
      groups: { doctor: 'Doctor visits', iv: 'IV therapy · after a medical assessment', care: 'Tests, nursing & insurance', b2b: 'Business', test: 'Internal test' },
      quote: 'Quote', free: 'Free', book: 'Book or request care', cont: 'Continue', choose: 'Choose a service', close: 'Close', back: '&larr; Back', edit: '&larr; Edit',
      when: 'Preferred date & time', tz: 'Preferred time (Cabo time)', asap: 'Earliest available', prevM: 'Previous month', nextM: 'Next month',
      noSlots: 'No more clinic-hour slots today. Choose "Earliest available" or another day. After-hours visits (5 PM&ndash;8 AM) are by appointment and subject to doctor confirmation.',
      timesFine: 'Times are preferences. Our team confirms the exact time with you. We receive online requests 24/7; visits outside clinic hours (9 AM&ndash;5 PM) depend on doctor availability.',
      chooseTime: 'Choose a time', chooseDate: 'Choose a date', details: 'Your details', name: 'Full name *', phone: 'WhatsApp / phone *', email: 'Email (for your receipt)',
      loc: 'Hotel / villa and room, or address *', notes: 'Access notes (optional)', notesPh: 'Room number, gate code, parking. Please share symptoms with the doctor, not here.',
      insurer: 'Insurance company (optional)', insurerFine: 'Do not upload or type policy numbers here. We ask for documents privately after we contact you.', people: 'Number of people',
      review: 'Review', reviewT: 'Review & send', svc: 'Service', date: 'Date', time: 'Time', nm: 'Name', ph: 'Phone', em: 'Email', lc: 'Location', price: 'Price',
      payDep: 'Pay 50% deposit', reqNoPay: 'Request without paying now', reqClinic: 'Request appointment · pay at the clinic', depNow: 'Or hold your time with a 50% card deposit',
      send: 'Send request', sendQuote: 'Request a quote', viaWa: 'Send on WhatsApp instead',
      fineDep: 'The deposit is paid by card with Stripe; the balance is paid after the service (<a href="/refund-policy/">refund policy</a>).',
      fineReq: 'This is a request, not a confirmed appointment. Nothing is charged now: our team confirms availability and price by WhatsApp or phone.',
      fineVideo: 'Video consultations are confirmed by our team first; we then send you the payment instructions.',
      walkIn: 'You can also walk in without a booking, 9 AM&ndash;5 PM daily.', emergency: 'Not for emergencies &mdash; call 911 or go to the nearest hospital.',
      sending: 'Sending&hellip;', okT: 'Request received', okLead: 'Your folio', okStatus: 'Status: received, pending confirmation. It is not confirmed yet and nothing has been charged.',
      okNext: 'We will contact you by WhatsApp or phone. Keep your folio for any question.', okWa: 'Message us on WhatsApp',
      failT: 'We could not register your request', failLead: 'Please send it on WhatsApp or call +52 624 226 1023 so it is not lost.', failWa: 'Send on WhatsApp',
      waDone: 'Send the WhatsApp message to complete your request.', waDoneFine: 'If WhatsApp did not open, use the button below or call +52 (624) 226 1023.', openWa: 'Open WhatsApp',
      eName: 'Please enter your name.', ePhone: 'Please enter a valid WhatsApp / phone number.', eEmail: 'That email does not look right.', eLoc: 'Please tell us your hotel / villa and room, or address.',
      waHi: 'Hi! I would like to request: ', waOn: ' on ', waCabo: ' (Cabo time).', waName: 'Name: ', waPhone: 'Phone: ', waEmail: 'Email: ', waLoc: 'Location: ', waNotes: 'Access notes: '
    },
    es: {
      months: ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'],
      wd: ['Do', 'Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sá'], locale: 'es-MX',
      groups: { doctor: 'Consultas médicas', iv: 'Terapia IV · tras valoración médica', care: 'Estudios, enfermería y seguros', b2b: 'Empresas', test: 'Prueba interna' },
      quote: 'Cotización', free: 'Sin costo', book: 'Reservar o solicitar atención', cont: 'Continuar', choose: 'Elige un servicio', close: 'Cerrar', back: '&larr; Atrás', edit: '&larr; Editar',
      when: 'Fecha y hora preferidas', tz: 'Hora preferida (hora de Cabo)', asap: 'Lo antes posible', prevM: 'Mes anterior', nextM: 'Mes siguiente',
      noSlots: 'Ya no hay horarios de clínica hoy. Elige "Lo antes posible" u otro día. Las visitas fuera de horario (17:00&ndash;08:00) son con cita y sujetas a confirmación médica.',
      timesFine: 'Los horarios son preferencias; nuestro equipo te confirma la hora exacta. Recibimos solicitudes en línea 24/7; la atención fuera del horario de clínica (9:00&ndash;17:00) depende de la disponibilidad médica.',
      chooseTime: 'Elige una hora', chooseDate: 'Elige una fecha', details: 'Tus datos', name: 'Nombre completo *', phone: 'WhatsApp / teléfono *', email: 'Correo (para tu comprobante)',
      loc: 'Hotel / villa y habitación, o domicilio *', notes: 'Indicaciones de acceso (opcional)', notesPh: 'Habitación, código de acceso, estacionamiento. Los síntomas compártelos con el médico, no aquí.',
      insurer: 'Aseguradora (opcional)', insurerFine: 'No escribas ni subas números de póliza aquí. Pedimos los documentos de forma privada cuando te contactemos.', people: 'Número de personas',
      review: 'Revisar', reviewT: 'Revisar y enviar', svc: 'Servicio', date: 'Fecha', time: 'Hora', nm: 'Nombre', ph: 'Teléfono', em: 'Correo', lc: 'Ubicación', price: 'Precio',
      payDep: 'Pagar anticipo del 50%', reqNoPay: 'Solicitar sin pagar ahora', reqClinic: 'Solicitar cita · pago en la clínica', depNow: 'O aparta tu horario con un anticipo del 50% con tarjeta',
      send: 'Enviar solicitud', sendQuote: 'Solicitar cotización', viaWa: 'Enviar por WhatsApp',
      fineDep: 'El anticipo se paga con tarjeta mediante Stripe; el resto se paga después del servicio (<a href="/refund-policy/">política de reembolsos</a>).',
      fineReq: 'Es una solicitud, no una cita confirmada. No se cobra nada ahora: nuestro equipo confirma disponibilidad y precio por WhatsApp o teléfono.',
      fineVideo: 'Las videoconsultas las confirma primero nuestro equipo; después te enviamos las instrucciones de pago.',
      walkIn: 'También puedes venir sin cita, de 9:00 a 17:00 todos los días.', emergency: 'No es un servicio de emergencias &mdash; llama al 911 o acude al hospital más cercano.',
      sending: 'Enviando&hellip;', okT: 'Solicitud recibida', okLead: 'Tu folio', okStatus: 'Estado: recibida, pendiente de confirmación. Todavía no está confirmada y no se ha cobrado nada.',
      okNext: 'Te contactaremos por WhatsApp o teléfono. Guarda tu folio para cualquier duda.', okWa: 'Escríbenos por WhatsApp',
      failT: 'No pudimos registrar tu solicitud', failLead: 'Envíala por WhatsApp o llama al +52 624 226 1023 para que no se pierda.', failWa: 'Enviar por WhatsApp',
      waDone: 'Envía el mensaje de WhatsApp para completar tu solicitud.', waDoneFine: 'Si WhatsApp no se abrió, usa el botón o llama al +52 (624) 226 1023.', openWa: 'Abrir WhatsApp',
      eName: 'Escribe tu nombre.', ePhone: 'Escribe un WhatsApp / teléfono válido.', eEmail: 'Ese correo no parece correcto.', eLoc: 'Indica tu hotel / villa y habitación, o domicilio.',
      waHi: '¡Hola! Quiero solicitar: ', waOn: ' el ', waCabo: ' (hora de Cabo).', waName: 'Nombre: ', waPhone: 'Teléfono: ', waEmail: 'Correo: ', waLoc: 'Ubicación: ', waNotes: 'Indicaciones de acceso: '
    }
  }[L];
  var HOURS = [9, 10, 11, 12, 13, 14, 15, 16]; /* clinic 9:00-17:00; after-hours 17:00-08:00 by request, doctor confirms */
  var MAX_DAYS = 90;

  function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function pad(n) { return (n < 10 ? '0' : '') + n; }
  function iso(y, m, d) { return y + '-' + pad(m + 1) + '-' + pad(d); }
  function svc(k) { for (var i = 0; i < SV.length; i++) if (SV[i].k === k) return SV[i]; return null; }
  function nm(o) { return o.n[L] || o.n.en; }
  function money(n) { return '$' + (n % 1 ? n.toFixed(2) : n); }
  function priceTxt(o) { return o.p === null ? T.quote : o.p === 0 ? T.free : money(o.p) + ' USD'; }
  function hlabel(h) { return L === 'es' ? pad(h) + ':00' : (h % 12 || 12) + ':00 ' + (h < 12 ? 'AM' : 'PM'); }
  function payable(o) { return o.pay === 'deposit' || o.pay === 'optional'; }

  function cabo() {
    try {
      var p = {};
      new Intl.DateTimeFormat('en-US', { timeZone: TZ, hourCycle: 'h23', year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric' })
        .formatToParts(new Date()).forEach(function (x) { p[x.type] = +x.value; });
      return { y: p.year, m: p.month - 1, d: p.day, h: p.hour };
    } catch (e) {
      var n = new Date(); return { y: n.getFullYear(), m: n.getMonth(), d: n.getDate(), h: n.getHours() };
    }
  }
  function dlabel(s) {
    var a = s.split('-'); var d = new Date(+a[0], +a[1] - 1, +a[2]);
    return d.toLocaleDateString(T.locale, { weekday: 'short', month: 'short', day: 'numeric' });
  }
  function tlabel(t) { return t === 'ASAP' ? T.asap : hlabel(+t.split(':')[0]); }
  /* V6 §21: never send the service (it can reveal a study or treatment) to analytics or ad platforms */
  function track(name, extra) { try { var e = {}; if (extra && extra.value) { e.value = extra.value; e.currency = 'USD'; } if (window.cwcTrack) window.cwcTrack(name, e); } catch (x) {} }
  function attr() { var d = {}; try { var at = JSON.parse(localStorage.getItem('cwc_attr') || '{}'); ['utm_source', 'utm_campaign'].forEach(function (k) { if (at[k]) d[k] = String(at[k]).slice(0, 120); }); } catch (x) {} return d; }

  function Wizard(root, opts) {
    var now = cabo();
    var S = { step: 1, k: opts.k || '', date: '', time: '', name: '', phone: '', email: '', loc: '', notes: '', insurer: '', people: '3', err: '', cy: now.y, cm: now.m, done: '', ref: '', busy: false };
    var inline = !!opts.inline, lastStep = 0;

    function steps() { var h = ''; for (var i = 1; i <= 4; i++) h += '<i class="' + (S.step >= i ? 'on' : '') + '"></i>'; return '<div class="cwcb-st" aria-hidden="true">' + h + '</div>'; }
    function frame(title, body) {
      return '<div class="cwcb-h"><small>Cabo Walk-In Clinic</small><h2 id="cwcb-t">' + title + '</h2>' +
        (inline ? '' : '<button class="cwcb-x" type="button" data-x aria-label="' + T.close + '">&times;</button>') + (S.done ? '' : steps()) + '</div><div class="cwcb-b" aria-live="polite">' + body + '</div>';
    }

    function s1() {
      var h = '', g = '';
      SV.forEach(function (o) {
        if (o.hidden && S.k !== o.k) return;
        if (o.g !== g) { g = o.g; h += (h ? '</div>' : '') + '<h3>' + esc(T.groups[g] || g) + '</h3><div class="cwcb-sv">'; }
        h += '<button type="button" class="cwcb-o" data-k="' + o.k + '" aria-pressed="' + (S.k === o.k) + '"><b>' + esc(nm(o)) + '</b><span>' + esc(priceTxt(o)) + '</span></button>';
      });
      h += '</div><div class="cwcb-ac"><button class="cwcb-bt cwcb-n" type="button" data-next ' + (S.k ? '' : 'disabled') + '>' + (S.k ? T.cont : T.choose) + '</button></div>';
      return frame(T.book, h);
    }

    function cal() {
      var n = cabo(), first = new Date(S.cy, S.cm, 1).getDay(), days = new Date(S.cy, S.cm + 1, 0).getDate();
      var todayIso = iso(n.y, n.m, n.d);
      var last = new Date(n.y, n.m, n.d + MAX_DAYS), lastIso = iso(last.getFullYear(), last.getMonth(), last.getDate());
      var h = '<div class="cwcb-cal"><div class="cwcb-cn"><button type="button" data-cm="-1" aria-label="' + T.prevM + '" ' + ((S.cy === n.y && S.cm === n.m) ? 'disabled' : '') + '>&lsaquo;</button><b>' + T.months[S.cm] + ' ' + S.cy + '</b>' +
        '<button type="button" data-cm="1" aria-label="' + T.nextM + '" ' + (iso(S.cy, S.cm + 1, 1) > lastIso ? 'disabled' : '') + '>&rsaquo;</button></div><div class="cwcb-g">';
      T.wd.forEach(function (w) { h += '<div class="w">' + w + '</div>'; });
      for (var i = 0; i < first; i++) h += '<div></div>';
      for (var d = 1; d <= days; d++) {
        var s = iso(S.cy, S.cm, d), dis = s < todayIso || s > lastIso;
        h += '<button type="button" data-d="' + s + '" ' + (dis ? 'disabled ' : '') + 'class="' + (S.date === s ? 'sel ' : '') + (s === todayIso ? 'td' : '') + '"' + (S.date === s ? ' aria-pressed="true"' : '') + '>' + d + '</button>';
      }
      return h + '</div></div>';
    }
    function times() {
      if (!S.date) return '';
      var n = cabo(), isToday = S.date === iso(n.y, n.m, n.d), h = '<h3 style="margin-top:16px">' + T.tz + '</h3><div class="cwcb-tm">';
      if (isToday) h += '<button type="button" class="asap" data-t="ASAP" aria-pressed="' + (S.time === 'ASAP') + '">' + T.asap + '</button>';
      var shown = 0;
      HOURS.forEach(function (x) {
        if (isToday && x <= n.h + 1) return;
        shown++;
        var v = pad(x) + ':00';
        h += '<button type="button" data-t="' + v + '" aria-pressed="' + (S.time === v) + '">' + hlabel(x) + '</button>';
      });
      if (isToday && !shown) h += '<p class="cwcb-fine" style="grid-column:1/-1">' + T.noSlots + '</p>';
      return h + '</div>';
    }
    function s2() {
      var ok = S.date && S.time;
      return frame(T.when, cal() + times() + '<p class="cwcb-fine">' + T.timesFine + '</p>' +
        '<div class="cwcb-ac"><button class="cwcb-bt cwcb-bk" type="button" data-back>' + T.back + '</button><button class="cwcb-bt cwcb-n" type="button" data-next ' + (ok ? '' : 'disabled') + '>' +
        (ok ? T.cont : (S.date ? T.chooseTime : T.chooseDate)) + '</button></div>');
    }

    function field(id, f, label, extra, val) { return '<label for="' + id + '">' + label + '</label><input id="' + id + '" data-f="' + f + '"' + (extra || '') + ' value="' + esc(val) + '">'; }
    function s3() {
      var o = svc(S.k);
      return frame(T.details,
        '<div class="cwcb-f">' + field('cwcb-nm', 'name', T.name, ' autocomplete="name"', S.name) +
        field('cwcb-ph', 'phone', T.phone, ' type="tel" autocomplete="tel" placeholder="+1 555 000 0000"', S.phone) +
        field('cwcb-em', 'email', T.email, ' type="email" autocomplete="email" placeholder="you@email.com"', S.email) +
        (o.m ? field('cwcb-lc', 'loc', T.loc, ' autocomplete="street-address"', S.loc) : '') +
        (o.k === 'insurance-check' ? field('cwcb-in', 'insurer', T.insurer, ' autocomplete="off" maxlength="80"', S.insurer) + '<p class="cwcb-fine">' + T.insurerFine + '</p>' : '') +
        (o.k === 'iv-group' ? field('cwcb-pp', 'people', T.people, ' type="number" min="3" max="50" inputmode="numeric"', S.people) : '') +
        '<label for="cwcb-nt">' + T.notes + '</label><textarea id="cwcb-nt" data-f="notes" rows="2" maxlength="500" placeholder="' + esc(T.notesPh) + '">' + esc(S.notes) + '</textarea>' +
        '<input type="text" name="website" data-f="website" tabindex="-1" autocomplete="off" aria-hidden="true" style="position:absolute;left:-9999px;width:1px;height:1px"></div>' +
        (S.err ? '<div class="cwcb-er" role="alert">' + esc(S.err) + '</div>' : '') +
        '<div class="cwcb-ac"><button class="cwcb-bt cwcb-bk" type="button" data-back>' + T.back + '</button><button class="cwcb-bt cwcb-n" type="button" data-next>' + T.review + '</button></div>');
    }

    function waText() {
      var o = svc(S.k);
      return T.waHi + nm(o) + ' (' + priceTxt(o) + ')' + T.waOn + dlabel(S.date) + ', ' + tlabel(S.time) + T.waCabo + (S.ref ? '\nFolio: ' + S.ref : '') + '\n' + T.waName + S.name + '\n' + T.waPhone + S.phone +
        (S.email ? '\n' + T.waEmail + S.email : '') + (S.loc ? '\n' + T.waLoc + S.loc : '') + (S.notes ? '\n' + T.waNotes + S.notes : '');
    }
    function waLink() { return 'https://wa.me/' + WA + '?text=' + encodeURIComponent(waText()); }

    function s4() {
      var o = svc(S.k);
      var rows = [[T.svc, nm(o)], [T.date, dlabel(S.date)], [T.time, tlabel(S.time)], [T.nm, S.name], [T.ph, S.phone]];
      if (S.email) rows.push([T.em, S.email]); if (S.loc) rows.push([T.lc, S.loc]);
      rows.push([T.price, priceTxt(o)]);
      var sm = rows.map(function (r) { return '<div><span>' + r[0] + '</span><span>' + esc(r[1]) + '</span></div>'; }).join('');
      var b = '', fine = '';
      var dis = S.busy ? ' disabled' : '';
      if (o.pay === 'deposit') {
        b = '<button class="cwcb-bt cwcb-p" type="button" data-pay' + dis + '>' + T.payDep + ' &middot; ' + money(o.p / 2) + '</button>' +
          '<button class="cwcb-bt cwcb-bk" type="button" data-req' + dis + '>' + T.reqNoPay + '</button>';
        fine = T.fineDep + ' ' + T.fineReq;
      } else if (o.pay === 'optional') {
        b = '<button class="cwcb-bt cwcb-p" type="button" data-req' + dis + '>' + T.reqClinic + '</button>' +
          '<button class="cwcb-bt cwcb-bk" type="button" data-pay' + dis + '>' + T.depNow + ' &middot; ' + money(o.p / 2) + '</button>';
        fine = T.fineReq + ' ' + T.walkIn + ' ' + T.fineDep;
      } else {
        b = '<button class="cwcb-bt cwcb-p" type="button" data-req' + dis + '>' + (o.pay === 'quote' ? T.sendQuote : T.send) + '</button>';
        fine = T.fineReq + (o.k === 'video-consult' ? ' ' + T.fineVideo : '');
      }
      return frame(T.reviewT,
        '<div class="cwcb-sm">' + sm + '</div>' +
        '<div class="cwcb-vs">' + b + '<a class="cwcb-bt cwcb-w" data-wa href="' + waLink() + '" target="_blank" rel="noopener">' + T.viaWa + '</a></div>' +
        (S.busy ? '<p class="cwcb-fine">' + T.sending + '</p>' : '') +
        '<p class="cwcb-fine">' + fine + ' ' + T.emergency + '</p>' +
        '<div class="cwcb-ac"><button class="cwcb-bt cwcb-bk" type="button" data-back>' + T.edit + '</button></div>');
    }
    function sOk() {
      return frame(T.okT,
        '<div class="cwcb-ok"><div class="t">&#10003;</div><p>' + T.okLead + ': <b class="cwcb-ref">' + esc(S.ref) + '</b></p><p><b>' + T.okStatus + '</b></p><p class="cwcb-fine">' + T.okNext + ' ' + T.emergency + '</p></div>' +
        '<div class="cwcb-vs"><a class="cwcb-bt cwcb-w" data-wa-after href="' + waLink() + '" target="_blank" rel="noopener">' + T.okWa + '</a>' +
        (inline ? '' : '<button class="cwcb-bt cwcb-bk" type="button" data-x>' + T.close + '</button>') + '</div>');
    }
    function sFail() {
      return frame(T.failT,
        '<div class="cwcb-er" role="alert">' + T.failLead + '</div>' +
        '<div class="cwcb-vs"><a class="cwcb-bt cwcb-w" data-wa href="' + waLink() + '" target="_blank" rel="noopener">' + T.failWa + '</a><a class="cwcb-bt cwcb-bk" href="tel:+526242261023">+52 624 226 1023</a></div>');
    }
    function sWa() {
      return frame(T.openWa,
        '<div class="cwcb-ok"><div class="t">&#10003;</div><p><b>' + T.waDone + '</b></p><p class="cwcb-fine">' + T.waDoneFine + '</p></div>' +
        '<div class="cwcb-vs"><a class="cwcb-bt cwcb-w" data-wa-after href="' + waLink() + '" target="_blank" rel="noopener">' + T.openWa + '</a>' +
        (inline ? '' : '<button class="cwcb-bt cwcb-bk" type="button" data-x>' + T.close + '</button>') + '</div>');
    }

    function render() {
      root.innerHTML = S.done === 'ok' ? sOk() : S.done === 'fail' ? sFail() : S.done === 'wa' ? sWa() : (S.step === 1 ? s1() : S.step === 2 ? s2() : S.step === 3 ? s3() : s4());
      if (opts.focus && S.step !== lastStep) {
        var f = root.querySelector('[data-f],.cwcb-o,[data-d]:not([disabled]),[data-pay],[data-req]');
        if (f) { try { f.focus({ preventScroll: true }); } catch (e) {} }
      }
      lastStep = S.step; opts.focus = true;
    }

    function validate() {
      var o = svc(S.k); S.err = '';
      if (!S.name.trim()) S.err = T.eName;
      else if (S.phone.replace(/\D/g, '').length < 7) S.err = T.ePhone;
      else if (S.email && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(S.email)) S.err = T.eEmail;
      else if (o.m && !S.loc.trim()) S.err = T.eLoc;
      return !S.err;
    }
    function payload(intent) {
      var o = svc(S.k), a = attr();
      var d = { service: o.k, intent: intent, lang: L, date: S.date, time: S.time, name: S.name, phone: S.phone, email: S.email, location: S.loc, notes: S.notes, insurer: S.insurer, people: S.people, website: S.website || '' };
      for (var k in a) d[k] = a[k];
      return d;
    }
    function post(intent) {
      return fetch('/api/request', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload(intent)), credentials: 'same-origin' })
        .then(function (r) { return r.json().catch(function () { return { ok: false }; }); });
    }
    function request() {
      if (S.busy) return; S.busy = true; render();
      var o = svc(S.k);
      post('request').then(function (j) {
        S.busy = false;
        if (j && j.ok && j.ref) { S.ref = j.ref; S.done = 'ok'; track('booking_request', { service: o.k }); }
        else S.done = 'fail';
        render();
      }, function () { S.busy = false; S.done = 'fail'; render(); });
    }
    function pay() {
      if (S.busy) return; S.busy = true; render();
      var o = svc(S.k);
      function go() {
        track('booking_submit', { service: o.k, value: o.p / 2, currency: 'USD' });
        var f = document.createElement('form'); f.method = 'POST'; f.action = '/api/checkout'; f.style.display = 'none';
        var d = { option: o.k, ref: S.ref, lang: L, date: S.date, time: S.time, name: S.name, phone: S.phone, email: S.email, location: S.loc };
        Object.keys(d).forEach(function (k) { var i = document.createElement('input'); i.type = 'hidden'; i.name = k; i.value = d[k] || ''; f.appendChild(i); });
        document.body.appendChild(f); f.submit();
      }
      /* register the folio first (team is told a card payment started); never block the payment if that fails */
      var t = setTimeout(go, 4000);
      post('pay').then(function (j) { if (j && j.ref) S.ref = j.ref; clearTimeout(t); go(); }, function () { clearTimeout(t); go(); });
    }

    root.addEventListener('click', function (e) {
      var t = e.target.closest('button,a'); if (!t || !root.contains(t)) return;
      if (t.hasAttribute('data-x')) return opts.close && opts.close();
      if (t.dataset.k) { S.k = t.dataset.k; return render(); }
      if (t.dataset.cm) { var m = new Date(S.cy, S.cm + (+t.dataset.cm), 1); S.cy = m.getFullYear(); S.cm = m.getMonth(); return render(); }
      if (t.dataset.d) { S.date = t.dataset.d; S.time = ''; return render(); }
      if (t.dataset.t) { S.time = t.dataset.t; return render(); }
      if (t.hasAttribute('data-back')) { S.step = Math.max(1, S.step - 1); S.err = ''; return render(); }
      if (t.hasAttribute('data-next')) {
        if (S.step === 3 && !validate()) return render();
        if (S.step < 4) { S.step++; S.err = ''; render(); } return;
      }
      if (t.hasAttribute('data-pay')) return pay();
      if (t.hasAttribute('data-req')) return request();
      if (t.hasAttribute('data-wa')) { track('booking_submit', { method: 'whatsapp', service: S.k }); if (!S.done || S.done === 'fail') setTimeout(function () { S.done = 'wa'; render(); }, 50); }
    });
    root.addEventListener('input', function (e) { var f = e.target.getAttribute && e.target.getAttribute('data-f'); if (f) S[f] = e.target.value; });
    render();
    return { root: root };
  }

  /* ---------- modal ---------- */
  var open = null;
  function openModal(k) {
    if (open) return;
    var prev = document.activeElement;
    var ov = document.createElement('div'); ov.className = 'cwcb-ov';
    var box = document.createElement('div'); box.className = 'cwcb'; box.setAttribute('role', 'dialog'); box.setAttribute('aria-modal', 'true'); box.setAttribute('aria-labelledby', 'cwcb-t');
    ov.appendChild(box); document.body.appendChild(ov);
    var overflow = document.body.style.overflow; document.body.style.overflow = 'hidden';
    function close() {
      document.removeEventListener('keydown', key); ov.remove(); document.body.style.overflow = overflow; open = null;
      if (prev && prev.focus) try { prev.focus(); } catch (e) {}
    }
    function key(e) {
      if (e.key === 'Escape') return close();
      if (e.key !== 'Tab') return;
      var f = [].slice.call(box.querySelectorAll('button:not([disabled]),a[href],input:not([tabindex="-1"]),textarea')).filter(function (x) { return x.offsetParent !== null; });
      if (!f.length) return;
      var a = f[0], z = f[f.length - 1];
      if (e.shiftKey && document.activeElement === a) { e.preventDefault(); z.focus(); }
      else if (!e.shiftKey && document.activeElement === z) { e.preventDefault(); a.focus(); }
    }
    ov.addEventListener('mousedown', function (e) { if (e.target === ov) close(); });
    document.addEventListener('keydown', key);
    open = true;
    Wizard(box, { k: svc(k) ? k : '', close: close });
    var x = box.querySelector('[data-x]'); if (x) x.focus();
  }

  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('[data-book]');
    if (!a || e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.button) return;
    e.preventDefault(); openModal(a.getAttribute('data-book') || '');
  });

  function init() {
    var el = document.getElementById('cwcb-inline');
    if (el) {
      var k = (new URLSearchParams(location.search).get('service')) || '';
      el.className = 'cwcb cwcb-in'; Wizard(el, { inline: true, k: svc(k) ? k : '', focus: false });
    }
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();

/* Web chat bot: scripted answers (no API, no credits). The floating WhatsApp button opens it; every path ends in WhatsApp. */
(function () {
  var fab = document.querySelector('.cwc-wa');
  if (!fab) return;
  var WA = '5216242261023';
  var es = /^es/i.test(document.documentElement.lang || navigator.language || '');
  var T = es ? {
    title: 'Cabo Walk-In Clinic', sub: 'Respuestas al instante · Atiende una persona por WhatsApp',
    hi: '¡Hola! 👋 Soy el asistente de Cabo Walk-In Clinic. ¿En qué te ayudo?', back: '← Menú', wa: 'Continuar en WhatsApp', book: 'Reservar en línea',
    again: '¿Algo más?', human: 'Hablar con una persona', ask: '¿Qué necesitas y dónde te hospedas?', ph: 'Escribe aquí…', send: 'Enviar',
    handoff: 'Perfecto, te abro WhatsApp con tu mensaje listo para enviar. 💬',
    waMsg: 'Hola, tengo una pregunta para Cabo Walk-In Clinic.',
    menu: [['prices', 'Precios'], ['hours', 'Horarios'], ['hotel', 'Doctor al hotel'], ['iv', 'Terapia IV'], ['ins', 'Seguro / factura'], ['dep', 'Pagos'], ['emg', 'Es una emergencia']],
    a: {
      prices: 'Precios en USD, impuestos incluidos:\n• Videoconsulta: $59\n• Consulta en clínica: $99\n• Doctor a domicilio: $189\n• Terapia IV: desde $159 (NAD+ $279)\n• Grupos, laboratorio, rayos X y enfermería: cotización',
      hours: 'Clínica: 9:00 a 17:00 todos los días; puedes venir sin cita.\nVisitas fuera de horario (17:00 a 08:00): con cita, sujetas a confirmación médica.\nRecibimos solicitudes en línea 24/7.',
      hotel: 'Un doctor llega a tu hotel, villa o yate en Cabo San Lucas y el Corredor Turístico. Consulta a domicilio: $189 USD, impuestos incluidos. Te confirmamos el horario de llegada al reservar.',
      iv: 'Terapia IV en tu habitación o villa: Hidratación $159, Inmune $169, Post-vuelo $169, Recuperación $159, Glow $169, Atlética $169 (impuestos incluidos).',
      ins: 'Aceptamos seguros médicos y de viaje internacionales de Estados Unidos y Canadá, sujetos a verificación de la póliza y confirmación de cobertura. Escríbenos para verificar tu póliza antes del servicio. No aceptamos seguros nacionales mexicanos. También puedes pagar como paciente particular.',
      dep: 'Consulta en clínica: puedes pagar en la clínica. Médico a domicilio y terapia IV: anticipo del 50% con tarjeta, o solicitud sin pago para que confirmemos primero. Videoconsulta y cotizaciones: confirmamos primero y luego te enviamos cómo pagar. Reembolsos: cabowalkinclinic.com/refund-policy/',
      emg: '⚠️ Si es una emergencia que pone en riesgo la vida, llama al 911 ahora o ve a urgencias. No esperes respuesta por chat.'
    }
  } : {
    title: 'Cabo Walk-In Clinic', sub: 'Instant answers · A person replies on WhatsApp',
    hi: "Hi! 👋 I'm the Cabo Walk-In Clinic assistant. How can I help?", back: '← Menu', wa: 'Continue on WhatsApp', book: 'Book online',
    again: 'Anything else?', human: 'Talk to a person', ask: 'What do you need, and where are you staying?', ph: 'Type here…', send: 'Send',
    handoff: "Great, I'm opening WhatsApp with your message ready to send. 💬",
    waMsg: 'Hi! I have a question for Cabo Walk-In Clinic.',
    menu: [['prices', 'Prices'], ['hours', 'Hours'], ['hotel', 'Doctor at my hotel'], ['iv', 'IV therapy'], ['ins', 'Insurance'], ['dep', 'Payments'], ['emg', "It's an emergency"]],
    a: {
      prices: 'Prices in USD, tax included:\n• Video visit: $59\n• Walk-in clinic visit: $99\n• Doctor house call: $189\n• IV therapy: from $159 (NAD+ $279)\n• Groups, lab tests, X-ray and nursing: quote on request',
      hours: 'Clinic: 9 AM – 5 PM daily; walk-ins welcome.\nAfter-hours visits (5 PM – 8 AM): by appointment, subject to doctor confirmation.\nWe receive online requests 24/7.',
      hotel: 'A doctor comes to your hotel, villa or yacht in Cabo San Lucas and the Tourist Corridor. House call: $189 USD, tax included. We confirm the arrival time with you when you book.',
      iv: 'IV therapy in your room or villa: Hydration $159, Immune $169, Post-Flight $169, Recovery $159, Glow $169, Athletic $169 (tax included).',
      ins: 'We accept international health and travel insurance from the United States and Canada, subject to policy verification and coverage confirmation. Message us to verify your eligibility before your visit. Self-pay is always available.',
      dep: 'Clinic visits: you can pay at the clinic. House calls and IV therapy: 50% card deposit, or send a request without paying so we confirm first. Video visits and quotes: we confirm first, then send payment instructions. Refund policy: cabowalkinclinic.com/refund-policy/',
      emg: '⚠️ If this is a life-threatening emergency, call 911 now or go to the nearest ER. Do not wait for a chat reply.'
    }
  };
  var box = document.createElement('div');
  box.className = 'cwc-bot'; box.setAttribute('role', 'dialog'); box.setAttribute('aria-label', T.title);
  box.innerHTML = '<header><span class="cwc-bot-ic" aria-hidden="true" style="width:38px;height:38px;border-radius:50%;background:#fff;display:inline-flex;align-items:center;justify-content:center;flex:none"><svg viewBox="0 0 24 24" width="20" height="20"><g fill="#D32F2F"><rect x="9.5" y="2" width="5" height="20" rx="1"/><rect x="2" y="9.5" width="20" height="5" rx="1"/></g></svg></span><div><b></b><small></small></div><button class="x" type="button" aria-label="Close">×</button></header><div class="log" aria-live="polite"></div><div class="opts"></div>';
  box.querySelector('b').textContent = T.title; box.querySelector('small').textContent = T.sub;
  document.body.appendChild(box);
  var log = box.querySelector('.log'), opts = box.querySelector('.opts'), form = null;
  function say(t, me) { var d = document.createElement('div'); d.className = 'm' + (me ? ' me' : ''); d.textContent = t; log.appendChild(d); log.scrollTop = log.scrollHeight; }
  function waUrl(msg) { return 'https://wa.me/' + WA + '?text=' + encodeURIComponent(msg); }
  function link(cls, txt, href, ext) { var a = document.createElement('a'); a.className = cls; a.textContent = txt; a.href = href; if (ext) { a.target = '_blank'; a.rel = 'noopener'; } return a; }
  function btn(txt, fn, cls) { var b = document.createElement('button'); b.type = 'button'; b.textContent = txt; if (cls) b.className = cls; b.onclick = fn; return b; }
  function clearForm() { if (form) { form.remove(); form = null; } }
  function track(n) { try { if (window.gtag) gtag('event', n); } catch (e) {} }
  function menu() {
    clearForm(); opts.innerHTML = ''; opts.style.display = '';
    T.menu.forEach(function (m) { opts.appendChild(btn(m[1], function () { answer(m[0], m[1]); })); });
    opts.appendChild(btn(T.human, human, 'wa'));
  }
  function answer(k, label) {
    say(label, true); say(T.a[k]); opts.innerHTML = '';
    opts.appendChild(btn(T.back, function () { say(T.again); menu(); }));
    if (k !== 'emg') opts.appendChild(link('go', T.book, es ? '/es/reservar/' : '/book/'));
    opts.appendChild(link('wa', T.wa, waUrl(label + ' - ' + T.waMsg), true));
    track('bot_answer');
  }
  function human() {
    say(T.human, true); say(T.ask); opts.style.display = 'none'; clearForm();
    form = document.createElement('form');
    form.innerHTML = '<input type="text" maxlength="300" autocomplete="off"><button type="submit"></button>';
    var inp = form.querySelector('input'); inp.placeholder = T.ph; form.querySelector('button').textContent = T.send;
    form.onsubmit = function (e) {
      e.preventDefault(); var v = inp.value.trim(); if (!v) return;
      say(v, true); say(T.handoff); clearForm(); track('bot_handoff_whatsapp');
      window.open(waUrl(v), '_blank', 'noopener');
      opts.style.display = ''; opts.innerHTML = ''; opts.appendChild(link('wa', T.wa, waUrl(v), true)); opts.appendChild(btn(T.back, function () { say(T.again); menu(); }));
    };
    box.appendChild(form); inp.focus();
  }
  var started = false;
  function toggle(open) {
    var o = open === undefined ? !box.classList.contains('open') : open;
    box.classList.toggle('open', o);
    if (o && !started) { started = true; say(T.hi); menu(); track('bot_open'); }
  }
  fab.addEventListener('click', function (e) { if (e.metaKey || e.ctrlKey || e.shiftKey) return; e.preventDefault(); toggle(); });
  box.querySelector('.x').onclick = function () { toggle(false); };
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') toggle(false); });
})();
