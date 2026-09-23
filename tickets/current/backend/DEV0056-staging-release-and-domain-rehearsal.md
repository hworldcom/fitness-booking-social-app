# Ticket DEV0056: Staging release and domain rehearsal

- Status: Blocked
- Created: 2026-09-23
- Last updated: 2026-09-23
- Milestone: M0 hosted integration environment
- Coordination: [COR0004 — Hosted staging deployment](../organisatory/COR0004-hosted-staging-deployment.md)
- Related records: [DEV0054 — Cloudflare Workers runtime foundation](../../archive/backend/DEV0054-cloudflare-workers-runtime-foundation.md), [DEV0055 — Hosted Supabase staging environment](DEV0055-hosted-supabase-staging-environment.md), [DEV0046 — Email OTP registration and application profiles](../../archive/backend/DEV0046-email-otp-registration-and-application-profiles.md), [DEV0027 — Phantom wallet connection foundation](../../archive/blockchain/DEV0027-phantom-wallet-connection-foundation.md), and [DEV0047 — Personal wallet linking and replacement](DEV0047-personal-wallet-linking-and-replacement.md)

## Objective and context

Deploy the reviewed MovX Club Workers build against the dedicated staging Supabase project, attach the exact hostname `https://staging.movx.club`, and retain evidence that public browsing, email accounts, protected profiles and current wallet behavior operate correctly in the hosted environment.

This is the integration/release peer under [COR0004](../organisatory/COR0004-hosted-staging-deployment.md). It begins after DEV0054 proves the runtime and DEV0055 proves the hosted database, restricted runtime login, Auth and SMTP foundation. DEV0055's remaining browser-visible secret review, access boundary and two-account isolation evidence are completed through this deployed integration rather than blocking it. A successful staging rehearsal does not mean production readiness or completion of later persistent-payment, reservation or blockchain tickets.

## Scope and non-goals

- In scope:
  - Configure an unmistakably staging-only Cloudflare Worker target and deployment command.
  - Supply required public build variables and private runtime secrets through Cloudflare's supported environment/secret mechanisms.
  - Onboard `movx.club` to Cloudflare DNS while preserving every Porkbun email record used by `hello@movx.club`.
  - Bind `staging.movx.club` as a Worker Custom Domain and verify Cloudflare-created Domain Name System (DNS) and Transport Layer Security (TLS) state.
  - Apply the staging access/abuse boundary adopted in DEV0055.
  - Run hosted public, responsive, Auth, protected-profile, account-isolation, error/recovery and current Phantom connection smoke tests.
  - Record the deployed commit, redacted provider configuration, validation outcomes, rollback and secret-rotation steps.
- Out of scope:
  - Production hostname or production Supabase deployment.
  - Changing Porkbun as the domain registrar or moving the purchased mailbox to another provider.
  - Production availability, backup or disaster-recovery guarantees.
  - Claiming persistent product data, payments, reservations, attendance or Solana transactions that are not implemented.
  - Treating a connected Phantom wallet as account identity. DEV0047 owns optional personal linking when completed.
  - CI/CD automation unless required to make the first controlled deployment reproducible; otherwise create a follow-up ticket.

## Expected behavior and edge cases

- `https://staging.movx.club` resolves to the staging Worker with a valid certificate and never to a production-labelled environment.
- The exact staging origin is used consistently by application origin checks and Supabase Auth redirects. Requests from unexpected origins fail closed.
- `DATABASE_URL` is available only to server runtime code. Public Supabase values and `NEXT_PUBLIC_SITE_URL` are supplied at the correct build/runtime phases without leaking private values.
- Public routes remain browsable when signed out. Sign-in sends a real OTP, first login enrolls a profile, refresh preserves the session, recovery/cancellation remains understandable, and sign-out clears application access.
- Two accounts remain isolated. A session/wallet mismatch or disconnected wallet is represented honestly and never grants another profile or club authority.
- Current Phantom extension connect/account-change/disconnect behavior works on the HTTPS custom domain without requesting a transaction signature. Optional message-signature linking is rehearsed only if DEV0047 is completed and included in the deployed commit.
- Existing `hello@movx.club` inbound and outbound mail continues to work after nameserver delegation. Missing MX/SPF/DKIM/DMARC records block cutover.
- A failed Worker release can roll back to the previous version without altering the staging database; DNS rollback and credential rotation are documented separately.

