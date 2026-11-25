# Checkout & booking tests — 2026-11-25

Run: `node tools/test.mjs` (no network; Stripe is mocked; no real or test charges were made).

| Case | Expected | Result |
|---|---|---|
| GET /api/checkout | 405 | pass |
| Unknown option | 400 | pass |
| No `STRIPE_SECRET_KEY` | 303 → WhatsApp fallback | pass |
| House call booking | Stripe session, deposit 9450 cents (50% of $189), total 189 in metadata | pass |
| Clinic booking | deposit 4950 cents | pass |
| Notes containing symptoms | never sent to Stripe (keys or values) | pass |
| Stripe error (402) | 303 → WhatsApp fallback, no crash | pass |
| Network failure | 303 → WhatsApp fallback | pass |
| Wizard prices = checkout prices | all 10 options | pass |
| Aesthetics booking form | opens WhatsApp with name, topic, day, time; no medical text; validation message if empty | verified in browser 2026-11-24 |

Not covered (needs Stripe test mode + Vercel preview, owner approval): real test-mode session, webhook replay/duplicate (`api/stripe-webhook.js`), refund flow, double booking. Webhook was not modified in V4.
