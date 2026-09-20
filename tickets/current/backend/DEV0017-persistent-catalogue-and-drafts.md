# Ticket DEV0017: Persistent catalogue and private drafts

- Status: Draft
- Created: 2026-09-19
- Last updated: 2026-09-20
- Milestone: M0 shared app data
- Coordination: None — independent development ticket
- Related tickets: [DEV0014 — Plan](../../archive/backend/DEV0014-database-and-backend-plan.md); depends on [DEV0015](DEV0015-supabase-database-foundation.md), [DEV0016](DEV0016-phantom-auth-and-demo-access.md); precedes [DEV0018](DEV0018-membership-booking-and-visits.md)

## Objective and context

Deliver the first useful shared-backend checkpoint: guests browse the public Explore/Challenges catalogue and details; two authenticated users see that same catalogue and manage their own persistent event/challenge drafts, follows and bookmarks across browsers. Use the [screen contract](../../../docs/mvp-spec.md#2-screens-and-actions), [public access contract](../../../docs/mvp-spec.md#public-browsing-and-sign-in-boundaries), [database phases](../../../docs/mvp-spec.md#database-delivery-phases) and [social permissions](../../../docs/mvp-spec.md#9-social-behavior-and-permissions). Keep the existing visual design.

## Scope and non-goals

- In scope: DB-backed public catalogue/list/detail reads, authorized profile reads, owner-scoped challenge/event drafts, follows/bookmarks, server validation and authorization, frontend loading/error states and an explicit boundary between fixture preview and database mode.
- Out of scope: reservations, shared booking/feed events, Cheers/reactions, tickets, real balances, challenge publication/funding, voting, uploads, notifications, Realtime, paid organization onboarding or importing the entire browser store.

## Expected behavior and edge cases

Dates, activities and studio/event details retain current Explore behavior. Saving/reloading/deleting a draft works on another browser signed in as the same user, but the other actor cannot list, inspect or mutate it. An organization-hosted draft requires that actor's permitted organization membership; a text host name grants nothing. Follows are one-way without approval/reciprocity, require an accessible same-run profile, reject self-follow and are unique per directed pair. Explicit followed/unfollowed writes are idempotent; retried requests cannot toggle twice. Profile reads are signed-in and omit private wallet, receipt and granular attendance data. Duplicate saves remain idempotent. Version conflicts or lost save responses must not silently overwrite a newer draft or duplicate it.

Guests need no session, wallet or enrollment to browse/filter Explore Classes/Events/Studios, public community/sponsored challenges and public details. Use a server-selected active public catalogue and explicitly safe fields; client-supplied IDs cannot expose private/retired runs, drafts, restricted challenges, invitation rosters, membership eligibility, receipts or personal claims. Public challenge visibility does not grant entry rights. Keep private overlays separate from anonymous responses/caches; public read privileges never grant writes or inherit a previous pooled user's context.

SQL rows distinguish local/seeded examples and off-chain drafts from future verified funding/entry state. A database outage reports an error and preserves unsaved text; it cannot report a successful save or silently show local fixtures as shared data. No local sample balances, visits, bookings or challenge pools are imported as authoritative facts. Existing frontend-only data remains accessible in explicitly separate preview mode.

## Assumptions, decisions, and dependencies

Private reads and mutations require verified session/run context from DEV0016; public discovery uses its own restricted server read path under C17. Use server-side service/repository methods and existing components rather than client Data API writes. Catalogue prices become exact base-unit strings at the server boundary while UI formatting stays familiar. Draft past dates are allowed for planning; real publication will validate future time and resolved policy separately. Seeding examples must never populate funded/payment states. Do not build a draft-import feature unless separately requested.

## Implementation plan

1. Add metadata/draft, follow and bookmark migrations with ownership/run/visibility constraints, unique directed follow pairs and no-self-follow checks, versioning/idempotent save semantics and feature-specific RLS.
2. Add public catalogue/list/detail services with restricted read-only SQL access and safe row/field projections; keep the Data API disabled. Separately add authenticated profile/draft/follow/bookmark services. Validate input, derive the public catalogue scope on the server and derive actor/run for private operations from verified context; return only fields appropriate to that viewer.
3. Adapt Explore, profile, challenge/event creation/detail and save/follow controls to server-backed data, retaining preview adapters and visible fixture labels. Hide/disable unimplemented financial controls instead of deriving their state from sample rows.
4. Handle save/delete conflicts, loading and backend failures without losing text or mixing users' caches. Confirm ordinary profile displays never include private wallet/receipt fields.
5. Verify persistence from two authenticated browsers and ownership denial with direct API attempts. Add an anonymous context for direct public routes, expired sessions, detail/private-ID/run probes and sign-out/cache leakage; preserve class/event filter boundaries, keyboard flows and current routes.

## Acceptance criteria

- [ ] AC1: Anonymous and authenticated catalogue reads preserve Classes/Events/Studios and public community/sponsored challenge browsing, filters, dates, prices and public details. No wallet/enrollment/login is required for public routes, including direct visits/reloads with an expired session; seeded examples remain visibly examples.
- [ ] AC2: An actor's challenge/event draft survives another browser and server restart; create retry, edit conflict and delete are handled without duplicate rows or silent overwrites.
- [ ] AC3: Another user/run cannot read/change private drafts; organization attribution requires authorization; directed follow/bookmark uniqueness and visibility are enforced. Self-follow, cross-run/inaccessible targets and anonymous personal profile reads fail; repeated follow/unfollow has no inverse or approval side effect.
- [ ] AC4: No local balance/visit/booking/payment state becomes authoritative; missing config/backend outage never triggers silent fixture fallback or fabricated save success.
- [ ] AC5: Two-user integration/browser, desktop/mobile/keyboard/error, lint/type/build checks pass; no funded challenge, booked seat or usable paid ticket is claimed by this slice.
- [ ] AC6: Guest list/detail/API responses and caches exclude private drafts/restricted challenge data, invitations, membership eligibility, receipts and personal claims. Private/run-ID probes and guest mutations fail; sign-out cannot expose stale personalized state. Public visibility does not grant participation permission.

## Validation plan

Run real database migration/ownership/idempotency/version tests and two independent authenticated contexts. Exercise direct unauthorized requests, same-run and cross-run records, reload/server restart, concurrent saves, deletion and network failure while editing. Run affected existing browser/domain checks plus lint/types/build. Source/cache review must show use of the shared authorization helper rather than trusting browser persona data. No live financial test applies to this nonfinancial slice.

For A54–A55, use a third, anonymous context with no wallet/session and one expired session. Test list/detail/filter requests, protected controls, private/run-ID probes, explicit public-field responses, read-only SQL grants and alternating guest/user pooled requests. Revisit public pages after sign-out and verify no private overlays/cached responses survive. Public catalogue reads must use the scoped guest service; private services must use the authenticated helper.

## Risks, limitations, and follow-ups

Browser-only drafts are not automatically moved to server accounts. Hosted data persists beyond a local Profile reset; define reset as preview-only and use scoped run tooling for shared data. Shared feed bookings and attendance begin in DEV0018; chronological feed/profile activity and Cheers follow in [DEV0023](DEV0023-shared-social-feed-and-cheers.md), verified challenge sources in [DEV0024](../blockchain/DEV0024-verified-challenge-activity.md). Financial receipts remain later milestones.

## Implementation record

Planning update, 2026-09-20 ([DEV0022](../../archive/backend/DEV0022-social-contract-and-delivery-plan.md)): clarify C19 directed/idempotent follows and signed-in profile visibility. Reactions and full feed queries stay in DEV0023; no follower-request state, chat or notification schema is added here. No backend was implemented by this update.

Planning update, 2026-09-19 ([DEV0020](../../archive/frontend/DEV0020-discovery-and-how-it-works.md)): preserve public global search/grouping, challenge filters/order and rules, guide links, copy-link fallback and related catalogue destinations when replacing fixtures. Search must use the safe public projection and exclude private drafts. Keep the entry panel in an honest preview/draft state until M2 verified funding/registration/decision/claim state supplies the real next action and deadline; never derive these states from fixture dates.

Planning update, 2026-09-19 ([DEV0019](../../archive/frontend/DEV0019-public-discovery-access.md)): replaced the authenticated-only catalogue plan with C17 guest discovery, separate private overlays and explicit anonymous privacy/route tests. The same first checkpoint now covers visitors and authenticated users.

Not started. This ticket defines future work only; no code, dependencies, database objects or service configuration have been created. Update this section with affected files, decisions/deviations, contracts and actual evidence during implementation.

## Validation results

Not run — implementation has not started. Planning/link checks do not satisfy the acceptance criteria above. Record exact implemented commands, environment, failures and passed results before completion.

## Completion and review references

- Completed: Not completed.
- Commit: Not created.
- Review: Planning self-review only; no independent implementation review.
- Deployment: None.
