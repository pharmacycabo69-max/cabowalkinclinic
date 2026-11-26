// POST /api/stripe-webhook
//
// Stripe calls this for Checkout payments of this clinic. It verifies the signature, records the payment in the
// register (when configured) and notifies the team through the existing channels: QuickTurno agenda, email (Resend)
// and internal WhatsApp (UltraMsg, fallback when QuickTurno is not configured).
// V6 additions: idempotency per event and per channel (Stripe retries never duplicate a notice or a QuickTurno entry),
// opaque folio, alerts for failed/expired payments, refunds, disputes and payments without an associated request.
// Notes, symptoms and clinical data are never read from or written to Stripe.
//
// Env vars (Vercel):
//   STRIPE_WEBHOOK_SECRET  whsec_... of the Stripe webhook endpoint        (required)
//   RESEND_API_KEY, NOTIFY_EMAIL, NOTIFY_FROM                              (required, except NOTIFY_FROM)
//   BUSINESS_NAME, BRAND_COLOR                                             (optional)
//   ULTRAMSG_INSTANCE / ULTRAMSG_TOKEN / NOTIFY_WHATSAPP                   (optional)
//   TURNO_WEBHOOK_URL / WEB_PAYMENT_SECRET / TURNO_ORG_SLUG                (optional, QuickTurno agenda)
//   KV_REST_API_URL / KV_REST_API_TOKEN / REQUEST_ENCRYPTION_KEY           (optional register; enables idempotency)
// Subscribe the endpoint to: checkout.session.completed, checkout.session.async_payment_succeeded,
//   checkout.session.async_payment_failed, checkout.session.expired, charge.refunded, charge.dispute.created.
const crypto = require("crypto");
const { getStore, loadRecord, setStatus, saveRecord, nowIso } = require("./_lib/store");

const TOLERANCE_SECONDS = 300;

function readRaw(req) {
  if (Buffer.isBuffer(req.body)) return Promise.resolve(req.body);
  if (typeof req.body === "string") return Promise.resolve(Buffer.from(req.body));
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on("data", (c) => chunks.push(c));
    req.on("end", () => resolve(Buffer.concat(chunks)));
    req.on("error", reject);
  });
}

// Stripe-Signature: t=<timestamp>,v1=<hmac>[,v1=<hmac>...]
function verify(raw, header, secret) {
  if (!header) return false;
  const pairs = header.split(",").map((p) => p.trim().split("="));
  const t = (pairs.find((p) => p[0] === "t") || [])[1];
  const sigs = pairs.filter((p) => p[0] === "v1").map((p) => p[1]);
  if (!t || !sigs.length) return false;
  if (Math.abs(Date.now() / 1000 - Number(t)) > TOLERANCE_SECONDS) return false;
  const expected = Buffer.from(crypto.createHmac("sha256", secret).update(`${t}.${raw.toString("utf8")}`).digest("hex"));
  return sigs.some((s) => {
    const b = Buffer.from(s);
    return b.length === expected.length && crypto.timingSafeEqual(expected, b);
  });
}

const esc = (v) => String(v == null ? "" : v).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const money = (n) => "$" + Number(n).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

// "2026-11-09" + "15:00" -> "Monday, November 9 · 3:00 PM". Done by hand so the server's timezone never shifts the date.
function formatWhen(date, time) {
  let day = "";
  const d = /^(\d{4})-(\d{2})-(\d{2})$/.exec(date || "");
  if (d) day = new Date(Date.UTC(+d[1], +d[2] - 1, +d[3])).toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", timeZone: "UTC" });
  let hour = "";
  if (time === "ASAP") hour = "As soon as possible";
  else {
    const t = /^(\d{2}):(\d{2})$/.exec(time || "");
    if (t) hour = `${+t[1] % 12 || 12}:${t[2]} ${+t[1] < 12 ? "AM" : "PM"}`;
  }
  return [day, hour].filter(Boolean).join(" · ");
}

