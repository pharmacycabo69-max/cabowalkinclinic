# Pending business data and conflicts — Cabo Walk-In Clinic

Source of truth: Prompt Maestro V3.1 (2026-11-24) plus owner answers in session. Nothing here is published until it is approved.

## Decisions needed from the owner
| # | Item | Conflict / gap | Current dev state | Blocks |
|---|---|---|---|---|
| D1 | **IV drip prices** | V3.1 §2: "IV Therapy 159". Owner in chat (2026-11-24, before V3.1): Hydration and Recovery $159, other drips $169 (tax included). Production and dev both charge $159/$169. | Unchanged ($159/$169) | Publishing |
| D2 | **NAD+ price** | V3.1: $279. Site and chatbot: $189 (not bookable online). | Unchanged, flagged | NAD+ copy |
| D3 | **Special drips** (Flu Rescue $199, Detox $189, Headache Rescue $169, Mega Myers $279, Post-Flight) | Not confirmed in V3.1; need medical and price validation | Unchanged on legacy pages | Phase 2 |
| D4 | **$50 fixed deposit** | Proposed in a screenshot, not confirmed. Today: 50% deposit. | Unchanged (50%) | Checkout |
| D5 | **Travel Wellness Panel** | $149 (site) vs $249 (earlier reference) | Unchanged, flagged | Lab page |
| D6 | **House call $189** | Relayed from the owner by another session; matches V3.1 | **Changed in dev** (copy + `api/_prices.json` + booking v8). Production still charges $199. | Owner approval to publish |
| D7 | **Clinic hours 9:00–17:00** | Google Business Profile shows closing at 10 PM | Site changed in dev | **Update GBP hours to match before publishing** |
| D8 | **08:00–09:00 window** | Coverage not confirmed | Not advertised | — |
| D9 | **cabobaymedical.com** | Same physician and cédula, old copy of our site | Not referenced | Owner: is it ours? |
| D10 | **Luis Antonio Camacho Villegas** | Title pending (owner said "Técnico Radiólogo" in chat; V3.1 says pending) | Shown with cédula only, as an external imaging collaborator | Title proof |
| D11 | **Radiology catalog** | Equipment, location (clinic vs portable), modalities, price, result time, interpreting physician | Page kept as a **noindex draft** | Catalog 25/11 |
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
