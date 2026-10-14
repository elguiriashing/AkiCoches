# Extraction contract

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
