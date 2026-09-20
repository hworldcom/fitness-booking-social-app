# Ticket DEV0031: Preview data and domain boundaries

- Status: Ready
- Created: 2026-09-20
- Last updated: 2026-09-20
- Milestone: Cross-cutting application foundation
- Coordination: [COR0001 — Project structure](../organisatory/COR0001-project-structure.md)
- Related records: direct peer development ticket tracked by [Coordination COR0001 — Project structure](../organisatory/COR0001-project-structure.md); follows completed peer [DEV0030 — Frontend screen module boundaries](../../archive/frontend/DEV0030-frontend-screen-module-boundaries.md); prepares clean contracts for [DEV0015 — Database foundation](../backend/DEV0015-supabase-database-foundation.md) and [DEV0017 — Persistent catalogue and drafts](../backend/DEV0017-persistent-catalogue-and-drafts.md)

## Objective and context

Separate the mixed modules currently under `src/lib` into framework-independent domain contracts/rules, feature-owned discovery logic, and an explicitly browser-only local-preview boundary. Make later persistence work able to replace preview adapters without treating fixture records, browser storage or database rows as shared business contracts.

Today `fixtures.ts` and `events.ts` combine types, validation and seeded records; `demo.ts` combines preview state transitions with those records; `discovery.ts` and `explore.ts` contain feature query logic; and `store.ts` owns React/browser persistence. Their behavior is tested, but the generic directory does not communicate these different dependency and authority boundaries.

## Scope and non-goals

- In scope: extract shared catalogue/event contracts and reusable deterministic rules under `src/domain`; move discovery-owned search/filter logic under `src/features/discovery`; move seeded fixture data, derived preview discovery data, local state and the React/localStorage adapter under `src/features/preview`; separate shared presentation formatting from fixture data; remove feature dependencies from shared components; update all imports and tests; remove the obsolete `src/lib` modules; and add automated boundary checks.
- Out of scope: changing fixture values or IDs, storage schema/key, filtering/search semantics, event/challenge validation, UI layout, adding database repositories or network calls, migrating localStorage, implementing authentication/wallet behavior, or deleting the explicit local preview.

## Expected behavior and edge cases

Framework-independent domain modules import neither React, Next.js, browser APIs, fixture data nor server/database modules. Preview adapters may depend on domain contracts but remain visibly non-authoritative. Discovery operations consume domain contracts and supplied records; only the preview boundary acquires seeded records. Shared components consume domain types, values and callback/data props without importing a feature module. Browser storage continues using `repx-club-preview-v1`, resets malformed state safely, falls back to memory when unavailable and preserves current subscriptions.

Every seeded identifier, date, amount, label and relationship remains unchanged. Existing validation, filtering, search, booking, cancellation, sharing, hiding and draft transitions return the same results. Database work can later map rows into domain/view contracts without importing preview fixtures.

## Assumptions, decisions, and dependencies

This is a dependency-boundary refactor, not a domain redesign. Prefer explicit cohesive modules over another generic `lib` or catch-all types file. DEV0030 is complete: preserve its delivered route, feature-screen and shared-component locations rather than reopening those moves. Updating a shared component's props to remove feature ownership is in scope; moving a completed screen is not.

This ticket is categorized as frontend because it moves current preview modules. The resulting `src/domain` boundary is shared pure code with no browser, server, database or chain authority. `Draft`, `DraftInput` and their validation are challenge-domain contracts. `DemoState`, `DemoAction`, `Booking`, the reducer/parser and initial state describe the local preview implementation and therefore remain under `src/features/preview`; the reducer may read the preview class catalogue to preserve the existing membership-booking guard. Event records and validation are domain contracts, while the seeded `events` array is preview data. Currency and date formatting are presentation helpers rather than domain rules.

