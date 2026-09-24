# Ticket DEV0059: Rewrite public positioning and How it works

- Status: Completed
- Created: 2026-09-24
- Last updated: 2026-09-24
- Milestone: MVP product pivot and public presentation
- Coordination: [COR0005 — Fitness-access product pivot](../organisatory/COR0005-fitness-access-product-pivot.md)
- Related records: depends on completed [DEV0058 — Adopt the fitness-access MVP contract](../organisatory/DEV0058-fitness-access-mvp-contract.md); revises the delivered presentation from [DEV0020](DEV0020-discovery-and-how-it-works.md), [DEV0051](DEV0051-club-value-proposition-and-sign-in-entry.md), and [DEV0053](DEV0053-distinct-personal-and-club-guide.md); integrates with completed [DEV0060](DEV0060-replace-challenge-surfaces-with-access-navigation.md)

## Objective and context

Rewrite and redesign MovX Club's public product description, with particular focus on `/how-it-works`, so a new visitor quickly understands the access-focused product: discover places and experiences, choose a membership/pass/event ticket, participate, and optionally share genuine activity. Explain the value to fitness businesses without leading with wallets, blockchain or internal authority mechanics.

The existing guide is lengthy, challenge-led and fragmented into many cards, status labels, rule explanations and implementation caveats. Its copy uses abstract phrases such as “the social layer” and “your kind of together” before establishing the concrete product. The pivot makes a fresh information hierarchy necessary rather than a word-for-word challenge replacement.

## Scope and non-goals

- In scope: audit current public copy; establish concise headline/supporting proposition; redesign the guide hierarchy and responsive composition; explain memberships, passes, events and sponsored events; provide distinct but connected people/business paths; show a simple access/community loop; retain honest preview/planned status; update calls to action, metadata and relevant public shell/about copy; add focused accessibility, browser and visual regression evidence.
- Out of scope: implementing membership purchase/transfer, passes, tickets, sponsorship settlement or attendance; changing authentication/wallet authority; retaining detailed challenge rules; adding reactions, comments or generic social posting; creating claims about live inventory, partners, funds or deployed programs.

## Expected behavior and edge cases

A visitor should understand within the opening viewport what MovX Club is, who it serves and what they can do. The guide must use plain language before technology: fitness, people, access, then infrastructure. Memberships are ongoing access that may be transferable under business-defined rules; passes are bounded class/visit access; events are dated experiences; sponsored events use sponsor-funded or subsidized attendee access and have no winner.

People and businesses receive equally discoverable paths without duplicating the entire page. Status language distinguishes the current seeded preview from planned persistent/payment/program behavior. Wallet and test-EURC explanations remain available but secondary. Direct anchors, keyboard focus, mobile reading order, reduced-motion behavior and long-copy wrapping must remain usable. All calls to action lead to current safe destinations and never imply a purchase or transfer succeeded.

## Assumptions, decisions, and dependencies

DEV0058 must first freeze the current product terms. Preserve the accepted MovX visual identity, but the guide layout itself may change materially because the current card density and narrative order are part of the reported design problem. Use the existing design system and installed icon set unless a separately justified dependency ticket is created.

Recommended narrative order to validate during implementation:

1. concise proposition;
2. `Discover → Access → Participate → Connect`;
3. membership/pass/event comparison;
4. sponsored access explanation;
5. value for businesses;
6. honest current-preview status and short frequently asked questions.

## Implementation plan

1. Inventory every public proposition and How-it-works claim in the shell, guide, sign-in/club entry, metadata and preview modal; capture desktop/mobile baselines.
2. Draft the new copy against DEV0058, remove internal/project-management language from the primary narrative, and retain implementation caveats in a concise status section.
3. Rebuild the guide hierarchy and responsive layout using semantic headings, links and accessible comparison/step structures; coordinate shared labels/destinations with DEV0060.
4. Update focused unit/browser assertions and inspect desktop, tablet and narrow-mobile screenshots, including keyboard anchors, long labels and status/call-to-action behavior.
5. Run lint, typecheck, formatting, build and affected browser suites; finish the implementation record with before/after rationale and visual evidence.

## Acceptance criteria

- [x] AC1: The first viewport states plainly that MovX Club connects flexible fitness access and community, names the primary audience/value and does not lead with blockchain, wallets or challenge terminology.
- [x] AC2: The guide clearly distinguishes memberships, passes, events and sponsored events, including honest transfer/sponsorship limits and no winner/voting implication.
- [x] AC3: A short participation loop and connected people/business paths replace the current fragmented narrative; no reactions or generic social-network promise appears.
- [x] AC4: Preview-versus-planned labels and calls to action are accurate, concise and safe; unavailable purchase/transfer/sponsorship behavior is not presented as live.
- [x] AC5: Semantic heading order, anchor navigation, keyboard focus, desktop/mobile layouts, long-copy wrapping and relevant error/preview states pass automated and visual review with no unrelated redesign.
- [x] AC6: Relevant tests, lint, typecheck, formatting and production build pass; the ticket records exact files, screenshots/observations and any deferred copy questions.

## Validation plan

Add focused browser coverage for public unauthenticated `/how-it-works`, both audience paths, all product explanations, calls to action, keyboard anchors and viewport overflow at desktop, 393-pixel and 320-pixel widths. Inspect screenshots rather than relying only on text assertions. Run `npm test`, `npm run lint`, `npm run typecheck`, `npm run format:check`, `npm run build` and affected `npm run test:e2e` cases. No database or Devnet transaction is required because all financial behavior remains explicitly unavailable in this presentation slice.

## Implementation record

