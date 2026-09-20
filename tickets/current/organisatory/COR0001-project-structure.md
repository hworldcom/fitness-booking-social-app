# Coordination COR0001: Project structure organisation

- Status: In progress
- Created: 2026-09-20
- Last updated: 2026-09-20
- Milestone: Cross-cutting application foundation
- Converted from: Not applicable — created as a coordination record
- Tracked development tickets: completed [DEV0030 — Frontend screen module boundaries](../../archive/frontend/DEV0030-frontend-screen-module-boundaries.md), [DEV0031 — Preview data and domain boundaries](../frontend/DEV0031-preview-data-and-domain-boundaries.md), paired [DEV0015 — Database foundation](../backend/DEV0015-supabase-database-foundation.md) + [DEV0025 — Next.js backend boundary](../backend/DEV0025-nextjs-backend-boundary.md), and [DEV0027 — Phantom wallet connection](../blockchain/DEV0027-phantom-wallet-connection-foundation.md); a future Anchor/program foundation ticket is still required
- Related records: [DEV0008 — Frontend foundation](../../archive/frontend/DEV0008-repx-club-frontend.md) is the delivered baseline; DEV0016–DEV0018 and DEV0023–DEV0024 are downstream development tickets as mapped below

## Objective and context

Coordinate the repository's gradual move from a frontend-preview layout into the agreed modular structure for frontend, Next.js backend, database, and Solana program work. Keep one Next.js/TypeScript package for the MVP, introduce boundaries only when real modules need them, and make file ownership and dependency direction clear enough that future developers can locate behavior without reconstructing prior conversations.

The current app has thin route files under `src/app`, feature screens collected under `src/components`, and fixture/local-preview logic under `src/lib`. There is no `src/server`, `src/solana`, `supabase`, or `programs` implementation yet. This coordination record owns the cross-ticket structure map only; peer development tickets own actual feature behavior, dependencies, migrations and program code.

## Scope and non-goals

- In scope: maintain the target directory map and dependency direction; inventory current modules before moves; plan bounded frontend/shared-module relocations; coordinate the real `src/server`, `src/solana`, `supabase`, and `programs` boundaries introduced by their owning development tickets; keep README and work records aligned with the structure that actually exists; maintain a flat work map that distinguishes direct delivery, downstream, dependency and historical relationships.
- Out of scope: directly implementing any source, configuration, migration, test or product behavior; a single large refactor; empty scaffolding; moving the Next.js app into an `apps/web` workspace; adding a separate backend service; creating directories that no executable module uses; or introducing another coordination/child hierarchy.

## Expected behavior and edge cases

The intended structure is:

```text
src/
  app/                 Next.js routes, layouts, Route Handlers and thin adapters
  features/            User-facing modules grouped by product capability
  components/          Shared UI and layout primitives
  domain/              Framework-independent rules, values and response contracts
  server/              Authentication, services, database access and server Solana adapters
  solana/              Browser-safe client configuration, generated bindings and transactions
supabase/               Configuration, the sole SQL migration history and deterministic seeds
programs/               Anchor/Rust programs in their own workspace boundary
tests/                  Unit, integration and browser evidence grouped as coverage grows
```

### Current-to-target inventory

This inventory is the reviewed starting map. It assigns ownership without claiming that the target paths already exist. Each move or split belongs to the linked development ticket and must preserve behavior.

