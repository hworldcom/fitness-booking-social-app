# Ticket DEV0005: Consolidate the community fitness MVP

- Status: Completed
- Created: 2026-09-18
- Last updated: 2026-09-18
- Milestone: Product specification, before application implementation
- Coordination: None — independent development ticket
- Related tickets: [DEV0003](DEV0003-consolidate-project-documentation.md), [DEV0004](DEV0004-class-join-feed-and-badge-scope.md)

## Objective and context

The user requested updating all earlier product decisions after discovering that the current specification still described the older booking-focused MVP. Replace that baseline in the [single current specification](../../../docs/mvp-spec.md) with community and sponsored challenges, gym discovery and paid class passes, gym-confirmed visits, and public class-join activity. Preserve the removal of on-chain badges.

## Scope and non-goals

- In scope: reconcile all confirmed discussion decisions; distinguish remaining proposed defaults; replace product scope, screens, evidence rules, architecture, challenge/pass lifecycles, wallet/demo approach, business rationale, milestones, acceptance cases and demo script; repair contributor links if section names change.
- Out of scope: application/program implementation, tests claiming runtime behavior, live gym integrations, mainnet or real money, on-chain badges, external publication, wallet transactions, Git initialization, commits and rewriting historical tickets/archive.

## Expected behavior and edge cases

- Participant-funded community challenges use participant voting with at least half of the registered participants voting, rounded up. Sponsor-funded challenges use creator selection. Missing quorum or the creator missing the 24-hour deadline produces an equal split, not an indefinite locked pool.
- Cancellation before challenge start returns actual contributions to their funders. Proposed detail covers empty/undersubscribed challenges, ties, deadline boundaries, one-token pools, rounding, independent claims and duplicate settlement.
- Real devnet class-pass purchases remain in scope. Purchases within the final 24 hours and no-shows are non-refundable under the user's rule; the broader cancellation-time cutoff remains explicitly proposed. Failed fulfillment recovery must not be confused with voluntary cancellation.
- Gym-confirmed visits are required, independent of purchase and social sharing. On-chain badges remain excluded. Confirmed class joins can appear in the public app feed under the existing sharing controls.
- Confirmed choices are not left only in chat; unresolved details are not presented as individually approved. Architecture, milestones and acceptance cases must use the new scope consistently.

## Assumptions, decisions, and dependencies

- User instruction to update everything authorizes this coordinated documentation rewrite. It does not authorize transactions or application deployment.
- Retain `docs/mvp-spec.md` as the sole product contract. Historical files remain byte-for-byte unchanged; old anchors referenced by them should continue resolving through explicit compatibility anchors where needed.
- Keep the earlier recommendations as clearly identified proposed defaults: 24-hour community vote window, no self-votes, ties split, equal community stakes, participant limits, cancellation-time refund cutoff, token coverage, fallback eligibility and wallet onboarding.
- The specification may be complete as a decision record while product defaults still need resolution before their dependent financial implementation. No new permission gate is introduced for independent work.
- Use existing Solana skill guidance for conceptual boundaries; verify primary sources for external facts added to the specification. Do not install tooling or add credentials as part of a documentation task.

## Implementation plan

1. Prepare this ticket and index entry before edits; snapshot current Markdown content for preservation checks.
2. Build the confirmed/proposed decision register and rewrite the current specification around a bounded challenge-first MVP.
3. Align smart-contract versus application responsibilities, recovery and privacy rules, delivery milestones, acceptance coverage and demo instructions.
4. Update only affected navigation in AGENTS/index; preserve README ownership and all contributor workflow rules.
5. Check all Markdown links/anchors/fences, frozen historical records, decision-to-acceptance coverage and stale baseline claims. Manually review financial boundaries and the whole new plan.
6. Finish the implementation/validation record and mark the ticket/index complete only after documentation checks pass.

## Acceptance criteria

