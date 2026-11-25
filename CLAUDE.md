# Cabo Walk-In Clinic — project rules

Static site (HTML + Vercel serverless `api/`), deployed by Vercel from `main` of the **public** GitHub repo `pharmacycabo69-max/cabowalkinclinic`. Pushing `main` = publishing to production.

## Source of truth
- Prompt Maestro V3.1 (2026-11-24) plus `docs/BUSINESS_MASTER_DATA.json` and `docs/PENDING_BUSINESS_DATA.md`.
- Owner-confirmed data wins. Unresolved conflicts stay unpublished.

## Hard rules
- Never push to `main` or deploy without explicit owner approval. Work on a `dev/*` branch.
- Prices: USD, tax included. Checkout prices live in `api/_prices.json`. The booking wizard (`assets/book/book.v*.js`) must match. Never change charges without owner approval.
- Hours: clinic 9:00–17:00 daily. After-hours visits 17:00–08:00 by appointment, subject to doctor confirmation. Never write "24/7", "immediate availability" or arrival-time promises. The partner hospital's "24/7 emergency" is the only exception.
- Insurance: US and Canada health and travel insurance accepted **subject to verification**. Never promise coverage, direct billing, reimbursement or no deductible. Never name insurers as partners. No Mexican national insurance. Never ask for policy documents in public forms, URLs or analytics.
- **Dra. Rosibel Núñez Rojo (§3.1):** her full profile (title, UAG, cédula 7408277, photo once authorized) is allowed on this domain, plus her role as responsable sanitaria of this clinic only. Keep her data out of the other five brands.
- Credentials: show only the name, title, cédula and role confirmed by the owner. Never publish a CURP, signatures, QR codes or documents. Jenifer Arciga is a Licenciada (not a medical specialist). Luis Camacho is a Técnico Radiólogo.
- No COFEPRIS certification claims or official seals. Show the aviso de funcionamiento number only.
- Radiology, lab and aesthetics pages are published (owner request) but quote-based: no prices, techniques or result times until the owner confirms them. Aesthetics is linked only from the footer and About, never from Ads landing pages. No pharmacy or locations content on this site.
- `/assets/` is cached for a year (immutable). Change a file's **name** (`.vN`) whenever you change its content, and update every page that references it.
- `_drafts/`, `docs/` and `CLAUDE.md` are excluded from deploy (`.vercelignore`). The repo is public: never commit costs, margins, patient data or secrets.
- Windows: 4 legacy files have `?` in their names; the checkout uses sparse-checkout to skip them (`git -c core.protectNTFS=false ...` if git complains).
