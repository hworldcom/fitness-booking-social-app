# Ticket DEV0060: Replace challenge surfaces with access navigation

- Status: Completed
- Created: 2026-09-24
- Last updated: 2026-09-24
- Milestone: MVP product pivot and public presentation
- Coordination: [COR0005 — Fitness-access product pivot](../organisatory/COR0005-fitness-access-product-pivot.md)
- Related records: depends on completed [DEV0058 — Adopt the fitness-access MVP contract](../organisatory/DEV0058-fitness-access-mvp-contract.md); integrates copy/destinations with completed [DEV0059 — Rewrite public positioning and How it works](DEV0059-rewrite-public-positioning-and-guide.md); revises challenge surfaces delivered by [DEV0008](DEV0008-repx-club-frontend.md) and [DEV0020](DEV0020-discovery-and-how-it-works.md); preserves the authenticated profile boundary from [DEV0052](DEV0052-account-backed-personal-profile.md)

## Objective and context

Remove challenge- and reaction-oriented product surfaces from the current frontend preview and replace the primary information architecture with the access-focused direction. Visitors should navigate among discovery, active access and their account without encountering a Challenges primary tab, create-challenge call to action, prize/voting fixtures or reaction controls.

This ticket owns interface retirement and navigation/destination behavior. Completed DEV0059 separately owns the new public story and guide composition. Keeping those boundaries prevents its copy/design change from obscuring route, fixture, storage and navigation cleanup.

## Scope and non-goals

- In scope: audit all challenge and reaction UI/routes/fixtures/domain state; replace the primary navigation with the agreed Home/Explore/My Access/Profile model or the exact DEV0058/DEV0059-approved labels; remove challenge create/list/detail entry points and search results; remove reaction controls and counts if present; establish honest membership/pass/ticket preview destinations; migrate or ignore obsolete browser-local challenge/reaction data safely; update empty states, preview reset, tests and public links.
- Out of scope: implementing real membership entitlement, payment, transfer, ticket, sponsorship or redemption behavior; deleting wallet-authentication `challenge` endpoints/messages, which are security nonces unrelated to product challenges; redesigning the How-it-works narrative; adding a generic marketplace, feed ranking, comments or notifications.

## Expected behavior and edge cases

No primary or secondary public navigation offers Challenges or Create a challenge. Direct legacy challenge URLs return the product's deliberate not-found/retired behavior without leaking private data or redirecting to an unrelated purchase. Global search excludes challenge fixtures and includes only supported public product types. Old saved browser data containing challenge drafts, saves or reaction-like fields is ignored without breaking unrelated event drafts, follows or preferences.

Home may retain a small chronological/discovery-oriented stream, but it has no reaction affordance or engagement counter. My Access must not fabricate ownership: until membership/pass/ticket repositories exist, it presents an honest empty/preview state and routes users to Explore. Membership, pass and event cards distinguish demonstrations from usable access. Desktop/mobile active navigation, keyboard order and deep links remain correct.

## Assumptions, decisions, and dependencies

DEV0058 owns the route/product contract and completed DEV0059 supplies the final public wording to reuse. The initial navigation recommendation is Home, Explore, My Access and Profile; implementation must confirm whether Home contains the minimal feed or a broader landing surface before editing. Removing product challenges must not remove cryptographic wallet-ownership challenge code or terminology in Auth APIs/tests.

No backward-compatible product challenge route is required because no real challenge was published or funded. Historical browser data has no financial authority, but parsing must fail safely and preserve unrelated supported data.

## Implementation plan

The user first authorized removal of the globally visible Create a challenge action, then explicitly requested removal of the Challenges tab and related product code. That follow-up authorized the remaining route/navigation/storage retirement in this ticket.

