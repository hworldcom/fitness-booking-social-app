# Ticket DEV0039: Prepared identity and wallet bindings

- Status: Draft
- Created: 2026-09-20
- Last updated: 2026-09-20
- Milestone: M0 identity / M2 wallet prerequisite
- Coordination: [COR0002 — Phantom authentication and demo access](../organisatory/COR0002-phantom-auth-and-demo-access.md)
- Related records: depends on [DEV0038 — Phantom Supabase Web3 authentication](DEV0038-phantom-supabase-web3-authentication.md) and completed [DEV0015 — Supabase database foundation](../../archive/backend/DEV0015-supabase-database-foundation.md); enables [DEV0040 — Protected access and database context](DEV0040-protected-access-and-database-context.md) and [DEV0041 — Company wallet authorization](DEV0041-company-wallet-authorization.md)

## Objective and context

Map a verified Supabase Web3 subject to exactly one prepared RepX Club profile and demo run through a fresh, replay-resistant application proof. Add the durable wallet-binding and challenge contracts plus identity repositories needed to prevent arbitrary persona selection, wallet reuse and cross-run claims.

DEV0038 authenticates control of a Phantom address but deliberately grants no application identity. This ticket owns the next boundary from the specification's [demo account model](../../../docs/mvp-spec.md#3-demo-fixtures-and-account-model): controlled prepared enrollment and personal-wallet binding.

## Scope and non-goals

- In scope: define and migrate shared `wallet_bindings` and one-time `auth_challenges`; model run, cluster, address, binding owner type, target, provenance, expiry and consumption; add Drizzle mappings and capability-owned identity/enrollment repositories; configure a server-only prepared demo roster; issue and atomically consume domain/user/run/wallet-bound challenges; claim an unclaimed seeded profile for the verified Supabase subject; enforce one wallet owner per run and one personal binding per prepared actor; expose a narrow enrollment/current-identity service and response contract; test replay, races and wrong claims against real local PostgreSQL.
- Out of scope: Supabase provider sign-in/session implementation owned by DEV0038; private product-data row-level security and route guards owned by DEV0040; company-admin proof and company operations owned by DEV0041; open signup, persona picker, automatic wallet merging, production identity verification, payments, transaction signatures or chain state.

## Expected behavior and edge cases

After DEV0038 verifies the wallet and Supabase subject, the server may offer only the prepared actor/run entry configured for that address. Enrollment uses a fresh challenge containing the application domain, purpose, run, intended profile/user, wallet address, nonce and expiry. The server consumes it once, checks the verified signer/session, and atomically binds the Auth user, profile, run membership and personal wallet.

Forged, copied, expired, consumed, wrong-domain, wrong-purpose, wrong-run, wrong-profile, wrong-Auth-user or wrong-wallet proofs fail without partially claiming a profile. Concurrent claims produce one success. A wallet already owned in the run cannot bind to another profile or organization; a profile or Auth user cannot silently acquire a second personal identity. Inactive/revoked prepared entries cannot enroll.

The browser never supplies an authoritative profile, run, role or owner type. Public wallet addresses and proof metadata may be stored; signatures, private keys and recovery phrases may not. Error responses use bounded application copy and do not leak the prepared roster or identify whether an arbitrary address is allowlisted.

## Assumptions, decisions, and dependencies

Implementation starts only after DEV0038 records the real Supabase subject/session and signer-adapter contracts. DEV0015 already provides `auth.users`, `profiles`, `demo_runs` and membership tables plus default-deny row-level security. Extend that schema through a new replayable migration; never rewrite the completed foundation migration.

One shared `wallet_bindings` contract must support mutually exclusive personal and organization ownership so the same `(run, cluster, address)` can have exactly one owner. This ticket owns that shared table and its personal enrollment path; DEV0041 owns organization-binding creation/use and company proof behavior. Record the exact column/check/index matrix in this ticket before the first migration edit.

The prepared roster is server-only configuration. Public wallet addresses are not secrets, but local addresses and mappings should remain environment/config inputs unless the user explicitly chooses durable demo fixtures. Never record seed phrases or signing material.