| Current files                                                                                               | Intended ownership and target                                                                                                                                                                                                                  | Owning development ticket and constraints                                                                                                                                                                                                                                                                            |
| ----------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `src/app/**/page.tsx`, `layout.tsx`, `not-found.tsx`, `icon.svg`, `globals.css`                             | `src/app` remains the Next.js routing, metadata, global-style and route-adapter boundary. The substantial Search and How-it-works presentation moves behind thin route files under `src/features/discovery`; all public URLs remain unchanged. | [DEV0030](../../archive/frontend/DEV0030-frontend-screen-module-boundaries.md). Keep route parameters, `notFound()` behavior, metadata and global CSS behavior stable.                                                                                                                                               |
| `src/components/challenges.tsx`, `events.tsx`, `explore.tsx`, `class-detail.tsx`, `feed.tsx`, `profile.tsx` | Feature screens move to capability-owned modules under `src/features/challenges`, `events`, `discovery`, `classes`, `feed`, and `profile`.                                                                                                     | [DEV0030](../../archive/frontend/DEV0030-frontend-screen-module-boundaries.md). This is an import/ownership refactor, not permission, persistence or product behavior work.                                                                                                                                          |
| `src/components/discovery-filters.tsx`, `discovery-extras.tsx`, `shell.tsx`, `ui.tsx`                       | Shared layout and reusable interface modules remain under `src/components`, with discovery helpers grouped only if the move improves their public import boundary.                                                                             | [DEV0030](../../archive/frontend/DEV0030-frontend-screen-module-boundaries.md). Do not force feature-to-feature imports or split components solely to populate directories.                                                                                                                                          |
| `src/lib/fixtures.ts`, `events.ts`, `demo.ts`                                                               | Separate framework-independent catalogue/event/preview contracts and state transitions under `src/domain` from seeded local-preview records under `src/features/preview`.                                                                      | [DEV0031](../frontend/DEV0031-preview-data-and-domain-boundaries.md). Preserve every fixture identifier, value, validation rule and state transition. Do not present fixtures as server authority.                                                                                                                   |
| `src/lib/discovery.ts`, `explore.ts`                                                                        | Feature-owned search/filter/query logic moves under `src/features/discovery`, consuming shared domain contracts without importing browser storage.                                                                                             | [DEV0031](../frontend/DEV0031-preview-data-and-domain-boundaries.md). Preserve normalization, filter and date/time semantics.                                                                                                                                                                                        |
| `src/lib/store.ts`                                                                                          | Browser-only preview persistence moves under `src/features/preview`; it remains outside `src/domain` and future `src/server`.                                                                                                                  | [DEV0031](../frontend/DEV0031-preview-data-and-domain-boundaries.md). Preserve the `repx-club-preview-v1` storage key, corruption recovery, memory fallback and reset behavior.                                                                                                                                      |
| `tests/*.test.ts`, `tests/browser/*.spec.ts`                                                                | `tests` remains the evidence boundary. Imports follow owning moves; grouping changes only when a later slice adds enough coverage to justify it.                                                                                               | [DEV0030](../../archive/frontend/DEV0030-frontend-screen-module-boundaries.md) and [DEV0031](../frontend/DEV0031-preview-data-and-domain-boundaries.md) update affected imports and run the existing suites.                                                                                                         |
| No current `src/server`, `src/solana`, `supabase`, or `programs` implementation                             | Add each boundary only with the first executable module that owns it.                                                                                                                                                                          | [DEV0015](../backend/DEV0015-supabase-database-foundation.md) + [DEV0025](../backend/DEV0025-nextjs-backend-boundary.md) own `src/server`/`supabase`; [DEV0027](../blockchain/DEV0027-phantom-wallet-connection-foundation.md) owns the first `src/solana` slice; a future Anchor foundation ticket owns `programs`. |

### Direct development work

The tickets below are flat peer development tickets tracked by this coordination record. They create or reorganize the repository boundaries described above. Coordination COR0001 does not move runtime code itself.