Discovery data dependencies become explicit. The preview boundary exports a derived `previewDiscoveryCatalogue` built from its seeded classes, studios, events and challenges. `searchCatalogue` and `relatedActivities` accept that catalogue as their first argument instead of importing fixtures. Filters continue accepting their record collections. No old `src/lib` compatibility barrels or re-exports will remain: this private application can update every source and test import atomically, and retaining aliases would hide boundary violations.

DEV0030 is the only prerequisite and is completed. DEV0015 and DEV0017 consume the resulting contracts later and do not block this refactor. There are no unresolved product or architecture decisions preventing implementation.

## Planned file and export map

| Current source/export                                                                                                              | Target                                                           | Planned contract                                                                                                                                                                         |
| ---------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `src/lib/fixtures.ts`: `Discipline`, `ChallengeMode`, `ClubChallenge`, `ClubClass`, `ClubStudio`                                   | `src/domain/catalogue.ts`                                        | Preserve the existing record shapes and literal unions. Preview records and persistence rows depend on these contracts rather than defining replacements.                                |
| `src/lib/fixtures.ts`: `challenges`, `classes`, `studios`, `people`; `src/lib/events.ts`: `events`                                 | `src/features/preview/catalogue.ts`                              | Preserve every seeded value, identifier, date, amount, label, order and relationship. These records remain explicitly non-authoritative preview data.                                    |
| `src/lib/fixtures.ts`: `formatEurc`; `src/lib/discovery.ts`: `challengeDate`; `src/lib/events.ts`: `eventDate`                     | `src/components/format.ts`                                       | Keep the current locale, currency, timezone and rendered output. These are shared presentation helpers and perform no data acquisition.                                                  |
| `src/lib/events.ts`: `ClubEvent`, `EventDraftInput`, `EventDraft`, `validateEventDraft`, `isEventDraft`, `eventFromDraft`          | `src/domain/events.ts`                                           | Preserve all input/output shapes, validation messages, limits and mapping behavior.                                                                                                      |
| `src/lib/demo.ts`: `Draft`, `DraftInput`, `validateDraft`; `src/lib/discovery.ts`: `ChallengeSort`, `discoverChallenges`           | `src/domain/challenges.ts`                                       | Keep challenge draft validation and deterministic challenge selection/sorting reusable by later adapters. `discoverChallenges` continues accepting the candidate collection explicitly.  |
| `src/lib/explore.ts`: `ActivityFilter`, `TimeFilter`, `ClassFilters`; `src/lib/discovery.ts`: `DiscoveryItem`, `relatedActivities` | `src/domain/discovery.ts`                                        | Keep shared discovery contracts and the reusable related-item selector pure. Change `relatedActivities` to `(catalogue, activity, excludeHref, venueId?)`; it must not acquire fixtures. |
| `src/lib/explore.ts`: `ACTIVITIES`, `TIME_OPTIONS`                                                                                 | `src/components/discovery-filters.tsx`                           | Keep the current option values, labels and order beside the controls that render them; export them only if a current consumer or test still requires the export.                         |
| `src/lib/explore.ts`: `filterClasses`, `filterStudios`, `filterEvents`                                                             | `src/features/discovery/filters.ts`                              | Preserve query trimming, activity/date/time boundaries, ordering and case-insensitive matching. Inputs remain explicit collections plus filter values.                                   |
| `src/lib/discovery.ts`: `searchCatalogue`                                                                                          | `src/features/discovery/queries.ts`                              | Change the signature to `(catalogue, query)`. Preserve Unicode normalization, all-terms matching, blank-query behavior and result order.                                                 |
| `src/lib/discovery.ts`: `publicCatalogue` and its fixture mapping                                                                  | `src/features/preview/discovery.ts`: `previewDiscoveryCatalogue` | Replace the zero-argument fixture-acquiring function with a derived preview value. Preserve item kinds, text, URLs, venue relationships and exclusion of private browser drafts.         |
| `src/lib/demo.ts`: `Booking`, `DemoState`, `INITIAL_STATE`, `DemoAction`, `reduceDemo`, `parseDemo`, `visibleBookings`             | `src/features/preview/state.ts`                                  | Preserve reducer transitions, validation/recovery, serialized version `1`, initial following state, visibility rules and the membership-class booking guard.                             |
| `src/lib/store.ts`: `dispatch`, `useDemo`, storage key and subscription implementation                                             | `src/features/preview/store.ts`                                  | Preserve the `repx-club-preview-v1` key, same-tab notifications, cross-tab storage handling, server snapshot and in-memory fallback. Keep the module browser-only.                       |
| Preview-aware root-shell composition                                                                                               | `src/features/preview/preview-shell.tsx`                         | Read preview storage state and pass `storageUnavailable` into the shared `Shell`; `src/app/layout.tsx` composes this adapter.                                                            |

