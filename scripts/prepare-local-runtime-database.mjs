import postgres from "postgres";

const localDatabaseUrl =
  "postgresql://postgres:postgres@127.0.0.1:55322/postgres";
const connection = postgres(localDatabaseUrl, {
  max: 1,
  prepare: false,
  ssl: false,
});

try {
  await connection.unsafe(`
    do $$
    begin
      if not exists (
        select 1 from pg_roles where rolname = 'repx_runtime_login'
      ) then
        create role repx_runtime_login
          login password 'postgres'
          nosuperuser nocreatedb nocreaterole inherit nobypassrls;
      else
        alter role repx_runtime_login
          login password 'postgres'
          nosuperuser nocreatedb nocreaterole inherit nobypassrls;
      end if;
    end
    $$;

    grant app_runtime to repx_runtime_login;
  `);
  console.log("Prepared the loopback-only RepX Club runtime database login.");
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
