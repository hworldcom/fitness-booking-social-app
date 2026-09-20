# Ticket DEV0031: Preview data and domain boundaries

- Status: Draft
- Created: 2026-09-20
- Last updated: 2026-09-20
- Milestone: Cross-cutting application foundation
- Coordination: [COR0001 — Project structure](../organisatory/COR0001-project-structure.md)
- Related records: direct peer development ticket tracked by [Coordination COR0001 — Project structure](../organisatory/COR0001-project-structure.md); follows completed peer [DEV0030 — Frontend screen module boundaries](../../archive/frontend/DEV0030-frontend-screen-module-boundaries.md); prepares clean contracts for [DEV0015 — Database foundation](../backend/DEV0015-supabase-database-foundation.md) and [DEV0017 — Persistent catalogue and drafts](../backend/DEV0017-persistent-catalogue-and-drafts.md)

## Objective and context

Separate the mixed modules currently under `src/lib` into framework-independent domain contracts/rules, feature-owned discovery logic, and an explicitly browser-only local-preview boundary. Make later persistence work able to replace preview adapters without treating fixture records, browser storage or database rows as shared business contracts.

Today `fixtures.ts` and `events.ts` combine types, validation and seeded records; `demo.ts` combines preview state transitions with those records; `discovery.ts` and `explore.ts` contain feature query logic; and `store.ts` owns React/browser persistence. Their behavior is tested, but the generic directory does not communicate these different dependency and authority boundaries.

## Scope and non-goals

- In scope: extract shared catalogue/event/preview types and pure invariants under `src/domain`; move discovery search/filter logic under `src/features/discovery`; move seeded fixture data and the React/localStorage adapter under `src/features/preview`; update imports/tests and record the exact split map.
- Out of scope: changing fixture values or IDs, storage schema/key, filtering/search semantics, event/challenge validation, UI layout, adding database repositories or network calls, migrating localStorage, implementing authentication/wallet behavior, or deleting the explicit local preview.

## Expected behavior and edge cases

Framework-independent domain modules import neither React, Next.js, browser APIs, fixture data nor server/database modules. Preview adapters may depend on domain contracts but remain visibly non-authoritative. Discovery logic consumes domain contracts and supplied records rather than acquiring server authority. Browser storage continues using `repx-club-preview-v1`, resets malformed state safely, falls back to memory when unavailable and preserves current subscriptions.

Every seeded identifier, date, amount, label and relationship remains unchanged. Existing validation, filtering, search, booking, cancellation, sharing, hiding and draft transitions return the same results. Database work can later map rows into domain/view contracts without importing preview fixtures.

## Assumptions, decisions, and dependencies

This is a dependency-boundary refactor, not a domain redesign. Prefer explicit small modules over a new generic `lib` or catch-all types file, but do not fragment cohesive rules merely to increase directory count. The final exact split must be written into this ticket before source edits. Coordinate import paths with DEV0030 if both tickets touch a feature entry point; complete them sequentially rather than mixing their implementation records.

## Implementation plan

1. Inventory every export and importer from `src/lib`, then record the exact target module and whether it is a contract/rule, discovery operation, seeded preview record or browser adapter.
2. Extract framework-independent catalogue, event and preview types/rules into cohesive `src/domain` modules without changing exported shapes or outcomes.
3. Move search/filter/query behavior under `src/features/discovery` and make input data dependencies explicit.
4. Move fixtures and browser persistence under `src/features/preview`; keep the existing storage version, recovery, subscription and reset contracts.
5. Update source/test imports and add a focused boundary check for forbidden React/browser/fixture imports from `src/domain`. Run all existing unit, lint, type, format, build and browser checks and record exact results.

## Acceptance criteria

- [ ] AC1: `src/domain` contains only framework-independent contracts and pure rules, with an automated or static check preventing React, Next.js, browser, fixture and server imports.
- [ ] AC2: Seeded records and browser storage live under an explicit preview boundary and retain all values, IDs, the `repx-club-preview-v1` key, corruption recovery, memory fallback and reset behavior.
- [ ] AC3: Discovery search/filter logic has clear feature ownership and preserves current query normalization, activity/date/time filtering and related-result semantics.
- [ ] AC4: Existing unit/browser behavior, lint, typecheck, formatting and production build pass; the implementation record maps every former `src/lib` export to its resulting module and identifies any compatibility export retained temporarily.

## Validation plan

Run export/import inventory and forbidden-import checks, existing domain tests with unchanged behavioral cases, `npm test`, `npm run lint`, `npm run typecheck`, `npm run format:check`, `npm run build` and `npm run test:e2e`. Exercise malformed/unavailable storage and reset behavior through the existing browser suite. Compare representative fixture outputs or serialized values before and after the split. Database, wallet, program and devnet checks do not apply because no external authority is introduced.

## Implementation record

Planning created from COR0001's reviewed inventory. No `src/lib` module has moved or split, and no data, storage or runtime contract has changed. Replace this section with the final export map, affected files, boundary enforcement and actual evidence when implementation begins.

## Validation results

- **Planning structure — passed:** the repository ticket validator found this unique indexed Draft ticket at the expected current/frontend path and resolved all local Markdown targets across the repository.
- **Formatting — passed:** Prettier accepted this ticket.
- **Implementation checks — not run:** no `src/lib` file has moved or split, so AC1–AC4 and the planned application checks remain outstanding.

## Risks, limitations, and follow-ups

Splitting mixed modules can create circular imports or unintentionally change serialized data. Establish dependency direction before moves and compare behavior rather than relying on typechecking alone. Later database tickets must map persisted records into the contracts instead of exposing Drizzle row types or replacing preview data silently.

## Completion and review references

- Completed: Not completed.
- Commit: Not created.
- Review: Planning self-review only; no independent implementation review.
- Deployment or release: None.
