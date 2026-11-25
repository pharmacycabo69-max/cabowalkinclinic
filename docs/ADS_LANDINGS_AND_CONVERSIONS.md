# Google Ads landings, policy fit and conversions — 2026-11-25

Branch `dev/v4-redesign`. Nothing published. No campaign, budget, bidding or account setting was touched (no account access).

## 1. Landing pages
Every landing uses the same template: commercial hero (what · where · price · how), offer box, Book / Call / WhatsApp / Directions, clinic hours + address card, trust strip, "what we help with", price board with **included / not included**, why us, how it works, named clinicians with cédulas, Google review excerpts, location & hours, FAQ (with FAQPage schema), final CTA, and a mobile action bar (page CTA + call + WhatsApp).

| Ads theme | URL | Ads eligibility (Mexico) | Notes |
|---|---|---|---|
| Walk-In Clinic Cabo San Lucas | /walk-in-clinic-doctor-cabo-san-lucas/ | **Recommended** | in-person care, price $99 |
| English-Speaking Doctor in Cabo | /english-speaking-doctor-cabo-san-lucas/ | **Recommended** | URL restored (was 308 → /home-doctor/); removed from redirects, added to sitemap |
| Medical Clinic for Tourists | /tourist-medical-clinic-cabo-san-lucas/ | **Recommended** | |
| Home Doctor | /home-doctor/ | **Recommended** | $189; no arrival-time promises |
| International Medical Insurance | /insurance-billing-cabo/ | Recommended | "subject to verification"; no direct-billing promise |
| Laboratory Services | /lab-tests/ | Recommended | quote-based; illustrative image labelled |
| X-Ray & Diagnostic Imaging | /radiology-x-ray-cabo-san-lucas/ | Recommended with care | no own radiology room claimed; collaborators named; hotel X-ray "on request" |
| IV Therapy | /iv-therapy/ | **Risky** | IV products may count as prescription drugs / speculative treatments; page avoids cure claims and drug names except "NAD+". Test with a small campaign; expect "limited" status |
| Video Consultation | /video-doctor-consultation/ | **Not recommended** | Telemedicine needs certification; Mexico has no telemedicine row in the policy. Page no longer promises online prescriptions. Keep organic |
| Aesthetic Medicine | /aesthetic-medicine-cabo/ | **Do not advertise** | Botulinum toxin and fillers are prescription products; Google forbids prescription drug terms in ads, keywords **and landing pages** outside US/CA/NZ. Organic only. Creating a "clean" twin page to pass review would be evasion — not done |

Sources read 2026-11-25: Google Ads policy 176031, 15595717, 15598647, 6008942, 6368661, 16428020, 17140995, 143465. **Read the Nov 2026 healthcare update (answer/18794834) before launching.**

## 2. Conversion design (no health data, no double counting)
| Level | Event (dataLayer + gtag) | Fires when | Use in Ads |
|---|---|---|---|
| Click | `whatsapp_click`, `phone_click`, `directions_click` | tap on WhatsApp / tel / Maps | secondary (observation) |
| Intent | `booking_start` (service key) | Book button opens the booking wizard | secondary |
| Request | `booking_submit` (service key, deposit value USD) | wizard sends the patient to Stripe — **fixed: never fired before** because the wizard submits programmatically | secondary |
| Reservation | `booking_paid` | `/thanks/` after Stripe success, once per session | **primary** |
| Sale | Stripe payment with `gclid` / `gbraid` / `wbraid` / `utm_campaign` in metadata | deposit captured | import as offline conversion (manual or Zapier) to measure real revenue |

- `track.v3.js` stores ad click ids/UTMs in first-party storage for 90 days and the booking wizard sends them to `/api/checkout`, which writes them to Stripe metadata. No name, phone, symptoms, notes or policy data are sent to Google, Meta or analytics; WhatsApp message text is stripped.
- `LABELS` in `track.v3.js` are empty: paste the conversion labels from Google Ads (then rename the file to v4 and update pages — immutable cache).
- Avoid duplicates: count `booking_paid` once per session (implemented); set click events as secondary; do not import the same Stripe payment twice.
- Health is a sensitive category: no remarketing / customer match lists from these pages.

## 3. Crawlability and redirects
- Same HTML for every user agent (no UA logic in `vercel.json`, no cloaking). `robots.txt` allows all.
- 0 internal links pass through a redirect (checked on all live pages).
- Recommended final URLs are the canonical URLs above (no redirect hop). Legacy 308s keep working for old ads.

## 4. Performance (lab, mobile 390 px, 4× CPU slowdown, ~6 Mbps, local server without CDN)
| Page | LCP | CLS | TBT |
|---|---|---|---|
| / | 2.13 s | 0 | 288 ms |
| /walk-in-clinic-doctor-cabo-san-lucas/ | 1.87 s | 0 | 739 ms |
| /home-doctor/ | 1.34 s | 0 | 117 ms |
| /iv-therapy/ | 1.62 s | 0 | 53 ms |
| /radiology-x-ray-cabo-san-lucas/ | 1.22 s | 0 | 37 ms |
| /lab-tests/ | 2.34 s | 0 | 778 ms |
| /es/ | 1.38 s | 0 | 460 ms |
Changes: one bundled stylesheet (4 → 1 render-blocking requests), stale hero preloads removed, LCP image preloaded, GSAP removed. TBT spikes come mostly from the Google tag; field data (CrUX/Search Console) needed to confirm INP ≤ 200 ms after publishing.
