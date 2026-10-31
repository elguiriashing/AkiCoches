# Independent GA4 recovery: AkiCoches

Status: staged source, not an activated or verified production GA4 stream.

## Change impact

The root ConsentAnalytics component affects every route in EN/ES and both themes, for anonymous visitors and signed-in roles. Existing server-derived trackingAllowed and stored privacy choices remain authoritative and are intersected. No route, UI, database, account permission, Supabase storage, billing, pricing, Android binary or Firebase notification setting changes.

The copied AkiPasa destination and broken array-shaped gtag queue are removed. NEXT_PUBLIC_GA4_MEASUREMENT_ID must contain the verified AkiCoches web-stream measurement ID at build time. Missing/invalid IDs and the historical AkiPasa ID disable collection; there is no cross-product fallback. Only akicoches.com and www.akicoches.com can load the tag. Preview/local hosts cannot send events. Marketing consent does not activate Google Ads; Google Signals and advertising personalization remain disabled. Consent defaults precede configuration, revoked consent disables measurement and clears only GA cookies on this domain, and effect remounts do not duplicate configuration.

## Evidence and remaining release gates

On 27 October, the Cloudflare Worker akicoches and its production Workers Builds trigger c2af24a9-34c6-4503-b2d2-a500900b05c9 had no GA4 measurement-ID setting. The owner confirmed Google-side properties and reporting links were created in the earlier Codex session; this is not independent verification of collection. No Google properties, verification tokens, Search Console links, sitemaps or robots/indexing flags were recreated or changed. In particular AKICOCHES_INDEXING_ENABLED must not be enabled without the existing inventory/launch gate.

Twenty executable Node tests transpile the actual component and exercise its effects with isolated browser mocks. They passed locally on Node 22.16.0 using the installed TypeScript compiler. The separate read-only CI job repeats them with the exact lockfile. Mocked tests are not browser or Google endpoint acceptance; full existing lint/typecheck/build/browser CI remains mandatory.

Before merge/release: recover the existing AkiCoches GA4 web-stream G- ID from the Google setup record or Analytics Admin, verify its domain, and set NEXT_PUBLIC_GA4_MEASUREMENT_ID in the production build trigger. Do not use the numeric property ID or an Android app ID. Preserve all unrelated variables. Rebuild from the reviewed commit, verify live source SHA, then use a consented eligible browser session to check exactly one correct destination in the network panel and GA4 Realtime/DebugView. Denied consent, restricted users and preview hosts must produce no collection. Verify both locales and revoke consent. Reconcile this handoff with the repository's master/extraction/change-impact ledgers before release.

Search Console is separate: verify the already-linked property and published sitemap, retain private-route noindex policies, and respect the existing launch gate. Linking GA4 does not itself submit or index pages.

Rollback: remove the measurement-ID build variable and rebuild to stop collection; do not restore the copied AkiPasa destination. No data rollback is required. This PR makes no production configuration changes and does not replace uncommitted Codex files on Alex-Laptop.

## 31 October integration checkpoint

The existing stream ID was subsequently confirmed in PR #64 as `G-N208MPSFXW`.
The combined PR uses that independently owner-confirmed public product default
when the build override is absent. Explicit blank, invalid or copied-AkiPasa
overrides still fail closed, as do preview hosts, denied consent and restricted
accounts. The stronger remount/revocation safeguards remain. The old copied ID
and array queue are removed. Genuine GA receipt is tracked separately from
source/component CI. See the 31 October contract entry
and the PR release receipt for current deployment state; the earlier missing-ID
observation above is historical.