function compose(session) {
  const m = session.metadata || {};
  const cd = session.customer_details || {};
  const paid = (session.amount_total || 0) / 100;
  const total = m.service_total_usd ? Number(m.service_total_usd) : null;
  const hasTotal = total !== null && !Number.isNaN(total);
  const field = (session.custom_fields || []).find((f) => f.key === "location");
  const location = m.location || (field && field.text && field.text.value) || "";
  const when = [m.booking_date, m.booking_time === "ASAP" ? "as soon as possible" : m.booking_time].filter(Boolean).join(" ");
  const service = m.service_name || "service";
  const name = m.customer_name || cd.name || "";
  const phone = m.customer_phone || cd.phone || "";
  const currency = (session.currency || "usd").toUpperCase();
  const lines = [
    `New paid booking: ${service}`,
    `Folio: ${m.folio || "none — payment without an associated request"}`,
    `When: ${when || "not specified"} (Cabo time)`,
    `Customer: ${name || "-"}`,
    `Phone: ${phone || "-"}`,
    `Email: ${cd.email || "-"}`,
  ];
  if (location) lines.push(`Location: ${location}`);
  lines.push(`Deposit paid: $${paid.toFixed(2)} ${currency}`);
  if (hasTotal) lines.push(`Balance due after service: $${(total - paid).toFixed(2)} (total $${total})`);
  if (session.payment_intent) lines.push(`Stripe: https://dashboard.stripe.com/payments/${session.payment_intent}`);
  const biz = process.env.BUSINESS_NAME ? `${process.env.BUSINESS_NAME} — ` : "";
  return {
    subject: `${biz}${m.folio ? "[" + m.folio + "] " : "[NO FOLIO] "}Paid booking: ${service} — ${when || "no date"}`,
    text: lines.join("\n"),
    html: renderHtml({
      biz: process.env.BUSINESS_NAME || "Bookings", service, when: formatWhen(m.booking_date, m.booking_time),
      name, phone, email: cd.email || "", location, notes: "", folio: m.folio || "", paid, total: hasTotal ? total : null,
      currency, intent: session.payment_intent || "",
    }),
  };
}

