# Public audit — cabowalkinclinic.com — 2026-11-25 (V4)

Branch: `dev/v4-redesign` (from `origin/main` d8c760a). Production untouched.
Baseline evidence: `docs/design-before-after/before/*.jpg` (26 full-page captures, 390 px + 1440 px), `docs/SEO_ADS_BASELINE_prod_2026-11-25.csv` (146 routes: 36 × 200, 110 × 308). After: `docs/design-before-after/after/`, `docs/SEO_ADS_AFTER_dev_2026-11-25.csv`.
Tests: `node tools/test.mjs` → **551 passed, 0 failed**.

## Findings matrix

| ID | Pri | URL / file | Evidence (reproduced) | Impact | Change | Status |
|---|---|---|---|---|---|---|
| F1 | P0 | site-wide, `api/_prices.json`, `book.v8.js` | House call shown and charged $199; V4 policy $189 | price contradiction vs V4 | $189 in checkout, wizard v9, 44 pages, schema | implemented, tested — owner confirmed $189 on 2026-11-25 |
| F2 | P0 | `book.v8.js` chatbot | Bot listed in-clinic IV $129–$159 "+ impuestos" and groups $119 (EN said tax included) | contradictory/unconfirmed prices | bot rewritten: tax included, IV from $159, NAD+ $279, groups/lab/X-ray/aesthetics = quote | implemented |
| F3 | P0 | /iv-therapy/, /hangover-…/, /immune-boost-…/, /iv-therapy-san-jose-del-cabo/ | "Groups of 6+ pay $119", "$129 at our clinic"; hangover FAQ schema said $159 while page says $169 | unconfirmed prices, schema ≠ page | replaced with "group pricing is quoted on request"; FAQ schema regenerated from visible text | implemented, tested |
| F4 | P0 | `api/checkout.js` | free-text booking "notes" sent to Stripe metadata | health data in payment metadata (V4 §4/§10) | notes no longer sent to Stripe; field relabelled "Access notes… share symptoms with the doctor, not here" | implemented, tested (mock) |
| F5 | P0 | `track.v2.js` | `whatsapp_click` sent full wa.me URL incl. `?text=` (may contain symptoms) to gtag/dataLayer | health text to Ads/Analytics | `track.v3.js` sends `wa.me/<number>` only, phone as `tel` | implemented, tested |
| F6 | P0 | / and /walk-in-clinic-doctor-cabo-san-lucas/ | Visible FAQ text "{1}Yes. We accept…" (template artifact) | trust | removed (page + schema) | implemented |
| F7 | P0 | /after-hours-weekend-doctor-cabo/ | heading "Around the clock, across Los Cabos" | 24/7-type claim | "After hours by appointment, across Los Cabos" | implemented |
| F8 | P0 | /radiology-x-ray-cabo-san-lucas/, /x-ray-imaging-cabo/ | Portable X-ray at hotels offered as available | V4 §5: not before equipment/scope/permits are validated | clinic first; portable "on request, subject to confirmation" | implemented — **validation pending** |
| F9 | P0 | /about/ | Rosibel team card with university + cédula outside aesthetics | V4 §6.1 | card now: role + link to aesthetics; cédula stays in legal/licences | implemented, tested |
| F10 | P0 | 8 pages | AI-generated reception image with alt "Reception of Cabo Walk-In Clinic" | presents a non-real photo as the clinic | alt → "Illustrative image of a clinic reception desk"; real photos requested | partial — **real photos needed** |
| F11 | P1 | `book.v8.js` | GSAP loaded from cdnjs: infinite CTA pulse, shine, ring; renders blank in captures | heavy animation, artificial urgency, 3rd-party JS | removed in v9; subtle CSS reveal instead | implemented |
| F12 | P1 | header (36 pages) | 9 flat nav links, no phone, no hours, no location, no ES | navigation/IA | V4 header: Services menu, Doctors, Insurance, Location, Español, Book Visit; utility bar with posted-hours status, address, phone | implemented |
| F13 | P1 | / | Hero = Arch photo, no address/hours, single CTA | clinic-first positioning (V4 §5.1) | new hero with real doctor photo, address, hours, Book / Directions / WhatsApp; chips; price board; comparison; credentials; location | implemented |
| F14 | P1 | site-wide | No Spanish pages, no hreflang | EN/ES equivalence | 6 ES pages + reciprocal hreflang + sitemap | implemented (more ES pages = P2) |
| F15 | P1 | /contact/ | thin (217 words), no map/directions | local SEO, conversion | rebuilt: clinic card, price board, location with click-to-load map, taxi tip, what to bring, coverage, FAQ | implemented |
| F16 | P1 | team | universities missing (IPN, Xochicalco, ITEC) | E-E-A-T | added on home, About, ES pages | implemented |
| F17 | P1 | /wp-json/ | stale WordPress JSON served | indexing noise | already `X-Robots-Tag: noindex` (2026-11-24) | done earlier |
| F18 | P2 | thin pages | ES video (150 words), legal pages | content depth | — | pending |
| F19 | P2 | CWV | no field data access; Lighthouse not run in this pass | — | page weight: removed GSAP (~70 KB) and kept fonts self-hosted (52 KB serif) | pending measurement |

## Not done / blocked (with evidence)
- **Real photos** of entrance, reception and consultation room: none in the repo; the storefront image `0C1597E6…jpg` shows "9:00 AM – 9:00 PM" and garbled text → not usable as authentic.
- **Google Ads / GSC / GA4 / GTM access:** not available to Claude. Ads tag `AW-16881895258` and `track.v3.js` verified on all 42 live pages; conversion `LABELS` in track script are empty (owner to paste). GTM loader `3a56060127de.js` contains placeholder `[GTM_ID]` and is only present inside HTML comments.
- **SEP cédula verification:** registry requires an interactive search; not automated. Owner to confirm or send constancias (Myriam: updated constancia requested by V4).
- **Laboratorios Santa Fe catalogue:** not fetched in this pass; lab page stays quote-based.
