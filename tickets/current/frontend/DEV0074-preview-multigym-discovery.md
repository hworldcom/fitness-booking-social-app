# Ticket DEV0074: Preview multi-gym discovery

- Status: Ready
- Created: 2026-09-25
- Last updated: 2026-09-26
- Milestone: M1 frontend membership discovery preview
- Coordination: [COR0007 — Core multi-gym membership MVP](../organisatory/COR0007-core-multigym-membership-mvp.md)
- Related records: depends on completed [DEV0072](../../archive/frontend/DEV0072-remove-legacy-product-ui.md); complements completed public story [DEV0073](../../archive/frontend/DEV0073-rewrite-multigym-public-story.md); supplies discovery contracts to [DEV0075](DEV0075-preview-membership-selection.md); future persistence is coordinated by [COR0006](../organisatory/COR0006-persistent-access-catalogue.md)

## Objective and context

Replace the interim gym-only Explore state with a clear frontend preview of the participating multi-gym network and the two membership plans. Use typed fictional fixtures and an explicit preview adapter so the interface can be reviewed before the persistent catalogue schema is redesigned.

This ticket owns discovery presentation and frontend read contracts, not catalogue authority. Future COR0006 services will replace the preview adapter without redesigning the screen or treating fixtures as live data.

## Scope and non-goals

- In scope: versioned frontend plan-summary contract; gym-summary/detail contract; Basic €80/ten and Classic €150/unlimited cards; five clearly fictional participating gym fixtures; plan/gym eligibility labels; gym list/detail presentation; useful location/activity filtering; loading/empty/error-ready component states; explicit preview labeling; responsive/keyboard behavior; focused tests.
- Out of scope: selecting the four core gyms, activating or owning a membership, class/pass/event inventory, real availability, payment, database/API calls, authorized catalogue editing, real gym names/logos/addresses/prices, check-ins, allocation and deployment.

## Expected behavior and edge cases

Guests can compare both plans and browse at least five fictional gyms. Every gym identifies supported activities, a fictional area, whether it participates in Basic/Classic and whether the illustrative non-core member price is supported. Plan copy consistently explains the daily rule and never represents Classic with a fabricated large allowance.

Filters operate deterministically on the injected preview data. Empty results are recoverable. Missing or malformed preview data produces an honest error/empty state rather than silently inventing a venue. No control says Buy, Join, Activate or Own; the next action leads to the explicitly preview-only membership setup delivered by DEV0075 or to Coming Soon until that ticket lands.

## Assumptions, decisions, and dependencies

- All gym identities and content are fictional; do not reuse the actual gyms previously researched or the current `Kru Tiger` name.
- Preview fixtures live behind a typed adapter and are not authorization, inventory, payment or partnership evidence.
- Completed DEV0072 removed the class/event Explore implementation, and completed DEV0073 established the public terminology and current €15 non-core member price.
- COR0006 will later own additive persistent gym/plan data and safe public services; integration needs a separate direct DEV ticket.

## Implementation plan

1. Define minimal plan/gym public read contracts that express current product terms without copying database row shapes.
2. Add five fictional gyms and two versioned plan summaries through an explicit preview adapter.
3. Build plan comparison, gym discovery/detail and bounded filters with loading/empty/error-ready states.
4. Connect truthful navigation toward membership setup/Coming Soon without creating ownership.
5. Validate contract rules, filters, fictional-data policy, accessibility, responsive layouts and the standard frontend suite.

## Acceptance criteria

- [ ] AC1: Explore presents exactly the current Basic €80/ten and Classic €150/unlimited demo terms, including one included check-in per day and four required core gyms.
- [ ] AC2: At least five fictional gyms are discoverable with useful activity/location and plan-eligibility information; no actual gym identity or partnership claim appears.
- [ ] AC3: Discovery contracts and preview adapters are distinct from database rows and financial/access authority; no interaction creates membership, payment, reservation or attendance state.
- [ ] AC4: Filters, empty results, malformed/missing data and navigation have honest, accessible behavior at mobile and desktop widths.
- [ ] AC5: Domain/fixture tests, content assertions, lint, typecheck, format, build and focused keyboard/browser checks pass.

## Validation plan

Test plan invariants, unique fictional gym IDs/slugs, eligibility combinations and filter behavior without mirroring component implementation. Search fixtures for known real gym names and removed products. Exercise plan comparison, gym details, filter reset, empty/error-ready states and navigation at desktop/mobile widths with keyboard use. Run `npm test`, `npm run lint`, `npm run typecheck`, `npm run format:check`, `npm run build` and affected `npm run test:e2e` cases.

## Implementation record

Not started — ready after DEV0072 removed the overlapping legacy Explore implementation.

### Changes and rationale

Pending implementation.

### Affected files

Planned: public discovery domain contracts, explicit preview gym/plan adapter, Explore screen/presentation and focused domain/browser tests. Record exact paths during implementation.

### Decisions and deviations

- 2026-09-25: The user chose to validate the frontend concept before redesigning the database. Preview data remains clearly non-authoritative so later persistence can replace the adapter cleanly.

### Contracts, configuration, and operations

New frontend-only read contracts and fictional fixtures are planned. No server API, database schema, environment variable, migration, wallet transaction or deployment change is authorized.

## Validation results

Not run — implementation has not started.

## Risks, limitations, and follow-ups

The preview could accidentally hard-code assumptions that do not fit the later catalogue. Keep contracts minimal, versioned at the plan level and independent of storage. COR0006 must review them before persistent integration.

## Completion and review references

- Completed: Not completed.
- Commit: Not created.
- Review: Planning self-review only; no independent implementation review.
- Deployment or release: None.
