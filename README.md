# AkiCoches

Independent Next.js 15 / OpenNext rental discovery and request-booking product,
extracted from `elguiriashing/akipasa` commit
`080ea0ffb2dd6612436acd04c25b4daf8ff71129`. Canonical destination: `https://akicoches.com`.
The original AkiPasa repository and deployment remain unchanged.

Use Node 22+, run `npm ci`, copy `.env.example` to ignored `.env.local` and configure
existing shared Supabase public credentials securely. Run `npm run dev -- --port 3103`.
`npm run typecheck`, `npm test`, `npm run lint`, `npm run build` validate this product.
All runtime dependencies retain the source lock and verified MapLibre sanitizer backport.

`/`, `/map`, `/rentals/:company-slug`, `/account` and `/bookings` retain the rental
catalogue, availability, pricing and customer requests. `/en/auth`, `/es/auth`, callback,
password recovery and Terms retain the shared Supabase identities and per-domain cookies.
Fleet/company/rates/operator booking management is delegated to the authorized
`https://akibusiness.com/{locale}/business/venue/{id}?section=fleet` workspace
inside each linked venue. Legacy unlinked operators retain the mobility route.
Membership subscriptions
remain at the AkiPasa account hub. This product does not collect payments or guarantee
instant confirmed bookings. Historical `akiconduzco` cookie, module and database identifiers
remain stable; customer-facing branding is AkiCoches.

## Independent deployment

Commit source before `npm run build:cloudflare`; release-source stamping rejects dirty
tracked files and untracked source. `npx wrangler deploy --dry-run` verifies packaging.
Deploy a preview first using `npm run deploy:cloudflare`; the worker is named `akicoches`,
uses workers.dev and deliberately has no production domain routes or cron schedules.
No billing webhook, global email sender or scheduled subscription task is installed.
Only the original AkiPasa owns those shared jobs. `/api/health` reports process health,
not database readiness.

Public `NEXT_PUBLIC_*` values must exist at **build time** as well as runtime. Keep
private values in Cloudflare/GitHub environment secrets. Set the exact preview origin
in `AKISUITE_ALLOWED_PREVIEW_ORIGINS`; all other hosts are rejected. For each approved
preview and canonical origin, allowlist `/en/auth/callback` and `/es/auth/callback` in
Supabase Auth, and check Google OAuth/PKCE, magic links and recovery. Supabase session
cookies remain host-only: a shared identity does not provide automatic SSO between
unrelated root domains. No token is passed in a product link. Authenticated cross-domain
SSO remains a separate release prerequisite, not a claimed implemented capability.

The source includes read-only SQL contract snapshots for rental records/RLS; **do not
apply them to production from this extraction**. The shared schema is already owned by
the AkiPasa migration process. No provider data was copied or changed.

Keep `AKICOCHES_INDEXING_ENABLED=false` for previews. Before adding custom domain routes,
verify credentials, actual role/RLS isolation, EN/ES at mobile/desktop, request/confirm
booking in a sandbox, fleet management handoff, membership/logout/recovery, image/maps,
SSL, HTTP errors and monitoring. Only after verification attach `akicoches.com`; legacy
`akiconduzco.akipasa.com` and `akiautos.com` redirects belong to the coordinated migration,
not this preview config. Preserve paths and query strings and treat callbacks separately.
Rollback removes new redirects/domain route bindings and returns to the existing AkiPasa
rental host; no database rollback or identity reset is required.

Shared copied library maintenance is recorded in `docs/EXTRACTION.md`. Update security
patches from the pinned upstream source deliberately and run this app's regression suite.

The separately gated AkiAutos redirect Worker lives in `deployment/akiautos-redirect`.
It has its own Wrangler config, no production routes and cutover disabled by default.
Its redirect tests run in this repository CI.
