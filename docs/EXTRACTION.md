# Extraction contract

## AkiSuite rental UI and venue handoff (2026-10-15)

The customer app now exposes a saved-theme control, category/date-aware map,
one location pin per rental company, fleet and directions links, and public
cover signing for linked venue media that existing anonymous venue and Storage
policies permit. Renter account/request semantics are unchanged; an incomplete
date pair is not sent as an availability search. Public covers fall back to
previous images or placeholders if permission or signing fails. The operator
CTA goes to the AkiBusiness venue workspace rather than a separate mobility
tab. Shared venue/cover fields and manager RLS are owned by the mirrored
AkiPasa migration, not this deployment.

Normal rental logout now requests Supabase's `local` scope, avoiding unintended
global revocation in this shared identity project. A successful password change
retains explicit `global` revocation as a security response; it is never tested
against the owner's real account. Three server-action tests verify the distinct
scopes, verified recovery ordering and expired-link refusal. These tests establish
the requested provider contract; real cross-product refresh-token retention is
not claimed without a provider-backed refresh check. Original AkiPasa is unchanged.

The anonymous auth-page sweep also found dark inherited auth text on the rental
product's fixed dark canvas, and a language switch that retained an old localized
pathname. Scoped rental auth tokens now keep sign-in/recovery text readable under
both saved suite brightness preferences; the browser suite checks computed auth
heading color. Language changes replace localized pathname prefixes while retaining
the origin, recovery mode and local account return. No credential or OAuth flow
was changed, and no recovery email or booking was submitted during the sweep.

Deployed preview acceptance at `745cf8c` confirmed the real shared catalogue,
company details, EN/ES and same-origin navigation. The cloud browser reports
WebGL disabled, so that browser cannot certify visible tiles. Its rejected map
initialization exposed a missing error boundary: the map now catches rejected
initialization and offers an accessible same-origin catalogue link in EN/ES.
Only the current search and locale are carried to that fallback; the catalogue
initializes from the bounded search query. Three isolated regression tests cover
WebGL constructor failure and retained catalogue searches. Booking handlers,
availability, map controls and provider jobs are unchanged. Tile and authenticated
acceptance remain separate checks; a fallback does not certify WebGL rendering.

Release packaging now removes only the generated `.open-next` output before each
full build. A repeated local OpenNext build appended duplicate environment exports
when previous output survived, causing Wrangler packaging to fail. Next's `.next`
cache is retained. The manual preview workflow masks configured public keys and
limits Wrangler logging so provider binding diagnostics do not print key values.

Baseline: AkiPasa `080ea0ffb2dd6612436acd04c25b4daf8ff71129`, tracked Git archive
only. No history, credentials, local config, build outputs or user records were copied.

The rental route tree, components, domain validations, maps, customer request/account,
booking API and shared auth/recovery/Terms/consent import closure are included.
The locale layout is product-specific so it cannot accidentally ship business, admin,
owner-console or support mutation bundles. Product/API middleware rejects unknown hosts,
blocks unrelated API paths and limits POST to auth/Terms/consent/request booking.
Same-origin and authenticated booking validation, verified email checks, idempotency key,
server-side quote RPC, pending state, owner memberships and all shared RLS remain intact.

Data dependencies: profiles, car_rental_companies, car_rental_vehicles,
car_rental_bookings, shared Supabase authentication and `search_car_rentals` /
`request_car_rental_booking` RPCs. Owner-only fleet/rates/availability/company moderation
continues in the independent Business workspace against the same records. No renamed
schema, new permission, payment activation or database operation is part of extraction.

Shared code starts as copied versioned source. Record upstream source commit for each
future synchronization; review changes to auth, terms, privacy, Supabase and MapLibre
backport jointly across products. Avoid filesystem imports into sibling repositories.
Package distribution can follow once the product boundaries stabilize.

Expected regression matrix: ES/EN, mobile/desktop, light/dark, signed out/renter/operator,
empty/error/catalogue results, return paths, password recovery and booking failure/confirm
states. Automated local results are recorded separately; fixtures/static SQL contract
checks do not establish authenticated production correctness. No production release is
approved by a green build alone.

