# Ticket DEV0046: Account-first registration and personal wallet linking

- Status: Draft
- Created: 2026-09-21
- Last updated: 2026-09-21
- Milestone: Prioritized identity and onboarding
- Coordination: None — independent development ticket
- Related records: replaces the wallet-as-login model delivered by [DEV0038 — Phantom Supabase Web3 authentication](../../archive/backend/DEV0038-phantom-supabase-web3-authentication.md) and extends the binding foundation from [DEV0039 — Prepared identity and wallet bindings](../../archive/backend/DEV0039-prepared-identity-and-wallet-bindings.md); depends on the completed protected application context in [DEV0040 — Protected access and database context](../../archive/backend/DEV0040-protected-access-and-database-context.md); remains separate from [DEV0037 — Phantom embedded-wallet onboarding](../blockchain/DEV0037-phantom-embedded-wallet-onboarding.md) and [DEV0041 — Company wallet authorization](DEV0041-company-wallet-authorization.md)

## Objective and context

Let a person create and access a RepX Club application account before connecting a cryptocurrency wallet. A **personal wallet** is then an optional external account that the signed-in person can prove they control and link for wallet-dependent actions such as future payments or challenge transactions.

The current MVP uses the selected Phantom wallet as the Supabase login method: the person connects Phantom, signs a login message and receives an application session tied to that wallet address. That flow is suitable for the prepared-wallet demonstration, but it makes ordinary account access depend on having the wallet available.

The requested account-first direction is:

1. the person registers or signs in through a selected non-wallet method;
2. RepX Club creates or loads their application profile;
3. the signed-in person may connect a wallet later;
4. one message signature proves control of that wallet before it is linked.

This Draft ticket records the next user-prioritized change. It does not yet change the current MVP decisions C12/P08 or make email, passkeys, social login or embedded wallets part of the active MVP contract. The selected registration method, recovery policy and compatibility treatment for existing wallet-first users must be approved and added to [the MVP specification](../../../docs/mvp-spec.md) before implementation begins.

## Scope and non-goals

- In scope: select one non-wallet registration and sign-in method for the first delivery; create application accounts and profiles without a wallet; add authenticated personal-wallet link, unlink and replacement operations; prove wallet control with a short-lived, single-use message challenge; enforce one unambiguous owner for each linked wallet; define account recovery and re-authentication requirements; migrate or retain access for existing wallet-first accounts without silently merging people; add wallet settings and honest connection/linking states; update database constraints, row-level security, server boundaries, tests and product documentation.
- Out of scope: Phantom embedded-wallet creation or social wallet recovery owned by DEV0037; company-wallet authorization owned by DEV0041; wallet custody, private-key or recovery-phrase handling; payments or transaction submission; automatic account merging based only on an email address or wallet address; delegated or unattended signing; fee sponsorship; production identity-verification, fraud or dispute operations; changing the current MVP flow before this ticket is ready and implemented.

## Expected behavior and edge cases

A new person can register, sign in, sign out and recover application access without connecting Phantom. Their application account and profile exist independently from any wallet connection.

While signed in, the person can choose to link a personal wallet. Connecting Phantom only exposes the selected public address; it does not link the wallet. RepX Club requests one clearly described message signature, verifies the challenge on the server and creates the link only when the challenge belongs to the current application account, wallet, origin, Solana cluster and intended `link personal wallet` purpose. Linking never requests a transaction signature.

The following boundaries apply:

- A logged-out visitor cannot link, unlink or replace a wallet.
- A connected wallet is not treated as linked until the server accepts the proof.
- A rejected, cancelled, expired, replayed or mismatched proof leaves the account and existing binding unchanged.
- A wallet already linked to another application account cannot be claimed or used to discover private information about that account.
- Concurrent attempts cannot link one wallet to two accounts or leave two active personal-wallet records.
- Disconnecting Phantom removes the browser connection but does not unlink the durable account-to-wallet record.
- Unlinking is an explicit account-security action and must not remove the person's only way to sign in.
- Replacing a wallet must not discard the previous binding until the replacement proof succeeds. The final replacement and audit-retention rules must be fixed before implementation.
- Losing access to a wallet must not lock the person out of their application account.
- An existing wallet-first user must not be silently attached to a newly registered account. Compatibility or migration requires an explicit policy and, where accounts are combined, proof sufficient to prevent account takeover.
- Personal-wallet linking does not grant company authority. Company wallets remain separate and require DEV0041's organization-specific authorization.

## Assumptions, decisions, and dependencies

Confirmed user direction on 2026-09-21: register an application account first, add a wallet later and prioritize this work immediately after completing DEV0040, ahead of DEV0041 and the previously planned DEV0017 sequence.

The following are proposed defaults, not yet confirmed product decisions:

- support exactly one active personal wallet per application account in the first delivery, while retaining an audit history of replacements;
- require recent application re-authentication before unlinking or replacing a wallet;
- use the non-wallet account credential as the normal login method after migration rather than treating any connected wallet as an automatic login credential;
- use a phased migration that preserves existing wallet-first access until each affected person explicitly establishes the new login method.

Before this ticket can move to `Ready`, choose and document:

1. the first registration/sign-in method, for example an email link, passkey or supported identity provider;
2. recovery and re-authentication behavior for that method;
3. whether wallet-first login remains as a deliberate secondary login method or is retired after migration;
4. how existing Supabase Web3 Auth subjects and prepared Anna data are migrated without duplicate profiles or silent account merges;
5. whether the first delivery permits one or several active personal wallets.

DEV0038 supplies the existing Supabase session adapter, DEV0039 supplies the current exclusive wallet-binding foundation and completed DEV0040 supplies protected actor context. Their contracts may need migration rather than parallel replacements. DEV0037 can later provide a different way to create or access a Phantom-managed wallet, but it does not replace the RepX Club account or this ticket's linking rules.

