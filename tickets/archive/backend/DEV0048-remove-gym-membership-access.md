# Ticket DEV0048: Remove gym membership access

- Status: Completed
- Created: 2026-09-21
- Last updated: 2026-09-21
- Milestone: MVP product cleanup
- Coordination: None — independent development ticket
- Related records: corrects the database foundation from [DEV0015](DEV0015-supabase-database-foundation.md) and the frontend preview from [DEV0008](../frontend/DEV0008-repx-club-frontend.md); revises downstream [DEV0018 — Class-pass reservations and confirmed visits](../../current/backend/DEV0018-class-pass-reservations-and-confirmed-visits.md); preserves the application dataset-participation boundary delivered by [DEV0040](DEV0040-protected-access-and-database-context.md)

## Objective and context

Remove the gym-membership entitlement and membership-booking capability because gym memberships are not part of the current MVP. Keep class passes, class discovery, staff-confirmed attendance and ordinary application-account participation conceptually separate.

The audit found real membership behavior in `app.membership_entitlements`, `class_sessions.membership_eligible`, the Drizzle mappings and seed, the class fixture `membership` flag, browser-local booking/feed/profile behavior, tests and the current specification. These are not merely labels and must be removed consistently.

`app.demo_run_memberships` is not gym membership logic: it is the internal authorization link between an application profile and an isolated dataset plus its base role. It remains in this ticket, described as dataset participation. `organization_memberships` likewise records organization roles rather than consumer gym subscriptions.

## Scope and non-goals

- In scope: add a forward migration that removes `membership_entitlements` and `class_sessions.membership_eligible`; remove matching Drizzle exports, seed rows and database tests; remove the class `membership` flag and membership-specific booking branch/copy; remove browser-local membership bookings and their feed/profile projections; update tests, README, specification and downstream planning; retain pass-price previews and honest not-yet-implemented purchase behavior.
- Out of scope: removing internal dataset participation or organization roles; implementing real class-pass payment/reservations/refunds; removing staff-confirmed visit requirements; changing challenge attendance evidence; event tickets; redesigning unrelated screens; rewriting completed migrations or archived implementation history.

## Expected behavior and edge cases

Every class detail presents its class-specific test-EURC pass price and the existing honest purchase preview. No class claims that Anna or another person is covered by a gym membership, and no local action creates/cancels a membership booking or publishes it to the feed/profile.

A clean local database reset applies the new forward migration before the current seed and contains no `membership_entitlements` table or `membership_eligible` column. Drizzle exposes neither contract. Internal application dataset participation continues to authorize the actor and must not be presented as a gym subscription.

Class access, reservation and social activity will be implemented only from a verified class-pass or other explicitly ticketed access source. Staff confirmation remains necessary to record attendance; purchase intent or social intent alone never proves a visit.

## Assumptions, decisions, and dependencies

Confirmed user decision on 2026-09-21: the current MVP has no gym memberships and any implemented gym-membership logic must be cleaned up.

The existing class-pass and visit direction remains. Removing the local membership booking means the preview temporarily offers only an informational pass-purchase flow until a later payment/access ticket creates real access. This is more honest than preserving a fake membership path.

The original DEV0015 migration remains immutable history. This ticket owns a later forward migration and the matching current schema/seed contract.

## Implementation plan

1. Update the specification and DEV0018 plan so gym membership is no longer an access source or booking prerequisite; distinguish internal dataset participation explicitly.
2. Add a forward migration dropping `app.membership_entitlements` and `app.class_sessions.membership_eligible`; update Drizzle mappings, seed SQL and foundation database assertions.
3. Remove `ClubClass.membership`, membership fixture values and class-detail membership branches. Keep the class-pass price and informational purchase preview for every class.
4. Remove browser-local membership booking actions/state plus feed/profile projections and update persisted-preview parsing so old stores safely ignore obsolete booking data.
5. Update focused unit/browser tests, setup/status documentation and ticket/index links; run clean database replay and the full relevant validation suite.

## Acceptance criteria

- [x] AC1: A clean database contains no `app.membership_entitlements` relation and no `class_sessions.membership_eligible` column; Drizzle, seed and database tests match that contract.
- [x] AC2: Domain/fixture/interface code contains no class gym-membership flag, entitlement claim, membership-booking action or membership-derived feed/profile activity.
- [x] AC3: Every class displays the pass price and honest purchase preview; no local reservation, visit, payment or wallet result is fabricated.
- [x] AC4: Internal `demo_run_memberships` continues to enforce application dataset participation and is documented as unrelated to gym membership. Organization roles also remain intact.
- [x] AC5: Specification, README and current downstream tickets contain no current MVP promise of gym membership access; archived records remain historical.
- [x] AC6: Migration/reset, SQL/driver, unit, lint, typecheck, formatting, production build and responsive browser regressions pass with exact evidence recorded.

## Validation plan

Run a clean local database reset, restricted runtime provisioning, pgTAP/schema lint and driver tests. Inspect the migrated catalogue schema directly for absence of the table/column while verifying actor dataset-participation tests still pass.

Run domain/store tests proving obsolete saved `bookings` input is ignored safely and no booking action remains. At desktop and mobile widths, open every class, verify price/pass-preview behavior, exercise cancellation of the informational dialog and confirm feed/profile contain no membership booking. Run lint, typecheck, formatting, webpack build and the relevant/full browser suite.

## Implementation record

