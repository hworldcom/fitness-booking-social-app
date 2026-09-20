# Ticket DEV0025: Next.js backend boundary

- Status: Draft
- Created: 2026-09-20
- Last updated: 2026-09-20
- Milestone: M0 backend foundation
- Coordination: [COR0001 — Project structure](../organisatory/COR0001-project-structure.md)
- Related tickets: [DEV0014 — Database and backend plan](../../archive/backend/DEV0014-database-and-backend-plan.md); implement with [DEV0015 — Supabase database foundation](DEV0015-supabase-database-foundation.md); establishes the boundary used by [DEV0016](DEV0016-phantom-auth-and-demo-access.md), [DEV0017](DEV0017-persistent-catalogue-and-drafts.md), [DEV0018](DEV0018-membership-booking-and-visits.md), [DEV0023](DEV0023-shared-social-feed-and-cheers.md), and later Solana integration tickets

## Objective and context

Keep the MVP application backend in the existing Next.js package while establishing a strict boundary between request adapters, application workflows, database access, and Solana verification. The current repository has a frontend preview and browser-local state but no server application layer. Define and enforce the boundary when the first real backend code is introduced so later authentication, persistence, booking, social, and chain work do not accumulate business logic in route files or client components.

This ticket implements the single-web-package architecture in [the MVP specification](../../../docs/mvp-spec.md#5-architecture-and-storage). It is deliberately paired with ticket DEV0015: start it as the first part of that database foundation, when `src/server` has real configuration and database modules to contain. Do not create an unused directory tree earlier, and do not postpone the boundary until feature endpoints have already been implemented.

## Scope and non-goals

- In scope: establish the server-only module boundary under `src/server`; define dependency direction for request adapters, services, repositories, shared domain contracts, and Solana adapters; protect server credentials and database modules from client imports; keep Next.js pages, Route Handlers, and Server Actions thin; document where background reconciliation will run and the conditions that justify a separate worker.
- Out of scope: implementing the database schema owned by DEV0015, authentication owned by DEV0016, persistent product flows owned by later tickets, creating placeholder modules for every future feature, introducing a separate API framework/service, selecting a hosting vendor, running continuous chain listeners, or implementing/deploying a Solana program.

## Expected behavior and edge cases

Server Components, Route Handlers, and Server Actions may adapt Next.js requests and responses, but authorization and business workflows call reusable application services. Database access occurs through server-only repositories; client components cannot import database drivers, privileged configuration, migration credentials, or reconciliation code. Public catalogue reads and protected mutations use explicit service entry points rather than direct browser database access. The existing local preview remains a clearly separate browser-only mode.

Wallet prompts and RPC calls never hold a SQL transaction open. User-controlled wallets continue to sign financial transactions. Browser-safe transaction construction and generated program clients may later live outside `src/server`, while finality checks, financial verification, projections, and reconciliation stay server-only. A lost response, retry, or background invocation must be able to call the same application workflow without duplicating business rules in an HTTP handler.

Short request/response work stays in Next.js. A server command or scheduled invocation may reuse the same services for bounded reconciliation. Create a separately deployed worker only when continuous polling, execution duration, independent scaling, or another runtime requirement is demonstrated and recorded in a follow-up ticket.

## Assumptions, decisions, and dependencies

The adopted MVP decision is one Next.js/TypeScript web package, Supabase PostgreSQL and Auth, and a separate Anchor/Rust program directory. “Backend in Next.js” means the HTTP and application-service layer shares the web package; PostgreSQL and Solana remain independent systems with their own authority. Business database operations go through the Next.js server layer. Browser Supabase usage is limited to the planned Auth integration.

Use `src/server` for modules that must never enter browser bundles. Keep shared, framework-independent value objects and response contracts outside that directory only when both browser and server need them. Do not expose Drizzle rows as the public UI contract. Inspect the installed Next.js version and its bundled/current documentation before choosing exact Server Action, Route Handler, caching, and server-only APIs.

Implementation should begin together with DEV0015, before its first server configuration or Drizzle module is added. The user has authorized this planning ticket, not backend implementation. Starting DEV0025 later than DEV0015 would defeat its purpose; starting it without DEV0015 would produce scaffolding without executable behavior.

## Implementation plan

1. At the start of DEV0015, inspect the installed Next.js version and confirm the supported server-only, Server Component, Route Handler, Server Action, and caching behavior used by the project.
2. Add only the `src/server` modules required by the database foundation, beginning with validated server configuration and database access. Mark the boundary with `server-only` protection and an import rule or equivalent build-time enforcement.
3. Establish dependency direction in code and documentation: Next.js adapters call application services; services call repositories and external adapters; repositories map PostgreSQL records; browser-safe domain/view contracts contain no secrets or database clients.
4. Keep any request adapter introduced by the paired work limited to input parsing, verified actor/context resolution, service invocation, and response mapping. Do not place business state transitions or raw SQL in `src/app`.
5. Define a callable server command/job entry point only when an owning financial or delivery ticket needs reconciliation. Record measurable extraction triggers before adding a separately deployed worker.
6. Update the README application structure and exact validation commands to describe the modules that actually exist. Record files, contracts, decisions, commands, and results in this ticket and DEV0015 without claiming later backend features.

## Acceptance criteria

- [ ] AC1: All server runtime code introduced by DEV0015 lives behind an explicit `src/server` boundary, and each added module supports real database-foundation behavior rather than placeholder scaffolding.
- [ ] AC2: Client modules cannot import privileged environment parsing, database drivers/repositories, migration credentials, or future reconciliation modules; lint/type/build checks detect a boundary violation and no server secret is included in a browser bundle or log.
- [ ] AC3: The implemented dependency direction is documented and observable: framework adapters depend on services, services depend on repositories/adapters, and shared UI contracts do not expose Drizzle row types or accept browser-supplied identity/role authority.
- [ ] AC4: The existing explicit local preview still builds and runs without backend configuration. Database mode and server configuration fail clearly when required values are missing instead of silently returning fixtures.
- [ ] AC5: README setup/structure and both tickets' implementation records state what exists, how it was verified, and when a separate worker would become necessary; no separate backend service or deployment is claimed.

## Validation plan

Add a focused boundary check that attempts or statically detects a client-to-server import, plus configuration tests that prove missing/malformed values fail without revealing secrets. Run ticket DEV0015's disposable database checks along with lint, typecheck, production build, existing domain tests, and the explicit preview smoke test. Inspect the production client output or framework build diagnostics for accidental server dependency/secret inclusion. If no request adapter or job exists in the foundation slice, record those parts as not applicable rather than adding a fake endpoint or worker solely for this ticket.

## Implementation record

Planning created on 2026-09-20 after reviewing the current frontend, specification, installed Next.js package, and tickets DEV0014–DEV0018. The decision is to keep the application backend in Next.js and introduce its code boundary with the first real backend slice, ticket DEV0015. No source directory, dependency, server endpoint, database connection, environment variable, worker, or deployment was added by this planning change.

Implementation has not started. Before the first implementation edit, change this ticket and DEV0015 to `In progress` and update both plans if the actual framework or deployment constraints require a different boundary.

## Validation results

Planning-only validation on 2026-09-20: reviewed the current source tree and confirmed there is no `src/server`, Supabase, Drizzle, authentication, API, worker, or program implementation to migrate. Checked the dependency and start sequence against the current architecture and DEV0015 scope. A Python local-link check passed for this ticket, DEV0015, the ticket index, and README; an `rg` uniqueness/section check confirmed one DEV0025 record with all required ticket sections. Prettier passed for this ticket and DEV0015. A combined Markdown check warned only that the existing compact tables in README and the ticket index are not padded into Prettier's aligned-table style; they were kept in the repository's current compact style. Application checks were not run because this change only creates and links a future implementation ticket; planning review does not satisfy AC1–AC5.

## Risks, limitations, and follow-ups

The exact hosting runtime and Supabase project remain unselected. Next.js request execution may not suit future continuous or long-running reconciliation; introduce a linked worker ticket when real duration, scheduling, or scaling evidence requires it. Solana program organization and generated client bindings require their own bounded M1 ticket before implementation.

## Completion and review references

- Completed: Not completed; backend implementation has not started.
- Commit: Not created.
- Review: Planning self-review only; no independent implementation review.
- Deployment: None.
