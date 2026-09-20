# Coordination COR0001: Project structure organisation

- Status: In progress
- Created: 2026-09-20
- Last updated: 2026-09-20
- Milestone: Cross-cutting application foundation
- Converted from: Not applicable — created as a coordination record
- Tracked development tickets: completed [DEV0030 — Frontend screen module boundaries](../../archive/frontend/DEV0030-frontend-screen-module-boundaries.md), completed [DEV0031 — Preview data and domain boundaries](../../archive/frontend/DEV0031-preview-data-and-domain-boundaries.md), [DEV0015 — Database foundation](../backend/DEV0015-supabase-database-foundation.md), [DEV0025 — Next.js backend boundary](../backend/DEV0025-nextjs-backend-boundary.md), and [DEV0027 — Phantom wallet connection](../blockchain/DEV0027-phantom-wallet-connection-foundation.md); dedicated server-Solana verification and Anchor/program-client foundation tickets are still required
- Related records: [DEV0008 — Frontend foundation](../../archive/frontend/DEV0008-repx-club-frontend.md) is the delivered baseline; DEV0016–DEV0018 and DEV0023–DEV0024 are downstream development tickets as mapped below

## Objective and context

Coordinate the repository's gradual move from a frontend-preview layout into the agreed modular structure for frontend, Next.js backend, database, and Solana program work. Keep one Next.js/TypeScript package for the MVP, introduce boundaries only when real modules need them, and make file ownership and dependency direction clear enough that future developers can locate behavior without reconstructing prior conversations.

The current app has thin route files under `src/app`, capability-owned screens under `src/features`, reusable interface modules under `src/components`, pure contracts and rules under `src/domain`, and explicitly non-authoritative fixture/local-state adapters under `src/features/preview`. There is no `src/server`, `src/solana`, `supabase`, or `programs` implementation yet. This coordination record owns the cross-ticket structure map only; peer development tickets own actual feature behavior, dependencies, migrations and program code.

## Scope and non-goals

- In scope: maintain the target directory map and dependency direction; inventory current modules before moves; plan bounded frontend/shared-module relocations; coordinate the real `src/server`, `src/solana`, `supabase`, and `programs` boundaries introduced by their owning development tickets; keep README and work records aligned with the structure that actually exists; maintain a flat work map that distinguishes direct delivery, downstream, dependency and historical relationships.
- Out of scope: directly implementing any source, configuration, migration, test or product behavior; a single large refactor; empty scaffolding; moving the Next.js app into an `apps/web` workspace; adding a separate backend service; creating directories that no executable module uses; or introducing another coordination/child hierarchy.

## Expected behavior and edge cases

The target is a modular monolith with four execution environments and one shared pure-code boundary. These are trust and responsibility boundaries, not four repositories or four mutually exclusive top-level folders. A feature may cross them through explicit adapters, but each file and implementation deliverable has one owner.

### Delivered baseline and pending boundaries

The repository must be described from its actual state rather than the final diagram alone:

| Source boundary                                                | Current state                                                                                                                               | Owner or next action                                                                                                                                                                                                                                                    |
| -------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `src/app`, `src/features`, `src/components`                    | Present. Routes are thin adapters, complete screens have capability ownership, and reusable UI remains shared.                              | Completed [DEV0030 — Frontend screen module boundaries](../../archive/frontend/DEV0030-frontend-screen-module-boundaries.md). Treat this as the frontend baseline; do not move it again merely to make the tree symmetrical.                                            |
| `src/domain`, `src/features/discovery`, `src/features/preview` | Present. Pure contracts/rules, discovery operations and non-authoritative preview data/state now have explicit owners; `src/lib` is absent. | Completed [DEV0031 — Preview data and domain boundaries](../../archive/frontend/DEV0031-preview-data-and-domain-boundaries.md). Preserve its injected-data and browser-only adapter boundaries for later persistence work.                                              |
| `src/server`, `supabase`                                       | Not yet present.                                                                                                                            | [DEV0015 — Database foundation](../backend/DEV0015-supabase-database-foundation.md) creates database artifacts/access modules; [DEV0025 — Next.js backend boundary](../backend/DEV0025-nextjs-backend-boundary.md) adds boundary enforcement around those real modules. |
| `src/solana`                                                   | Not yet present.                                                                                                                            | [DEV0027 — Phantom wallet connection](../blockchain/DEV0027-phantom-wallet-connection-foundation.md) creates the first browser-safe client slice.                                                                                                                       |
| `src/server/solana`                                            | Not yet present and not owned by an existing direct ticket.                                                                                 | Create a dedicated server verification/projection ticket before adding it.                                                                                                                                                                                              |
| `programs`, generated program bindings                         | Not yet present and not owned by an existing direct ticket.                                                                                 | Create a dedicated Anchor/program-client foundation ticket before adding them.                                                                                                                                                                                          |

