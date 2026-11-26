# V6 — Booking, payments, notifications and integrations (2026-11-26)

Branch `dev/v6-platform`. Nothing here is live until the owner approves publishing. Technical document: no secrets, costs or patient data.

## 1. What already existed (kept, not rebuilt)
| Piece | Status before V6 | V6 |
|---|---|---|
| `api/checkout.js` → Stripe Checkout, 50% deposit, prices server-side | Working; produced real charges | Kept. Added folio, idempotency, expiry; removed ad ids from Stripe; video consults no longer charged |
| `api/stripe-webhook.js` → signature check → QuickTurno (`TURNO_WEBHOOK_URL`) → owner WhatsApp + client WhatsApp; Resend email; UltraMsg WhatsApp fallback | Working | Kept the same contract with QuickTurno. Added idempotency per event and per channel, register update, alerts for failed/expired/refunded/disputed/no-folio payments |
| Booking wizard (`book.v9.js`) | Card deposit or WhatsApp text only | `book.v10.js`: request with folio (no charge), deposit where allowed, EN/ES |
| Persistent register | **None** ("Nothing is stored; Stripe is the record") | `api/_lib/store.js`: Upstash REST, same scheme as rmcpharmacy.com and cvupharmacy (`cwc:` prefix) |

No new CRM, agenda or bot was created. QuickTurno stays the agenda; the CRM/concierge bot is reached through the same signed webhook contract cvupharmacy uses (`REQUEST_WEBHOOK_URL`).

## 2. Request and booking flow
```
Visitor ─▶ wizard (service, preferred date/time, minimum data)
          ├─ "Send request" ─▶ POST /api/request ─▶ folio CWC-XXXX-XXXX
          │      ├─ register (encrypted contact data, 90-day retention)
          │      ├─ team email (Resend) · CRM webhook · internal WhatsApp (folio only)
          │      ├─ client receipt email (if given): "received, pending confirmation"
          │      └─ answer: received ONLY if stored or a team channel accepted it; otherwise "not registered" + WhatsApp/phone
          └─ "Pay deposit" (house call, IV, optional for clinic) ─▶ /api/request intent=pay (folio, team told "deposit started")
                 ─▶ POST /api/checkout (folio, idempotency key, 70-min expiry) ─▶ Stripe ─▶ /thanks/?ref=folio
                 ─▶ webhook (signed) ─▶ register "paid" ─▶ QuickTurno ─▶ email
Daily 15:00 UTC: /api/reconcile ─▶ re-sends failed notices, digest of unattended requests, unpaid checkouts, orphan payments, disputes
```
Statuses: `received` (request received) → `confirmed` (availability confirmed by the team, manual today) → `payment_pending` → `paid` / `payment_failed` / `payment_expired` → `completed` / `cancelled` / `refunded` / `disputed`. The public site only ever says "received, pending confirmation" until the team confirms.

Concurrency/double booking: there is no shared live calendar yet, so availability is **confirmed manually** (V6 §12 fallback). Duplicates are blocked for 15 minutes (same phone + service + date → same folio); a double click on "pay" reuses the same Stripe session (idempotency key = hash of the request).

## 3. Payment rules in code
| Service | Online charge | Why |
|---|---|---|
| Clinic visit $99 | Optional 50% deposit; default is pay at the clinic | V6 §7: never require prepayment from walk-ins |
| House call $189, IV $159/$169 | 50% deposit (current approved policy) or request first | Existing approved flow |
| Video $59 | **No** (request → team sends payment instructions) | Stripe lists telemedicine as prohibited for Mexican accounts (V6 §13) |
| NAD+ $279, Total Wellness $189 | No (request) | New online charges need approval; Total Wellness hidden until confirmed |
| Lab, X-ray, nursing, IV groups | No (quote) | Price after medical/provider review |

- 100% charge after confirmation: prepared (`PAYMENT_FULL_APPROVED=yes`), **off**.
- Amount and currency are computed on the server from `api/_catalog.json`; client-sent prices are ignored (tested).
- Stripe receives: folio, service name, total, date/time, name, phone, location. **Never** notes, symptoms, results or ad click ids.

## 4. Environment variables (Vercel → Settings → Environment Variables)
| Variable | Production | Preview | Notes |
|---|---|---|---|
| `STRIPE_SECRET_KEY` | live key | **test key (`sk_test_…`)** | Check Preview is not using the live key before any preview test |
| `STRIPE_WEBHOOK_SECRET` | live endpoint secret | test endpoint secret | |
| `RESEND_API_KEY`, `NOTIFY_EMAIL`, `NOTIFY_FROM` | existing | a test inbox | |
| `TURNO_WEBHOOK_URL`, `WEB_PAYMENT_SECRET`, `TURNO_ORG_SLUG` | existing | leave empty (avoid test entries in the real agenda) | |
| `ULTRAMSG_*`, `NOTIFY_WHATSAPP` | existing | empty | |
| `KV_REST_API_URL`, `KV_REST_API_TOKEN` | **set 2026-11-26**: Upstash `cwc-requests` (Free) via Vercel Marketplace | same database | keys `cwc:` (production) and `cwc:preview:` (preview) |
| `REQUEST_ENCRYPTION_KEY` | **set 2026-11-26** (generated, never displayed) | set, different value | losing it makes stored contact data unreadable |
| `CRON_SECRET` | **set 2026-11-26** | set | Vercel sends it to `/api/reconcile` |
| `REQUEST_WEBHOOK_URL`, `REQUEST_WEBHOOK_SECRET` | optional: CRM / concierge bot | empty | |
| `PAYMENT_FULL_APPROVED` | leave unset until approved | unset | |

Without the register variables the site still works: requests are emailed and answered honestly ("received" only if the email was accepted); idempotency then relies on Stripe and Resend keys.

## 5. Stripe dashboard
**Done 2026-11-26** (destination we_1UX3ro5W1RAXluyqgbn1Kc1U now listens to 6 events). Note: the same Stripe account also has a destination to quickturno.app; check QuickTurno does not create a second entry for the same payment. Events added: to the existing webhook endpoint `https://www.cabowalkinclinic.com/api/stripe-webhook`: `checkout.session.async_payment_failed`, `checkout.session.expired`, `charge.refunded`, `charge.dispute.created` (keep `checkout.session.completed` and `checkout.session.async_payment_succeeded`).
Verify in Stripe: legal entity, country, declared business activity and that medical services billed are within the account's accepted activities; settlement rules for services delivered by third parties (lab, X-ray).

## 6. Recovery when something fails
| Failure | What happens | What the team does |
|---|---|---|
| Resend down | Request still stored; queued in `idx:notify-retry`; daily job re-sends | Check the daily digest |
| Register (Upstash) down | Request emailed; patient told "received" only if the email was accepted | None |
| Register and email down | Patient told it was **not** registered and offered WhatsApp/phone | None (nothing lost silently) |
| QuickTurno down | Webhook falls back to direct WhatsApp + email; Stripe retries only the failed channel | Enter the booking manually |
| Webhook down | Stripe retries up to 3 days; payments remain in Stripe | Stripe dashboard → Payments filtered by folio |
| Payment without a request | Email flagged `[NO FOLIO]`; listed in the digest | Match by name/phone in Stripe |

## 7. Pending integrations
- Shared live calendar with locking (QuickTurno API) to replace manual confirmation.
- Team panel to change statuses (today: QuickTurno + email). See `V6_ADMIN_PANEL_PROPOSAL.md`.
- Laboratorios Santa Fe catalog (when formalized), radiology provider catalog (when documents arrive).
- Secure results delivery (signed, expiring links from a private store) — not built: no results are handled by the site today.
