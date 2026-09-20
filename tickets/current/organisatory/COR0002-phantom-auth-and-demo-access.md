# Coordination COR0002: Phantom authentication and demo access

- Status: In progress
- Created: 2026-09-19
- Last updated: 2026-09-20
- Milestone: M0 identity / M2 wallet prerequisite
- Converted from: Retired `DEV0016`
- Tracked development tickets: [DEV0038 — Phantom Supabase Web3 authentication](../backend/DEV0038-phantom-supabase-web3-authentication.md), [DEV0039 — Prepared identity and wallet bindings](../backend/DEV0039-prepared-identity-and-wallet-bindings.md), [DEV0040 — Protected access and database context](../backend/DEV0040-protected-access-and-database-context.md), and [DEV0041 — Company wallet authorization](../backend/DEV0041-company-wallet-authorization.md)
- Related records: depends on completed [DEV0015 — Supabase database foundation](../../archive/backend/DEV0015-supabase-database-foundation.md), [DEV0025 — Next.js backend boundary](../../archive/backend/DEV0025-nextjs-backend-boundary.md), and [DEV0027 — Phantom wallet connection foundation](../../archive/blockchain/DEV0027-phantom-wallet-connection-foundation.md); enables [DEV0017 — Persistent catalogue and private drafts](../backend/DEV0017-persistent-catalogue-and-drafts.md); blocked [DEV0037 — Phantom embedded-wallet onboarding](../blockchain/DEV0037-phantom-embedded-wallet-onboarding.md) is a non-MVP follow-up

## Objective and boundaries

Coordinate the replacement of the implicit Anna preview persona with verified RepX Club identities backed by prepared Phantom wallets and Supabase Auth. Wallet connection, Sign-In With Solana, application identity/run enrollment, protected data access and company-wallet authority remain separate security boundaries even when the interface presents a continuous flow.

This record preserves the complete planning intent of retired DEV0016 while assigning each implementation boundary to one small peer development ticket. It does not authorize source, dependency, configuration, migration or test changes and is never used in a commit subject.

The coordinated result implements the specification's [authentication and data access recommendation](../../../docs/mvp-spec.md#authentication-and-data-access-recommendation), [demo account model](../../../docs/mvp-spec.md#3-demo-fixtures-and-account-model), public-access rules C17/C19, and prepared-wallet decisions C12/C14/P08. It does not implement payments, token balances, transaction submission, open signup, embedded wallets or a general organization-admin interface.

## Direct development work

| Implementation part                    | Development ticket                                                                                             | Owned deliverable                                                                                                                                                                                                                       | Start condition or dependency                                                                  |
| -------------------------------------- | -------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------- |
| Phantom-to-Supabase authentication     | [DEV0038 — Phantom Supabase Web3 authentication](../backend/DEV0038-phantom-supabase-web3-authentication.md)   | Adapt DEV0027's selected Wallet Standard account to Supabase Web3 Auth; add local Auth configuration, verified session refresh/sign-out, honest connected-versus-signed-in UI, provider abuse limits and real desktop sign-in evidence. | In progress after completed DEV0015, DEV0025 and DEV0027; first delivery in this coordination. |
| Prepared identity and personal binding | [DEV0039 — Prepared identity and wallet bindings](../backend/DEV0039-prepared-identity-and-wallet-bindings.md) | Add personal `wallet_bindings`, one-time application challenges, prepared profile/run enrollment, identity repositories and replay-resistant mapping from the verified Supabase subject to one allowed actor.                           | Starts after DEV0038 proves the real Auth subject/session contract.                            |
| Protected access and database context  | [DEV0040 — Protected access and database context](../backend/DEV0040-protected-access-and-database-context.md) | Add reusable server authorization, transaction-local subject/run context, first private row-level security policies, route/action guards, safe return destinations and private-cache/session invalidation.                              | Starts after DEV0039 supplies verified identity/run mapping; enables DEV0017.                  |
| Separate company-wallet authority      | [DEV0041 — Company wallet authorization](../backend/DEV0041-company-wallet-authorization.md)                   | Use the shared exclusive wallet-binding contract and add a fresh company-wallet proof that combines authenticated admin membership with the correct distinct business wallet, without creating or sending a financial transaction.      | Starts after DEV0039's binding contract and DEV0040's verified admin/run context.              |

Every former DEV0016 implementation concern has one owner. Cross-ticket integration validation remains in this coordination record; fixes found during integration return to the ticket that owns the affected behavior or receive a new peer DEV ticket if they are genuinely new scope.

## Other relationships

- Completed DEV0015 supplies `auth.users`, profiles, runs, memberships, organizations and default-deny database foundations; it does not own the new Auth/identity repositories or policies.
- Completed DEV0025 supplies server-only/import enforcement; each direct ticket must preserve its service/repository direction.
- Completed DEV0027 supplies the normalized Phantom Wallet Standard account and signer but grants no application authority.
- DEV0017 is a downstream consumer of completed DEV0038–DEV0040. It owns catalogue/profile/draft/follow/bookmark persistence rather than authentication.
- DEV0018 and DEV0023 consume the same verified access context later. They are not direct COR0002 members.
- DEV0037 may later add embedded Phantom onboarding. Its Portal blocker does not prevent this extension-first sequence.
- Financial and on-chain tickets may later consume DEV0041's company-authority result; DEV0041 itself signs no transaction and verifies no payment.

