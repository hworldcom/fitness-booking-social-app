# Ticket DEV0041: Club wallet authorization

- Status: Draft
- Created: 2026-09-20
- Last updated: 2026-09-22
- Milestone: M0 identity / M2 club authority prerequisite
- Coordination: [COR0002 — Phantom authentication and demo access](../organisatory/COR0002-phantom-auth-and-demo-access.md)
- Related records: depends on completed [DEV0039 — Prepared identity and wallet bindings](../../archive/backend/DEV0039-prepared-identity-and-wallet-bindings.md), [DEV0040 — Protected access and database context](../../archive/backend/DEV0040-protected-access-and-database-context.md) and [DEV0046 — Email OTP registration and application profiles](../../archive/backend/DEV0046-email-otp-registration-and-application-profiles.md), plus in-progress [DEV0047 — Personal wallet linking and replacement](DEV0047-personal-wallet-linking-and-replacement.md); supplies club authority consumed by [DEV0051 — Club value proposition and sign-in entry](../frontend/DEV0051-club-value-proposition-and-sign-in-entry.md) and later financial tickets; implements C14 from [DEV0007 — EURC-only wallet contract](../../archive/blockchain/DEV0007-eurc-only-wallet-contract.md)

## Objective and context

Authorize a prepared fitness or sports club's distinct Phantom wallet only when the current MovX Club session belongs to that club's active primary administrator and a fresh club-scoped wallet proof succeeds. Preserve the administrator's personal application identity while keeping personal and club signing authority, balances and future financial actions separate.

A club workspace is not a separate Supabase identity. Every administrator signs in with their own email account, then deliberately acts in an authorized club context. DEV0051 owns the dedicated club-facing sign-in entrance and public explanation; this ticket owns the server-derived club authority that entrance consumes.

This is an authorization prerequisite, not a payment ticket. It implements the identity-side portion of C14/P08 and the specification's [club wallet rule](../../../docs/mvp-spec.md#authentication-and-data-access-recommendation) without constructing, signing, simulating or submitting a transaction.

## Scope and non-goals

- In scope: consume DEV0039's mutually exclusive `wallet_bindings` schema and DEV0047's shared one-time `auth_challenges` contract; add a club-specific challenge purpose plus prepared organization-wallet configuration and organization binding/proof repository/service methods; verify an active organization membership with the primary-admin role from the wallet-independent actor context; issue and consume challenges bound to the organization, demo run, administrator, wallet, origin, cluster and purpose; expose explicit personal-versus-club authority state; preserve the email-authenticated application session during an intentional club-wallet switch; invalidate club authority on disconnect, account change, expiry or role/binding revocation; test wrong personal/club/staff/run combinations and concurrent proof use.
- Out of scope: a separate or shared club authentication identity; self-service club creation, invitations or administrator management; changing DEV0039's shared wallet-binding schema owner; adding another personal-link signature; Supabase account registration or profile enrollment; a general club-management dashboard; multiple primary administrators; wallet replacement/recovery or multisignature custody; balance reads; transaction construction, simulation, signature or submission; EURC transfers, sponsorships, receipts, refunds or on-chain verification.

## Expected behavior and edge cases

An administrator enters through the club-oriented interface but authenticates with the same personal email identity used everywhere else. The server derives the clubs that account may administer; browser-submitted organization IDs or roles never grant access. For the MVP, each prepared club has one prepared primary administrator and one distinct club wallet stored in server-controlled database/configuration rather than frontend code.

The active primary administrator deliberately enters a club workspace, connects the prepared wallet registered to that organization and approves a fresh club-scoped message. Success yields a bounded, short-lived server-verified authority result identifying the personal administrator, demo run, organization, club wallet, purpose and expiry. The interface shows `Club wallet · Solana Devnet · Test funds` separately from both the personal session and any personal wallet.

The administrator's personal wallet cannot substitute for the club wallet. Another club's wallet, another run, an unrelated organizer, inactive/revoked organization role, staff/check-in role, a copied/expired/consumed proof or browser-selected club ID cannot authorize the club. The same wallet address cannot be both personal and organization-owned in one run.

Switching to the club wallet must not sign the browser in as the club, create a second application profile or merge identities. The personal Supabase/application session remains the accountable administrator identity, while the active wallet is treated only as separately proved club signing authority. Disconnect, account switch, proof expiry, role revocation or binding change removes club authority before a later financial prompt. Leaving the club workspace restores an honest personal context and requires the matching personal wallet before a future personal wallet-signing action.

An authenticated person without an active primary-admin role remains signed in personally but receives no club workspace or club authority. Future support for one person administering several clubs must present only a server-derived eligible list and rebind proof to the selected organization; the MVP may start with one prepared club per primary administrator.

## Assumptions, decisions, and dependencies

Confirmed with the user on 2026-09-22:

- user-facing language is **fitness or sports club**, **club workspace** and **club wallet**; the database retains the broader internal term `organization`;
- clubs receive a dedicated sign-in interface, but not separate credentials or a separate authentication system;
- administrators authenticate individually through the existing email one-time-passcode flow and remain the accountable application actors while acting for a club;
- prepared MVP clubs have public organization records, one primary administrator and a distinct club wallet; self-service creation and invitations come later;
- the public club value proposition and sign-in entrance are separate frontend work in DEV0051.

DEV0039 owns the shared `wallet_bindings` table and its one-owner-per-run/cluster constraints. DEV0047 owns the shared `auth_challenges` table because optional personal-wallet linking is delivered first. This ticket extends that reviewed organization-owner/purpose contract rather than creating a competing challenge or club-wallet table. DEV0046/DEV0040 supply the verified email subject, demo run, profile and organization-role context.