1. Inventory challenge/reaction routes, navigation, search, fixtures, domain contracts, preview persistence and tests; explicitly separate product challenges from wallet-authentication challenges.
2. Reuse DEV0059's access labels and safe destinations, then add the access route/empty-state boundary before removing challenge entry points.
3. Remove product challenge fixtures, screens, create flows, cards, search/filter branches, saved/draft state and any reaction presentation; add safe legacy-store parsing.
4. Update Home/Explore/My Access/Profile navigation and active-route handling at desktop/mobile widths, plus not-found behavior for retired URLs.
5. Run domain/storage regressions, keyboard/mobile/desktop browser flows, lint, typecheck, formatting and build; inspect representative screenshots and complete the ticket record.

## Acceptance criteria

- [x] AC1: Desktop and mobile navigation contain no Challenges or Create a challenge action and provide the approved access-focused destinations with correct active states and keyboard order.
- [x] AC2: Product challenge routes, fixtures, cards, filters, search results, drafts, saves and financial/winner claims are removed or deliberately retired; wallet-authentication challenge behavior remains intact.
- [x] AC3: No reaction control/count remains. The minimal Home/community presentation supports discovery or explicitly shared participation without implying a general social engagement system.
- [x] AC4: My Access and related product cards distinguish preview/empty state from real membership, pass or ticket ownership; no local click fabricates paid access, transfer, sponsorship or attendance.
- [x] AC5: Legacy browser challenge/reaction data cannot crash the app or erase unrelated supported event/follow/preference data; reset behavior and direct retired URLs are deterministic.
- [x] AC6: Domain/storage, browser, accessibility, lint, typecheck, formatting and production-build checks pass at desktop and narrow mobile widths with reviewed screenshots.

## Validation plan

Use `rg` and typed-test audits to distinguish product challenge modules from Auth/club/personal wallet challenge contracts. Add storage fixtures from the old preview shape and prove obsolete challenge data is discarded while supported fields survive. Exercise every primary destination, global search, retired direct URLs, empty My Access, preview reset, sign-in return and mobile navigation using keyboard and pointer input. Run `npm test`, `npm run test:auth`, `npm run test:wallet-auth` where the configured stack is available, `npm run lint`, `npm run typecheck`, `npm run format:check`, `npm run build` and the affected/full browser suite. Record unavailable configured checks rather than claiming them.

## Implementation record

Completed 24 September 2026. The current product interface now follows the access-focused MVP and contains no product-challenge or reaction behavior.

### Changes and rationale

- Replaced the Feed/Explore/Challenges/Profile navigation with Home/Explore/My Access/Profile on desktop and mobile. The prominent create action and every remaining challenge call to action were removed.
- Added protected `/my-access` with a clear empty state for memberships, passes and event tickets. Preview and account wording explicitly say that browsing does not create or assign paid access.
- Deleted the product challenge list, detail and create routes; feature module; domain validation; typed fixtures; cards; filters; prize/winner copy; saved state; drafts; and dead styling. Direct legacy URLs now use the standard 404 behavior.
- Reframed the Home example stream around an explicitly shared event participation and class join, with no reaction control or engagement count. Profile and search now refer only to supported participation and catalogue types.
- Advanced browser preview storage to version 2 while keeping the opaque compatibility key. Version-1 challenge saves, drafts and reaction-like fields are ignored; valid follows and event drafts survive migration. Malformed event drafts are isolated rather than erasing valid follows.
- Preserved personal and club wallet-authentication challenge routes, services, repositories and tests. Those bounded message-signing nonces are security infrastructure, not the retired product feature.

### Affected files

