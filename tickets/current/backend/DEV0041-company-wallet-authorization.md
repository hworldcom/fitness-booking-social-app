# Ticket DEV0041: Company wallet authorization

- Status: Draft
- Created: 2026-09-20
- Last updated: 2026-09-20
- Milestone: M0 identity / M2 company authority prerequisite
- Coordination: [COR0002 — Phantom authentication and demo access](../organisatory/COR0002-phantom-auth-and-demo-access.md)
- Related records: depends on [DEV0039 — Prepared identity and wallet bindings](DEV0039-prepared-identity-and-wallet-bindings.md) and [DEV0040 — Protected access and database context](DEV0040-protected-access-and-database-context.md); implements C14 from [DEV0007 — EURC-only wallet contract](../../archive/blockchain/DEV0007-eurc-only-wallet-contract.md); later financial tickets consume its authority result

## Objective and context

Authorize a prepared company's distinct Phantom wallet only when the current RepX Club session belongs to that company's active primary admin and a fresh company-scoped wallet proof succeeds. Preserve the admin's personal application identity while keeping personal and company signing authority, balances and future financial actions separate.

This is an authorization prerequisite, not a payment ticket. It implements the identity-side portion of C14/P08 and the specification's [company wallet rule](../../../docs/mvp-spec.md#authentication-and-data-access-recommendation) without constructing, signing, simulating or submitting a transaction.

## Scope and non-goals

- In scope: consume DEV0039's mutually exclusive wallet-binding/challenge schema for organization ownership; add prepared company-wallet configuration and company binding/proof repository/service methods; verify active organization membership and primary-admin role from DEV0040's server context; issue/consume company/domain/run/admin/wallet/purpose-bound challenges; expose explicit personal-versus-company authority state; preserve the personal Supabase session during an intentional company-wallet switch; invalidate company proof on disconnect/account change/expiry/revocation; test wrong personal/company/staff/run combinations and concurrent proof use.
- Out of scope: changing the shared binding/challenge schema owner; Supabase login, profile enrollment or public route guards; organization management UI; multiple primary admins; wallet custody/recovery; balance reads; transaction construction, simulation, signature or submission; EURC transfers, sponsorship, receipts, refunds or on-chain verification.

## Expected behavior and edge cases

An authenticated active primary admin deliberately enters company-wallet mode, connects the prepared wallet registered to that organization and approves a fresh company-scoped message. Success yields a short-lived server-verified authority result identifying the personal admin, run, organization, company wallet, purpose and expiry. The UI shows `Company wallet · Solana Devnet · Test funds` separately from the personal session.

The admin's personal wallet cannot substitute for the company wallet. Another company's wallet, another run, an unrelated organizer, inactive/revoked membership, staff/check-in role, a copied/expired/consumed proof or browser-selected company ID cannot authorize the company. The same wallet address cannot be both personal and business-owned in one run.

Switching to the company wallet must not sign the browser in as the company or merge identities. The existing personal Supabase/app session remains the acting admin session, while the active wallet is treated only as separately proved company signing authority. Disconnect, another account switch, proof expiry, role revocation or binding change removes company authority before any later financial prompt. Leaving company mode restores an honest personal-session state and requires the matching personal wallet before a future personal wallet-signing action.

## Assumptions, decisions, and dependencies

DEV0039 owns the shared `wallet_bindings` and `auth_challenges` tables and their one-owner-per-run/cluster constraints. This ticket must use those contracts rather than add a competing business-wallet table. DEV0040 supplies the verified personal subject/run/organization-role context and private-response protections.

Use message signatures only for authority proof. A successful proof does not establish funds, token accounts, a valid recipient, a transaction signature or chain finality. Later financial tickets must recheck current admin/company authority and request explicit transaction approval for each operation.

The MVP supports one seeded primary admin per company. Broader admin delegation, rotation/recovery and multi-signature custody are separate product decisions.

