# Ticket DEV0018: Class-pass reservations and confirmed visits

- Status: Draft
- Created: 2026-09-19
- Last updated: 2026-09-24
- Milestone: M3 class-pass access / M4 shared class activity
- Coordination: None — independent development ticket
- Related records: [DEV0014 — Plan](../../archive/backend/DEV0014-database-and-backend-plan.md); depends on [DEV0015](../../archive/backend/DEV0015-supabase-database-foundation.md), completed [DEV0040](../../archive/backend/DEV0040-protected-access-and-database-context.md), [DEV0017](DEV0017-persistent-catalogue-and-drafts.md), and a not-yet-created verified class-pass payment ticket; revised by completed [DEV0048 — Remove gym membership access](../../archive/backend/DEV0048-remove-gym-membership-access.md) and [DEV0058 — Adopt the fitness-access MVP contract](../../archive/organisatory/DEV0058-fitness-access-mvp-contract.md)

## Objective and context

Turn a verified, paid class pass into one server-backed reservation/access path, then let assigned venue staff confirm the resulting visit. This proves database concurrency, scoped staff authorization and the social evidence model for the pass product. Memberships have returned to the product direction, but their entitlement/program contract belongs to later tickets and cannot be fabricated by this pass slice. Follow [participation evidence](../../../docs/mvp-spec.md#4-participation-and-attendance-evidence), [class passes](../../../docs/mvp-spec.md#7-class-passes-payments-and-refunds) and [social permissions](../../../docs/mvp-spec.md#9-social-behavior-and-permissions).

## Scope and non-goals

- In scope: consume verified class-pass payment evidence from the future payment ticket; capability-owned reservation, access, check-in, visit, activity, idempotency and outbox repositories/services; atomic capacity confirmation; pass cancellation/refund-state integration; staff-scoped check-in; deduplicated visits; and optional shared class activity.
- Out of scope: creating or verifying the on-chain payment/refund transaction itself, implementing the membership product/program/entitlement source, event tickets or sponsorship funding, external inventory, production staff onboarding, reactions and unverified activity sources. Event participation never produces a gym visit through this route.

## Expected behavior and edge cases

A class reservation is confirmed only from valid server-verified payment/access evidence. Two concurrent requests for the last place cannot oversell; retries reuse one result and conflicting idempotency payloads fail. A payment, reservation, shared post or no-show does not prove attendance. Sharing is an explicit choice, and cancellation updates the same activity rather than creating a misleading second event. Personal activity is visible only to authorized signed-in viewers in the same application dataset; public catalogue details retain guest access.

Only staff assigned to the class venue and dataset may redeem valid access. An attendee cannot self-confirm. Reject cancelled, refunded or otherwise invalid access and out-of-window requests; duplicate check-ins do not add visits. Use the resolved P07 venue-local day/window rule, including midnight and daylight-saving-time boundaries. A confirmed visit retains its staff actor, timestamp and access evidence.

## Assumptions, decisions, and dependencies

DEV0015, DEV0040 and DEV0017 provide base mappings, verified users/roles and shared screens. A separate future ticket must own payment intent, wallet transaction, server verification and refund obligations before this ticket can become Ready. This ticket owns the repositories and services for the reservation/access/check-in/visit/activity tables it introduces. **P07 remains proposed:** decide daily visit deduplication and the check-in window before freezing schema indexes/check-in rules. Class schedules and venue operators are hackathon fixtures; authorization and database transitions are real.

`demo_run_participants` remains an internal record meaning that a profile participates in one isolated application dataset. It is not a consumer membership, class subscription or proof of class access. This ticket may not recreate the removed entitlement table, eligibility flag or no-payment preview branch. A future verified membership source must use its own reviewed contract before DEV0018 can consume it.

## Implementation plan

1. Resolve P07 and document class-pass cancellation/refund/access boundaries. Confirm the payment ticket's durable verified-payment contract.
2. Add reservation, access, check-in, visit, activity, idempotency and outbox migrations with dataset ownership, source keys, transition history and concurrency indexes.
3. Implement atomic pass-to-reservation confirmation and cancellation/refund-state handling; preserve history and release capacity exactly once.
4. Implement restricted staff confirmation and deduplicated visit projection, including cancellation/check-in races and venue/time/access checks inside the mutation transaction.
5. Deliver optional activity from confirmed reservation state with stable occurrence time and current visibility. Integrate class/profile/feed and a minimal restricted staff view.

## Acceptance criteria

- [ ] AC1: P07 and the upstream verified-payment contract are explicit; only valid class-pass access can confirm a reservation, and last-seat/concurrent requests cannot oversell or double-book.
- [ ] AC2: Retry, cancellation, refund-state and conflicting-idempotency races yield consistent capacity/access plus retained transition evidence.
- [ ] AC3: Authorized venue staff records valid access once; wrong venue/dataset, self-confirmation, invalid access, duplicates and time-window violations fail. Event tickets cannot enter this visit path.
- [ ] AC4: Shared activity, opt-out, hide and cancellation preserve authorization and current visibility without leaking receipt/wallet data or implying attendance.
- [ ] AC5: Database concurrency, role and timezone tests plus two-user desktop/mobile/keyboard flows pass; operations are labelled as simulated venue operations and no unrelated product outcome is inferred.
- [ ] AC6: This ticket creates no membership entitlement, eligibility flag or unverified no-payment membership-booking path. Any later membership access source must be independently verified and explicitly integrated.

## Validation plan

Use real PostgreSQL transactions with simultaneous last-seat requests, retries, conflicting payloads and cancellation/refund/check-in races. Test staff and profile authorization, daily boundaries, daylight-saving-time behavior, duplicate access and no-show. Run outbox replay/visibility tests, an authenticated two-browser journey, affected domain/browser checks, lint, types and build. Real Devnet payment evidence remains the responsibility of the payment ticket and is an integration prerequisite here.

## Risks, limitations, and follow-ups

P07, staff fixture assignment and the verified-payment ticket are prerequisites. Memberships need separate product/program/projection tickets before they can become another access source. Events need separate host authorization, ticket policy and benefit redemption. [DEV0023](DEV0023-minimal-shared-activity-feed.md) adds the reaction-free shared activity view using verified sources from this ticket and later access slices.

## Implementation record

Planning history: the ticket originally proposed seeded gym-membership booking as a payment-free first slice. On 2026-09-21 the user removed memberships, and DEV0048 deleted that schema/preview behavior. On 2026-09-24 the user adopted a new programmable-membership direction. DEV0058 keeps this ticket intentionally scoped to verified class passes; the new membership model must not silently restore the old no-payment branch. No implementation for DEV0018 exists yet.

## Validation results

Not run — implementation has not started. Planning and link checks do not satisfy the acceptance criteria.

## Completion and review references

- Completed: Not completed.
- Commit: Not created.
- Review: Planning self-review only; no independent implementation review.
- Deployment: None.
