# Ticket DEV0006: Simple devnet demo wallet

Use [AGENTS.md](../../../AGENTS.md) for workflow and [the MVP specification](../../../docs/mvp-spec.md#8-asset-wallet-and-demo-integrity) for the current product contract.

- Status: Completed
- Created: 2026-09-19
- Last updated: 2026-09-19
- Milestone: M0 / wallet scope for M2 rehearsal
- Coordination: None — independent development ticket
- Related tickets: [DEV0005 — Consolidate the community fitness MVP](../organisatory/DEV0005-consolidate-community-fitness-mvp.md)

## Objective and context

The user prioritized the easiest wallet setup for a prepared MVP demonstration with test funds. Embedded onboarding providers were discussed but not selected. Resolve P08 as an engineering choice in the single specification: Phantom browser extension, Wallet Standard connection, Solana Devnet and prepared demo profiles/wallets.

## Scope and non-goals

- In scope: record the simplicity constraint separately from the agent's wallet selection, resolve P08, clarify rehearsal setup and account boundaries, and add wallet acceptance coverage.
- Out of scope: application code, wallet installation or creation, credentials, transactions, funding, deployment, embedded authentication, and changes to P01–P07 or financial rules.

## Expected behavior and edge cases

Use three participant wallets and a separate organizer/gym wallet, funded before rehearsal. Connect the matching wallet and verify ownership with the existing expiring sign-in message; selecting a demo persona never supplies signing authority. Display Devnet and test-fund labels. Handle missing/locked wallets, wrong accounts, rejected signatures and insufficient balances without false success. Wallet account changes invalidate the old binding until verified again.

## Assumptions, decisions, and dependencies

- The user chose demo simplicity, not a wallet brand. Phantom extension is the adopted implementation choice because prepared browser wallets avoid embedded-provider and social-login setup for the rehearsal.
- Use Solana Devnet, the network intended for application development. Solana Testnet is a distinct network for validator/network testing.
- Keep prepared sessions and role checks; no production account onboarding is implied. External-wallet setup is a tradeoff acceptable for a prepared demonstration, not a claim about the easiest public onboarding.
- Official Phantom developer settings and Solana cluster documentation were checked on 2026-09-19. No dependency versions are selected by this documentation task.

## Implementation plan

1. Record this ticket and update the index before modifying the specification.
2. Add the confirmed priority; mark P08 resolved by engineering selection, preserving its stable ID and the other pending choices.
3. Update wallet preparation, boundaries and acceptance coverage in the existing specification.
4. Check local Markdown links, decision consistency, the diff and preservation of unrelated files; complete this record.

## Acceptance criteria

- [x] AC1: The specification distinguishes the confirmed simplicity priority from the selected Phantom extension/Devnet implementation; P08 is resolved and P01–P07 remain proposed.
- [x] AC2: Preparation, ownership verification, correct-wallet handling and test-fund labels are documented without implying implementation or transactions occurred.
- [x] AC3: Links resolve and changes are limited to the specification, this ticket and ticket index; historical records remain unchanged.

## Validation plan

Run a standard-library Markdown link/fragment and preservation check from `/private/tmp/fitness-wallet-choice-0006/validate.py`, compare the specification with its pre-edit snapshot, and manually review acceptance coverage. Application tests and live-wallet checks do not apply to this documentation-only task; wallet behavior must be verified during implementation.

## Implementation record

### Changes and rationale

P08 previously proposed Phantom without a settled onboarding decision. C12 now records the user's demo-simplicity priority, and P08 explicitly selects the Phantom browser extension with Wallet Standard on Devnet as an engineering decision. P01–P07 are unchanged. The wallet section covers advance funding, browser profiles, prepared sessions, fresh ownership verification, account-change handling and visible test-fund labels. M0 and new acceptance case A45 reflect that choice. Embedded onboarding remains deferred.

### Affected files

| File                                           | Change and purpose                                                              |
| ---------------------------------------------- | ------------------------------------------------------------------------------- |
| [MVP specification](../../../docs/mvp-spec.md) | Sole current wallet decision, preparation requirements and acceptance coverage. |
| [Ticket index](../../README.md)                | Record task status without duplicating the product contract.                    |
| This ticket                                    | Scope, rationale and verification evidence.                                     |

### Decisions and deviations

2026-09-19: distinguish the confirmed priority from the selected brand; retain P08's stable ID with a resolved status. No deviation from this ticket's plan. The prior conversation's embedded-provider comparison was exploratory and did not select a provider.

### Contracts, configuration, and operations

Documentation contract only: external user-controlled wallet, Devnet and existing server-authorized demo profiles. No code, schema, environment variables, dependencies or secrets changed. No wallet was installed, created, funded or used to sign. Operational preparation and transaction rehearsal remain prerequisites for the later app demo.

## Validation results

- Date and environment: 2026-09-19, local repository, standard-library Python; no application package exists.
- `python3 /private/tmp/fitness-wallet-choice-0006/validate.py` — passed after completion-record updates: 14 Markdown files, 104 local links, 35 fragments, balanced fences; 11 unrelated files unchanged; P01–P07 unchanged; 12 confirmed constraints and 8 stable decision IDs covered by 45 acceptance cases; one current specification.
- `diff -u /private/tmp/fitness-wallet-choice-0006/mvp-spec-before.md docs/mvp-spec.md` — manually reviewed: only date, decision status, C12/P08, wallet section, M0 reference and A45 changed. Exit 1 indicates the expected differences, not a validation failure.
- Read official Phantom test-network settings and Solana cluster documentation; both confirm the selected Devnet flow. Browser-extension behavior itself was not tested.
- Application tests, builds, wallet setup and devnet transactions: not run because this ticket changes documentation only.

| Criterion | Evidence                                                                                             | Result |
| --------- | ---------------------------------------------------------------------------------------------------- | ------ |
| AC1       | Decision-status assertions, unchanged P01–P07 comparison and manual diff review.                     | Passed |
| AC2       | Manual wallet-flow review plus A45 and required-text checks; implementation status remains explicit. | Passed |
| AC3       | Local link/fragment checks and snapshot hashes of unrelated files.                                   | Passed |

## Risks, limitations, and follow-ups

Wallet setup, funding and the real devnet rehearsal remain future implementation work. Public users would need to install/connect a compatible wallet; embedded onboarding can be revisited after the hackathon. Unrelated product choices remain pending.

## Completion and review references

- Completed: 2026-09-19 — wallet scope selected and documentation validated.
- Commit: Not created.
- Review: Self-review against AC1–AC3 completed; no independent review or pull request.
- Deployment or release: None; documentation only.
