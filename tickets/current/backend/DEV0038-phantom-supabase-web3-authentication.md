# Ticket DEV0038: Phantom Supabase Web3 authentication

- Status: Ready
- Created: 2026-09-20
- Last updated: 2026-09-20
- Milestone: M0 identity / M2 wallet prerequisite
- Coordination: [COR0002 — Phantom authentication and demo access](../organisatory/COR0002-phantom-auth-and-demo-access.md)
- Related records: depends on completed [DEV0015 — Supabase database foundation](../../archive/backend/DEV0015-supabase-database-foundation.md), [DEV0025 — Next.js backend boundary](../../archive/backend/DEV0025-nextjs-backend-boundary.md), and [DEV0027 — Phantom wallet connection foundation](../../archive/blockchain/DEV0027-phantom-wallet-connection-foundation.md); enables [DEV0039 — Prepared identity and wallet bindings](DEV0039-prepared-identity-and-wallet-bindings.md); [DEV0037 — Phantom embedded-wallet onboarding](../blockchain/DEV0037-phantom-embedded-wallet-onboarding.md) is a non-blocking follow-up

## Objective and context

Prove the first real application-authentication slice: use DEV0027's selected Phantom Wallet Standard account to complete Supabase Auth's Solana Web3 sign-in, establish a server-verified session, reload it and sign out. The interface must distinguish an external wallet connection from a RepX Club session and must never imply profile, run, role or company authority before later tickets establish those mappings.

This is the first implementation ticket under COR0002. It implements the provider/session boundary from the specification's [authentication recommendation](../../../docs/mvp-spec.md#authentication-and-data-access-recommendation) without adding application identity enrollment or protected product data.

## Scope and non-goals

- In scope: inspect the installed Next.js, Supabase and Solana Kit versions and current official integration guidance; enable the local Supabase Auth services/configuration needed for Solana Web3; add browser/server Supabase clients and verified server-side session refresh; adapt the normalized DEV0027 Phantom account to `signInWithWeb3`; add minimal accessible sign-in/sign-out/session-status UI; handle rejection, expiry, reload, disconnect and account mismatch honestly; configure a bounded local demo signup/rate-limit control; add focused unit, database/config and desktop/mobile browser tests; perform one real extension sign-in/reload/sign-out rehearsal.
- Out of scope: `wallet_bindings`, `auth_challenges`, prepared profile/run enrollment, roles, row-level security policies for product data, protected product routes, company-wallet proof, email/SMS/password or OAuth login, embedded wallets, transaction construction/signing/submission, balances or payments.

## Expected behavior and edge cases

A connected prepared Phantom account can choose `Sign in to RepX Club`, review and approve a Sign-In With Solana message, and receive a Supabase session. This is a message signature only: it moves no funds and requests no transaction signature. Reload restores the verified Supabase session; explicit sign-out clears it without disconnecting Phantom or deleting preview data.

Wallet-connected and application-signed-in states remain separate. Rejection, locked wallet, expired provider proof, invalid origin/domain, unavailable local Auth service, malformed provider response and rate limiting leave a usable connected-but-signed-out state. Rapid repeated requests produce one active attempt. Browser copy never echoes arbitrary provider text.

Disconnecting or selecting a different Phantom account must not silently transfer the existing session to that account. Until DEV0039/DEV0040 add application bindings and protected data, the UI marks the signer/session mismatch and prevents another sign-in attempt from merging subjects. Explicit company-wallet switching is not introduced here. Session cookies use current server-verified Supabase APIs and never treat editable Auth metadata as profile/run/role authority.

## Assumptions, decisions, and dependencies

Completed DEV0027 supplies the only Wallet Standard connection store. Reuse its Solana Kit account/signer and do not add legacy wallet adapters, `window.phantom`, `@solana/web3.js`, Phantom Connect or a second wallet store. Verify the adapter shape against the installed package versions and current official documentation before source changes.

Use local Supabase for implementation and validation. A hosted project, production origin, region and billing plan are not required for this ticket. Record every new public environment variable and setup step, but never record a service-role key, wallet secret, recovery phrase or private key. Supabase's verified Web3 subject is only an authentication subject; DEV0039 decides which prepared application actor it may claim.

