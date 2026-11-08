// POST /api/stripe-webhook  (reusable: copy this single file into any Vercel project)
//
// Stripe calls this when a Checkout payment is confirmed. It verifies the signature and
// emails the owner ONE message with the booking details. Nothing is stored; Stripe is the record.
//
// Env vars (Vercel):
//   STRIPE_WEBHOOK_SECRET  whsec_... of the Stripe webhook endpoint        (required)
//   RESEND_API_KEY         Resend API key                                  (required)
//   NOTIFY_EMAIL           recipient(s), comma-separated                   (required)
//   NOTIFY_FROM            "Name <orders@your-verified-domain.com>"        (optional; default is Resend's
//                          onboarding@resend.dev, which only delivers to your own Resend account email)
//   BUSINESS_NAME          shown in the subject line and email header      (optional)
//   BRAND_COLOR            #rrggbb for the email header and button         (optional, default #0b2a4a)
//   ULTRAMSG_INSTANCE / ULTRAMSG_TOKEN / NOTIFY_WHATSAPP   also send the same notice by WhatsApp
//                          (NOTIFY_WHATSAPP = number(s) with country code, comma-separated)  (optional)
//
// It reads the details from the Checkout Session metadata that the checkout endpoint sets:
//   service_name, service_total_usd, booking_date, booking_time, customer_name,
//   customer_phone, location, notes   (all optional)
// Subscribe the endpoint to: checkout.session.completed and checkout.session.async_payment_succeeded.
const crypto = require("crypto");

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
    `When: ${when || "not specified"} (Cabo time)`,
    `Customer: ${name || "-"}`,
    `Phone: ${phone || "-"}`,
    `Email: ${cd.email || "-"}`,
  ];
  if (location) lines.push(`Location: ${location}`);
  if (m.notes) lines.push(`Notes: ${m.notes}`);
  lines.push(`Deposit paid: $${paid.toFixed(2)} ${currency}`);
  if (hasTotal) lines.push(`Balance due after service: $${(total - paid).toFixed(2)} (total $${total})`);
  if (session.payment_intent) lines.push(`Stripe: https://dashboard.stripe.com/payments/${session.payment_intent}`);
  const biz = process.env.BUSINESS_NAME ? `${process.env.BUSINESS_NAME} — ` : "";
  return {
    subject: `${biz}Paid booking: ${service} — ${when || "no date"}`,
    text: lines.join("\n"),
    html: renderHtml({
      biz: process.env.BUSINESS_NAME || "Bookings", service, when: formatWhen(m.booking_date, m.booking_time),
      name, phone, email: cd.email || "", location, notes: m.notes || "", paid, total: hasTotal ? total : null,
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
<tr><td style="padding:0 28px 24px;font-size:12px;color:${mute};line-height:1.5;border-top:1px solid ${line}"><div style="padding-top:16px">Automated notice. Contact the customer to confirm the exact time. Nothing is stored: the payment is recorded in Stripe.</div></td></tr>
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
        notes: m.notes || "",
        currency: session.currency || "usd",
        paid_amount: (session.amount_total || 0) / 100,
        total_amount: m.service_total_usd || null,
        stripe_url: session.payment_intent ? `https://dashboard.stripe.com/payments/${session.payment_intent}` : "",
        lang: "en",
      }),
    })
    if (!r.ok) console.error("turno forward failed:", r.status, await r.text().catch(() => ""))
    else console.log("turno forward ok")
    return r.ok
  } catch (e) { console.error("turno forward failed:", e.message); return false }
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
  const session = event.data && event.data.object;
  const confirmed =
    event.type === "checkout.session.async_payment_succeeded" ||
    (event.type === "checkout.session.completed" && session && session.payment_status === "paid");
  if (!confirmed) return res.status(200).send("ignored"); // unpaid or unrelated event: no email
  // La cuenta de Stripe recibe pagos de otros servicios. Solo los del checkout de la clínica (api/checkout.js)
  // llevan metadata.option, así que cualquier otro pago se ignora: ni correo, ni WhatsApp, ni envío a Turno.
  if (!session.metadata || !session.metadata.option) return res.status(200).send("ignored: not a clinic booking");

  try {
    const msg = compose(session);
    // Si Turno registró el pago, él manda los WhatsApp (dueño y cliente); si no, se usa el aviso directo de respaldo
    const inTurno = await forwardToTurno(session);
    if (!inTurno) await Promise.allSettled([sendWhatsapp(`💰 ${msg.text}`)]);
    await sendEmail(msg);
    return res.status(200).send("ok");
  } catch (e) {
    console.error("notify failed:", e.message);
    return res.status(500).send("notify failed"); // Stripe will retry
  }
}

module.exports = handler;
// Stripe needs the exact raw body to verify the signature, so don't let the platform parse it.
module.exports.config = { api: { bodyParser: false } };
