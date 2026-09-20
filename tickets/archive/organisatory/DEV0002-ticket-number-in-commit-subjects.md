# Ticket DEV0002: Ticket number in commit subjects

- Status: Completed
- Created: 2026-09-18
- Last updated: 2026-09-18
- Milestone: Project workflow, before M0
- Coordination: None — independent development ticket
- Related tickets: [DEV0001 — Ticket workflow and agent instructions](DEV0001-ticket-workflow-and-agent-instructions.md)

## Objective and context

Make the user's commit convention explicit: when asked to commit a change, include its ticket number in the commit subject. Existing instructions mention ticket IDs in commits but do not specify placement or format.

## Scope and non-goals

Update `AGENTS.md`, the ticket guide, and the ticket template. Record this change and its validation here. Creating a Git commit, installing hooks, and changing application code are outside this task.

## Expected behavior and edge cases

- Use `[NNNN] Imperative summary` as the commit subject, preserving the ticket number's leading zeros.
- Prefer one ticket per commit. If a commit necessarily covers multiple related tickets, include every ID in the subject.
- Include the associated ticket documentation with its implementation changes.
- Create commits when the user requests them or existing user authorization covers them; this documentation request is not itself a request to commit.

## Assumptions, decisions, and dependencies

Use the existing four-digit ticket IDs. A bracketed prefix makes the ticket visible in short Git logs. This refines ticket 0001's convention without changing its historical record.

## Implementation plan

1. Create this ticket before editing the workflow rules.
2. Add a dedicated commit rule, matching guide, and template reminder.
3. Check links and wording consistency, record results, and complete this ticket and its index entry.

## Acceptance criteria

- [x] AC1: Agent instructions explicitly require the ticket number in each commit subject, with a concrete format and example.
- [x] AC2: The ticket guide and template use the same convention, including leading zeros and handling related tickets.
- [x] AC3: Commit authorization and inclusion of ticket documentation are explicit; this task creates no commit.

## Validation plan

Manually compare all three instruction surfaces, inspect the commit-rule wording with `rg`, and resolve local Markdown links. Application tests are not applicable to this documentation-only change.

## Implementation record

Previously, the instructions required a ticket ID in commits without defining its placement. They now require `[NNNN] Imperative summary` in the subject, preserving leading zeros, and all relevant ticket IDs for a necessary combined commit. Ticket documentation must accompany implementation changes, and the staged files and subject must be checked against the tickets before committing.

| File                                                                                                                    | Change and purpose                                                                                                                                                                 |
| ----------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [AGENTS.md](../../../AGENTS.md)                                                                                         | Added a dedicated commit rule covering authorization, subject format, multiple related tickets, and staged-change review.                                                          |
| [tickets/README.md](../../README.md)                                                                                    | Added matching commit guidance and this ticket's index entry.                                                                                                                      |
| [tickets/TEMPLATE.md](../../TEMPLATE.md)                                                                                | Added a commit-subject reminder to the completion fields, including leading zeros, multiple tickets, and accompanying documentation.                                               |
| [tickets/archive/organisatory/DEV0002-ticket-number-in-commit-subjects.md](DEV0002-ticket-number-in-commit-subjects.md) | Recorded the requested refinement before edits and documented the delivered changes and evidence. It moved to the categorised ticket archive under 0026 and 0029 after completion. |

Decision on 2026-09-18: use one consistent bracketed prefix for scan-friendly Git history. No deviation from the plan and no application contracts, configuration, dependencies, or migration requirements changed.

## Validation results

Validated locally on 2026-09-18:

- Ran `rg -n 'Commit rule|Commit convention|commit subject|Commit subject|leading zeros|staged' AGENTS.md tickets/README.md tickets/TEMPLATE.md`; output confirmed the explicit subject requirement and consistent format across all three files (AC1, AC2).
- Manually reviewed the rules for authorization, related tickets, and including implementation/validation records in the commit. All are consistent; no commit was created (AC3).
- Ran the Python 3 link check below; it exited successfully with `PASS: 34 local Markdown links resolve.`
- Application tests were not applicable: only contributor documentation changed. No required validation failed or remains outstanding.

```sh
python3 - <<'PY'
from pathlib import Path
import re
links = [(p, href.split('#', 1)[0]) for p in Path('.').rglob('*.md')
         for href in re.findall(r'\[[^\]]*\]\(([^)]+)\)', p.read_text())
         if '://' not in href and not href.startswith('#')]
missing = [(str(p), href) for p, href in links if not (p.parent / href).exists()]
assert not missing, missing
print(f'PASS: {len(links)} local Markdown links resolve.')
PY
```

## Risks, limitations, and follow-ups

This is a contributor convention, not a Git hook or automated commit validator. No follow-up is required for this request.

## Completion and review references

Completed on 2026-09-18 and self-reviewed against all three acceptance criteria. No independent review, commit, or pull request has been created. Deployment is not applicable.

Commit subject if subsequently requested: `[0002] Require ticket numbers in commit subjects`.