## Implementation plan

1. Inspect current package and bundled framework documentation plus current Supabase Solana Web3/SSR contracts. Record the exact compatibility decision before adding dependencies or configuration.
2. Enable the minimum local Supabase Auth configuration and add browser/server client factories with safe public configuration and server-verified cookie refresh.
3. Add a narrow adapter from DEV0027's normalized Phantom account to the wallet interface accepted by `signInWithWeb3`; keep provider-specific code at the browser authentication boundary.
4. Add accessible session controls and honest connected/signed-out/signed-in/mismatch/error states. Ensure rejection and sign-out preserve public browsing and preview data.
5. Add focused tests for adapter/session/error behavior, local Auth configuration, server verification, reload/sign-out, request de-duplication and desktop/mobile browser states. Rehearse the real prepared extension without requesting a transaction signature.

## Acceptance criteria

- [ ] AC1: A real prepared Phantom account completes Supabase Solana Web3 sign-in on desktop, reloads the same server-verified session and signs out; only a message-signature prompt occurs.
- [ ] AC2: Wallet connection alone remains visibly signed out. Rejection, locked wallet, invalid/expired proof, unavailable Auth and rate limiting never show a false RepX Club session.
- [ ] AC3: Disconnect/account change cannot silently move or merge the session into the newly selected wallet. The mismatch is explicit and protected follow-up actions remain unavailable.
- [ ] AC4: Server code verifies the current Supabase session using supported server APIs; client cookies or editable Auth metadata never grant profile, run, role or company authority.
- [ ] AC5: Local Auth setup, public configuration, rate/signup boundary and recovery steps are documented without committing provider credentials or wallet secrets. Public browsing and preview persistence still work without Supabase or Phantom.
- [ ] AC6: Focused tests, relevant local Supabase checks, lint, typecheck, formatting, production build and affected desktop/mobile browser regressions pass with exact results recorded.

## Validation plan

Run the local Supabase services required for Auth and prove sign-in with the user's prepared Phantom extension. Exercise approval, rejection, reload, sign-out, disconnect and account change; inspect the prompt to confirm it is a message signature and not a transaction. Use isolated browser contexts for session leakage checks.

Add unit tests around the signer adapter and state mapping, integration checks for verified versus forged/expired sessions, and Playwright coverage for wallet-only, signed-in, mismatch, error and responsive/keyboard states. Run database/config validation, existing unit/boundary tests, lint, typecheck, formatting, webpack production build and the affected browser suite. A hosted Supabase deployment is not required and must not be claimed.

## Implementation record

Pending implementation. This ticket was created when the unimplemented DEV0016 plan was converted to COR0002. It owns only the provider/session proof; later peer tickets own application identity, database authorization and company authority.

### Changes and rationale

Not implemented.

### Affected files

| File or component | Change and purpose                        |
| ----------------- | ----------------------------------------- |
| Pending           | Record exact files during implementation. |

### Decisions and deviations

None yet.

### Contracts, configuration, and operations

Expected to add local Supabase Auth/public client configuration and an application-owned signer adapter. Final variable names, dependency versions and recovery steps must be recorded after the installed-version review. No secrets may be committed.

## Validation results

Pending validation. Planning/link checks do not satisfy AC1–AC6.

| Criterion | Evidence | Result  |
| --------- | -------- | ------- |
| AC1–AC6   | Not run  | Not run |

## Risks, limitations, and follow-ups

The installed Solana Kit signer may require a small adapter because Supabase examples often use other wallet interfaces; prove the real combination before relying on it. Local Web3 Auth configuration and CAPTCHA/rate-limit capabilities may differ from hosted Supabase, so record local limitations and create a separate operational ticket before public deployment if needed.

DEV0039 remains blocked until the verified Auth subject/session contract is known. This ticket does not make a Supabase user an allowed RepX Club actor.

## Completion and review references

- Completed: Not completed.
- Commit: Not created.
- Review: Planning self-review only; no independent review.
- Deployment or release: None.