| Structural part                         | Development ticket                                                                                                                                                                             | Concrete responsibility                                                                                                                                                     | Delivery relationship                                                                                                                                  |
| --------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Feature screen ownership                | [DEV0030 — Frontend screen module boundaries](../../archive/frontend/DEV0030-frontend-screen-module-boundaries.md)                                                                             | Create the required `src/features/<capability>` paths, move complete screen implementations, keep shared UI in `src/components`, and thin Search/How-it-works routes.       | Completed first frontend structural slice; later feature work can use the delivered boundaries.                                                        |
| Domain, discovery and preview ownership | [DEV0031 — Preview data and domain boundaries](../frontend/DEV0031-preview-data-and-domain-boundaries.md)                                                                                      | Split the mixed `src/lib` modules across pure `src/domain`, feature-owned discovery logic and browser-only preview fixtures/storage.                                        | Second frontend structural slice; implement after or in explicit coordination with DEV0030 so both tickets do not move the same imports independently. |
| Server and database foundation          | [DEV0025 — Next.js backend boundary](../backend/DEV0025-nextjs-backend-boundary.md) together with [DEV0015 — Supabase database foundation](../backend/DEV0015-supabase-database-foundation.md) | Introduce real `src/server` configuration/repository/service modules and the `supabase` migration/seed boundary. Enforce that client code cannot import privileged modules. | These two tickets start together. DEV0025 must not create empty server scaffolding before DEV0015 supplies real modules.                               |
| Browser-safe Solana boundary            | [DEV0027 — Phantom wallet connection foundation](../blockchain/DEV0027-phantom-wallet-connection-foundation.md)                                                                                | Introduce the first real `src/solana` configuration, Wallet Standard connection/state modules and wallet UI integration, fixed to Devnet.                                   | Independent of DEV0015 and the frontend moves; it must finish before DEV0016 consumes a connected account.                                             |
| Anchor/Rust program boundary            | Future dedicated Anchor foundation ticket                                                                                                                                                      | Introduce `programs/`, the Anchor workspace, program source/tests and generated-client contract using the selected current toolchain.                                       | **Not yet ticketed.** Create and link the peer development ticket before the first `programs/` or generated program-client edit.                       |

The following tickets are downstream consumers, not direct structure-delivery tickets. They add feature behavior inside boundaries established above and retain their own implementation evidence:

| Downstream ticket                                                                                          | How it relates to the structure                                                                                                                                                  |
| ---------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [DEV0016 — Phantom authentication and demo access](../backend/DEV0016-phantom-auth-and-demo-access.md)     | Uses `src/server` from DEV0015/DEV0025 and the connected account from DEV0027 to add verified authentication and wallet bindings. It does not own either base boundary.          |
| [DEV0017 — Persistent catalogue and private drafts](../backend/DEV0017-persistent-catalogue-and-drafts.md) | Replaces selected preview reads/writes through server services and repositories after DEV0015–DEV0016; it must map data into shared contracts instead of exposing database rows. |
| [DEV0018 — Membership booking and confirmed visits](../backend/DEV0018-membership-booking-and-visits.md)   | Adds booking/attendance workflows within the established server/domain boundaries after DEV0015–DEV0017.                                                                         |
| [DEV0023 — Shared social feed and Cheers](../backend/DEV0023-shared-social-feed-and-cheers.md)             | Adds social services, persistence and UI consumption after identity/catalogue/attendance sources exist.                                                                          |
| [DEV0024 — Verified challenge activity](../blockchain/DEV0024-verified-challenge-activity.md)              | Consumes later verified challenge projections and DEV0023's feed contract; it does not create the Anchor program or base Solana client boundary.                                 |

Recommended sequence for the current plan:

1. Implement DEV0030, followed by DEV0031, when prioritizing the existing frontend cleanup.
2. Implement DEV0027 independently when prioritizing the wallet connection; frontend cleanup is not a prerequisite.
3. Start DEV0015 and DEV0025 together for the database/server foundation.
4. Implement DEV0016 only after both DEV0015 and DEV0027 are complete, then progress through DEV0017, DEV0018 and DEV0023 in dependency order.
5. Create the Anchor foundation ticket before program work; later chain projection work enables DEV0024.
6. Complete Coordination COR0001 only after every direct structural development ticket has delivered its boundary and the final repository/import review passes.

Generated Playwright output under `test-results/` is not source or durable review evidence. The root [`.gitignore`](../../../.gitignore) already ignores it, no files below it are tracked, and tickets retain the observed results needed for later review.

Directory names describe ownership rather than deployment units. `src/app` remains the routing boundary; route files delegate business workflows. Client modules cannot import `src/server`. Database rows do not become UI contracts. Browser-safe wallet/client code cannot contain server credentials or claim verified chain state. The Anchor program cannot depend on web/database implementation.

Existing files move only as part of a prepared, reviewable development ticket with import updates and regression evidence. A feature spanning UI, backend and blockchain keeps one business contract while its modules remain in their appropriate boundaries. Avoid duplicated domain types and generic catch-all folders. Preserve the explicit local preview until owning persistence tickets replace it; a directory move cannot silently convert fixtures into authority.

