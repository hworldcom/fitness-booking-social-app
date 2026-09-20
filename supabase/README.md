# Local database operations

This directory owns RepX Club's checked-in Supabase PostgreSQL history. The SQL files under `migrations/` are the only applied migration source of truth; Drizzle mirrors them for typed server queries and must not create a second migration journal.

## Local workflow

Prerequisites are Node.js 20.9 or newer, the locked npm dependencies and a running Docker-compatible container runtime. RepX Club's database uses port `55322` so it can coexist with another project using Supabase's default `5432x` range. The DEV0015 start command excludes Auth, Realtime, Storage, Studio, the Data API and other auxiliary containers because this foundation validates PostgreSQL only; the feature ticket that first needs a service must enable and validate it.

```sh
npm ci
npm run db:start
npm run db:reset
npm run db:test
npm run test:db
npm run db:lint
```

`db:reset` is destructive only to this repository's disposable local database: it recreates the database from `migrations/` and then runs `seed.sql`. Run `npm run db:seed` again against the same local database to verify that fixture inserts remain idempotent. That script uses Postgres.js and a fixed loopback-only development URL because Supabase CLI 2.117.0 no longer applies general SQL through `supabase seed --local`; it cannot target a hosted database. Stop this repository's stack with `npm run db:stop`.

The local integration test uses Supabase's disposable `postgres` credential on `127.0.0.1:55322`; it is not an application credential. The frontend preview does not read `DATABASE_URL`, initialize a database client or require this stack.

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
