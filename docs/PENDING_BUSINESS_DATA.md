# Pending business data and conflicts — Cabo Walk-In Clinic

Source of truth: Prompt Maestro V3.1 (2026-11-24) plus owner answers in session. Nothing here is published until it is approved.

## Decisions needed from the owner
| # | Item | Conflict / gap | Current dev state | Blocks |
|---|---|---|---|---|
| D1 | **IV drip prices: RESOLVED 2026-11-25** | Owner confirmed in this session: Hydration and Recovery $159, all other drips $169, USD tax included (RMC list does not apply) | Same in production (7a40177) and dev | — |
| D2 | **NAD+ price: RESOLVED $279** | Owner confirmed 2026-11-25 (matches V3.1) | Dev: NAD+ pages, chatbot and menus at $279 (not bookable online) | — |
| D3 | **Special drips** (Flu Rescue $199, Detox $189, Headache Rescue $169, Mega Myers $279, Post-Flight) | Not confirmed in V3.1; need medical and price validation | Unchanged on legacy pages | Phase 2 |
| D4 | **$50 fixed deposit** | Proposed in a screenshot, not confirmed. Today: 50% deposit. | Unchanged (50%) | Checkout |
| D5 | **Travel Wellness Panel** | $149 (site) vs $249 (earlier reference) | Unchanged, flagged | Lab page |
| D6 | **House call: RESOLVED $199** | Owner confirmed "$199" directly in this session (2026-11-25), cancelling the earlier $189 | Dev reverted to $199 (copy, schema, booking v8, `api/_prices.json`) = same as production; checkout unchanged | — |
| D7 | **Clinic hours 9:00–17:00** | Google Business Profile shows closing at 10 PM | Site changed in dev | **Update GBP hours to match before publishing** |
| D8 | **08:00–09:00 window** | Coverage not confirmed | Not advertised | — |
| D9 | **cabobaymedical.com** | Owner confirmed 2026-11-25: **not ours**. Third party showing our physician and cédula and our earlier copy | Not referenced on our site | Case file kept **outside the public repo** (owner has it); attorney review |
| D10 | **Luis Antonio Camacho Villegas** | Title pending (owner said "Técnico Radiólogo" in chat; V3.1 says pending) | Shown with cédula only, as an external imaging collaborator | Title proof |
| D11 | **Radiology** | Owner asked to publish it without prices (X-ray at the clinic and the hotel, confirmed by the owner earlier) | `/radiology-x-ray-cabo-san-lucas/` indexable, in nav and sitemap, quote via WhatsApp | Catalog details (equipment, result times) when available |
| D12 | **Laboratorios Santa Fe catalog** | Not received | Not published | Catalog 25/11 |
| D13 | **Aesthetic medicine** (4 categories) | Techniques, prices, authorized photo of Dra. Rosibel | Not published | Data + photo |
| D14 | **Dra. Myriam Aisse Palacios Alarcón** | Updated constancia requested; photo is low-res (202 px) | Published as physician "subject to availability" | Constancia + better photo |
| D15 | **Aviso de funcionamiento** | Full document and acuse requested; site shows only the number | Footer: "Aviso de funcionamiento 2603045036X00153" (no COFEPRIS claim) | Document |
| D16 | **Refund policy** | Page shows "Draft: confirm the exact terms…" text publicly | Unchanged | Owner terms |
| D17 | **Insurance secure channel** | No private upload channel exists | CTA = generic WhatsApp; no documents requested publicly | Secure channel design |
| D18 | **Alternate phones** +52 624 267 3177 / 318 6477 | Not on the site; bot only on 226 1023 | Not added | Owner: show them? |

## Confirmed and applied in dev (V3.1)
- Prices tax included: video $59, clinic $99, house call $189.
- Clinic Mon–Sun 9:00–17:00. After-hours visits 17:00–08:00 by appointment, subject to doctor confirmation. No 24/7 claims and no arrival-time promises.
- Address: Francisco I. Madero S/N, Centro, 23450, between Vicente Guerrero and Miguel Hidalgo.
- Team:
  - Dr. Kevin González Adame, Médico Cirujano y Partero, cédula 14796516.
  - Dra. Myriam Aisse Palacios Alarcón, Médico General, cédula 11664989.
  - Dra. Rosibel Núñez Rojo, Médico Cirujano (UAG), cédula 7408277, responsable sanitaria (full profile allowed on this domain per §3.1).
  - Lic. Jenifer Alexandra Arciga Acosta, Lic. en Radiología e Imagenología, cédula 13435891, external collaborator.
- Insurance: US and Canada health and travel insurance accepted, subject to verification. Mexican national insurance not accepted.

## Decisions relayed by other sessions (2026-11-24)
**Withdrawn 2026-11-25:** the "Unify Cabo Walk-In Clinic prices" session reports that RMC decisions D11–D17 apply **only to RMC**, not to Cabo Walk-In Clinic. Kept below for traceability; **do not apply here**. IV prices for this clinic stay as the owner instructed in this session ($159 Hydration and Recovery, $169 others, tax included; production since 7a40177).
| # | Relayed decision (RMC only) | Current dev state |
|---|---|---|
| D19 | IV at home $159; IV in clinic (Recovery) $129 | Dev: Recovery $159; no in-clinic IV prices |
| D20 | NAD+ $279 at home and in clinic | Dev: $189 on legacy pages (D2) |
| D21 | Multivitamin IV $189 at home / $154 in clinic | Not on this site |
| D22 | IV groups 3+: $139 per person | Main shows "groups of 6 or more pay $119 per person" |
| D23 | Delivery 7:00–23:00 daily (replaces V3.1 08:00–23:30); never 24/7 | Delivery hours not shown on this site |
| — | House call $189 | **Applied in dev** (D6) |

## Added 2026-11-25
| # | Item | Status | Dev state | Blocks |
|---|---|---|---|---|
| D24 | **Locations / pharmacies** | Owner 2026-11-25: **no pharmacy or locations content on this site** | `/locations/` removed with all its links; RMC data not used here | — |
| D25 | **301 redirects for the 110 legacy WordPress pages** | Mapping in `docs/REDIRECT_MAP.csv` and `vercel.json`; HTML files kept for rollback | In dev only | Owner OK + **check that no Google Ads final URL points to a legacy URL** (a 301 keeps the visit, but Ads may flag a destination mismatch) |
| D26 | **Aesthetic medicine page** | Owner asked to add it "without affecting Ads" | `/aesthetic-medicine-cabo/` indexable, linked only from footer and About (not from home or service landing pages), no brand names, prices or techniques | Authorized photo of Dra. Rosibel; keep it out of Google Ads |
| D27 | **Core Web Vitals field data** | PageSpeed API daily quota exhausted 2026-11-25; local lab weight only | — | Re-run PSI or use Search Console CWV |
| D28 | **Lab tests page** | Rebuilt without prices ($149/$99/$129/$159/$119 removed) and without the "24–48 h results" or "no referral" claims | Quote-based | Santa Fe catalog, then publish confirmed prices |
| D29 | **Real photos** | Lab and nursing images are illustrative (AI-style stock), not real staff | In use | Owner: real photos of the clinic, team, lab draw and X-ray |
| D30 | **Review avatars** | Initial-letter avatars instead of reviewers' Google photos (third-party personal images need consent) | In use | — |