Use message signatures only for authority proof. A successful proof does not establish funds, token accounts, a valid recipient, a transaction signature or chain finality. Later financial tickets must recheck current administrator/club authority and request explicit transaction approval for each operation.

Proposed implementation default pending the readiness review: club authority lasts ten minutes at most and still ends immediately on disconnect, account change or current role/binding mismatch. The one-time proof challenge retains DEV0047's shorter five-minute lifetime.

## Implementation plan

1. Complete DEV0047's real-Phantom validation, then review the delivered binding/challenge contracts and DEV0046/DEV0040 authorization context; lock the club authority lifetime, invalidation and prepared-club configuration before implementation.
2. Extend the shared challenge purpose/organization-owner contract only as needed, then add organization binding and club-proof repository/service methods with active primary-admin checks and atomic challenge consumption.
3. Add explicit club-workspace authority state that retains the personal application session while treating the selected Phantom account only as club signing authority. Supply the bounded contract consumed by DEV0051's club sign-in entrance.
4. Invalidate authority on mismatch, disconnect, expiry, role/binding revocation or account change; never trust a club ID or role supplied by the browser.
5. Add database/service/browser tests plus a real prepared administrator/club-wallet rehearsal. Confirm no transaction or balance request is made.

## Acceptance criteria

- [ ] AC1: An individually authenticated active primary administrator can prove only the prepared distinct wallet bound to their club/run and receives a bounded, expiring club-authority result.
- [ ] AC2: Club authority is tied to the administrator's existing verified personal email identity and creates no shared club credentials, second Supabase user or duplicate personal profile.
- [ ] AC3: Personal wallet, unrelated club wallet, foreign run/organization, non-admin/staff-only actor, revoked organization role/binding and browser-selected club metadata cannot grant authority.
- [ ] AC4: Personal and organization ownership are mutually exclusive for one wallet within a run/cluster, including concurrent binding/proof attempts.
- [ ] AC5: Intentional club-wallet switching retains the administrator's personal application session but never signs in or merges the club as a user. Disconnect/account change/expiry/revocation clears club authority.
- [ ] AC6: The interface distinguishes personal session from `Club wallet · Solana Devnet · Test funds`; success claims no balance, payment, transaction signature or finality.
- [ ] AC7: SQL/repository/service tests, unit/boundary checks, lint, typecheck, build, desktop/mobile browser checks and a real prepared club-wallet message-proof rehearsal pass with exact evidence recorded.

## Validation plan

Use one prepared administrator session, its distinct prepared club wallet, another personal wallet, another club wallet, a staff-only actor, a revoked administrator and foreign-run/organization inputs. Test concurrent proof use and changes to the organization role/binding after proof issuance. Validate mutual exclusivity directly in PostgreSQL and through services.

In desktop Chrome, sign in through the existing application email route, enter the DEV0041 club-authority state, connect the club wallet, approve only the club-scoped message, inspect the separate authority state, then disconnect/change accounts and confirm authority disappears while the personal application session remains. Confirm a non-administrator receives no club authority without losing ordinary signed-in access. DEV0051 later validates the dedicated `/clubs/sign-in` presentation against this delivered contract. Run database/integration tests, unit/boundary checks, lint, typecheck, formatting, webpack build and affected desktop/mobile Playwright scenarios. No transaction approval is requested or authorized.

## Implementation record

Pending implementation. This ticket was created when the unimplemented DEV0016 plan was converted to COR0002. Its terminology and login boundary were refined on 2026-09-22 after the user clarified that the financial organizations are fitness and sports clubs and accepted a dedicated club-facing entrance backed by individual administrator login. It owns club authority only; public club messaging/entry UI belongs to DEV0051 and financial tickets remain separate.

### Changes and rationale

Not implemented.

### Affected files

| File or component | Change and purpose                                                                                  |
| ----------------- | --------------------------------------------------------------------------------------------------- |
| Pending           | Record exact prepared-club configuration, repository, service, authority-state and test files here. |

### Decisions and deviations

The 2026-09-22 planning refinement replaced user-facing `company` terminology with `club`, while preserving `organization` as the internal data model. It also rejected a shared or separate club authentication identity: the dedicated club interface is an alternate entrance for individually authenticated administrators.

### Contracts, configuration, and operations

Expected contracts are an organization-owner purpose on DEV0047's one-time challenge foundation, server-controlled prepared club-wallet configuration and a short-lived club-authority response tied to the verified administrator session. DEV0051 consumes this result after the shared email authentication flow. Record exact variables, lifetimes, hashing, invalidation and recovery behavior before completion; never record signing material.

## Validation results

Implementation validation is pending. DEV0039, DEV0040 and DEV0046 are complete; DEV0047's implementation and automated validation exist, but its required real Phantom evidence must complete before this ticket becomes Ready.

Planning validation on 2026-09-22 passed the repository-local record/link check across 70 Markdown files, 752 local links and 48 unique indexed records; DEV0052/COR0004 remain the next IDs. Focused Prettier checks and `git diff --check` passed. Application, database and wallet checks were not run because this refinement changes planning documents only.

| Criterion | Evidence | Result  |
| --------- | -------- | ------- |
| AC1–AC7   | Not run  | Not run |

## Risks, limitations, and follow-ups

The extension supports one active Phantom account at a time, so club context needs explicit UX and strong mismatch handling. A retained personal application session must never be mistaken for proof that the selected wallet belongs to the club. Later financial tickets must still display and simulate every transaction before requesting explicit user approval.

One prepared primary administrator per club is sufficient for the MVP but is not a production treasury-control model. Self-service club creation, invitations, administrator removal, wallet rotation/recovery, multisignature control and several-admin approval require separate requirements and tickets.

## Completion and review references

- Completed: Not completed.
- Commit: Not created.
- Review: Requirements refined with the user; no independent review.
- Deployment or release: None.