## Implementation plan

1. Read DEV0038's delivered session/signer contract and write the exact `wallet_bindings`/`auth_challenges` schema, uniqueness, expiry, hashing, role/grant and rollback matrix before migration changes.
2. Add a forward-only migration, Drizzle mappings and database tests for owner exclusivity, personal-binding uniqueness, challenge validity/consumption and concurrent claims.
3. Add server-only prepared-roster parsing plus identity/challenge/enrollment repositories under the established `src/server` dependency direction. Validate all identifiers server-side and keep transactions atomic.
4. Add narrow challenge/enrollment/current-identity services and framework adapters. Use the verified DEV0038 subject/signer, never browser-selected identity metadata.
5. Add unit/integration/browser evidence for successful prepared enrollment plus disallowed wallet, replay, expiry, cross-run/profile/user/wallet mismatch and race recovery.

## Acceptance criteria

- [ ] AC1: A verified allowlisted wallet can atomically claim only its prepared profile/run and returns the same identity idempotently on retry after completion.
- [ ] AC2: A wallet has exactly one personal or organization owner per run/cluster; one Auth subject/profile cannot be silently merged with another prepared actor.
- [ ] AC3: Challenges are fresh, expiring, purpose/domain/user/run/profile/wallet bound and single-use. Forgery, replay, mismatch and concurrent consumption produce no partial enrollment.
- [ ] AC4: The server derives the candidate actor from protected roster/configuration and verified session/signer data; the client cannot select a persona, run, role or owner type as authority.
- [ ] AC5: Migration, Drizzle mapping, repository and response contracts are documented with rollback/recovery steps. No private key, recovery phrase, raw secret or unrestricted roster data reaches the browser.
- [ ] AC6: Clean database reset, repeated migration/seed, SQL and driver integration tests, unit/boundary checks, lint, typecheck, build and affected browser checks pass with exact results recorded.

## Validation plan

Use local Supabase/PostgreSQL with prepared test identities, at least two distinct wallets, one disallowed wallet, one inactive membership and concurrent attempts at the same challenge/profile. Validate constraints directly with SQL/pgTAP and through the Drizzle repositories. Include cross-run, wrong-domain/purpose/user/profile/wallet, expired and already-consumed proofs.

Run clean reset and repeatability checks, database integration tests, existing unit/boundary tests, lint, typecheck, formatting, webpack production build and affected Playwright flows. Rehearse one real prepared Phantom enrollment after DEV0038 sign-in. This ticket requests application message proof only where required; it never constructs or signs a transaction.

## Implementation record

Pending implementation. This ticket was created when the unimplemented DEV0016 plan was converted to COR0002. It owns the shared binding/challenge schema and personal prepared-enrollment behavior.

### Changes and rationale

Not implemented.

### Affected files

| File or component | Change and purpose                                                                         |
| ----------------- | ------------------------------------------------------------------------------------------ |
| Pending           | Record exact migration, mapping, repository, service and test files during implementation. |

### Decisions and deviations

None yet. Add the exact schema matrix before implementation.

### Contracts, configuration, and operations

Expected contracts are a forward-only database migration, Drizzle mappings, server-only prepared-roster configuration and challenge/enrollment service interfaces. Final names, retention, hashing and rollback behavior remain to be fixed before implementation starts.

## Validation results

Pending validation. DEV0038 must complete before implementation evidence can begin.

| Criterion | Evidence | Result  |
| --------- | -------- | ------- |
| AC1–AC6   | Not run  | Not run |

## Risks, limitations, and follow-ups

Prepared allowlisting is a bounded demo identity mechanism, not proof of one human or a production signup design. Wallet uniqueness does not prevent one person from owning multiple addresses. Avoid storing enough challenge data to replay a signature and define cleanup/retention before implementation.

DEV0041 must consume the shared exclusivity contract instead of adding a competing company-wallet table. DEV0040 must consume the verified identity result instead of trusting client profile/run claims.

## Completion and review references

- Completed: Not completed.
- Commit: Not created.
- Review: Planning self-review only; no independent review.
- Deployment or release: None.
