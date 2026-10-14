# AkiCoches engineering contract

This checkout is an independent app; use it directly. Do not create another worktree
unless explicitly requested. Read README.md and docs/EXTRACTION.md before changes.
Preserve the historical car*rental*\* schema and akiconduzco machine identifiers.
Never mutate production data, weaken RLS or invent successful bookings/payments.
Business fleet operations belong in AkiBusiness. Shared scheduled jobs and Stripe
webhooks belong solely in AkiPasa. Preserve host-only cookies across separate domains.
Run npm run lint, npm run typecheck, npm test and npm run build for changes; package
Cloudflare from committed clean source. Never attach production routes or redirects
before preview, auth, role/RLS, SSL and booking acceptance are verified. Report all
blocked/unperformed checks explicitly.