// Email-safe HTML: tables + inline styles (no flex, no web fonts, no external images). Every dynamic value is escaped.
function renderHtml(d) {
  const brand = /^#[0-9a-fA-F]{6}$/.test(process.env.BRAND_COLOR || "") ? process.env.BRAND_COLOR : "#0b2a4a";
  const gold = "#c89f6a", ink = "#1c2a39", mute = "#5a6b7d", line = "#e8e2d6";
  const digits = String(d.phone).replace(/\D/g, "");
  const link = (href, text) => `<a href="${esc(href)}" style="color:${brand};text-decoration:underline">${esc(text)}</a>`;
  const small = (html) => `<br><span style="font-weight:400;font-size:13px">${html}</span>`;
  const row = (label, valueHtml) =>
    `<tr><td style="padding:10px 0;border-bottom:1px solid ${line};width:34%;font-size:13px;color:${mute};vertical-align:top">${label}</td>` +
    `<td style="padding:10px 0;border-bottom:1px solid ${line};font-size:15px;color:${ink};font-weight:600;vertical-align:top">${valueHtml}</td></tr>`;
  const rows = [
    row("Folio", esc(d.folio) || "none"),
    row("Customer", esc(d.name) || "&mdash;"),
    row("Phone", d.phone ? esc(d.phone) + (digits.length >= 8 ? small(link("https://wa.me/" + digits, "Open in WhatsApp")) : "") : "&mdash;"),
    row("Email", d.email ? link("mailto:" + d.email, d.email) : "&mdash;"),
  ];
  if (d.location) rows.push(row("Location", esc(d.location) + small(link("https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(d.location), "Open in Google Maps"))));
  if (d.notes) rows.push(row("Notes", `<span style="font-weight:400">${esc(d.notes)}</span>`));
  const balance = d.total !== null ? Math.max(0, d.total - d.paid) : null;
  const pay = (label, val, strong) =>
    `<tr><td style="padding:6px 0;font-size:14px;color:${mute}">${label}</td><td align="right" style="padding:6px 0;font-size:${strong ? 18 : 14}px;font-weight:${strong ? 800 : 600};color:${strong ? "#1b7a43" : ink}">${val}</td></tr>`;
  const button = d.intent
    ? `<tr><td align="center" style="padding:6px 28px 28px"><table role="presentation" cellpadding="0" cellspacing="0"><tr><td style="background:${brand};border-radius:999px"><a href="https://dashboard.stripe.com/payments/${encodeURIComponent(d.intent)}" style="display:inline-block;padding:13px 28px;font-size:15px;font-weight:700;color:#ffffff;text-decoration:none">View payment in Stripe</a></td></tr></table></td></tr>`
    : "";
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="color-scheme" content="light"><title>Paid booking</title></head>
<body style="margin:0;padding:0;background:#eef1f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;color:#eef1f5">${esc(d.service)} &middot; ${esc(d.when || "no date")} &middot; deposit ${esc(money(d.paid))} paid</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#eef1f5"><tr><td align="center" style="padding:24px 12px">
<table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:16px;overflow:hidden">
<tr><td style="background:${brand};padding:22px 28px"><div style="font-size:12px;letter-spacing:.14em;text-transform:uppercase;color:${gold};font-weight:700">${esc(d.biz)}</div><div style="font-size:22px;font-weight:800;color:#ffffff;margin-top:4px">New paid booking</div></td></tr>
<tr><td style="padding:26px 28px 6px"><span style="display:inline-block;background:#e4f4ea;color:#1b7a43;font-size:11px;font-weight:800;letter-spacing:.08em;padding:4px 10px;border-radius:999px">DEPOSIT PAID</span><div style="font-size:24px;font-weight:800;color:${brand};line-height:1.25;margin-top:10px">${esc(d.service)}</div></td></tr>
<tr><td style="padding:14px 28px 6px"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#faf6ee;border-left:4px solid ${gold};border-radius:8px"><tr><td style="padding:14px 16px"><div style="font-size:12px;color:${mute};text-transform:uppercase;letter-spacing:.08em">When</div><div style="font-size:19px;font-weight:800;color:${ink};margin-top:3px">${esc(d.when) || "Not specified"}</div><div style="font-size:12px;color:${mute};margin-top:2px">Cabo San Lucas time</div></td></tr></table></td></tr>
<tr><td style="padding:10px 28px 4px"><table role="presentation" width="100%" cellpadding="0" cellspacing="0">${rows.join("")}</table></td></tr>
<tr><td style="padding:18px 28px"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f6f8fb;border-radius:12px"><tr><td style="padding:14px 18px"><table role="presentation" width="100%" cellpadding="0" cellspacing="0">${pay("Deposit paid (" + esc(d.currency) + ")", esc(money(d.paid)), true)}${balance !== null ? pay("Balance due after the service", esc(money(balance)), false) + pay("Service total", esc(money(d.total)), false) : ""}</table></td></tr></table></td></tr>
${button}
<tr><td style="padding:0 28px 24px;font-size:12px;color:${mute};line-height:1.5;border-top:1px solid ${line}"><div style="padding-top:16px">Automated notice. Contact the customer to confirm the exact time. The payment is recorded in Stripe and in the clinic register under the folio.</div></td></tr>
</table></td></tr></table></body></html>`;
}

async function sendEmail(msg) {
  const r = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: process.env.NOTIFY_FROM || "Bookings <onboarding@resend.dev>",
      to: process.env.NOTIFY_EMAIL.split(",").map((s) => s.trim()).filter(Boolean),
      subject: msg.subject,
      html: msg.html,
      text: msg.text,
    }),
  });
  if (!r.ok) throw new Error(`resend ${r.status}`);
}

// WhatsApp (UltraMsg) al dueño. Opcional: solo se envía si están ULTRAMSG_INSTANCE, ULTRAMSG_TOKEN y NOTIFY_WHATSAPP.
// Si falla no rompe nada: el correo ya es el aviso principal y un error aquí no debe hacer que Stripe reintente.
async function sendWhatsapp(text) {
  const instance = process.env.ULTRAMSG_INSTANCE, token = process.env.ULTRAMSG_TOKEN
  const numbers = (process.env.NOTIFY_WHATSAPP || "").split(",").map((s) => s.replace(/\D/g, "")).filter(Boolean)
  if (!instance || !token || !numbers.length) return
  await Promise.all(numbers.map(async (n) => {
    try {
      const r = await fetch(`https://api.ultramsg.com/${instance}/messages/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({ token, to: `${n}@c.us`, body: text }).toString(),
      })
      if (!r.ok) console.error("whatsapp notify failed:", r.status)
    } catch (e) { console.error("whatsapp notify failed:", e.message) }
  }))
}

