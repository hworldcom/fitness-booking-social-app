# Ticket DEV0004: Class-join feed and badge scope

- Status: Completed
- Created: 2026-09-18
- Last updated: 2026-09-18
- Milestone: Product specification; affects M3 and demo delivery
- Coordination: None — independent development ticket
- Related tickets: [DEV0003](DEV0003-consolidate-project-documentation.md)

## Objective and context

The user removed on-chain badges from the hackathon MVP and suggested publishing class joins in the user's social feed. The current [specification](../../../docs/mvp-spec.md#9-social-behavior-and-permissions) already derives activity from confirmed bookings, but limits visibility without defining public class-join sharing. Record the scope reduction and define the proposed feed behavior in the single current specification.

## Scope and non-goals

- In scope: explicitly defer on-chain badges; specify class-join events, visibility, privacy controls, cancellation and deduplication; align screens, data requirements, milestones, acceptance scenarios and demo instructions.
- Out of scope: application code, actual public posts or wallet transactions, full challenge-led scope rewrite, adoption of unresolved challenge/refund rules, removing ordinary UI status labels, commits or deployment.

## Expected behavior and edge cases

- A confirmed class booking can create one structured "joined a class" item in the user's activity and the app feed, across membership and paid routes. No activity is published from a click, social RSVP, pending payment or failed purchase.
- Adopt public sharing as a visible, controllable default for this demo. The booking user can disable it before confirmation or hide the item later. Public means other users in the same demo run; private plans and separate runs remain isolated.
- Publish only the user's display identity and public class/gym/trainer/time details. Do not expose receipt data, wallet links, access routes, private plan notes or invitations.
- Cancellation updates the existing visible item; retries never duplicate it or restore a hidden post. Joining does not assert attendance or award a badge.
- On-chain badge minting, claims and metadata are deferred; no badge transaction appears in the required demo or acceptance contract.

## Assumptions, decisions, and dependencies

- Confirmed user decision: remove on-chain badges for now. Feed behavior is an adopted design default following the user's suggestion, not a claim that every privacy/wording detail was explicitly approved.
- Interpret "joins a class" as provider-confirmed booking, matching existing evidence rules. Gym-confirmed attendance remains a different event; this ticket does not implement check-in or the broader challenge revision.
- No application exists. This is a documentation change only. Existing challenge and pass-refund questions are outside this ticket and must not be silently resolved here.

## Implementation plan

1. Prepare this ticket and update the index before specification edits.
2. Update the existing specification in place, with no second product document; preserve stable heading anchors.
3. Review all event/visibility/badge references and align scope, screens, storage, M3, definition of done, acceptance cases and demo.
4. Validate Markdown links/anchors/fences, preserved historical files and bounded changes; finish this record and index.

## Acceptance criteria

- [x] AC1: The specification explicitly excludes on-chain badges from the MVP and required demo.
- [x] AC2: Feed publication requires confirmed booking evidence and distinguishes joining from attendance.
- [x] AC3: Visibility, pre-confirmation opt-out, later hiding, private data, run isolation, cancellation and retry behavior are explicit and consistent.
- [x] AC4: Screens, storage requirements, milestones, definition of done, acceptance matrix and demo reflect the social change.
- [x] AC5: Local Markdown links/anchors/fences pass; historical records and unrelated files are preserved; only documentation changes.

## Validation plan

Compare the specification against a temporary pre-edit snapshot; review the sections named in AC4. Run a one-off Python check of all local Markdown links, heading anchors, code fences and pre-existing file hashes. Inspect the diff and keyword matches for conflicting feed rules. Application lint/build/runtime tests do not apply because this ticket changes documentation before application scaffolding.

## Implementation record

Specification changes completed on 2026-09-18. No application functionality was implemented.

### Changes and rationale

The specification now explicitly defers on-chain achievement badges in its confirmed constraints, scope and follow-up boundaries. Class-join activity replaces badge minting as the proposed social visibility feature. Existing booking-status labels remain available.

