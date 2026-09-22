# Ticket DEV0051: Club value proposition and sign-in entry

- Status: Ready
- Created: 2026-09-22
- Last updated: 2026-09-22
- Milestone: M0 club onboarding and public guidance
- Coordination: None — independent development ticket
- Related records: follows the public guide delivered by [DEV0020 — Discovery and How it works](../../archive/frontend/DEV0020-discovery-and-how-it-works.md) and the account-backed shell/profile delivered by [DEV0052 — Account-backed personal profile](../../archive/frontend/DEV0052-account-backed-personal-profile.md); reuses the email account flow from [DEV0046 — Email OTP registration and application profiles](../../archive/backend/DEV0046-email-otp-registration-and-application-profiles.md); consumes the functionally implemented singular club eligibility/authority contract from [DEV0041 — Club wallet authorization](../backend/DEV0041-club-wallet-authorization.md), whose separate real-Phantom completion rehearsal remains pending; persistent public organization data remains owned by [DEV0017 — Persistent catalogue and private drafts](../backend/DEV0017-persistent-catalogue-and-drafts.md)

## Objective and context

Explain why fitness and sports clubs should use MovX Club and give their administrators a clear, dedicated sign-in entrance without creating a second authentication system or shared club credentials. This delivers the club-facing part of the MVP specification's [Discovery and How it works](../../../docs/mvp-spec.md#discovery-and-how-it-works) and [club sign-in screen](../../../docs/mvp-spec.md#2-screens-and-actions) contracts within [M0 — Foundation and frozen product contracts](../../../docs/mvp-spec.md#m0--foundation-and-frozen-product-contracts).

The current `/how-it-works` guide explains the participant experience but does not present a club value proposition. The general `/sign-in` route also does not make it clear how an administrator reaches a club workspace. This ticket adds the public explanation and a club-oriented entrance that reuses the administrator's existing personal email identity and DEV0041's server-derived club authority.

## Scope and non-goals

- In scope: add a **For fitness and sports clubs** section to `/how-it-works`; explain club discovery, classes/events, sponsored challenges, participation/retention and separated club-wallet authority; distinguish currently available previews from planned persistent/payment behavior; add a visible **Manage a club** call to action; add `/clubs/sign-in` as the dedicated club explanation and bounded access-status page; send signed-out visitors to the existing canonical `/sign-in?returnTo=%2Fclubs%2Fsign-in` flow; after authentication, consume DEV0041's server-derived club state and show only the eligible prepared club, authorized club-wallet state or an honest no-access/error state; verify responsive and keyboard behavior.
- Out of scope: rendering or forking a second email one-time-passcode form on `/clubs/sign-in`; a second Supabase tenant/user for the same person; shared club email/password credentials; self-service club creation, applications or invitations; administrator management; multi-club selection; public profile persistence owned by DEV0017; organization-role or wallet proof owned by DEV0041; a separate club dashboard or other workspace features; balances, payments or transactions; claiming that preview/planned capabilities are already live.

## Expected behavior and edge cases

Visitors can understand that MovX Club is intended to help clubs reach participants, publish activities, strengthen community participation and later operate transparent test-fund flows through a distinct club wallet. Copy must identify preview or planned capabilities honestly until their owning tickets complete.

`Manage a club` opens `/clubs/sign-in`, which explains that an administrator signs in as an individual and then acts in a club context. The route does not host another email form. When signed out, its **Sign in with email** action opens the existing canonical `/sign-in` route with the fixed safe return `/clubs/sign-in`. The existing email field, one-time code, Supabase session and application profile remain the only authentication path; no separate club login identity is created.

After successful authentication, `/clubs/sign-in` becomes the bounded club access page. The server determines whether the person is the active primary administrator of one prepared club. An eligible administrator sees only that server-returned club and can use DEV0041's existing club-wallet authority controls. An administrator with active authority remains on the same page and sees the club identity, authority expiry and explicit leave/disconnect controls. This ticket does not redirect to or imply a separate dashboard.

A person with no eligible club remains normally signed in but sees a clear no-access explanation rather than club data, organization existence details or an automatic club-creation claim. If inconsistent prepared data would yield several club contexts, the current singular DEV0041 contract fails closed and the page shows an unavailable/conflict state without listing clubs. Multi-club selection requires a later contract and ticket.

The page maps DEV0041's snapshot states explicitly:

