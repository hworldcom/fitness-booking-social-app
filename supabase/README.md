# Local database operations

This directory owns RepX Club's checked-in Supabase PostgreSQL history. The SQL files under `migrations/` are the only applied migration source of truth; Drizzle mirrors them for typed server queries and must not create a second migration journal.

## Local workflow

Prerequisites are Node.js 20.9 or newer, the locked npm dependencies and a running Docker-compatible container runtime. RepX Club's database uses port `55322` so it can coexist with another project using Supabase's default `5432x` range. The DEV0015 `db:start` command remains a lean PostgreSQL-only workflow. DEV0038 adds `auth:start`, which also starts Auth and its API gateway while continuing to exclude unrelated local services.

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

`npm run db:runtime` provisions the loopback-only `repx_runtime_login` used by the Next.js application and grants it only the non-bypass `app_runtime` group role. Its fixed `postgres` password is acceptable only for this disposable database bound to the local Supabase port; hosted environments must use a generated secret and the environment-specific login described below. For local DEV0039 enrollment, set `DATABASE_URL=postgresql://repx_runtime_login:postgres@127.0.0.1:55322/postgres` and provide the ignored server-only `PREPARED_PERSONAL_IDENTITIES_JSON` mapping described in `.env.example`.

## Local Web3 Auth profile

Stop a running database-only profile before switching to the Auth profile, then inspect its public values:

```sh
npm run db:stop
npm run auth:start
npm run auth:status
npm run db:runtime
```

The status command prints only `API_URL` and `ANON_KEY`; copy them into the corresponding public variables documented in `.env.example`. It deliberately omits `SERVICE_ROLE_KEY`. The signing page is exactly `http://localhost:3100/sign-in`. Supabase permits plain HTTP for the literal `localhost` development hostname but rejects `http://127.0.0.1` Web3 message URIs. Solana Web3 Auth is enabled with 30 attempts per five minutes. The local-only workflow does not enable CAPTCHA; public hosting requires a separately reviewed rate-limit/CAPTCHA policy.

The normal `db:start` path still excludes Auth. `auth:start` retains the same database and migrations while adding only the services needed for Web3 authentication. Missing configuration or a stopped Auth service must never prevent public preview browsing. `npm run db:stop` stops either profile; `npm run db:reset` remains destructive to all disposable local database and Auth records.

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
