# Product contract

## 2026-10-25 | Rental photo caption contrast

The selected vehicle name on the rental detail dark photo surface uses explicit
white text in light and dark themes. Global heading tokens must not override
that surface's foreground. No interaction, URL, identity, booking, pricing,
media, permission or provider behavior changes. See the impact register for
validation and release limits. Source revert is sufficient.

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

## 2026-10-24 | Native accounts and shared billing bridge

Routine account/settings/membership screens now belong to each product while
reading and modifying the same authenticated profiles row. AkiBusiness selects
its package and creates a private location locally, without a public-venue claim
or the Pasa→HQ chain. Coches/Duermo free management links target their actual HQ
branch/property tools. The central bearer-only `/api/account/portal` verifies
Supabase identity, eligibility and terms, reads only caller billing, preserves
existing management-only portal configuration and returns Stripe to the fixed
originating product. Customer/profile/return URL inputs are not accepted. No
service key, cross-domain cookie, checkout activation or paid entitlement change.
Bilingual new tests cover native profile forms, role/ID stripping, billing identity
isolation, fixed destinations, partial failures, location idempotency and local
logout. See `CUSTOMER_JOURNEYS_20261024.md` for all eight journeys, dependency/release
order and explicit remaining shared safety/onboarding and provider acceptance.

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

## 2026-10-25 | AkiSuite navigation and surface continuity

Owner-authorized tightening preserves identity, tenant permissions, booking and
billing authority. Discovery membership audience now survives explicit Business
handoffs, reload and browser history without enabling checkout. Duermo/Coches
share one desktop rail/mobile dock component where available; Coches membership
retains its product header. Pasa's auth selector uses all five canonical brands
and origins. Duermo auth stays teal; HQ marketing and login use one request
language, keep readable dark-surface text, and expose header controls. Business
login gains local home/language/appearance controls retaining input only in memory.
Each repository carries only its affected subset. No schema, feature activation,
provider setting, customer record or native signing change. Source revert is the
rollback. Full source, browser/CI and exact production checks remain required;
device/authenticated acceptance must not be inferred from fixtures.

## 2026-10-25 | AkiSelector workspace login integration

Alex explicitly selected the existing private lab's AkiSelector for the public
login workspace chooser. All five apps appear: Pasa orange, Duermo teal,
Coches red/burgundy, HQ yellow/space grey and Business purple. Reuse the
engine's card scene, swipe, keyboard navigation and reduced-motion behavior
in a compact sign-in adapter. Previewing an app never submits, navigates or
replaces a login form; opening another app is an explicit localized action
with only the bounded referral code passed across origins. Current product
is selected initially. Mobile keeps the chooser after the sign-in fields.
The static operating app uses a DOM adapter and the same scene styles, with
no framework runtime or third-party dependency added. The private lab keeps
its administrator-only route. No pricing, session, tenant, permissions or
provider setting changes. Source revert is rollback. Source, responsive
browser, exact live source and physical device acceptance remain distinct.

### 2026-10-25 | Rental map navigation safe area

The full-screen Coches map reserves the same responsive dock inset as the
rental company view and Duermo map. Its canvas stays above the phone dock
and beside the desktop rail, with no extra document padding. Existing filters,
map state and results remain unchanged. Browser smoke asserts both geometry
boundaries in EN/ES and light/dark. No API, data or provider changes.

Map height uses the actual header row, including its wrapped phone layout,
rather than assuming a 64px header. Browser geometry must clear the dock.

## 2026-10-26 | Direct workspace icon navigation

Owner-requested sign-in refinement: the five icon cards are the navigation
links themselves. Remove the visible previous/next controls, caption/count and
separate Open/current-workspace row from every public login chooser. Swiping
and Arrow/Home/End browse the carousel without navigation or draft changes;
an explicit tap/click or Enter on an icon follows its canonical localized link.
Suppress the compatibility click after a horizontal swipe so it cannot open an
app accidentally. Current app identity uses aria-current; browsing is distinct
from authorization and never submits the sign-in form. The private lab keeps
its original radio-selection controls by default through an opt-in link mode.

Dependencies: identical React engine/adapter/CSS copies in Pasa, Duermo, Coches
and HQ; equivalent static Business adapter at both guest sign-in entries.
Business selector assets advance to v2 and production offline cache to 155,
with release assertions retained. Existing bounded referral-only href helper,
EN/ES, product icons/palettes, reduced motion, roving focus, 44px active targets
and phone placement after the form remain. No session, permission, identity,
price, tenant, API/provider, database, analytics or customer-data changes.

Validation: destination/keyboard/private-lab regressions plus responsive browser
checks for first-click icon navigation, swipe click suppression, retained draft,
no footer/actions, localized/referral-safe URLs and zero scene scroll. Complete
hosted source/browser/Cloudflare checks and exact live-source verification are
required before release; installed native/device acceptance remains separate.
Rollback is a source revert and renewed Business asset/cache versions.