## Implementation plan

1. Resolve the registration provider, recovery, re-authentication, wallet-count and existing-user migration decisions. Update the product specification and this ticket before implementation.
2. Review the scope before the first implementation edit. If account registration, wallet-link security and migration cannot remain one small reviewable vertical slice, convert this planning record to the next available coordination record and create fresh peer development tickets as required by the project workflow.
3. Separate application login identities from personal-wallet bindings in the database and server contracts. Add the required challenge, uniqueness, audit and row-level-security rules plus a reversible migration plan.
4. Implement server-owned registration/profile creation and authenticated link, unlink and replacement operations. Bind each challenge to its account, address, origin, cluster, purpose, expiry and single-use state.
5. Add account registration/sign-in and wallet-settings interfaces with explicit `connected`, `linked`, `mismatched`, `proof pending`, `proof failed` and `unlinked` states.
6. Apply the chosen compatibility path to existing Web3 Auth users and prepared local data without creating duplicate profiles or unauthorized links.
7. Add database, service, boundary and browser tests, then rehearse registration, recovery, link, disconnect, reconnect, replacement and migration with real supported providers and Phantom.

## Acceptance criteria

- [ ] AC1: A new person can register, receive an application profile, sign in, sign out and recover access through the selected non-wallet method without connecting a wallet.
- [ ] AC2: A signed-in person can link the intended personal Phantom account through one explicit message signature; wallet connection alone creates no binding and no transaction signature is requested.
- [ ] AC3: Expired, consumed, replayed, wrong-account, wrong-wallet, wrong-origin, wrong-cluster and wrong-purpose challenges fail without creating or changing a binding.
- [ ] AC4: Database and server constraints prevent one wallet from being actively owned by multiple application accounts, including during concurrent link or replacement attempts, without exposing another account's private details.
- [ ] AC5: Provider disconnect does not unlink the wallet. Explicit unlink and replacement require the chosen re-authentication control, preserve a working login method and recover safely from cancellation or failure.
- [ ] AC6: Existing wallet-first accounts follow the documented compatibility or migration policy without silent merging, duplicate profiles or loss of access.
- [ ] AC7: Personal and company wallet authority remain distinct, and DEV0037 embedded-wallet onboarding can integrate without becoming the application identity authority.
- [ ] AC8: The updated schema, row-level security, server boundaries, account and wallet interfaces pass focused automated checks, responsive keyboard-accessible browser scenarios and real provider rehearsals, with exact evidence recorded here.

## Validation plan

Use local Supabase with at least two application accounts, two unlinked personal Phantom addresses, one address already owned by another account and one existing wallet-first Anna account. Validate migrations, uniqueness constraints, row-level-security policies, challenge expiry/single use and concurrent linking directly in PostgreSQL and through repository/service integration tests.

Run unit and boundary tests for every challenge mismatch and session state. In supported desktop and mobile-width browsers, verify registration, sign-in, recovery, cancellation, linking, disconnect/reconnect, explicit unlink, replacement and existing-user migration. A real Phantom rehearsal must show exactly one message-signature prompt for a successful link and no transaction-signature prompt. Run the repository's relevant formatting, lint, typecheck, test, build and browser-test commands and map their results to AC1–AC8.

## Implementation record

Pending implementation. This record now captures the next delivery priority; no authentication, schema, wallet-linking or product-specification behavior changed when the ticket was created or reprioritized.

### Changes and rationale

Not implemented.

### Affected files

| File or component | Change and purpose                                                                             |
| ----------------- | ---------------------------------------------------------------------------------------------- |
| Pending           | Record the selected identity provider, schema, server, interface and test changes during work. |

### Decisions and deviations

2026-09-21: created as an independent Draft because account-first registration is a distinct product-model change, not unfinished DEV0040 work and not the same capability as Phantom embedded-wallet onboarding. Later that day, the user prioritized this ticket immediately after DEV0040; it remains Draft until its provider, recovery, migration, wallet-count and scope-split decisions are resolved.

### Contracts, configuration, and operations

Expected changes include the application identity/session contract, personal-wallet binding lifecycle, proof-challenge schema, row-level-security policies, provider configuration and migration of existing wallet-first users. Exact interfaces, environment variables, migration and rollback steps remain unresolved. No secret, private key or recovery phrase may be recorded in this ticket or repository.

## Validation results

Pending validation; no implementation exists.

- Date and environment: Not run.
- Exact commands and outcomes: Not run — ticket creation is documentation only.
- Manual steps and observed outcomes: Not run.
- Failed, blocked, or not-run checks and reasons: All implementation checks await the decisions and work above.

| Criterion | Evidence                                      | Result  |
| --------- | --------------------------------------------- | ------- |
| AC1–AC8   | No implementation; Draft planning record only | Not run |

## Risks, limitations, and follow-ups

Account recovery and wallet replacement are account-takeover risks. Provider identity collisions, email changes, reused wallet addresses and concurrent migration can create duplicate or stolen identities unless the chosen contracts are explicit and enforced by the database. Error responses must avoid revealing whether an address belongs to another person.

This ticket deliberately does not select the non-wallet sign-in provider. Provider capabilities, cost, privacy, domain configuration and local-development support must be checked against current official documentation when preparing the ticket for implementation.

Next action: choose the first non-wallet registration method and migration policy, then perform the mandatory scope review before changing the status to `Ready`.

## Completion and review references

- Completed: Not completed — Draft planning record only.
- Commit: Not created.
- Review: Planning self-review only; no independent review.
- Deployment or release: None.