### Runtime, trust, and authority boundaries

| Boundary               | Source locations                                                                                            | Responsibility and authority                                                                                                                        | Explicit limit                                                                                                                    |
| ---------------------- | ----------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| Browser frontend       | `src/app/**/page.tsx`, client portions of layouts, `src/features`, `src/components`, `src/features/preview` | Render screens, collect input, maintain browser-only preview state, initiate server or wallet operations and present confirmed results.             | Browser state is not authentication, durable shared state, payment proof, chain finality or server authorization.                 |
| Shared pure domain     | `src/domain`                                                                                                | Define framework-independent values, response contracts and deterministic rules shared by browser and server.                                       | Owns no persistence or runtime authority and performs no browser, database, network, framework or RPC I/O.                        |
| Next.js server         | `src/app/**/route.ts`, Server Actions and server-only modules under `src/server`                            | Authenticate actors, authorize actions, orchestrate workflows, call repositories/external adapters and map trusted results into response contracts. | Thin request adapters do not contain business transitions or raw SQL; the server cannot override on-chain authority.              |
| PostgreSQL/Supabase    | Deployed PostgreSQL plus source-controlled `supabase` migrations, policies and seeds                        | Authoritative durable off-chain state, relational constraints, row security and query integrity.                                                    | Database rows are storage shapes, not UI/domain contracts; schema code does not own application workflows or on-chain settlement. |
| Browser Solana adapter | `src/solana/client` and browser transaction modules                                                         | Discover/connect Phantom, use public Devnet configuration, construct transactions and request user signatures.                                      | A connection or submitted signature is not application authentication, ownership binding, finality or successful settlement.      |
| Server Solana adapter  | `src/server/solana`                                                                                         | Verify signatures, accounts and finality; project confirmed chain events; reconcile chain and database state.                                       | Never prompts a user wallet or handles user private keys; verification does not replace program-side authorization.               |
| Solana program         | `programs`                                                                                                  | Authoritative on-chain accounts, instructions, signer checks and settlement invariants.                                                             | Does not depend on Next.js, PostgreSQL or browser implementation details.                                                         |

### Target source structure

Create a path only with the first executable module or source artifact that uses it:

```text
src/
  app/                    Next.js framework adapters
    **/page.tsx           UI route composition
    **/route.ts           Thin server request/response adapters when needed
  features/               User-facing capability modules
    preview/              Explicit browser-only fixtures and local persistence
  components/             Reusable UI and layout primitives
  domain/                 Pure shared contracts, values and deterministic rules
  server/                 Code that must never enter a browser bundle
    auth/                 Authentication and authorization primitives
    services/             Application workflows
    db/                   Database configuration, mappings and repositories
    solana/               Trusted chain verification, projection and reconciliation
  solana/                 Browser-safe and runtime-neutral Solana modules
    client/               Wallet discovery, public RPC configuration and transactions
    generated/            Generated program codecs/clients without browser or server secrets
supabase/                 Sole SQL migration history, policies, configuration and seeds
programs/                 Anchor/Rust workspace and on-chain program tests
tests/                    Unit, integration and browser evidence as coverage grows
```

`src/app` is a Next.js framework boundary rather than a synonym for frontend. A `page.tsx` normally composes frontend modules; a `route.ts` is a backend adapter. A Server Component may call an explicit `src/server` query service, but it must not import a repository or database driver directly.

`src/domain` is shared code rather than a fifth deployment. It standardizes values and pure behavior without becoming an authority. PostgreSQL rows and Solana account/event data are mapped into domain or response contracts at their adapters.

