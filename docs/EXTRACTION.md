# Extraction contract

## 2026-10-20 | Device-local saved rental shortlist

Customers can save and remove a published vehicle from the rental-company app and
review that shortlist in the AkiCoches account dashboard. The bounded, validated
record contains public catalogue fields only and stays in that browser's local
storage. The interface explicitly says that account sync is not available, so it
does not imply a shared-backend feature that has not shipped. A dedicated shared
table and ownership-scoped RLS remain owned by the authoritative AkiPasa migration
process; this extraction neither applies schema changes nor reuses another
product's saved-item table. Removing a saved car never changes fleet or booking
records.

## 2026-10-15 | Visible WebGL rental pins

Rental location buttons are projected into a dedicated page overlay above the
WebGL map, kept in sync with map movement and resize. A button opens fleet and
directions links; the canvas-free tile fallback remains for browsers without
WebGL. The public listing API and rental coordinates are unchanged. An isolated
map test covers a real projected company pin and its links; live WebGL acceptance
on a GPU-enabled browser remains distinct from the canvas-free browser check.

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

## 2026-10-15 | Fullscreen rental company apps

The independent AkiCoches company page prioritizes company identity, paginated
fleet discovery, a selected-car photo/specification view, blocked-date calendar
and a separate authenticated request step. The date-filtered catalogue no longer
removes company identity or the rest of its fleet. Public calendar reads select
only vehicle/date fields under existing anonymous RLS; failed/truncated reads
never imply known free dates. Final range availability and request pricing remain
authoritative server contracts; requests are not confirmations or payments.

The independent AkiBusiness uses a shared fullscreen rental desk for linked venue
fleets and existing unlinked companies: fleet search/selection, add/rate/cover/
visibility editing, availability, pending/confirmed/history requests and a
dedicated existing venue media studio. Native mutations retain server validation
and RLS. Read errors disable dependent management. Mobile uses bounded panels;
short viewports and media retain internal overflow for reachability.

The new link_owned_rental_company_venue RPC is an explicit one-time attachment:
authenticated company owner AND venue owner/manager are required. It locks both
records, rejects accommodation/occupied venues and reassignment, permits an
idempotent same-venue retry, preserves company/fleet/booking rows and does not
grant direct venue_id updates. Migration 20261015163602 is applied on shared
project vhpbvcfkcteswlsdjrfl; anon execution and direct venue reassignment remain
denied. The SQL regression covers absent identity, unrelated venue member, wrong
company owner, success/retry and reassignment. Authenticated owner/media/booking
production UI acceptance remains separate. No customer records were edited.

Validation: both independent Next builds, lint/types and the first full product
suites passed (Coches 102 plus 65 redirect cases; Business 170). Follow-up UI/error
changes require final checks. The local Chromium download is truncated by the
environment, so no responsive browser/screenshot acceptance is claimed. Hosted
CI, clean Cloudflare packaging and authenticated preview acceptance are required
before release. Rollback: revert app code; keep the compatible additive RPC, or
revoke/drop that function in a reviewed forward migration. Never unlink records
or drop customer data as rollback.

## 2026-10-15 | Fullscreen privacy control integration

Live rental acceptance found the root privacy control adding a footer below the
customer viewport; the fixed operator desk also covered that global control.
Scoped rental styles now keep privacy access in a reserved bottom strip, above
the desk, without document scrolling. The existing consent panel and choices
remain unchanged. Responsive browser fixtures now include the shared footer and
assert that its control remains within the viewport. No data or auth changes.

## 2026-10-15 | Independent AkiCoches branches and booking operations

Rental locations are independent Branches / Sucursales with their own profile,
coordinates and private rental-media library. Existing company/fleet/booking IDs
remain stable. The one-time migration snapshots current venue owner/manager grants
as independent branch memberships, clears the historical venue link, disables the
old link RPC and imports only previously selected covers into branch media rows.
The authenticated branch workspace copies those legacy files into rental-media;
failed copies remain visible with a retry notice and never delete source files.
New uploads and selected covers/profile/hero media must belong to the same branch.
Public media reads are restricted to published branch profile or active-car covers.

Customer requests require name, valid phone and the verified account email, checked
in the UI, API and authoritative SQL RPC. Existing historical incomplete contacts
are retained. Booking details include email, phone, message, dates, car, status and
quote. The operator overview reports current rentals, pending requests, today pick-
ups and returns in Europe/Madrid; a separate scoped API pages live/upcoming/pending/
historical bookings and rechecks manager authorization on every request. Requests
are distinct from confirmations; no payment or instant availability is fabricated.

Rental lifecycle email uses the existing AkiPasa suite outbox and five-minute sender,
not a scheduler in either extracted product. Request/confirmation/decline/cancel/
completion changes enqueue deduplicated customer and verified branch-owner emails.
The dispatcher rechecks current verified addresses, branch owner, renter and status
before sending. No historical email backfill or test email to real customers.
New rental email events wait for the compatible sender during rollout. Its service-only activation releases only those events; its bounded media copy preserves the original venue files.

Rollback uses a reviewed forward migration and app version rollback; do not drop
branch media, re-link companies, rewrite bookings or reapply migration history.
Owner-session production mutations remain a separate acceptance check.

Migration `20261015220302_independent_rental_branches` is applied to confirmed
shared project `vhpbvcfkcteswlsdjrfl`. Readback: zero linked rental branches, one
selected legacy cover imported, the existing booking count preserved, the old
authenticated link RPC disabled and anonymous email activation denied. Security
advisors flag the intentional deny-all legacy audit and explicitly guarded
definer RPCs; no new public booking/contact access is granted.

## 2026-10-20 | Gated shared account eligibility

The server member guard reads AkiPasa's caller-only onboarding contract after
`AKISUITE_ONBOARDING_SCHEMA_READY` activation. Pending/negative declarations
redirect to the canonical same-language AkiPasa completion page. Separate domains
retain host-only sessions; that destination may request sign-in with the same
identity. No JWT, password, PKCE code or arbitrary return URL crosses products.
The shared database state takes effect on the next guarded request without client
cache authority. Existing accounts remain exempt. No schema, cohort activation,
terms version, subscription, ownership or routing setting changes here.

Native customer booking/saved API routes deny restricted accounts after identity
validation where present. The shared AkiPasa migration owns covered legacy mutation
guards. All remaining privileged endpoints and safety flows require joint
acceptance before enrolment activation. Completion currently returns to AkiPasa;
the user can switch products afterwards. This explicit central handoff avoids a
local completion redirect loop, but seamless authenticated cross-product resume
remains a separately gated enhancement. Legal, export, deletion and sign-out
remain reachable on AkiPasa's separate safety route.