## Assumptions, decisions, and dependencies

The adopted architecture remains a modular monolith: one root Next.js package, Supabase PostgreSQL/Auth, and a separate Anchor/Rust program directory. Introduce an npm workspace only when a second JavaScript runtime or independently consumed package exists. Ticket DEV0025 and DEV0015 establish the first real server/database modules. Ticket DEV0027 establishes browser-safe Solana connection modules. A future blockchain ticket must establish the Anchor workspace and generated program client before program integration.

This coordination record does not replace development-ticket plans or evidence and never authorizes implementation. Before any structural implementation edit, create or update the owning peer development ticket, link it here, and record the exact before/after file map. Start structural work through that ticket rather than creating the complete target tree in advance.

## Coordination plan

1. Maintain the reviewed current-to-target inventory above as development tickets refine or deliver it. Record any ownership deviation before moving files.
2. Deliver the existing frontend in two bounded slices: DEV0030 moves screen modules and thins substantial routes; DEV0031 separates preview fixtures/storage from framework-independent domain and discovery logic. Preserve public URLs, fixture values and preview storage behavior.
3. Apply the server structure through DEV0025 + DEV0015 and later backend tickets: `src/server` contains real configuration, repositories, services, authorization, verification and jobs with enforced client-import denial.
4. Apply the browser Solana structure through DEV0027 and later transaction tickets: `src/solana` contains only browser-safe configuration/client/generated code; server verification remains under `src/server/solana`.
5. Create `supabase/` through DEV0015 and `programs/` through a future dedicated Anchor foundation ticket, following their native migration/workspace conventions and ignore rules.
6. Apply ticket DEV0032's contributor rule so future coordination records name their direct development tickets, distinguish other relationship types, state delivery order, remain one level deep and never supply commit references.
7. Organise tests when each owning slice adds evidence, update README to describe only directories that exist, validate import direction and build/browser behavior, and maintain this coordination record with development-ticket status and deviations.

## Acceptance criteria

- [ ] AC1: A reviewed current-to-target file map and linked peer development tickets cover every planned move; no implementation begins directly under this coordination record.
- [ ] AC2: Existing frontend routes remain stable and thin, feature/shared/domain modules have clear ownership, and the local preview retains its storage/data behavior after any frontend organisation slice.
- [ ] AC3: Real backend and browser-Solana modules follow the `src/server` and `src/solana` boundaries with enforced client/server dependency direction; no secret, database driver, or server verifier enters a client bundle.
- [ ] AC4: Supabase migrations/seeds and the Anchor program workspace live in their dedicated top-level boundaries when their owning tickets deliver them; generated/build artifacts remain ignored and source inputs are documented.
- [ ] AC5: README, record links and validation commands match the actual repository tree; linked development tickets contain exact move maps, contracts, tests and limitations. Lint, typecheck, build, relevant domain/integration/browser checks, and boundary checks pass for implemented slices.

## Validation plan

Each development ticket validates its own moves and behavior. This coordination record reviews the final repository tree, import graph/boundary enforcement, duplicate domain definitions, Next.js route stability, client bundle isolation, README accuracy, record links and accumulated integration evidence. Do not claim the target structure complete because empty directories exist. Application checks are selected by each affected slice; the final review runs the full established lint, typecheck, build, domain and browser suite plus available database/program checks.

## Progress and integration record

Created on 2026-09-20 to make the previously discussed project-structure plan durable before backend, wallet and program modules are added. The target modular-monolith map, dependency direction, flat development-ticket work map, non-goals and final-review expectations are now recorded here. The [MVP specification](../../../docs/mvp-spec.md), [repository README](../../../README.md), and [ticket index](../../README.md) link this coordination record.

Coordination started on 2026-09-20. The source and test inventory now assigns every existing module to its intended boundary. Completed [DEV0030](../../archive/frontend/DEV0030-frontend-screen-module-boundaries.md) owns screen/route moves, and [DEV0031](../frontend/DEV0031-preview-data-and-domain-boundaries.md) owns the mixed `src/lib` separation. The related ticket-area work was delivered separately by [DEV0029](../../archive/organisatory/DEV0029-ticket-area-archive-organisation.md).

