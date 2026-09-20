# Ticket DEV0042: Clarify contributor terminology

- Status: Completed
- Created: 2026-09-20
- Last updated: 2026-09-20
- Milestone: Project maintenance
- Coordination: None — independent development ticket
- Related records: None

## Objective and context

Make the contributor-writing policy explicitly require plain-language definitions for project-specific terms. A reader should be able to understand a ticket, specification note or handoff without having seen the conversation that produced it.

The immediate example is `demo run`, which means an isolated set of demonstration data but can be mistaken for a fitness activity or login session.

## Scope and non-goals

- In scope: add a concise clarity rule to the root contributor instructions; record and index this documentation-only change.
- Out of scope: rewrite existing product documents or interface copy; change the `demo_runs` database contract; resolve DEV0039 product or implementation decisions.

## Expected behavior and edge cases

Contributor-facing writing defines unfamiliar project terminology at first use in plain language. Where a term has a likely everyday or technical alternative meaning, the text distinguishes those meanings instead of assuming the reader already knows the repository vocabulary.

Established schema and code identifiers may remain unchanged when renaming them would be a separate compatibility change, but the surrounding explanation must still be clear.

## Assumptions, decisions, and dependencies

This is an independent workflow clarification with no application dependency. The rule belongs in `AGENTS.md` because that file is the authoritative contributor policy.

## Implementation plan

1. Add the plain-language and first-use definition rule to the writing-style section of `AGENTS.md`.
2. Check formatting, repository-relative Markdown links and the focused diff.
3. Complete and archive this ticket after validation.

## Acceptance criteria

- [x] AC1: `AGENTS.md` tells contributors not to assume project-specific knowledge and to define unfamiliar terms at first use.
- [x] AC2: The rule addresses terms with ambiguous everyday or technical meanings while preserving established code identifiers where appropriate.
- [x] AC3: The ticket index and implementation record accurately describe the change, and documentation validation passes.

## Validation plan

Run the repository formatting check, verify repository-relative Markdown links and inspect the focused diff. Application tests, type checking and browser testing are not applicable because this change affects contributor prose only.

## Implementation record

The contributor-writing policy now requires project-specific terminology to be understandable without conversation history. It also explicitly handles terms whose ordinary meaning can mislead a new reader while avoiding unnecessary code/schema renames.

### Changes and rationale

Added a first-use definition and disambiguation rule to `AGENTS.md`. The rule includes `demo run` as the concrete example because it means an isolated demonstration dataset in this repository but could otherwise be read as a fitness activity or login session. It permits established identifiers to remain stable when their surrounding explanation is clear, avoiding an unrelated compatibility change.

### Affected files

| File or component                      | Change and purpose                                                                                     |
| -------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| [`AGENTS.md`](../../../AGENTS.md)      | Require plain-language first-use definitions and explicit disambiguation for unfamiliar project terms. |
| [`tickets/README.md`](../../README.md) | Index this workflow change and reserve the next development identifier.                                |
| This ticket                            | Record scope, rationale and validation evidence for the policy change.                                 |

### Decisions and deviations

No deviations. The policy keeps stable code/schema names rather than treating a prose clarification as authorization to rename technical contracts.

### Contracts, configuration, and operations

No application, data, environment or operational contract changes are expected. This ticket changes contributor-writing policy only.

## Validation results

- Date and environment: 2026-09-20, local repository workspace.
- `npx prettier --check AGENTS.md tickets/README.md tickets/archive/organisatory/DEV0042-clarify-contributor-terminology.md` passed after the completed record was archived and mechanically formatted.
- `npm run format:check` passed for the repository's configured application files, and `git diff --check` passed.
- Direct `test -f` checks passed for the ticket's repository-relative `AGENTS.md` and ticket-index links and for the index's ticket target.
- Application tests, type checking, builds and browser checks were not run because this ticket changes contributor prose only.

| Criterion | Evidence                                                                                                            | Result |
| --------- | ------------------------------------------------------------------------------------------------------------------- | ------ |
| AC1       | Focused diff shows the new no-assumed-context and first-use definition rule in `AGENTS.md`.                         | Passed |
| AC2       | The rule distinguishes `demo run` from fitness/login meanings and permits clearly explained stable technical names. | Passed |
| AC3       | Specific Markdown formatting, whitespace and direct link-target checks passed; the index reserves DEV0043 as next.  | Passed |

## Risks, limitations, and follow-ups

This rule will improve future writing but does not itself rewrite existing unclear terminology. Product-document or interface cleanup requires separately scoped work.

## Completion and review references

- Completed: 2026-09-20 — added and validated the contributor terminology-clarity rule.
- Commit: `[DEV0042] Clarify contributor terminology`.
- Review: Focused self-review completed; no independent review.
- Deployment or release: Not applicable.
