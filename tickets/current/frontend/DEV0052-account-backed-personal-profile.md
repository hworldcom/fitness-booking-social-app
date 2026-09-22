# Ticket DEV0052: Account-backed personal profile

- Status: Ready
- Created: 2026-09-22
- Last updated: 2026-09-22
- Milestone: M0 identity and interface integrity
- Coordination: None — independent development ticket
- Related records: consumes completed [DEV0046 — Email OTP registration and application profiles](../../archive/backend/DEV0046-email-otp-registration-and-application-profiles.md) and [DEV0040 — Protected access and database context](../../archive/backend/DEV0040-protected-access-and-database-context.md); should complete before [DEV0017 — Persistent catalogue and private drafts](../backend/DEV0017-persistent-catalogue-and-drafts.md), which owns richer persistent profile, draft, follow and bookmark data

## Objective and context

Remove the hardcoded Anna Klein current-user identity from the shared shell, home experience, personal profile and database seed. A personal profile becomes visible only after a person signs up or returns through the email one-time-passcode flow and has an enrolled application profile. This applies the specification's [Profile screen contract](../../../docs/mvp-spec.md#2-screens-and-actions) and [public browsing/sign-in boundary](../../../docs/mvp-spec.md#public-browsing-and-sign-in-boundaries).

DEV0046 already exposes the authorized actor's server-derived display name and slug. The current interface does not consistently consume that contract: signed-out or configuration-free visitors can still see Anna's name/avatar/profile card, and the protected `/profile` page renders Anna plus illustrative personal history after any user signs in. This contradicts the account-first product model and can make fixture data look like the current person's data.

This ticket is intentionally smaller than DEV0017. It fixes current-person identity presentation using the existing minimal actor contract; DEV0017 later adds richer database-backed catalogue, profiles, drafts, follows and bookmarks.

## Scope and non-goals

- In scope: use the current actor snapshot for the shared shell and owner profile; remove Anna's current-user card/name/avatar and fabricated personal history; remove the unclaimed Anna row and dataset membership from the deterministic seed; replace the Anna registration placeholder with a neutral example; keep `/profile` protected in configured database mode with its safe sign-in return; render an honest non-personal state in configuration-free preview mode; add responsive, keyboard and actor-transition tests.
- Out of scope: editable profile fields or avatar uploads; public people-directory persistence; shared activity, visits, balances, passes, receipts, drafts, follows or bookmarks; changing other clearly labelled catalogue/community fixtures; club workspaces; wallet linking or payments; DEV0017's repository/service work.

## Expected behavior and edge cases

A signed-out visitor may browse public discovery without being assigned a name, avatar or demo profile. The primary Profile navigation may remain as the access point, but it cannot display a current-user identity before authorization. In configured database mode, opening `/profile` while signed out redirects to the shared sign-in route with `/profile` as the safe return destination. In configuration-free preview mode, `/profile` shows an honest explanation that a personal profile appears after account creation rather than inventing a user.

After email verification and successful profile enrollment, the shared shell and `/profile` show the server-derived display name from that actor's current session. A returning sign-in restores the same identity. Sign-out immediately removes personal identity from the shell and prevents stale profile content from remaining visible. Wallet connection, wallet linking and club authority do not create or select the personal profile.

The minimal profile must not claim visits, balances, upcoming sessions, biography text, follows or other personal history that has not been delivered by its owning backend ticket. Existing public community/catalogue fixtures may remain only where visibly labelled as examples and must never be presented as the current person.

## Assumptions, decisions, and dependencies

Confirmed with the user on 2026-09-22:

- remove the hardcoded user from the home/shared interface;
- show a personal profile only after sign-up;
- deliver this cleanup as a separate ticket before DEV0017.

DEV0046 and DEV0040 already provide the required email session, enrollment, protected route and bounded actor snapshot. No new profile endpoint, authentication provider or database table is needed. The public term is `profile`; internal demo-run participation remains implementation detail and grants no club, staff or wallet authority.

Removing Anna from `supabase/seed.sql` is safe because she is an unclaimed fixture with only a dataset-membership row and is not required by the current organization, staff, trainer or catalogue fixtures. Existing disposable local databases require a reset to remove the old seeded row. No hosted cleanup is authorized or expected because the project has not applied this seed as production user data.

## Implementation plan

