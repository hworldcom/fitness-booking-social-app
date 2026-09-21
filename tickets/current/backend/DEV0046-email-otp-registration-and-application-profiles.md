# Ticket DEV0046: Email OTP registration and application profiles

- Status: Ready
- Created: 2026-09-21
- Last updated: 2026-09-21
- Milestone: Prioritized identity and onboarding
- Coordination: [COR0003 — Account-first identity and wallet linking](../organisatory/COR0003-account-first-identity-and-wallet-linking.md)
- Related records: replaces the wallet-as-login model delivered by [DEV0038 — Phantom Supabase Web3 authentication](../../archive/backend/DEV0038-phantom-supabase-web3-authentication.md), the prepared-only enrollment delivered by [DEV0039 — Prepared identity and wallet bindings](../../archive/backend/DEV0039-prepared-identity-and-wallet-bindings.md), and the wallet-dependent actor resolution in [DEV0040 — Protected access and database context](../../archive/backend/DEV0040-protected-access-and-database-context.md); follows completed [DEV0048 — Remove gym membership access](../../archive/backend/DEV0048-remove-gym-membership-access.md); enables peer [DEV0047 — Personal wallet linking and replacement](DEV0047-personal-wallet-linking-and-replacement.md)

## Objective and context

Let anyone create and recover a RepX Club application account with a verified email one-time password (OTP) before connecting a cryptocurrency wallet. After verification, the person completes a minimal profile and becomes an ordinary participant in the active application dataset. This is application access, not gym membership. Account login, application profile and wallet ownership remain separate records.

The current implementation requires a Phantom message signature, a prepared server allowlist and an existing fixture profile. That was suitable for the prepared-wallet demonstration but makes ordinary application access depend on Phantom. On 2026-09-21 the user accepted account-first registration as the next priority and selected the defaults recorded below.

## Scope and non-goals

- In scope: open email-OTP registration and sign-in; generic anti-enumeration responses; local Mailpit delivery and documented hosted custom-SMTP requirement; minimal display-name onboarding; atomic creation of one user-sourced profile plus one active ordinary dataset-participation record; wallet-independent verified session and protected actor context; email-based sign-in recovery; removal of the prepared personal roster and Web3-first enrollment path; a deliberate local-data reset/cutover for the existing Anna test account; tests and current product/setup documentation.
- Out of scope: passwords, magic-link-only UX, Google/Apple or other social providers, experimental passkeys, phone login, organization/admin/staff/trainer assignment, gym membership or gym entitlement, wallet connection/proof/linking owned by DEV0047, company wallets owned by DEV0041, automatic account merging, production support-assisted recovery, payments or transactions.

## Expected behavior and edge cases

A visitor enters an email address and receives a six-digit code. The request response is the same whether the email is new or already registered. A valid code creates or restores the Supabase session. A first-time session remains in a bounded `profile-required` state until the person submits a display name; it has no protected product authority yet.

Profile completion runs once on the server. It creates one `record_source = 'user'` profile, a stable unique server-generated slug and one active ordinary-member participation record for the configured active application dataset. Retries return the same profile. Browser-supplied role, dataset, organization, venue, wallet or fixture identifiers are ignored. No signup path grants operator, organization, staff or trainer authority.

After profile completion, DEV0040's protected actor context derives from the verified Auth subject, claimed profile and active dataset participation without requiring a wallet binding. A wallet is absent by default and wallet-required actions remain unavailable until DEV0047 explicitly links one.

Expired, incorrect, replayed or rate-limited codes fail without creating a profile. Cancelling or losing the browser flow preserves public browsing. Sign-out removes protected access. Email access is the first-release recovery mechanism; loss of both the session and email account has no automated recovery path in this slice.

The existing local Web3 Auth user, Anna claim and wallet binding are disposable development data. The cutover resets local Auth/application data, then Anna can register with email, create a fresh profile and later link the same Phantom wallet through DEV0047. No generic production account-merging or dual-subject migration system is built for data that has never been deployed.

## Assumptions, decisions, and dependencies

Confirmed by the user on 2026-09-21:

- email OTP is the only initial registration and login method;
- registration is open rather than restricted to the prepared-wallet roster;
- first login creates an ordinary application dataset participant after minimal profile completion;
- wallets are optional and cannot be used as the new-user login method;
- no automatic identity or account merging is allowed;
- the one existing local wallet-first account may be reset and re-enrolled rather than receiving a production migration framework;
- Google/Apple login and passkeys are later refinements;
- DEV0046 is the next implementation priority.

Use the installed Supabase Auth and server-rendered cookie boundary. Local codes use Supabase's test mail server. Hosted use requires selected project/origin configuration and a real SMTP provider before release; provider selection and deployment are operational follow-ups, not permission to embed credentials.

`demo_run_memberships` remains an internal dataset-participation/role table despite its historical name. It is not a gym membership or paid entitlement. Completed DEV0048 removed the separate gym-membership capability.

