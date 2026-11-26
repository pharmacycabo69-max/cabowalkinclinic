# V6 test results — 2026-11-26 (branch dev/v6-platform)

## Automated suite: `node tools/test.mjs` → **872 passed, 0 failed**
All external services are **simulated** (Stripe, Resend, CRM webhook, QuickTurno, UltraMsg, Upstash in-memory). A green test proves our code path, **not** that the real integration is configured.

| V6 §27 case | Covered by | Type |
|---|---|---|
| Walk-in patient | catalog `optional`; checkout never required; wizard "pay at the clinic" | automated + manual UI |
| House call | request flow, deposit 9450 cents, location required | automated |
| Night request | wizard accepts any date; copy says online requests 24/7, visits by availability | manual UI |
| Service unavailable | manual confirmation (no live calendar); status stays "received" until the team confirms | design (documented) |
| IV individual / group | IV deposit allowed; IV group is quote-only, never charged | automated |
| X-ray / lab | quote-only, never charged; no CT/MRI/ultrasound offer; no own-facility claim (incl. schema) | automated |
| Insurance verification | free request, no policy numbers asked | automated + UI |
| Hotel / concierge request | partner form → folio; company required | automated + UI |
| Duplicate booking | same phone+service+date within 15 min → same folio; double "pay" → same Stripe session | automated |
| Successful payment (test mode) | webhook paid → one QuickTurno entry + one email | **simulated** |
| Failed / cancelled payment | async_payment_failed, checkout.session.expired → team alert | simulated |
| Refund / dispute | charge.refunded, charge.dispute.created → notice + register status | simulated |
| Duplicate or invalid webhook | duplicate event ignored; bad signature / other secret → 400; retry only re-sends failed channel | automated |
| Payment without request | `[NO FOLIO]` flag + daily digest | simulated |
| CRM / email / WhatsApp down | stored + queued; honest "saved, not delivered"; daily retry | simulated |
| Notice recovery | `/api/reconcile` re-sends from the persistent queue | simulated |
| Tampered data | client price ignored; unknown/internal service rejected; HTML stripped; past dates rejected; honeypot; rate limit 8/h/IP | automated |
| Translations | `/es/reservar/`, wizard confirmations and errors in Spanish | automated + UI |
| Privacy | no notes/ad ids to Stripe; internal WhatsApp folio-only; contact data encrypted; nothing to ad platforms | automated |
| Security | signature verification, CRON_SECRET, no secrets in repo | automated + review |

## Manual checks (local server, 375 px)
- `/es/reservar/?service=clinic-consult`: full wizard in Spanish; review shows "Solicitar cita · pago en la clínica" first and the deposit as optional.
- Without the API (static server) the wizard shows "No pudimos registrar tu solicitud" with WhatsApp/phone — never a false confirmation.
- `/home-doctor/` modal with a simulated API: folio `CWC-TEST-2345`, status "received, pending confirmation… nothing has been charged".
- `/hotel-concierge-medical-partnerships/`: renders; mobile bar Book · WhatsApp · Call · Directions.

## Verified on the Vercel preview (2026-11-26, `vercel curl` with protection bypass)
- `/`, `/book/`, `/es/reservar/`, `/hotel-concierge-medical-partnerships/`, `track.v4.js`, `book.v10.js` → 200.
- `/aesthetic-medicine-cabo/` and `/aesthetic-medicine-cabo` → **410** with the "no longer offered" page.
- `/english-speaking-doctor-pedregal-quivira/` → 308 to `/home-doctor/`.
- `/api/reconcile` without the secret → 401.
- `/api/request` with no register and no channel configured in Preview → **503 "not_registered"** (honest, no false confirmation); invalid input → 400.
- `/api/checkout` video → 303 to the request flow (never Stripe); house call → WhatsApp fallback because Preview has **no Stripe key at all** (all payment variables are Production-only, so the preview cannot create real charges).
- New variables set by Claude with the owner's CLI session (values generated locally, never displayed): `REQUEST_ENCRYPTION_KEY` and `CRON_SECRET`, different values for Production and Preview.

## Not verified (needs the owner or real accounts)
- Register: there is no Upstash database on the Vercel team yet (no marketplace installation; the sister sites' database is not connected to this team). Creating one requires accepting Upstash/Vercel terms.
- That a real notice reaches the team inbox/WhatsApp (needs a preview with test credentials and someone to confirm receipt).
- Stripe test-mode payment end to end (needs the Preview environment to use `sk_test_` keys — not confirmed).
- Field Core Web Vitals (INP) — only lab numbers below.

## Lab performance (mobile emulation, 4× CPU, local server, no CDN)
| Page | LCP | CLS | TBT |
|---|---|---|---|
| / | 2.42 s | 0 | 72 ms |
| /book/ | 1.06 s | 0 | 162 ms |
| /es/reservar/ | 0.91 s | 0 | 111 ms |
| /hotel-concierge-medical-partnerships/ | 0.89 s | 0 | 224 ms |
| /home-doctor/ | 1.30 s | 0 | 471 ms |
Booking script grew from 25 KB to 37 KB (bilingual strings); it is loaded at the end of the page. Home LCP is close to the 2.5 s target in this throttled lab run (2.13 s in V4); field data after publishing decides.
