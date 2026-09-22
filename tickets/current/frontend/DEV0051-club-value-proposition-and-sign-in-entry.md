# Ticket DEV0051: Club value proposition and sign-in entry

- Status: Draft
- Created: 2026-09-22
- Last updated: 2026-09-22
- Milestone: M0 club onboarding and public guidance
- Coordination: None — independent development ticket
- Related records: follows the public guide delivered by [DEV0020 — Discovery and How it works](../../archive/frontend/DEV0020-discovery-and-how-it-works.md); reuses the email account flow from [DEV0046 — Email OTP registration and application profiles](../../archive/backend/DEV0046-email-otp-registration-and-application-profiles.md); depends on [DEV0041 — Club wallet authorization](../backend/DEV0041-club-wallet-authorization.md) for server-derived club eligibility and workspace authority; persistent public organization data remains owned by [DEV0017 — Persistent catalogue and private drafts](../backend/DEV0017-persistent-catalogue-and-drafts.md)

## Objective and context

Explain why fitness and sports clubs should use MovX Club and give their administrators a clear, dedicated sign-in entrance without creating a second authentication system or shared club credentials.

The current `/how-it-works` guide explains the participant experience but does not present a club value proposition. The general `/sign-in` route also does not make it clear how an administrator reaches a club workspace. This ticket adds the public explanation and a club-oriented entrance that reuses the administrator's existing personal email identity and DEV0041's server-derived club authority.

## Scope and non-goals

- In scope: add a **For fitness and sports clubs** section to `/how-it-works`; explain club discovery, classes/events, sponsored challenges, participation/retention and separated club-wallet authority; distinguish currently available previews from planned persistent/payment behavior; add a visible **Manage a club** call to action; add `/clubs/sign-in` as a club-focused presentation of the existing email one-time-passcode flow; preserve a safe club-workspace return intent; after authentication, show only server-authorized club access or an honest no-club-access state; verify responsive and keyboard behavior.
- Out of scope: a second Supabase tenant/user for the same person; shared club email/password credentials; self-service club creation, applications or invitations; administrator management; public profile persistence owned by DEV0017; organization-role or wallet proof owned by DEV0041; club dashboard features; balances, payments or transactions; claiming that preview/planned capabilities are already live.

## Expected behavior and edge cases

Visitors can understand that MovX Club is intended to help clubs reach participants, publish activities, strengthen community participation and later operate transparent test-fund flows through a distinct club wallet. Copy must identify preview or planned capabilities honestly until their owning tickets complete.

`Manage a club` opens `/clubs/sign-in`, which explains that an administrator signs in as an individual and then acts in a club workspace. It reuses the existing email field, one-time code, Supabase session and application profile; it does not create a separate club login identity. Safe return handling preserves only the intended internal club destination.

After successful authentication, the server determines whether the person is an active administrator. A person with one eligible prepared club proceeds to its authorized workspace. A future person with several eligible clubs sees only a server-derived selection. A person with no eligible club remains normally signed in but sees a clear no-access explanation rather than club data, organization existence details or an automatic club-creation claim.

Invalid, expired or replayed codes retain the existing bounded authentication behavior. Refresh, sign-out and direct navigation cannot convert ordinary personal access into club access. Mobile and keyboard users can reach, submit and recover from every state.

## Assumptions, decisions, and dependencies

Confirmed with the user on 2026-09-22:

- fitness and sports clubs need their own public value proposition;
- club administrators should have a distinct club-oriented sign-in interface;
- the interface must use the same personal email identity and authentication system rather than shared club credentials;
- the signed-in person remains accountable while acting through a separate club workspace;
- prepared clubs are sufficient for the MVP; self-service club creation and invitations come later.

The public term is `club`; the backend may retain `organization` for the broader internal entity. DEV0041 must deliver the authoritative club eligibility/workspace result before this ticket can complete. The route may reuse DEV0046's form components and safe-return utilities rather than duplicating Auth logic.

The club value proposition should cover:

- reach new participants through public class, event and challenge discovery;
- publish club activities and community experiences;
- sponsor challenges that support participation and retention;
- connect confirmed attendance with visible community progress;
- later sell class passes/event tickets and operate sponsorships/refunds with a distinct club wallet;
- keep club authority and funds separate from each administrator's personal account and wallet.