## Assumptions, decisions, and dependencies

- DEV0054 must be complete and DEV0055 must have passed its hosted migration, restricted-runtime, Auth and SMTP foundation before deployment starts. DEV0055 may remain In progress while DEV0056 supplies the exact-origin browser and two-account evidence required to complete both tickets. DEV0053 is already committed independently at `7038f2e`, so the eventual deployed revision can identify that interface baseline explicitly.
- Cloudflare must be authoritative for the active `movx.club` zone before a Worker Custom Domain can own `staging.movx.club`.
- Add the hostname through Workers > Settings > Domains & Routes or the equivalent reviewed Wrangler `custom_domain` route; do not create a competing Porkbun or Cloudflare CNAME first. Cloudflare creates the required DNS record and certificate.
- Preserve Porkbun registration and email service. Only authoritative DNS hosting moves, after every mail record is copied and checked.
- The proposed staging exposure default is Cloudflare Access with an explicit allowlist. If the user chooses public staging instead, DEV0055 must first own a compatible CAPTCHA/rate-limit implementation and validation; the decision must be recorded before release.
- External references: [Cloudflare Worker Custom Domains](https://developers.cloudflare.com/workers/configuration/routing/custom-domains/) and [Cloudflare full DNS setup](https://developers.cloudflare.com/dns/zone-setups/full-setup/setup/).

## Implementation plan

1. Confirm the clean DEV0054 runtime and foundation-ready DEV0055 inputs, then record the exact commit selected for staging.
2. Verify Cloudflare CLI authentication and account/zone state without deploying or changing DNS.
3. Create/configure the staging Worker target, build-time public values and runtime secrets. Verify secret names without printing values.
4. Deploy first to the temporary `workers.dev` hostname and validate Worker startup, public routes, server boundaries and secret placement before any DNS cutover.
5. Export/copy Porkbun DNS records to Cloudflare, paying special attention to MX, SPF, DKIM, DMARC and verification records; disable old DNSSEC if required before nameserver change and restore it after Cloudflare becomes authoritative.
6. Change Porkbun nameservers to the pair assigned by Cloudflare and wait for the zone to become Active without losing mail service.
7. Apply Cloudflare Access, add `staging.movx.club` as the Worker Custom Domain and verify access, DNS, TLS and exact-origin behavior.
8. Run the hosted smoke matrix at mobile and desktop widths, including two-account Auth/profile isolation and current Phantom states; record the corresponding DEV0055 evidence there as well.
9. Exercise rollback of the Worker version or document a safe dry run if rollback would disrupt the active rehearsal; record database independence and secret-rotation steps.
10. Update deployment/setup documentation and the ticket with redacted evidence. Do not mark Completed while any acceptance flow remains untested.

## Acceptance criteria

- [ ] AC1: A reviewed commit is deployed to a staging-only Worker with required variables/secrets in their correct scopes and no secret committed or exposed to the browser.
- [ ] AC2: `https://staging.movx.club` resolves to that Worker with valid TLS, exact-origin checks work, and no conflicting manual DNS record exists.
- [ ] AC3: Porkbun email service for `hello@movx.club` still sends and receives after Cloudflare becomes authoritative, with MX/SPF/DKIM/DMARC records present and checked.
- [ ] AC4: Signed-out public routes, responsive navigation and honest preview labels work on representative desktop and mobile browsers.
- [ ] AC5: Real hosted OTP first login, returning login, refresh, cancellation/error recovery, profile enrollment and sign-out pass for two isolated accounts.
- [ ] AC6: Current Phantom HTTPS connect, account-change and disconnect behavior passes without an unintended transaction signature; optional wallet-link proof is tested only when its owning ticket is complete.
- [ ] AC7: Unauthorized origins/access and missing or invalid session states fail closed without making public discovery unavailable.
- [ ] AC8: The deployed commit, provider boundaries, rollback, DNS recovery and secret-rotation procedure are documented with redacted evidence.

## Validation plan

- Inspect the final Worker configuration and built browser assets for secret leakage and correct staging identifiers.
- Use DNS and TLS queries plus Cloudflare dashboard/CLI status to verify the custom domain and certificate.
- Send and receive a controlled message through `hello@movx.club`; validate SPF/DKIM/DMARC using provider-visible headers or an accepted diagnostic tool without publishing sensitive message content.
- Run existing automated domain/browser tests against the selected commit before deployment, then execute a hosted manual/browser smoke matrix at mobile and desktop widths.
- Complete two-account OTP/profile-isolation flows using non-production addresses, including refresh and sign-out.
- Rehearse real Phantom extension states on Devnet over HTTPS; distinguish simple wallet connection from any optional account link.
- Verify an unexpected Origin, unauthenticated protected route and invalid/expired OTP fail safely.
- Record deployment and rollback command results with identifiers redacted where appropriate.

## Implementation record

Implementation began after DEV0054 completed its supported-host Worker validation and DEV0055 passed the hosted migration, restricted-runtime, Auth and SMTP foundation. The first release phase is intentionally read-only: verify Cloudflare authentication and zone state before creating a Worker, adding secrets, deploying or changing DNS.

### Changes and rationale

Added a guarded staging-release command that validates the expected Worker name, exact staging origin, hosted Supabase project, publishable-key form and restricted transaction-pooler connection before building. It passes only the four approved environment values to Wrangler through a temporary owner-only secrets file, deletes that file even on failure and requires a clean committed worktree for a real deployment. The validation-only and dry-run paths do not create or update a Worker.

No Worker, DNS or domain release is claimed yet. The dependency order now permits an access-restricted integration deployment to supply DEV0055's remaining exact-origin, browser-secret and two-account evidence.

### Affected files

| File or component                      | Change and purpose                                                                                                                                                                  |
| -------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `scripts/deploy-staging-worker.mjs`    | Validates the exact staging origin, Supabase project, publishable-key shape, transaction-pooler login and Worker name; builds and supplies only four approved bindings to Wrangler. |
| `tests/staging-deployment.test.ts`     | Exercises accepted and rejected staging configuration without connecting to Cloudflare or printing values.                                                                          |
| `package.json`                         | Adds explicit validation, dry-run and clean-commit deployment commands for staging.                                                                                                 |
| `wrangler.jsonc`                       | Declares the four required binding names without values while retaining the route-free staging-only target.                                                                         |
| `README.md`                            | Documents the secret-safe commands and the `workers.dev`-before-DNS boundary.                                                                                                       |
| Cloudflare staging Worker and secrets  | The first deployment attempt registered the account's `workers.dev` subdomain and uploaded assets, but Cloudflare rejected Worker creation until the account email is verified.     |
| Cloudflare DNS / `staging.movx.club`   | Pending authoritative zone and Worker Custom Domain.                                                                                                                                |
| Porkbun nameserver and email DNS state | Pending safe delegation with mail preservation.                                                                                                                                     |

### Decisions and deviations

- 2026-09-23: Assigned custom-domain/DNS operations to this release ticket rather than DEV0054 so local runtime compatibility can complete without external mutation.
- 2026-09-23: Proposed Cloudflare Access for staging; final adoption remains dependent on DEV0055's abuse-control decision.
- 2026-09-23: With user approval, changed the sequence so DEV0056 starts after DEV0054 completion and DEV0055's foundational database/Auth checks, while DEV0055's remaining browser and account-isolation checks run against the deployed staging origin. The temporary `workers.dev` deployment must pass before any nameserver or custom-domain change.
- 2026-09-23: Confirmed Wrangler OAuth authentication and that no existing `movx-club-staging` deployment is present. Adopted a filtered temporary `--secrets-file` deployment rather than putting public or private values in Wrangler configuration; the temporary file is owner-only and removed in `finally`, and real deployment refuses an uncommitted worktree.
- 2026-09-23: Attempted the first real release from commit `ef93a01`. Wrangler registered the account-level `workers.dev` subdomain and uploaded 61 static assets, then Cloudflare rejected Worker creation with error `10034` because the account email was not verified. A subsequent deployment-list query returned an empty list, so no Worker release is claimed. No DNS or custom-domain change occurred.

### Contracts, configuration, and operations

The release will use `https://staging.movx.club`, the existing four-variable application environment contract, Cloudflare-managed TLS and a staging-only Worker. `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` and `NEXT_PUBLIC_SITE_URL` are present before the build so vinext can inline the explicitly public values; all four names, including server-only `DATABASE_URL`, are uploaded to the Worker through a temporary filtered secrets file. Actual values are never recorded here.

## Validation results

The local release guard, application checks and Cloudflare upload dry run pass. Commands and output below omit all values, account identifiers and provider credentials.

- `npx --no-install wrangler whoami` — passed; confirmed the intended authenticated Cloudflare session.
- `npx --no-install wrangler deployments list --name movx-club-staging --json` — passed; confirmed no existing deployment would be overwritten.
- `npm run deploy:staging:check` — passed against the ignored staging environment file; validated exactly four approved bindings without printing values.
- `npm run deploy:staging:dry-run` — passed; vinext built all five environments, Wrangler prepared 72 static assets and the Worker bundle, displayed only hidden values for the four approved bindings, and exited in dry-run mode without uploading or creating a Worker.
- `npm run deploy:staging` — blocked by Cloudflare after building and uploading 61 assets; all four binding values remained hidden, but Worker creation failed with account-email verification error `10034`.
- `npx --no-install wrangler deployments list --name movx-club-staging --json` after the failed release — passed and returned an empty list, confirming that no deployable Worker version was created.
- `npm test` — passed, 52 tests including accepted configuration, rejected production-origin configuration and Wrangler binding-boundary coverage.
- `npm run lint` — passed.
- `npm run typecheck` — passed.
- `npm run format:check` — passed.
- `git diff --check` — passed.

| Criterion | Evidence                                                                                                                                                              | Result  |
| --------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------- |
| AC1       | Staging configuration, binding allowlist, tests and Cloudflare dry run pass; commit `ef93a01` is reviewed but Cloudflare account verification blocked its deployment. | Partial |
| AC2       | The exact origin is enforced locally; custom domain, DNS and TLS are not configured.                                                                                  | Partial |
| AC3       | DNS/mail cutover not performed.                                                                                                                                       | Not run |
| AC4       | Automated application tests pass; hosted responsive smoke not run.                                                                                                    | Partial |
| AC5       | Hosted Auth rehearsal not run.                                                                                                                                        | Not run |
| AC6       | Hosted Phantom rehearsal not run.                                                                                                                                     | Not run |
| AC7       | Invalid deployment configuration fails closed in tests; hosted access, origin and session failure paths remain untested.                                              | Partial |
| AC8       | Reproducible check, dry-run and deployment commands plus clean-commit enforcement are documented; deployment and rollback evidence remain outstanding.                | Partial |

## Risks, limitations, and follow-ups

- DNS and TLS propagation can delay validation; do not repeatedly rewrite records while issuance is pending.
- Nameserver mistakes can interrupt business email even when the website deploy succeeds.
- Cloudflare Workers resource limits, Supabase free-tier availability and cross-region database latency may require measured follow-up work.
- The `workers.dev` URL can be used for an initial infrastructure smoke test, but exact-origin Auth/wallet behavior is accepted only on `staging.movx.club`.
- Blocker: Cloudflare requires the account email address to be verified before Workers can be published.
- Next action: verify the Cloudflare account email, rerun `npm run deploy:staging`, and smoke-test the resulting temporary `workers.dev` hostname before any DNS change.

## Completion and review references

- Completed: Not completed.
- Commit: `ef93a01` (`[DEV0056] Guard staging Worker deployment`).
- Review: No pull request or independent review exists.
- Deployment or release: The first attempt was rejected with Cloudflare error `10034`; the deployment list remains empty.