// Reenvía el pago a Turno (panel + WhatsApp al dueño y al cliente). Opcional: solo si están TURNO_WEBHOOK_URL y WEB_PAYMENT_SECRET.
// No rompe nada si falla: el correo sigue siendo el aviso de respaldo.
async function forwardToTurno(session) {
  const url = process.env.TURNO_WEBHOOK_URL, secret = process.env.WEB_PAYMENT_SECRET
  if (!url || !secret) { console.error("turno forward skipped: missing env", { TURNO_WEBHOOK_URL: !!url, WEB_PAYMENT_SECRET: !!secret }); return false }
  const m = session.metadata || {}
  const cd = session.customer_details || {}
  const field = (session.custom_fields || []).find((f) => f.key === "location")
  try {
    const r = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-webhook-secret": secret },
      body: JSON.stringify({
        org_slug: process.env.TURNO_ORG_SLUG || "cabo-pharmacy",
        source: "cabowalkinclinic",
        payment_ref: session.payment_intent || session.id,
        service_name: m.service_name || "service",
        customer_name: m.customer_name || cd.name || "",
        customer_phone: m.customer_phone || cd.phone || "",
        customer_email: cd.email || session.customer_email || "",
        booking_date: m.booking_date || "",
        booking_time: m.booking_time || "",
        location: m.location || (field && field.text && field.text.value) || "",
        notes: "",
        currency: session.currency || "usd",
        paid_amount: (session.amount_total || 0) / 100,
        total_amount: m.service_total_usd || null,
        stripe_url: session.payment_intent ? `https://dashboard.stripe.com/payments/${session.payment_intent}` : "",
        lang: "en",
      }),
    })
    if (!r.ok) console.error("turno forward failed:", r.status)
    else console.log("turno forward ok")
    return r.ok
  } catch (e) { console.error("turno forward failed:", e.message); return false }
}

// Runs `fn` once per key across Stripe retries when the register is available. Returns the channel result.
async function once(store, key, fn) {
  if (!store) return fn();
  try { if ((await store.kv.get(key)) === "done") return true; } catch {}
  const ok = await fn();
  if (ok) { try { await store.kv.set(key, "done", 30 * 86400); } catch {} }
  return ok;
}

const FOLIO_RE = /CWC-[2-9A-Z]{4}-[2-9A-Z]{4}/;
const biz = () => (process.env.BUSINESS_NAME ? `${process.env.BUSINESS_NAME} — ` : "");

async function plainAlert(store, id, subject, lines) {
  return once(store, `ntf:${id}`, () => emailOps(`${biz()}${subject}`, lines.join("\n")));
}

async function emailOps(subject, text) {
  try {
    const r = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({ from: process.env.NOTIFY_FROM || "Bookings <onboarding@resend.dev>", to: process.env.NOTIFY_EMAIL.split(",").map((s) => s.trim()).filter(Boolean), subject, text }),
    });
    return r.ok;
  } catch { return false; }
}

async function onPaid(store, session, eventId) {
  const m = session.metadata || {};
  const ref = m.folio || session.client_reference_id || "";
  const pi = session.payment_intent || "";
  if (store) {
    try {
      const rec = ref ? await loadRecord(store, ref) : null;
      const pay = { sessionId: session.id, paymentIntent: pi, cents: session.amount_total || 0, currency: session.currency || "usd", paidAt: nowIso() };
      if (rec) await setStatus(store, ref, "paid", { pay });
      else await saveRecord(store, { ref: ref || `NOFOLIO-${session.id.slice(-10)}`, service: m.option || "", status: "paid", orphan: !ref, createdAt: nowIso(), updatedAt: nowIso(), pay, history: [{ at: nowIso(), status: "paid" }] });
      if (pi) await store.kv.set(`pi:${pi}`, ref || session.id, 400 * 86400);
      await store.kv.push("idx:payments", ref || session.id, 1000);
    } catch { console.error("register update failed (paid)"); }
  }
  const msg = compose(session);
  // QuickTurno first (it sends the WhatsApp to owner and client); direct WhatsApp only as fallback
  const inTurno = await once(store, `ch:${session.id}:turno`, () => forwardToTurno(session));
  if (!inTurno) await once(store, `ch:${session.id}:wa`, async () => { await sendWhatsapp(`💰 ${msg.text}`); return true; });
  await once(store, `ch:${session.id}:email`, async () => { await sendEmail(msg); return true; });
  return true;
}

async function lookupRef(store, pi, description) {
  const fromText = (String(description || "").match(FOLIO_RE) || [])[0] || "";
  if (fromText) return fromText;
  if (store && pi) { try { return (await store.kv.get(`pi:${pi}`)) || ""; } catch {} }
  return "";
}