`src/solana/generated` is runtime-neutral generated source. Its future Anchor/program-client ticket owns the generation contract. Browser transaction code and server verification may consume those bindings without sharing wallet state, credentials or authority.

### Dependency and import rules

| Source                                      | May depend on                                                                               | Must not depend on or claim                                                                                                     |
| ------------------------------------------- | ------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| `src/domain`                                | Other pure domain modules                                                                   | React, Next.js, browser APIs, preview fixtures, database/RPC clients, `src/server`, or data authority.                          |
| `src/components`                            | `src/domain` and other shared UI modules                                                    | Complete feature screens, `src/server`, database drivers or feature-specific authority.                                         |
| `src/features`                              | `src/components`, `src/domain`, explicit preview modules and browser-safe `src/solana` APIs | `src/server`, raw database types, server secrets or cross-feature imports; compose multiple features in route adapters instead. |
| `src/app/**/page.tsx` and layouts           | Features/components/domain; explicit server query services only while remaining server-only | Repositories, raw SQL, database drivers or business transitions in route files. Client modules cannot import `src/server`.      |
| Route Handlers and Server Actions           | `src/server` services and domain input/output contracts                                     | Raw SQL, duplicated authorization or core workflow logic in the framework adapter.                                              |
| `src/server/services` and `src/server/auth` | Domain contracts plus repository and external-adapter interfaces                            | React, browser storage, wallet-provider state or trusting browser-supplied identity/role claims.                                |
| `src/server/db`                             | Domain contracts, validated server configuration and database libraries                     | UI/feature modules, browser APIs or exposing database rows as public contracts.                                                 |
| `src/solana/client`                         | Domain values, runtime-neutral generated bindings and browser wallet/RPC libraries          | `src/server`, database code, privileged credentials or claims of verified finality.                                             |
| `src/server/solana`                         | Domain values, runtime-neutral generated bindings, server configuration and RPC libraries   | React, wallet prompts, user signing keys or unverified data as authoritative activity.                                          |
| `supabase` and `programs`                   | Their native migration/program toolchains                                                   | Imports from the Next.js application; integration occurs through database and generated/RPC adapters.                           |

### Direct development work

The records below are flat peers. Each structural deliverable has one owner even when tickets start together or validate a shared integration point. COR0001 coordinates them but does not implement their work.

| Structural deliverable                        | Single owning development ticket                                                                                               | Concrete ownership                                                                                                                                                                        | Integration relationship                                                                                               |
| --------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| Frontend screen ownership                     | Completed [DEV0030 — Frontend screen module boundaries](../../archive/frontend/DEV0030-frontend-screen-module-boundaries.md)   | Delivered capability-owned screens, reusable shared UI and thin Search/How-it-works route adapters under the existing `src/app`, `src/features` and `src/components` boundaries.          | Completed baseline. Later tickets consume it without reopening the move.                                               |
| Pure domain, discovery and preview separation | Completed [DEV0031 — Preview data and domain boundaries](../../archive/frontend/DEV0031-preview-data-and-domain-boundaries.md) | Delivered the exact `src/lib` export moves into `src/domain`, `src/features/discovery` and `src/features/preview`, including automated boundary rules and behavior-preservation evidence. | Completed after DEV0030; database-backed features can map into the resulting contracts without importing preview data. |
| Database schema and access foundation         | [DEV0015 — Supabase database foundation](../backend/DEV0015-supabase-database-foundation.md)                                   | Owns database dependencies, `supabase` configuration/migrations/policies/seeds and the real `src/server/db` configuration, mapping and repository modules required by the foundation.     | Starts in coordination with DEV0025 but retains sole ownership of these files and database evidence.                   |
| Next.js server boundary enforcement           | [DEV0025 — Next.js backend boundary](../backend/DEV0025-nextjs-backend-boundary.md)                                            | Owns server-only/import enforcement, the service/repository dependency contract, boundary checks and documented thin-adapter rules applied to the real modules introduced by DEV0015.     | Starts with DEV0015; validates its placement without duplicating schema, connection or repository ownership.           |
| Browser wallet/Solana client foundation       | [DEV0027 — Phantom wallet connection foundation](../blockchain/DEV0027-phantom-wallet-connection-foundation.md)                | Owns the first `src/solana/client` configuration/provider/state slice and its wallet UI integration.                                                                                      | Independent of database work; must finish before DEV0016 consumes a connected account.                                 |
| Trusted server Solana verification            | Future dedicated server-Solana ticket                                                                                          | Will own `src/server/solana`, finality/account verification, projection and reconciliation boundaries.                                                                                    | **Not yet ticketed.** Create it before the first trusted server chain module.                                          |
| Anchor program and generated-client contract  | Future dedicated Anchor foundation ticket                                                                                      | Will own `programs`, Anchor workspace configuration/tests and the reproducible `src/solana/generated` contract.                                                                           | **Not yet ticketed.** Create it before program or generated-client work.                                               |