Previously, confirmed bookings generated an event without a public sharing contract. Section 9 now defines a single structured class-join event only after a confirmed booking, visible in the user's activity and same-run app feed under the user's sharing choice. It adds a visible default-on toggle before confirmation, later hiding, safe public fields, current-state cancellation rendering and retry/delayed-delivery rules. No RSVP or payment-pending state implies a booked place or attendance.

Screens, prospective persistent records, payment event delivery, M3, definition of done, six new acceptance scenarios and the demo script reflect these rules. An explicit scope-revision notice explains that the broader challenge-led rewrite has not yet been consolidated; unrelated unresolved financial rules were not silently adopted.

### Affected files

| File or component                                            | Change and purpose                                                      |
| ------------------------------------------------------------ | ----------------------------------------------------------------------- |
| [MVP specification](../../../docs/mvp-spec.md)               | Badge exclusion and class-join social behavior in the current contract. |
| [Ticket index](../../README.md)                              | Track this bounded documentation change.                                |
| [Ticket DEV0004](DEV0004-class-join-feed-and-badge-scope.md) | Plan and validation record.                                             |

### Decisions and deviations

2026-09-18: Adopt confirmed booking as the class-join trigger, and public-with-an-opt-out as the demo sharing default. The user requested removing on-chain badges and suggested the feed feature; these detailed defaults are recorded as design choices, not individually confirmed user answers.

Public means other demo users in the same isolated run, including non-followers. A public post links to public class details without disclosing its private originating plan. No material deviation from the planned scope.

### Contracts, configuration, and operations

The planned social contract adds `CLASS_JOINED`, a unique booking event key and persistent sharing visibility. Booking records will need the sharing choice. These are specification requirements only: no runtime/schema migration, dependency, environment, credential, actual public post or deployment changed. Existing document paths and heading anchors remain stable.

## Validation results

Validated locally on 2026-09-18 with standard-library Python and a manual specification diff review.

- `python3 /private/tmp/fitness-feed-scope-0004/validate.py` — passed: 12 Markdown files, 88 local links, 31 heading fragments and balanced code fences. Nine unrelated/historical files match their pre-edit hashes; only the expected new ticket was added. Identity, access, inventory, asset and unresolved financial-policy sections match the snapshot.
- A Python `difflib.unified_diff` comparison of `/private/tmp/fitness-feed-scope-0004/mvp-spec.before.md` with `docs/mvp-spec.md` was inspected. All changes are the scoped social/badge requirements or the explicit revision-status notice.
- Manually traced confirmed membership/paid booking, RSVP, pending payment, opt-out, later hiding, cancellation and late event delivery through sections 2, 5, 7, 9–13. They agree on the confirmation trigger, off-chain event, public field restrictions and absence of a badge transaction.
- Application lint, builds, automated runtime tests and devnet rehearsals were not run because this is a specification-only change and application tooling does not exist. No required documentation check failed or remains blocked. The temporary checker is review evidence, not new project tooling.

| Criterion | Evidence                                                                                                             | Result |
| --------- | -------------------------------------------------------------------------------------------------------------------- | ------ |
| AC1       | Confirmed constraints, scope, section 9, acceptance scenario, demo and follow-up boundaries exclude on-chain badges. | Passed |
| AC2       | Confirmation-only trigger, negative scenarios and attendance distinction checked across the affected sections.       | Passed |
| AC3       | Sharing, cancellation, run isolation and delayed-delivery rules reviewed against their acceptance scenarios.         | Passed |
| AC4       | Screens/storage, M3, definition of done, six added matrix rows and demo all updated.                                 | Passed |
| AC5       | Link/anchor/fence and snapshot checks passed; nine other Markdown files preserved.                                   | Passed |

## Risks, limitations, and follow-ups

The broader challenge-led product revision and pass-refund policy are still being clarified. This bounded change does not claim to deliver that rewrite or application functionality. Demo public visibility must not leak private plans or cross demo-run boundaries.

## Completion and review references

- Completed: 2026-09-18; no on-chain badges in MVP scope, with explicit class-join feed requirements and validation evidence.
- Commit: Not created.
- Review: Self-reviewed against AC1–AC5; no independent review or pull request.
- Deployment or release: Not applicable; specification only.
