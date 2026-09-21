# Ticket DEV0047: Personal wallet linking and replacement

- Status: Draft
- Created: 2026-09-21
- Last updated: 2026-09-21
- Milestone: Prioritized identity and onboarding
- Coordination: [COR0003 — Account-first identity and wallet linking](../organisatory/COR0003-account-first-identity-and-wallet-linking.md)
- Related records: follows [DEV0046 — Email OTP registration and application profiles](DEV0046-email-otp-registration-and-application-profiles.md); reuses the wallet connection delivered by [DEV0027](../../archive/blockchain/DEV0027-phantom-wallet-connection-foundation.md), the binding foundation from [DEV0039](../../archive/backend/DEV0039-prepared-identity-and-wallet-bindings.md), and the actor boundary from [DEV0040](../../archive/backend/DEV0040-protected-access-and-database-context.md); supplies the shared challenge foundation later consumed by [DEV0041 — Company wallet authorization](DEV0041-company-wallet-authorization.md)

## Objective and context

Let a signed-in email account optionally prove and link one personal Phantom wallet for later wallet-required actions without turning that wallet into the application login method. Support explicit disconnect, unlink and replacement with clear recovery and ownership rules.

## Scope and non-goals

- In scope: one active personal wallet per account; server-issued short-lived, single-use message challenges; account/origin/cluster/address/purpose binding; atomic unique ownership; wallet settings; connection versus linked state; recent email reauthentication before unlink/replacement; new-wallet proof; audit history; collision-safe errors; tests and real Phantom rehearsal.
- Out of scope: account registration/profile creation owned by DEV0046; wallet login; automatic account merging; requiring the lost old wallet to approve replacement; several active personal wallets; company authority owned by DEV0041; embedded wallet creation owned by DEV0037; transactions, balances, payments, delegated signing, fee sponsorship or custody.

## Expected behavior and edge cases

Connecting Phantom exposes a selected address but creates no durable link. A signed-in person chooses `Link wallet`, reviews a message-only request and signs one challenge. The server consumes the exact unused challenge and creates the binding only when the current account, origin, Devnet cluster, address and `link-personal-wallet` purpose match.

The first delivery permits exactly one active personal wallet per account and one active application owner per wallet. A wallet already linked elsewhere fails with a generic conflict that reveals no account details. Concurrent or replayed proofs cannot create duplicate owners.

Provider disconnect preserves the durable link but disables live wallet-required actions. Explicit unlink or replacement requires application reauthentication within ten minutes. Replacement also requires a valid proof from the new wallet, but not from the old wallet so loss of the old device does not make recovery impossible. The old binding remains active until the replacement transaction succeeds, then becomes revoked audit history. Historical financial records must retain their original wallet addresses rather than following the current link.

## Assumptions, decisions, and dependencies

The user accepted these defaults on 2026-09-21: wallet linking is optional; exactly one active personal wallet is supported; connection and linking are different states; one message signature proves linking; no transaction is requested; email reauthentication protects unlink/replacement; the new wallet must prove control; automatic merging is forbidden.

DEV0046 must first deliver wallet-independent email accounts and profiles. DEV0047 becomes the owner of the shared one-time `auth_challenges` schema because it now precedes DEV0041; DEV0041 must extend that reviewed purpose/owner contract for company-wallet proof rather than create a competing table.

## Implementation plan

1. Review DEV0046's delivered account/session/actor contracts and lock the challenge lifetime, hashed nonce storage, message format, reauthentication timestamp and audit shape.
2. Add the shared challenge migration and update personal wallet bindings from prepared-only provenance to explicit user proof while preserving exclusive ownership and revocation history.
3. Add authenticated issue/verify/link/unlink/replace services and same-origin HTTP adapters. Keep database consumption and binding change atomic.
4. Add wallet settings and honest connected/unlinked/linked/disconnected/mismatched/proof-pending/error states using DEV0027's single wallet authority.
5. Test expiry, replay, collision, concurrency, cancellation, account/address/origin/cluster/purpose mismatch, reauthentication expiry and recovery; rehearse with real Phantom without requesting a transaction.

## Acceptance criteria

- [ ] AC1: A signed-in email account can link one selected Phantom wallet through exactly one explicit message signature and no transaction signature.
- [ ] AC2: Connection alone grants no link; disconnect preserves the durable link but removes live wallet authority.
- [ ] AC3: Expired, replayed, consumed and wrong-account/address/origin/cluster/purpose proofs fail without partial changes.
- [ ] AC4: One wallet cannot be actively linked to two accounts and one account cannot have two active personal wallets, including under concurrency, without exposing another owner.
- [ ] AC5: Unlink/replacement requires email reauthentication within the locked window; replacement proves the new wallet, retains the old binding until success and then preserves it as revoked history.
- [ ] AC6: Wallet linking never becomes account login, organization authority, payment evidence or automatic identity merging.
- [ ] AC7: Database/service/browser tests, responsive keyboard checks and a real Phantom link/disconnect/reconnect/replace rehearsal pass with exact evidence recorded.

## Validation plan

Use two DEV0046 accounts and at least two Phantom addresses. Exercise simultaneous claims, replay, collision, mismatch, expiry, cancellation, lost-old-wallet replacement and audit retention through PostgreSQL and services. Rehearse the real message-only flow on desktop and mobile-width UI; confirm no transaction prompt appears. Run focused tests plus lint, typecheck, formatting, build and affected browser regressions.

## Implementation record

Pending implementation. This peer was created when accepted requirements showed that account registration and wallet-proof lifecycle were independently reviewable security boundaries.

### Changes and rationale

Not implemented.

### Affected files

| File or component | Change and purpose                                                      |
| ----------------- | ----------------------------------------------------------------------- |
| Pending           | Record challenge, binding, service, interface and test files during work. |

### Decisions and deviations

None beyond the accepted planning decisions above.

### Contracts, configuration, and operations

Expected contracts include the shared challenge schema, proof message, binding lifecycle and reauthentication window. No private key, recovery phrase, signature or OTP may be logged or committed.

## Validation results

Pending validation; DEV0046 has not been implemented.

| Criterion | Evidence                      | Result  |
| --------- | ----------------------------- | ------- |
| AC1–AC7   | Dependency not delivered yet  | Not run |

## Risks, limitations, and follow-ups

Wallet replacement is an account-takeover target. Bind and consume challenges atomically, require recent application authentication and notify the verified account when wallet ownership changes. One active wallet is intentional first-release scope; multiple wallets require a new product decision.

## Completion and review references

- Completed: Not completed.
- Commit: Not created.
- Review: Requirements reviewed with the user; no independent implementation review.
- Deployment or release: None.
