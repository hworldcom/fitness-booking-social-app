# Ticket DEVNNNN: Short title

This template is for a concrete **development ticket** that owns implementation and may be referenced by a commit. For a non-implementation work umbrella, use [the coordination template](COORDINATION_TEMPLATE.md) instead.

Use the next unused `DEVNNNN` ID after checking current and archived records. The four-digit DEV sequence is independent from the COR coordination sequence. Name the file `DEVNNNN-short-title.md`.

Use the repository-root `AGENTS.md` for workflow rules and `docs/mvp-spec.md` for current product requirements. This is a record template, not a separate policy. Copy it to the appropriate `tickets/current/` area: `frontend`, `backend`, `blockchain`, or `organisatory`. Use correct repository-relative links from that location. Completed and Cancelled records move to the matching `tickets/archive/<area>/` only after their final record and validation are complete.

- Status: Draft
- Created: YYYY-MM-DD
- Last updated: YYYY-MM-DD
- Milestone: Applicable milestone or project maintenance
- Coordination: One repository-relative `CORNNNN — Title` link, or `None — independent development ticket`
- Related records: Peer dependencies, downstream consumers, follow-ups and historical context, or None

## Objective and context

Describe the problem, current behavior, requested outcome, and why it matters. Link relevant specification sections. Include enough context for someone who has not seen the conversation.

## Scope and non-goals

- In scope:
- Out of scope:

## Expected behavior and edge cases

Describe the intended result, relevant user or system flows, failure/retry behavior, and boundaries. Distinguish proposed behavior from current behavior.

## Assumptions, decisions, and dependencies

Record assumptions, adopted implementation choices and their reasons, dependencies, and unresolved questions. Identify anything that must be resolved before the affected implementation begins.

## Implementation plan

List the small steps, affected components, and any setup or migration work. Fill this section before implementation and update it before implementing scope changes.

Review the proposed scope before implementation. If it must split into multiple implementation tickets, convert this planning record to the next available COR ID, add this DEV ID to the retired-ID register in [the work-record guide](README.md), and create fresh peer DEV tickets that link to the COR through their `Coordination` fields. If implementation or commit history already exists, preserve this DEV and create a separate COR instead of converting it. Record dependency order between peers; do not create a child-of-child development-ticket hierarchy without a concrete documented exception.

## Acceptance criteria

- [ ] AC1: Specific, observable result.
- [ ] AC2: Relevant boundary or failure case.

## Validation plan

Define how each acceptance criterion will be checked: focused tests, integration checks, manual scenarios, and applicable lint/type/build commands. Include needed fixtures or environments. Explain checks that do not apply.

## Implementation record

Pending implementation. Replace the prompts below with actual evidence as work proceeds; keep planning intent separate from delivered behavior.

### Changes and rationale

Explain before/after behavior, the implementation approach, and why it meets the objective. Include concrete examples where useful.

### Affected files

| File or component        | Change and purpose         |
| ------------------------ | -------------------------- |
| Repository-relative link | What changed here and why. |

### Decisions and deviations

Record dated significant decisions and departures from the original plan, with reasons and resulting scope changes. State explicitly if there were none.

### Contracts, configuration, and operations

Describe affected interfaces, data/schema changes, dependencies, environment variables, compatibility, setup, and migration/rollback steps. State when none apply. Do not include credentials or private keys.

## Validation results

Pending validation. Record actual results, not planned or assumed success.

- Date and environment:
- Exact commands and outcomes, including relevant counts or error details:
- Manual steps and observed outcomes:
- Failed, blocked, or not-run checks and reasons:

| Criterion | Evidence                             | Result  |
| --------- | ------------------------------------ | ------- |
| AC1       | Command result or manual observation | Not run |
| AC2       | Command result or manual observation | Not run |

## Risks, limitations, and follow-ups

Record known limitations, unresolved issues, and linked follow-up tickets. On interruption, include the current state and next action. Required unfinished acceptance criteria keep this ticket open.

## Completion and review references

- Completed: Date and summary, or Not completed.
- Commit: Actual reference and subject containing this development-ticket ID when created under the `AGENTS.md` commit rule, or Not created.
- Review: Commit/pull request references when available; otherwise state that none were created. Distinguish self-review from independent review.
- Deployment or release: Actual status if relevant; local completion alone is not deployment.