The following records are downstream consumers. They implement product behavior inside established boundaries and are not direct owners of COR0001's structural foundation:

| Downstream ticket                                                                                          | Relationship to the structure                                                                                                                     |
| ---------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| [DEV0016 — Phantom authentication and demo access](../backend/DEV0016-phantom-auth-and-demo-access.md)     | Uses DEV0015/DEV0025 server/database boundaries and DEV0027's connected account for verified authentication and wallet binding.                   |
| [DEV0017 — Persistent catalogue and private drafts](../backend/DEV0017-persistent-catalogue-and-drafts.md) | Replaces selected preview reads/writes through services and repositories, mapping rows into shared contracts rather than exposing storage shapes. |
| [DEV0018 — Membership booking and confirmed visits](../backend/DEV0018-membership-booking-and-visits.md)   | Adds booking and attendance workflows within the established server/domain/database boundaries.                                                   |
| [DEV0023 — Shared social feed and Cheers](../backend/DEV0023-shared-social-feed-and-cheers.md)             | Adds social services, persistence and UI consumption after identity, catalogue and attendance sources exist.                                      |
| [DEV0024 — Verified challenge activity](../blockchain/DEV0024-verified-challenge-activity.md)              | Consumes later verified chain projections and DEV0023's feed contract; it does not create the base program or server verification boundary.       |

Recommended sequence:

1. Preserve completed DEV0030 as the frontend screen baseline.
2. Preserve completed DEV0031 as the domain/discovery/preview baseline before persistence work replaces preview adapters.
3. Implement DEV0027 independently when prioritizing wallet connection.
4. Start DEV0015 and DEV0025 together but keep their file ownership and evidence separate: DEV0015 creates the real database artifacts/access modules; DEV0025 supplies and validates the server boundary rules around them.
5. Implement DEV0016 after DEV0015 and DEV0027, then progress through DEV0017, DEV0018 and DEV0023 in dependency order.
6. Create the server-Solana verification and Anchor/program-client tickets before adding `src/server/solana`, `programs` or generated program bindings; later verified projections enable DEV0024.
7. Complete COR0001 only after every direct structural ticket is completed or explicitly replaced/cancelled and the final tree, import, client-bundle and integration review passes.

Generated Playwright output under `test-results/` is reproducible validation output rather than source or durable review evidence. The root [`.gitignore`](../../../.gitignore) ignores it, and owning tickets retain the observations needed for review.

Directory categories organize ownership; they do not erase cross-boundary flows. Browser modules cannot import `src/server`. Database rows and program accounts do not become UI contracts. User-controlled wallets sign transactions; server verification and the program establish trusted outcomes. Existing files move only through their owning prepared DEV ticket with exact maps and regression evidence.

## Assumptions, decisions, and dependencies

The adopted architecture remains a modular monolith: one root Next.js package, Supabase PostgreSQL/Auth, and a separate Anchor/Rust program boundary. Frontend, backend, database and blockchain describe responsibility and authority rather than four repositories. Introduce an npm workspace only when a second JavaScript runtime or independently consumed package exists.

DEV0015 and DEV0025 begin together but have distinct ownership. DEV0015 creates the database artifacts and real database-access modules. DEV0025 creates and validates server-only dependency enforcement around them. DEV0027 establishes browser-safe Solana connection modules. Separate future tickets must establish trusted server-Solana verification and the Anchor workspace/generated-client contract.

