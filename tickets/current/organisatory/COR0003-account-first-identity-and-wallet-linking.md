# Coordination COR0003: Account-first identity and wallet linking

- Status: In progress
- Created: 2026-09-21
- Last updated: 2026-09-21
- Milestone: Prioritized identity and onboarding
- Converted from: Not applicable — created after DEV0046 already had planning commit history
- Tracked development tickets: [DEV0046 — Email OTP registration and application profiles](../backend/DEV0046-email-otp-registration-and-application-profiles.md) and [DEV0047 — Personal wallet linking and replacement](../backend/DEV0047-personal-wallet-linking-and-replacement.md)
- Related records: follows completed [DEV0038](../../archive/backend/DEV0038-phantom-supabase-web3-authentication.md), [DEV0039](../../archive/backend/DEV0039-prepared-identity-and-wallet-bindings.md) and [DEV0040](../../archive/backend/DEV0040-protected-access-and-database-context.md); completed [DEV0048 — Remove gym membership access](../../archive/backend/DEV0048-remove-gym-membership-access.md) is an independent product cleanup; [DEV0041 — Company wallet authorization](../backend/DEV0041-company-wallet-authorization.md) later consumes the shared challenge boundary

## Objective and boundaries

Coordinate the accepted change from wallet-first prepared authentication to open email-OTP application accounts with optional personal-wallet ownership. Account login/profile creation and wallet proof/replacement are separate security boundaries and direct peer development tickets.

This coordination record implements no runtime behavior and is never used in a commit subject. DEV0046 owns account/profile behavior and its validation; DEV0047 owns wallet proof/binding lifecycle and its validation.

## Direct development work

| Implementation part                       | Development ticket                                                                                             | Owned deliverable                                                                                                                        | Start condition or dependency                                      |
| ----------------------------------------- | -------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------ |
| Email account and application profile     | [DEV0046 — Email OTP registration and application profiles](../backend/DEV0046-email-otp-registration-and-application-profiles.md) | Open email-OTP Auth, minimal user profile, ordinary dataset participation, wallet-independent actor context and local reset/cutover.      | Ready; independent DEV0048 prerequisite completed. |
| Optional personal-wallet ownership        | [DEV0047 — Personal wallet linking and replacement](../backend/DEV0047-personal-wallet-linking-and-replacement.md)                   | Shared one-time challenges, personal link/unlink/replace lifecycle, recent reauthentication and honest wallet state without wallet login. | Starts after DEV0046 delivers the account/session/profile contract. |

Every implementation part is assigned exactly once. No implementation may be performed under COR0003 as a substitute for its direct DEV owner.

## Other relationships

- DEV0038–DEV0040 are completed historical baselines. DEV0046 deliberately replaces their wallet-dependent login/enrollment/actor assumptions while preserving verified sessions, server-derived authority, row-level security and transaction-local isolation.
- DEV0048 removed the separate gym-membership capability and does not belong to this identity coordination. DEV0046 can now start without accidentally creating the removed entitlement.
- DEV0041 remains a COR0002 member for company-wallet authority. DEV0047 now owns the shared challenge schema because personal linking is prioritized first; DEV0041 later extends its purpose/owner contract.
- DEV0037 remains a blocked, independent embedded-wallet provider refinement. Embedded wallet creation never becomes the application account authority.

## Delivery sequence and completion conditions

1. Completed prerequisite: DEV0048 removed gym-membership access.
2. Deliver DEV0046 and prove two email accounts can register, reload isolated profiles, recover through email and access protected data without wallets.
3. Deliver DEV0047 and prove one account can link/replace/unlink one personal Phantom wallet through message-only proof without changing account login.
4. Complete COR0003 only when both direct tickets are Completed or explicitly cancelled/replaced, their coordination fields agree, account/wallet collision and recovery integration scenarios pass, and current specification/setup documentation matches the delivered result.

## Progress and integration record

Created on 2026-09-21 after the user accepted email OTP, open registration, minimal profiles, optional one-wallet ownership, email-protected replacement, no automatic merging and local reset rather than production migration. DEV0046 already had planning commit `4250c8e`, so its identity/history was preserved and a separate coordination record plus peer DEV0047 were created instead of converting or retiring it.

## Validation results

Planning validation pending after record/index/link updates. Direct application validation belongs to DEV0046 and DEV0047.

## Risks, limitations, and follow-ups

Changing the Auth subject model affects every protected actor consumer. DEV0046 must remove only wallet dependence, not weaken server-derived profile/dataset checks. DEV0047 must not make a connected address equivalent to ownership or account login. Hosted email delivery and production recovery operations remain later deployment concerns.

## Completion and review references

- Completed: Not completed.
- Direct development tickets: DEV0046 Ready; DEV0047 Draft pending DEV0046.
- Commit: Not applicable — coordination-record IDs are not used in commit subjects.
- Review: Requirements reviewed with the user; no independent integration review.
- Deployment or release: None.
