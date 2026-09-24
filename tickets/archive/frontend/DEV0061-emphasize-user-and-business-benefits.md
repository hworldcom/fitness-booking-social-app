# Ticket DEV0061: Emphasize user and business benefits

- Status: Completed
- Created: 2026-09-24
- Last updated: 2026-09-24
- Milestone: MVP product pivot and public presentation
- Coordination: [COR0005 — Fitness-access product pivot](../organisatory/COR0005-fitness-access-product-pivot.md)
- Related records: follows completed [DEV0058 — Adopt the fitness-access MVP contract](../organisatory/DEV0058-fitness-access-mvp-contract.md) and [DEV0059 — Rewrite public positioning and How it works](DEV0059-rewrite-public-positioning-and-guide.md); coordinates final destinations with completed [DEV0060 — Replace challenge surfaces with access navigation](DEV0060-replace-challenge-surfaces-with-access-navigation.md)

## Objective and context

Make the public value proposition more explicit about why MovX Club matters to each audience. People should quickly understand that eligible memberships can move with them rather than becoming stranded and that participation can connect them to a real fitness community. Fitness businesses should understand the intended commercial advantage: minimal, predictable platform fees with no MovX per-transaction surcharge or hidden cost.

The completed DEV0059 guide explains product categories and mechanics clearly but remains more descriptive than benefit-led. This refinement should strengthen the audience sections without returning to abstract social language or implying that planned membership/payment functionality is already live.

## Scope and non-goals

- In scope: strengthen `/how-it-works` hero/audience/people/business copy and supporting visual emphasis; add a concise benefit comparison; align metadata or public shell copy only where needed; update the MVP specification with the confirmed fee-transparency boundary; update focused browser assertions and responsive evidence.
- Out of scope: implementing transfers, community feeds, pricing, payments, fee collection or fee sponsorship; deciding membership transfer eligibility/fees beyond the existing contract; claiming zero Solana network cost; changing challenge routes or navigation owned by DEV0060.

## Expected behavior and edge cases

The first audience choices and relevant sections name concrete outcomes rather than only product formats. For people, the guide explains that a transferable membership can pass its remaining eligible access to another person under business-defined terms and that community means connection around real participation, not reactions or a generic social feed. For businesses, the guide explains minimal, transparent platform pricing, no MovX per-transaction surcharge and no hidden charges.

“No transaction costs” must be precise: MovX may promise not to add a per-transaction platform surcharge, but Solana network/account costs still exist and must be disclosed before approval unless a future fee-sponsorship policy explicitly covers them. The public preview must not show a price, fee amount or live savings claim because the actual pricing model and runtime transactions do not exist.

## Assumptions, decisions, and dependencies

The user's requested “no transaction costs and surprises” is implemented as “no MovX per-transaction surcharge and no hidden charges,” not as a technically false claim that blockchain transactions have no network cost. This distinction follows confirmed C13, which assigns network/account costs to test SOL, and the existing requirement to show fee payer and costs before approval.

DEV0058 remains the product contract; this ticket adds one bounded commercial-positioning constraint rather than selecting a platform-fee amount. DEV0059 remains the visual/narrative baseline. DEV0060 may reuse this benefit language but owns no part of this refinement.

## Implementation plan

1. Add the transparent-fee positioning and network-cost boundary to the confirmed decision register and public-copy guidance.
2. Refine the guide's audience labels and people/business sections so transferable access, participation-based community and predictable business costs are prominent and scannable.
3. Add/update focused browser assertions for the benefits and honest fee boundary at desktop/mobile widths.
4. Run formatting, lint, typecheck, unit tests, production build and focused Playwright coverage; inspect updated screenshots and finish the implementation record.

## Acceptance criteria

- [x] AC1: The people path explicitly presents eligible membership transfer and participation-based community as benefits without promising universal transferability or reactions.
- [x] AC2: The business path explicitly presents minimal transparent fees, no MovX per-transaction surcharge and no hidden charges.
- [x] AC3: Copy acknowledges unavoidable network/account costs and never claims all transactions are literally cost-free or already live.
- [x] AC4: Benefits are visually scannable in the audience/section hierarchy at desktop, tablet and narrow mobile widths with keyboard navigation and no overflow regression.
- [x] AC5: The specification, browser assertions and ticket record agree; relevant formatting, lint, type, unit, build and focused browser checks pass or record an environment-specific limitation precisely.

## Validation plan

Update the public-guide browser test to assert the user/business benefit language, transfer limitation and transparent-cost boundary. Re-run the guide and club handoff checks for desktop/mobile, including existing 768- and 320-pixel screenshots and overflow assertions. Run `npm run format:check`, `npm run lint`, `npm run typecheck`, `npm test`, the production build and `git diff --check`. No database or Devnet rehearsal applies because this ticket changes positioning and presentation only.

## Implementation record

