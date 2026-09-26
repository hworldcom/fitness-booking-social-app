# Ticket DEV0073: Rewrite the multi-gym public story

- Status: Ready
- Created: 2026-09-25
- Last updated: 2026-09-25
- Milestone: M0 truthful positioning and guide
- Coordination: [COR0007 — Core multi-gym membership MVP](../organisatory/COR0007-core-multigym-membership-mvp.md)
- Related records: depends on completed [DEV0072](../../archive/frontend/DEV0072-remove-legacy-product-ui.md); uses the contract adopted by [DEV0069](../../archive/organisatory/DEV0069-adopt-core-multigym-membership-mvp.md) and amended by [DEV0070](../../archive/organisatory/DEV0070-revise-multigym-plan-pricing.md); discovery follows in [DEV0074](DEV0074-preview-multigym-discovery.md)

## Objective and context

Rewrite Home, metadata and How it works so a hackathon judge, potential member or gym understands the focused product without prior explanation: choose four participating gyms, select Basic or Classic, use included check-ins, optionally pay the member price at another participating gym, and see transparent usage-based provisional gym allocation.

The public story must lead with user value and gym value. Solana/Devnet appears as supporting infrastructure only after the product loop makes sense.

## Scope and non-goals

- In scope: Home proposition and calls to action; document metadata; complete responsive How it works journey; Basic €80/ten and Classic €150/unlimited plan explanation; one included check-in per day; four-core-gym selection; illustrative €8 non-core visit; member and gym benefits; provisional-not-final allocation; minimal social explanation; honest demo/coming-soon states; accessible responsive content and focused tests.
- Out of scope: Explore catalogue implementation, selection mechanics, membership activation, wallet transactions, real balances, check-in controls, gym dashboard, database work, final payout promises, real partner claims and deployment.

## Expected behavior and edge cases

The opening copy names one product and two plans. “Unlimited” is always paired with the one-included-check-in-per-day rule. Four gyms is explained as the member's selected core set for a period, not access to only four gyms in the whole network. The €8 visit is clearly available only to an active member at an eligible participating non-core gym and remains illustrative.

The gym explanation distinguishes provisional allocation from claimable payout and avoids asserting final economics. Public calls to action route to Explore or Coming Soon; they never imply that clicking activates or pays for a membership. Social copy mentions only follows and explicitly shared verified check-ins.

## Assumptions, decisions, and dependencies

- Completed DEV0072 removed contradictory legacy copy and CSS first, avoiding overlapping deletion/redesign changes in the same files.
- Exact production prices and allocation economics remain hypotheses even though €80/€150/€8 are the current demo values.
- Reuse the established visual language where it supports clarity, but do not preserve transfer-card composition merely for historical consistency.
- No new image asset is required unless implementation review shows the product cannot be explained accessibly with interface-native visuals.

## Implementation plan

1. Define the Home and guide information hierarchy against C18/C20–C27 and the public journey in the specification.
2. Rebuild Home/metadata around one multi-gym membership and direct calls to Explore/How it works.
3. Rebuild How it works around plan choice, four gyms, check-in use, non-core visit, provisional gym allocation and optional sharing.
4. Add honest demo labels, member/gym benefit sections, responsive layout and keyboard/semantic structure.
5. Update copy assertions and desktop/mobile browser tests; run the standard frontend validation suite.

## Acceptance criteria

- [ ] AC1: A first-time reader can identify the product, two plans, prices, allowances, daily rule and four-gym selection from the first public sections.
- [ ] AC2: The guide explains included core-gym visits, the separate €8 non-core member visit and provisional gym allocation without presenting unavailable actions or final payouts.
- [ ] AC3: Member freedom, gym discovery/revenue transparency and minimal verified-participation social are explicit; transfers, passes, events, sponsorships, challenges and reactions are absent.
- [ ] AC4: Solana/Devnet appears as supporting payment/integrity infrastructure after the product explanation, with no production/legal/partner claim.
- [ ] AC5: Home and guide pass content assertions, semantic/keyboard review, responsive desktop/mobile browser checks, lint, typecheck, format and build.

## Validation plan

Add focused content assertions for all price/allowance/core-gym/non-core/provisional terms and absence of removed-product language. Exercise navigation and reading order at representative desktop/mobile widths and with keyboard-only interaction. Run `npm test`, `npm run lint`, `npm run typecheck`, `npm run format:check`, `npm run build` and affected `npm run test:e2e` cases.

## Implementation record

Not started — ready after DEV0072 established the truthful baseline and removed overlapping legacy guide code.

### Changes and rationale

Pending implementation.

### Affected files

Planned: Home/metadata, How it works screen/styles, shared public calls to action and focused domain/browser tests. Record exact paths during implementation.

### Decisions and deviations

- 2026-09-25: Public storytelling is separated from mechanical legacy deletion so each change has a clear before/after review boundary.

### Contracts, configuration, and operations

Presentation contract only. No database, API, wallet transaction, environment variable, migration or deployment change is planned.

## Validation results

Not run — implementation has not started.

## Risks, limitations, and follow-ups

A polished concept can be mistaken for delivered functionality. Every unavailable action needs a truthful Coming Soon/waitlist destination until later COR0007 tickets implement it.

## Completion and review references

- Completed: Not completed.
- Commit: Not created.
- Review: Planning self-review only; no independent implementation review.
- Deployment or release: None.