async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).send("Method not allowed");
  }
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret || !process.env.RESEND_API_KEY || !process.env.NOTIFY_EMAIL) {
    console.error("Webhook not configured: set STRIPE_WEBHOOK_SECRET, RESEND_API_KEY and NOTIFY_EMAIL");
    return res.status(500).send("Webhook not configured");
  }

  let raw;
  try { raw = await readRaw(req); } catch (e) { return res.status(400).send("Unreadable body"); }
  if (!verify(raw, req.headers["stripe-signature"], secret)) {
    console.error("Invalid Stripe signature");
    return res.status(400).send("Invalid signature");
  }

  let event;
  try { event = JSON.parse(raw.toString("utf8")); } catch (e) { return res.status(400).send("Bad JSON"); }
  const obj = (event.data && event.data.object) || {};
  const store = getStore();
  if (store && event.id) { try { if ((await store.kv.get(`evt:${event.id}`)) === "done") return res.status(200).send("duplicate"); } catch {} }
  const finish = async (body) => { if (store && event.id) { try { await store.kv.set(`evt:${event.id}`, "done", 30 * 86400); } catch {} } return res.status(200).send(body); };

  try {
    switch (event.type) {
      case "checkout.session.completed":
      case "checkout.session.async_payment_succeeded": {
        const paid = event.type === "checkout.session.async_payment_succeeded" || obj.payment_status === "paid";
        if (!paid) return finish("ignored: not paid yet");
        // The Stripe account also receives payments of other services. Only this clinic's checkout sets metadata.option.
        if (!obj.metadata || !obj.metadata.option) return finish("ignored: not a clinic booking");
        await onPaid(store, obj, event.id);
        return finish("ok");
      }
      case "checkout.session.async_payment_failed":
      case "checkout.session.expired": {
        if (!obj.metadata || !obj.metadata.option) return finish("ignored: not a clinic booking");
        const ref = obj.metadata.folio || obj.client_reference_id || "";
        const failed = event.type.endsWith("failed");
        if (store && ref) { try { await setStatus(store, ref, failed ? "payment_failed" : "payment_expired"); } catch {} }
        const m = obj.metadata;
        await plainAlert(store, event.id, `[${ref || "NO FOLIO"}] ${failed ? "Payment FAILED" : "Checkout not completed"}: ${m.service_name || m.option}`, [
          failed ? "The bank payment failed after checkout." : "The patient opened the payment page but did not pay within the time limit.",
          `Folio: ${ref || "-"}`, `Service: ${m.service_name || m.option}`, `Preferred: ${[m.booking_date, m.booking_time].filter(Boolean).join(" ") || "-"}`,
          `Name: ${m.customer_name || "-"}`, `Phone: ${m.customer_phone || "-"}`,
          "", "Next: contact the patient to confirm or offer another way to pay. Do not discuss clinical details by email.",
        ]);
        return finish("ok");
      }
      case "charge.refunded":
      case "charge.dispute.created": {
        const pi = obj.payment_intent || "";
        const ref = await lookupRef(store, pi, obj.description || (obj.charge && obj.charge.description));
        const ours = !!ref || !!(obj.metadata && obj.metadata.option);
        if (!ours) return finish("ignored: not a clinic payment");
        const refund = event.type === "charge.refunded";
        if (store && ref) { try { await setStatus(store, ref, refund ? "refunded" : "disputed", refund ? { refundedCents: obj.amount_refunded || 0 } : { dispute: { reason: obj.reason || "", amount: obj.amount || 0 } }); } catch {} }
        await plainAlert(store, event.id, `[${ref || "?"}] ${refund ? "Refund issued" : "DISPUTE opened — respond in Stripe"}`, [
          refund ? `Refunded: $${((obj.amount_refunded || 0) / 100).toFixed(2)} ${(obj.currency || "usd").toUpperCase()}` : `Disputed amount: $${((obj.amount || 0) / 100).toFixed(2)} — reason: ${obj.reason || "-"}`,
          `Folio: ${ref || "-"}`, pi ? `Stripe: https://dashboard.stripe.com/payments/${pi}` : "",
          refund ? "" : "Disputes have a deadline: upload evidence (booking record, confirmation, service notes without clinical details) in Stripe.",
        ].filter(Boolean));
        return finish("ok");
      }
      default:
        return finish("ignored");
    }
  } catch (e) {
    console.error("notify failed:", e.message);
    return res.status(500).send("notify failed"); // Stripe retries; channels already done are skipped
  }
}

module.exports = handler;
// Stripe needs the exact raw body to verify the signature, so don't let the platform parse it.
module.exports.config = { api: { bodyParser: false } };
