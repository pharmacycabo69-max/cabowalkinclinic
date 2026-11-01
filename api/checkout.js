// POST /api/checkout  (form field: option)
// Creates a Stripe Checkout Session for the 50% deposit of a clinic service and
// redirects the customer to Stripe. Prices live server-side in _prices.json;
// the client only sends the option key. Requires env STRIPE_SECRET_KEY.
const OPTIONS = require("./_prices.json");

const SITE = process.env.SITE_URL || "https://www.cabowalkinclinic.com";
const clean = (v, n = 200) => (typeof v === "string" ? v.trim().slice(0, n) : "");

const WA_FALLBACK = "https://wa.me/5216242261023?text=" +
  encodeURIComponent("Hi, I'd like to book a service at Cabo Walk-In Clinic");

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).send("Method not allowed");
  }

  const key = req.body && req.body.option;
  const option = Object.prototype.hasOwnProperty.call(OPTIONS, key) ? OPTIONS[key] : null;
  if (!option) return res.status(400).send("Unknown service option");

  const secret = process.env.STRIPE_SECRET_KEY;
  if (!secret) {
    console.error("STRIPE_SECRET_KEY is not set");
    return res.redirect(303, WA_FALLBACK);
  }

  const deposit = Math.round(option.price * 100 / 2); // cents, 50%

  // Optional booking details from the /book/ wizard; shown in the Stripe dashboard.
  const b = req.body;
  const date = /^\d{4}-\d{2}-\d{2}$/.test(clean(b.date, 10)) ? clean(b.date, 10) : "";
  const time = /^(ASAP|\d{2}:\d{2})$/.test(clean(b.time, 5)) ? clean(b.time, 5) : "";
  const email = /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(clean(b.email)) ? clean(b.email) : "";
  const details = {
    service_name: option.name,
    service_total_usd: String(option.price),
    booking_date: date,
    booking_time: time,
    customer_name: clean(b.name, 100),
    customer_phone: clean(b.phone, 40),
    location: clean(b.location),
    notes: clean(b.notes, 300),
  };
  const p = new URLSearchParams({
    mode: "payment",
    "line_items[0][quantity]": "1",
    "line_items[0][price_data][currency]": "usd",
    "line_items[0][price_data][unit_amount]": String(deposit),
    "line_items[0][price_data][product_data][name]": `Deposit — ${option.name}`,
    "line_items[0][price_data][product_data][description]":
      `50% deposit of $${option.price} USD. The remaining balance is paid after the service.`,
    "payment_intent_data[description]": `Deposit — ${option.name} (total $${option.price} USD)`,
    "payment_intent_data[metadata][option]": key,
    "payment_intent_data[metadata][total_usd]": String(option.price),
    "metadata[option]": key,
    success_url: `${SITE}/thanks/`,
    cancel_url: `${SITE}${option.cancel}`,
  });
  p.set("phone_number_collection[enabled]", "true");
  if (email) p.set("customer_email", email);
  for (const [k, v] of Object.entries(details)) {
    if (!v) continue;
    p.set(`metadata[${k}]`, v);
    p.set(`payment_intent_data[metadata][${k}]`, v);
  }
  if (details.booking_date) {
    p.set("payment_intent_data[description]",
      `Deposit — ${option.name} (total $${option.price} USD) — ${details.booking_date} ${details.booking_time}`.trim());
  }
  if (option.kind === "mobile" && !details.location) {
    p.set("custom_fields[0][key]", "location");
    p.set("custom_fields[0][label][type]", "custom");
    p.set("custom_fields[0][label][custom]", "Hotel / villa and room or address");
    p.set("custom_fields[0][type]", "text");
  }

  try {
    const r = await fetch("https://api.stripe.com/v1/checkout/sessions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${secret}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: p,
    });
    const data = await r.json();
    if (!r.ok || !data.url) {
      console.error("Stripe error", r.status, data && data.error);
      return res.redirect(303, WA_FALLBACK);
    }
    return res.redirect(303, data.url);
  } catch (err) {
    console.error("Checkout failed", err);
    return res.redirect(303, WA_FALLBACK);
  }
};
