# Ticket DEV0018: Membership booking and confirmed visits

- Status: Draft
- Created: 2026-09-19
- Last updated: 2026-09-20
- Milestone: M3 membership access slice / M4 shared class activity
- Coordination: None — independent development ticket
- Related tickets: [DEV0014 — Plan](../../archive/backend/DEV0014-database-and-backend-plan.md); depends on [DEV0015](../../archive/backend/DEV0015-supabase-database-foundation.md), [DEV0040](DEV0040-protected-access-and-database-context.md), and [DEV0017](DEV0017-persistent-catalogue-and-drafts.md)

## Objective and context

Replace the browser-only membership booking with one complete server-backed path: an eligible member reserves a class, optionally shares the join, and assigned gym staff confirms the visit. This proves database concurrency/authorization and the social evidence model before connecting money. Follow [participation evidence](../../../docs/mvp-spec.md#4-participation-and-attendance-evidence), [class access](../../../docs/mvp-spec.md#7-class-passes-payments-and-refunds) and [social permissions](../../../docs/mvp-spec.md#9-social-behavior-and-permissions).

## Scope and non-goals

- In scope: server-checked seeded membership, capability-owned booking/attendance/activity repositories and services, atomic class capacity/reservations/access, idempotent booking/cancel, staff-scoped check-in, deduplicated visits, shared class-join/hide/cancel activity and durable delivery records.
- Out of scope: paid passes or payment holds, EURC transfers/refunds, event-ticket redemption, challenge winner scoring or payouts, live external gym inventory, production staff onboarding, Cheer/reaction services and verified challenge activity sources. Cafe/event participation never produces a gym visit through this route.

## Expected behavior and edge cases

An eligible member books without a payment-wallet prompt. Two concurrent requests for the last place cannot oversell; retried requests reuse one result and conflicting idempotency payloads fail. Recheck membership and class/time rules on the server, not the current frontend `membership` flag. Sharing defaults on with an explicit opt-out; public join state appears only after confirmed reservation, and cancellation updates the same item. Hiding survives retries and delayed delivery. Activity retains actor/run, source identity, original occurrence time and latest visibility/current booking state for the social data contract. Cancellation updates the same item and does not reset its occurrence time. Personal activity is visible only to authorized signed-in viewers in the same run; public catalogue details retain guest access.

Only staff assigned to that venue/run may redeem valid class access. An attendee cannot self-confirm. Reject cancelled/invalid access and out-of-window requests; duplicate check-ins do not add visits. Payment/booking/sharing and no-show do not imply attendance. Use the resolved P07 venue-local day/window rule, including midnight/DST boundaries. A confirmed visit must retain its staff actor, timestamp and access evidence.

## Assumptions, decisions, and dependencies

DEV0015–DEV0017 provide foundation mappings, verified users/roles and shared screens. This ticket owns the repositories and services for its reservation/access/check-in/visit/activity tables; it does not add methods to a generic DEV0015 repository. **P07 remains proposed:** decide daily deduplication and check-in window before freezing schema indexes/check-in rules. This ticket does not count planning as approval. Class schedules/operators are simulated hackathon fixtures; staff authorization and database transitions are real. Membership cancellation releases its place under a stated access policy; no payment refund is involved. Use append-only transition/audit evidence for terminal access changes, and a transaction/outbox model for reliable social delivery.

## Implementation plan

1. Resolve P07 in the specification and document the adopted membership booking/cancellation boundaries. Add reservation/access/check-in/visit/social/idempotency/outbox migrations with run ownership, unique source keys and necessary locks/indexes.
2. Implement atomic reserve/cancel services, membership validation and deterministic idempotency; preserve history while releasing capacity once. Add no paid booking path until the separate payment adapter exists.
3. Implement restricted staff confirmation and deduplicated visit projection; check venue/time/access authority inside the mutation transaction, including cancellation/check-in races.
4. Deliver shared activity from confirmed state using the latest visibility and booking status; support opt-out, hide and cancellation without duplicate or restored posts. Distinguish a recorded visit from a challenge decision. Preserve the source/actor/time/visibility fields required by the [social data design](../../../docs/mvp-spec.md#social-data-design); DEV0023 consumes these records for chronological feeds and reactions.
5. Integrate existing class/profile/feed screens and a minimal restricted staff view. Rehearse member → booking → optional shared join → staff confirmation with a second browser; exercise failures and resets without deleting historical obligations.

## Acceptance criteria

- [ ] AC1: P07 is explicitly resolved; only an eligible member can book, with no payment prompt, and last-seat/concurrent duplicate requests cannot oversell or double-book.
- [ ] AC2: Retry/cancel/conflicting idempotency and cancellation/check-in races yield consistent access/capacity and retained transition evidence.
- [ ] AC3: Authorized venue staff records valid access once; wrong venue/run, self-confirmation, cancelled access, duplicates and time-window violations fail. Event tickets cannot enter the gym visit path.
- [ ] AC4: Shared join, opt-out, hide and cancellation honor current visibility even after delayed delivery; no private receipt/wallet data leaks or visit is inferred from joining. Source keys, actor/run, stable occurrence time and current visibility support downstream ordering/authorization; anonymous/cross-run activity reads fail.
- [ ] AC5: Database concurrency/role/timezone tests and two-user desktop/mobile/keyboard flows pass; recorded visits are labelled as simulated gym operations and no real payment or challenge win is implied.

## Validation plan

Use real PostgreSQL transactions with simultaneous last-seat requests, retry/conflicting payloads and cancel/check-in races. Test staff and owner/run authorization, daily boundaries/DST per resolved P07, duplicate access and no-show. Run outbox replay/visibility tests, authenticated two-browser journey and affected existing domain/browser checks, lint/types/build. Integration tests use controllable local time; demo schedules/fixtures must stay honest. Real devnet rehearsal is not applicable to the membership-only path and remains required for later paid paths.

## Risks, limitations, and follow-ups

P07 and staff fixture assignment are prerequisites to implementation, not waived requirements. This finishes one membership-access slice, not all M3. Paid class passes need separate payment intent/verification/refund work; events need separate host authorization, resolved ticket policy and benefit redemption; challenge rewards remain program-controlled. [DEV0023](DEV0023-shared-social-feed-and-cheers.md) adds the full shared feed and Cheers; [DEV0024](../blockchain/DEV0024-verified-challenge-activity.md) adds verified challenge sources using this delivery infrastructure.

## Implementation record

Planning update, 2026-09-20 ([DEV0022](../../archive/backend/DEV0022-social-contract-and-delivery-plan.md)): align activity source fields, stable chronology and signed-in visibility with C19; leave reaction/feed refinement and challenge sources to DEV0023/DEV0024. No booking, attendance or database feature was implemented by this update.

Planning refinement, 2026-09-20: this ticket owns booking/attendance/activity repositories and services for the tables it introduces. DEV0015 supplies only the database foundation and mappings for its base tables; DEV0025 supplies boundary enforcement.

Not started. This ticket defines future work only; no code, dependencies, database objects or service configuration have been created. Update this section with affected files, decisions/deviations, contracts and actual evidence during implementation.

## Validation results

Not run — implementation has not started. Planning/link checks do not satisfy the acceptance criteria above. Record exact implemented commands, environment, failures and passed results before completion.

## Completion and review references

- Completed: Not completed.
- Commit: Not created.
- Review: Planning self-review only; no independent implementation review.
- Deployment: None.