This coordination record does not replace development-ticket plans or evidence and never authorizes implementation. Before any structural implementation edit, create or update the owning peer development ticket, link it here, and record the exact before/after file map. Start structural work through that ticket rather than creating the complete target tree in advance.

## Coordination plan

1. Maintain the reviewed current-to-target inventory above as development tickets refine or deliver it. Record any ownership deviation before moving files.
2. Preserve DEV0030's delivered route/feature/shared-UI boundary and DEV0031's delivered preview/domain/discovery split without reopening either completed move.
3. Apply database ownership through DEV0015: `supabase` contains the sole schema history/policies/seeds and `src/server/db` contains real server-only access/mapping/repository modules.
4. Apply backend-boundary enforcement through DEV0025 around DEV0015's real modules. Later backend tickets add services/authentication/request adapters inside that direction without direct browser-to-database access.
5. Apply browser Solana structure through DEV0027 and later transaction tickets. Keep browser client code under `src/solana/client`; reserve `src/server/solana` for a future trusted-verification ticket and `src/solana/generated` plus `programs` for a future Anchor/program-client ticket.
6. Apply ticket DEV0032's contributor rule so future coordination records name their direct development tickets, distinguish other relationship types, state delivery order, remain one level deep and never supply commit references.
7. Organise tests when each owning slice adds evidence, update README to describe only directories that exist, validate import direction and build/browser behavior, and maintain this coordination record with development-ticket status and deviations.

## Acceptance criteria

- [ ] AC1: The current-to-target, runtime/authority, source ownership and import maps remain accurate; every structural deliverable has exactly one direct DEV owner or is explicitly blocked on a missing ticket.
- [x] AC2: DEV0030's completed route/feature/shared-UI boundary remains stable; DEV0031 delivers pure-domain, discovery and preview separation without changing public routes, fixture values or storage behavior.
- [ ] AC3: Database artifacts/access modules belong to DEV0015 and backend-boundary enforcement belongs to DEV0025; real server modules follow the documented service/repository direction and no privileged dependency enters a client bundle.
- [ ] AC4: Browser Solana, trusted server verification and the Anchor program/generated-client contract remain separate. Their owning tickets deliver only their paths and authority, with source inputs documented and generated/build artifacts ignored.
- [ ] AC5: README, record links and validation commands match the actual repository tree; linked development tickets contain exact move maps, contracts, tests and limitations. Lint, typecheck, build, relevant domain/integration/browser checks, and boundary checks pass for implemented slices.

## Validation plan

Each development ticket validates its own moves and behavior. This coordination record reviews the final repository tree, import graph/boundary enforcement, duplicate domain definitions, Next.js route stability, client bundle isolation, README accuracy, record links and accumulated integration evidence. Do not claim the target structure complete because empty directories exist. Application checks are selected by each affected slice; the final review runs the full established lint, typecheck, build, domain and browser suite plus available database/program checks.

## Progress and integration record

Created on 2026-09-20 to make the previously discussed project-structure plan durable before backend, wallet and program modules are added. The target modular-monolith map, dependency direction, flat development-ticket work map, non-goals and final-review expectations are now recorded here. The [MVP specification](../../../docs/mvp-spec.md), [repository README](../../../README.md), and [ticket index](../../README.md) link this coordination record.

Coordination started on 2026-09-20. The source and test inventory now assigns every existing module to its intended boundary. Completed [DEV0030](../../archive/frontend/DEV0030-frontend-screen-module-boundaries.md) owns screen/route moves, and completed [DEV0031](../../archive/frontend/DEV0031-preview-data-and-domain-boundaries.md) owns the former mixed `src/lib` separation. The related ticket-area work was delivered separately by [DEV0029](../../archive/organisatory/DEV0029-ticket-area-archive-organisation.md).

DEV0030 delivered the first frontend structural slice. Complete Feed, Explore/discovery, Challenge, Event, Class and Profile screens now live under `src/features`; Search and How-it-works routes are thin adapters; shared shell/interface/discovery controls remain under `src/components`. The final import audit found no shared-to-feature or cross-capability feature imports. Eighteen unit tests and 28 desktop/mobile browser scenarios passed, as did lint, typecheck, formatting and a webpack production build; the ticket records the restricted environment's Turbopack IPC limitation.

