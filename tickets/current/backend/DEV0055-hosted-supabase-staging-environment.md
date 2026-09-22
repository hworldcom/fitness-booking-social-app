# Ticket DEV0055: Hosted Supabase staging environment

- Status: Ready
- Created: 2026-09-23
- Last updated: 2026-09-23
- Milestone: M0 hosted integration environment
- Coordination: [COR0004 — Hosted staging deployment](../organisatory/COR0004-hosted-staging-deployment.md)
- Related records: [DEV0015 — Supabase database foundation](../../archive/backend/DEV0015-supabase-database-foundation.md), [DEV0040 — Protected access and database context](../../archive/backend/DEV0040-protected-access-and-database-context.md), [DEV0046 — Email OTP registration and application profiles](../../archive/backend/DEV0046-email-otp-registration-and-application-profiles.md), and [DEV0047 — Personal wallet linking and replacement](DEV0047-personal-wallet-linking-and-replacement.md)

## Objective and context

Create a dedicated, non-production Supabase staging environment that can support the current MovX Club email-account, application-profile and protected-database flows from `https://staging.movx.club`. The current repository proves these boundaries locally, but no hosted project is linked, migrated or accepted.

This ticket applies the specification's [database-provider recommendation](../../../docs/mvp-spec.md#database-provider-recommendation--19-september-2026), [security boundary](../../../docs/mvp-spec.md#security-boundary) and [migration/environment rules](../../../docs/mvp-spec.md#migrations-environments-and-seed-boundaries) without treating a hosted service dashboard as a substitute for recorded migration and authorization evidence.

## Scope and non-goals

- In scope:
  - Select or confirm one EU-region Supabase project used only for staging.
  - Link the Supabase command-line interface (CLI) safely and dry-run/apply the checked-in migration history without resetting hosted data.
  - Seed the blank staging dataset only after confirming the seed is intended and idempotent.
  - Provision a generated-password login outside migrations and grant only the checked-in `app_runtime` role.
  - Use the Supabase transaction pooler with TLS, prepared statements disabled and the application's bounded pool.
  - Keep the `app` schema outside browser-facing data APIs and ensure no service-role or database secret reaches client code.
  - Configure email OTP site/redirect URLs, the checked-in token template, custom SMTP, bounded rate limits and a reviewed staging abuse boundary.
  - Record the public URL/publishable-key and private runtime/migration variable names and storage locations without recording their values.
  - Verify migration state, role restrictions, Auth email delivery and two distinct account/profile enrollments.
- Out of scope:
  - Cloudflare application adaptation or deployment.
  - Porkbun/Cloudflare nameserver changes and custom-domain binding.
  - Production Supabase, production users, production backups or production billing commitments.
  - Service-role use by the application, browser access to business tables, password login, social login or passkeys.
  - Fabricating club membership or granting organization roles through open signup.

## Expected behavior and edge cases

- A first email OTP login creates exactly one ordinary profile and active dataset participation; retrying enrollment returns the same identity without duplicates.
- A second email account remains isolated from the first account's profile and protected data.
- Browser clients receive only the project URL and publishable key. The runtime database password and any administrative/migration credential remain server-side and outside Git.
- The runtime login cannot own/create schemas, bypass row-level security or obtain migration privileges.
- Hosted migration uses dry-run/review before apply and never uses `supabase db reset` against the linked project.
- OTP messages use the MovX Club template and a selected custom SMTP sender. Supabase's demonstration sender is not accepted for the public staging hostname.
- Site and allowed redirect values match `https://staging.movx.club` and the exact sign-in path; unexpected redirects are rejected.
- Staging remains access-restricted until an abuse-control decision is implemented. The proposed first default is Cloudflare Access around the staging hostname rather than enabling CAPTCHA without corresponding client token support; DEV0056 must record the adopted choice.
- Reapplying migrations/seed/runtime-role provisioning is either idempotent or fails safely with a documented recovery path.

## Assumptions, decisions, and dependencies

