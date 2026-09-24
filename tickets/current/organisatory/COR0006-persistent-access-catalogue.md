# Coordination COR0006: Persistent access catalogue

- Status: In progress
- Created: 2026-09-24
- Last updated: 2026-09-25
- Milestone: M1 persistent access catalogue
- Converted from: Retired `DEV0017`
- Tracked development tickets: completed [DEV0067 — Add membership catalogue schema](../../archive/backend/DEV0067-membership-catalogue-schema.md); additional direct tickets identified below have not yet been created
- Related records: planned by [DEV0014](../../archive/backend/DEV0014-database-and-backend-plan.md); depends on completed database, identity and protected-context work plus [DEV0058](../../archive/organisatory/DEV0058-fitness-access-mvp-contract.md), historical [DEV0066](../../archive/organisatory/DEV0066-freeze-membership-product-rules.md), and completed contract revision [DEV0068](../../archive/organisatory/DEV0068-revise-subscription-and-pass-resale-contract.md); precedes [DEV0018](../backend/DEV0018-class-pass-reservations-and-confirmed-visits.md) and [DEV0023](../backend/DEV0023-minimal-shared-activity-feed.md)

## Objective and boundaries

Coordinate the first shared persistent catalogue for the access-focused MVP. The original DEV0017 draft combined database schemas, repositories, public browsing, multiple draft editors, follows, bookmarks and failure-state interface work. Pre-implementation review found that those are multiple independently reviewable deliverables, so DEV0017 is retired and this coordination record preserves its product and security boundaries.

The coordinated outcome lets guests browse safe published fitness-business offers while authenticated, authorized actors manage private drafts. Catalogue offers never imply a purchased membership, pass, ticket, reservation, sponsor funding or attendance. This record does not authorize or implement runtime behavior; each row below belongs to a direct development ticket.

The converted plan's behavior remains part of the coordination boundary: guests and signed-in users must see the same server-selected public catalogue; client-supplied dataset IDs cannot expose private or retired records; personal and organization drafts must survive browser/server restarts while remaining inaccessible to other users; organization attribution comes only from verified roles; retries are idempotent and version conflicts do not overwrite newer data. Follows remain unique, one-way, same-dataset and reject self-follow, while bookmarks are private overlays rather than access or popularity evidence. Sponsored-event presentation cannot imply verified funding. A backend outage must report failure and preserve unsaved input instead of silently falling back to fixtures or claiming a save.

## Direct development work

| Implementation part | Development ticket | Owned deliverable | Start condition or dependency |
| --- | --- | --- | --- |
| Initial membership product storage | Completed [DEV0067 — Add membership catalogue schema](../../archive/backend/DEV0067-membership-catalogue-schema.md) | Historical prepaid product/version foundation, two price-pending private drafts, Drizzle mappings and database tests; no entitlements or UI | Delivered from the then-current DEV0066 contract and the existing database foundation |
| Membership billing-model schema revision | Required peer ticket not yet created | Additive catalogue fields/constraints and revised drafts for Annual Unlimited installments versus Flex 12 prepayment without rewriting DEV0067 history | After DEV0068; before membership publication or service/UI work |
| Membership catalogue services and screens | Required peer ticket not yet created | Safe public projections, authorized draft mutations, comparable amount/schedule display, Explore/detail integration and honest loading/error states | After the billing-model schema revision; exact demonstration prices must be selected before publication |
| Pass, class and event catalogue/drafts | Required peer ticket not yet created | Persistent pass/class/event offers, multi-entry/resale terms and ordinary/sponsored-event presentation without fabricated settlement/funding claims | After DEV0068 and remaining P01/P07/P12 decisions relevant to publication are frozen |
| Follows and bookmarks | Required peer ticket not yet created | Unique one-way follows and private bookmark overlays using verified account/dataset context | May proceed independently after its ticket freezes visibility and mutation contracts |

DEV0018 and DEV0023 are downstream consumers, not direct members of this coordination record. Their implementation remains separately owned.

## Other relationships

- DEV0066 preserves the former prepaid product-rule decision; DEV0068 is the current subscription/pass-resale contract and neither ticket owns persistence.
- DEV0018 consumes future verified pass access sources for reservation/redemption behavior and must serialize with resale, but does not own catalogue products or resale settlement.
- DEV0023 consumes future follow and verified-activity sources and does not own catalogue or entitlement truth.
- Membership installments, program state, server projection, transfer/assignment, fee settlement and redemption require separate membership tickets outside the catalogue boundary. Pass ownership/resale settlement likewise requires a separate access/payment ticket.

## Delivery sequence and completion conditions

DEV0067 established the first membership product/version schema, but DEV0068 supersedes its prepaid-only product assumption. The additive billing-model revision must therefore precede membership price selection, publication and service/interface work. Pass/event persistence waits for P01/P07/P12 and must include DEV0068's pass-resale catalogue terms, while follows/bookmarks may proceed independently against the existing verified actor boundary.

Complete COR0006 only after every mapped part has a direct DEV ticket that is Completed or explicitly Cancelled/replaced, guests and authenticated users observe the same safe published catalogue, private drafts remain isolated and durable, and integration checks prove that no catalogue row fabricates financial or access state.

Final integration validation must include anonymous/private-ID probes, two independent authenticated accounts, cross-dataset denial, organization-role derivation, restart/reload durability, conflict/retry behavior, backend failure, public filters/details, sign-out/cache isolation, and mobile/desktop keyboard/error-state coverage. Direct tickets own the detailed commands and evidence for their slice.

## Progress and integration record

- 2026-09-24: Converted the unimplemented DEV0017 draft after review showed that its schema, services, UI and social-overlay scope required separate implementation records.
- 2026-09-24: Completed DEV0067 as the first bounded database slice. Exact membership purchase prices remain deliberately unresolved, so its deterministic membership fixtures remain private drafts with no runtime visibility.
- 2026-09-25: DEV0068 changed Annual Unlimited to monthly fixed-term installments and added bounded pass resale. DEV0067 remains valid historical implementation evidence, but its private drafts are blocked from publication until an additive schema peer models the revised billing contract.

## Validation results

Work-map and link consistency will be checked whenever a direct ticket is added or completed. Direct implementation validation belongs to the corresponding DEV record.

## Risks, limitations, and follow-ups

The public membership catalogue cannot be populated honestly until the billing-model schema revision lands and exact demonstration prices are selected. The initial schema must not become an entitlement ledger, and later service/UI tickets must not expose private drafts or silently fall back to browser fixtures during backend failure. Pass publication also waits for post-resale P01 refund allocation.

## Completion and review references

- Completed: Not completed.
- Direct development tickets: DEV0067 Completed; four required peer tickets not yet created.
- Commit: Not applicable — coordination-record IDs are not used in commit subjects.
- Review: Pre-implementation split reviewed against the repository ticket policy.
- Deployment or release: None.
