# Ticket DEV0040: Protected access and database context

- Status: Draft
- Created: 2026-09-20
- Last updated: 2026-09-21
- Milestone: M0 identity and protected access
- Coordination: [COR0002 — Phantom authentication and demo access](../organisatory/COR0002-phantom-auth-and-demo-access.md)
- Related records: depends on [DEV0039 — Prepared identity and wallet bindings](DEV0039-prepared-identity-and-wallet-bindings.md) and completed [DEV0025 — Next.js backend boundary](../../archive/backend/DEV0025-nextjs-backend-boundary.md); enables [DEV0017 — Persistent catalogue and private drafts](DEV0017-persistent-catalogue-and-drafts.md), [DEV0018 — Membership booking and confirmed visits](DEV0018-membership-booking-and-visits.md), and [DEV0023 — Shared social feed and Cheers](DEV0023-shared-social-feed-and-cheers.md)

## Objective and context

Turn DEV0039's verified application identity into a reusable, server-enforced subject/run/role context for private data and protected routes. Establish the first transaction-local PostgreSQL row-level security path, guard the currently private interface entry points and preserve anonymous catalogue discovery.

This ticket owns the shared access boundary required by the specification's [public browsing and sign-in rules](../../../docs/mvp-spec.md#public-browsing-and-sign-in-boundaries) and [authentication recommendation](../../../docs/mvp-spec.md#authentication-and-data-access-recommendation). Later feature tickets use it rather than reimplementing session, membership or database context checks.

## Scope and non-goals

- In scope: resolve the current verified Supabase subject to an active profile/run membership; define a narrow server authorization context and response contract; set and clear subject/run/role only inside a database transaction; add the first private grants and row-level security policies for identity/run access; prove pooled connections cannot leak context; add thin framework guards for `/profile`, `/challenges/new`, `/events/new` and protected mutations; validate safe internal return destinations; clear wallet-bound/private browser state when authentication or binding becomes invalid; preserve guest access to Explore, Challenges, classes/events/studios and public details.
- Out of scope: Supabase provider sign-in owned by DEV0038; personal enrollment and shared wallet-binding schema owned by DEV0039; catalogue/draft/follow/bookmark repositories owned by DEV0017; membership booking owned by DEV0018; feed/Cheers owned by DEV0023; company challenge and wallet proof owned by DEV0041; payments, balances, chain verification or broad admin tooling.

## Expected behavior and edge cases

Protected server operations derive the Auth subject from the server-verified Supabase session, resolve an active prepared profile/run membership and open a database transaction with only that context. Missing, expired or forged sessions; inactive runs; revoked memberships; wrong-run resources; absent roles and client-supplied identity metadata fail before protected data is returned or mutated.

Alternating users through the same connection pool never inherit each other's subject/run/role. Commit, rollback, timeout and thrown-error paths clear the transaction-local context. Shared caches never contain authenticated responses, refresh cookies or personalized data.

Guests can directly open and reload public discovery and detail routes without Phantom or Supabase. Protected pages show a clear sign-in requirement with a validated same-origin internal return target. Completing sign-in does not automatically create, follow, book, join, pay or submit a saved mutation. Cancellation/sign-out returns to public browsing. A changed/disconnected wallet or invalidated binding clears affected private client state before another protected action; it never reassigns the session to the new wallet.

## Assumptions, decisions, and dependencies

Implementation starts after DEV0039 provides the verified identity/run lookup. Use the server-only boundaries and Drizzle/PostgreSQL connection established by DEV0015/DEV0025. Do not trust a decoded cookie, client component, request body, URL run ID or editable Auth metadata as authority.

This ticket establishes infrastructure and a current-actor vertical slice, not generic repositories for later features. DEV0017 consumes the helper for catalogue/private drafts; it remains responsible for public projections and its own feature policies. Identify the exact tables and policies changed before the first migration edit and do not broaden anonymous database access implicitly.

