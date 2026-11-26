# V6 — Google Ads, local SEO and Google Business Profile (2026-11-26)

No access to Google Ads, Policy Manager, Search Console, GA4 or the Business Profile: nothing was changed there. The rejection reasons of existing ads could not be read. This plan is based on the site and the public policies.

## 1. Ads: what each landing may advertise
| Priority (V6 §20) | Final URL | Status |
|---|---|---|
| 1. Walk-In Clinic Cabo San Lucas | /walk-in-clinic-doctor-cabo-san-lucas/ | Ready |
| 2. English-Speaking Doctor | /english-speaking-doctor-cabo-san-lucas/ | Ready |
| 3. Doctor at Hotel / Home Doctor | /home-doctor/ | Ready |
| 4. Tourist Medical Clinic | /tourist-medical-clinic-cabo-san-lucas/ | Ready |
| 5. General Medical Consultation | /walk-in-clinic-doctor-cabo-san-lucas/ (no new URL: same intent) | Ready |
| 6. Diagnostic Services | /lab-tests/, /radiology-x-ray-cabo-san-lucas/ | Only after the provider documents (radiology) and the lab agreement; quote-based |
| Not now | /video-doctor-consultation/ (telemedicine certification; Mexico not listed), /iv-therapy/ incl. NAD+ (prescription/unproven-treatment risk) | Organic only until eligibility is verified |
| Never from this brand | aesthetic medicine | Retired (410) |

Before re-submitting rejected ads: read the current health policies (176031, 18794834, 7475709, 16701855) in Policy Manager, fix the cause shown there, remove "24/7" and $199 from ad text, use the canonical URLs above (no redirect hop), then request review once per ad group with the corrected cause. No bridge pages, no cloaking: every user agent receives the same HTML (no user-agent logic in `vercel.json`).

## 2. Conversions and privacy (V6 §21)
- Keep in Google Ads, as **secondary** (observation) only: click events (WhatsApp, call, directions) and `booking_start`, `booking_request`, `booking_submit`. Since V6 they carry no service name (it could reveal a study or treatment), no personal data and no chat topic (`track.v4.js`).
- `booking_paid` on `/thanks/` remains the only page-based primary candidate; the reliable record of a payment is the **signed webhook** in the register, not the thanks page.
- **Disabled in V6:** ad click ids (gclid/gbraid/wbraid) are no longer written to Stripe and no offline import is prepared. Health is a sensitive category: enhanced conversions, customer lists, remarketing and offline imports of patient purchases stay off until a policy/legal review says otherwise. UTM source/campaign are kept only in the private register to measure requests and revenue by campaign internally.
- Conversion labels in `track.v4.js` are still empty (owner must provide them from the Ads account). Preview and local hosts should be excluded in GA4/Ads filters (internal traffic rule) — owner action.

## 3. Local SEO and Business Profile — recommendations (not applied)
- Name exactly as on the street sign; address Francisco I. Madero S/N, entre Vicente Guerrero y Miguel Hidalgo, Centro, 23450; pin on the entrance; primary category "Medical clinic" (secondary "Walk-in clinic", "Doctor"); hours 9:00–17:00 daily (no 24 h); phone +52 624 226 1023; website https://www.cabowalkinclinic.com/.
- Photos: real entrance, sign, reception, consultation room, team (with consent). Not AI images.
- Services list: walk-in visit $99, house call $189, video visit $59, lab and X-ray coordination (quote), insurance verification. No aesthetics.
- Reviews: ask every patient the same way after the visit (QR at reception + link in the follow-up message), no incentives, no filtering; answer without any clinical detail.
- Content: original articles signed or reviewed by a named physician (Dr. Kevin González Adame), e.g. traveler's diarrhea, sunburn and heat illness, ear infections after swimming — no hundreds of hotel pages.

## 4. Technical SEO done in V6
- `/aesthetic-medicine-cabo/` → **410 Gone** (not redirected to an unrelated page), out of sitemap, footer, team page and wizard. Traffic/backlinks could not be audited (no Search Console): owner to check before publishing (see decisions).
- New indexable pages: `/es/reservar/` (hreflang pair of `/book/`), `/hotel-concierge-medical-partnerships/` (B2B, FAQ schema).
- Redirect fixed: `/english-speaking-doctor-pedregal-quivira/` now goes to `/home-doctor/` (was IV therapy).
- X-ray schema no longer claims "X-ray at our downtown clinic or portable unit at your hotel".
- Cannibalization between the seven brands: this domain is the institutional clinic (general medicine, Ads); aesthetics belongs elsewhere; no pharmacy or locations content here. A data-based consolidation needs Search Console for all domains.
