# Ticket DEV0053: Distinct personal and club guide

- Status: Completed
- Created: 2026-09-23
- Last updated: 2026-09-23
- Milestone: M0 public guidance and product positioning
- Coordination: None — independent development ticket
- Related records: refines the guide delivered by [DEV0020 — Discovery improvements and How it works](../../archive/frontend/DEV0020-discovery-and-how-it-works.md) and the club proposition delivered by [DEV0051 — Club value proposition and sign-in entry](../../archive/frontend/DEV0051-club-value-proposition-and-sign-in-entry.md); preserves the account-backed personal identity boundary from [DEV0052 — Account-backed personal profile](../../archive/frontend/DEV0052-account-backed-personal-profile.md)

## Objective and context

Make `/how-it-works` present MovX Club as two clear, related product experiences: a personal social layer for people who discover, participate, create and share progress, and a business-facing community channel for fitness and sports clubs. This refines the MVP specification's [Discovery and How it works](../../../docs/mvp-spec.md#discovery-and-how-it-works) contract without changing the delivered authentication, club-authority or data boundaries.

The completed guide currently explains the participant journey first and then gives clubs a strongly framed standalone section. Because the participant content has no matching audience container or explicit social-layer label, the information hierarchy reads as generic instructions followed by the only deliberate product proposition. Both audiences need equal, immediately recognizable entry points while remaining visible on one accessible page.

## Scope and non-goals

- In scope: introduce visible **For people** and **For fitness and sports clubs** audience links; wrap the existing participant journey and activity choices in a distinctive `#for-people` social-layer section; retain and visually balance the existing `#for-clubs` section; add a concise bridge explaining how club activities and personal participation form one community loop; give each audience a relevant primary action; keep preview, browser-only, prepared and planned capability labels honest; verify responsive, hash-link and keyboard behavior.
- Out of scope: tabs or audience personalization that hides either section; separate marketing routes; changes to discovery filters, authentication, profiles, club eligibility, wallet authority, payments, persistent data or mobile navigation; new product promises; rewriting detailed challenge, cancellation or wallet rules beyond copy needed for the two-audience hierarchy.

## Expected behavior and edge cases

The guide hero introduces both audiences and provides ordinary anchor links to `#for-people` and `#for-clubs`. Both sections remain in document order and available to search engines, assistive technology and users without client-side state. Direct navigation to either fragment lands at a visible section heading without being obscured by the shell.

The personal section is explicitly labelled **For people · The social layer** and explains how people discover activities, choose a way to participate, create with their community and eventually share verified progress. Current public browsing and browser-local drafts are distinguished from planned bookings, payments and shared activity. Its primary action leads to public Explore; account creation remains available through the existing global sign-in control and is not required to understand the guide.

The club section retains the completed DEV0051 contract: reach participants, shape experiences, strengthen participation and keep club authority separate. Its primary action remains **Manage a club**. The connecting explanation shows that clubs create reasons to participate and people turn that participation into community, without claiming live publishing, attendance, social activity or funds.

At mobile widths the audience links, section cards, bridge and actions stack without horizontal overflow or being covered by fixed navigation. Keyboard focus order follows hero links, personal actions, club actions and shared FAQ in document order. Existing public links and detailed policy copy continue to work.

## Assumptions, decisions, and dependencies

The user confirmed on 2026-09-23 that `/how-it-works` should have clearly distinctive personal/social and business/club sections. Public labels use **For people** and **For fitness and sports clubs** rather than technical terms such as consumer/business mode. **The social layer** is supporting copy for the personal audience, not a new authorization or data contract.

Both sections stay on the same page and use anchor links rather than tabs. This makes the distinction visible without hiding context, adding client state or creating a false choice between participating personally and administering a club. The existing club section and `/clubs/sign-in` route are delivered dependencies; DEV0041's pending real-Phantom rehearsal and DEV0047 do not block this presentation-only refinement.

The ticket is one small frontend slice and does not require coordination or further splitting. It owns the guide hierarchy, copy, styling and focused browser coverage only.

## Implementation plan

1. Add a two-card audience navigator beneath the guide hero with keyboard-accessible links to `#for-people` and `#for-clubs`.
2. Introduce a visually bounded personal/social section around the existing three-step journey and participation choices, adding honest capability labels and a public Explore action.
3. Add a compact community-loop bridge between the personal and club sections, then align section headings and visual weight while retaining DEV0051's club content and action.
4. Update responsive styles and focused browser assertions/screenshots for both fragments, audience copy, keyboard order and mobile overflow. Run unit, lint, type, format, production-build and affected browser checks.

## Acceptance criteria

- [x] AC1: `/how-it-works` visibly introduces two equal audience paths, **For people** and **For fitness and sports clubs**, with working `#for-people` and `#for-clubs` links.
- [x] AC2: The personal section is explicitly presented as the social layer and covers discovery, participation, community creation and verified social progress without presenting planned behavior as live.
- [x] AC3: The club section remains distinct and retains DEV0051's reach, experience, participation and separate-authority proposition plus the **Manage a club** action.
- [x] AC4: A concise connecting element explains how personal and club use form one community loop without adding a data, payment, attendance or authorization claim.
- [x] AC5: Both sections remain simultaneously visible, semantically ordered, keyboard accessible and responsive without horizontal overflow at desktop and 393-pixel mobile widths.
- [x] AC6: Focused browser checks, lint, typecheck, formatting and a production build pass with exact evidence recorded.

## Validation plan