## 2026-10-26 | Headerless desktop discovery rails

Owner requested matching Pasa's desktop shell on Duermo and Coches. The desktop
rail now starts at the viewport top, uses a v3 icon plus expanded wordmark,
collapses to the icon, and persists its own product-local collapse preference.
The separate top header is removed from desktop layout. The footer order is
AkiSuite links, prominent sign-in, appearance/language, then collapse. Existing
settings/sign-out and bounded referral handoffs remain available. Phone/narrow
tablet retain the compact header and one bottom dock, like Pasa's mobile shell.

The same rail component/CSS are copied into both independent apps. Desktop
content padding follows the actual expanded/collapsed width. Fullscreen map
and rental layouts use the available height rather than retaining a hidden
header offset; map canvases resize without a camera reset. Menus remain within
short viewports. Duermo auth/legal routes join its local rail; in-place language
callbacks retain public exploration/property drafts, while other routes retain
local language navigation. No auth session, permission, identity, price, booking,
provider, schema, analytics or customer-data change; existing server actions
remain authoritative. Revert source for rollback; the optional UI collapse
preference is harmless and does not grant access.

Validation: navigation/collapse persistence/footer/language component tests;
actual EN/ES light/dark guest-route browser checks for zero desktop header/gap,
fixed rail during scroll, compact brand, reachable 480px menu, dock/rail map
boundaries and responsive rental flows. Complete hosted check/build/browser and
exact production source/visual acceptance remain required. Physical device and
authenticated production writes are not inferred from fixtures.

## 2026-10-26 | Cinematic AkiSelector energy and transitions

The login selector now uses five distinct vector-mask materials: Pasa flame
tongues/cinders, Duermo tidal ribbons, Coches diagonal velocity trails, HQ
precision orbital tracks and Business spectral curtains. The existing generic
effect IDs remain compatible with the private lab. Every activation has a
brief lens flare, dissipating wave and glass reflection. Outgoing artwork stays
mounted for a 650ms opacity decay; incoming energy ramps over 280ms while card
travel eases over 680ms. Interrupted changes converge via CSS transitions,
without JavaScript animation frames or timeouts. Inactive material loops pause.

Mouse hover previews only energy and retains selection, roving focus, current
app and href geometry; pointer exit restores selected energy. Touch/pen retain
swipe browsing and direct icon navigation with the compatibility-click guard.
Keyboard input clears hover preview. EN/ES, referral-only links, preserved
login drafts, mobile placement and administrator-only lab boundaries remain.
Both explicit motion-off and OS reduced motion remove loops/transitions/flare.

Dependencies: shared React engine/CSS in Pasa, Duermo, Coches and HQ; equivalent
DOM adapter and identical CSS in Business. Business engine CSS, adapter CSS and JS URLs advance to
v2/v3/v3 and its effective paid release cache to v156, including release assertions.
No authentication exchange, session, API, tenant/role, database, storage,
analytics, payment, provider configuration or Android binary change. This is
web-delivered presentation. Rollback restores source and advances static asset
versions/cache again. Source and real-browser evidence is recorded in the PR;
full CI, production deployment and physical-device acceptance are separate gates.

## 2026-10-26 | Product-specific AkiSelector opening stories

The five login choices opt into an optional product arrival independently from
the reusable ember/breeze/bloom/solar/aurora idle effect. Pasa drops a discovery
pin and sparks; Duermo rolls and softly lands a suitcase; Coches sends a red
coupe with spinning wheels and a light wake across the foreground; free AkiHQ
gathers locations into a management hub; operations AkiBusiness wakes a till
and prints a receipt. Each decorative vector story plays once over 1.25–1.7s,
then disappears as its material rises into the sustained hovering/orbit phase.
The Coches idle is slower and includes a red orbital arc. Returning to an app
restarts its story; uninterrupted idle does not replay it. Generic lab effects
remain compatible without product stories unless the caller opts in.

Dependencies: AkiSelector option arrival, WorkspaceSelector adapter, shared CSS
and the equivalent static Business DOM adapter. All artwork is inline SVG masks
and CSS; no image/provider calls, animation timers or new packages. Decorative
actors ignore pointer events and are hidden from assistive technology. Direct
links are immediate, with no animation wait; browsing, safe referral/locale
URLs, drafts, keyboard focus, swipe suppression and auth/session/permissions
remain intact. Reduced motion and motion-off hide opening stories and keep
static idle artwork. Business engine CSS v3 / adapter CSS v3 / JS v4 and the
effective release cache v157 advance together with release assertions.

Validation includes all five actual actor animations becoming visible, finishing
once and handing off to full idle opacity, plus source/component/browser parity.
The current report records completed checks and separate broader map acceptance.
No production data, SQL, storage, billing, analytics, provider configuration or
Android binary changes. Source revert plus fresh static versions is rollback.
GitHub publication is still awaiting the explicit authorization requested earlier;
no push, PR, merge or deployment is implied by this design refinement.

