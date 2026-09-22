# Local database operations

This directory owns MovX Club's checked-in Supabase PostgreSQL history. The SQL files under `migrations/` are the only applied migration source of truth; Drizzle mirrors them for typed server queries and must not create a second migration journal.

## Local workflow

Prerequisites are Node.js 24.21.x, the locked npm dependencies and a running Docker-compatible container runtime. MovX Club's database uses port `55322` so it can coexist with another project using Supabase's default `5432x` range. The DEV0015 `db:start` command remains a lean PostgreSQL-only workflow. The `auth:start` profile also starts Auth, its API gateway and a local captured mailbox while continuing to exclude unrelated services.

```sh
npm ci
npm run db:start
npm run db:reset
npm run db:runtime
npm run db:test
npm run test:db
npm run db:lint
```

`db:reset` is destructive only to this repository's disposable local database: it recreates the database from `migrations/` and then runs `seed.sql`. Run `npm run db:seed` again against the same local database to verify that fixture inserts remain idempotent. That script uses Postgres.js and a fixed loopback-only development URL because Supabase CLI 2.117.0 no longer applies general SQL through `supabase seed --local`; it cannot target a hosted database. Stop this repository's stack with `npm run db:stop`.

The local integration test uses Supabase's disposable `postgres` credential on `127.0.0.1:55322`; it is not an application credential. The frontend preview does not read `DATABASE_URL`, initialize a database client or require this stack.

`npm run db:runtime` idempotently provisions the loopback-only `repx_runtime_login` used by the Next.js application and grants it only the non-bypass `app_runtime` group role. DEV0049 preserves this legacy infrastructure identifier so existing local credentials keep working after the MovX Club brand rename. Its fixed `postgres` password is acceptable only for this disposable database bound to the local Supabase port; hosted environments must use a generated secret and the environment-specific login described below. For local application enrollment, set `DATABASE_URL=postgresql://repx_runtime_login:postgres@127.0.0.1:55322/postgres`. Open email registration no longer uses a prepared-person or wallet roster.

## Local email Auth profile

Stop a running database-only profile before switching to the Auth profile, then inspect its public values:

```sh
npm run db:stop
npm run auth:start
npm run auth:status
npm run db:runtime
```

The status command prints only `API_URL` and the public `PUBLISHABLE_KEY` or legacy `ANON_KEY`; copy them into the corresponding public variables documented in `.env.example`. It deliberately omits `SECRET_KEY` and `SERVICE_ROLE_KEY`. Build or restart the app after changing its environment, then open exactly `http://localhost:3100/sign-in`. Enter an email, open Mailpit at `http://127.0.0.1:55324`, read the six-digit code and complete a display name on first login. The flow never needs a wallet connection or signature.

The local profile permits 30 captured messages per hour and applies Supabase's verification-attempt limits. It intentionally has no CAPTCHA on loopback. A hosted rollout must configure reviewed origins, the checked-in OTP template, abuse controls and a custom SMTP provider; Supabase's default sender is not a production delivery plan.

The normal `db:start` path still excludes Auth. `auth:start` retains the same database and migrations while adding only the services needed for email authentication and capture. Missing configuration or a stopped Auth service must never prevent public preview browsing. `npm run db:stop` stops either profile; `npm run db:reset` remains destructive to all disposable local database, Auth users and application profiles. The old local wallet-first account is intentionally not migrated because no hosted users exist.

With the Auth stack, runtime role and configured production app already running on port `3100`, run `npm run test:auth` to rehearse two new accounts, an invalid-code retry, isolated profile creation, sign-out and returning-account login. The script reads one-time codes from Mailpit but does not print or persist them.

## Roles and runtime connection

- The migration connection creates objects and transfers their ownership to `app_owner`.
- `app_owner` is `NOLOGIN` and owns the `app` schema objects.
- `app_runtime` is `NOLOGIN`, cannot bypass row-level security (RLS), and has only the data privileges that forced RLS permits.
- `anon`, `authenticated` and `service_role` have no `app` schema usage. The `app` schema is absent from the local Data API schema list.

Provision an environment-specific login outside migrations, using a generated secret from the deployment secret manager, then grant it the checked-in group role:

```sql
create role repx_runtime_login login password '<generated-secret>';
grant app_runtime to repx_runtime_login;
```

Set the server-only `DATABASE_URL` to that login's connection-pooler URL. Hosted serverless connections require TLS, one application connection per warm instance and prepared statements disabled; `src/server/db/client.ts` enforces those driver settings. Never prefix the variable with `NEXT_PUBLIC_` or commit the populated value.

## Hosted changes and recovery

No hosted project is linked or deployed by DEV0015. When a project is selected, copy its actual connection values from Supabase, disable the unused Data API integration (or at minimum keep `app` unexposed), and apply reviewed migrations with a suitable migration connection. Never run a linked reset against a project containing user, receipt or pending-operation data.

Do not rewrite an applied migration. Correct or roll forward the schema with a new migration, and document the compatibility and recovery steps in its owning feature ticket. The exact foundation decision and validation record remains in [DEV0015](../tickets/archive/backend/DEV0015-supabase-database-foundation.md).
