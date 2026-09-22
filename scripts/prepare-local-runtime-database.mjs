import postgres from "postgres";

const localDatabaseUrl =
  "postgresql://postgres:postgres@127.0.0.1:55322/postgres";
const connection = postgres(localDatabaseUrl, {
  max: 1,
  prepare: false,
  ssl: false,
});

try {
  const existing = await connection`
    select
      runtime.rolcanlogin,
      runtime.rolsuper,
      runtime.rolcreatedb,
      runtime.rolcreaterole,
      runtime.rolinherit,
      runtime.rolbypassrls,
      exists (
        select 1
        from pg_auth_members as membership
        where membership.roleid = owner.oid
          and membership.member = runtime.oid
      ) as has_runtime_membership
    from pg_roles as runtime
    cross join pg_roles as owner
    where runtime.rolname = 'repx_runtime_login'
      and owner.rolname = 'app_runtime'
  `;

  if (existing.length === 0) {
    await connection.unsafe(`
      create role repx_runtime_login
        login password 'postgres'
        nosuperuser nocreatedb nocreaterole inherit nobypassrls;
      grant app_runtime to repx_runtime_login;
    `);
  } else {
    const role = existing[0];
    if (
      role.rolcanlogin !== true ||
      role.rolsuper !== false ||
      role.rolcreatedb !== false ||
      role.rolcreaterole !== false ||
      role.rolinherit !== true ||
      role.rolbypassrls !== false ||
      role.has_runtime_membership !== true
    ) {
      throw new Error(
        "The existing loopback runtime role has unexpected privileges; reset the disposable local database before continuing.",
      );
    }
  }
  console.log("Prepared the loopback-only MovX Club runtime database login.");
} catch (error) {
  const message =
    error instanceof Error
      ? error.message.replaceAll(localDatabaseUrl, "[redacted]")
      : "Unknown database error";
  console.error(`Local runtime database setup failed: ${message}`);
  process.exitCode = 1;
} finally {
  await connection.end({ timeout: 5 });
}
