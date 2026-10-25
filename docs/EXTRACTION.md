# Extraction contract

## 2026-10-25 | Rental photo caption contrast

The vehicle name over the rental detail photo/placeholder is explicitly white in
both saved themes. The photo remains dark even in light mode; inherited global
heading color previously made the selected vehicle name nearly invisible there.
This is scoped to RentalCompanyApp's photo caption, including EN/ES, responsive
sizes and no-image states. Fleet selection, dates, requests, account, pricing,
media loading, permissions and provider configuration are unchanged. Rollback is
a source revert. Validation is recorded in the change-impact register; source
preparation is not a production release.

Android Google OAuth requires the product-specific code-only browser return and
paired custom-scheme Android client described in android-oauth-return.md. The
original WebView performs PKCE exchange; sessions never transfer across hosts.

## 2026-10-24 | Owner-approved monthly pricing and upgrade paths

The current commercial catalogue is `APPROVED_PRICING_20261024.md` and
`config/approved-pricing.json`. It supersedes older public tier/price descriptions:
AkiBusiness Basic/Standard/Pro €19.99/€48.99/€97.99; individuals €1.99 for each
AkiPasa/AkiDuermo/AkiCoches Premium; businesses €11.99/€24.99/€19.99 respectively.
Free AkiHQ access, historical machine identifiers and existing subscriber terms
are retained. EN/ES marketing and CTAs explain product-specific Premium upgrades
without activating billing or inventing benefits. Shared audience source remains
identical in the three discovery apps. Source, account, Stripe, SQL guard, service
worker and release dependencies are traced in that pricing contract and receipts.
The 36-case local pricing/lifecycle SQL suite passes; full checks, hosted CI and
exact-source live readback remain required before release acceptance.

## 2026-10-22 | Membership audience clarity

The earlier five-card listing/operations comparison below is superseded.
The native AkiCoches membership shows Individual Free/Personal Premium
(staged, no invented price or checkout) and Business free AkiHQ rental-branch
management/€14.99 staged listing Premium. A standalone AkiBusiness link
explains that 4/8/12 operating tools are independently licensed by location.
Use the byte-identical audience-studio source and CSS also in AkiPasa and
AkiDuermo. Preserve host-local account security, all real booking/fleet data,
EN/ES and no-charge status. No Stripe, Supabase, RLS or production route
changes. CI, mobile/desktop, real auth/role and exact deployed-SHA
verification remain required.

## 2026-10-21 | Compact five-plan membership studio

The public membership page has one consistent commercial ladder: free AkiHQ,
AkiCoches Premium, and AkiBusiness Standard/Plus/Pro. Public sector/tool
configurators and Enterprise/personal cards are removed from this comparison.
Standard communicates 4 of 12 tools with one replacement per monthly cycle,
Plus 8 of 12 with two, and Pro all 12. Annual customers retain the same monthly
anniversary rotation; billing frequency changes price, not toolbox rules.

Mobile and tablet use five concise plan tabs with one visible sales panel;
desktop uses the same five plans in one comparison row. Checkout remains closed
and every paid CTA is an availability enquiry. No Stripe product, entitlement,
RLS, identity, rental booking, customer record or deployment mapping changes.
The authenticated AkiBusiness toolbox remains the only place to save active and
next-cycle tool selections.

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

## 2026-10-20 | Explicit cross-product language contract

AkiSuite selectors and management/operations handoffs now retain EN/ES using
canonical product-specific route formats. AkiHQ remains free management;
AkiBusiness remains paid operations. The synchronized suite-navigation v1
contract rejects external/query/fragment/path-traversal destinations and can
carry only bounded explicit workspace identity and a validated public referral
code. No auth token or account identity crosses domains in links. Existing
server membership checks remain authoritative. Focused tests pass; complete
CI/build and canonical authenticated acceptance remain release gates. See
`docs/SUITE_NAVIGATION_V1.md`. No schema, billing or customer data changes.

## 2026-10-20 | Contextual free management and operations previews

The business-owner disclosure uses the canonical AkiSuite navigation contract,
keeping free AkiHQ listing/location/team management separate from AkiBusiness
paid operations. Venue claim initiation is shown only when the existing public
ownership check confirms claim availability; property/rental prompts use the
free hub without fabricating claimability or creating a venue dependency.
Category workflow previews describe organisation steps, without invented results
or prices. The operations link is neutral, not an upgrade promise or entitlement
grant; actual target server permissions remain authoritative.

CTA impressions/clicks and claim starts use existing GA4 only when the current
analytics consent cookie grants it. No identifier, contact field, payment success
or claim completion is inferred or sent. Consent revocation is rechecked on
every signal. No new loader, cross-domain cookie, tracking pixel, billing flow,
backend mutation, schema or production configuration is introduced. The mirrored
BusinessPathway, suite-conversion and suite-navigation sources have shared v1
provenance and no sibling-checkout imports.