## Implementation plan

1. Review the delivered DEV0039 binding/challenge and DEV0040 authorization-context contracts; specify the exact company proof input/output, lifetime, invalidation and prepared-company configuration before implementation.
2. Add organization binding and company-proof repository/service methods with active primary-admin checks and atomic challenge consumption.
3. Add explicit company-mode UI/state that retains the personal application session while treating the selected Phantom account only as company signing authority.
4. Invalidate authority on mismatch, disconnect, expiry, role/binding revocation or account change; expose a bounded response contract for later transaction services.
5. Add database/service/browser tests plus real prepared admin/company-wallet rehearsal. Confirm no transaction or balance request is made.

## Acceptance criteria

- [ ] AC1: An authenticated active primary admin can prove only the prepared distinct wallet bound to that company/run and receives a bounded, expiring company-authority result.
- [ ] AC2: Personal wallet, unrelated company wallet, foreign run/company, non-admin/staff-only actor, revoked membership/binding and browser-selected company metadata cannot grant authority.
- [ ] AC3: Personal and organization ownership are mutually exclusive for one wallet within a run/cluster, including concurrent binding/proof attempts.
- [ ] AC4: Intentional company-wallet switching retains the admin's personal application session but never signs in or merges the company as a user. Disconnect/account change/expiry/revocation clears company authority.
- [ ] AC5: The interface distinguishes personal session from `Company wallet · Solana Devnet · Test funds`; success claims no balance, payment, transaction signature or finality.
- [ ] AC6: SQL/repository/service tests, unit/boundary checks, lint, typecheck, build, desktop/mobile browser checks and a real prepared company-wallet message-proof rehearsal pass with exact evidence recorded.

## Validation plan

Use one prepared admin personal session, its distinct prepared company wallet, another personal wallet, another company wallet, a staff-only actor, a revoked admin and foreign-run/company inputs. Test concurrent proof use and changes to membership/binding after proof issuance. Validate mutual exclusivity directly in PostgreSQL and through services.

In desktop Chrome, sign in with the personal wallet, intentionally switch to the company wallet, approve only the company-scoped message, inspect the separate authority state, then disconnect/change accounts and confirm authority disappears while the personal application session remains. Run database/integration tests, existing unit/boundary checks, lint, typecheck, formatting, webpack build and affected desktop/mobile Playwright scenarios. No transaction approval is requested or authorized.

## Implementation record

Pending implementation. This ticket was created when the unimplemented DEV0016 plan was converted to COR0002. It owns company authority only; financial tickets remain separate.

### Changes and rationale

Not implemented.

### Affected files

| File or component | Change and purpose                                                                                |
| ----------------- | ------------------------------------------------------------------------------------------------- |
| Pending           | Record exact company configuration, repository, service, UI and test files during implementation. |

### Decisions and deviations

None yet.

### Contracts, configuration, and operations

Expected contracts are server-only prepared company-wallet configuration plus a short-lived company-authority response tied to the verified personal admin session. Record exact variables, lifetimes, invalidation and recovery behavior before completion; never record signing material.

## Validation results

Pending validation. DEV0039 and DEV0040 must complete before implementation evidence can begin.

| Criterion | Evidence | Result  |
| --------- | -------- | ------- |
| AC1–AC6   | Not run  | Not run |

## Risks, limitations, and follow-ups

The extension supports one active account at a time, so company mode needs explicit UX and strong mismatch handling. A retained application session must never be mistaken for proof that the newly selected wallet belongs to its organization. Later financial tickets must still display and simulate every transaction before requesting explicit user approval.

One seeded primary admin is sufficient for the MVP but is not a production treasury-control model. Rotation, recovery, multisig and multiple-admin approval require separate requirements and tickets.

## Completion and review references

- Completed: Not completed.
- Commit: Not created.
- Review: Planning self-review only; no independent review.
- Deployment or release: None.
