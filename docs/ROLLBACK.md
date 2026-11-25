# Rollback — V4

Production is `main` (d8c760a at the start of V4). Nothing from `dev/v4-redesign` is published.

- **Before publishing:** nothing to roll back.
- **After a merge to main:** `git revert -m 1 <merge-commit>` then push `main` (Vercel redeploys the previous state). Or in Vercel → Deployments → previous production deployment → "Promote to Production" (instant, no git change).
- **Partial rollback:**
  - House call price only: revert commit `96d8a71` (restores $199 in checkout, wizard and pages).
  - Design layer only: remove the `site.v4.css` link and the font preload (pages still work on `site.v3.css`), and point back to `site.v2.js`.
  - Spanish pages: delete `/es/`, remove `/es/` from `sitemap.xml`, re-run `node tools/chrome.mjs` (drops hreflang).
- Old assets (`book.v8.js`, `track.v2.js`, `site.v2.js`, `site.v3.css`) are kept on purpose so cached pages keep working.