DEV0030 delivered the first frontend structural slice. Complete Feed, Explore/discovery, Challenge, Event, Class and Profile screens now live under `src/features`; Search and How-it-works routes are thin adapters; shared shell/interface/discovery controls remain under `src/components`. The final import audit found no shared-to-feature or cross-capability feature imports. Eighteen unit tests and 28 desktop/mobile browser scenarios passed, as did lint, typecheck, formatting and a webpack production build; the ticket records the restricted environment's Turbopack IPC limitation. DEV0031 remains open for the separate domain/preview boundary, so this coordination record remains In progress.

The root `.gitignore` already contains `/test-results/`. `git ls-files test-results` returned no tracked files, and `git check-ignore -v test-results test-results/example.png` matched that rule. No ignore-file edit was necessary: Playwright screenshots, traces and last-run metadata are reproducible output, while durable observations remain in the owning ticket records.

No source directory, dependency, import, runtime configuration, database, wallet integration, program, application test or deployment changed in this coordination update. Runtime restructuring has not started. Link each development ticket's delivered file map and summarize only cross-ticket integration evidence here as work proceeds.

The repository [README](../../../README.md) now opens with a standalone project description before linking to the detailed specification. It identifies RepX Club's audience and core discovery/challenge/social flows, explains the planned Phantom/Solana Devnet and test-EURC boundary, distinguishes bookings, payments, attendance and social activity, and states that only the local frontend preview is currently implemented. This makes the repository understandable without implying that the planned backend, authentication, wallet, payments or program already exist. No product requirement or implementation status changed.

The work breakdown now explicitly labels DEV0030, DEV0031, the paired DEV0015/DEV0025 work and DEV0027 as peer structural delivery tickets. It separately lists DEV0016–DEV0018 and DEV0023–DEV0024 as downstream consumers, records their dependency sequence, and exposes the missing Anchor foundation ticket rather than leaving its relationship implicit. This clarification changes no implementation scope or runtime behavior.

[Ticket DEV0032](../../archive/organisatory/DEV0032-flat-coordination-record-workflow.md) replaces the earlier parent/child wording with a flat record model. This file is now named and headed as Coordination COR0001; every implementation part maps to one peer development ticket; dependencies, downstream consumers, follow-ups and historical baselines remain separate; and the coordination ID cannot be used in commit subjects. Development tickets retain their own implementation/validation evidence, while this record keeps progress and integration evidence. This workflow change alters no product or runtime contract.

[Ticket DEV0033](../../archive/organisatory/DEV0033-prefixed-work-record-identifiers.md) later introduced separate identifier namespaces. It preserved the numeric portion of every development ticket under a `DEV` prefix and migrated this record from legacy Coordination 0028 to `COR0001`. Current navigation and links now use the prefixed IDs; preserved historical prose may still name the earlier number when it describes work performed before the migration. At that point, the next available identifiers were `DEV0034` and `COR0002`.

[Ticket DEV0034](../../archive/organisatory/DEV0034-explicit-coordination-membership.md) makes direct coordination ownership reciprocal and visible in each DEV record's opening metadata. DEV0015, DEV0025, DEV0027, DEV0030 and DEV0031 link directly to this record; downstream DEV0016–DEV0018 and DEV0023–DEV0024 explicitly remain independent. This record also declares that it was created as coordination rather than converted from a development ticket.

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
- **Implementation checks — not run:** no source structure change has started, so AC1–AC5 remain unchecked. Application tests, lint, typecheck, build, import-boundary checks, database checks and program checks are deferred to the owning development tickets.

## Risks, limitations, and follow-ups

A large mechanical move would create conflicts and obscure behavioral changes, so implementation must remain incremental through DEV0030 and DEV0031. The final Anchor/client layout depends on the chosen current toolchain, and a separate worker/package depends on demonstrated runtime needs. Create the Anchor foundation ticket before adding `programs/`.

## Completion and review references

- Completed: Not completed.
- Commit: Not applicable — coordination-record IDs are not used in commit subjects. Relevant commits will reference their owning development tickets.
- Review: Planning self-review only; no independent implementation review.
- Deployment: None.
