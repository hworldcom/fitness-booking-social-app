# Ticket DEV0062: Refine guide opening proposition

- Status: Completed
- Created: 2026-09-24
- Last updated: 2026-09-24
- Milestone: MVP product pivot and public presentation
- Coordination: [COR0005 — Fitness-access product pivot](../organisatory/COR0005-fitness-access-product-pivot.md)
- Related records: follows completed [DEV0059 — Rewrite public positioning and How it works](DEV0059-rewrite-public-positioning-and-guide.md) and [DEV0061 — Emphasize user and business benefits](DEV0061-emphasize-user-and-business-benefits.md)

## Objective and context

Replace the `/how-it-works` opening headline and description with the user's preferred proposition so the first viewport balances the member and fitness-business benefits immediately.

## Scope and non-goals

- In scope: change the guide hero heading/supporting sentence and its focused browser assertion.
- Out of scope: changing downstream guide sections, metadata, product behavior, navigation or pricing/transfer policy.

## Expected behavior and edge cases

The hero reads “Flexible for members. Built to grow with fitness businesses.” followed by “MovX Club connects flexible fitness access with real communities—giving members more freedom and businesses a direct way to grow.” It remains the single page H1, wraps cleanly at supported widths and preserves existing calls to action.

## Assumptions, decisions, and dependencies

Use the user-provided copy verbatim, including the em dash. “Flexible” remains bounded by the eligibility/preview details elsewhere on the page and does not claim live transferable membership behavior.

## Implementation plan

1. Replace the hero H1 and supporting paragraph.
2. Update the focused browser expectation.
3. Run formatting, lint, typecheck and the focused desktop/mobile guide check; inspect responsive screenshots.

## Acceptance criteria

- [x] AC1: The hero displays the exact requested headline and description as the first product proposition.
- [x] AC2: The H1 remains semantic, calls to action remain unchanged and desktop/mobile guide checks pass without overflow.

## Validation plan

Run formatting, lint, typecheck, `git diff --check` and the focused guide Playwright check for desktop/mobile, which also captures 768- and 320-pixel layouts.

## Implementation record

Completed 24 September 2026. The opening hero now uses the exact user-selected member/business proposition while preserving the existing eyebrow, summary and calls to action.

### Changes and rationale

Replaced the previous activity-led H1 and supporting sentence with “Flexible for members. Built to grow with fitness businesses.” and the supplied flexible-access/community description. The focused browser test now treats both strings as part of the public presentation contract.

### Affected files

| File or component                         | Change and purpose                                                    |
| ----------------------------------------- | --------------------------------------------------------------------- |
| `src/features/discovery/how-it-works.tsx` | Replaced the H1 and supporting paragraph with the selected copy.      |
| `tests/browser/discovery.spec.ts`         | Asserted the exact visible headline and supporting proposition.       |

### Decisions and deviations

No deviations. The supplied capitalization, punctuation and em dash are preserved.

### Contracts, configuration, and operations

No contract, schema, API, dependency, environment or operational change.

## Validation results

- `npm run format:check`, `npm run lint` and `npm run typecheck` — passed.
- `npx --no-install next build --webpack` — optimized production build passed, including TypeScript and 13-page generation.
- `npx --no-install playwright test tests/browser/discovery.spec.ts --grep "public guide" --project=desktop --project=mobile` — passed 2/2.
- Desktop 1440×1040, mobile 393×852, tablet 768×1024 and narrow 320×800 full-page captures were inspected; the hero wraps cleanly and the existing overflow assertions pass.
- `git diff --check` and repository-local Markdown link validation — passed after archival and index/coordination updates.

## Risks, limitations, and follow-ups

Memberships and transfer remain planned; downstream guide status copy preserves that boundary.

## Completion and review references

- Completed: 2026-09-24 — exact hero proposition delivered and responsively verified.
- Commit: Included in `[DEV0060] [DEV0061] [DEV0062] Complete access-focused interface pivot`.
- Review: Implementation self-review and responsive screenshot inspection; no independent review.
- Deployment or release: None.
