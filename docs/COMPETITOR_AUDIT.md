# Competitor audit — Cabo Walk-In Clinic

Prompt Maestro V3.1 §7, §12. Checked 2026-11-24. Row-level data: `COMPETITOR_MATRIX.csv`.

## Method and limitations
- 10 nominal sites were fetched read-only (home page + one services or pricing page). No forms, bookings, carts or payments were touched.
- The 13 references without a URL were searched on the web (US index). Several are not findable without Google Maps, Instagram or a link from the owner, so they are marked **pending**, not guessed.
- Not measured: traffic, rankings, ad spend, Core Web Vitals of competitors, Google Ads Transparency Center and Meta Ad Library. No authorized tooling was available in this session.
- Titles and H1s come from the fetch tool's extraction. Meta descriptions were not exposed by it.

## Status of the 23 nominal references
| Status | References |
|---|---|
| Reviewed (own site) | Sea of Cortes Medical, Get Well Clinics, HealTech, PharmaExpress, Cabo Bay Medical, Cabo Home Doctor, IV Therapy Cabo, Clearwell Pharmacy, OK DOC, Total Delivery, WeCare Pharma |
| Reviewed via secondary sources | Saint Luke's, Hospiten, Hospital H+, AMC, Berzunza MD |
| Unverified (old directories or blogs) | Cabo Medical Care, Cabo House Calls, Balboa (possibly renamed "World Class Clinic") |
| Not found, pending Maps or owner link | Cabo Nursing Care, JS Wellness, Farmacia Centro, Blue Medical Net (official page) |

Also found in the searches: **The Drip Spa**, an IV provider on Francisco I. Madero, Centro (our street), and **Pure Cabo**, a mobile IV provider. Both should be added to the next round.

## P0 finding — cabobaymedical.com
The H1 is "Premium Walk-In & Mobile Healthcare in Cabo San Lucas" and the page uses "One call covers everything in Cabo". Its structure matches the **old Cabo Walk-In Clinic copy**. It lists **Dra. Myriam Palacios Alarcón with cédula 11664989**, our physician and cédula, and shows our old price points ($59 / $200 / $119 / $80). Ownership is **not inferred**.

**Owner confirmed (2026-11-25): it is not part of the network.** A private case file with evidence and draft actions was prepared outside this public repo. Next step: attorney review.

## Price comparison (public prices, as published)
| Service | Cabo Walk-In Clinic (dev, tax included) | Competitors observed |
|---|---|---|
| Video consult | $59 | IV Therapy Cabo $49 (20 min, tax not stated); Cabo Bay $59 |
| Clinic visit | $99 | Cabo Bay $119 / $80 (inconsistent); others not shown |
| House call | **$189** (owner, 2026-11-24) | Cabo Bay $200; others not shown |
| IV drips | $159 / $169 | IV Therapy Cabo $129–$259 **+ tax**; Cabo Bay $149–$279 |

Most competitors **hide prices**. The two that show them either add tax or contradict themselves. Tax-included USD prices are a verifiable advantage.

## What competitors do well (to match, without copying)
1. **Review volume shown in context.** Sea of Cortes displays its Google rating and about 1,021 reviews.
2. **Named doctor with a cédula.** HealTech does this, and we already do.
3. **Honest scope and hours.** Cabo Home Doctor says "does not provide urgent or emergency services", which matches V3.1.
4. **On-site diagnostics visible.** Get Well Clinics and Sea of Cortes list X-ray, ultrasound and ECG. Our radiology stays a draft until it is confirmed.
5. **Insurance front and center.** Get Well promises direct billing, which we must **not** promise. We use verification instead.

## Recurring competitor weaknesses (our opening)
- "24/7" claims that contradict the clinic hours on the same site (IV Therapy Cabo, Clearwell, Cabo Bay).
- Missing or contradictory prices and review counts (HealTech, Cabo Bay).
- Several phone numbers and brand names for one operation (Sea of Cortes, Get Well).

## Prioritized actions for cabowalkinclinic
| # | Action | Impact (hypothesis) | Effort | Status |
|---|---|---|---|---|
| 1 | Resolve the cabobaymedical.com relationship | High (SEO and legal) | Owner | **Blocked: owner** |
| 2 | Remove 24/7 and immediate-availability claims; clinic 9:00–17:00 | High (trust, ad policy) | Done in dev | Implemented |
| 3 | US/Canada insurance verification page + CTAs | High (conversion for US/CA tourists) | Done in dev | Implemented |
| 4 | Keep tax-included prices visible next to the booking button | Medium-high | Done | Implemented |
| 5 | Add The Drip Spa and Pure Cabo to the matrix; finish the Maps check of the 4 pending references | Medium | Low | Pending |
| 6 | Radiology and lab pages with confirmed catalog (25/11) | Medium | Medium | Draft |
| 7 | Aesthetic medicine section (4 categories, Rosibel profile per §3.1) | Medium | Medium | Pending data/photo |
| 8 | Rebuild or 301 the 110 legacy noindex pages in phases | Medium (crawl budget, quality) | High | Planned |

## Service-level search check (2026-11-25, WebSearch, US index)
| Query | What ranks / appears | Opportunity for this site |
|---|---|---|
| X-ray clinic Cabo San Lucas English speaking | Hospitals (BlueNet, Hospiten, Amerimed) and directories (WhatClinic); **no dedicated English-speaking X-ray clinic found** | `/radiology-x-ray-cabo-san-lucas/`: X-ray at the clinic or the hotel, results explained in English |
| blood test lab Cabo San Lucas hotel nurse | Labs (Laboratorio Carle, Helena Lab, MILAB, Healthy Cabo, Santa Fe Lab) mostly from COVID-era guides; **none confirms in-hotel blood draws** | `/lab-tests/`: nurse blood draw at the hotel, doctor explains the results; quote-based |
| lip fillers botox Cabo San Lucas | Directories (RealSelf, Fresha), Dr. Agapito Alvarez Vega (Doctoralia), Facial Aesthetics (brand claims), Clínica IMA (SJD) | `/aesthetic-medicine-cabo/`: physician-led, evaluation first, no brand names; keep it out of Ads |
| Cabo clinic accepts US travel insurance | World Class Clinic (formerly Balboa; old listing), BlueNet, Hospiten (contact form), Air Doctor (app) | Insurance page with a written verification process + a Medicare/US-plan FAQ (added) |

Also seen in the area: **The Drip Spa** (IV, on Francisco I. Madero) and **Pure Cabo** (mobile IV, round-the-clock claim). Both are added to the watch list.