## Implementation plan

1. Review the current `/how-it-works`, shared navigation/footer and DEV0046 sign-in components; choose the smallest visible placement for `Manage a club` without restoring header clutter removed by DEV0045.
2. Add the club value-proposition section with direct links to relevant public discovery views and honest current-versus-planned labels.
3. Add `/clubs/sign-in` by reusing the existing email OTP form/session contract and safe internal return handling; do not fork authentication logic or create a club Auth subject.
4. Consume DEV0041's server-derived club eligibility/authority state and render authorized, no-access, loading, expired-session and failure states without exposing another organization.
5. Add focused component/domain checks and desktop/mobile Playwright coverage for public copy, sign-in, keyboard navigation, responsive layout, safe returns and unauthorized access.

## Acceptance criteria

- [ ] AC1: `/how-it-works` includes a clear **For fitness and sports clubs** section with concrete reasons to join and honest preview/planned labels.
- [ ] AC2: A visible **Manage a club** action opens a dedicated `/clubs/sign-in` interface on desktop and mobile.
- [ ] AC3: Club sign-in reuses the person's existing email OTP identity, Supabase session and application profile; it creates no shared club credentials, second authentication system or duplicate person.
- [ ] AC4: Only a server-authorized active club administrator can enter a club workspace; no-access, stale-session, unsafe-return and browser-submitted club metadata fail without exposing club data or removing ordinary personal access.
- [ ] AC5: The interface explains the personal-versus-club context and never implies that signing in proves wallet authority, funds, payment capability or a completed product feature.
- [ ] AC6: Focused tests, lint, typecheck, formatting, production build and desktop/mobile keyboard/browser checks pass with exact evidence recorded.

## Validation plan

Test the public guide and club sign-in route as a guest, ordinary signed-in person, prepared primary administrator and stale/invalid session. Verify one email identity remains the same when entering and leaving club context. Exercise invalid/replayed OTP recovery, direct route access, unsafe return parameters, refresh, sign-out and server-denied organization IDs. Check the guide, form and all notices at desktop and 393-pixel mobile width with keyboard-only navigation. Run focused unit/boundary tests, lint, typecheck, formatting, webpack build and affected Playwright scenarios.

## Implementation record

Pending implementation. This ticket was created after the user identified that the existing public guide gives fitness and sports clubs no reason to join and confirmed that clubs should receive a dedicated entrance backed by individual administrator login.

### Changes and rationale

Not implemented.

### Affected files

| File or component | Change and purpose                                                                                      |
| ----------------- | ------------------------------------------------------------------------------------------------------- |
| Pending           | Record the public guide, shared entry point, club sign-in route, reused Auth components and tests here. |

### Decisions and deviations

None beyond the confirmed planning decisions above.

### Contracts, configuration, and operations

No new authentication provider or credential type is planned. `/clubs/sign-in` reuses DEV0046's email OTP/session contract and consumes DEV0041's bounded server-derived club access result. No new secret or environment variable is expected. Record the final route/response/component contracts during implementation.

## Validation results

Implementation validation is pending. DEV0041 is Draft, so its club eligibility/authority contract is not available yet.

Planning validation on 2026-09-22 passed the repository-local record/link check across 70 Markdown files, 752 local links and 48 unique indexed records; DEV0052/COR0004 remain the next IDs. Focused Prettier checks and `git diff --check` passed. Application/browser checks were not run because no runtime implementation changed.

| Criterion | Evidence | Result  |
| --------- | -------- | ------- |
| AC1–AC6   | Not run  | Not run |

## Risks, limitations, and follow-ups

Club-oriented copy can overstate the product while payment and persistent-data work remains incomplete. Keep current previews and future capabilities visibly distinct. A dedicated entrance can also be mistaken for a separate club identity; every relevant state must explain that an individual administrator remains signed in and accountable.

Self-service creation, invitations, several administrators, role transfer and club-wallet recovery remain future work. Those capabilities need separate security and lifecycle requirements before implementation.

## Completion and review references

- Completed: Not completed.
- Commit: Not created.
- Review: Requirements discussed with the user; no independent review.
- Deployment or release: None.