This ticket preserves its DEV0046 identity and commit history while narrowing to the first concrete implementation slice. COR0003 and DEV0047 were created because account registration and wallet-proof lifecycle are independently reviewable security boundaries.

## Implementation plan

1. Update the specification from wallet-first application authentication to email-OTP account authentication with optional later wallet linking. Document local email capture and hosted SMTP/origin prerequisites.
2. Configure email OTP and replace the Web3-only verified-session contract with a provider-bounded email subject/session contract. Preserve cookie refresh, sign-out, expiry and no-store behavior.
3. Add the atomic open-profile enrollment capability and schema adjustments required for user-sourced profiles and ordinary dataset participation. Generate stable unique slugs server-side and accept no authority metadata from the browser.
4. Remove the prepared personal roster, automatic Anna enrollment and wallet requirement from base actor authorization. Keep wallet-required authority unavailable when no link exists.
5. Add email/code/profile UI states, safe return handling, cancellation/retry/rate-limit copy and accessible desktop/mobile behavior.
6. Apply the documented local reset/cutover and add unit, Auth integration, database concurrency, authorization and browser tests with at least two email accounts.

## Acceptance criteria

- [ ] AC1: A new email can request and verify an OTP, complete a display name and receive exactly one user profile plus one ordinary active dataset-participation record without connecting a wallet.
- [ ] AC2: A returning verified email restores the same Auth subject/profile; retries and simultaneous profile completion cannot create duplicates.
- [ ] AC3: New, existing, malformed, rate-limited, expired and incorrect-code requests use bounded responses that do not reveal account existence or grant partial application authority.
- [ ] AC4: Browser-supplied profile/run/role/organization/venue/wallet metadata cannot grant authority. Signup never creates gym membership, organization, operator, staff or trainer access.
- [ ] AC5: Protected actor access derives from subject/profile/active dataset participation without a wallet. Sign-out/expiry removes access, while public browsing remains available.
- [ ] AC6: Web3-first login, the prepared personal roster and automatic Anna enrollment are removed from the ordinary account path; the local reset/re-enrollment procedure is documented and rehearsed without claiming production migration.
- [ ] AC7: Local email delivery, hosted SMTP/origin requirements, environment variables, rollback/reset behavior and the DEV0047 handoff are documented without secrets.
- [ ] AC8: Database/Auth integration, concurrency, unit/boundary, lint, typecheck, build and responsive keyboard-accessible browser tests pass with exact evidence recorded here.

## Validation plan

Use local Supabase Auth/Mailpit with two new emails, one returning email, invalid/expired/replayed codes and simultaneous profile-completion attempts. Verify one subject/profile/participation tuple per account, ordinary role only, no wallet binding, no gym entitlement and isolation through DEV0040's transaction-local actor context.

Rehearse signup, code entry, profile completion, reload, sign-out, return navigation and cancellation at desktop and mobile widths. Reset the disposable local environment, re-enrol Anna by email and prove protected non-wallet access. Run focused Auth/database tests plus the full relevant unit, boundary, lint, typecheck, formatting, production build and browser suites.

## Implementation record

Pending implementation. The planning record was narrowed on 2026-09-21 after the user accepted email OTP, open registration, minimal profile creation, wallet-optional access and local reset instead of production migration.

### Changes and rationale

Not implemented.

### Affected files

| File or component | Change and purpose                                                                          |
| ----------------- | ------------------------------------------------------------------------------------------- |
| Pending           | Record exact Auth configuration, schema, service, interface and test changes during work. |

### Decisions and deviations

2026-09-21: DEV0046 originally combined account registration and the complete personal-wallet lifecycle. Because a planning commit already references DEV0046, it was preserved as the email-account/profile slice and grouped under new COR0003 with peer DEV0047 rather than converted or retired.

### Contracts, configuration, and operations

Expected contracts are email OTP request/verification, `profile-required` versus authorized session states, atomic user-profile enrollment and a wallet-independent base actor. Exact migrations and environment entries will be recorded during implementation. Hosted SMTP credentials, private keys, OTP values and recovery material must never enter source control or logs.

## Validation results

Pending validation; no implementation exists.

| Criterion | Evidence                                      | Result  |
| --------- | --------------------------------------------- | ------- |
| AC1–AC8   | No implementation; revised planning only      | Not run |

## Risks, limitations, and follow-ups

Email delivery failures and mailbox compromise affect account access. Rate limiting and generic responses reduce abuse and enumeration but do not provide production fraud operations. A local reset is valid only because no hosted users or obligations exist; reassess before any deployment containing real accounts.

DEV0047 adds optional personal-wallet ownership. DEV0037 may later add embedded wallet creation, and separate future tickets may add Google/Apple identities or stable passkeys after provider contracts are reviewed.

Next action: start this Ready ticket; its DEV0048 cleanup prerequisite is complete.

## Completion and review references

- Completed: Not completed.
- Commit: Planning commit `4250c8e` used the original DEV0046 scope; implementation commit not created.
- Review: Requirements reviewed with the user; no independent implementation review.
- Deployment or release: None.
