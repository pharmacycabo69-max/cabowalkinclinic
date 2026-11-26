// Team notifications through the channels that already exist (no new CRM):
//  - email with Resend (RESEND_API_KEY, NOTIFY_EMAIL, NOTIFY_FROM) — the main operational channel;
//  - CRM / concierge bot by signed webhook (REQUEST_WEBHOOK_URL, REQUEST_WEBHOOK_SECRET), same contract as cvupharmacy;
//  - QuickTurno agenda for confirmed payments (TURNO_WEBHOOK_URL, WEB_PAYMENT_SECRET, TURNO_ORG_SLUG);
//  - internal WhatsApp through UltraMsg (ULTRAMSG_INSTANCE, ULTRAMSG_TOKEN, NOTIFY_WHATSAPP): minimal text only.
// Every function returns true only when the destination accepted the message. No personal data is written to logs.
const crypto = require("crypto");

// Local tests may point Resend/Stripe to a fake server on this machine; never on Vercel.
function apiBase(name, real) {
  const v = process.env[name];
  if (v && !process.env.VERCEL && /^http:\/\/(127\.0\.0\.1|localhost):\d+$/.test(v)) return v;
  return real;
}

const team = () => (process.env.NOTIFY_EMAIL || "").split(",").map((s) => s.trim()).filter(Boolean);
const canEmail = () => !!(process.env.RESEND_API_KEY && team().length);

async function email(to, subject, text, html, idem) {
  if (!process.env.RESEND_API_KEY || !to.length) return false;
  try {
    const r = await fetch(`${apiBase("RESEND_API_BASE", "https://api.resend.com")}/emails`, {
      method: "POST",
      headers: { authorization: `Bearer ${process.env.RESEND_API_KEY}`, "content-type": "application/json", ...(idem ? { "idempotency-key": String(idem).slice(0, 256) } : {}) },
      body: JSON.stringify({ from: process.env.NOTIFY_FROM || "Cabo Walk-In Clinic <onboarding@resend.dev>", to, subject, text, ...(html ? { html } : {}) }),
      signal: AbortSignal.timeout(8000),
    });
    if (!r.ok) console.error("email failed", r.status);
    return r.ok;
  } catch {
    console.error("email failed: network");
    return false;
  }
}

const emailTeam = (subject, text, idem, html) => email(team(), subject, text, html, idem);
const emailClient = (to, subject, text, idem) => email([to], subject, text, null, idem);

async function toCrm(payload, idem) {
  const url = process.env.REQUEST_WEBHOOK_URL;
  if (!url) return false;
  const body = JSON.stringify(payload);
  const headers = { "content-type": "application/json", "idempotency-key": idem };
  if (process.env.REQUEST_WEBHOOK_SECRET) headers["x-cwc-signature"] = "sha256=" + crypto.createHmac("sha256", process.env.REQUEST_WEBHOOK_SECRET).update(body).digest("hex");
  try {
    const r = await fetch(url, { method: "POST", headers, body, signal: AbortSignal.timeout(8000) });
    if (!r.ok) console.error("crm forward failed", r.status);
    return r.ok;
  } catch {
    console.error("crm forward failed: network");
    return false;
  }
}

const agendaConfigured = () => !!(process.env.TURNO_WEBHOOK_URL && process.env.WEB_PAYMENT_SECRET);

async function toAgenda(payload) {
  if (!agendaConfigured()) return false;
  try {
    const r = await fetch(process.env.TURNO_WEBHOOK_URL, {
      method: "POST",
      headers: { "content-type": "application/json", "x-webhook-secret": process.env.WEB_PAYMENT_SECRET },
      body: JSON.stringify({ org_slug: process.env.TURNO_ORG_SLUG || "cabo-pharmacy", source: "cabowalkinclinic", ...payload }),
      signal: AbortSignal.timeout(8000),
    });
    if (!r.ok) console.error("turno forward failed", r.status);
    return r.ok;
  } catch {
    console.error("turno forward failed: network");
    return false;
  }
}

// Minimal WhatsApp to the team: folio, service, date. Never names of conditions, notes or results.
async function whatsappTeam(text) {
  const instance = process.env.ULTRAMSG_INSTANCE, token = process.env.ULTRAMSG_TOKEN;
  const numbers = (process.env.NOTIFY_WHATSAPP || "").split(",").map((s) => s.replace(/\D/g, "")).filter(Boolean);
  if (!instance || !token || !numbers.length) return false;
  const res = await Promise.all(numbers.map(async (n) => {
    try {
      const r = await fetch(`https://api.ultramsg.com/${instance}/messages/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({ token, to: `${n}@c.us`, body: text }).toString(),
        signal: AbortSignal.timeout(8000),
      });
      return r.ok;
    } catch { return false; }
  }));
  if (!res.some(Boolean)) console.error("whatsapp notify failed");
  return res.some(Boolean);
}

module.exports = { apiBase, canEmail, emailTeam, emailClient, toCrm, toAgenda, agendaConfigured, whatsappTeam };
