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
