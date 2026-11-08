/* Cabo Walk-In Clinic booking wizard (vanilla JS). Mounts as a modal on [data-book] clicks, or inline in #cwcb-inline.
   Prices here are for display only; /api/checkout holds the authoritative prices. */
(function () {
  'use strict';
  var TZ = 'America/Mazatlan';
  var WA = '5216242261023';
  var SV = [
    { k: 'video-consult', n: 'Video doctor consultation', p: 59, g: 'Doctor visits', m: false },
    { k: 'clinic-consult', n: 'Walk-in clinic visit', p: 80, g: 'Doctor visits', m: false },
    { k: 'home-doctor', n: 'Doctor house call', p: 200, g: 'Doctor visits', m: true },
    { k: 'iv-hydration', n: 'IV Hydration Drip', p: 149, g: 'IV therapy (nurse comes to you)', m: true },
    { k: 'iv-recovery', n: 'IV Recovery Drip', p: 169, g: 'IV therapy (nurse comes to you)', m: true },
    { k: 'iv-immune', n: 'IV Immune Support', p: 159, g: 'IV therapy (nurse comes to you)', m: true },
    { k: 'iv-postflight', n: 'IV Post-Flight Reset', p: 159, g: 'IV therapy (nurse comes to you)', m: true },
    { k: 'iv-glow', n: 'IV Glow Drip', p: 189, g: 'IV therapy (nurse comes to you)', m: true },
    { k: 'iv-athletic', n: 'IV Athletic Recovery', p: 199, g: 'IV therapy (nurse comes to you)', m: true },
    /* internal $2 test product (deposit $1, above the MX$10 minimum Stripe enforces on a peso account): never listed, only opens via ?service=test-pago */
    { k: 'test-pago', n: 'Test payment (internal)', p: 2, g: 'Internal test', m: false, hidden: true }
  ];
  var MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  var WD = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
  var HOURS = [9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21]; /* clinic open 9 AM - 10 PM */
  var MAX_DAYS = 90;

  function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function pad(n) { return (n < 10 ? '0' : '') + n; }
  function iso(y, m, d) { return y + '-' + pad(m + 1) + '-' + pad(d); }
  function svc(k) { for (var i = 0; i < SV.length; i++) if (SV[i].k === k) return SV[i]; return null; }
  function money(n) { return '$' + (n % 1 ? n.toFixed(2) : n); }
  function hlabel(h) { return (h % 12 || 12) + ':00 ' + (h < 12 ? 'AM' : 'PM'); }

  /* "now" in Cabo time, independent of the visitor's timezone */
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
    return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  }
  function tlabel(t) { return t === 'ASAP' ? 'As soon as possible' : hlabel(+t.split(':')[0]); }
  function track(name, extra) { try { if (window.cwcTrack) window.cwcTrack(name, extra || {}); } catch (e) {} }

  function Wizard(root, opts) {
    var now = cabo();
    var S = { step: 1, k: opts.k || '', date: '', time: '', name: '', phone: '', email: '', loc: '', notes: '', err: '', cy: now.y, cm: now.m, done: false };
    var inline = !!opts.inline, lastStep = 0;

    function steps() { var h = ''; for (var i = 1; i <= 4; i++) h += '<i class="' + (S.step >= i ? 'on' : '') + '"></i>'; return '<div class="cwcb-st" aria-hidden="true">' + h + '</div>'; }
    function frame(title, body) {
      return '<div class="cwcb-h"><small>Cabo Walk-In Clinic</small><h2 id="cwcb-t">' + esc(title) + '</h2>' +
        (inline ? '' : '<button class="cwcb-x" type="button" data-x aria-label="Close">&times;</button>') + (S.done ? '' : steps()) + '</div><div class="cwcb-b">' + body + '</div>';
    }

    function s1() {
      var h = '', g = '';
      SV.forEach(function (o) {
        if (o.hidden && S.k !== o.k) return;
        if (o.g !== g) { g = o.g; h += (h ? '</div>' : '') + '<h3>' + esc(g) + '</h3><div class="cwcb-sv">'; }
        h += '<button type="button" class="cwcb-o" data-k="' + o.k + '" aria-pressed="' + (S.k === o.k) + '"><b>' + esc(o.n) + '</b><span>' + money(o.p) + '</span></button>';
      });
      h += '</div><div class="cwcb-ac"><button class="cwcb-bt cwcb-n" type="button" data-next ' + (S.k ? '' : 'disabled') + '>' + (S.k ? 'Continue' : 'Choose a service') + '</button></div>';
      return frame('Book online', h);
    }

    function cal() {
      var n = cabo(), first = new Date(S.cy, S.cm, 1).getDay(), days = new Date(S.cy, S.cm + 1, 0).getDate();
      var todayIso = iso(n.y, n.m, n.d);
      var last = new Date(n.y, n.m, n.d + MAX_DAYS), lastIso = iso(last.getFullYear(), last.getMonth(), last.getDate());
      var h = '<div class="cwcb-cal"><div class="cwcb-cn"><button type="button" data-cm="-1" aria-label="Previous month" ' + ((S.cy === n.y && S.cm === n.m) ? 'disabled' : '') + '>&lsaquo;</button><b>' + MONTHS[S.cm] + ' ' + S.cy + '</b>' +
        '<button type="button" data-cm="1" aria-label="Next month" ' + (iso(S.cy, S.cm + 1, 1) > lastIso ? 'disabled' : '') + '>&rsaquo;</button></div><div class="cwcb-g">';
      WD.forEach(function (w) { h += '<div class="w">' + w + '</div>'; });
      for (var i = 0; i < first; i++) h += '<div></div>';
      for (var d = 1; d <= days; d++) {
        var s = iso(S.cy, S.cm, d), dis = s < todayIso || s > lastIso;
        h += '<button type="button" data-d="' + s + '" ' + (dis ? 'disabled ' : '') + 'class="' + (S.date === s ? 'sel ' : '') + (s === todayIso ? 'td' : '') + '"' + (S.date === s ? ' aria-pressed="true"' : '') + '>' + d + '</button>';
      }
      return h + '</div></div>';
    }
    function times() {
      if (!S.date) return '';
      var n = cabo(), isToday = S.date === iso(n.y, n.m, n.d), h = '<h3 style="margin-top:16px">Preferred time (Cabo time)</h3><div class="cwcb-tm">';
      if (isToday) h += '<button type="button" class="asap" data-t="ASAP" aria-pressed="' + (S.time === 'ASAP') + '">As soon as possible</button>';
      var shown = 0;
      HOURS.forEach(function (x) {
        if (isToday && x <= n.h + 1) return; /* at least one hour of lead time */
        shown++;
        var v = pad(x) + ':00';
        h += '<button type="button" data-t="' + v + '" aria-pressed="' + (S.time === v) + '">' + hlabel(x) + '</button>';
      });
      if (isToday && !shown) h += '<p class="cwcb-fine" style="grid-column:1/-1">No more regular slots today. Choose "As soon as possible" or another day.</p>';
      return h + '</div>';
    }
    function s2() {
      var ok = S.date && S.time;
      return frame('Choose date & time', cal() + times() +
        '<p class="cwcb-fine">Times are preferences. Our team confirms the exact time with you.</p>' +
        '<div class="cwcb-ac"><button class="cwcb-bt cwcb-bk" type="button" data-back>&larr; Back</button><button class="cwcb-bt cwcb-n" type="button" data-next ' + (ok ? '' : 'disabled') + '>' +
        (ok ? 'Continue' : (S.date ? 'Choose a time' : 'Choose a date')) + '</button></div>');
    }

    function s3() {
      var o = svc(S.k), mob = o.m;
      return frame('Your details',
        '<div class="cwcb-f"><label for="cwcb-nm">Full name *</label><input id="cwcb-nm" data-f="name" autocomplete="name" value="' + esc(S.name) + '">' +
        '<label for="cwcb-ph">WhatsApp / phone *</label><input id="cwcb-ph" data-f="phone" type="tel" autocomplete="tel" placeholder="+1 555 000 0000" value="' + esc(S.phone) + '">' +
        '<label for="cwcb-em">Email</label><input id="cwcb-em" data-f="email" type="email" autocomplete="email" placeholder="you@email.com" value="' + esc(S.email) + '">' +
        (mob ? '<label for="cwcb-lc">Hotel / villa and room, or address *</label><input id="cwcb-lc" data-f="loc" autocomplete="street-address" value="' + esc(S.loc) + '">' : '') +
        '<label for="cwcb-nt">Notes (optional)</label><textarea id="cwcb-nt" data-f="notes" rows="2" placeholder="Anything we should know">' + esc(S.notes) + '</textarea></div>' +
        (S.err ? '<div class="cwcb-er" role="alert">' + esc(S.err) + '</div>' : '') +
        '<div class="cwcb-ac"><button class="cwcb-bt cwcb-bk" type="button" data-back>&larr; Back</button><button class="cwcb-bt cwcb-n" type="button" data-next>Review</button></div>');
    }

    function waLink() {
      var o = svc(S.k);
      var t = 'Hi! I would like to book: ' + o.n + ' (' + money(o.p) + ') on ' + dlabel(S.date) + ', ' + tlabel(S.time) + ' (Cabo time).\nName: ' + S.name + '\nPhone: ' + S.phone +
        (S.email ? '\nEmail: ' + S.email : '') + (S.loc ? '\nLocation: ' + S.loc : '') + (S.notes ? '\nNotes: ' + S.notes : '');
      return 'https://wa.me/' + WA + '?text=' + encodeURIComponent(t);
    }
    function s4() {
      var o = svc(S.k), dep = o.p / 2;
      var rows = [['Service', o.n], ['Date', dlabel(S.date)], ['Time', tlabel(S.time)], ['Name', S.name], ['Phone', S.phone]];
      if (S.email) rows.push(['Email', S.email]); if (S.loc) rows.push(['Location', S.loc]);
      rows.push(['Price', money(o.p) + ' USD']);
      var sm = rows.map(function (r) { return '<div><span>' + r[0] + '</span><span>' + esc(r[1]) + '</span></div>'; }).join('');
      return frame('Review & confirm',
        '<div class="cwcb-sm">' + sm + '</div>' +
        '<div class="cwcb-vs"><button class="cwcb-bt cwcb-p" type="button" data-pay>Pay 50% deposit &middot; ' + money(dep) + '</button>' +
        '<a class="cwcb-bt cwcb-w" data-wa href="' + waLink() + '" target="_blank" rel="noopener">Send request on WhatsApp</a></div>' +
        '<p class="cwcb-fine">The deposit is paid by card with Stripe; the balance is paid after the service (<a href="/refund-policy/">refund policy</a>). ' +
        'This is a booking request: our team confirms availability and the exact time by WhatsApp or phone. Not for emergencies &mdash; call 911.</p>' +
        '<div class="cwcb-ac"><button class="cwcb-bt cwcb-bk" type="button" data-back>&larr; Edit</button></div>');
    }
    function sDone() {
      return frame('Almost done',
        '<div class="cwcb-ok"><div class="t">&#10003;</div><p><b>Send the WhatsApp message to complete your request.</b></p>' +
        '<p class="cwcb-fine">Our team will confirm availability and the exact time with you. If WhatsApp did not open, use the button below or call +52 (624) 226 1023.</p></div>' +
        '<div class="cwcb-vs"><a class="cwcb-bt cwcb-w" data-wa href="' + waLink() + '" target="_blank" rel="noopener">Open WhatsApp</a>' +
        (inline ? '' : '<button class="cwcb-bt cwcb-bk" type="button" data-x>Close</button>') + '</div>');
    }

    function render() {
      root.innerHTML = S.done ? sDone() : (S.step === 1 ? s1() : S.step === 2 ? s2() : S.step === 3 ? s3() : s4());
      if (opts.focus && S.step !== lastStep) { /* move focus only when the step changes, to keep keyboard users oriented */
        var f = root.querySelector('[data-f],.cwcb-o,[data-d]:not([disabled]),[data-pay]');
        if (f) { try { f.focus({ preventScroll: true }); } catch (e) {} }
      }
      lastStep = S.step; opts.focus = true;
    }

    function validate() {
      var o = svc(S.k); S.err = '';
      if (!S.name.trim()) S.err = 'Please enter your name.';
      else if (S.phone.replace(/\D/g, '').length < 7) S.err = 'Please enter a valid WhatsApp / phone number.';
      else if (S.email && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(S.email)) S.err = 'That email does not look right.';
      else if (o.m && !S.loc.trim()) S.err = 'Please tell us your hotel / villa and room, or address.';
      return !S.err;
    }
    function pay() {
      var o = svc(S.k);
      track('booking_submit', { method: 'stripe', service: o.k, value: o.p / 2, currency: 'USD' });
      var f = document.createElement('form'); f.method = 'POST'; f.action = '/api/checkout'; f.style.display = 'none';
      var d = { option: o.k, date: S.date, time: S.time, name: S.name, phone: S.phone, email: S.email, location: S.loc, notes: S.notes };
      Object.keys(d).forEach(function (k) { var i = document.createElement('input'); i.type = 'hidden'; i.name = k; i.value = d[k]; f.appendChild(i); });
      document.body.appendChild(f); f.submit();
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
      if (t.hasAttribute('data-wa')) { track('booking_submit', { method: 'whatsapp', service: S.k }); if (!S.done) setTimeout(function () { S.done = true; render(); }, 50); }
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
      var f = [].slice.call(box.querySelectorAll('button:not([disabled]),a[href],input,textarea')).filter(function (x) { return x.offsetParent !== null; });
      if (!f.length) return;
      var a = f[0], z = f[f.length - 1];
      if (e.shiftKey && document.activeElement === a) { e.preventDefault(); z.focus(); }
      else if (!e.shiftKey && document.activeElement === z) { e.preventDefault(); a.focus(); }
    }
    ov.addEventListener('mousedown', function (e) { if (e.target === ov) close(); });
    document.addEventListener('keydown', key);
    open = true;
    Wizard(box, { k: k, close: close });
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
