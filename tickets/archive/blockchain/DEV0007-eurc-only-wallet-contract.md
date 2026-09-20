# Ticket DEV0007: EURC-only wallet contract

Use [AGENTS.md](../../../AGENTS.md) for workflow and [the MVP specification](../../../docs/mvp-spec.md) for current product requirements.

- Status: Completed
- Created: 2026-09-19
- Last updated: 2026-09-19
- Milestone: Product specification / M0–M4
- Coordination: None — independent development ticket
- Related tickets: [DEV0005 — MVP consolidation](../organisatory/DEV0005-consolidate-community-fitness-mvp.md), [DEV0006 — Demo wallet choice](DEV0006-simple-devnet-demo-wallet.md)

## Objective and context

The user accepted the review adjustments to the EURC wallet discussion and explicitly selected EURC only. Resolve P06 and incorporate the accepted balance, business-wallet, demo-label and scope boundaries into the sole current specification. Preserve the prepared Phantom extension flow and existing on-chain challenge rules.

## Scope and non-goals

- In scope: EURC-only prices, fixtures, transfers, returns and acceptance coverage; separate business and personal wallets; spendable versus committed/claimable balances; honest test-fund labels; explicit deferral of P2P, promotional rewards, rewards treasury and consumer add-funds flows; unchanged program-enforced challenge outcomes.
- Out of scope: app/program code, wallet creation or funding, deployments, transactions, new embedded-wallet providers, fee sponsorship, production banking, edits to the source discussion or historical records, and resolving unrelated P01–P05/P07 choices.

## Expected behavior and edge cases

- Every MVP business transfer uses the configured Circle Solana Devnet EURC mint. Test SOL is still needed for network and account costs, never offered as a purchase/pool asset. Wrong tokens and wrong clusters are rejected.
- A company has a dedicated wallet, separate from its primary admin's personal wallet. The company wallet receives pass payments, signs refunds and funds/judges company-sponsored challenges; cancelled sponsored funds return to the original company wallet. Staff check-in permission does not authorize treasury operations.
- A private balance summary distinguishes available EURC from contributions committed to pools and unclaimed allocations. Failed/unknown transactions cannot create spendable money, double subtract balances or claim a completed payout.
- Euro-formatted prices retain visible test-EURC labels. No real-euro redemption, fiat balance or automatic funding is implied. Mainnet remains disabled.
- Backend submission does not authorize arbitrary winners or bypass quorum, deadlines, cancellation, fixed beneficiaries or claims.

## Assumptions, decisions, and dependencies

- Acceptance refers to the review adjustments, not blanket adoption of the attached document's embedded login, platform sponsorship and expanded money-transfer features.
- Retain stable P06/P08 IDs with resolved status. P06 is now a user decision; other financial/default choices remain proposed.
- Prepare three participant wallets, an organizer's personal wallet, and a separate business wallet for the initial financial demo company. Additional companies used for payments need their own business wallets; catalogue-only fixtures do not require funding.
- Circle's official EURC address list and public faucet were checked on 2026-09-19. Runtime mint/account validation and actual test funding remain implementation prerequisites.

## Implementation plan

1. Prepare this ticket and index before specification changes.
2. Update decision status, confirmed constraints and P06; propagate the single asset through scope, fixtures, transactions, milestones and demo.
3. Define private balance presentation, company wallet/authority bindings and original-funder refunds; retain existing settlement mechanics.
4. Add focused acceptance cases and deferred-scope boundaries.
5. Validate links, decision coverage, stale assumptions, unchanged unrelated proposals/history, and manually review the diff. Complete this record and index.

## Acceptance criteria

- [x] AC1: EURC is the sole MVP payment/pool asset throughout the active spec; P06 is resolved, SOL costs remain explicit, and no old USDC fixture or optional-EURC scope survives.
- [x] AC2: Business/personal wallet separation, company authority and original-company returns are consistent across fixtures, data records and financial flows.
- [x] AC3: Private available/committed/claimable presentation and test-fund labelling are explicit; new transfers/rewards/onboarding features remain deferred.
- [x] AC4: Existing challenge settlement rules, Phantom choice and unrelated unresolved proposals are preserved; new decisions have acceptance coverage.
- [x] AC5: Local links/fragments and documentation checks pass; only the active specification, index and this ticket change.

## Validation plan

Use standard-library Python checks at `/private/tmp/fitness-eurc-wallet-0007/validate.py` for local Markdown links/fragments, stable decision/acceptance IDs, stale text and snapshot hashes. Compare the specification against the saved pre-edit copy and manually inspect financial/authority implications. Application tests and live wallet checks are not applicable to this documentation-only task.

## Implementation record

### Changes and rationale

