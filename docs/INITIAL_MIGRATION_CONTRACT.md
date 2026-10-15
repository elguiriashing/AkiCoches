# akicoches — AkiSuite product extraction

**Status:** Migration groundwork only. No deployed application yet.

- Canonical domain: `https://akicoches.com`
- Existing route/legacy host: `https://akiconduzco.akipasa.com`
- Source of truth for extraction: `elguiriashing/akipasa` (branch `master`)
- Shared backend: existing Supabase project `vhpbvcfkcteswlsdjrfl` (never recreate or reset)

## Migration rules

1. **Keep the original `akipasa` repo and live Worker unchanged.** Copy or extract; do not delete original code.
2. Extract a _working_ independently buildable application and its transitive dependencies, not just matching route files.
3. Work in an isolation branch with CI; build and test a preview before production DNS changes.
4. No database schema changes, destructive migrations, auth provider changes, or legacy redirects as part of initial extraction.
5. Never commit secrets or production private keys; use Cloudflare environment secrets.
6. Maintain shared user IDs, business entitlements, RLS policies and booking/claim records.
7. Cross-root-domain SSO must use a proper auth redirect/token exchange; do not assume cookies can be shared.

## Initial source inventory (verify against latest master)

- `src/app/akiconduzco/**`
- `src/components/AkiConduzco*`
- `src/lib/akiconduzco*.ts`
- `src/app/[locale]/business/mobility/**`
- `tests/akiconduzco.test.ts`

## Product considerations

Rebrand external UI from AkiConduzco to AkiCoches, but preserve database table names, stable identifiers and existing booking references until an explicit compatible migration.

## Definition of ready

- [ ] Independent build, typecheck and product-focused tests pass
- [ ] Pages/Workers preview deployed to an isolated hostname
- [ ] Product login, logout, OAuth callback and password recovery pass
- [ ] Key protected APIs maintain authorization and tenant isolation
- [ ] English and Spanish screens and responsive layouts tested
- [ ] Secret bindings and env vars configured without leaking keys
- [ ] New domain HTTPS validated before cutover
- [ ] Old hostname redirects only after verified replacement
- [ ] Rollback path documented and tested

## Coordination

This repo is a destination for the Codex extraction. The initialization README is a handoff contract, not an implementation. Avoid merging incomplete placeholders as an application release.

## Original destination agent instructions

# Codex migration instructions — AkiCoches

This repository is being extracted from `elguiriashing/akipasa` at its latest `master`. The existing main production repo and Worker MUST remain functional and unchanged by this extraction.

Canonical domain: `https://akicoches.com`. Legacy host: `https://akiconduzco.akipasa.com`.

- Read `README.md` first. Treat it as the product-specific extraction contract.
- Copy the actual application and all necessary transitive dependencies. Do not fabricate replacement functionality or ship placeholders.
- Implement **independent** Next.js/OpenNext Cloudflare build scripts, Wrangler configuration and CI.
- Preserve Supabase user identities, tenancy/RLS protections and business/booking identifiers. Shared project ref: `vhpbvcfkcteswlsdjrfl`.
- Keep real credentials in Cloudflare secrets. No private keys in Git or PRs.
- Cross-domain logins require explicit OAuth redirect allowlists and robust sessions; do not rely on cross-site cookies.
- Build/test and preview before attaching new production hostnames. Do not modify legacy redirects until the new system is verified.
- Write down skipped functionality and risks in the PR; no silent regressions.
- Coordinate with ongoing Codex work to avoid overlapping branches or forced pushes.
