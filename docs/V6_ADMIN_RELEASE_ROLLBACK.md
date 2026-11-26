# V6 — Team panel proposal, release plan and rollback (2026-11-26)

## 1. Team panel (proposal, not built — P2)
No central management system exists in the sister projects beyond QuickTurno (agenda + WhatsApp) and the Upstash registers of rmcpharmacy/cvupharmacy. Recommendation: **extend QuickTurno** (or one shared panel for all brands) instead of a CWC-only CRM.

| View | Source | Roles |
|---|---|---|
| New requests / unattended | register `idx:requests` (status `received`) | owner, admin, concierge |
| Agenda | QuickTurno | owner, admin, doctor |
| Payments, refunds, disputes | register `pay` + Stripe | owner, admin |
| Quotes (lab, X-ray, nursing, IV groups) | register (status + quote amount) | owner, admin |
| Assigned doctor | QuickTurno | owner, admin, doctor |
| Providers (radiology, lab) | private directory (not in this repo) | owner |
| Notification health | `idx:notify-retry`, daily digest | owner, admin |

Rules: real authentication (not `noindex`), role-based access, admin sees contact data only, clinical records live in the clinical record system (never in the register or email). Until it exists, status changes are made in QuickTurno and the daily digest lists folios only.

## 2. Financial structure (P2, kept private)
Fields per folio for the private ledger: gross, processing fee, physician cost, provider cost, supplies, travel, advertising, refunds → contribution margin. Internal costs and margins must never be stored in this public repository or in `_catalog.json`. A template is in `.private/v6/` (local, not committed).

## 3. Release plan (needs owner approval)
1. Owner sets the new Vercel variables (Production and Preview separately) — see `V6_BOOKING_PAYMENTS_NOTIFICATIONS.md` §4 — and confirms Preview uses Stripe **test** keys.
2. Owner signs in and checks the preview `https://cabowalkinclinic-git-dev-v6-platform-cabo-pharmacy.vercel.app/`: send one test request (name "PRUEBA V6") and confirm the email/WhatsApp arrived; one Stripe test payment with card 4242 4242 4242 4242 if Preview uses test keys.
3. Owner adds the 4 extra events to the Stripe webhook.
4. `node tools/test.mjs` must pass; fast-forward `main` to the approved commit.
5. After deploy: check `/`, `/book/`, `/es/reservar/`, `/aesthetic-medicine-cabo/` (410), `/api/reconcile` (401 without secret), send one real request marked as a test and confirm receipt. No real charge.

## 4. Rollback
- Production before V6: commit `829750b` (tag `rollback/prod-2026-11-26`, local).
- Fastest: Vercel → Deployments → previous production deployment → "Promote to Production" (instant, no git change).
- Git: `git push origin 829750b:main --force-with-lease` only with owner approval (rewrites `main`); safer alternative is a revert commit of the V6 merge.
- Data: the register keys (`cwc:*`) can stay; the old code ignores them. Stripe payments are unaffected.
