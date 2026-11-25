# QA report — branch `dev/prompt-v3-1` (not deployed)

Date: 2026-11-24. Environment: local static preview of the dev worktree (PowerShell HttpListener). No production, Stripe or real payments were used.

## Automated checks
| Check | Scope | Result |
|---|---|---|
| JSON-LD parses | 422 blocks in 145 pages | 0 invalid |
| `docs/BUSINESS_MASTER_DATA.json`, `api/_prices.json` parse | 2 files | valid |
| Forbidden visible text: "24/7" (except the partner hospital's ER), "10 PM", "45 min", "COFEPRIS", "Available for video", "No insurance needed", "do not bill", "$199" (house call), "Rossibel", "As soon as possible" | 12 key pages, rendered text | none left (video form option fixed after the run) |
| Accessibility: images without alt, unnamed buttons or links, single H1, heading order, horizontal overflow at 390px | Same 12 pages | pass on all template pages. Legacy page `/24-7-doctor-house-call-hotel-los-cabos/` has 0 H1 and a 2→4 skip (legacy WP template, noindex) |
| robots | Radiology draft | `noindex, follow`, not in sitemap, no internal links |
| Sitemap | `sitemap.xml` | 33 URLs, all indexable template pages |
| Booking wizard (book.v8.js) | `/book/?service=home-doctor` | Shows "Doctor house call $189". Slots 9:00 AM–4:00 PM. After-hours note shown. "Earliest available" instead of "As soon as possible". |
| Insurance CTA | Home band, insurance page, book panel, contact | "Verify My Insurance" opens WhatsApp with a generic message (no health data, no documents) |

## Visual checks (mobile 375px)
- Home "Our doctors" panel and the static "Video consultations" badge (no live dot).
- Home insurance band and the insurance page hero.

Note: the preview tool sometimes renders the gold button empty in screenshots. The DOM has the text and correct contrast; it was verified in an earlier session.

## Not tested (explicitly)
- Stripe checkout with the new $189 price. It needs test-mode keys on a Vercel preview, and live checkout must not be used.
- `api/stripe-webhook.js` and the forwarding to Turno (QuickTurno): unchanged, not re-tested.
- Core Web Vitals and Lighthouse: no tool available in this session. Baseline still to be measured.
- Real devices and Safari.
- Legacy WP pages beyond text replacement: layout not reviewed page by page (they are noindex).

## Rollback
Everything is on branch `dev/prompt-v3-1`; `main` and production are untouched. To discard it, delete the branch. To revert part of it, revert the individual commits listed in `HANDOFF.md`.