Completed 24 September 2026. The guide now states the practical audience benefits before the product mechanics and preserves an explicit boundary between MovX platform pricing and unavoidable network/account costs.

### Changes and rationale

For people, the audience card and main section now lead with keeping eligible membership access useful and connecting through real participation. Two scannable benefit panels explain that only business-marked transferable access can move under clear terms and that community comes from shared sessions and participation rather than popularity mechanics. The membership comparison now includes transfer eligibility among the terms shown up front.

For fitness businesses, the audience card and main section now lead with growth without overhead. The three business benefits are reach, minimal platform fees and no transaction surprises. Copy promises no MovX per-transaction platform surcharge or hidden charge, while explicitly preserving Solana network/account costs, fee-payer disclosure and the non-live status of pricing/payments.

The specification now records the commercial boundary as confirmed C25 and keeps the exact platform price and network fee payer unresolved in P13. This avoids turning a marketing benefit into an invented price or a technically false zero-cost claim.

### Affected files

| File or component                                  | Change and purpose                                                                                                                                     |
| -------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `docs/mvp-spec.md`                                 | Added C25 predictable business costs, P13 unresolved exact pricing/fee payer and the audience-benefit public-copy requirement.                         |
| `src/features/discovery/how-it-works.tsx`          | Strengthened hero/audience copy, added two people-benefit panels, refocused the business cards and added an honest business-cost question.             |
| `src/app/globals.css`                              | Added a responsive two-panel benefit treatment that collapses cleanly to one column on narrow screens.                                                 |
| `src/app/how-it-works/page.tsx`                    | Updated route metadata to mention transferable eligible memberships, community and predictable business costs.                                        |
| `tests/browser/discovery.spec.ts`, `clubs.spec.ts` | Asserted transfer/community benefits, minimal platform fees, no MovX transaction surcharge, network costs, non-live pricing, keyboard use and overflow. |

### Decisions and deviations

- Interpreted “no transaction costs” as no MovX per-transaction surcharge. Literal zero transaction cost was rejected because confirmed C13 requires test SOL for Solana network/account costs.
- Did not publish a fee number or claim realized savings. The exact platform price, fee payer and any future fee sponsorship remain P13/follow-up work.
- Kept the existing DEV0059 layout and inserted one compact benefits row instead of adding another long narrative section.

### Contracts, configuration, and operations

No schema, API, dependency, environment variable or migration changed. Public copy and the product specification now distinguish a MovX platform surcharge from third-party/network/account costs. No pricing or transaction behavior is implemented.

## Validation results

- `npm run format:check` — passed; all configured sources match Prettier.
- `npm run lint` — passed with no ESLint findings.
- `npm run typecheck` — passed after route-type generation.
- `npm test` — passed 52/52 tests on the approved unrestricted rerun. The initial sandboxed attempt could not create the test runner's local IPC socket (`EPERM`).
- `npm run build` — Turbopack again failed before compilation because this execution environment denied its local worker process/port. `npx --no-install next build --webpack` completed the optimized production build, TypeScript, 13-page generation and route tracing successfully.
- `npx --no-install playwright test tests/browser/discovery.spec.ts tests/browser/clubs.spec.ts --grep "public guide|club value proposition" --project=desktop --project=mobile` — passed 4/4 focused checks.
- Full-page screenshots at 1440×1040 and 393×852, plus the existing 768×1024 and 320×800 captures inside the mobile guide check, were inspected. The benefits are prominent, copy wraps cleanly and overflow assertions pass at every width.
- `git diff --check` and repository-local Markdown link validation — passed after ticket archival and coordination/index updates.

| Criterion | Evidence                                                                                                          | Result |
| --------- | ----------------------------------------------------------------------------------------------------------------- | ------ |
| AC1       | People audience/card assertions and visual inspection of transfer/community benefit panels                       | Passed |
| AC2       | Business audience/card assertions for minimal fees, surcharge and hidden-charge copy                             | Passed |
| AC3       | Club section and cost-question assertions for network/account costs and non-live exact pricing                    | Passed |
| AC4       | Keyboard audience anchors, question interaction, four responsive captures and programmatic overflow checks       | Passed |
| AC5       | Specification review; formatting, lint, type, unit, webpack production build and 4 focused browser checks         | Passed |

## Risks, limitations, and follow-ups

The exact platform-fee schedule, who pays each Solana network/account cost and any future fee sponsorship remain unresolved under P13. The current text describes product intent, not live pricing or realized savings. Membership transfer and the community feed also remain planned rather than implemented.

## Completion and review references

- Completed: 2026-09-24 — audience benefits and bounded fee-transparency copy delivered and validated.
- Commit: Included in `[DEV0060] [DEV0061] [DEV0062] Complete access-focused interface pivot`.
- Review: Implementation self-review and responsive screenshot inspection; no independent review.
- Deployment or release: None.
