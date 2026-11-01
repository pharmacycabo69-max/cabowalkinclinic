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
//   BUSINESS_NAME          shown in the subject line                       (optional)
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

function compose(session) {
  const m = session.metadata || {};
  const cd = session.customer_details || {};
  const paid = (session.amount_total || 0) / 100;
  const total = m.service_total_usd ? Number(m.service_total_usd) : null;
  const field = (session.custom_fields || []).find((f) => f.key === "location");
  const location = m.location || (field && field.text && field.text.value) || "";
  const when = [m.booking_date, m.booking_time === "ASAP" ? "as soon as possible" : m.booking_time].filter(Boolean).join(" ");
  const service = m.service_name || "service";
  const lines = [
    `New paid booking: ${service}`,
    `When: ${when || "not specified"} (Cabo time)`,
    `Customer: ${m.customer_name || cd.name || "-"}`,
    `Phone: ${m.customer_phone || cd.phone || "-"}`,
    `Email: ${cd.email || "-"}`,
  ];
  if (location) lines.push(`Location: ${location}`);
  if (m.notes) lines.push(`Notes: ${m.notes}`);
  lines.push(`Deposit paid: $${paid.toFixed(2)} ${(session.currency || "usd").toUpperCase()}`);
  if (total !== null && !Number.isNaN(total)) lines.push(`Balance due after service: $${(total - paid).toFixed(2)} (total $${total})`);
  if (session.payment_intent) lines.push(`Stripe: https://dashboard.stripe.com/payments/${session.payment_intent}`);
  const biz = process.env.BUSINESS_NAME ? `${process.env.BUSINESS_NAME} — ` : "";
  return { subject: `${biz}Paid booking: ${service} — ${when || "no date"}`, text: lines.join("\n") };
}

async function sendEmail(msg) {
  const r = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: process.env.NOTIFY_FROM || "Bookings <onboarding@resend.dev>",
      to: process.env.NOTIFY_EMAIL.split(",").map((s) => s.trim()).filter(Boolean),
      subject: msg.subject,
      text: msg.text,
    }),
  });
  if (!r.ok) throw new Error(`resend ${r.status}`);
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

  try {
    await sendEmail(compose(session));
    return res.status(200).send("ok");
  } catch (e) {
    console.error("notify failed:", e.message);
    return res.status(500).send("notify failed"); // Stripe will retry
  }
}

module.exports = handler;
// Stripe needs the exact raw body to verify the signature, so don't let the platform parse it.
module.exports.config = { api: { bodyParser: false } };
