# Ticket DEV0015: Supabase database foundation

- Status: Draft
- Created: 2026-09-19
- Last updated: 2026-09-20
- Milestone: M0 database foundation
- Coordination: [COR0001 — Project structure](../organisatory/COR0001-project-structure.md)
- Related tickets: [DEV0014 — Planning record](../../archive/backend/DEV0014-database-and-backend-plan.md), [DEV0008 — Frontend](../../archive/frontend/DEV0008-repx-club-frontend.md); implement the server boundary with [DEV0025](DEV0025-nextjs-backend-boundary.md); next [DEV0016](DEV0016-phantom-auth-and-demo-access.md)

## Objective and context

Establish repeatable PostgreSQL schema, secure runtime access and seeded catalogue data before connecting the frontend to a shared backend. Implement the [database recommendation and phases](../../../docs/mvp-spec.md#database-provider-recommendation--19-september-2026) and [migration contract](../../../docs/mvp-spec.md#migrations-environments-and-seed-boundaries). Supabase is the recommended provider, not yet a provisioned account.

## Scope and non-goals

- In scope: pinned Supabase local tooling, Drizzle/Postgres driver, server-only connection module, separate runtime/migration roles, a single SQL migration history, base identity/run/organization/venue/class/membership tables, constraints/indexes and deterministic catalogue seeds; redacted environment example and real setup/test commands.
- Out of scope: browser sign-in, exposing private business APIs, migrating localStorage, challenge settlement/financial tables, payments, visits, event publication, production deployment or paid upgrades. Do not rewrite the frontend or create every future table now.

## Expected behavior and edge cases

A clean local database can be migrated and seeded repeatedly without duplicate catalogue entities. A runtime connection cannot modify schema, bypass row policies or access private rows without valid context. Unclaimed demo profiles have no login/role authority. Organization and venue types support cafés as well as gyms; trainer affiliations can span venues. Every run-scoped relationship rejects cross-run references. Missing/malformed configuration fails explicitly without logging credentials. SQL constraints reject negative/excessive amounts, invalid times and duplicate membership identities where those fields exist.

## Assumptions, decisions, and dependencies

The user requested planning; implementation has not been authorized by this ticket's creation. Confirm the recommended provider/project and local runtime prerequisites when starting. Local Supabase may require Docker; hosted setup needs a selected project/region and separately supplied server secrets. Start on Free/local within the existing demo scope; no paid plan is required by the ticket. Use `supabase/migrations/` as the only applied migration history and Drizzle for typed queries. Runtime app tables live outside exposed API schemas, with default-deny RLS and least-privilege roles; policies for authenticated feature access arrive in subsequent slices. Implement [DEV0025](DEV0025-nextjs-backend-boundary.md) concurrently from the first server configuration/database edit so DEV0015's real modules establish the boundary without creating an earlier empty scaffold.

## Implementation plan

1. Inspect the installed framework and current Supabase/Drizzle tooling; begin DEV0025's `src/server` boundary with the real configuration and database modules introduced here; pin compatible packages and add server-only configuration validation, SSL and pooling settings.
2. Add SQL migrations for the phase-DEV0015 entities in the specification, including `auth.users` references through app profiles, run memberships, organizations/staff/venues, trainer affiliations, class sessions and seeded membership entitlements. Keep wallet binding and activity/financial state for later slices.
3. Add foreign keys, run-scoped uniqueness, typed timestamps/amounts and query indexes; lock down API exposure, schema privileges and default-deny private RLS. Keep migration privileges separate from the runtime role.
   Plan the separate restricted public catalogue read path under C17 for DEV0017; private default-deny rules must not become a blanket login requirement for Explore/Challenges. No browser Data API exposure is needed.
4. Seed catalogue/display profiles without creating fake Auth identities or assigning a visitor to Anna. Use stable slugs and explicit fixture provenance; support future-relative interactive schedules separately from fixed preview data.
5. Add disposable local database migration/constraint/role tests and Drizzle mapping drift verification. Document exact setup/environment and safe hosted migration procedure in README after commands exist.

## Acceptance criteria

- [ ] AC1: A fresh disposable local Supabase database applies all migrations and seeds twice predictably; mappings match the actual schema and no duplicate seeds appear.
- [ ] AC2: Base relationships, same-run constraints, uniqueness and invalid amount/time boundaries are enforced by PostgreSQL, not only form validation.
- [ ] AC3: Runtime role has no DDL/table ownership/BYPASSRLS and cannot read private rows without context; browser Data API cannot expose app tables; migration secrets never appear in bundles/logs.
- [ ] AC4: Existing frontend preview still runs explicitly without database configuration; database mode fails visibly on misconfiguration/outage rather than returning fabricated state.
- [ ] AC5: Actual setup/test commands and redacted environment names are documented; local tests, lint/types/build pass. Any hosted schema applied is identified and verified; no hosted completion is assumed from local tests.

## Validation plan

Use a disposable local database for clean apply, upgrade/reapply, seed idempotency, actual runtime-role denial and invalid-FK/unique/check cases. Exercise the selected driver/pooler mode, failure output redaction and schema/type drift. Run existing domain checks, lint, typecheck and build; browser regression only if app-mode/error UI changes. Do not reset a shared hosted project or claim database mocks prove its constraints.

## Risks, limitations, and follow-ups

Project/region selection, credentials and local Docker availability remain inputs. SQL reset tests are local-only. A running database does not establish user authorization; DEV0016 is required before private runtime endpoints are enabled. Later tables must arrive with their own feature's invariants/tests.

## Implementation record

Planning update, 2026-09-19 ([DEV0019](../../archive/frontend/DEV0019-public-discovery-access.md)): C17 explicitly requires public discovery. Base private-data restrictions remain; guest catalogue privileges/services will be introduced and tested in DEV0017.

Planning update, 2026-09-20 ([DEV0025](DEV0025-nextjs-backend-boundary.md)): keep the application backend in the existing Next.js package and establish its server-only/service/repository boundary as the first part of this ticket. The boundary must start with real DEV0015 modules rather than unused scaffolding.

Not started. This ticket defines future work only; no code, dependencies, database objects or service configuration have been created. Update this section with affected files, decisions/deviations, contracts and actual evidence during implementation.

## Validation results

Not run — implementation has not started. Planning/link checks do not satisfy the acceptance criteria above. Record exact implemented commands, environment, failures and passed results before completion.

## Completion and review references

- Completed: Not completed.
- Commit: Not created.
- Review: Planning self-review only; no independent implementation review.
- Deployment: None.