Completed 24 September 2026. The public guide now leads with the concrete access proposition and uses one linear journey before introducing product types, business value or preview caveats.

### Changes and rationale

Replaced the challenge-led, status-chip-heavy guide with an access-first explanation: `Discover → Choose access → Show up → Stay connected`. The opening viewport now names memberships, passes and events in plain language and links directly to the safe public Explore route.

The people path compares memberships, bounded passes and dated events in parallel, then explains sponsored events as subsidized access rather than a competition. The business path focuses on publishing access, welcoming newcomers and sponsoring attendance. One consolidated “What works today—and what comes next” section replaces repeated implementation labels and explicitly states that no access or sponsorship transaction is live.

The shared shell title, description, tagline and preview dialog now use the same fitness-access proposition. Challenge navigation and route retirement deliberately remain in DEV0060 so this ticket does not leave duplicate or half-migrated destinations.

### Affected files

| File or component                                  | Change and purpose                                                                                                                                              |
| -------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `src/features/discovery/how-it-works.tsx`          | Rebuilt the guide narrative, linear journey, access-product comparison, sponsored-event explanation, business path, honest status and concise questions.        |
| `src/app/globals.css`                              | Added the responsive guide hero, journey, comparison, sponsorship, status and breakpoint presentation while retaining the accepted MovX visual identity.        |
| `src/app/layout.tsx` and `src/app/how-it-works/*`  | Replaced challenge/social metadata with the access proposition and added a route-specific description.                                                          |
| `src/components/shell.tsx`                         | Aligned the public sidebar, footer and preview dialog with flexible access while preserving DEV0060-owned challenge navigation until that ticket is implemented. |
| `tests/browser/discovery.spec.ts`                  | Replaced superseded guide assertions with product, anchor, keyboard, safe-destination and responsive overflow checks at 1440, 768, 393 and 320 pixels.           |
| `tests/browser/clubs.spec.ts`                      | Updated the club-entry handoff test to assert the new fitness-business proposition and explicit non-live boundary.                                              |
| `README.md` and `docs/mvp-spec.md`                 | Recorded the delivered guide and distinguished it from the remaining DEV0060 challenge-surface work.                                                           |

### Decisions and deviations

- Kept one people/business audience switch near the top, then used a shared journey rather than duplicating a complete explanation for each audience.
- Kept transfer policy out of the membership card because the business-defined transfer rules remain unresolved; the questions section states only the confirmed boundary that an item must be marked transferable and that the capability is not live.
- Consolidated availability language into one two-column status section. This makes the core explanation easier to scan and prevents each product card from reading like an implementation ticket.
- Reused `/explore` and `/clubs/sign-in` as safe calls to action. No button claims to buy, transfer, sponsor or publish anything.
- DEV0060 retains ownership of the Challenges/Create challenge navigation and the challenge catalogue/forms. They remain visible outside the guide during this intermediate coordinated state.

### Contracts, configuration, and operations

No schema, API, dependency, environment variable or migration changed. Public route availability remains unchanged. The presentation contract changed: the site metadata and public guide now describe memberships, passes, ordinary events and sponsored events as the target product families, while clearly labelling their runtime behavior as planned.

## Validation results

- `npm run format:check` — passed; all configured sources match Prettier.
- `npm run lint` — passed with no ESLint findings.
- `npm run typecheck` — passed after route-type generation.
- `npm test` — passed, 52/52 domain and boundary tests. The first sandboxed attempt could not create the test runner's local IPC socket; the approved unrestricted rerun passed.
- `npm run build` — the Next.js Turbopack process failed before compilation because the execution environment denied a local worker process/port, including on the unrestricted rerun. `npx --no-install next build --webpack` then completed the equivalent optimized production build, TypeScript pass, 13-page generation and route trace successfully. No source/build error remained.
- `npx --no-install playwright test tests/browser/discovery.spec.ts tests/browser/clubs.spec.ts --grep "public guide|club value proposition" --project=desktop --project=mobile` — passed 4/4 focused checks.
- Final responsive guide rerun — passed 2/2 guide checks and captured full-page output at 1440×1040, 768×1024, 393×852 and 320×800. Visual inspection confirmed a clear opening proposition, linear reading order, legible access comparisons, keyboard-opened questions, wrapping and no horizontal overflow.
- `npm run test:e2e` — 42/50 broader legacy checks passed, including every guide/club/discovery check. Six unrelated local mutation checks timed out after configured authentication redirected their protected actions to `/sign-in` on the Playwright origin, as shown in their captured page snapshots; two existing wallet-modal focus checks did not return focus to the expected Phantom link. Those failures do not exercise files or behavior changed by DEV0059 and are not hidden as passing evidence.
- `git diff --check` — passed after the completion record and archive/index updates.
- Repository-local Markdown link validation across root, `docs/` and `tickets/` — passed; every relative link target exists after moving DEV0059 to the frontend archive.

## Risks, limitations, and follow-ups

Memberships, access transfer, live passes/tickets, business inventory, sponsored-event settlement and shared activity remain unimplemented; the guide labels them planned and demonstration-only. DEV0060 still owns removal/replacement of primary challenge routes, fixtures, forms and navigation. Until it completes, the shared shell has access-focused framing beside legacy challenge destinations.

No unresolved copy question blocks this guide. Exact transfer fees/eligibility, sponsorship settlement, cancellation and production partner claims remain intentionally absent until later contract tickets decide them.

## Completion and review references

- Completed: 2026-09-24.
- Commit: Not created.
- Review: Implementation self-review against AC1–AC6 plus desktop/tablet/mobile screenshot inspection; no independent review.
- Deployment or release: None.