- `preview`: explain that authenticated club management is not configured; do not invent club access;
- `signed-out`: explain the personal-account boundary and link to `/sign-in?returnTo=%2Fclubs%2Fsign-in`;
- `forbidden`: explain that the application profile could not be authorized without disclosing club data;
- `unavailable`: show a retryable failure without assuming or exposing club access;
- `no-club-access`: retain the personal session and explain that the account has no prepared club access;
- `eligible`: show only the server-returned prepared club and explain that a separate readable wallet proof is still required;
- `authorized`: show the server-returned club, bounded authority expiry and exit controls without implying payment authority or available funds.

Invalid, expired or replayed codes retain DEV0046's existing bounded authentication behavior on `/sign-in`; DEV0051 does not reimplement it. Refresh, sign-out and direct navigation cannot convert ordinary personal access into club access. `/clubs/sign-in` does not accept a browser-supplied club, organization, role or arbitrary post-authentication destination. Mobile and keyboard users can reach and recover from every state.

## Assumptions, decisions, and dependencies

Confirmed with the user on 2026-09-22:

- fitness and sports clubs need their own public value proposition;
- club administrators should have a distinct club-oriented sign-in interface;
- the interface must use the same personal email identity and authentication system rather than shared club credentials;
- the signed-in person remains accountable while acting through a separate club workspace;
- prepared clubs are sufficient for the MVP; self-service club creation and invitations come later.

The public term is `club`; the backend may retain `organization` for the broader internal entity. DEV0041 has delivered the authoritative singular club eligibility/authority contract and remains in progress only for its separately owned real-Phantom rehearsal. That deferred rehearsal does not block DEV0051 from consuming the implemented snapshot contract or validating its presentation. DEV0051 does not own or duplicate DEV0041's proof validation.

DEV0052 is completed and committed, so DEV0051 starts from the account-backed shell/profile rather than overlapping that work. The club route delegates authentication to DEV0046's existing canonical `/sign-in` screen and uses its safe-return utility with the fixed `/clubs/sign-in` destination. It must not broaden the set of canonical authentication paths.

The club value proposition should cover:

- reach new participants through public class, event and challenge discovery;
- publish club activities and community experiences;
- sponsor challenges that support participation and retention;
- connect confirmed attendance with visible community progress;
- later sell class passes/event tickets and operate sponsorships/refunds with a distinct club wallet;
- keep club authority and funds separate from each administrator's personal account and wallet.

## Implementation plan

1. Review the account-backed `/how-it-works`, shared navigation/footer and account presentation; place `Manage a club` visibly in the new club section without restoring header clutter removed by DEV0045.
2. Add the club value-proposition section with direct links to relevant public discovery views and honest current-versus-planned labels.
3. Add `/clubs/sign-in` as the club explanation and access-status page. For signed-out visitors, link to the canonical `/sign-in` flow with the fixed `/clubs/sign-in` return; do not embed or fork the OTP form and do not create a club Auth subject.
4. Consume DEV0041's exact `preview`, `signed-out`, `forbidden`, `unavailable`, `no-club-access`, `eligible` and `authorized` states. Reuse the existing club-wallet authority controls for eligible/authorized administrators and fail closed for inconsistent singular-club data.
5. Add focused component/contract checks and desktop/mobile Playwright coverage for public copy, the canonical sign-in handoff/return, keyboard navigation, responsive layout, state presentation and unauthorized access. Run the existing Auth and club-wallet suites as regression evidence rather than duplicating their internal OTP/proof cases.

## Acceptance criteria

- [ ] AC1: `/how-it-works` includes a clear **For fitness and sports clubs** section with concrete reasons to join and honest preview/planned labels.
- [ ] AC2: A visible **Manage a club** action opens a dedicated `/clubs/sign-in` interface on desktop and mobile.
- [ ] AC3: `/clubs/sign-in` delegates authentication to the canonical `/sign-in?returnTo=%2Fclubs%2Fsign-in` flow and reuses the person's existing email OTP identity, Supabase session and application profile; it embeds no second OTP form and creates no shared club credentials, second authentication system or duplicate person.
- [ ] AC4: Only a server-authorized active primary administrator receives the singular prepared-club context. Preview, signed-out, forbidden, unavailable, no-access and inconsistent/multiple-context cases fail closed without exposing club data or removing ordinary personal access; the browser cannot submit club, organization, role or destination authority metadata.
- [ ] AC5: Eligible and authorized states explain the personal-versus-club context, wallet-proof requirement, bounded authority and exit controls. The interface never implies that email sign-in proves wallet authority, grants funds/payment capability or opens a completed dashboard/product feature.
- [ ] AC6: Focused tests, lint, typecheck, formatting, production build and desktop/mobile keyboard/browser checks pass with exact evidence recorded.

