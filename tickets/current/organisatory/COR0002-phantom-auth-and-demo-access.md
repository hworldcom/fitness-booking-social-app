# Coordination COR0002: Phantom authentication and demo access

- Status: In progress
- Created: 2026-09-19
- Last updated: 2026-09-21
- Milestone: M0 identity / M2 wallet prerequisite
- Converted from: Retired `DEV0016`
- Tracked development tickets: completed [DEV0038 — Phantom Supabase Web3 authentication](../../archive/backend/DEV0038-phantom-supabase-web3-authentication.md), completed [DEV0039 — Prepared identity and wallet bindings](../../archive/backend/DEV0039-prepared-identity-and-wallet-bindings.md), [DEV0040 — Protected access and database context](../backend/DEV0040-protected-access-and-database-context.md), and [DEV0041 — Company wallet authorization](../backend/DEV0041-company-wallet-authorization.md)
- Related records: depends on completed [DEV0015 — Supabase database foundation](../../archive/backend/DEV0015-supabase-database-foundation.md), [DEV0025 — Next.js backend boundary](../../archive/backend/DEV0025-nextjs-backend-boundary.md), and [DEV0027 — Phantom wallet connection foundation](../../archive/blockchain/DEV0027-phantom-wallet-connection-foundation.md); enables [DEV0017 — Persistent catalogue and private drafts](../backend/DEV0017-persistent-catalogue-and-drafts.md); blocked [DEV0037 — Phantom embedded-wallet onboarding](../blockchain/DEV0037-phantom-embedded-wallet-onboarding.md) is a non-MVP follow-up

## Objective and boundaries

Coordinate the replacement of the implicit Anna preview persona with verified RepX Club identities backed by prepared Phantom wallets and Supabase Auth. Wallet connection, Sign-In With Solana, application identity/run enrollment, protected data access and company-wallet authority remain separate security boundaries even when the interface presents a continuous flow.

This record preserves the complete planning intent of retired DEV0016 while assigning each implementation boundary to one small peer development ticket. It does not authorize source, dependency, configuration, migration or test changes and is never used in a commit subject.

The coordinated result implements the specification's [authentication and data access recommendation](../../../docs/mvp-spec.md#authentication-and-data-access-recommendation), [demo account model](../../../docs/mvp-spec.md#3-demo-fixtures-and-account-model), public-access rules C17/C19, and prepared-wallet decisions C12/C14/P08. It does not implement payments, token balances, transaction submission, open signup, embedded wallets or a general organization-admin interface.

## Direct development work

| Implementation part                    | Development ticket                                                                                                        | Owned deliverable                                                                                                                                                                                                                        | Start condition or dependency                                                                          |
| -------------------------------------- | ------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| Phantom-to-Supabase authentication     | [DEV0038 — Phantom Supabase Web3 authentication](../../archive/backend/DEV0038-phantom-supabase-web3-authentication.md)   | Adapt DEV0027's selected Wallet Standard account to Supabase Web3 Auth; add local Auth configuration, verified session refresh/sign-out, honest connected-versus-signed-in UI, provider abuse limits and real desktop sign-in evidence.  | Completed after passing the automated suite and real approval/reload/sign-out/failure-state rehearsal. |
| Prepared identity and personal binding | [DEV0039 — Prepared identity and wallet bindings](../../archive/backend/DEV0039-prepared-identity-and-wallet-bindings.md) | Add shared `wallet_bindings`, server-only wallet-to-Anna configuration, atomic idempotent enrollment from the verified Supabase subject and durable personal-binding behavior across wallet disconnect/reconnect.                        | Completed after automated checks and the real enrollment/disconnect/reconnect rehearsal passed.        |
| Protected access and database context  | [DEV0040 — Protected access and database context](../backend/DEV0040-protected-access-and-database-context.md)            | Add reusable server authorization, transaction-local subject/dataset context, first private row-level security policies, route/action guards, safe return destinations and private-cache/session invalidation.                           | In progress against the locked contracts; completion enables DEV0017.                                  |
| Separate company-wallet authority      | [DEV0041 — Company wallet authorization](../backend/DEV0041-company-wallet-authorization.md)                              | Use the shared exclusive wallet-binding contract, add one-time `auth_challenges`, and require a fresh company-wallet proof that combines authenticated admin membership with the correct distinct business wallet without a transaction. | DEV0039 is complete; waits for DEV0040's verified admin/run context.                                   |

Every former DEV0016 implementation concern has one owner. Cross-ticket integration validation remains in this coordination record; fixes found during integration return to the ticket that owns the affected behavior or receive a new peer DEV ticket if they are genuinely new scope.

## Other relationships

