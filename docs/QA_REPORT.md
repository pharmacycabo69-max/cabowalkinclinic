# QA report — branch `dev/prompt-v3-1` (not deployed)

Date: 2026-11-24. Environment: local static preview of the dev worktree (PowerShell HttpListener). No production, Stripe or real payments were used.

## Automated checks
| Check | Scope | Result |
|---|---|---|
| JSON-LD parses | 422 blocks in 145 pages | 0 invalid |
| `docs/BUSINESS_MASTER_DATA.json`, `api/_prices.json` parse | 2 files | valid |
| Forbidden visible text: "24/7" (except the partner hospital's ER), "10 PM", "45 min", "COFEPRIS", "Available for video", "No insurance needed", "do not bill", "Rossibel", "As soon as possible" | 12 key pages, rendered text | none left (video form option fixed after the run) |
| Accessibility: images without alt, unnamed buttons or links, single H1, heading order, horizontal overflow at 390px | Same 12 pages | pass on all template pages. Legacy page `/24-7-doctor-house-call-hotel-los-cabos/` has 0 H1 and a 2→4 skip (legacy WP template, noindex) |
| robots | Radiology draft | `noindex, follow`, not in sitemap, no internal links |
| Sitemap | `sitemap.xml` | 33 URLs, all indexable template pages |
| Booking wizard (book.v8.js) | `/book/?service=home-doctor` | Shows "Doctor house call $199" (after the revert). Slots 9:00 AM–4:00 PM. After-hours note shown. "Earliest available" instead of "As soon as possible". |
| Insurance CTA | Home band, insurance page, book panel, contact | "Verify My Insurance" opens WhatsApp with a generic message (no health data, no documents) |

## Visual checks (mobile 375px)
- Home "Our doctors" panel and the static "Video consultations" badge (no live dot).
- Home insurance band and the insurance page hero.

Note: the preview tool sometimes renders the gold button empty in screenshots. The DOM has the text and correct contrast; it was verified in an earlier session.

## Not tested (explicitly)
- Stripe checkout end-to-end. Prices equal production, so lower risk, but it still needs test-mode keys on a Vercel preview, and live checkout must not be used.
- `api/stripe-webhook.js` and the forwarding to Turno (QuickTurno): unchanged, not re-tested.
- Core Web Vitals and Lighthouse: no tool available in this session. Baseline still to be measured.
- Real devices and Safari.
- Legacy WP pages beyond text replacement: layout not reviewed page by page (they are noindex).

## Rollback
Everything is on branch `dev/prompt-v3-1`; `main` and production are untouched. To discard it, delete the branch. To revert part of it, revert the individual commits listed in `HANDOFF.md`.

## Update 2026-11-25
- NAD+ is $279 on all NAD+ pages, the chatbot and the menus. The only remaining $189 is the Detox drip (pending D3).
- `/locations/` (new, indexable, in sitemap and nav): 1 H1, no a11y issues, valid JSON-LD (Pharmacy entities), no overflow at 390px. Checked visually on mobile.
- `/aesthetic-medicine-cabo/`: `noindex, nofollow`, not linked, not in sitemap.
- `vercel.json`: valid JSON. 110 redirects, all destinations exist. 3 targets were corrected by hand (the San José walk-in pages go to the San José doctor page so they don't imply a San José clinic; Tourist Corridor IV goes to `/iv-therapy/`). **Redirects are not exercised by the local static server.** Verify them on a Vercel preview before merging.
- Lab weight baseline (local dev server, mobile iframe): home 226 KB / 18 requests; book 79 KB / 15; home-doctor 259 KB / 18; iv-therapy 233 KB / 18; insurance 178 KB / 17; locations 178 KB / 17. Field CWV not available (PSI quota).

## Update 2026-11-25 (round 2)
- 9 pages audited at 390px (home, lab, radiology, aesthetics, insurance, about, imaging, San José IV, Immune).
  - No forbidden text, including "Locations", "RMC", "Botox" and "Draft".
  - No broken images, no a11y issues, 1 H1 each, no overflow, valid JSON-LD.
  - Visible prices consistent: $59 / $99 / $199 / $159 / $169 / $279. The lab, radiology and aesthetics pages carry no prices for their own services.
- Checked visually on mobile: home "Why travelers choose us", reviews grid, lab hero.

## Audit 2026-11-24 (second pass, all 35 sitemap pages)
Checked: status, title/description length, one H1, canonical, noindex, img alt/size, JSON-LD parse, forbidden phrases (24/7, round-the-clock, immediate, Botox, COFEPRIS), broken internal links (0).
Fixed: nurse-care had an empty "service" card ("Day, night and holidays") left from a 24/7 removal; geriatric-care "live-in / around-the-clock" card; "triage in minutes" arrival promises (emergency, ambulance); "rehydration is immediate" (hangover IV); "feel normal within 24 hours" (jet-lag); "assessed immediately" and "round-the-clock private-duty nursing" (post-op); X-ray and lab titles over 60 chars; thin nurse-care and geriatric-care pages rebuilt (design + FAQ); /wp-json/ stub now served with X-Robots-Tag noindex.
Kept on purpose: "24/7 emergency" about the partner hospital (allowed exception); "guarantee" only in disclaimers.
