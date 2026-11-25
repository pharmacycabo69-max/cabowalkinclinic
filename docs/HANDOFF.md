# HANDOFF — Cabo Walk-In Clinic (Prompt Maestro V3.1)

- **Project:** cabowalkinclinic (GitHub `pharmacycabo69-max/cabowalkinclinic`, public repo, Vercel deploys `main`).
- **Master document:** Prompt Maestro V3.1, 2026-11-24.
- **Starting commit:** `5f1f249` (local, radiology page, never pushed). Production = `origin/main` `d6310a9`.
- **Work branch:** `dev/prompt-v3-1`, in worktree `../CaboWalkInClinic-dev`. It is isolated from the main folder, which another session also uses.
- **Status:** phases A (inventory + competitor audit) and D (P0 implementation in dev) done; E (QA) partial. **Nothing published.**

## Sources consulted
- Repository files.
- Live site.
- Google Business listing (public Maps view).
- 10 competitor sites (read-only).
- Web searches for 13 other references.
- Owner answers in session, including one relayed by session "Unify Cabo Walk-In Clinic prices".

## What changed in dev (`git log dev/prompt-v3-1`)
1. **Hours and availability (P0):** clinic 9:00–17:00. After-hours visits 17:00–08:00 by appointment, subject to doctor confirmation. Removed every "24/7" claim except the partner hospital's ER. Removed arrival-time promises ("~45 min", "within the hour", "30–45 min"). Schema hours are 09:00–17:00.
2. **House call stays $199** (owner final decision; an earlier $189 was reverted). IV prices confirmed by the owner: $159 Hydration and Recovery, $169 other drips, tax included. Beauty Glow description fixed from $189 to $169. NAD+ pages still $189, pending D2.
3. **Team:**
   - Dr. Kevin González Adame (Médico Cirujano y Partero).
   - Dra. Myriam Aisse Palacios Alarcón (backup, subject to availability).
   - Dra. Rosibel Núñez Rojo (Médico Cirujano, UAG, responsable sanitaria; §3.1 allows the full profile here).
   - Imaging collaborators: Lic. Jenifer Arciga, and Luis Camacho (title pending).
4. **Compliance:** the footer shows "Aviso de funcionamiento 2603045036X00153" with no COFEPRIS claim. Removed "COFEPRIS registration" wording. The live "available" badge is now static ("Video consultations"). "Doctors on duty" became "Our doctors".
5. **Insurance (§2.1):**
   - New `/insurance-billing-cabo/`: "International Health & Travel Insurance Accepted — Subject to Verification". It includes the verification steps and statuses, accepted vs not accepted, self-pay prices, a Spanish block and 6 FAQs.
   - Home band, booking panel and FAQ, contact section, chatbot answers (EN/ES) and a site-wide FAQ update.
   - Removed insurer brand lists and "we do not bill" claims. CTA "Verify My Insurance" opens WhatsApp with a generic message; no documents are requested publicly.
6. **Radiology:** `/radiology-x-ray-cabo-san-lucas/` is a **noindex draft**, out of the nav and sitemap. The imaging page uses "we coordinate" wording again.
7. **Assets versioned** (old ones are cached as immutable for a year): `book.v8.js`, `site.v3.css`, `1e71168b135c.v2.js`, `10bc88080fc1.v2.js`.
8. **Docs** (`docs/`, excluded from deploy via `.vercelignore`): URL_INVENTORY.csv, COMPETITOR_MATRIX.csv, COMPETITOR_AUDIT.md, PENDING_BUSINESS_DATA.md, BUSINESS_MASTER_DATA.json, QA_REPORT.md and this file. Plus `CLAUDE.md`.

## Added 2026-11-25
- NAD+ $279 (owner).
- New `/locations/` page (clinic + 3 RMC stores; Celeste and Ocean pending D24), linked in nav, footer, home and sitemap.
- Aesthetic medicine draft page (noindex).
- Proposed 301s for the 110 legacy pages (`docs/REDIRECT_MAP.csv`, `vercel.json`).

## Decisions waiting on the owner
See `PENDING_BUSINESS_DATA.md`. The most urgent:
- **D9:** is cabobaymedical.com part of the network?
- **D1/D2:** IV and NAD+ prices.
- **D7:** update the Google Business hours to 9–17 before publishing.
- **D6:** resolved, house call $199 (no checkout change).
- **D16:** refund terms.

## Next tasks (in order)
1. Owner approves → push `dev/prompt-v3-1`, review the Vercel **preview** URL, and test Stripe in test mode at $189.
2. Merge to `main` (production) only after approval.
3. Load the lab and radiology catalogs (25/11) as drafts, then publish what is validated.
4. Aesthetic medicine section (4 categories, Rosibel profile per §3.1) once the photo and data are approved.
5. Phase 2: rebuild or 301 the 110 legacy noindex pages. Measure the CWV baseline. Finish the Maps check of the 4 pending competitors, plus The Drip Spa and Pure Cabo.

## Rollback
- **Production:** nothing to roll back.
- **Branch:** `git branch -D dev/prompt-v3-1` and `git worktree remove ../CaboWalkInClinic-dev`.
- **Local `main`:** still has the unpushed commit `5f1f249` (radiology). Do not push `main` before review.