DEV0031 delivered the second frontend structural slice without moving DEV0030's screens. Catalogue/event contracts and deterministic rules now live under `src/domain`; search and filtering live under Discovery; fixtures, derived preview data, local state and browser storage live under `src/features/preview`; presentation formatters and state-free shared controls remain under `src/components`; and `src/lib` is gone. An automated import-boundary test plus restricted-domain-global lint rules enforce the direction. Nineteen unit/boundary checks and all 28 desktop/mobile browser scenarios passed, along with lint, typecheck, formatting and a webpack production build; the standard Turbopack build again hit the restricted environment's local port-binding limitation. COR0001 remains In progress for its database, server, wallet and unticketed Solana/program deliverables.

The implementation is recorded by commit `[DEV0030] Organize frontend screen modules`; the one-time preceding DEV0035 baseline commit made the previously ignored ticket system durable without mixing application files into that repository-maintenance change.

The root `.gitignore` already contains `/test-results/`. `git ls-files test-results` returned no tracked files, and `git check-ignore -v test-results test-results/example.png` matched that rule. No ignore-file edit was necessary: Playwright screenshots, traces and last-run metadata are reproducible output, while durable observations remain in the owning ticket records.

The DEV0036 architecture refinement changed no source directory, dependency, import, runtime configuration, database, wallet integration, program, application test or deployment. DEV0030 and DEV0031 are now the delivered structural slices; their application changes and evidence stay in those tickets. Link each later development ticket's delivered file map and summarize only cross-ticket integration evidence here.

The repository [README](../../../README.md) now opens with a standalone project description before linking to the detailed specification. It identifies RepX Club's audience and core discovery/challenge/social flows, explains the planned Phantom/Solana Devnet and test-EURC boundary, distinguishes bookings, payments, attendance and social activity, and states that only the local frontend preview is currently implemented. This makes the repository understandable without implying that the planned backend, authentication, wallet, payments or program already exist. No product requirement or implementation status changed.

The work breakdown now assigns each structural deliverable to one owner. DEV0015 owns database artifacts and access modules; DEV0025 owns server-boundary enforcement around those modules. DEV0030, DEV0031 and DEV0027 retain their individual frontend/domain-preview/browser-wallet boundaries. DEV0016–DEV0018 and DEV0023–DEV0024 remain downstream consumers. Trusted server-Solana verification and the Anchor/program-client foundation remain explicitly unticketed.

[Ticket DEV0032](../../archive/organisatory/DEV0032-flat-coordination-record-workflow.md) replaces the earlier parent/child wording with a flat record model. This file is now named and headed as Coordination COR0001; every implementation part maps to one peer development ticket; dependencies, downstream consumers, follow-ups and historical baselines remain separate; and the coordination ID cannot be used in commit subjects. Development tickets retain their own implementation/validation evidence, while this record keeps progress and integration evidence. This workflow change alters no product or runtime contract.

[Ticket DEV0033](../../archive/organisatory/DEV0033-prefixed-work-record-identifiers.md) later introduced separate identifier namespaces. It preserved the numeric portion of every development ticket under a `DEV` prefix and migrated this record from legacy Coordination 0028 to `COR0001`. Current navigation and links now use the prefixed IDs; preserved historical prose may still name the earlier number when it describes work performed before the migration. At that point, the next available identifiers were `DEV0034` and `COR0002`.

[Ticket DEV0034](../../archive/organisatory/DEV0034-explicit-coordination-membership.md) makes direct coordination ownership reciprocal and visible in each DEV record's opening metadata. DEV0015, DEV0025, DEV0027, DEV0030 and DEV0031 link directly to this record; downstream DEV0016–DEV0018 and DEV0023–DEV0024 explicitly remain independent. This record also declares that it was created as coordination rather than converted from a development ticket.

[Ticket DEV0036](../../archive/organisatory/DEV0036-explicit-architecture-boundaries.md) separates execution location, source ownership, data authority, import direction and ticket ownership. It preserves completed DEV0030, removes joint DEV0015/DEV0025 ownership, distinguishes browser/server/on-chain Solana paths and records the two missing foundation tickets. No application file or runtime behavior changed.