- [x] AC1: Every confirmed product decision from the discussion appears in the current specification, including both challenge modes, voting quorum, fallbacks, cancellation refunds, passes, visits and badge exclusion.
- [x] AC2: Remaining choices are a clearly labelled proposed-default register; financial examples and acceptance cases reference those defaults without pretending user approval.
- [x] AC3: Program/application authority, transaction verification, deadlines, settlement/refunds, claims, capacity and visit evidence form a coherent, reviewable architecture.
- [x] AC4: Screens, business positioning, milestones, definition of done, acceptance cases and demo all reflect the new scope; old external-booking/mixed-membership obligations no longer drive delivery.
- [x] AC5: One active product spec remains, local Markdown links/anchors/fences pass, historical files and contributor workflow are preserved, and no application or external state changes occur.

## Validation plan

Run a one-off standard-library Python checker for local links, heading/explicit anchors, fenced blocks, file hashes and confirmed-decision coverage. Review new scope/acceptance mappings and representative quorum, tie, refund-cutoff, failed-fulfillment, attendance and visibility scenarios manually. Use ripgrep to find obsolete active baseline language. Application lint/build/program tests and devnet transactions are not applicable to this documentation-only change; specify them as future milestone evidence, never as completed validation.

## Implementation record

Documentation consolidation completed on 2026-09-18. No application/program functionality was implemented or deployed.

### Changes and rationale

The prior specification still centered on invite-only training plans, three membership/external/PAYG booking routes, EURC-only payments and a booking-provider adapter. Challenges were only mentioned in a pending-revision notice, and gym check-in/no-show behavior was still deferred. That baseline is now replaced throughout the existing specification.

The new document records 11 confirmed decisions and eight proposed-default groups, with references from 44 acceptance scenarios. Both challenge modes, turnout quorum, timeout/equal fallback, pre-start deposit returns, real class-pass purchase, late-purchase/no-show restrictions, gym-confirmed visits, social class joins and removal of on-chain badges are explicit. Pending cancellation-time, voting-window/tie, contribution/eligibility, asset, visit-count and wallet choices are not silently treated as confirmed answers.

The architecture now includes a bounded challenge program and per-challenge vaults with immutable allocation and independent claims; the app retains local class capacity, staff attestations, social privacy and gym-wallet refund recovery. Booking, gym attendance, challenge decision and actual payout use separate evidence. Milestones M0–M4 now move from foundation to program correctness, real devnet challenges, gym passes/visits and social/demo delivery. Business positioning focuses on easy creation for existing communities, with competitive uniqueness and revenue assumptions stated as hypotheses.

The former external booking simulator, separate training-plan flow and trainer revenue split no longer drive required delivery. README remains navigation. Contributor product links now point to the new sections; four explicit compatibility anchors keep prior section links useful without rewriting historical records.

### Affected files

| File or component                                              | Change and purpose                                                                     |
| -------------------------------------------------------------- | -------------------------------------------------------------------------------------- |
| [MVP specification](../../../docs/mvp-spec.md)                 | Consolidate product decisions, architecture and delivery in the sole current contract. |
| [AGENTS.md](../../../AGENTS.md)                                | Repair affected navigation labels/anchors only if needed.                              |
| [Ticket index](../../README.md)                                | Track this coordinated documentation update.                                           |
| [Ticket DEV0005](DEV0005-consolidate-community-fitness-mvp.md) | Prepared plan and durable validation record.                                           |

### Decisions and deviations

2026-09-18: Used a confirmed/proposed register so all prior decisions are durable even while a few product details remain open. Retained the existing specification path and added compatibility anchors instead of creating competing briefs or editing historical tickets.

2026-09-18: Chose independent program-controlled claims as the engineering design for payouts/returns; the UI distinguishes allocated funds from actual transfers. Claims preserve fixed beneficiaries and cannot pay twice. This makes the fallback implementable without requiring all recipients in one transaction. It is a proposed implementation design, not evidence of a deployed contract.

2026-09-18: During self-review clarified that P03 excludes the creator from entering their own sponsored challenge, limited the post-start cancellation restriction to customer cancellation, qualified badge-claim exclusion so payout claims remain in scope, and made the demo's staff confirmation obey the actual class check-in window. Added program-side chronology/positive-amount validation. These are refinements within the planned edge-case review; no material scope deviation.

### Contracts, configuration, and operations

