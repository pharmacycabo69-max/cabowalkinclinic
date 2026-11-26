// POST /api/request — booking requests, quotes, insurance checks and partnership requests (V6 §12, §14).
// Nothing is charged here. Each request gets an opaque folio, is stored in the persistent register (when configured)
// and is sent to the team (email, CRM webhook, internal WhatsApp). The answer says "received" ONLY if it was stored or
// at least one team channel accepted it; otherwise the page offers WhatsApp/phone and says it was not registered.
// No clinical data is requested; access notes are sealed and only go to the team email. Nothing goes to analytics or ads.
const crypto = require("crypto");
const CATALOG = require("./_catalog.json");
const { getStore, seal, newFolio, saveRecord, loadRecord, setStatus, nowIso } = require("./_lib/store");
const { emailTeam, emailClient, toCrm, whatsappTeam } = require("./_lib/notify");

const WA = CATALOG.business.whatsapp;
const DUP_WINDOW_S = 15 * 60;
const RATE_PER_HOUR = 8;

const clean = (v, n) => String(v == null ? "" : v).replace(/[\u0000-\u001f\u007f<>]+/g, " ").replace(/\s+/g, " ").trim().slice(0, n);

function cabToday() {
  const p = {};
  new Intl.DateTimeFormat("en-US", { timeZone: "America/Mazatlan", year: "numeric", month: "2-digit", day: "2-digit" })
    .formatToParts(new Date()).forEach((x) => { p[x.type] = x.value; });
  return `${p.year}-${p.month}-${p.day}`;
}
function addDays(isoDate, n) {
  const d = new Date(isoDate + "T12:00:00Z"); d.setUTCDate(d.getUTCDate() + n); return d.toISOString().slice(0, 10);
}

function validate(b) {
  const e = {};
  const service = clean(b.service, 40);
  const s = Object.prototype.hasOwnProperty.call(CATALOG.services, service) ? CATALOG.services[service] : null;
  if (!s || service === "test-pago") e.service = "unknown";
  const lang = b.lang === "es" ? "es" : "en";
  const name = clean(b.name, 100);
  const phone = clean(b.phone, 40);
  const email = clean(b.email, 120);
  const location = clean(b.location, 200);
  const date = clean(b.date, 10);
  const time = clean(b.time, 5);
  if (name.length < 2) e.name = "required";
  if (phone.replace(/\D/g, "").length < 7) e.phone = "invalid";
  if (email && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) e.email = "invalid";
  if (s && s.kind === "mobile" && !location) e.location = "required";
  if (date) {
    const today = cabToday();
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || date < today || date > addDays(today, 120)) e.date = "invalid";
  }
  if (time && !/^(ASAP|\d{2}:\d{2})$/.test(time)) e.time = "invalid";
  if (s && s.kind === "b2b" && !clean(b.company, 120)) e.company = "required";
  return {
    errors: e,
    data: {
      service, s, lang, name, phone, email, location, date, time,
      notes: clean(b.notes, 500),
      company: clean(b.company, 120),
      role: clean(b.role, 80),
      insurer: clean(b.insurer, 80),
      people: Math.max(0, Math.min(50, parseInt(b.people, 10) || 0)),
      src: { utm_source: clean(b.utm_source, 60), utm_campaign: clean(b.utm_campaign, 120), domain: "cabowalkinclinic.com" },
    },
  };
}

function waLink(lang, ref, label) {
  const t = lang === "es" ? `Hola, envié la solicitud ${ref} (${label}).` : `Hi, I sent request ${ref} (${label}).`;
  return `https://wa.me/${WA}?text=${encodeURIComponent(t)}`;
}

function teamText(ref, d, label, intent) {
  const when = [d.date, d.time === "ASAP" ? "earliest available" : d.time].filter(Boolean).join(" ") || "not specified";
  const lines = [
    `New request ${ref}: ${label}`,
    intent === "pay" ? `Status: the patient is opening the card deposit page. A separate "Paid booking" email confirms the payment; if it never arrives, call the patient.` : `Status: received — pending confirmation (nothing charged)`,
    `Preferred: ${when} (Cabo time)`,
    `Name: ${d.name}`,
    `Phone / WhatsApp: ${d.phone}  https://wa.me/${d.phone.replace(/\D/g, "")}`,
    `Email: ${d.email || "-"}`,
  ];
  if (d.location) lines.push(`Location: ${d.location}`);
  if (d.company) lines.push(`Company: ${d.company}${d.role ? " (" + d.role + ")" : ""}`);
  if (d.insurer) lines.push(`Insurer (as typed): ${d.insurer}`);
  if (d.people) lines.push(`People: ${d.people}`);
  if (d.notes) lines.push(`Access / business notes: ${d.notes}`);
  lines.push(`Language: ${d.lang.toUpperCase()}`, `Price list: ${d.s.price ? "$" + d.s.price + " USD tax incl." : "quote"}`);
  lines.push("", "Next: confirm availability with the patient, then mark the folio confirmed. Do not reply with clinical details by email.");
  return lines.join("\n");
}

