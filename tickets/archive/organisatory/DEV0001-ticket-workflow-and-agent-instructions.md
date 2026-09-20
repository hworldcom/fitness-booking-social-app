# Ticket DEV0001: Ticket workflow and agent instructions

- Status: Completed
- Created: 2026-09-18
- Last updated: 2026-09-18
- Milestone: Project workflow, before M0
- Coordination: None — independent development ticket
- Related tickets: None

## Objective and context

Establish project instructions similar to catalog-classifier and catalog-website. The user requested tickets before code and a clear implementation record in every ticket so future developers can review changes without relying on conversation history.

Currently the project contains product planning documents, but no project agent instructions, tickets, or application code.

## Scope and non-goals

In scope:

- Create root `AGENTS.md` with project context, mandatory ticket-first planning, implementation documentation, validation, and completion rules.
- Add a ticket guide/index and reusable template under `tickets/`.
- Link the workflow from the project README.
- Use this ticket to document the workflow setup itself.

Out of scope: application scaffolding, product implementation, dependency installation, deployment, and changing the proposed product architecture.

## Expected behavior and edge cases

- Every implementation has a ticket written before the implementation starts, including fixes, refactors, configuration, migrations, tests, and documentation changes.
- Scope changes are recorded before implementing them. An unrelated follow-up receives its own linked ticket.
- A ticket records both the intended result and the actual implementation, including deviations, affected files, validation evidence, and remaining limitations.
- Missing validation cannot be described as passed or hidden behind a completed status.
- Existing user authorization carries forward; ticket creation does not add a new approval requirement for already requested work.

## Assumptions, decisions, and dependencies

- Use the existing catalog projects as structural references, with repository-local numbered Markdown tickets.
- Preserve the distinction between the confirmed demo target and recommended implementation choices in the current README and build specification.
- No application test harness or package scripts exist yet; documentation checks are sufficient for this change.

## Implementation plan

1. Record this ticket before creating the workflow files.
2. Write project agent instructions and the ticket guide/template.
3. Add README navigation to the new workflow.
4. Check local documentation links and review the rules against the request.
5. Record the exact changes and validation results here, then complete the ticket and index entry.

## Acceptance criteria

- [x] AC1: `AGENTS.md` requires a prepared ticket before implementation and records scope changes before code changes.
- [x] AC2: Instructions require a self-contained implementation record with before/after behavior, rationale, affected files, decisions, and validation results.
- [x] AC3: A reusable template and ticket lifecycle make planning, implementation, validation, and completion explicit.
- [x] AC4: README navigation exposes the instructions and ticket index without changing product scope.
- [x] AC5: This ticket records the delivered files and actual documentation validation; no application code is introduced.

## Validation plan

- Resolve relative Markdown file links across the repository and check that every target exists.
- Check that this ticket and the template contain the required planning and review sections.
- Manually compare `AGENTS.md`, the template, guide, and README for consistent lifecycle and completion rules.
- Application lint, build, and runtime tests are not applicable: no application or test harness exists, and this change only adds documentation.

## Implementation record

### Changes and rationale

Before this change, the project had a product specification and milestone plan but no contributor workflow or ticket history. It now requires a prepared ticket before every implementation edit and a completed review record before the work can be reported as done.

Planning and actual results have separate sections. Contributors must describe before/after behavior, important files and their roles, rationale, contract or configuration changes, validation evidence, and unresolved work. This makes the ticket usable by a developer who did not participate in the original conversation.

### Affected files

| File                                                                                                                                | Change and purpose                                                                                                                                                                              |
| ----------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [AGENTS.md](../../../AGENTS.md)                                                                                                     | Added project references, ticket-first rules, planning and implementation responsibilities, required review evidence, project behavior rules, validation guidance, and completion requirements. |
| [tickets/README.md](../../README.md)                                                                                                | Added the ticket workflow, status definitions, continuity rules, and index.                                                                                                                     |
| [tickets/TEMPLATE.md](../../TEMPLATE.md)                                                                                            | Added reusable planning sections, an implementation record, acceptance-to-evidence mapping, and completion/review fields.                                                                       |
| [tickets/archive/organisatory/DEV0001-ticket-workflow-and-agent-instructions.md](DEV0001-ticket-workflow-and-agent-instructions.md) | Created this ticket before other implementation edits and documented this change using the new workflow. It moved to the categorised ticket archive under 0026 and 0029 after completion.       |
| [README.md](../../../README.md)                                                                                                     | Added a development workflow section linking the instructions, index, and template.                                                                                                             |

