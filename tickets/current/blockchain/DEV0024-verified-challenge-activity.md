# Ticket DEV0024: Verified challenge activity

- Status: Draft
- Created: 2026-09-20
- Last updated: 2026-09-20
- Milestone: M4 challenge social sources
- Coordination: None — independent development ticket
- Related tickets: Planning [DEV0022](../../archive/backend/DEV0022-social-contract-and-delivery-plan.md); shared data [DEV0017](../backend/DEV0017-persistent-catalogue-and-drafts.md), delivery infrastructure [DEV0018](../backend/DEV0018-class-pass-reservations-and-confirmed-visits.md), feed/reactions [DEV0023](../backend/DEV0023-shared-social-feed-and-cheers.md); requires future M2 challenge projection/reconciliation tickets

## Objective and context

Connect verified challenge publication, entry and outcomes to the shared social feed under the actor's sharing choice and challenge visibility. Implement [source evidence and privacy](../../../docs/mvp-spec.md#source-evidence-sharing-and-privacy), [M4](../../../docs/mvp-spec.md#m4--social-loop-and-demo-delivery) and A62. The frontend's sample challenge activity is not evidence of a funded challenge or paid reward.

## Scope and non-goals

- In scope: challenge activity source mapping, persisted actor sharing preferences, deduplicated delivery, authorized feed/profile projection and correctly labelled outcome/payment states; reuse DEV0023's Cheers.
- Out of scope: implementing the challenge program, settlement rules, financial reconciler or invitation system; new transaction flows, events/attendance posts, comments, chat or notifications. Consume the verified challenge/claim projections delivered by those separate slices.

## Expected behavior and edge cases

A saved draft, wallet prompt, pending transaction or failed entry emits no published/joined activity. Only verified source transitions produce the corresponding item. Creator publication, participant entry, recorded decision/equal fallback and paid claims have distinct evidence and labels; an announced award is never described as received before transfer verification. Cheer counts never influence voting, eligibility, merit, allocations or payout.

Sharing must be an explicit visible choice tied to the relevant actor/challenge operation, persisted before asynchronous publication. Owner opt-out/hide and current challenge visibility are checked on every delivery/read/retry. Public discovery does not reveal an invite-only roster, votes or participation records. Replayed or out-of-order evidence cannot duplicate items, restore hidden content or change a paid/selected label incorrectly. A link remains subject to current entry and detail permissions.

## Assumptions, decisions, and dependencies

This is planning only. Exact source IDs, actor attribution and event ordering must be bound to the delivered M2 projection contract before this ticket becomes Ready; link those implementation tickets when created. Challenge sharing preferences must identify whose activity is published, including outcome attribution; do not infer consent from a follow, Cheer or creator action on someone else's behalf. Preserve existing P02–P05 resolution requirements in the financial tickets. No dependency is satisfied by creating synthetic funded rows.

## Implementation plan

1. Confirm delivered verified source contracts and source-to-actor attribution with the specification before implementation. Link concrete M2 dependencies and define source keys for publication, participant entry, recorded outcome and verified recipient payment.
2. Extend the existing activity types and persisted actor sharing choices through bounded migrations/mappings; reuse transactional delivery/outbox and parent visibility infrastructure from DEV0018.
3. Add adapters from verified projections to source activity, requiring source provenance and current sharing/permission checks; keep private wallet/receipt/roster/vote data out of payloads.
4. Present the corresponding cards in Community, Following and permitted profiles with DEV0023's reaction controls and existing public-detail links. Explain winner selection, fallback and received payment distinctly.
5. Test pending/failure, delayed verification, duplicate/out-of-order delivery, opt-out/hide races and restricted-audience changes. Rehearse genuine verified challenge sources with the completed M2 flow.

## Acceptance criteria

- [ ] AC1: Verified publication/entry/decision/claim sources map to attributed activity with stable unique source keys. Drafts, pending/failed signatures and unrelated transactions produce no successful activity; A62.
- [ ] AC2: Visible actor sharing choices persist, and opt-out/hide/restriction survive delayed delivery, retries and replay. Guests/other runs/unauthorized users cannot infer private participation, votes, counts or receipts; A60/A62.
- [ ] AC3: Winner selected, equal fallback and actual payment have accurate distinct labels. A Cheer neither writes a vote nor changes progress, entitlement or funds; A59/A62.
- [ ] AC4: A real M2 devnet rehearsal supplies the displayed publication/entry and outcome/payment evidence, with permitted cross-browser feed/profile visibility, public detail links and repeatable recovery. Recorded test fixtures remain labelled as fixtures.
- [ ] AC5: Source integration, real database delivery/privacy, relevant domain/browser, mobile/desktop keyboard/error checks, lint/types/build pass; missing upstream evidence keeps this ticket unfinished.

## Validation plan

Use verified-projection integration fixtures for pending/failed/finalized/out-of-order cases, real database uniqueness/authorization/outbox tests, two signed-in viewers plus unauthorized/guest contexts, and delayed visibility-change cases. Reuse DEV0023 reaction/privacy regression tests with actual challenge sources. Run the implemented checks and relevant existing npm test/lint/type/build/browser commands. Separately retain real devnet evidence from M2 for AC4; mock transactions or local sample cards cannot satisfy it.

## Implementation record

### Changes and rationale

Not started. This ticket records future source integration; no database objects, program calls or UI changes exist from this planning work.

### Affected files

Planned: activity schema/migrations, verified-projection adapters/delivery worker, existing feed/profile cards and integration tests. Actual paths depend on upstream delivery and must be recorded during implementation.

### Decisions and deviations

No implementation deviations. Keep source integration separate from DEV0023 so the class-based social loop can be validated before financial integration is ready.

### Contracts, configuration, and operations

Planned extension of activity source types and sharing preference persistence; no applied migration/API/configuration changes. Record actual replay/backfill and rollback behavior when implemented; backfill cannot bypass current consent.

## Validation results

Not run — dependencies and implementation are outstanding. Planning checks are not application, database or devnet evidence.

## Risks, limitations, and follow-ups

M2 projection/reconciliation tickets do not yet exist; this ticket remains Draft until they are linked and source attribution/sharing contracts are concrete. A complete DEV0023 feed does not prove challenge sources or devnet outcomes. No notifications or open social-network scope is added.

## Completion and review references

- Completed: Not completed.
- Commit: Not created.
- Review: Planning self-review only; no implementation or independent review.
- Deployment or release: None.