- The user has or will create the Supabase project and provide access through local authenticated tooling; credentials are never pasted into this record.
- Adopt a separate staging project rather than reusing local or future production data.
- Use the transaction pooler on port 6543 for the Worker runtime and an appropriate migration/session connection for schema work.
- The existing `.env.example` contract remains authoritative unless validation finds a necessary new variable.
- Custom SMTP may use Porkbun only if its current service terms and sending limits support transactional OTP delivery; otherwise select a transactional mail provider. Purchasing an address alone is not assumed to establish a suitable Auth sender.
- External references: [Supabase environment management](https://supabase.com/docs/guides/deployment/managing-environments), [database connections](https://supabase.com/docs/guides/database/connecting-to-postgres), [custom SMTP](https://supabase.com/docs/guides/auth/auth-smtp), and [redirect URLs](https://supabase.com/docs/guides/auth/redirect-urls).

## Implementation plan

1. Confirm the staging project, EU region and non-production label; record project identifiers only where they are safe and operationally useful.
2. Link the CLI, compare local/remote migration state, run a dry run and apply reviewed migrations. Include the deterministic demonstration seed only for the confirmed blank staging dataset.
3. Provision the least-privilege runtime login with a generated secret, grant `app_runtime`, and form the TLS transaction-pooler `DATABASE_URL` in the deployment secret manager.
4. Verify schema exposure and row-level-security boundaries with the runtime role.
5. Configure email signup, exact site/redirect URLs, token-based OTP template, custom SMTP and bounded rate limits.
6. Select and record the staging access/abuse boundary before public use. Do not enable CAPTCHA until the application supplies the required client token.
7. Exercise first/returning login, a second isolated account, profile enrollment and sign-out against staging, recording only redacted evidence.
8. Document migration, rollback/recovery and credential-rotation operations for later maintainers.

## Acceptance criteria

- [ ] AC1: One dedicated EU staging project has the repository's complete reviewed migration history and intended idempotent demonstration seed, with no destructive remote reset.
- [ ] AC2: A distinct generated-secret runtime login connects through the transaction pooler and has only the `app_runtime` capabilities required by the application.
- [ ] AC3: Browser-facing keys cannot access private `app` data directly, and no administrative/service-role/database secret is present in Git or a browser bundle.
- [ ] AC4: Hosted Auth uses the exact staging origin/redirect contract, MovX Club OTP template and working custom SMTP rather than Supabase's demonstration sender.
- [ ] AC5: The adopted staging access/abuse boundary is implemented and documented before the custom hostname is considered publicly usable.
- [ ] AC6: Two real staging email accounts can enroll independently, return to the same profiles and sign out without cross-account data access.
- [ ] AC7: Migration state, runtime restrictions, Auth configuration, recovery/rotation steps and redacted validation evidence are durable in repository documentation and this ticket.

## Validation plan

- Run `supabase migration list --linked`, a reviewed `supabase db push --dry-run`, the non-destructive apply command, and a second migration/seed idempotency check where supported.
- Connect using the runtime pooler URL and run the repository database/authorization checks that do not mutate unrelated hosted state.
- Inspect grants, role attributes, exposed schemas and row-level-security enforcement with safe catalogue queries.
- Send and redeem real staging OTPs through custom SMTP for two test addresses; verify first enrollment, returning login, isolation and sign-out.
- Inspect the built browser assets or deployment configuration to ensure private credentials are absent.
- Record checks that cannot run before DEV0056's application deployment as explicit handoff items rather than marking them passed.

## Implementation record

Pending implementation.

### Changes and rationale

No hosted project change is claimed yet.

### Affected files

| File or component                                        | Change and purpose                                                        |
| -------------------------------------------------------- | ------------------------------------------------------------------------- |
| Supabase staging project                                 | Pending migrations, roles, Auth, SMTP and security configuration.         |
| `supabase/README.md` or focused operations documentation | Pending hosted staging instructions and recovery boundary.                |
| `.env.example`                                           | Changed only if a genuinely new non-secret variable contract is required. |

### Decisions and deviations

- 2026-09-23: Prepared this as a separate peer from Cloudflare runtime work because hosted database/Auth operations have independent credentials, rollback and security evidence.
- 2026-09-23: Proposed Cloudflare Access as the initial staging exposure control; this remains a proposed implementation default until adopted during implementation.

### Contracts, configuration, and operations

The planned environment uses existing variable names and schema contracts. Actual provider identifiers, credentials and passwords must remain outside the repository.

## Validation results

Pending validation.

| Criterion | Evidence                                     | Result  |
| --------- | -------------------------------------------- | ------- |
| AC1       | Hosted migration not yet applied             | Not run |
| AC2       | Runtime login not yet verified               | Not run |
| AC3       | Hosted exposure and bundle not yet inspected | Not run |
| AC4       | SMTP/OTP not yet verified                    | Not run |
| AC5       | Access/abuse control not yet adopted         | Not run |
| AC6       | Two-account hosted rehearsal not yet run     | Not run |
| AC7       | Operations record pending                    | Not run |

## Risks, limitations, and follow-ups

- SMTP sending limits, sender verification and DNS propagation can delay Auth validation.
- Supabase's free project availability/backups are insufficient evidence for production readiness.
- Hosted tests create real non-production Auth/profile rows and require a documented cleanup policy that does not use remote reset.
- Next action: confirm the project and SMTP capability, then execute the non-destructive migration and role review.

## Completion and review references

- Completed: Not completed.
- Commit: Not created.
- Review: No pull request or independent review exists.
- Deployment or release: Supabase staging not yet accepted; DEV0056 owns integrated release evidence.