## 2026-10-26 | Mouse dragging, corner arrows and branded login names

The public login AkiSelector supports primary-button mouse dragging alongside
touch/pen swipes. Cards follow a bounded horizontal pointer offset; capture
starts only after 10px of horizontal intent, leaving ordinary clicks and
vertical touch scrolling intact. Release outside the scene is supported. A
45px horizontal release browses one enabled option, with wraparound; shorter
drags snap back and suppress their compatibility click. Pointer cancellation
and capture loss clear temporary offsets. Modified/right/middle clicks retain
ordinary link behavior, and starting a later pointer/keyboard action clears the
click guard. Native HTML link/image dragging is prevented within the scene.

Two localized, keyboard-accessible 44px circular arrows sit in the lower scene
corners. They browse in place without submitting, navigating or replacing the
login form; the separate footer/caption stays hidden. Generic lab callers opt
in via showBrowseArrows. Names use the individual product accent and self-hosted
Poppins Semibold 600, with a dark label backing for legibility over effects.
The Latin WOFF2 is vendored from @fontsource/poppins 5.3.0 with its SIL OFL;
requests stay on the app's own origin. Existing startup/idle artwork, motion-off,
reduced motion, EN/ES/referral-safe hrefs, current-product semantics, drafts and
auth/session/role behavior remain. No API, database, billing, analytics, provider
or native Android binary change.

Shared React engine, adapter, CSS and font assets are copied across four Next
apps; Business has an equivalent DOM adapter and matching assets. Business
engine/adapter CSS v4, JS v5 and paid release cache v158 include the font and
retain production assertions. Acceptance covers real mouse capture/release
outside the scene, follow-pointer geometry, short-drag suppression, immediate
subsequent clicks, arrows/wraparound/keyboard, touch and cancelled gestures,
loaded font/brand colours and responsive label bounds. Regression evidence is
recorded in the PR; exact-head CI and production verification gate release.
Rollback restores source with fresh static cache/asset versions; no data rollback.

Capture-transfer follow-up: descendant lostpointercapture events are ignored;
only loss on the scene cancels its gesture. Mouse movement with no primary
button held clears a pending gesture after an uncaptured outside release.
Acceptance now uses real Chromium touch input originating on a card descendant,
and covers outside vertical release followed by ordinary mouse hover.

## 2026-10-31 | Complete the open Coches source PRs together

PR #62 integrates the independent analytics safeguards from #62 and the confirmed
Coches measurement destination from #64, the bilingual privacy/access changes
from #51, and the disabled review-policy foundation from #61 on current main
`e6f89a0682aa14eedce736bd19d0b1bda4f335fa`. The existing coming-soon page, signup
flag, launch-waitlist disclosure, public crawler/noindex gate and canonical
metadata are preserved. The privacy merge must not erase the newer waitlist
policy. These changes do not launch rentals, adult verification or reviews.

Analytics defaults to the owner-confirmed Coches web stream `G-N208MPSFXW`.
An optional build-time `NEXT_PUBLIC_GA4_MEASUREMENT_ID` override is supported;
explicit blank/invalid/copied configuration, noncanonical hosts, denied consent and
server-restricted visitors cannot load the tag. Ads, Signals and personalization
remain denied; revocation and remount cleanup remain covered by the component
suite. Google-side collection and production source readback are separate from
these tests and must be recorded in the PR's completed release receipt.

Both age-assurance flags remain unset/false. No provider signup, private
attestation write, shared migration, verification claim, review UI or customer
transaction is part of this source release. The provider/evidence/moderation and
privacy-lifecycle work listed in VERIFIED_REVIEWS_20261026.md still gates future
activation. Manual deletion instructions reflect the existing owner-approved
policy; this release does not delete accounts or certify backup cleanup.

Focused local checks at this source checkpoint: 21 analytics effect cases, 31
age-policy/reader cases and 11 shared account/privacy rendering cases passed.
The privacy cases assert the preserved bilingual launch-waitlist/Turnstile copy.
Required hosted full lint/typecheck/tests/Next build, native-account browser,
public crawler and Cloudflare package checks are required on the integrated
head before merge; final IDs/results and live limits belong in the PR receipt.
Rollback is a normal source revert; do not restore a cross-product GA stream,
activate indexing, remove account restrictions or alter customer data.

## 2026-11-01 | Shared AkiPasa logo refresh

Replace this product's local AkiPasa selector/membership/return-page artwork with
the founder-approved movement mark from elguiriashing/akipasa. Versioned
`brand/v3/pasa-2026.svg` and refreshed historical Pasa SVG/PNG aliases preserve
existing links and cached manifests. Current product logos and native icons are
unchanged. No auth, locale/navigation destination, API, RLS, database, customer
record, billing, consent or provider configuration change. Shared asset hashes
are compared with AkiPasa; product-specific checks and CI are recorded in the PR.
Rollback reverts only these asset/reference sources.