Validation: new five-case rendered/interaction/consent suite; full source gates
and responsive/provider acceptance remain tracked in the release report. Revert
these source commits for rollback; no data restoration is required.

## 2026-10-20 | Validated referral task completion

Account completion preserves a single public referral code matching the existing
uppercase alphanumeric 8–24 character navigation bound. The canonical public
`/{locale}/referrals?ref=CODE` task returns to AkiPasa's explicit confirmation page;
other allowed product tasks retain their validated code and EN/ES choice through
the same fixed-origin resume envelope. Duplicate, URL-shaped, lowercase and
out-of-range codes are discarded. Direct unprefixed AkiPasa referral completion
uses this same sanitizer rather than falling back to Account.

This changes navigation only: pending/underage restrictions, legal and tracking
choices, first-attribution immutability and the explicit confirmation action remain
authoritative. No automatic attribution, referral cookie, identity transfer, schema,
financial incentive or production write is introduced. Shared contract copies and
role-controller regressions cover all five products and both languages. Hosted CI
and exact-source release checks remain required; unit fixtures do not establish
authenticated production browser acceptance.

Actual rental Account and the Bookings alias now preserve a single validated referral and bounded tab/vehicle/date task keys before the authoritative account gate. The alias retains explicit EN/ES. Repeated search values and arbitrary URLs are discarded rather than selected or decoded into redirects.

## Supported runtime update — 21 October 2026

Next/OpenNext build support migrated after Next15 crossed the adapter support window. Existing product/role, locale, auth, shared schema and source-stamp release contracts remain authoritative; see NEXT16_SUPPORTED_RUNTIME.md. No unsupported-version flag, runtime pin change or production configuration mutation is permitted by this source amendment.

Completion-resume scope correction retains the actual legacy property/company/organisation query names using the shared bounded allowlist; no scope authorisation or runtime pin change. See ACCOUNT_TASK_RESUME_V1.md.

## Isolated tooling security maintenance — 21 October 2026

A separate candidate patches test/build dependencies after the scoped completion correction. Product/runtime dependencies, MapLibre backport verification, roles, consent, RLS, billing and release source pins remain authoritative. See security/TOOLING_REVIEW_20261021.md for advisory provenance, residual braces baseline and pending exact-head CI requirements.

## Monthly operating-tier alignment — 21 October 2026

The compact five-card membership design is preserved. Operating cards use approved Básico €24.99 / Standard €44.99 / Pro €64.99 monthly amounts and 4/8/12 tools, with 1/2/unrestricted monthly replacements. Unverified operations annual totals and the global annual savings control are removed; no new annual Stripe products or pricing are inferred. The Standard accent now says “8 tools”, without an unsupported popularity claim. Existing listing monthly pricing remains separate; no billing objects or personal subscription records change. Saved toolbox changes activate at the next monthly rotation, including existing annual subscribers; delegation of active tools remains instant.

EN/ES functional server-render tests assert each actual card’s price, tools, replacement allowance, five-card count, locale destination and absence of annual/popularity promises. Checkout remains gated and no provider or production configuration changes are made. Scope-preservation and patched-tooling public ancestry are retained with the latest membership primary. Full exact-head hosted release gates remain required before merging.

## 2026-10-24 | Native shared account journey

AkiCoches now serves its own shared profile/settings forms and retains local
account and membership navigation. All editable fields use one atomic UPDATE
to the authenticated identity's existing public.profiles row; explicit column
validation excludes IDs, roles, entitlements and billing. Email changes and
password recovery use trusted same-product callbacks and the existing identity.
Name, username, bio, contact, locality/province, language and visibility therefore
follow the account across products without syncing copies or sharing cookies.
The form is withheld after a failed profile read; no blank overwrite is offered.
EN/ES, existing product shells, tenant permissions, saved/booking records and
separate identity/privacy safety gates remain authoritative. No SQL, provider
config, purchase activation or customer data is changed by the source release.
Shared source v1 mirrors have no sibling repository imports. Regression tests
cover both locales, field bounds, role/foreign-ID stripping and failed reads.
Full check/build, hosted CI and exact live-source acceptance remain required.
Rollback is a source revert; profiles and sessions are retained.

## 2026-10-25 | Shared icon family v3

Owner-requested burgundy Coches (#3B101B) and space-grey HQ (#252830) tiles
are synchronized across all five product selectors, favicons, Apple/PWA and
mobile icon sources. Coches uses the current car-free mark; black artwork has
a fine brand-colour edge for legibility. Pasa, Duermo and the purple AB geometry
are preserved. Default dark canvases match the tiles; light and selected owner
themes remain available. Versioned URLs and the static operating suite cache
refresh remove stale selector artwork. Stable PWA IDs and app identifiers remain.
No roles, links, data, billing, analytics, storage or provider configuration change.
See AKISUITE_ICON_FAMILY.md for dependencies, checks, native rebuild limitations
and source-only rollback. Local visual/asset validation and required CI are
separate from exact-source production and signed native-device acceptance.
