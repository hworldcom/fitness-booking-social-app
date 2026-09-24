# Ticket DEV0023: Minimal shared activity feed

- Status: Draft
- Created: 2026-09-20
- Last updated: 2026-09-24
- Milestone: M4 minimal community loop
- Coordination: None — independent development ticket
- Related records: planned by completed [DEV0022 — Social contract and delivery plan](../../archive/backend/DEV0022-social-contract-and-delivery-plan.md), then materially narrowed by completed [DEV0058 — Adopt the fitness-access MVP contract](../../archive/organisatory/DEV0058-fitness-access-mvp-contract.md); depends on [DEV0017](DEV0017-persistent-catalogue-and-drafts.md), [DEV0018](DEV0018-class-pass-reservations-and-confirmed-visits.md), completed identity/protected-context work and future verified membership/event sources

## Objective and context

Replace the fixture-based For you/Following feed with a small chronological activity surface tied to real fitness participation and authorized business/event updates. A second authenticated user can follow a person, see an explicitly shared verified booking or attendance item, and open its public source to obtain access independently.

The 24 September 2026 product pivot removed Cheer reactions and challenge activity. This ticket preserves the useful discovery/retention loop while avoiding a general-purpose engagement system. Follow [section 9](../../../docs/mvp-spec.md#9-social-behavior-and-permissions), M4 and acceptance A17–A19.

## Scope and non-goals

- In scope: capability-owned feed/profile projection repositories and services, Community/Following chronological queries, stable cursor pagination, owner visibility/hide controls, safe public source links, empty/loading/error states, two-user privacy/idempotency integration and existing one-way follows.
- Out of scope: reactions/counts, `activity_reactions`, comments, messages, notifications, free-form posts, friend requests, ranking, challenge sources, new financial/attendance state or automatic sharing. Consume verified membership/pass/event/attendance sources from their owners.

## Expected behavior and edge cases

Community contains visible same-dataset activity permitted to the viewer; Following contains visible activity by followed authors. The owner's permitted items may appear on their profile. Items are newest-first with deterministic tie-breaking; hiding or source-state correction updates/removes the item without promoting it.

Publication requires a persisted visible sharing choice and verified source fact. A product draft, wallet prompt, submitted/unknown payment, unaccepted transfer or unconfirmed attendance creates no verified participation item. Business/event announcements require authorized source ownership and explicit public visibility. Retried or out-of-order delivery cannot duplicate or restore hidden items.

Guest, cross-dataset, revoked and hidden access reveal no personal activity or private receipt/wallet detail. Sign-out clears personalized caches while public catalogue routes remain usable. Opening a source link does not grant membership, ticket, reservation or attendance.

## Assumptions, decisions, and dependencies

The current browser preview has no secure shared feed. DEV0017 supplies profiles/follows and catalogue sources; DEV0018 supplies pass/visit sources. Future membership/event tickets must expose durable verified source IDs and sharing choices before this ticket can consume them. No Supabase Realtime dependency is required; ordinary revalidation is sufficient for the MVP.

The pivot deliberately removes reactions rather than merely hiding their controls. Do not create a reaction table/API or return placeholder counts.

## Implementation plan

1. Review delivered actor/run/source contracts and freeze the safe activity projection plus source visibility rules.
2. Add the activity/delivery schema, same-dataset constraints, stable chronological indexes and parent-aware row-level security; do not add reaction storage.
3. Implement authenticated Community/Following/profile projections and idempotent source publication/hide behavior using verified actor context.
4. Integrate accessible feed/profile states and public source links, preserving an explicit preview/database boundary and no fabricated shared activity on backend failure.
5. Validate two-user follows, ordering ties, retries/out-of-order work, hide/revoke/sign-out privacy, source independence and mobile/desktop keyboard flows.

## Acceptance criteria

- [ ] AC1: Community and Following implement same-dataset author/visibility scope and stable newest-first pagination, including empty feeds and timestamp ties; A17.
- [ ] AC2: Only explicitly shared verified source facts publish, exactly once across retry/out-of-order delivery; draft/pending/failed/unaccepted states do not publish; A18.
- [ ] AC3: Anonymous, cross-dataset, revoked, hidden and restricted feed/profile/source access fails without leaking activity, receipts or wallet data; sign-out clears personalized state; A19.
- [ ] AC4: A user follows another member, sees a genuine shared access/attendance item and opens the public source to make an independently authorized booking/purchase. No link grants access.
- [ ] AC5: No reaction schema/API/control/count or challenge activity exists. Database-mode errors remain honest, and relevant database/domain/browser/lint/type/build checks pass.

## Validation plan

Run migrated PostgreSQL constraints/authorization/idempotency tests with two authenticated users, an anonymous context and another dataset. Cover follow/unfollow, pagination ties, publication retry/lost response, delayed visibility changes, hide/remove/sign-out and source correction. Exercise keyboard controls and error/empty states at mobile/desktop widths. Run applicable database checks plus `npm test`, `npm run lint`, `npm run typecheck`, `npm run build` and affected `npm run test:e2e` cases. No Devnet transfer is required for the feed itself; verified source owners retain their own financial evidence.

## Implementation record

Not started. The 24 September 2026 planning revision removed the former Cheer table/services/UI, challenge-source dependency and reaction concurrency acceptance. No runtime/schema change was made by that revision.

### Changes and rationale

Pending implementation.

### Affected files

Planned: capability-owned activity migration/schema/repository/services, existing Feed/profile presentation and focused database/browser tests. Record actual paths during implementation.

### Decisions and deviations

- 2026-09-24: User removed reactions and challenge mode. The ticket was narrowed before implementation; its ID and planning history remain, while its filename/title now reflect the current deliverable.

### Contracts, configuration, and operations

Planned activity projection/feed query contracts only. No reaction record, provider or environment variable is planned.

## Validation results

Not run — no implementation. Planning/link checks do not satisfy AC1–AC5.

## Risks, limitations, and follow-ups

This ticket cannot invent source truth. It stays Draft until at least one real access/attendance source and DEV0017's profile/follow boundary exist. Completing it does not implement memberships, payments, reservations or sponsored events.

## Completion and review references

- Completed: Not completed.
- Commit: Not created.
- Review: Planning self-review only; no independent review.
- Deployment or release: None.
