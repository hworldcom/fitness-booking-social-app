# Ticket DEV0016: Phantom authentication and demo access

- Status: Draft
- Created: 2026-09-19
- Last updated: 2026-09-20
- Milestone: M0 identity / M2 wallet prerequisite
- Coordination: None — independent development ticket
- Related tickets: [DEV0014 — Plan](../../archive/backend/DEV0014-database-and-backend-plan.md); depends on [DEV0015 — Database](DEV0015-supabase-database-foundation.md) and [DEV0027 — Phantom wallet connection](../blockchain/DEV0027-phantom-wallet-connection-foundation.md); enables [DEV0017](DEV0017-persistent-catalogue-and-drafts.md)

## Objective and context

Replace the implicit Anna persona with verified app identity using the Phantom connection delivered by DEV0027. Implement the [authentication/access recommendation](../../../docs/mvp-spec.md#authentication-and-data-access-recommendation), [account model](../../../docs/mvp-spec.md#3-demo-fixtures-and-account-model) and C12/C14/P08. Connecting a wallet, signing in, joining a demo run and authorizing a business transaction are distinct actions.

## Scope and non-goals

- In scope: prove Supabase Solana Web3 login using the connected Phantom account, server-verified sessions, profile/run enrollment from a prepared allowlist, one-time wallet proof storage, company/personal binding separation, authenticated response to wallet/account changes, capability-owned identity/access repositories, and reusable server/SQL authorization context.
- Out of scope: the Wallet Standard connector/provider and connection UI owned by DEV0027; email/password or embedded wallets, open signup, self-assigned organizer/staff roles, token transfers, wallet key custody, creating/funding users' wallets, a general organization admin dashboard or automatic account merging.

## Expected behavior and edge cases

A prepared connected personal wallet establishes its own Auth identity/profile and assigned run membership only after the required sign-in proof succeeds. A second wallet cannot claim the first actor's name or permissions. Verify expiry, domain, user/run binding and single-use proofs; copied/expired/wrong-domain proofs fail. A rejected or failed sign-in signature leaves a useful connected-but-signed-out state. Check current membership/role on every protected operation; never trust editable Auth metadata. Inactive runs and revoked membership deny private access. C17's [public discovery routes](../../../docs/mvp-spec.md#public-browsing-and-sign-in-boundaries) remain browsable without login, a wallet or enrollment in both preview and database modes; private shared-state operations require verified identity.

Do not put a blanket authentication redirect on Explore, Challenges, public details, `/search` or `/how-it-works`. Gate My Challenges, creation/draft saves, bookmarks/follows, Cheers and participation actions. Personal feed/profile/reaction reads require verified same-run access under C19; the Feed route can show a guest sign-in/discovery entry state without personal activity. Clear social content/counts on sign-out and do not execute a pending follow/Cheer automatically after sign-in. A missing/expired session leaves public catalogue content visible and removes personalized data. Return from sign-in to a validated internal destination with its filters; do not automatically execute the requested booking/join/payment. Dismissing or rejecting login keeps public browsing usable. Creation routes such as `/challenges/new` and `/events/new` remain protected even though public detail routes are open.

Business operations keep the authenticated admin's personal app session and require separate proof of the authorized company wallet. Account-change and disconnect events from DEV0027 invalidate active authentication/transaction binding; they never silently change app identity or turn a staff user into a financial admin. The runtime database helper sets identity/run only inside the protected query transaction; reused pooled connections must not inherit another actor's scope.

## Assumptions, decisions, and dependencies

Requires DEV0015, DEV0027, and prepared personal/company public-key mapping. DEV0015 supplies migrated identity/run/organization tables, the server database client and Drizzle mappings but deliberately supplies no identity repository. This ticket owns the identity/access repository methods and verified transaction-context helper that use those mappings; DEV0025 owns only their import/layer enforcement. Ticket DEV0027 proves connection interoperability but does not prove Auth compatibility. Supabase Auth's Web3 provider is recommended, not proven in this app. Begin this ticket with a real sign-in and replay-resistance check through the established connection provider. Supabase's standard domain/timestamp verification is not assumed to satisfy our single-use run proof. Use a server-consumed app proof when required; update the plan before any material provider change rather than weakening the account contract. Application identity is off-chain; EURC mint/Devnet checks remain required separately for future transactions.

## Implementation plan

1. Read the Solana development skill and current Supabase/Phantom/Next.js docs; use DEV0027's connected account to test one prepared Phantom sign-in through Supabase, recording returned verified identity and nonce/replay guarantees. Keep authentication signatures separate from payment prompts.
2. Add wallet bindings/auth challenges and the identity/access repositories for controlled auth-user/profile/run enrollment and role lookup. Bind a seeded actor only through a server-configured matching verified wallet; enforce personal/business owner exclusivity in SQL.
3. Add SSR session refresh/verification and auth UI using the installed framework conventions. Preserve the domain/run/user challenge requirement, consume nonce atomically, and reject unsupported replay or account switching. Apply route/action guards according to C17/C19, with safe return destinations and no automatic participation or financial mutation after login.
4. Implement shared server authorization and transaction-local database context, scoped RLS/grants and tests. Avoid unverified session-cookie data and cross-user cached responses; maintain server-side origin/request checks for mutations.
5. Support the prepared company's authorized admin context and wallet proof, without financial transfers. Test allowlist denial, role revocation, cross-run access, wrong-company wallet and pooled context isolation.

## Acceptance criteria

- [ ] AC1: A real prepared Phantom wallet can sign in/reload/sign out through Supabase; another wallet remains a distinct actor and cannot claim a seeded profile or role.
- [ ] AC2: Forged, expired, replayed, wrong-domain/run/user proofs and unverified session data fail; a rejected/failed sign-in proof or absent connected account never shows successful authentication.
- [ ] AC3: Personal/company wallets are exclusive and business actions require both authorized admin membership and the correct company binding; staff/persona selection cannot grant financial authority.
- [ ] AC4: Every protected service verifies subject/run/role; SQL access with absent/wrong context fails and a pooled connection cannot leak the previous user's identity.
- [ ] AC5: Desktop/mobile authentication error states, keyboard login controls, browser isolation and existing preview regression pass; real Phantom sign-in evidence is recorded separately from DEV0027's connection rehearsal and mocked browser tests. No payment is claimed.
- [ ] AC6: Guests with no wallet or missing/expired sessions can directly open/reload Explore, Challenges and public details without a sign-in redirect. Protected actions and private URLs remain guarded, including personal social reads and reaction mutations; login cancellation/sign-out clear personalized feed/profile/reaction state while preserving public browsing. Login returns to a safe intended destination and cannot automatically book/join/pay.

## Validation plan

Use DEV0027's connection provider with two signed-in browser contexts plus a disallowed wallet and revoked role. Test signature/nonce/domain boundaries, race/replay consumption, stale/forged session data, same-pool alternating users, role escalation and same-run foreign keys against real local PostgreSQL. Rehearse real Phantom sign-in on desktop; mobile may show an explicit prepared-desktop-demo requirement rather than inventing embedded support. Run lint/types/build and affected browser tests. Network/wallet signatures prove authentication only, not a devnet transfer.

Add an anonymous browser context for A54–A55: direct list/detail routes, filters, no extension, expired session, protected action/new routes, rejected sign-in, safe return path and sign-out after private browsing. Verify no mutation on login completion and no stale personalized content. The same guards must support DEV0017's real public database reads, not only the fixture preview.

## Risks, limitations, and follow-ups

Provider replay semantics and prepared wallet enrollment need evidence before enabling private access. Wallet Standard connection compatibility belongs to DEV0027. Company-wallet switching must retain personal admin identity while changing only transaction authority. DEV0017 consumes the verified session helper; payment integration remains later work.

## Implementation record

Planning update, 2026-09-20 ([DEV0027](../blockchain/DEV0027-phantom-wallet-connection-foundation.md)): split browser wallet discovery, connection UI, basic provider errors and raw account-change state into an independent blockchain ticket. This ticket now begins with an established connected account and owns Supabase sign-in, replay-resistant proof, identity/run enrollment, personal/company bindings, protected access and authenticated handling of account changes. Neither ticket has entered implementation.

Planning update, 2026-09-20 ([DEV0022](../../archive/backend/DEV0022-social-contract-and-delivery-plan.md)): align C19 social reads/writes with the verified same-run helper and sign-out behavior. Public catalogue discovery remains anonymous; DEV0023–DEV0024 add their own endpoint/privacy tests. No Auth code was implemented by this update.

Planning update, 2026-09-19 ([DEV0020](../../archive/frontend/DEV0020-discovery-and-how-it-works.md)): retain guest access to search and How it works as well as catalogue routes; global search never requires wallet connection.

Planning update, 2026-09-19 ([DEV0019](../../archive/frontend/DEV0019-public-discovery-access.md)): added confirmed C17 guest discovery and action-scoped authentication. This corrects the earlier preview-only public-browsing wording before implementation.

Planning refinement, 2026-09-20: repository ownership is explicit after the DEV0015 schema refinement. This ticket owns identity/profile/run/organization access repositories and the transaction-local verified context helper; DEV0015 owns their underlying tables, connection and Drizzle mappings, while DEV0025 enforces import direction.

Not started. This ticket defines future work only; no code, dependencies, database objects or service configuration have been created. Update this section with affected files, decisions/deviations, contracts and actual evidence during implementation.

## Validation results

Not run — implementation has not started. Planning/link checks do not satisfy the acceptance criteria above. Record exact implemented commands, environment, failures and passed results before completion.

## Completion and review references

- Completed: Not completed.
- Commit: Not created.
- Review: Planning self-review only; no independent implementation review.
- Deployment: None.