Open `/how-it-works` at desktop and 393-pixel widths. Use the keyboard to activate each audience link and confirm the URL fragment and visible destination heading. Verify the personal section contains the four social-layer concepts and honest current/planned labels, the club section keeps its four benefits and club-management link, and the connecting copy does not claim live persistence or financial behavior. Confirm both sections exist in the document at the same time, existing activity links still work and the page has no horizontal overflow or browser errors.

Run the focused How-it-works and club Playwright scenarios in configured and configuration-free builds, visually inspect full-page screenshots, then run `npm test`, `npm run typecheck`, `npm run lint`, `npm run format:check`, `git diff --check` and the established webpack production build. Database, Auth and wallet rehearsals are not applicable because this ticket changes no related contracts or flows.

## Implementation record

The completed guide now introduces people and clubs as equal audience paths before presenting either journey. Both paths remain visible on one document and use ordinary fragment navigation, so the new hierarchy adds no client state and preserves direct access to all public guidance. The personal path is explicitly framed as the social layer, while the existing club proposition keeps its distinct business purpose and authority boundary.

### Changes and rationale

Added two audience cards beneath the hero, linking to `#for-people` and `#for-clubs`. The new lavender personal section organizes four stages—discovery, choosing participation, community creation and verified social progress—alongside the existing activity types and public actions. Each stage has a delivery-state badge that distinguishes the available public preview and browser-local draft from planned access and shared data.

Added a dark community-loop bridge that connects club-created activities, personal discovery/participation and the planned use of verified activity as shared progress. The existing green club section remains intact with its four benefits, Devnet/payment caveat and **Manage a club** action. Responsive styles stack audience cards, steps, activity types, the bridge and club cards without horizontal overflow.

The product specification now records the two-audience guide as the current contract. Focused browser coverage activates both audience links by keyboard, verifies their URL fragments and section headings, checks personal delivery-state labels, retains the club assertions and captures the full page at desktop and mobile widths.

### Affected files

| File or component                         | Change and purpose                                                                                                                                                    |
| ----------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `src/features/discovery/how-it-works.tsx` | Adds the audience navigator, explicit personal/social section, honest four-stage journey, connecting community loop and balanced personal/club actions.               |
| `src/app/globals.css`                     | Gives the two audiences distinct but related visual treatments and responsive layouts for the cards, personal section, bridge and existing club section.              |
| `tests/browser/discovery.spec.ts`         | Verifies keyboard activation, fragments, section visibility, personal stages, capability labels, connecting copy and existing public activity links in both projects. |
| `docs/mvp-spec.md`                        | Records the two simultaneously visible guide paths and the capability claims each path may make.                                                                      |
| `tickets/README.md` and this ticket       | Track the work through implementation, validation and completion.                                                                                                     |

### Decisions and deviations

The implementation follows the reviewed one-page anchor approach. Four personal stages replace the former generic three-step introduction because verified social progress needs its own planned-state explanation rather than being implied by discovery or browser-local creation. No separate route, tab state or personalized audience mode was introduced.

### Contracts, configuration, and operations

No API, database, authentication, wallet, dependency, environment or operational contract changed. The public page adds stable `#for-people` and retains `#for-clubs` fragment navigation. No setup or migration is required.

## Validation results

| Criterion | Evidence                                                                                                                                                                                                                                                                                                                                                   | Result |
| --------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------ |
| AC1–AC4   | `npm run test:e2e -- tests/browser/discovery.spec.ts tests/browser/clubs.spec.ts` against the configured production build exercised the audience links, both sections, state labels, bridge, activity links and club entry in desktop and mobile projects: 14/14 passed.                                                                                   | Passed |
| AC5       | The same run covered 1440×1040 and 393×852 projects; its narrow-screen scenario also checked `/how-it-works` at 320×780 for horizontal overflow and page errors. Full-page `how-it-works.png` screenshots from both projects were visually inspected: the audience cards and personal, bridge and club sections stack without clipped content.             | Passed |
| AC6       | `npm test` (49/49), `npm run typecheck`, `npm run lint`, `npm run format:check`, `git diff --check` and `npx --no-install next build --webpack` passed. The configuration-free webpack build and the same 14 browser scenarios also passed with database, public Supabase and site URL variables empty; a configured webpack build was restored afterward. | Passed |

The first focused browser run passed 12/14 scenarios and exposed a case-sensitive test mismatch against the intentionally uppercase **FOR PEOPLE** eyebrow. Updating the assertion to the rendered label resolved it; the focused guide rerun passed 2/2 and both final 14-scenario runs passed. An initial configuration-free browser start was denied local port binding by the sandbox; rerunning the unchanged command with approved local test-server access passed all scenarios.

The final repository validator passed 72 Markdown files, 842 local links and 50 unique DEV/COR work records after the completed ticket moved to the archive. Database, Auth and wallet rehearsals were not run because this ticket changes no related contract or flow.

## Risks, limitations, and follow-ups

Shared activity, persistent creation, booking and payment remain planned dependencies and are labelled as such in the guide. The page is intentionally longer on mobile because both audiences remain available in document order; the audience cards provide direct navigation without hiding either section. No follow-up ticket is required for this completed presentation slice.

## Completion and review references

- Completed: 2026-09-23.
- Commit: This implementation commit — `[DEV0053] Distinguish personal and club guide paths`.
- Review: Requirements and final changes were reviewed against DEV0020, DEV0051, the current specification and all acceptance criteria; no independent implementation review.
- Deployment or release: None.