After every importer moves, delete all six former modules under `src/lib`; do not leave compatibility files.

## Shared-component integration changes

- Keep `ChallengeCard` in `src/components/ui.tsx`, but make it presentational: accept `saved` and `onToggleSaved` props and remove its `useDemo` import. Existing Feed, Profile and Challenge feature owners already read preview state and will pass those values.
- Keep `Shell` in `src/components/shell.tsx`, add a `storageUnavailable` prop and remove its `useDemo` import. `PreviewShell` owns the preview hook and root composition.
- Keep `RelatedActivities` and `CopyLink` in `src/components/discovery-extras.tsx`. `RelatedActivities` receives already-selected `DiscoveryItem` records; Event and Challenge features select them with the pure domain helper and `previewDiscoveryCatalogue`. It neither acquires fixtures nor imports discovery/preview features.
- Keep the shared discovery controls in `src/components/discovery-filters.tsx`. Their option lists remain presentation data and their prop types come from `src/domain/discovery`.
- Update route adapters to import seeded records from the explicit preview catalogue. Do not move any completed DEV0030 screen or introduce feature-to-feature imports.

## Implementation plan

1. Mark this ticket `In progress`, run the existing unit suite as a behavioral baseline, and confirm the current export/import inventory against the map above before editing source.
2. Create the pure catalogue, challenge, event and discovery domain modules. Move only the listed contracts and deterministic rules, preserving names and behavior except for the documented explicit-catalogue parameter.
3. Create the preview catalogue, derived discovery catalogue, state, store and root-shell adapter. Preserve fixture data and the complete localStorage/state contract.
4. Move discovery filters and search into their planned feature modules. Update them to receive record collections explicitly and keep preview acquisition outside discovery operations.
5. Move presentation formatters and refactor `ChallengeCard`, `Shell`, `RelatedActivities` and discovery-filter imports as described above. Update feature callers and thin route adapters without moving completed screens or changing rendered behavior.
6. Update unit tests to import the owning modules and add `tests/boundaries.test.ts`. The boundary test must resolve relative and `@/` imports and reject: imports from outside `src/domain` by domain modules; `src/components` imports from `src/features` or `src/server`; and feature imports from `src/server` or a sibling feature, with `src/features/preview` as COR0001's explicit adapter exception. Add an ESLint `src/domain` override that rejects `window`, `document`, `navigator`, `localStorage`, `sessionStorage` and `fetch` so browser/network access cannot enter through globals.
7. Delete `src/lib`, prove that no source/test import still references it, run the complete validation plan and replace the planning record with exact implementation and acceptance evidence.

## Acceptance criteria