Revised planned interfaces/data responsibilities include challenge terms/participants/votes/settlement/claims, class passes and gym-confirmed visits, source-keyed social activity and explicit token configuration. The design adds an Anchor/Rust program to the existing web-stack proposal and replaces generic booking-provider orchestration with a small local reservation service. These are specification changes only; there are no installed packages, migration files, runtime configuration, credentials, wallet actions or deployments.

Current devnet mint references and chain authority/atomicity notes link to official Circle/Solana documentation. The demo duration reference links to current Colosseum submission guidance; the exact target event remains a scheduling input. The original Word document, archive and completed tickets remain untouched.

## Validation results

Validated locally on 2026-09-18 using standard-library Python, ripgrep and manual contract review.

- `python3 /private/tmp/fitness-mvp-consolidation-0005/validate.py` — passed: 13 Markdown files, 98 local links, 34 heading/explicit-anchor fragments and balanced code fences. Nine unrelated/historical files match their pre-edit hashes; AGENTS is unchanged except its product-navigation paragraph. One active product Markdown file remains. All 11 confirmed and eight proposed IDs appear in the 44-case acceptance matrix, and M0–M4 are present. Checks for obsolete baseline claims passed.
- `rg -n 'baseline|still being consolidated|EURC-only|EURC acceptance|external simulator|strongest optional|class-price refund for cancellation before|attendance/check-in, no-show rules|no custom program|provider|badge|24 hours|quorum' docs/mvp-spec.md AGENTS.md README.md tickets/README.md` — manually reviewed matches. Old baseline references only explain replacement/deferment; the former unrestricted refund paragraph, required external simulator, deferred attendance row and EURC-only acceptance requirement are absent.
- Read the decision register, product/business scope, screens, financial/evidence sections, social rules, milestones, acceptance matrix and demo together. Confirmed the new architecture and delivery use the same modes, states and authority boundaries. Reviewed five/six-participant quorum examples, quorum versus winner vote share, deadline inclusivity, fallback/cancellation recipients, deterministic token-unit remainder allocation, unknown-send recovery, pass refund exceptions, visit deduplication and delayed social-event privacy.
- A Python workspace inventory reports 13 files, all Markdown. No application scaffold, dependency/configuration file or code was introduced.
- Official Circle USDC/EURC address pages, Solana PDA/transaction documentation and Colosseum submission guidance were checked read-only. No chain transaction or external write was performed.
- Application lint/build, program tests and devnet rehearsals were not run because no implementation exists. Their required evidence is specified for future milestones, not reported as passed here. No documentation check remains failed or blocked.

| Criterion | Evidence                                                                                                                                  | Result |
| --------- | ----------------------------------------------------------------------------------------------------------------------------------------- | ------ |
| AC1       | C01–C11 register, behavior sections and mapped A01–A44 scenarios reviewed against the discussion.                                         | Passed |
| AC2       | P01–P08 explicitly proposed, with affected implementation boundaries; referenced throughout examples and acceptance cases.                | Passed |
| AC3       | Manual review of program/app authority, funding/vote/claim/refund boundaries, reservation recovery and attendance evidence.               | Passed |
| AC4       | Four-tab product, updated business rationale, M0–M4, 12 definition-of-done items, 44 acceptance scenarios and new demo reviewed together. | Passed |
| AC5       | Local document/link/anchor/fence/hash/workflow checks and Markdown-only inventory passed.                                                 | Passed |

## Risks, limitations, and follow-ups

The document now consolidates all discussion points, but P01–P08 remain proposed product defaults and must be resolved where their dependent implementation requires them. This is no longer a missing-documentation issue. The demo must not imply automated fitness verification, production identity guarantees or real gym partnerships. Program implementation, actual devnet evidence, target-event scheduling and any real-money pilot remain future work. Prepare separate implementation tickets for those slices; this ticket does not authorize a deployment or claim runtime correctness.

## Completion and review references

- Completed: 2026-09-18; all product decisions consolidated into the single specification with aligned architecture, milestones, acceptance and demo.
- Commit: Not created.
- Review: Self-reviewed against AC1–AC5; no independent review or pull request.
- Deployment or release: Not applicable; documentation only.