| File or component | Change and purpose |
| --- | --- |
| `src/components/shell.tsx` | Supplies Home, Explore, My Access and Profile navigation and removes challenge actions. |
| `src/app/my-access/page.tsx`, `src/features/access/my-access.tsx` | Add the protected, non-fabricated access overview and empty state. |
| `src/app/challenges/**`, `src/features/challenges/**`, `src/domain/challenges.ts` | Deleted the retired product routes, screens and rules. |
| `src/features/feed/feed.tsx`, `src/features/profile/profile.tsx`, `src/features/discovery/search.tsx` | Remove challenge-led copy/content and retain bounded participation/discovery. |
| `src/features/preview/catalogue.ts`, `src/features/preview/discovery.ts`, `src/domain/catalogue.ts`, `src/domain/discovery.ts` | Remove challenge catalogue types, fixtures and search results. |
| `src/features/preview/state.ts` | Introduce the version-2 supported state and safe version-1 migration. |
| `src/components/ui.tsx`, `src/components/format.ts`, `src/app/globals.css`, `src/app/club-theme.css` | Remove challenge-only presentation code and add responsive My Access styling. |
| `tests/*.test.ts`, `tests/browser/*.spec.ts` | Replace challenge expectations with storage-migration, retired-route, access-navigation and supported-product coverage. |
| `README.md`, `docs/mvp-spec.md` | Record the delivered route/interface state without implying implemented access products. |

### Decisions and deviations

- Home retains a small chronological example stream because the pivot allows explicitly shared participation; it no longer promotes competitions, rankings or reactions.
- My Access is protected like Profile. Configured signed-out visitors return through email sign-in; configuration-free preview mode renders the honest empty state.
- Legacy challenge URLs return the normal application 404 instead of redirecting to Explore or a purchase screen, because no funded challenge requires compatibility handling.
- The existing local-storage key remains unchanged so supported version-1 choices can be read once and migrated in place. Only the typed payload version changes from 1 to 2.

### Contracts, configuration, and operations

Public product routes `/challenges`, `/challenges/[id]` and `/challenges/new` were removed; protected `/my-access` was added. The browser-preview payload is now `{ version: 2, following, eventDrafts }`; version-1 payloads are accepted only for safe migration of supported fields. No SQL schema, server API, dependency, environment variable, payment contract or deployment operation changed. `/api/wallet/personal/challenge` and `/api/wallet/club/challenge` remain present and unchanged.

## Validation results

- `npm test` — passed 51/51 unit and contract tests, including legacy-store migration and wallet message/transport coverage.
- `npm run test:e2e` — passed 44/44 executed desktop/mobile Chrome checks; four preview-only event-draft/follow checks were correctly skipped because this checkout is configured in signed-out Auth mode. The equivalent state transitions and migrations passed in `npm test`.
- Retired-route checks passed for `/challenges`, `/challenges/show-up-club` and `/challenges/new` with HTTP 404 on desktop and mobile.
- `npm run format:check`, `npm run lint`, `npm run typecheck` and `git diff --check` — passed after the final implementation edits.
- `npx --no-install next build --webpack` — passed; the generated route map contains `/my-access`, no product `/challenges` route, and both wallet-authentication challenge APIs.
- The default `npm run build` Turbopack path is not used as evidence in this restricted environment because its local worker/port operation previously returned `EPERM`; the production webpack build completed successfully.
- Full-page desktop and mobile Home screenshots were inspected. Both show the four access-focused navigation items, event/class participation examples, supported catalogue links and no challenge action or horizontal overflow.
- A local Markdown-link audit checked all 81 repository Markdown files after archival; every relative link resolves.
- `npm run test:auth`, `npm run test:wallet-auth` and the real Phantom rehearsal were not rerun: this frontend ticket did not alter those boundaries, and the unit/build route audit confirms their challenge-nonce code remains. No deployment was performed.

## Risks, limitations, and follow-ups

My Access remains deliberately empty until separately reviewed tickets implement persistent membership, pass and ticket repositories. Event drafting and follows are still browser-local in preview mode. The retained Home stream is illustrative and not persistent or independently verified. Wallet-authentication nonce terminology remains in security code and should not be renamed as part of product copy cleanup.

## Completion and review references

- Completed: 2026-09-24.
- Commit: Included in `[DEV0060] [DEV0061] [DEV0062] Complete access-focused interface pivot`.
- Review: Self-review against AC1–AC6 plus desktop/mobile screenshot inspection; no independent review.
- Deployment or release: None.
