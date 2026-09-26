# Ticket DEV0075: Preview membership selection

- Status: Blocked
- Created: 2026-09-25
- Last updated: 2026-09-26
- Milestone: M2 frontend membership setup preview
- Coordination: [COR0007 — Core multi-gym membership MVP](../organisatory/COR0007-core-multigym-membership-mvp.md)
- Related records: depends on discovery contracts from [DEV0074](DEV0074-preview-multigym-discovery.md) and public terminology from completed [DEV0073](../../archive/frontend/DEV0073-rewrite-multigym-public-story.md); future membership activation/payment work is a not-yet-created COR0007 peer

## Objective and context

Create an honest frontend-only membership setup and My Membership preview so the four-gym choice and Basic/Classic rules can be evaluated before database and Devnet implementation. The flow ends at a clearly non-activating review/Coming Soon state and never fabricates paid membership ownership.

## Scope and non-goals

- In scope: select Basic or Classic; select exactly four distinct eligible gyms; selection progress and validation; plan/gym review summary; explicit demo price/daily-rule/non-core explanation; editable browser-local draft selection; My Access relabelled/presented as My Membership with a draft or empty state; reset/recovery behavior; activation handoff to Coming Soon/waitlist; responsive/keyboard behavior and focused tests.
- Out of scope: real membership period, payment/wallet prompt, entitlement, balance, check-in, reservation, allocation, gym operations, database/API storage, authentication requirement changes, automatic renewal, cancellation/refund and deployment.

## Expected behavior and edge cases

A visitor can compare plans and start a preview selection. The interface permits exactly four unique gyms that are eligible for the chosen plan, shows `0/4` through `4/4`, disables review until valid, and supports removing/replacing a choice. Switching plans revalidates the selection and removes or clearly identifies now-ineligible gyms rather than keeping an invalid hidden state.

The review shows plan name, €80 or €150 monthly demo price, ten or unlimited allowance, one included check-in per day, four gym names and the separate illustrative €15 non-core visit. The final action does not create an active membership or ask for a transaction; it routes to Coming Soon/waitlist with explicit language.

My Membership distinguishes `Draft selection` from `Active membership`. It never shows remaining check-ins, payment confirmation or ownership unless a later backend ticket supplies verified state. Browser-local drafts are namespaced/versioned, validated on load and safely reset when corrupt or when fixture eligibility changes.

## Assumptions, decisions, and dependencies

- Completed DEV0073 provides the public terminology and current €15 non-core value; DEV0074 still blocks implementation because it must provide the typed plan/gym read contracts plus fictional fixtures.
- Keeping `/my-access` as the initial route is acceptable for compatibility, but the visible label becomes My Membership. A route rename requires redirects and must be decided before implementation starts.
- Local draft persistence is presentation convenience only and must not reuse financial or entitlement language.
- A later activation ticket replaces the Coming Soon handoff and owns wallet/payment/reconciliation behavior.

## Implementation plan

1. Define a versioned, validated browser-only membership-draft shape over DEV0074's plan/gym identifiers.
2. Build accessible plan choice and exactly-four gym selection with deterministic eligibility/revalidation behavior.
3. Add a review summary and truthful Coming Soon handoff with no transaction or ownership mutation.
4. Replace the My Access empty presentation with My Membership draft/empty states and safe reset/recovery.
5. Validate rules, storage corruption/version changes, keyboard interaction, responsive layouts and the standard frontend suite.

## Acceptance criteria

- [ ] AC1: The preview accepts exactly four distinct active gyms eligible for the selected plan and blocks fewer, more, duplicates and incompatible choices with understandable feedback.
- [ ] AC2: Basic/Classic prices, allowances, daily rule and separate €15 non-core visit are consistent across selection, review and My Membership.
- [ ] AC3: Review/submit creates no membership, payment, entitlement, check-in or allocation; unavailable activation routes honestly to Coming Soon/waitlist.
- [ ] AC4: Local draft load/save/reset handles malformed, stale-version and changed-eligibility state without implying ownership or breaking retained public routes.
- [ ] AC5: Rule/storage tests, content assertions, lint, typecheck, format, build and desktop/mobile keyboard/browser flows pass.

## Validation plan

Test zero-to-four selection, duplicate/fifth/ineligible choices, removal/replacement, plan switching, stale fixture identifiers, corrupt storage, reload and reset. Verify no wallet transaction or protected mutation is invoked and no `Active`/paid/remaining-access state is fabricated. Exercise the full preview at desktop/mobile widths and with keyboard-only interaction. Run `npm test`, `npm run lint`, `npm run typecheck`, `npm run format:check`, `npm run build` and affected `npm run test:e2e` cases.

## Implementation record

Not started — blocked until DEV0073 and DEV0074 provide stable terminology and discovery contracts.

### Changes and rationale

Pending implementation.

### Affected files

Planned: membership-draft domain/preview adapter, setup and My Membership screens, navigation/Coming Soon handoff and focused domain/browser tests. Record exact paths during implementation.

### Decisions and deviations

- 2026-09-25: The frontend-first approach deliberately stops before activation. This tests whether the four-gym concept is understandable without introducing fake financial state.

### Contracts, configuration, and operations

Frontend-only draft contract and versioned browser storage are planned. No database/API/program account, migration, environment variable, transaction or deployment change is authorized.

## Validation results

Not run — implementation has not started.

## Risks, limitations, and follow-ups

Local draft state can look like ownership if labels are careless. Keep `Draft` and `Preview` visible, and ensure future backend integration replaces rather than merges the local record into authoritative membership state without explicit activation.

## Completion and review references

- Completed: Not completed.
- Commit: Not created.
- Review: Planning self-review only; no independent implementation review.
- Deployment or release: None.
