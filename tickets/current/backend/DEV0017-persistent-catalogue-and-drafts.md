# Ticket DEV0017: Persistent access catalogue and private drafts

- Status: Draft
- Created: 2026-09-19
- Last updated: 2026-09-24
- Milestone: M1 persistent access catalogue
- Coordination: None — independent development ticket
- Related records: planned by [DEV0014](../../archive/backend/DEV0014-database-and-backend-plan.md); depends on completed database/identity/protected-context work and [DEV0058 — Adopt the fitness-access MVP contract](../../archive/organisatory/DEV0058-fitness-access-mvp-contract.md); follows completed [DEV0052](../../archive/frontend/DEV0052-account-backed-personal-profile.md); precedes [DEV0018](DEV0018-class-pass-reservations-and-confirmed-visits.md) and [DEV0023](DEV0023-minimal-shared-activity-feed.md)

## Objective and context

Deliver the first shared product-data checkpoint for the access-focused MVP. Guests browse public fitness businesses, membership/pass products, classes and ordinary/sponsored events; two authenticated users see the same catalogue and manage their own event/product drafts, follows and bookmarks across browsers. Use the [screen contract](../../../docs/mvp-spec.md#2-screens-and-actions), [public boundary](../../../docs/mvp-spec.md#public-browsing-and-sign-in-boundaries) and [database phases](../../../docs/mvp-spec.md#database-delivery-phases).

The ticket previously planned challenge catalogue and drafts. DEV0058 removed product challenges before implementation, so this revision preserves the ID and useful persistence/authorization boundary while replacing that scope with access products and events.

## Scope and non-goals

- In scope: database-backed public business/product/class/event list/detail reads; authorized profile reads; owner- or organization-scoped membership/pass/event drafts; sponsorship presentation fields that do not claim funding; follows/bookmarks; capability-owned repositories/services; validation, authorization, loading/error states and explicit fixture-versus-database mode.
- Existing identity boundary: the current account-backed profile and server-derived actor remain authoritative. Organization attribution requires a verified role; text labels grant nothing.
- Out of scope: on-chain membership state, published transferable entitlement, reservations, payments, sponsorship funding, redemption, shared activity delivery, challenge data, reactions, live inventory, uploads, notifications, Realtime or automatic import of browser preview data.

## Expected behavior and edge cases

Guests browse/filter supported public businesses, membership/pass products, classes and events without a session or wallet. Public responses use a server-selected active catalogue and safe-field allowlist; client IDs cannot expose private/retired datasets, drafts, access records, receipts, sponsorship obligations or personal claims.

An authenticated actor's draft survives another browser and server restart. Another user cannot list, inspect or mutate it. Organization-owned drafts require a server-derived role. Save retries are idempotent; version conflicts/lost responses do not silently overwrite newer data or duplicate records. Follows are one-way, unique, idempotent, same-dataset and reject self-follow. Bookmarks are private overlays, not public popularity or access evidence.

Membership/pass/event product rows are catalogue offers, not paid entitlements. Sponsored-event presentation distinguishes a proposed/frozen sponsor label and attendee benefit from verified funding. A database outage reports an error and preserves unsaved text; it cannot silently display fixtures as shared data or claim a successful save.

## Assumptions, decisions, and dependencies

Use the verified actor/run context for private work and a separate restricted public service for discovery. Keep browser Supabase access limited to Auth; business writes use Next.js services. Prices cross server boundaries as exact base-unit strings. Draft past dates may be allowed for planning; publication validates future time and resolved policy separately.

The membership product schema may store display/frozen intended terms but cannot create the on-chain entitlement contract before P09–P11 and the future membership tickets are reviewed. Sponsored-event drafts cannot accept funding before P12 is resolved.

## Implementation plan

1. Freeze safe public and private draft contracts for businesses, membership/pass products, classes and ordinary/sponsored events.
2. Add bounded migrations with same-dataset ownership/organization constraints, versioning, directed follows/bookmarks and feature-specific row-level security.
3. Implement public catalogue services plus authenticated profile/draft/follow/bookmark repositories using the existing server authorization boundary.
4. Adapt Explore, product/event detail/draft and profile/follow/bookmark controls to server data while retaining explicitly separate preview fixtures and honest nonfinancial states.
5. Validate two-user persistence/ownership, guest public access, private-ID probes, pooling/cache isolation, retries/conflicts, backend failure, mobile/desktop keyboard use and existing auth/public-route regressions.

## Acceptance criteria

- [ ] AC1: Guests and authenticated users browse the same safe public businesses, membership/pass products, classes and events without a wallet/login; seeded examples stay labelled examples.
- [ ] AC2: Owner and authorized organization drafts persist across browser/server restart with idempotent create, conflict-safe edit and deterministic delete; no record claims published/funded access.
- [ ] AC3: Another user/dataset cannot access private drafts; organization attribution is role-derived; follow/bookmark uniqueness, self-follow denial and idempotent desired-state behavior hold.
- [ ] AC4: Catalogue/draft/sponsor presentation cannot fabricate entitlement, payment, transfer, reservation or sponsor funding; backend outage never falls back silently to fixtures.
- [ ] AC5: Anonymous/private-ID/cache probes, two-user database/browser checks, desktop/mobile/keyboard/error flows, lint, typecheck and build pass.
- [ ] AC6: No product challenge catalogue, draft, save or field is introduced. Wallet-authentication challenge records remain outside this product-data ticket.

## Validation plan

Run migrated database constraint/RLS/repository tests and two independent authenticated contexts plus an anonymous and cross-dataset context. Exercise direct unauthorized requests, reload/restart, concurrent saves, delete, network failure, public filters/details and sign-out/cache leakage. Run affected domain/browser checks plus lint, typecheck and build. No live financial or Devnet test applies because this slice publishes no entitlement/payment.

## Implementation record

Not started. Planning revisions on 19–20 September established public access, repository ownership and social boundaries. On 24 September DEV0058 removed challenge catalogue/drafts and replaced them with membership/pass products and sponsored-event presentation before any implementation existed.

### Changes and rationale

Pending implementation.

### Affected files

Planned: new product/event migrations and server repositories/services plus existing Explore/profile/draft/follow/bookmark surfaces and tests. Record actual paths during implementation.

### Decisions and deviations

- 2026-09-24: Materially revised before implementation for the confirmed access pivot. No challenge persistence or compatibility API is required because no shared challenge records exist.

### Contracts, configuration, and operations

Planned public/private catalogue and draft contracts only. No applied migration, provider, secret or environment change.

## Validation results

Not run — implementation has not started. Documentation/link checks do not satisfy AC1–AC6.

## Risks, limitations, and follow-ups

Browser-only legacy challenge/event data is not automatically imported. DEV0060 owns safe preview-store challenge cleanup; this backend ticket must not accept legacy client records as authority. Membership/program and sponsored-funding implementation require separate future tickets.

## Completion and review references

- Completed: Not completed.
- Commit: Not created.
- Review: Planning self-review only; no independent review.
- Deployment or release: None.