- [ ] AC1: Every former `src/lib` export has the owner and contract recorded in the planned map; all source/test imports use those owners; `src/lib` and compatibility re-exports no longer exist.
- [ ] AC2: `src/domain` contains only framework-independent contracts and pure deterministic rules. Automated import and restricted-global checks reject framework, component, feature, preview, server, browser and network dependencies from this boundary.
- [ ] AC3: Seeded records and browser storage live under `src/features/preview` and retain every value and ID, serialized version `1`, the `repx-club-preview-v1` key, corruption recovery, server snapshot, same/cross-tab subscription behavior, memory fallback and reset behavior.
- [ ] AC4: Discovery filters/search and shared related-item selection receive their collections explicitly and preserve current Unicode query normalization, all-term matching, blank-query behavior, activity/date/time boundaries, sorting, related-result semantics and exclusion of private drafts.
- [ ] AC5: Shared components import no feature module. Feed, Profile, Challenge, Event and root-layout composition supply preview state/data through the documented props/adapters, with no feature-to-feature import other than the explicit preview adapter exception and no moved DEV0030 screen.
- [ ] AC6: Existing unit and browser behavior, lint, typecheck, formatting and a production build pass. The implementation record documents every affected file, signature change, boundary rule, command result and material limitation.

## Validation plan

Run the current `npm test` before source edits and record its result as the behavioral baseline. During implementation, update the existing demo, discovery, event and explore tests to use the new owners without weakening assertions; add the focused import-boundary test; and retain coverage of invalid dates/amounts, booking guards, corrupted state, hidden/cancelled bookings, query normalization, time boundaries and related results.

After the move, verify the file/export map with `rg --files src/domain src/features/preview src/features/discovery src/components`, confirm `src/lib` no longer exists, and confirm `rg -n '@/lib/|src/lib' src tests` returns no stale source/test reference. Review the fixture move with Git's rename/diff output and compare the seeded counts, IDs, order and representative serialized preview state before and after.

Run `npm test`, `npm run lint`, `npm run typecheck`, `npm run format:check`, `npm run build` and `npm run test:e2e`. Exercise malformed/unavailable storage and reset behavior through the existing browser suite and review representative desktop/mobile routes for unchanged content and interactions. Run the standard build first; if the already-observed restricted-environment Turbopack IPC error recurs, record that exact failure and also run `npm run build -- --webpack` as the production-build check rather than describing the standard command as passed. Database, wallet, program and devnet checks do not apply because no external authority is introduced.

## Implementation record

Planning created from COR0001's reviewed inventory. [DEV0036](../../archive/organisatory/DEV0036-explicit-architecture-boundaries.md) later clarified that this ticket owns the exact `src/lib` move while `src/domain` becomes a shared authority-free dependency rather than a frontend runtime layer. Completed DEV0030 remains unchanged.

The readiness review on 2026-09-20 inventoried every current `src/lib` export and importer, resolved the preview-reducer/fixture coupling, assigned presentation formatting, made discovery data injection explicit, and specified how shared components stop importing preview or discovery features. It also chose atomic removal of `src/lib` and concrete automated boundary enforcement. No source module, data, storage or runtime contract changed during planning. Replace this section with the delivered file map, contract changes, rationale and evidence when implementation begins.

## Validation results

- **Readiness review — passed:** every current `src/lib` export and importer has a planned owner; shared-component integration, explicit discovery inputs, compatibility removal, boundary enforcement, implementation order and applicable checks are decided. DEV0030 is complete and downstream database work does not block starting.
- **Planning structure — passed:** DEV0031 remains the unique record with this ID, is indexed as Ready at its current/frontend path, and all local Markdown targets from this ticket and the ticket index resolve.
- **Formatting — passed:** Prettier accepted this ticket and the updated ticket index; `git diff --check` reported no whitespace errors in either file.
- **Implementation checks — not run:** no `src/lib` file has moved or split, so AC1–AC6 and the planned application checks remain outstanding.

## Risks, limitations, and follow-ups

Splitting mixed modules can create circular imports or unintentionally change serialized data. Follow the mapped dependency direction and compare behavior and fixture content rather than relying on typechecking alone. The shared-component prop changes touch several feature callers even though they must not change layout or behavior; validate each caller and the root shell. Later database tickets must map persisted records into the contracts instead of exposing Drizzle row types or replacing preview data silently.

## Completion and review references

- Completed: Not completed.
- Commit: Not created.
- Review: Planning self-review only; no independent implementation review.
- Deployment or release: None.