1. Adapt the shared shell to the current actor snapshot: render the enrolled person's display name/profile link only for an authorized actor and remove personal identity immediately on sign-out or actor mismatch.
2. Adapt the owner `/profile` view to the same actor, showing only delivered minimal identity and honest empty states. Preserve the existing safe signed-out redirect and add a non-fabricated preview/unavailable presentation.
3. Remove Anna's profile/membership rows from the deterministic seed and change the sign-up display-name placeholder to a neutral example. Update database expectations without changing other labelled fixtures.
4. Add focused actor-state/component/source tests and desktop/mobile keyboard browser coverage for guest, enrolled, returning and signed-out transitions. Replay the local database seed and run lint, typecheck, formatting and a production build.

## Acceptance criteria

- [ ] AC1: No current runtime source or deterministic seed presents Anna Klein as a current or prepared application user; historical archived records may retain their accurate history.
- [ ] AC2: Signed-out and configuration-free preview visitors see no fabricated current-user name, avatar, profile card or personal history. `/profile` preserves a safe sign-in return in configured database mode and an honest unavailable/registration explanation in preview mode.
- [ ] AC3: After enrollment, the shell and owner profile show the exact server-derived display name for the current actor; returning sign-in restores it and sign-out removes it without stale-user leakage.
- [ ] AC4: The minimal owner profile claims no undelivered visits, balances, sessions, follows, biography, receipts or wallet/club authority. Clearly labelled public catalogue/community fixtures remain separate from current-user identity.
- [ ] AC5: Clean database replay, focused actor/profile tests, lint, typecheck, formatting, production build and desktop/mobile keyboard/browser checks pass with exact evidence recorded.

## Validation plan

Use two distinct enrolled email accounts plus a signed-out browser context. Confirm each account sees only its own display name in the shell and owner profile, then sign out and verify the identity disappears before public navigation continues. Directly visit `/profile` while signed out, test the safe return, and verify configuration-free preview mode shows no persona. Check refresh and rapid sign-out/account transitions for stale data. At desktop and 393-pixel widths, verify keyboard access to Profile and sign-in without an unexplained avatar-only control.

Reset the disposable local Supabase database and verify the seed no longer contains Anna while the remaining foundation fixtures and constraints pass. Run focused unit/boundary tests, database tests affected by seed counts, lint, typecheck, formatting, webpack production build and affected Playwright scenarios. Search current runtime source and seed for `Anna Klein`/`anna-klein`; only historical records may match.

## Implementation record

Pending implementation. This ticket records the user's decision to remove the preselected demo person before DEV0017. No runtime, seed or test file has been changed yet.

### Changes and rationale

Not implemented.

### Affected files

| File or component | Change and purpose                                                                      |
| ----------------- | --------------------------------------------------------------------------------------- |
| Pending           | Record the shell, owner-profile, seed, placeholder and test files after implementation. |

### Decisions and deviations

No implementation deviation. The planning boundary deliberately leaves rich persistent profile/social data in DEV0017.

### Contracts, configuration, and operations

No new endpoint, dependency, secret or environment variable is planned. The existing authorized `ActorSnapshot.profile` (`slug`, `displayName`) is the only current-user identity input. Seed removal requires `npm run db:reset` for disposable local environments; no hosted data mutation is part of this ticket.

## Validation results

Planning review passed: the existing actor snapshot already supplies display name/slug, the configured `/profile` route already has a safe signed-out redirect, and the Anna seed row has no organization/staff/trainer/catalogue dependency. The repository contains 49 uniquely headed and indexed work records; 781 repository-local Markdown file links resolved across 71 files. Focused Prettier validation and `git diff --check` passed. Application and database validation have not run because implementation has not started.

| Criterion | Evidence | Result  |
| --------- | -------- | ------- |
| AC1–AC5   | Not run  | Not run |

## Risks, limitations, and follow-ups

Until DEV0017, the owner profile remains intentionally minimal and cannot display shared activity, real visit counts, persistent drafts, follows or bookmarks. Removing Anna does not remove other visibly labelled public demonstration people or catalogue content. Avoid replacing one fake current user with another generic-looking persona.

## Completion and review references

- Completed: Not completed.
- Commit: `[DEV0052] Plan account-backed personal profile` (this commit).
- Review: Scope/readiness self-review completed against DEV0046/DEV0040 and DEV0017 boundaries; no independent review.
- Deployment or release: None.
