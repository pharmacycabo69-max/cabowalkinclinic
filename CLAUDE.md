# Cabo Walk-In Clinic — project rules

Static site (HTML + Vercel serverless `api/`), deployed by Vercel from `main` of the **public** GitHub repo `pharmacycabo69-max/cabowalkinclinic`. Pushing `main` = publishing to production.

This domain is the institutional brand for **general medicine**: walk-in clinic, house calls, video visits, diagnostics coordination (V6, 2026-11-26).

## Source of truth
- Prompt V6 (2026-11-26) > V4 > V3.1. Owner-confirmed data wins. Unresolved conflicts stay unpublished.
- **Master catalog: `api/_catalog.json`** (prices, payment mode, groups). Checkout, `/api/request` and the wizard read it; after any change run `node tools/catalog.mjs`. Never put internal costs or margins in it (public repo).

## Hard rules
- Never push to `main` or deploy without explicit owner approval. Work on a `dev/*` branch.
- Prices (V6): video $59, clinic $99, house call $189, IV $159 standard / $169 others (owner 2026-11-24), NAD+ $279, Total Wellness IV $189 hidden until confirmed; nursing, lab, X-ray, IV groups by quote. USD, tax included. Never change charges without owner approval.
- Payments (V6 §13): clinic visits never require prepayment; deposit 50% (100% prepared behind `PAYMENT_FULL_APPROVED`, off); **video consultations are never charged with Stripe** (telemedicine prohibited for MX accounts); quotes never charged online. Amounts only server-side.
- Hours: clinic 9:00–17:00 daily. After-hours by appointment, subject to doctor confirmation. "24/7" only for **online requests** ("We receive online requests 24/7"), never for care. No "immediate" or arrival-time promises.
- Requests: every request gets a folio; say "received, pending confirmation" only when it was stored or a team channel accepted it.
- Insurance: US and Canada insurance **subject to verification**. Never promise coverage, direct billing or reimbursement. Never ask for policy documents in public forms, URLs or analytics.
- **Aesthetic medicine is retired from this brand** (V6 §3): `/aesthetic-medicine-cabo/` answers 410; no aesthetics content, links, schema or Ads. Do not redirect it to unrelated pages.
- Team (V6 §8): Dr. Kevin González Adame (operating physician, IPN, 14796516); Dra. Myriam Palacios (Xochicalco, 11664989, availability confirmed when booking); Dra. Rosibel Núñez Rojo (responsable sanitaria, UAG, 7408277 — shown on /about/ and the legal footer only, pending official document and visibility authorization). Lic. Jenifer Arciga is a Licenciada, not a medical specialist. **Luis Camacho: no title published until verified.**
- Radiology (V6 §9): coordination with external licensed collaborators; never "our X-ray room"; portable X-ray only on request and after provider confirmation; no CT/MRI/ultrasound until formally confirmed; no specific studies or prices until the provider validates them. Lab: only confirmed tests, quote-based.
- No COFEPRIS certification claims or official seals. Show the aviso de funcionamiento number only.
- Privacy (V6 §21): never send notes, symptoms, results, the service name or chat topics to Stripe, analytics or ad platforms (`track.v4.js`). No enhanced conversions, offline imports, remarketing or customer lists. Internal WhatsApp notices carry the folio only.
- `/assets/` is cached for a year (immutable). Change a file's **name** (`.vN`) whenever you change its content, and update every page that references it. Keep the previous version file for cached pages.
- `_drafts/`, `docs/`, `tools/` and `CLAUDE.md` are excluded from deploy. The repo is public: confidential documents go to `.private/` (git-excluded), never to `docs/`.
- No pharmacy catalog, medication catalog or locations content on this site.
- Windows: 4 legacy files have `?` in their names; the checkout uses sparse-checkout to skip them.

## Workflow
- Header/footer/mobile bar: `node tools/chrome.mjs`. Ads landings: `node tools/landing.mjs` (data in `tools/landings.data.mjs`). Wizard catalog: `node tools/catalog.mjs`.
- Before any commit: `node tools/test.mjs` must pass. Integrations in tests are simulated; never call a mocked check "verified".
- Docs: `docs/V6_*.md` (architecture, tests, Ads/SEO, release/rollback, URL inventory). Owner decisions: `.private/v6/INFORME_EJECUTIVO_V6.md`.
