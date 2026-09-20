# Coordination CORNNNN: Short title

This template is for a non-implementation coordination record. It groups peer development tickets, sequence, boundaries and integration evidence. It does not authorize implementation, contain the detailed implementation evidence owned by its development tickets, or supply a number for commit subjects. Use [the development-ticket template](TEMPLATE.md) for concrete changes.

Use the next unused `CORNNNN` ID after checking current and archived records. The four-digit COR sequence is independent from the DEV development sequence. Name the file `CORNNNN-short-title.md` under the appropriate `tickets/current/<area>/` directory. Completed and Cancelled records move to the matching archive area under the normal lifecycle rules.

When this record results from splitting a proposed DEV before implementation, use the next COR ID rather than copying the DEV number. Preserve the planning history, fill in `Converted from`, and add the former DEV ID to the retired-ID register in [the work-record guide](README.md).

- Status: Draft
- Created: YYYY-MM-DD
- Last updated: YYYY-MM-DD
- Milestone: Applicable milestone or cross-cutting initiative
- Converted from: Retired `DEVNNNN`, or `Not applicable — created as a coordination record`
- Tracked development tickets: Direct implementation tickets, or explicitly identify required tickets that do not exist yet
- Related records: Dependencies, downstream consumers, follow-ups and historical context, or None

## Objective and boundaries

Describe the outcome being coordinated and the boundaries shared across the development tickets. State explicitly that this record does not implement runtime behavior.

## Direct development work

Map every required implementation part to exactly one development ticket. Keep these tickets as peers under this coordination record.

| Implementation part | Development ticket                                         | Owned deliverable             | Start condition or dependency |
| ------------------- | ---------------------------------------------------------- | ----------------------------- | ----------------------------- |
| Concrete part       | `DEVNNNN — Ticket title` with its repository-relative path | Exact implementation boundary | When this ticket can start    |

Identify any required ticket that has not been created. Do not begin that implementation under this coordination record.

Every listed DEV ticket must link back to this record in its opening `Coordination` field. A DEV belongs directly to at most one COR. Dependencies, downstream consumers and historical links are not direct members.

## Other relationships

List downstream consumers, external dependencies, follow-ups and historical baselines separately. Explain how each relationship differs from direct implementation ownership.

## Delivery sequence and completion conditions

State the intended order, independent branches, blockers and integration points. Define the observable conditions for completing this coordination record, including the required status of every direct development ticket and final integration validation.

## Progress and integration record

Maintain concise cross-ticket status, shared decisions, deviations and integration results. Link to development tickets for implementation details and validation evidence instead of duplicating them here.

## Validation results

Record checks of the work map, links, statuses, shared boundaries and final integration. Coordination checks do not replace any development ticket's required tests.

## Risks, limitations, and follow-ups

Record cross-ticket risks, unresolved coordination questions and missing direct development tickets. Avoid adding another coordination or nested ticket layer; use peer development tickets by default.

## Completion and review references

- Completed: Date and coordinated outcome, or Not completed.
- Direct development tickets: Final statuses and links.
- Commit: Not applicable — coordination-record IDs are not used in commit subjects. Link relevant development-ticket commits only when useful for navigation.
- Review: Integration review or pull-request references when available.
- Deployment or release: Actual coordinated status, if applicable.
