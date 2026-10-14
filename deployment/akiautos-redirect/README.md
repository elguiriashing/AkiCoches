# AkiAutos canonical redirect: staged artifact

This Worker implements the purchased-domain alias only: akiautos.com to
https://akicoches.com. It has no production routes and defaults to disabled.
Never attach its domain or set CUTOVER_VERIFIED=true before AkiCoches has passed
authenticated sandbox acceptance, certificate checks and deployment rollback.

Run `node --test akiautos-worker.test.mjs` from this directory. GET/HEAD paths
and query strings are preserved with a fixed HTTPS destination and 308 status.
An explicit harmless #redirected fragment prevents browser inheritance of an
unobservable source fragment that could contain an old authentication token.
Mutations and credential-bearing auth URLs are rejected; no cross-domain form
or PKCE-token replay is attempted. Redirects use no-store during migration so
the Worker response does not encourage intermediary caching that impedes rollback.

Deployment preparation uses a pinned Wrangler outside source checkouts:
`/workspace/.cloud-setup/tools/node_modules/.bin/wrangler deploy --dry-run`.
Actual upload and custom-domain attachment require usable Cloudflare access and
the migration acceptance gates. The preview URL alone does not accept an
unrecognized Host; validate the destination through a controlled staging hostname
and explicit deployment-specific hostname mapping before attaching akiautos.com.

This Worker must not be applied to the legacy CRM, Business, Duermo or rental
hosts: those hosts have existing cookies, PKCE verifiers, callbacks and active
sessions that need their original application to finish the in-flight flows.
Their callback exclusions and canonical cutovers are separate runbook steps.