## Validation plan

Test the public guide and club sign-in route as a guest, ordinary enrolled person, prepared primary administrator and stale/unavailable session. Verify the guest action opens the canonical sign-in URL with exactly `/clubs/sign-in` as its safe return, successful enrollment returns to the club page and the same personal identity remains active when entering or leaving club context. Exercise direct route access, refresh, sign-out, no-access and every DEV0041 snapshot state; confirm the route sends no organization, club, role or arbitrary return destination to the server. Reuse DEV0046's existing invalid/replayed OTP tests and DEV0041's proof/authority suites as regression evidence rather than recreating those implementations here. Check the guide, access page and all notices at desktop and 393-pixel mobile width with keyboard-only navigation. Run focused unit/boundary tests, lint, typecheck, formatting, webpack build and affected Playwright scenarios.

## Implementation record

Pending implementation. This ticket was created after the user identified that the existing public guide gives fitness and sports clubs no reason to join and confirmed that clubs should receive a dedicated entrance backed by individual administrator login. A pre-implementation review on 2026-09-22 fixed the entrance to the existing canonical sign-in route, defined `/clubs/sign-in` as the bounded club access page, aligned it with DEV0041's singular snapshot contract and deferred multi-club selection.

### Changes and rationale

Not implemented.

### Affected files

| File or component | Change and purpose                                                                                      |
| ----------------- | ------------------------------------------------------------------------------------------------------- |
| Pending           | Record the public guide, shared entry point, club sign-in route, reused Auth components and tests here. |

### Decisions and deviations

The original wording could be read as embedding the OTP form directly on `/clubs/sign-in` and redirecting to an unspecified workspace. The reviewed plan instead keeps `/sign-in` as the only canonical authentication route and returns to `/clubs/sign-in`, which owns the club explanation, eligibility and bounded authority presentation. This avoids duplicating Auth logic and avoids implying that a club dashboard exists.

The original future multi-club selection wording was removed from this implementation. DEV0041 currently exposes one singular prepared-club context and fails closed when prepared state is inconsistent; multi-club selection needs a later server contract and development ticket.

### Contracts, configuration, and operations

No new authentication provider or credential type is planned. `/clubs/sign-in` links to `/sign-in?returnTo=%2Fclubs%2Fsign-in`; the existing `/sign-in` route remains the only place that requests and verifies an email OTP. The club page consumes DEV0041's existing bounded `ClubWalletSnapshot` and submits no organization/club selector. No new secret, environment variable, database change or API shape is expected. Record the final component boundaries during implementation.

## Validation results

Implementation validation is pending. DEV0041 is functionally implemented and its club eligibility/authority contract is available; it remains `In progress` only for the separately owned real-Phantom rehearsal. DEV0051 may use the delivered contract but cannot claim that rehearsal as its evidence.

Planning validation on 2026-09-22 passed the repository-local record/link check across 70 Markdown files, 752 local links and 48 unique indexed records; DEV0052/COR0004 were the next IDs in that snapshot. DEV0052 was subsequently allocated to the independent account-backed personal-profile cleanup. Focused Prettier checks and `git diff --check` passed. Application/browser checks were not run because no runtime implementation changed.

| Criterion | Evidence | Result  |
| --------- | -------- | ------- |
| AC1–AC6   | Not run  | Not run |

## Risks, limitations, and follow-ups

Club-oriented copy can overstate the product while payment and persistent-data work remains incomplete. Keep current previews and future capabilities visibly distinct. A dedicated entrance can also be mistaken for a separate club identity; every relevant state must explain that an individual administrator remains signed in and accountable.

Self-service creation, invitations, multiple eligible clubs, several administrators, role transfer and club-wallet recovery remain future work. Those capabilities need separate security and lifecycle requirements before implementation.

## Completion and review references

- Completed: Not completed.
- Commit: Not created.
- Review: Requirements discussed with the user and refined through a pre-implementation contract review; no independent implementation review.
- Deployment or release: None.