- Completed DEV0015 supplies `auth.users`, profiles, runs, memberships, organizations and default-deny database foundations; it does not own the new Auth/identity repositories or policies.
- Completed DEV0025 supplies server-only/import enforcement; each direct ticket must preserve its service/repository direction.
- Completed DEV0027 supplies the normalized Phantom Wallet Standard account and signer but grants no application authority.
- DEV0017 is a downstream consumer of the DEV0038–DEV0040 identity/access sequence. It owns catalogue/profile/draft/follow/bookmark persistence rather than authentication.
- DEV0018 and DEV0023 consume the same verified access context later. They are not direct COR0002 members.
- DEV0037 may later add embedded Phantom onboarding. Its Portal blocker does not prevent this extension-first sequence.
- Financial and on-chain tickets may later consume DEV0041's company-authority result; DEV0041 itself signs no transaction and verifies no payment.

## Delivery sequence and completion conditions

1. Deliver DEV0038 first and prove one real Phantom message-signature login, session reload and sign-out through local Supabase Auth. Connection-only state must remain visibly unauthenticated.
2. Deliver DEV0039 against the proven Auth subject/session shape. Use private server configuration to atomically and idempotently enroll only the prepared Anna profile from the verified wallet, without a second Phantom prompt. Preserve the durable binding when the user disconnects while blocking live wallet-required actions until the same wallet reconnects.
3. Deliver DEV0040 after verified enrollment exists. Apply authorization and row-level security to protected server paths while retaining anonymous Explore, Challenges and public detail access.
4. Deliver DEV0041 after the shared binding contract and protected admin/run context exist. DEV0041 adds the one-time company challenge because the company wallet differs from the admin's personal sign-in wallet. DEV0017 may start after DEV0040 without waiting for DEV0041, but company and later financial flows cannot.
5. Complete this coordination only when every direct DEV ticket is Completed or explicitly Cancelled/replaced, their reciprocal `Coordination` fields agree with this work map, and the integrated flow passes local database replay, distinct-wallet/replay/cross-run denial, desktop/mobile browser regression, lint, typecheck and production build.

DEV0040 is the next direct implementation slice. Hosted Supabase project selection is not required for the local proof; hosted region/plan and production origin configuration remain later operational decisions.

## Progress and integration record

The original DEV0016 was created on 2026-09-19 as a broad follow-up to the database plan. It accumulated Supabase Web3 Auth, replay-resistant enrollment, identity repositories, SQL authorization context, route guards, personal/company bindings, provider abuse controls and browser integration. No Auth source, dependency, configuration, database migration, application session, implementation evidence or commit was created under DEV0016.

On 2026-09-20, the browser connection boundary had already been split into completed DEV0027. The authentication plan briefly changed to embedded-first Phantom Connect, then returned to the prepared extension when Phantom Portal paused new developer sign-ups; blocked DEV0037 preserves that future direction.

Pre-implementation review on 2026-09-20 found that the remaining plan still contained four independently reviewable security boundaries. In accordance with the repository's flat workflow, DEV0016 was retired and converted to COR0002. Fresh DEV0038–DEV0041 now own the implementation. The split changes no product behavior or accepted security rule.

DEV0038 completed on 2026-09-20. The local Solana Web3 provider and cookie-based verified session path are running, the application adapter uses DEV0027's one Wallet Standard account, automated/configuration/browser checks pass, and the corrected prepared-Phantom flow passed approval, reload, cancellation, account-switch/disconnect and local sign-out without a transaction prompt.

On 2026-09-21, the user selected Anna Klein for the first prepared personal wallet and chose to reuse DEV0038's verified Supabase wallet proof for personal enrollment. DEV0039 will not request a second Phantom signature. Explicit wallet disconnect remains available and preserves the durable personal binding and Supabase session while disabling live wallet-required actions. Because the company wallet is a different signer, DEV0041 now owns the fresh one-time application challenge.

DEV0039 moved to In progress on 2026-09-21 after locking its `wallet_bindings` matrix, narrow default-deny database function boundary, server-only roster shape, no-body identity endpoints, rollback behavior and disconnect/reconnect validation contract.

DEV0039 completed on 2026-09-21. The shared binding migration, server-derived Anna enrollment, restricted repository/API boundary, durable disconnect UI and local runtime-login setup passed automated validation. The user then confirmed one Supabase login prompt followed by Anna enrollment without a second Phantom prompt, reload persistence, disconnect with the Anna session preserved and successful same-wallet reconnect. A read-only check found exactly one active Anna binding for one Auth subject. DEV0040 is unblocked.

DEV0040 moved to Ready on 2026-09-21 after locking its verified-actor shape, five transaction-local database settings, live validation predicate, three-table read-only policy matrix, `/api/auth/actor` response, public/private route matrix, safe-return rules, cache/invalidation behavior and exact preview-versus-database mode decision. Its review also clarified that dataset participation is not a gym membership, Proxy refresh is not authorization, configured failures never fall back to fixtures and a Supabase session must complete actor revalidation before returning to a protected page.