function clientText(ref, d, label) {
  return d.lang === "es"
    ? `Recibimos tu solicitud ${ref}: ${label}.\nEstado: recibida, pendiente de confirmación. Todavía no está confirmada ni se ha cobrado nada.\nTe contactaremos por WhatsApp o teléfono para confirmar disponibilidad.\nWhatsApp: +52 624 226 1023\nSi es una emergencia, llama al 911.\n\nCabo Walk-In Clinic`
    : `We received your request ${ref}: ${label}.\nStatus: received, pending confirmation. It is not confirmed yet and nothing has been charged.\nWe will contact you by WhatsApp or phone to confirm availability.\nWhatsApp: +52 624 226 1023\nIf this is an emergency, call 911.\n\nCabo Walk-In Clinic`;
}

async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");
  if (req.method !== "POST") { res.setHeader("Allow", "POST"); return res.status(405).json({ ok: false, error: "method" }); }
  let b = req.body || {};
  if (typeof b === "string") { try { b = JSON.parse(b); } catch { b = {}; } }
  if (b.website) return res.status(400).json({ ok: false, error: "rejected" }); // honeypot field, hidden from people

  const { errors, data } = validate(b);
  if (Object.keys(errors).length) return res.status(400).json({ ok: false, errors });
  const label = data.s[data.lang] || data.s.en;
  // intent "pay": the visitor is about to open the card deposit page; the folio links the payment to this request
  const intent = b.intent === "pay" && (data.s.payment === "deposit" || data.s.payment === "optional") ? "pay" : "request";
  const store = getStore();

  // rate limit and duplicate protection (only possible with the register)
  const ipHash = crypto.createHash("sha256").update(String(req.headers["x-forwarded-for"] || "").split(",")[0] + "|cwc").digest("hex").slice(0, 16);
  const dupHash = crypto.createHash("sha256").update([data.phone.replace(/\D/g, ""), data.service, data.date].join("|")).digest("hex").slice(0, 24);
  let ref = newFolio();
  if (store) {
    try {
      const n = await store.kv.incr(`rl:${ipHash}:${new Date().toISOString().slice(0, 13)}`, 3600);
      if (n > RATE_PER_HOUR) return res.status(429).json({ ok: false, error: "rate" });
      const fresh = await store.kv.setIfAbsent(`dup:${dupHash}`, ref, DUP_WINDOW_S);
      if (!fresh) {
        const prev = await store.kv.get(`dup:${dupHash}`);
        if (prev) {
          const old = await loadRecord(store, prev).catch(() => null);
          return res.status(200).json({ ok: true, ref: prev, duplicate: true, saved: true, delivered: !!(old && !old.notifyPending), status: "received_pending_confirmation", whatsapp: waLink(data.lang, prev, label) });
        }
      }
    } catch { /* store down: continue without it, the email is still sent */ }
  }

  const rec = {
    ref, service: data.service, group: data.s.group, status: intent === "pay" ? "payment_pending" : "received", createdAt: nowIso(), updatedAt: nowIso(), lang: data.lang,
    src: data.src, notified: { email: false, crm: false, whatsapp: false }, history: [{ at: nowIso(), status: intent === "pay" ? "payment_pending" : "received" }],
  };
  let saved = false;
  if (store) {
    try {
      rec.sealed = seal(store, { name: data.name, phone: data.phone, email: data.email, location: data.location, notes: data.notes, company: data.company, role: data.role, insurer: data.insurer, people: data.people, date: data.date, time: data.time });
      await saveRecord(store, rec);
      await store.kv.push("idx:requests", ref, 1000);
      saved = true;
    } catch { console.error("request store failed"); }
  }

  const subject = `[${ref}] ${intent === "pay" ? "Card deposit started" : "New request"}: ${data.s.en}${data.date ? " — " + data.date : ""}`;
  const [mail, crm, wa] = await Promise.all([
    emailTeam(subject, teamText(ref, data, data.s.en, intent), `req-${ref}`),
    toCrm({ type: "request", ref, service: data.service, service_name: data.s.en, status: intent === "pay" ? "payment_pending" : "received", date: data.date, time: data.time, lang: data.lang, name: data.name, phone: data.phone, email: data.email, location: data.location, company: data.company, source: "cabowalkinclinic" }, `req-${ref}`),
    intent === "pay" ? Promise.resolve(false) : whatsappTeam(`🩺 New request ${ref}: ${data.s.en}${data.date ? " · " + data.date + " " + data.time : ""}. Details in the team email.`),
  ]);
  const delivered = mail || crm || wa;
  if (saved) {
    try { await setStatus(store, ref, intent === "pay" ? "payment_pending" : "received", { notified: { email: mail, crm, whatsapp: wa }, notifyPending: !delivered }); } catch {}
    if (!delivered) { try { await store.kv.push("idx:notify-retry", ref, 500); } catch {} }
  }
  if (!saved && !delivered) {
    console.error("request not registered: no store and no channel");
    return res.status(503).json({ ok: false, error: "not_registered", whatsapp: `https://wa.me/${WA}` });
  }
  if (data.email && intent === "request") await emailClient(data.email, data.lang === "es" ? `Solicitud ${ref} recibida — Cabo Walk-In Clinic` : `Request ${ref} received — Cabo Walk-In Clinic`, clientText(ref, data, label), `ack-${ref}`).catch(() => {});
  return res.status(200).json({ ok: true, ref, saved, delivered, duplicate: false, status: intent === "pay" ? "payment_pending" : "received_pending_confirmation", whatsapp: waLink(data.lang, ref, label) });
}

module.exports = handler;
module.exports._validate = validate;
