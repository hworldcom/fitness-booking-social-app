# Ticket DEV0057: Refer to businesses generically

- Status: Completed
- Created: 2026-09-23
- Last updated: 2026-09-23
- Milestone: Product terminology maintenance
- Coordination: None — independent development ticket
- Related records: [DEV0020 — Discovery and How it works](../../archive/frontend/DEV0020-discovery-and-how-it-works.md) and [DEV0053 — Distinct personal and club guide](../../archive/frontend/DEV0053-distinct-personal-and-club-guide.md)

## Objective and context

Replace generic references that present cafés as a distinct MovX Club audience with the broader term “businesses.” A café was only one illustrative event host, not the product's business-category boundary. Keep the Sunday Coffee café and other café wording where it describes that specific fixture.

This terminology correction applies to the main README, the current MVP product contract and the public How-it-works guidance. It does not change the accepted paid-event behavior or add a new database entity.

## Scope and non-goals

- In scope:
  - Use “businesses” in current high-level audience and host descriptions that currently enumerate cafés generically.
  - Preserve Sunday Coffee, Run & Coffee and other concrete café-example descriptions.
  - Clarify that a business such as the café fixture uses the existing organization/venue model.
- Out of scope:
  - Renaming the illustrative café, its copy or its included coffee benefit.
  - Rewriting historical archived tickets.
  - Changing schema discriminator values, seed identifiers or persistence behavior.
  - Designing business onboarding, authorization or payment functionality beyond the current contract.

## Expected behavior and edge cases

- The main project description names businesses rather than cafés as the general audience.
- Public guidance says businesses can organize challenges or events without implying that only cafés qualify.
- The specification uses businesses for generic paid-event host and receipt language.
- Specific Sunday Coffee/café examples remain explicit so the existing preview and acceptance scenario retain their meaning.
- Existing `cafe` schema/fixture values remain compatible; they describe the current example rather than the complete business taxonomy.

## Assumptions, decisions, and dependencies

- “Business” is an audience umbrella represented through the existing organization/venue model, not a newly authorized browser-selected role.
- This is a terminology clarification, not approval of unrestricted business self-onboarding or a schema migration.
- No dependency blocks the wording correction.

## Implementation plan

1. Update the generic audience sentence in the root README.
2. Update C16 and related general business/receipt language in the MVP specification while retaining fixture-specific café references.
3. Update the public organizer answer in How it works.
4. Search current product files to confirm remaining café references are concrete examples or compatibility identifiers.
5. Run formatting, type/build and focused browser validation appropriate to the affected public guidance.

## Acceptance criteria

- [x] AC1: The README describes businesses, not cafés, as the general partner/organizer audience.
- [x] AC2: Generic current-specification and How-it-works audience language uses businesses consistently.
- [x] AC3: Specific café fixture copy and existing compatibility identifiers remain unchanged.
- [x] AC4: Formatting and relevant application/browser checks pass with the updated copy.

## Validation plan

- Search current product documentation and source for `café`, `cafés` and `cafe`; classify every remaining match as a concrete fixture reference or compatibility identifier.
- Run Prettier against the changed files and `git diff --check`.
- Run the standard type check and production build.
- Run the focused discovery browser specification and verify the public How-it-works page at its desktop and mobile projects.

## Implementation record

### Changes and rationale

The root description, confirmed paid-event contract and public organizer guidance previously listed cafés as though they were a distinct supported audience category. They now use “businesses” as the general umbrella. The specification also clarifies that a business such as the Sunday Coffee fixture uses the existing organization/venue model and that business receipts use the host organization's wallet.

The concrete Sunday Coffee café, Run & Coffee descriptions, coffee benefit, browser event fixture and `cafe` schema/seed values remain unchanged. Those references identify the existing example or preserve its compatibility contract; they no longer define the complete business audience.

### Affected files

| File or component                         | Change and purpose                                                                                                                        |
| ----------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| `README.md`                               | Replaced café with businesses in the general platform-audience description.                                                               |
| `docs/mvp-spec.md`                        | Updated C16, the data-ownership explanation and generic receipt language while retaining named café-example scenarios.                    |
| `src/features/discovery/how-it-works.tsx` | Updated the public organizer answer to include businesses and community organizations.                                                    |
| `tests/browser/discovery.spec.ts`         | Added a keyboard-driven assertion that the organizer answer exposes the new business wording in both desktop and mobile browser projects. |

### Decisions and deviations

- 2026-09-23: Kept café-specific example and schema language where it identifies the existing Sunday Coffee fixture; only generic audience/host terminology changes.
- No implementation deviations from the reviewed scope.

### Contracts, configuration, and operations

No runtime interface, schema, environment variable, dependency, setup or migration contract changed. Product terminology broadened from one example category to the intended business umbrella.

## Validation results

- Date and environment: 2026-09-23, local repository with Node.js 24 and Next.js 16.3.5.
- `rg -n -i "caf[eé]s?|cafe" README.md docs/mvp-spec.md tickets/current src tests supabase --glob '!tickets/archive/**' --glob '!docs/archive/**'` — passed review. Remaining product/source matches are the named café fixture and included benefit; SQL/Drizzle matches are existing compatibility discriminators. DEV0057 itself explains the distinction.
- `npm run typecheck` — passed; Next route types generated and `tsc --noEmit` reported no errors.
- `npm run build` — attempted twice but the restricted agent environment prevented Turbopack from creating its helper process and binding an internal port (`Operation not permitted`). No application compile error was reported.
- `npx next build --webpack` — passed; compiled successfully, completed TypeScript, generated 13 static pages and collected all dynamic routes.
- `npm run test:e2e -- tests/browser/discovery.spec.ts` — passed, 10/10 tests across the desktop and mobile Playwright projects. The new keyboard disclosure assertion observed “businesses and community organizations.”
- `npm run format:check` plus focused Prettier checks for the README, ticket index and ticket record — passed. The specification retained its established table formatting to avoid unrelated formatting churn.
- `git diff --check` — passed.

| Criterion | Evidence                                                                                                               | Result |
| --------- | ---------------------------------------------------------------------------------------------------------------------- | ------ |
| AC1       | Root README general audience names businesses                                                                          | Passed |
| AC2       | C16/data/receipt contract and public organizer answer use businesses                                                   | Passed |
| AC3       | Remaining-reference search classified only concrete fixture or compatibility uses                                      | Passed |
| AC4       | Typecheck, webpack build, 10 browser tests and formatting passed; Turbopack environment limitation recorded separately | Passed |

## Risks, limitations, and follow-ups

- The existing `cafe` discriminator remains fixture-specific. If later business onboarding requires an explicit broader taxonomy, that schema/product work needs a separate ticket.
- This ticket does not claim that persistent business onboarding or live paid-event settlement exists.
- No acceptance work remains.

## Completion and review references

- Completed: 2026-09-23 — generic product and public guidance now use businesses while the concrete café example remains intact.
- Commit: Not created.
- Review: Self-reviewed against the ticket scope and remaining-reference search; no pull request or independent review exists.
- Deployment or release: Not deployed.