## Delivery sequence and completion conditions

1. Deliver DEV0038 first and prove one real Phantom message-signature login, session reload and sign-out through local Supabase Auth. Connection-only state must remain visibly unauthenticated.
2. Deliver DEV0039 against the proven Auth subject/session shape. Atomically consume run/user/wallet-bound challenges and allow only prepared actors to claim the intended profile.
3. Deliver DEV0040 after verified enrollment exists. Apply authorization and row-level security to protected server paths while retaining anonymous Explore, Challenges and public detail access.
4. Deliver DEV0041 after the shared challenge/binding contract and protected admin/run context exist. DEV0017 may start after DEV0040 without waiting for DEV0041, but company and later financial flows cannot.
5. Complete this coordination only when every direct DEV ticket is Completed or explicitly Cancelled/replaced, their reciprocal `Coordination` fields agree with this work map, and the integrated flow passes local database replay, distinct-wallet/replay/cross-run denial, desktop/mobile browser regression, lint, typecheck and production build.

The first implementable slice is DEV0038. Hosted Supabase project selection is not required for the local proof; hosted region/plan and production origin configuration remain later operational decisions.

## Progress and integration record

The original DEV0016 was created on 2026-09-19 as a broad follow-up to the database plan. It accumulated Supabase Web3 Auth, replay-resistant enrollment, identity repositories, SQL authorization context, route guards, personal/company bindings, provider abuse controls and browser integration. No Auth source, dependency, configuration, database migration, application session, implementation evidence or commit was created under DEV0016.

On 2026-09-20, the browser connection boundary had already been split into completed DEV0027. The authentication plan briefly changed to embedded-first Phantom Connect, then returned to the prepared extension when Phantom Portal paused new developer sign-ups; blocked DEV0037 preserves that future direction.

Pre-implementation review on 2026-09-20 found that the remaining plan still contained four independently reviewable security boundaries. In accordance with the repository's flat workflow, DEV0016 was retired and converted to COR0002. Fresh DEV0038–DEV0041 now own the implementation. The split changes no product behavior or accepted security rule.

DEV0038 implementation has crossed the real signer boundary: the local Solana Web3 provider and cookie-based verified session path are running, the application adapter uses DEV0027's one Wallet Standard account, automated/configuration/browser checks pass, and the corrected prepared-Phantom approval produced a matched server-verified session. Reload, rejection, account-change/disconnect and sign-out evidence remains pending, so DEV0039 has not started and this coordination order is unchanged.

## Validation results

- **Conversion eligibility — passed:** retired DEV0016 contained planning only; no implementation file, validation evidence or commit used that ID.
- **Ownership review — passed:** the direct-work map assigns provider authentication, prepared identity/bindings, protected database access and company-wallet authority exactly once; downstream application-data tickets remain separate.
- **Dependency review — passed:** completed DEV0015/DEV0025/DEV0027 satisfy DEV0038's start conditions; DEV0039 waits for the real Auth contract, DEV0040 waits for the binding/challenge contract, and DEV0041 also waits for DEV0040's verified admin/run context.
- **Record/index validation — passed:** the repository validator found 37 unique DEV/COR records with correct current/archive placement and index paths; retired DEV0016 has no active record, and the index reserves the next IDs as DEV0042/COR0003.
- **Reciprocal membership and links — passed:** all DEV records have valid coordination metadata, DEV0038–DEV0041 link back to this record, this record tracks exactly those peers, and repository-relative targets resolve across all 57 Markdown files.
- **Formatting/diff checks — passed for affected current documentation:** Prettier accepted README, the MVP specification and all ticket records; `git diff --check` passed. A broader `**/*.md` check also includes untouched historical `docs/archive/2026-09-18/implementation-plan.md`, which has a pre-existing formatting mismatch and was not rewritten by this planning change.
- **Implementation checks — not applicable:** this coordination conversion changes planning records only. Each direct DEV ticket owns its application and database validation.

## Risks, limitations, and follow-ups

Supabase Web3 Auth compatibility with the installed Solana Kit wallet signer is proven for real approval; DEV0038 still needs the remaining session and failure-state rehearsal before completion. Provider proof authenticates a wallet only; it cannot silently decide application profile, run membership, organization role or company treasury authority. Company-wallet switching must preserve the personal admin session while changing only separately proved company authority.

Extension-first onboarding adds a setup step and does not support ordinary mobile browsers. DEV0037 can change that experience only after Portal access returns and its migration/account-linking behavior is reviewed.

## Completion and review references

- Completed: Not completed.
- Direct development tickets: DEV0038 In progress; DEV0039–DEV0041 Draft.
- Commit: Not applicable — coordination-record IDs are not used in commit subjects.
- Review: Pre-implementation scope and ownership self-review completed; no independent review.
- Deployment or release: None.
