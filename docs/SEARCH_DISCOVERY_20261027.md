# AkiCoches: public search discovery recovery, 27 October 2026

## Baseline evidence

Canonical-origin browser inspection returned HTTP 200 XML for both discovery sitemaps. They were not absent. AkiCoches robots.txt disallowed the entire site and its runtime inventory flag was false. AkiDuermo allowed crawling in robots.txt but sent an unconditional `X-Robots-Tag: noindex, nofollow`, contradicting its public-page index metadata. Both conventional favicon.ico paths returned 404; both existing branded SVG icons returned 200.

These observations identify crawl/indexing inconsistencies. They do not prove the cause of Google's freshly submitted "Couldn't fetch" status. Re-submission and a successful Google fetch are separate acceptance checks.

## Scoped contract amendment and change impact

This is a narrow amendment to EXTRACTION.md, AKIPASA_MASTER.md and the change impact register's historical extraction noindex policy, following Alex's request to fix the submitted public sitemaps and Coches branding. Historical extraction notes are provenance, not the current production search policy.

The canonical homepage and membership page may be crawled independently of the existing rental-inventory approval gate. `AKICOCHES_INDEXING_ENABLED` stays false in production; `/map` and rental details stay excluded, and the sitemap does not advertise them until the existing gate is explicitly approved. Rendering assets are crawlable. Both false and true branches have regression coverage.

The conventional `/favicon.ico` is a 48px conversion of the existing burgundy/red canonical `public/brand/v3/coches.svg` artwork, not a new design. Metadata also retains SVG and explicitly declares the generated 192px PNG. The original SVG favicon was valid; the absent ICO alone does not establish why Google's property selector showed a globe. Crawl access is repaired, but Google's cached icon is not directly controllable by this code.

The sitemap's anonymous provider query still requires published branches and an active vehicle. A closed inventory gate avoids the query completely; both returned provider errors and thrown failures retain static public sitemap entries.

Only GET/HEAD for robots.txt and sitemap.xml bypass session refresh, after the existing trusted-host check. They create no auth cookies. Every ordinary page, account and booking API keeps its existing authentication flow. Approved preview and local hosts remain excluded from indexing; preview robots never advertises a canonical sitemap. Host, method, private-path and Auth-outage regressions cover these boundaries. EN/ES navigation, appearance, booking states, account eligibility, consent, billing, RLS, storage and provider credentials remain unchanged.

No GA4 property is created or reconfigured by this change. Existing GA4 recovery PRs remain independent and need their verified build-time web-stream IDs. No Firebase credential, push gate, migration, notification or Android binary changes.

## Validation and release acceptance

Local Node 22 execution covers the actual pure crawl-policy source and the ICO container. The dedicated read-only workflow runs those tests plus the real NextRequest/NextResponse middleware, robots and sitemap regressions against npm ci's locked dependencies. Existing full lint/type/test/build/browser/OpenNext checks remain required for the exact candidate head. Local syntax transpilation is not a full typecheck or CI pass.

Before merge, require every applicable CI check to succeed. After deployment, verify the exact source SHA, canonical robots and XML status/content-type, ordinary public-page headers, private-page exclusions, preview exclusion, favicon status, and EN/ES paths. Then re-submit the existing sitemap URLs in Search Console and record Google's later fetch result; neither submission nor HTTP 200 guarantees indexing. Never label a GitHub commit as live without deployment readback.

Rollback is a source revert and a verified previous Worker version; no database, customer record, role, billing or identity rollback is needed. Keep the rental inventory and production Firebase push gates unchanged.