### Decisions and deviations

Decisions recorded on 2026-09-18:

- Followed the numbered-ticket and small-slice conventions from the catalog-classifier and catalog-website `AGENTS.md` files and their sample tickets. Also inspected the Kru Tiger website instructions, which contain framework-specific Next.js guidance; adopted the principle of checking installed framework documentation without copying a version-specific generated block into an unbootstrapped project.
- Strengthened the implementation and validation record to explicitly meet the user's future-review requirement; a code diff or chat summary alone cannot close a ticket.
- Kept workflow stages distinct from user-selected roles and preserved existing authorization. There is no additional approval round solely for creating or updating a ticket.
- Kept the product specification's distinction between confirmed demo scope and recommended implementation choices. No product or architecture decision was changed by this workflow task.
- No deviation from this ticket's planned scope.

### Contracts, configuration, and operations

No application interfaces, data schemas, dependencies, environment variables, or migrations changed. No services were started or deployed. The implementation is documentation only; no application code was added.

## Validation results

Validated on 2026-09-18 in the local project directory with Python 3 and a manual documentation review.

- The command below exited successfully: `PASS: 9 Markdown files; 28 local links resolve; all 11 template sections present in ticket 0001.`
- Manually read the agent instructions, ticket guide, template, and README together. Confirmed consistent ticket-first planning, implementation evidence, lifecycle meanings, and completion requirements.
- Ran `rg --files --hidden -g '!.git' -g '!node_modules'`: the project contains the nine expected Markdown files and no application code.
- Application lint, build, and runtime tests were not run because this is documentation-only work and application tooling does not exist. No required check failed or remains blocked.

| Criterion | Evidence                                                                                                                                         | Result |
| --------- | ------------------------------------------------------------------------------------------------------------------------------------------------ | ------ |
| AC1       | Reviewed the mandatory ticket-before-implementation and scope-update rules in `AGENTS.md`; this ticket was written before the workflow files.    | Passed |
| AC2       | Reviewed the required implementation record and populated the corresponding before/after, file, rationale, contract, and evidence sections here. | Passed |
| AC3       | Template section check passed; manual review confirmed status definitions and completion requirements agree with `AGENTS.md`.                    | Passed |
| AC4       | README workflow links resolve; its existing product scope remains intact.                                                                        | Passed |
| AC5       | File inventory contains only documentation; this ticket records all five delivered or updated files and actual validation results.               | Passed |

Reproducible documentation check, run from the repository root:

```sh
python3 - <<'PY'
from pathlib import Path
import re

documents = sorted(Path('.').rglob('*.md'))
local_links = []
for document in documents:
    for target in re.findall(r'\[[^\]]*\]\(([^)]+)\)', document.read_text()):
        if '://' not in target and not target.startswith('#'):
            local_links.append((document, target.split('#', 1)[0]))
missing = [(str(document), target) for document, target in local_links
           if not (document.parent / target).exists()]
assert not missing, missing
template_sections = re.findall(r'^## (.+)$', Path('tickets/TEMPLATE.md').read_text(), re.M)
ticket = Path('tickets/0001-ticket-workflow-and-agent-instructions.md').read_text()
assert all(f'## {section}\n' in ticket for section in template_sections)
print(f'PASS: {len(documents)} Markdown files; {len(local_links)} local links resolve; '
      f'all {len(template_sections)} template sections present in ticket 0001.')
PY
```

## Risks, limitations, and follow-ups

- These are contributor instructions, not an automated enforcement mechanism.
- Concrete application validation commands must be documented by the ticket that creates the application tooling.

## Completion and review references

- Completed: 2026-09-18. Project instructions, ticket guide/index, reusable template, and README navigation are in place.
- Review: Self-reviewed against all five acceptance criteria. No independent review, commit, or pull request has been created for this task.
- Deployment or release: Not applicable; documentation changes only.