## Implementation plan

1. Specify the authorization-context shape, trusted inputs, transaction lifecycle, role vocabulary and exact first-policy matrix before implementation.
2. Add server identity resolution and a transaction wrapper that sets verified subject/run/profile/role context locally, then always clears it on commit, rollback or error.
3. Add forward-only grants/policies and SQL/driver tests for own identity/run membership, revoked/wrong-run denial and pooled-context isolation.
4. Add thin request/page guards and a limited current-actor response. Gate the existing private routes/actions while preserving direct anonymous access to public routes and safe navigation.
5. Add client invalidation and browser coverage for expiry, sign-out, wallet mismatch, cancellation, safe return and no automatic post-login mutation. Run the full relevant regression suite.

## Acceptance criteria

- [ ] AC1: Every protected identity/current-run operation uses a server-verified subject and active membership; absent, forged, expired, revoked or wrong-run contexts fail without returning private data.
- [ ] AC2: Subject/run/profile/role database settings exist only inside the protected transaction. Alternating users, failures and rollbacks through one pool never leak prior context.
- [ ] AC3: The first private grants/policies enforce the documented access matrix under real runtime roles; service-role or owner shortcuts are not used by ordinary protected requests.
- [ ] AC4: Guests can directly open/reload public Explore, Challenges and detail routes. `/profile`, `/challenges/new`, `/events/new` and protected mutations require authentication and use only validated internal return destinations.
- [ ] AC5: Sign-in completion never automatically executes a pending mutation. Sign-out, expiry, invalid binding and wallet mismatch clear affected private state and retain a usable public route.
- [ ] AC6: Migration/database tests, authorization unit/integration tests, boundary checks, lint, typecheck, build and desktop/mobile browser regressions pass with exact evidence recorded.

## Validation plan

Use local PostgreSQL/Supabase with at least two verified actors in distinct browser contexts, an expired session, an inactive run, a revoked membership and foreign-run resources. Alternate both users through the same database pool and force success, rollback and thrown-error paths while inspecting current settings and visible rows.

Exercise anonymous direct navigation, private route redirects/entry states, unsafe return URLs, cancelled/failed login, session expiry, sign-out and wallet mismatch on desktop and mobile. Confirm no pending create/book/follow/join/payment action runs automatically. Run clean migration/reset, SQL and Drizzle tests, existing unit/boundary checks, lint, typecheck, formatting, webpack build and affected Playwright suites.

## Implementation record

Pending implementation. This ticket was created when the unimplemented DEV0016 plan was converted to COR0002. It owns shared protected-access enforcement, not feature persistence.

### Changes and rationale

Not implemented.

### Affected files

| File or component | Change and purpose                                                                                |
| ----------------- | ------------------------------------------------------------------------------------------------- |
| Pending           | Record exact migration, auth-context, framework-adapter, UI and test files during implementation. |

### Decisions and deviations

None yet. Record the exact policy and route matrix before implementation.

### Contracts, configuration, and operations

Expected contracts are a server authorization-context interface, a transaction-local database wrapper, private policies/grants, current-actor response and safe-return validation. Final schemas and migration/rollback operations must be recorded before completion.

## Validation results

Pending validation. DEV0039 must complete before implementation evidence can begin.

| Criterion | Evidence | Result  |
| --------- | -------- | ------- |
| AC1–AC6   | Not run  | Not run |

## Risks, limitations, and follow-ups

PostgreSQL connection pooling makes session-level settings unsafe; use transaction-local settings and test cleanup under failures. Next.js caching defaults can expose personalized responses if misapplied, so explicitly opt protected reads out of shared caching and test browser isolation.

This ticket does not create repositories for every protected feature. DEV0017/DEV0018/DEV0023 must use the delivered context while owning their specific authorization and data tests.

## Completion and review references

- Completed: Not completed.
- Commit: Not created.
- Review: Planning self-review only; no independent review.
- Deployment or release: None.
