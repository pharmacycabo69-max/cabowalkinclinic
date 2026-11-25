# SEO / Ads baseline — 2026-11-25

Files: `SEO_ADS_BASELINE_prod_2026-11-25.csv` (production, before) and `SEO_ADS_AFTER_dev_2026-11-25.csv` (dev build). Columns: url, status, redirect, sitemap, robots, canonical, title, description, H1, hreflang, schema types, Ads tag, conversion script, Book/WhatsApp CTAs, internal links, words.

## Production (before)
- 146 routes: 36 × 200, 110 × 308 (legacy WordPress URLs → rebuilt pages; map in `REDIRECT_MAP.csv`).
- 35 indexable, all in sitemap, all self-canonical, one H1 each. 0 hreflang.
- Google Ads tag `AW-16881895258` on every live page; conversion script `track.v2.js` on every live page; conversion `LABELS` empty.
- GTM loader present only inside HTML comments with placeholder `[GTM_ID]` (inactive).
- Titles > 62 chars: `/` (64), `/aesthetic-medicine-cabo/` (63). Thin pages: contact, legal, travel-health category.

## Dev (after)
- 42 live pages (36 + 6 Spanish). Slugs unchanged; no redirect added or removed; titles/H1 intent kept on Ads-relevant pages (/, walk-in, home-doctor, video, iv-therapy, urgent-care).
- Ads tag on every live page; `track.v3.js` on every live page (same events: whatsapp_click, phone_click, booking_submit, booking_paid; message text no longer sent).
- Reciprocal hreflang en/es/x-default on 6 pairs; ES pages in sitemap.
- No cloaking: Google and visitors get the same HTML.

## Ads checks the owner must do (no account access here)
1. Final URLs: confirm none point to a 308 legacy URL (works, but update to the final page).
2. Ad text and assets: remove "24/7", "$199" (if A1 approved), old IV prices.
3. Landing ↔ ad price match for house call after deciding A1.
4. Paste conversion labels into `track.v3.js` LABELS (rename to v4 when changed).
5. After publishing: watch policy status, conversion counts and CPC for 7 days.
