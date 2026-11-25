# Business data conflicts — 2026-11-25

| Field | Source A | Source B | Applied in dev | Resolution needed |
|---|---|---|---|---|
| House call price | Owner chat 2026-11-24: "$199" (live in production) | V4 §4: "home doctor $189" | $189 | owner confirmation (PENDING_APPROVALS A1) |
| IV price | V4: "IV estándar $159" | Owner 2026-11-24: Hydration/Recovery $159, others $169 | $159 / $169 ("from $159") | none — V4 sets the standard price only |
| Group IV price | old pages/bot: $119 pp (6+) | V4: groups = quote | quote | confirm if a group price exists |
| In-clinic IV price | old bot: $129–$159 | not in checkout | removed | confirm if in-clinic IV is cheaper |
| Aesthetics prices | owner 2026-11-24: medicinaesteticaencabo.com prices, plus tax | V4: aesthetics without confirmed price = quote | kept (owner-confirmed) | confirm still valid (A4/A5) |
| Luis Camacho title | owner chat: "Técnico Radiólogo" | V4: "título pendiente" | Técnico Radiólogo | constancia / SEP check |
| Home X-ray | owner chat: "Clínica y a domicilio" | V4 §5: do not offer without validating equipment, scope, permits | "on request, subject to confirmation" | validation (A3) |
| Storefront sign hours | photo `0C1597E6…jpg`: "9:00 AM – 9:00 PM" | V4 + site: 9–17 | photo not used | replace sign/photo |
| Pharmacy/locations on this site | V4 §7: all domains *may* show pharmacy | owner 2026-11-24: "no pongas nada de farmacia ni locaciones" | none shown | owner instruction kept |
| Aesthetics on home | V4 §5.1: services incl. aesthetics on home | CLAUDE.md: aesthetics never on Ads landing pages | footer + About only | keep unless owner decides otherwise |