The repository audit found both database and interface gym-membership behavior, so this ticket removed the capability rather than treating it as wording only. Class passes and staff-confirmed attendance remain planned, but the application no longer fabricates a no-payment access path.

### Changes and rationale

- Added `20260921000300_remove_gym_membership_access.sql` as a forward migration. It drops the consumer `membership_entitlements` table and the `class_sessions.membership_eligible` column while leaving dataset participation, organization roles, venue staff and trainer affiliations intact.
- Removed the matching Drizzle table/column exports and seed data. Foundation SQL/driver checks now assert the nine-table current foundation shape and explicitly prove that the gym-entitlement relation/column are absent.
- Removed the `ClubClass.membership` field, fixture values and conditional class-detail booking branch. Every class now presents its price and the same honest checkout preview; closing the dialog changes no browser state.
- Removed browser-local booking actions/data, membership-derived feed posts and profile-session rows. Persisted preview parsing returns only the supported fields, so a legacy `bookings` property is discarded while follows, saves and drafts survive.
- Replaced current product/documentation promises with verified class-pass access. DEV0018 is now the unimplemented class-pass reservation/confirmed-visit consumer and explicitly depends on separate verified-payment work.
- Split accepted account-first planning into DEV0046 email accounts/profiles and DEV0047 optional personal-wallet ownership under COR0003. This preserves DEV0046's prior planning history while giving the independently reviewable wallet lifecycle its own ticket.

### Affected files

| File or component | Change and purpose |
| ----------------- | ------------------ |
| `supabase/migrations/20260921000300_remove_gym_membership_access.sql`, `supabase/seed.sql`, `src/server/db/schema/foundation.ts` | Remove the current gym-entitlement storage contract through migration, mapping and seed. |
| `supabase/tests/database/foundation.test.sql`, `tests/database/foundation.test.ts` | Prove the resulting table/column contract and retained RLS/runtime behavior. |
| `src/domain/catalogue.ts`, `src/features/preview/catalogue.ts`, `src/features/classes/class-detail.tsx` | Remove class eligibility flags and use one non-mutating pass-price/checkout preview for every class. |
| `src/features/preview/state.ts`, `src/features/feed/feed.tsx`, `src/features/profile/profile.tsx` | Remove local booking state/actions and their feed/profile projections; discard only obsolete saved fields. |
| `tests/demo.test.ts`, `tests/events.test.ts`, `tests/browser/preview.spec.ts`, `tests/browser/events.spec.ts` | Replace membership behavior checks with compatibility and non-mutation checks at desktop/mobile widths. |
| `README.md`, `docs/mvp-spec.md`, current/downstream work records and `tickets/README.md` | Adopt class-pass-only access, clarify internal dataset/organization role records, lock accepted account-first defaults and repair renamed links. |

### Decisions and deviations

The initial request was to update DEV0046, but the audit found implemented gym-membership behavior. Per the ticket-first rule, that independent cleanup became DEV0048 and was completed before DEV0046. The historical DEV0015 migration was not rewritten; a later migration removes its superseded objects. The standard Turbopack build could not bind an internal local port in this execution environment, including after escalation, so the documented webpack production path was run successfully in both configured and preview modes.

### Contracts, configuration, and operations

Contract change: current databases no longer expose `app.membership_entitlements` or `app.class_sessions.membership_eligible`; `ClubClass` and browser preview state no longer carry membership/booking fields. No dependency or environment variable changed. A disposable rollback is a reset at an earlier commit; an already-shared database would require a new forward migration rather than reverting migration history. Legacy browser data is migrated on read by retaining supported fields and omitting `bookings`.

## Validation results

- **Database replay/schema — passed (AC1, AC4, AC6):** `npm run db:reset` applied all migrations and the revised seed; `npm run db:test` passed 63 pgTAP assertions; `npm run db:lint` reported no schema errors; `npm run db:runtime && npm run test:db` passed 9 driver/authorization tests. These checks prove the removed objects are absent and retained dataset-participation/RLS boundaries still work.
- **Unit/boundary — passed (AC2, AC3, AC6):** `npm test` passed 42 tests, including legacy local-state migration; `npm run lint` and `npm run typecheck` passed.
- **Formatting/build — passed (AC6):** `npm run format:check` and `git diff --check` passed. `npx next build --webpack` passed in configured `.env.local` mode and again with all access variables blank for preview mode. `npm run build` reached a Turbopack environment error while creating an internal process/port, not a source diagnostic; the webpack production builds provide the required build evidence.
- **Browser — passed (AC2, AC3, AC6):** the configuration-free desktop/mobile suite passed 40 tests with 4 configured-mode checks skipped as designed. Every class showed the pass price/preview with no membership copy, and previews left storage unchanged. The focused configured-mode authorization suite then passed 4/4 desktop/mobile checks.
- **Documentation/records — passed (AC4, AC5):** a repository validator checked 66 Markdown files and 45 unique DEV/COR records; every repository-local link resolved and no duplicate ID existed. Current records distinguish `demo_run_memberships` (dataset participation) and `organization_memberships` (organization roles) from removed gym entitlements.

## Risks, limitations, and follow-ups

Old browser-local stores contain `bookings`; parsing must discard that obsolete field without erasing unrelated drafts, saves or follows. Downstream class-pass work must not reintroduce membership as an unverified shortcut. Historical archived tickets may mention the superseded membership design and remain unchanged unless a link requires correction.

## Completion and review references

- Completed: 2026-09-21.
- Commit: Not created.
- Review: Self-review against AC1–AC6 completed; no independent review.
- Deployment or release: None.
