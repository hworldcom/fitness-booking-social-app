# Ticket DEV0060: Replace challenge surfaces with access navigation

- Status: Ready
- Created: 2026-09-24
- Last updated: 2026-09-24
- Milestone: MVP product pivot and public presentation
- Coordination: [COR0005 — Fitness-access product pivot](../organisatory/COR0005-fitness-access-product-pivot.md)
- Related records: depends on completed [DEV0058 — Adopt the fitness-access MVP contract](../../archive/organisatory/DEV0058-fitness-access-mvp-contract.md); integrates copy/destinations with completed [DEV0059 — Rewrite public positioning and How it works](../../archive/frontend/DEV0059-rewrite-public-positioning-and-guide.md); revises challenge surfaces delivered by [DEV0008](../../archive/frontend/DEV0008-repx-club-frontend.md) and [DEV0020](../../archive/frontend/DEV0020-discovery-and-how-it-works.md); preserves the authenticated profile boundary from [DEV0052](../../archive/frontend/DEV0052-account-backed-personal-profile.md)

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

1. Inventory challenge/reaction routes, navigation, search, fixtures, domain contracts, preview persistence and tests; explicitly separate product challenges from wallet-authentication challenges.
2. Reuse DEV0059's access labels and safe destinations, then add the access route/empty-state boundary before removing challenge entry points.
3. Remove product challenge fixtures, screens, create flows, cards, search/filter branches, saved/draft state and any reaction presentation; add safe legacy-store parsing.
4. Update Home/Explore/My Access/Profile navigation and active-route handling at desktop/mobile widths, plus not-found behavior for retired URLs.
5. Run domain/storage regressions, keyboard/mobile/desktop browser flows, lint, typecheck, formatting and build; inspect representative screenshots and complete the ticket record.

## Acceptance criteria

- [ ] AC1: Desktop and mobile navigation contain no Challenges or Create a challenge action and provide the approved access-focused destinations with correct active states and keyboard order.
- [ ] AC2: Product challenge routes, fixtures, cards, filters, search results, drafts, saves and financial/winner claims are removed or deliberately retired; wallet-authentication challenge behavior remains intact.
- [ ] AC3: No reaction control/count remains. The minimal Home/community presentation supports discovery or explicitly shared participation without implying a general social engagement system.
- [ ] AC4: My Access and related product cards distinguish preview/empty state from real membership, pass or ticket ownership; no local click fabricates paid access, transfer, sponsorship or attendance.
- [ ] AC5: Legacy browser challenge/reaction data cannot crash the app or erase unrelated supported event/follow/preference data; reset behavior and direct retired URLs are deterministic.
- [ ] AC6: Domain/storage, browser, accessibility, lint, typecheck, formatting and production-build checks pass at desktop and narrow mobile widths with reviewed screenshots.

## Validation plan

Use `rg` and typed-test audits to distinguish product challenge modules from Auth/club/personal wallet challenge contracts. Add storage fixtures from the old preview shape and prove obsolete challenge data is discarded while supported fields survive. Exercise every primary destination, global search, retired direct URLs, empty My Access, preview reset, sign-in return and mobile navigation using keyboard and pointer input. Run `npm test`, `npm run test:auth`, `npm run test:wallet-auth` where the configured stack is available, `npm run lint`, `npm run typecheck`, `npm run format:check`, `npm run build` and the affected/full browser suite. Record unavailable configured checks rather than claiming them.

## Implementation record

Pending implementation.

### Changes and rationale

Not started.

### Affected files

| File or component                                                                | Change and purpose                                               |
| -------------------------------------------------------------------------------- | ---------------------------------------------------------------- |
| `src/components/shell.tsx`                                                       | Planned primary/mobile navigation and create-action replacement. |
| `src/app/challenges/**`, `src/features/challenges/**`, challenge domain/fixtures | Planned product challenge retirement.                            |
| Search/Explore/Home/Profile/My Access surfaces                                   | Planned supported-product destinations and honest empty states.  |
| Preview storage and tests                                                        | Planned safe removal of obsolete local challenge/reaction state. |

### Decisions and deviations

No implementation decisions or deviations yet.

### Contracts, configuration, and operations

Planned public route removal/addition and browser-preview storage compatibility only. No database migration, provider, secret or dependency change is authorized by this ticket.

## Validation results

Not run — implementation has not started.

## Risks, limitations, and follow-ups

Keep the access wording and safe destinations delivered by DEV0059 while removing challenge UI; verify both tickets as one experience before completing COR0005. My Access will remain an honest empty/preview surface until separately ticketed membership/pass/ticket persistence exists.

## Completion and review references

- Completed: Not completed.
- Commit: Not created.
- Review: Planning self-review only; no independent review.
- Deployment or release: None.