## Change-impact entry — 2026-10-15

Before extraction the rental product shared AkiPasa's Worker, full route tree,
locale shell and deployment. This change separates the rental import closure and
host policy into an independent repository/Worker, updates visible branding and
canonical URLs, and delegates authorized management to canonical AkiBusiness.
Cross-app origin configuration, Supabase callbacks, legal acceptance and password
recovery remain coupled to the shared identity project. No schema or provider mutation.
Failure/rollback: retain the existing live rental host until all new-host checks pass;
revert extraction/deployment routing without touching customer records or old code.

Canonical rental routes are real Next routes at `/`, `/map`, `/account`, `/bookings`
and `/rentals/[slug]`; legacy `/akiconduzco/...` paths redirect locally. Independent
apps do not need virtual-host proxy rewrites, avoiding recursive localhost routing.
The renter account includes the retained shared sign-out server action.

The independent mobile browser review found that inherited light-theme global
heading tokens made rental headings dark on the product's fixed dark surface.
The rental `.app` now defines its own light ink token, scoped to that product.
The browser regression checks real computed heading color in both saved theme
preferences, ES/EN and mobile/desktop. It fails against the original source style.

Cross-product fallback and membership redirects remove authentication/secret keys
and opaque navigation wrappers (`next`, redirect/return/callback variants). A real
canonical GET with a dummy nested callback code previously forwarded it to
AkiBusiness. The query-only helper now inspects bounded nested URI/form encoding,
JSON keys/strings (including Unicode escapes), userinfo URLs and bracket/dot keys;
malformed, over-deep or oversized input fails closed. Limits are 8 KiB of query,
64 fields, four decode rounds, JSON depth four and 128 parts per inspected value.
Ordinary discovery/date/language/page/tab fields survive. External responses
explicitly replace browser fragments and send no-referrer/no-store; non-read
requests never cross domains. Same-origin PKCE callbacks and their local code,
state and next context retain the existing exchange behavior. The helper and
middleware regressions exercise dummy values only; no live credentials are used.

## Deterministic CI public configuration

Hosted CI passed compilation but failed its anonymous account browser journey:
the job built with optional repository Supabase variables, then supplied fake
public settings only when starting Next. A local reproduction with empty build
settings returns home/health200 but account500, because Next had already inlined
the missing public values. The verification job now uses explicit loopback,
disposable public settings at both build and runtime; it never relies on or
contacts production provider configuration. The existing eight browser cases
and authorization checks remain required. Server logs are retained on failure,
health must succeed, and the owned smoke server stops before Cloudflare rebuild.
Deployment remains separately gated on verified real build-time public settings.

## Manually dispatched preview releases (2026-10-15)

`.github/workflows/preview-release.yml` builds an explicitly selected full source
SHA only after this repository's product CI succeeds for that exact commit. It
validates the confirmed shared Supabase endpoint/public key, supplies matching
build/runtime configuration, and retains the compiled OpenNext bundle, assets
and checksum. Build-only is the default. Optional deployment uses a scoped
`CLOUDFLARE_API_TOKEN` from the `preview` environment and is fixed to account
`501bc9434d8ae555a6ac984a26dd2725` and Worker `akicoches`. The environment must
provide `NEXT_PUBLIC_SUPABASE_ANON_KEY` as a variable or secret. No service key
is accepted in browser builds.

The workflow rejects source configurations with routes, alternate environments,
schedules or open billing-readiness flags. It also rejects a remote Worker
already attached to a custom domain or scheduled job before deployment. The
result must expose its exact SHA over HTTPS at the allowlisted
`https://akicoches.alexashing1.workers.dev` origin. Existing production domains,
AkiAutos activation and shared jobs remain under the coordinated release gate.
Workflow parsing and shell syntax checks pass locally; hosted invocation,
provider deployment and authenticated acceptance are separate pending checks.
The workflow can be reverted without changing application records or routing.
