# Coordination COR0006: Persistent access catalogue

- Status: In progress
- Created: 2026-09-24
- Last updated: 2026-09-24
- Milestone: M1 persistent access catalogue
- Converted from: Retired `DEV0017`
- Tracked development tickets: completed [DEV0067 — Add membership catalogue schema](../../archive/backend/DEV0067-membership-catalogue-schema.md); additional direct tickets identified below have not yet been created
- Related records: planned by [DEV0014](../../archive/backend/DEV0014-database-and-backend-plan.md); depends on completed database, identity and protected-context work plus [DEV0058](../../archive/organisatory/DEV0058-fitness-access-mvp-contract.md) and [DEV0066](../../archive/organisatory/DEV0066-freeze-membership-product-rules.md); precedes [DEV0018](../backend/DEV0018-class-pass-reservations-and-confirmed-visits.md) and [DEV0023](../backend/DEV0023-minimal-shared-activity-feed.md)

## Objective and boundaries

Coordinate the first shared persistent catalogue for the access-focused MVP. The original DEV0017 draft combined database schemas, repositories, public browsing, multiple draft editors, follows, bookmarks and failure-state interface work. Pre-implementation review found that those are multiple independently reviewable deliverables, so DEV0017 is retired and this coordination record preserves its product and security boundaries.

The coordinated outcome lets guests browse safe published fitness-business offers while authenticated, authorized actors manage private drafts. Catalogue offers never imply a purchased membership, pass, ticket, reservation, sponsor funding or attendance. This record does not authorize or implement runtime behavior; each row below belongs to a direct development ticket.

The converted plan's behavior remains part of the coordination boundary: guests and signed-in users must see the same server-selected public catalogue; client-supplied dataset IDs cannot expose private or retired records; personal and organization drafts must survive browser/server restarts while remaining inaccessible to other users; organization attribution comes only from verified roles; retries are idempotent and version conflicts do not overwrite newer data. Follows remain unique, one-way, same-dataset and reject self-follow, while bookmarks are private overlays rather than access or popularity evidence. Sponsored-event presentation cannot imply verified funding. A backend outage must report failure and preserve unsaved input instead of silently falling back to fixtures or claiming a save.

## Direct development work

| Implementation part | Development ticket | Owned deliverable | Start condition or dependency |
| --- | --- | --- | --- |
| Membership product storage | Completed [DEV0067 — Add membership catalogue schema](../../archive/backend/DEV0067-membership-catalogue-schema.md) | Product identities, frozen product versions, two price-pending draft fixtures, Drizzle mappings and database tests; no entitlements or UI | Delivered from DEV0066 and the existing database foundation |
| Membership catalogue services and screens | Required peer ticket not yet created | Safe public projections, authorized draft mutations, Explore/detail integration and honest loading/error states | After DEV0067; exact demonstration prices must be selected before publication |
| Pass, class and event catalogue/drafts | Required peer ticket not yet created | Persistent pass/class/event offers and ordinary/sponsored-event presentation without funding claims | After remaining P01/P07/P12 decisions relevant to publication are frozen |
| Follows and bookmarks | Required peer ticket not yet created | Unique one-way follows and private bookmark overlays using verified account/dataset context | May proceed independently after its ticket freezes visibility and mutation contracts |

DEV0018 and DEV0023 are downstream consumers, not direct members of this coordination record. Their implementation remains separately owned.

## Other relationships

- DEV0066 is the completed membership product-rule dependency; it does not own persistence.
- DEV0018 consumes future verified access sources for reservation/redemption behavior and does not own catalogue products.
- DEV0023 consumes future follow and verified-activity sources and does not own catalogue or entitlement truth.
- Membership purchase, program state, server projection, transfer, fee settlement and redemption require separate membership tickets outside the catalogue boundary.

## Delivery sequence and completion conditions

DEV0067 established the membership product/version schema first. The membership service/interface peer follows after fixture prices are selected. Pass/event persistence waits for its unresolved publication and funding rules, while follows/bookmarks may be developed independently against the existing verified actor boundary.

Complete COR0006 only after every mapped part has a direct DEV ticket that is Completed or explicitly Cancelled/replaced, guests and authenticated users observe the same safe published catalogue, private drafts remain isolated and durable, and integration checks prove that no catalogue row fabricates financial or access state.

Final integration validation must include anonymous/private-ID probes, two independent authenticated accounts, cross-dataset denial, organization-role derivation, restart/reload durability, conflict/retry behavior, backend failure, public filters/details, sign-out/cache isolation, and mobile/desktop keyboard/error-state coverage. Direct tickets own the detailed commands and evidence for their slice.

## Progress and integration record

- 2026-09-24: Converted the unimplemented DEV0017 draft after review showed that its schema, services, UI and social-overlay scope required separate implementation records.
- 2026-09-24: Completed DEV0067 as the first bounded database slice. Exact membership purchase prices remain deliberately unresolved, so its deterministic membership fixtures remain private drafts with no runtime visibility.

## Validation results

Work-map and link consistency will be checked whenever a direct ticket is added or completed. Direct implementation validation belongs to the corresponding DEV record.

## Risks, limitations, and follow-ups

The public membership catalogue cannot be populated honestly until exact demonstration purchase prices are selected. The initial schema must not become an entitlement ledger, and later service/UI tickets must not expose private drafts or silently fall back to browser fixtures during backend failure.

## Completion and review references

- Completed: Not completed.
- Direct development tickets: DEV0067 Completed; three required peer tickets not yet created.
- Commit: Not applicable — coordination-record IDs are not used in commit subjects.
- Review: Pre-implementation split reviewed against the repository ticket policy.
- Deployment or release: None.
