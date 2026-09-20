# Ticket DEV0023: Shared social feed and Cheers

- Status: Draft
- Created: 2026-09-20
- Last updated: 2026-09-20
- Milestone: M4 social interaction slice
- Coordination: None — independent development ticket
- Related tickets: Planning [DEV0022](../../archive/backend/DEV0022-social-contract-and-delivery-plan.md); depends on [DEV0016](DEV0016-phantom-auth-and-demo-access.md), [DEV0017](DEV0017-persistent-catalogue-and-drafts.md), [DEV0018](DEV0018-membership-booking-and-visits.md); challenge sources follow in [DEV0024](../blockchain/DEV0024-verified-challenge-activity.md)

## Objective and context

Replace the fixture-based For you/Following feed with shared chronological activity and a working Cheer interaction. Deliver the accepted loop in [section 9](../../../docs/mvp-spec.md#9-social-behavior-and-permissions), C19, using the [social data design](../../../docs/mvp-spec.md#social-data-design). A second authenticated user can follow a member, see their shared class booking, Cheer it and open the class to book independently.

## Scope and non-goals

- In scope: capability-owned feed/reaction repositories and services, Community/Following feed queries, visible activity on profiles, pagination/empty/error states, persisted Cheer/remove, aggregate/viewer reaction state, class-detail copy links, privacy and two-user integration.
- Out of scope: comments, messages, notifications, free-form posts, friend requests, multiple reaction types, ranking, new attendance/financial state and challenge source publication. Reuse DEV0017 follows and DEV0018 class events; DEV0024 owns verified challenge sources.

## Expected behavior and edge cases

Implement section 9's feed membership, ordering, source visibility and reaction rules. Following contains followed authors only; the owner's posts remain in Community/profile. No accessible followed activity gives a useful empty state. Profile/feed pagination cannot reveal hidden or cross-run rows. A cancellation changes its existing item without promoting it or clearing other people's valid reactions.

Cheer/remove changes only the signed-in actor's reaction. Rapid taps, retried requests and two concurrent people cannot duplicate a reaction or lose another person's Cheer. A failed response shows uncertainty/error and revalidates rather than displaying unconfirmed success. Hidden/deleted/restricted parent items deny reaction reads/writes, including counts; losing access and signing out clear personal cached content. Shared class/event/challenge catalogue links stay public where permitted and never grant a booking or challenge entry.

## Assumptions, decisions, and dependencies

The user authorized documenting this work, not implementing it in DEV0022. The dependencies must deliver real identity, profiles/follows and source class activity first. This ticket owns the feed/profile projection and reaction repositories/services that it introduces; it does not extend a generic foundation repository. The current prototype has no secure multi-user backend; do not treat browser storage as shared evidence. Chronological ordering, cursor tie-breaking, no self-follow, desired-state mutations and count-plus-viewer reaction responses are adopted implementation details in section 9/social data design, not separately elicited product decisions. No Supabase Realtime or new payment signature is needed for this slice.

## Implementation plan

1. Inspect delivered schema/auth helpers. Add `activity_reactions` through the single migration history, typed mappings, same-run foreign keys, uniqueness, indexes and parent-aware row-level security. Reuse existing visibility/source fields.
2. Implement authenticated feed/profile projections and cursor queries with newest-first stable ordering, Community/Following filters and current parent/source authorization. Return only safe activity fields, Cheer count and the viewer's reaction state.
3. Implement desired-state Cheer/remove services using verified actor/run context. Exercise unique conflicts, retries, concurrent reactions and hide/delete races with real transactions; never trust client counters.
4. Integrate existing Feed/profile controls, rename For you to Community, and add accessible Cheer pending/error/toggle states. Keep fixture preview explicitly separate from database mode; never silently fall back on fabricated shared activity.
5. Reuse the copy-link component on public class detail, preserve event/challenge copy controls and manual fallback, and connect cards to the existing independently authorized participation flows.
6. Validate cross-browser persistence, guest/sign-out and private-ID cases, mobile/desktop keyboard use and relevant regressions. Record migration/setup changes only when they exist.

## Acceptance criteria

- [ ] AC1: Community and Following implement the specified author scope and stable chronological pagination, including empty feeds, equal timestamps and unchanged ordering after reaction/cancellation; A58.
- [ ] AC2: Two real authenticated users can Cheer/remove and reload across browsers; SQL uniqueness, retries and concurrent actions preserve correct counts/viewer state; A59.
- [ ] AC3: Anonymous/cross-run/revoked/hidden/restricted feed/profile/reaction access and mutations fail without exposing counts or identity data. Hide/delete races and sign-out caches respect parent visibility; A60.
- [ ] AC4: A user follows another member, sees a genuine shared reservation, Cheers and opens that class to make their own booking. Public copy links/manual fallback work; no link or reaction grants entry, votes, payments or visits; A61.
- [ ] AC5: Database-mode errors remain honest; keyboard/mobile/desktop success, pending and failure flows pass, plus relevant domain/browser tests, lint, types and build. No new source is presented as real challenge activity before DEV0024.

## Validation plan

Run actual migrated PostgreSQL constraints/authorization/concurrency tests, including alternating pooled actor/run contexts and hidden-parent queries. Use at least two authenticated browser contexts, an anonymous context and another run. Cover follow/unfollow, pagination ties, Cheer retry/lost response, simultaneous users, hide/remove/sign-out and preserved public discovery. Exercise keyboard controls and visible failure states at mobile/desktop widths. Run the implemented database checks plus `npm test`, `npm run lint`, `npm run typecheck`, `npm run build` and affected `npm run test:e2e` cases. No real devnet transfer is required for this off-chain slice.

## Implementation record

### Changes and rationale

Not started. This is a future delivery ticket; DEV0022 records the planning change only.

### Affected files

Planned: `supabase/migrations/` and server schema/services (not created yet), existing Feed/profile/class-detail components and social integration tests. Record actual paths and responsibilities when implemented.

### Decisions and deviations

No implementation deviations yet. Reuse upstream follow/source models instead of duplicating them in a second social store.

### Contracts, configuration, and operations

Planned reaction table, protected feed/reaction services and cursor contract; none applied. No new service provider or notification infrastructure planned. Document the actual migration/rollback compatibility and setup changes during implementation.

Planning refinement, 2026-09-20: this ticket owns feed/profile-projection and reaction repositories/services for its capability. DEV0015 owns only database foundation modules and DEV0025 owns import/layer enforcement; neither supplies a generic social repository.

## Validation results

Not run — no implementation. Planning link checks do not satisfy AC1–AC5.

## Risks, limitations, and follow-ups

Requires DEV0015–DEV0018 delivery. Completing this slice does not complete M4 challenge activity; [DEV0024](../blockchain/DEV0024-verified-challenge-activity.md) remains required. Existing local choices are not automatically imported as authenticated data.

## Completion and review references

- Completed: Not completed.
- Commit: Not created.
- Review: Planning self-review only; no implementation or independent review.
- Deployment or release: None.