The active spec previously proposed USDC with optional EURC, combined the organizer/gym wallet in demo preparation and did not define a private balance summary. It now records confirmed C13–C15, resolves P06 to EURC only, updates P08 preparation to separate personal/company wallets, and propagates those choices through fixtures, records, challenge authority, pass purchases/refunds, milestones and the demo script.

New A46–A49 cover asset/network rejection and labels, company authority and original-funder returns, available/committed/awaiting-transfer accounting, and rejection of arbitrary backend winner selection. The prior 45 cases remain unchanged. The 20 → 15 → 25 available-balance example makes finality and unclaimed rewards reviewable. No consumer money-transfer dashboard, platform rewards or embedded onboarding was added.

### Affected files

| File                                           | Change and purpose                                                                                              |
| ---------------------------------------------- | --------------------------------------------------------------------------------------------------------------- |
| [MVP specification](../../../docs/mvp-spec.md) | Current EURC-only contract, business ownership, balance UX, bounded scope and acceptance evidence requirements. |
| [Ticket index](../../README.md)                | Task status and navigation.                                                                                     |
| This ticket                                    | Authorization interpretation, implementation record and validation evidence.                                    |

### Decisions and deviations

- 2026-09-19: the latest user message adopts the review adjustments and EURC only. It does not adopt the attachment's separate embedded-login, fee-sponsorship, P2P or promotional-rewards proposals. No deviation from the ticket plan.
- A company uses its dedicated wallet as the frozen sponsor funding/decision authority and return recipient. Its admin's personal wallet cannot substitute. Under the still-proposed P03 rule, the known admin personal wallet is excluded from that company's sponsored entry allowlist; this is bounded demo enforcement, not a claim of Sybil resistance.
- Five prepared wallets cover the three participants, the organizer personally and one company. Catalogue-only gyms require no funded wallet.
- P01–P05/P07 remain proposed; existing quorum, deadlines, allocations, claims and social permissions were preserved.

### Contracts, configuration, and operations

Specification-level records now include personal/business wallet ownership, one primary company admin, separate creator attribution and frozen on-chain signing/funding/return authority. Every financial intent uses the exact Circle Devnet EURC mint, with SOL only for network/account costs. Actual schemas, runtime configuration and generated clients are not implemented. No migration is needed because there is no app/database yet; later implementation must establish ownership verification and balance reconciliation.

The external discussion and all completed records remain unchanged. No dependency, key, wallet, token balance or deployment was created or modified.

## Validation results

- Date/environment: 2026-09-19, local documentation workspace, standard-library Python. No application package or test commands exist.
- `python3 /private/tmp/fitness-eurc-wallet-0007/validate.py` — passed local Markdown links/fragments and balanced fences; 12 unrelated files unchanged; six unresolved proposals and all 45 existing acceptance rows unchanged; 15 confirmed constraints and eight stable decision IDs mapped to 49 cases. No stale USDC/optional-EURC assumptions remain in the active spec.
- The same checker compares deadline, quorum/voting, allocation/claim and social-contract blocks against the pre-edit snapshot: all unchanged. One current specification and five milestone IDs remain.
- Reviewed the unified diff saved at `/private/tmp/fitness-eurc-wallet-0007/spec.diff`, including `sed -n '140,265p' /private/tmp/fitness-eurc-wallet-0007/spec.diff`: company source/recipient rules, EURC-only flows, private balances, test labels and exclusions match the scope.
- Checked [Circle's published EURC addresses](https://developers.circle.com/stablecoins/eurc-contract-addresses) and [public faucet](https://faucet.circle.com/) on 2026-09-19; funding and on-chain mint verification were not performed.
- App tests, build, wallet rehearsal and transactions: not run; this task changes only documentation. No check failed or is blocked.

| Criterion | Evidence                                                                                         | Result |
| --------- | ------------------------------------------------------------------------------------------------ | ------ |
| AC1       | P06 resolution, asset/mint checks, stale-text scan and full fixture/demo propagation review.     | Passed |
| AC2       | Company binding/authority review; A47 and original-company cancellation/refund requirements.     | Passed |
| AC3       | Balance example and A48; labels, pending/finality behavior and explicit deferred flows reviewed. | Passed |
| AC4       | Unchanged-contract comparisons, Phantom retained and decision/acceptance mapping.                | Passed |
| AC5       | Local link/fragment checks, expected-file set and snapshot hashes.                               | Passed |

## Risks, limitations, and follow-ups

No code or chain evidence is delivered. Test funding, Phantom signing, company-wallet switching and balance reconciliation require implementation and rehearsal. P01–P05 and P07 remain unresolved product defaults; this task must not silently approve them.

## Completion and review references

- Completed: 2026-09-19 — accepted EURC/wallet review adjustments incorporated into the sole specification and validated.
- Commit: Not created.
- Review: Self-review against AC1–AC5 complete; no independent review or pull request.
- Deployment or release: None; specification only.
