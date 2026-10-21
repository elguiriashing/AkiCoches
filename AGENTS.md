# AkiCoches engineering contract

This checkout is an independent app; use it directly. Do not create another worktree
unless explicitly requested. Read README.md and docs/EXTRACTION.md before changes.
Preserve the historical `car_rental_*` schema and akiconduzco machine identifiers.
Never mutate production data, weaken RLS or invent successful bookings/payments.
Business fleet operations belong in AkiBusiness. Shared scheduled jobs and Stripe
webhooks belong solely in AkiPasa. Preserve host-only cookies across separate domains.
Run npm run lint, npm run typecheck, npm test and npm run build for changes; package
Cloudflare from committed clean source. Never attach production routes or redirects
before preview, auth, role/RLS, SSL and booking acceptance are verified. Report all
blocked/unperformed checks explicitly.

The original AkiPasa repository, master history and live Worker must remain intact.
Shared backend project reference: `vhpbvcfkcteswlsdjrfl`; verify its configured endpoint
and deployment role before release. Preserve the destination bootstrap contract in
`docs/INITIAL_MIGRATION_CONTRACT.md`; never overwrite remote work or force-push.

## Version-matched framework documentation

For Next16 migration/runtime work, read installed `node_modules/next/dist/docs/01-app/02-guides/upgrading/version-16.md` and `node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/middleware.md` when present; bundled docs match the exact installed dependency. Existing product and release contracts above still apply.
