# Ticket DEV0027: Phantom wallet connection foundation

- Status: Draft
- Created: 2026-09-20
- Last updated: 2026-09-20
- Milestone: M0 wallet foundation / M2 prerequisite
- Coordination: [COR0001 — Project structure](../organisatory/COR0001-project-structure.md)
- Related tickets: implements the connection choice from [DEV0006 — Simple devnet demo wallet](../../archive/blockchain/DEV0006-simple-devnet-demo-wallet.md) and [DEV0007 — EURC-only wallet contract](../../archive/blockchain/DEV0007-eurc-only-wallet-contract.md); enables [DEV0016 — Phantom authentication and demo access](../backend/DEV0016-phantom-auth-and-demo-access.md); later payment and challenge-transaction tickets build on this foundation

## Objective and context

Add the browser-side foundation for connecting a prepared Phantom wallet to the existing Next.js application through Wallet Standard. Deliver an honest connection state before authentication, database identity, EURC transfers, or challenge transactions are implemented. A connected public key proves only that the browser currently exposes that account; it does not sign the user into the app, assign a profile or role, establish a personal/company binding, or prove a payment.

This ticket extracts wallet discovery and connection concerns from [DEV0016](../backend/DEV0016-phantom-auth-and-demo-access.md) so the browser integration can be implemented and tested independently of Supabase. Follow the external-wallet, Solana Devnet, prepared-demo, separate-personal/company, and no-key-custody decisions in [the MVP specification](../../../docs/mvp-spec.md#8-asset-wallet-and-demo-integrity).

## Scope and non-goals

- In scope: inspect and pin compatible current Solana Kit, React, and Wallet Standard packages; add a browser-safe Devnet client/provider boundary; discover Phantom through Wallet Standard; connect and disconnect; display the shortened connected address and explicit Devnet/test-fund context; react to wallet/account changes; handle missing, locked, rejected, disconnected, and unsupported-wallet states; preserve public browsing and the existing wallet-free preview; add focused automated states and a real desktop Phantom connection rehearsal.
- Out of scope: Supabase Auth, message-sign-in challenges, profiles/run enrollment, wallet bindings, personal/company ownership proof, roles or protected routes; transaction construction/signing/simulation/submission; EURC balance authority, payments, refunds, challenge deposits/votes/claims; wallet installation/creation/funding; embedded or custodial wallets; mobile deep links; a general multi-wallet settings screen.

## Expected behavior and edge cases

The application offers a clear “Connect Phantom” action where wallet context is useful without blocking Explore, Challenges, public details, search, How it works, or the local preview. Connecting shows the current shortened public key, Solana Devnet, and wording that connection is separate from app sign-in. Disconnecting clears connection-dependent UI without deleting browser preview data or claiming the wallet was signed out of a future server session.

A missing extension shows concise setup guidance. A locked wallet, rejected connection, unsupported provider, connector error, or provider disconnect returns to a usable state without showing success or losing public navigation. Rapid repeated clicks do not open duplicate prompts. The UI remains keyboard accessible and works at the supported desktop/mobile layouts; the prepared real-wallet rehearsal may remain desktop-only as already allowed by the MVP contract.

When Phantom reports a different account, the displayed address updates and all connection-scoped pending state is cleared. The change cannot select a demo persona, inherit the previous account's future authentication, or classify the address as personal/company authority. Ticket DEV0016 will consume the account-change event to invalidate authenticated transaction binding after verified identity exists.

Mainnet configuration is rejected. No seed phrase, private key, signing key, service wallet, privileged RPC credential, or wallet secret enters application state, logs, environment examples, source control, tests, or browser storage. The wallet performs any future signing; this ticket does not request a message or transaction signature.

## Assumptions, decisions, and dependencies

Phantom browser extension and Solana Devnet are adopted by DEV0006/P08. EURC-only financial behavior and separate personal/company wallets are adopted by DEV0007/C13–C15, but this connection slice does not infer wallet ownership or query an authoritative financial balance. Wallet Standard remains the integration boundary. Prefer the current `@solana/kit` client/plugin model and `@solana/react`; inspect official documentation and installed Next.js/React versions before pinning exact compatible packages.

This ticket has no database dependency and can start before or alongside DEV0015/DEV0025. It must finish before DEV0016 relies on a production connection provider. A mocked connector can cover deterministic automated states, but completion requires one real prepared Phantom connect/account-change/disconnect rehearsal; that evidence does not satisfy authentication or transaction acceptance.

## Implementation plan

1. Inspect the installed Next.js/React versions and current official Solana Kit, React, Wallet Standard, and Phantom documentation. Select and pin the smallest compatible package set; record why each dependency is needed.
2. Add browser-safe Solana configuration and client/provider modules with Devnet fixed explicitly. Keep RPC/public configuration separate from future server verification and prevent mainnet selection.
3. Add a reusable wallet connection state boundary and accessible connection UI using Phantom discovered through Wallet Standard. Preserve server rendering and avoid hydration-dependent false connected states.
4. Handle missing/locked/rejected/disconnected providers, repeated connection attempts, account changes, and disconnect cleanup. Keep connection, future authentication, and future transaction status visibly distinct.
5. Add focused state tests and browser coverage for public access, keyboard/mobile rendering, failures, account switching, and preview regression. Rehearse connect, account change, and disconnect with a real prepared Phantom extension on Devnet and record observed provider behavior.
6. Update README setup/limitations and this implementation record with exact files, dependency/configuration contracts, commands, outcomes, and remaining authentication/transaction work.

## Acceptance criteria

- [ ] AC1: A real prepared Phantom browser extension is discovered through Wallet Standard and can connect and disconnect on the supported desktop demo environment; the UI shows the current shortened address and explicit Solana Devnet/test-fund context.
- [ ] AC2: Missing, locked, rejected, disconnected, repeated-click, connector-error, and unsupported-wallet cases remain usable and never display a false connected or signed-in state.
- [ ] AC3: A Phantom account change updates connection state and clears connection-scoped pending state without selecting a profile, role, run, or personal/company authority. Connection is explicitly distinct from authentication and payment.
- [ ] AC4: Public routes and the explicit local preview remain usable without Phantom. The wallet UI is keyboard accessible and responsive, and server rendering/hydration does not expose a stale or fabricated account.
- [ ] AC5: Configuration is Devnet-only; mainnet selection and secret/key material are absent. No message signature, transaction signature, token balance, payment, challenge action, database identity, or authenticated access is claimed by this ticket.
- [ ] AC6: Focused unit/browser checks, lint, typecheck, production build, and the real Phantom rehearsal pass with exact evidence and dependency versions recorded.

## Validation plan

Use deterministic connector doubles for disconnected, connecting, connected, rejected, error, account-changed, and provider-disconnected states. Add browser checks for direct public navigation with no extension, keyboard operation, narrow/desktop layouts, repeated clicks, address/Devnet labels, account-switch cleanup, and preview persistence. Inspect production output/configuration for secrets and unsupported cluster paths. Run existing domain tests, lint, typecheck, build, and affected Playwright tests.

Separately perform a real desktop Phantom Devnet rehearsal: extension unavailable guidance, locked/rejected attempt when practical, successful connection, account switch, disconnect, reload behavior, and confirmation that no signature or transaction prompt occurs. Record limitations that cannot be automated. Mocked tests cannot replace this interoperability evidence.

## Implementation record

Created on 2026-09-20 by splitting browser connection concerns from DEV0016 before either ticket entered implementation.

- This ticket now owns Wallet Standard discovery, connection UI/state, Devnet client configuration, basic provider failures, raw account-change handling, and the real Phantom connection rehearsal.
- [Ticket DEV0016](../backend/DEV0016-phantom-auth-and-demo-access.md) was narrowed to start from an established connected account and own Supabase sign-in, replay-resistant proof, identity/run enrollment, personal/company bindings, protected access, and authenticated handling of account changes.
- [The ticket index](../../README.md) records DEV0027 under Blockchain and the new dependency for DEV0016.
- [The MVP specification](../../../docs/mvp-spec.md) now separates connection from authentication and orders DEV0027 before or alongside DEV0015/DEV0025, with DEV0016 following both DEV0015 and DEV0027.
- [The repository README](../../../README.md) links the independent wallet foundation and preserves its previous `#planned-backend-work` anchor for archived references.

This planning split changes ticket ownership and delivery order only. No package, source module, environment variable, RPC endpoint, wallet connection, signature, transaction, database record, secret, or deployment was added. There was no deviation from the requested split.

Implementation has not started. Update this record before completion with concrete before/after behavior, affected files, package/configuration contracts, decisions or deviations, and exact validation evidence.

## Validation results

- **Planning structure and links — passed:** `python3 /tmp/validate_repx_ticket_structure.py` found 23 unique indexed ticket IDs, 8 current and 15 archived records, correct status/directory placement, and valid file/heading targets across all 36 repository Markdown files.
- **Changed ticket formatting — passed:** `./node_modules/.bin/prettier --check tickets/current/backend/DEV0016-phantom-auth-and-demo-access.md tickets/current/blockchain/DEV0027-phantom-wallet-connection-foundation.md` passed.
- **Scope/dependency review — passed:** manually checked that connection/provider behavior occurs only in DEV0027, while authentication, verified bindings, server authorization, and protected routes remain in DEV0016; transaction and payment work remains outside both tickets.
- **Implementation validation — not run:** AC1–AC6 remain unchecked because no dependency, application code, real Phantom connection, test, lint, typecheck, build, browser run, signature, or transaction was performed by this planning-only split.

## Risks, limitations, and follow-ups

Wallet package APIs and Phantom interoperability must be verified against current documentation during implementation. A successful connection does not prove Supabase sign-in, wallet ownership binding, authorization, funds, token-account compatibility, or a successful transaction. Those remain in DEV0016 and later focused blockchain/payment tickets.

## Completion and review references

- Completed: Not completed.
- Commit: Not created.
- Review: Planning self-review only; no independent implementation review.
- Deployment: None.