## Validation results

- **Planning links/status — passed:** the repository Markdown/ticket validator found 27 unique indexed tickets, 11 current and 16 archived records, and valid file/heading targets across all 45 Markdown files after indexing DEV0030 and DEV0031.
- **Record formatting — passed:** Prettier formatted this record, both direct frontend development tickets and the ticket index; the final check passed.
- **Generated-result ignore check — passed:** `.gitignore` contains the root-scoped `/test-results/` rule; `git ls-files test-results` produced no output, and `git check-ignore -v test-results test-results/example.png` identified `.gitignore:25` for both paths.
- **README description — passed:** Prettier accepted the updated README; the repository Markdown validator resolved its local targets; and a manual comparison against the specification's project status and C01–C03, C07, C09, C13, C16 and C19 confirmed the overview distinguishes the implemented preview from planned backend and on-chain behavior.
- **Work-breakdown clarity — passed:** manually compared the direct and downstream relationships with tickets DEV0015–DEV0018, DEV0023–DEV0025, DEV0027 and DEV0030–DEV0031. The future Anchor foundation remains explicitly unticketed and blocks only `programs/` work.
- **Flat coordination policy — passed:** completed [ticket DEV0032](../../archive/organisatory/DEV0032-flat-coordination-record-workflow.md) renamed this record and path, converted its work map to flat peer development tickets, added separate templates, restricted commits to development-ticket IDs and validated 28 indexed records plus all links across 47 Markdown files.
- **Prefixed identifier migration — passed:** completed [ticket DEV0033](../../archive/organisatory/DEV0033-prefixed-work-record-identifiers.md) migrated 28 development records to DEV IDs and this coordination record to COR0001. The final validator found 29 records with matching types, paths and index entries, and resolved links across all 48 Markdown files.
- **Explicit coordination membership — passed:** completed [ticket DEV0034](../../archive/organisatory/DEV0034-explicit-coordination-membership.md) added reciprocal metadata for the five direct DEV members and explicit independent status for all other DEV records. Validation found 29 DEV records with exactly one coordination field and confirmed that this record's tracked-development list matches every direct member.
- **DEV0030 frontend screen boundary — passed:** the completed ticket records the exact move map, clean import direction, successful 18-test unit suite, lint/type/format checks, webpack production build, 28-scenario desktop/mobile browser suite and representative visual review. Public routes and preview behavior remained stable.
- **Explicit architecture boundary review — passed:** completed [DEV0036](../../archive/organisatory/DEV0036-explicit-architecture-boundaries.md) compared this map with the actual post-DEV0030 tree and the four direct draft tickets. Runtime/authority, target-path and import tables now distinguish intentional adapters from conflicting ownership; every existing structural deliverable has one owner, while server-Solana and Anchor/program-client work remain visibly unticketed.
- **DEV0031 domain/preview boundary — passed:** the completed ticket records the exact export map, explicit discovery inputs, preview storage contract, shared-component prop adapters, automated import/global restrictions, successful 19-test unit/boundary suite, lint/type/format checks, webpack production build and 28-scenario desktop/mobile browser suite. Fixture values, public routes and local storage behavior remained stable.
- **Remaining implementation checks — not run:** DEV0015, DEV0025, DEV0027 and the missing server-Solana/Anchor tickets have not delivered their boundaries. Their database checks, server/client-bundle isolation, wallet rehearsal and program checks remain outstanding, so COR0001's AC1 and AC3–AC5 are not complete.

## Risks, limitations, and follow-ups

A large mechanical move would create conflicts and obscure behavioral changes, so remaining implementation must stay incremental after completed DEV0030. The exact Anchor/generated-client layout depends on the selected current toolchain, and a separate worker/package depends on demonstrated runtime needs. Create the server-Solana and Anchor/program-client tickets before their respective paths.

## Completion and review references

- Completed: Not completed.
- Commit: Not applicable — coordination-record IDs are not used in commit subjects. Relevant commits will reference their owning development tickets.
- Review: Planning self-review only; no independent implementation review.
- Deployment: None.