DEV0040 implementation started on 2026-09-21 against those locked contracts.

DEV0040's migration, server actor/context boundary, current-actor API, route guards, safe return handling and browser invalidation are implemented. Fresh migration replay, 63 SQL assertions, schema lint, 9 driver tests, 44 unit/boundary tests, configured build/guest checks and the full configuration-free desktop/mobile regression pass. The owning ticket remains In progress only for a configured authenticated rehearsal of the new actor endpoint and protected-page return flow; no code or database blocker remains.

## Validation results

- **Conversion eligibility — passed:** retired DEV0016 contained planning only; no implementation file, validation evidence or commit used that ID.
- **Ownership review — passed:** the direct-work map assigns provider authentication, prepared identity/bindings, protected database access and company-wallet authority exactly once; downstream application-data tickets remain separate.
- **Dependency review — passed:** completed DEV0015/DEV0025/DEV0027 satisfy DEV0038's start conditions; DEV0039 consumes the delivered Auth contract, DEV0040 waits for the personal binding contract, and DEV0041 waits for both that binding and DEV0040's verified admin/run context before adding company challenges.
- **Record/index validation — passed:** the repository contains 38 unique DEV/COR records with correct current/archive placement and index paths; retired DEV0016 has no active record, and the index reserves the next IDs as DEV0043/COR0003.
- **Reciprocal membership and links — passed:** all DEV records have valid coordination metadata, DEV0038–DEV0041 link back to this record, this record tracks exactly those peers, and repository-relative targets resolve across all 58 Markdown files.
- **2026-09-21 enrollment/disconnect planning consistency — passed:** DEV0039, DEV0040, DEV0041, this coordination map and the MVP specification agree that personal enrollment reuses the verified Supabase wallet without a second prompt, durable personal binding survives provider disconnect, and DEV0041 owns the fresh company-wallet challenge. Focused Markdown formatting, repository-relative link and whitespace checks passed; no application implementation check was applicable to this planning update.
- **DEV0039 automated implementation evidence — passed:** two clean database replays, 43 pgTAP checks, 8 real-driver checks including concurrent enrollment, 40 unit/boundary/configuration checks, schema lint, application lint/typecheck/format, webpack production build and 34 desktop/mobile Playwright checks passed.
- **DEV0039 real-wallet integration evidence — passed:** the user confirmed the one-prompt enrollment, Anna identity, reload, disconnect-preserved session and same-wallet reconnect flow; the database contained one active Anna binding for one subject. The completed owning ticket records the full evidence.
- **DEV0039 completion/archive integrity — passed:** the repository validator found 38 unique records with valid lifecycle placement and index paths; all 600 repository-local links resolved across the 58 Markdown files in the DEV0039 commit snapshot.
- **Formatting/diff checks — passed for affected current documentation:** Prettier accepted README, the MVP specification and all ticket records; `git diff --check` passed. A broader `**/*.md` check also includes untouched historical `docs/archive/2026-09-18/implementation-plan.md`, which has a pre-existing formatting mismatch and was not rewritten by this planning change.
- **Implementation checks — not applicable:** this coordination conversion changes planning records only. Each direct DEV ticket owns its application and database validation.
- **DEV0038 integration evidence — passed:** the completed ticket records 36/36 focused tests, lint, typecheck, formatting, configuration-free and configured browser/build checks, healthy local Auth services and a real Phantom approval/reload/cancellation/account-switch/sign-out rehearsal.
- **DEV0040 automated implementation evidence — passed:** fresh migrations and seed, 63 pgTAP assertions, schema lint, 9 one-connection driver tests, 44 unit/boundary tests, lint, typecheck, formatting, configured production build, 4 configured guest desktop/mobile checks and 40 configuration-free desktop/mobile regressions passed. Its owning record contains the exact commands, failure corrections and criterion mapping.
- **DEV0040 authenticated integration evidence — pending:** the prepared wallet must confirm the bounded authorized actor response, protected-page entry and sign-out/disconnect behavior before DEV0040 is completed and archived.

## Risks, limitations, and follow-ups

Supabase Web3 Auth compatibility with the installed Solana Kit wallet signer is proven by completed DEV0038. Provider proof authenticates a wallet only; DEV0039 combines it with private server configuration and database constraints rather than browser-selected profile/run data. Company-wallet switching must preserve the personal admin session while changing only separately proved company authority.

Extension-first onboarding adds a setup step and does not support ordinary mobile browsers. DEV0037 can change that experience only after Portal access returns and its migration/account-linking behavior is reviewed.

## Completion and review references

- Completed: Not completed.
- Direct development tickets: DEV0038–DEV0039 Completed; DEV0040 In progress; DEV0041 Draft.
- Commit: Not applicable — coordination-record IDs are not used in commit subjects.
- Review: Pre-implementation scope and ownership self-review completed; no independent review.
- Deployment or release: None.
