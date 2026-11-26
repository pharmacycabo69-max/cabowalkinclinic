// POST /api/checkout  (form field: option; optional ref = folio from /api/request)
// Creates a Stripe Checkout Session for the card deposit of a clinic service and redirects to Stripe.
// Amounts come only from _catalog.json (server side); the browser sends the service key, never a price.
// V6 rules:
//  - only services whose catalog payment is "deposit" or "optional" can be charged online;
//  - video consultations are NOT charged with Stripe (telemedicine is listed as prohibited for Mexico): they go to the
//    request flow instead;
//  - the share is 50% (current approved policy). 100% is prepared but only active with PAYMENT_FULL_APPROVED=yes;
//  - every session carries an opaque folio (client_reference_id + metadata) and a Stripe idempotency key, expires in
//    60 minutes, and never includes notes, symptoms or ad identifiers.
// Requires env STRIPE_SECRET_KEY. Without it (or on any Stripe error) the visitor is sent to WhatsApp, as before.
const CATALOG = require("./_catalog.json");
const { getStore, newFolio, loadRecord, saveRecord, setStatus, nowIso } = require("./_lib/store");
const { apiBase } = require("./_lib/notify");

const SITE = process.env.SITE_URL || "https://www.cabowalkinclinic.com";
const clean = (v, n = 200) => (typeof v === "string" ? v.trim().slice(0, n) : "");
const FOLIO = /^CWC-[2-9A-Z]{4}-[2-9A-Z]{4}$/;

const WA_FALLBACK = "https://wa.me/" + CATALOG.business.whatsapp + "?text=" +
  encodeURIComponent("Hi, I'd like to book a service at Cabo Walk-In Clinic");

function chargeable(key) {
  const s = Object.prototype.hasOwnProperty.call(CATALOG.services, key) ? CATALOG.services[key] : null;
  if (!s || !(s.price > 0)) return null;
  if (s.payment === "deposit" || s.payment === "optional") return s;
  return null;
}

function share() {
  return process.env.PAYMENT_FULL_APPROVED === "yes" ? 1 : CATALOG.depositShare;
}

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).send("Method not allowed");
  }
  const b = req.body || {};
  const key = clean(b.option, 40);
  const known = Object.prototype.hasOwnProperty.call(CATALOG.services, key);
  if (!known) return res.status(400).send("Unknown service option");
  const option = chargeable(key);
  // known service that is not paid online (video, quotes): send the visitor to the request flow, never to Stripe
  if (!option) return res.redirect(303, `${SITE}/book/?service=${encodeURIComponent(key)}`);

  const secret = process.env.STRIPE_SECRET_KEY;
  if (!secret) {
    console.error("STRIPE_SECRET_KEY is not set");
    return res.redirect(303, WA_FALLBACK);
  }

  const part = share();
  const amount = Math.round(option.price * 100 * part); // cents, server side only
  const isFull = part === 1;
  const date = /^\d{4}-\d{2}-\d{2}$/.test(clean(b.date, 10)) ? clean(b.date, 10) : "";
  const time = /^(ASAP|\d{2}:\d{2})$/.test(clean(b.time, 5)) ? clean(b.time, 5) : "";
  const email = /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(clean(b.email)) ? clean(b.email) : "";

  // folio: reuse the one created by /api/request, or create one now
  const store = getStore();
  let ref = FOLIO.test(clean(b.ref, 20)) ? clean(b.ref, 20) : "";
  if (store) {
    try {
      const rec = ref ? await loadRecord(store, ref) : null;
      if (!rec || rec.service !== key) {
        ref = newFolio();
        await saveRecord(store, { ref, service: key, group: option.group, status: "payment_pending", createdAt: nowIso(), updatedAt: nowIso(), lang: b.lang === "es" ? "es" : "en", history: [{ at: nowIso(), status: "payment_pending" }] });
        await store.kv.push("idx:requests", ref, 1000);
      } else {
        await setStatus(store, ref, "payment_pending");
      }
    } catch { console.error("checkout: register unavailable"); }
  }
  if (!ref) ref = newFolio();

  const details = {
    folio: ref,
    service_name: option.en,
    service_total_usd: String(option.price),
    booking_date: date,
    booking_time: time,
    customer_name: clean(b.name, 100),
    customer_phone: clean(b.phone, 40),
    location: clean(b.location),
    // notes, symptoms and ad click identifiers are NOT sent to Stripe (V6 §13, §21)
  };
  const label = isFull ? "Payment" : "Deposit";
  const p = new URLSearchParams({
    mode: "payment",
    client_reference_id: ref,
    // bucketed so an identical resubmit within 10 minutes produces the identical request (idempotency below)
    expires_at: String(Math.floor(Date.now() / 600000) * 600 + 70 * 60),
    "line_items[0][quantity]": "1",
    "line_items[0][price_data][currency]": "usd",
    "line_items[0][price_data][unit_amount]": String(amount),
    "line_items[0][price_data][product_data][name]": `${label} — ${option.en}`,
    "line_items[0][price_data][product_data][description]": isFull
      ? `Full price $${option.price} USD, tax included. Folio ${ref}.`
      : `50% deposit of $${option.price} USD. The remaining balance is paid after the service. Folio ${ref}.`,
    "payment_intent_data[description]": `${label} — ${option.en} (total $${option.price} USD) — ${ref}`,
    "payment_intent_data[metadata][option]": key,
    "payment_intent_data[metadata][total_usd]": String(option.price),
    "metadata[option]": key,
    success_url: `${SITE}/thanks/?ref=${encodeURIComponent(ref)}`,
    cancel_url: `${SITE}${option.cancel}`,
  });
  p.set("phone_number_collection[enabled]", "true");
  if (email) p.set("customer_email", email);
  for (const [k, v] of Object.entries(details)) {
    if (!v) continue;
    p.set(`metadata[${k}]`, v);
    p.set(`payment_intent_data[metadata][${k}]`, v);
  }
  if (option.kind === "mobile" && !details.location) {
    p.set("custom_fields[0][key]", "location");
    p.set("custom_fields[0][label][type]", "custom");
    p.set("custom_fields[0][label][custom]", "Hotel / villa and room or address");
    p.set("custom_fields[0][type]", "text");
  }

  try {
    const r = await fetch(`${apiBase("STRIPE_API_BASE", "https://api.stripe.com")}/v1/checkout/sessions`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${secret}`,
        "Content-Type": "application/x-www-form-urlencoded",
        // identical request (double click, refresh) = same session; any changed field = a new session
        "Idempotency-Key": "cwc-" + require("crypto").createHash("sha256").update(p.toString()).digest("hex").slice(0, 40),
      },
      body: p,
      signal: AbortSignal.timeout(10000),
    });
    const data = await r.json();
    if (!r.ok || !data.url) {
      console.error("Stripe error", r.status, data && data.error && data.error.type);
      return res.redirect(303, WA_FALLBACK);
    }
    return res.redirect(303, data.url);
  } catch (err) {
    console.error("Checkout failed", err && err.name);
    return res.redirect(303, WA_FALLBACK);
  }
};
module.exports._chargeable = chargeable;
