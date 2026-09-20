begin;

create extension if not exists pgtap with schema extensions;
set local search_path = extensions, public, pg_catalog;

select plan(20);

select has_table('app', 'wallet_bindings', 'wallet bindings table exists');

select columns_are(
  'app',
  'wallet_bindings',
  array[
    'id',
    'run_id',
    'cluster',
    'wallet_address',
    'owner_type',
    'profile_id',
    'organization_id',
    'bound_by_auth_user_id',
    'provenance',
    'status',
    'verified_at',
    'revoked_at',
    'created_at',
    'updated_at'
  ],
  'wallet bindings expose the locked fourteen-column contract'
);

select has_function(
  'app',
  'enroll_prepared_personal_identity',
  array['uuid', 'text', 'text', 'text', 'text'],
  'prepared personal enrollment function exists'
);

select has_function(
  'app',
  'current_prepared_personal_identity',
  array['uuid', 'text', 'text', 'text', 'text'],
  'current prepared identity function exists'
);

select ok(
  (
    select relrowsecurity and relforcerowsecurity
    from pg_class
    where oid = 'app.wallet_bindings'::regclass
  ),
  'wallet bindings enable and force row-level security'
);

select is(
  (
    select role_record.rolname
    from pg_class table_record
    join pg_roles role_record on role_record.oid = table_record.relowner
    where table_record.oid = 'app.wallet_bindings'::regclass
  ),
  'app_owner',
  'app_owner owns wallet bindings'
);

select ok(
  has_function_privilege(
    'app_runtime',
    'app.enroll_prepared_personal_identity(uuid,text,text,text,text)',
    'execute'
  ),
  'app_runtime may execute prepared enrollment'
);

select ok(
  has_function_privilege(
    'app_runtime',
    'app.current_prepared_personal_identity(uuid,text,text,text,text)',
    'execute'
  ),
  'app_runtime may read only the prepared current identity function'
);

select ok(
  not has_function_privilege(
    'anon',
    'app.enroll_prepared_personal_identity(uuid,text,text,text,text)',
    'execute'
  ),
  'anon cannot execute prepared enrollment'
);

select is(
  (
    select count(*)::integer
    from pg_indexes
    where schemaname = 'app'
      and indexname in (
        'wallet_bindings_active_wallet_owner_idx',
        'wallet_bindings_active_personal_profile_idx',
        'wallet_bindings_active_organization_idx',
        'wallet_bindings_active_personal_auth_user_idx',
        'wallet_bindings_auth_user_status_run_idx'
      )
  ),
  5,
  'all wallet ownership and lookup indexes exist'
);

select is(
  (
    select count(*)::integer
    from pg_policies
    where schemaname = 'app'
      and policyname like '%identity_enrollment%'
  ),
  6,
  'only the six narrow enrollment policies exist'
);

insert into auth.users (id, is_sso_user, is_anonymous)
values
  ('91000000-0000-4000-8000-000000000001', false, false),
  ('91000000-0000-4000-8000-000000000002', false, false),
  ('91000000-0000-4000-8000-000000000003', false, false);

insert into app.profiles (
  id, slug, display_name, initials, bio, avatar_color, record_source
)
values
  (
    '91000000-0000-4000-8000-000000000010',
    'identity-test-person',
    'Identity Test Person',
    'IT',
    'Disposable identity fixture',
    'blue',
    'fixture'
  ),
  (
    '91000000-0000-4000-8000-000000000011',
    'identity-inactive-person',
    'Identity Inactive Person',
    'II',
    'Disposable inactive identity fixture',
    'blue',
    'fixture'
  );

insert into app.demo_run_memberships (
  run_id, profile_id, role, status, joined_at, revoked_at
)
values
  (
    '20000000-0000-4000-8000-000000000001',
    '91000000-0000-4000-8000-000000000010',
    'member',
    'active',
    statement_timestamp(),
    null
  ),
  (
    '20000000-0000-4000-8000-000000000001',
    '91000000-0000-4000-8000-000000000011',
    'member',
    'revoked',
    statement_timestamp(),
    statement_timestamp()
  );

set local role app_runtime;
select set_config(
  'app.test_direct_binding_count',
  (select count(*)::text from app.wallet_bindings),
  true
);

select set_config(
  'app.test_enrolled_name',
  (
    select identity_display_name
    from app.enroll_prepared_personal_identity(
      '91000000-0000-4000-8000-000000000001',
      'local-foundation-2030',
      'identity-test-person',
      'solana:devnet',
      '7YWHMfk9JZe1LM1W7mFDJH8QvJ75zEQY4zBbDx8kPn9M'
    )
  ),
  true
);

select set_config(
  'app.test_first_binding_id',
  (
    select identity_wallet_binding_id::text
    from app.enroll_prepared_personal_identity(
      '91000000-0000-4000-8000-000000000001',
      'local-foundation-2030',
      'identity-test-person',
      'solana:devnet',
      '7YWHMfk9JZe1LM1W7mFDJH8QvJ75zEQY4zBbDx8kPn9M'
    )
  ),
  true
);

select set_config(
  'app.test_current_binding_id',
  (
    select identity_wallet_binding_id::text
    from app.current_prepared_personal_identity(
      '91000000-0000-4000-8000-000000000001',
      'local-foundation-2030',
      'identity-test-person',
      'solana:devnet',
      '7YWHMfk9JZe1LM1W7mFDJH8QvJ75zEQY4zBbDx8kPn9M'
    )
  ),
  true
);

reset role;

select throws_ok(
  $$
    select *
    from app.enroll_prepared_personal_identity(
      '91000000-0000-4000-8000-000000000003',
      'local-foundation-2030',
      'identity-inactive-person',
      'solana:devnet',
      '11111111111111111111111111111111'
    )
  $$::text,
  'P0001'::character(5),
  'prepared identity enrollment is unavailable'::text,
  'an inactive dataset participant cannot enroll'::text
);

select ok(
  (
    select auth_user_id is null
    from app.profiles
    where slug = 'identity-inactive-person'
  )
  and not exists (
    select 1
    from app.wallet_bindings
    where profile_id = '91000000-0000-4000-8000-000000000011'
  ),
  'failed inactive enrollment leaves no partial profile claim or binding'
);

select throws_ok(
  $$
    select *
    from app.enroll_prepared_personal_identity(
      '91000000-0000-4000-8000-000000000002',
      'local-foundation-2030',
      'identity-test-person',
      'solana:devnet',
      '9xQeWvG816bUx9EPfDdSpq5Bg6DXyAzQfQ54qVZ4T2QJ'
    )
  $$::text,
  'P0001'::character(5),
  'prepared identity enrollment conflicts with existing state'::text,
  'another Auth subject cannot claim the prepared profile'::text
);

select is(
  current_setting('app.test_direct_binding_count')::integer,
  0,
  'direct app_runtime reads remain default-denied'
);

select is(
  current_setting('app.test_enrolled_name'),
  'Identity Test Person',
  'the narrow function enrolls the prepared fixture'
);

select is(
  (select count(*)::integer from app.wallet_bindings),
  1,
  'idempotent enrollment creates one binding'
);

select is(
  (
    select auth_user_id::text
    from app.profiles
    where slug = 'identity-test-person'
  ),
  '91000000-0000-4000-8000-000000000001',
  'enrollment claims the profile for the verified Auth subject'
);

select is(
  current_setting('app.test_first_binding_id'),
  current_setting('app.test_current_binding_id'),
  'current identity returns the same durable binding'
);

select throws_ok(
  $$
    insert into app.wallet_bindings (
      run_id,
      cluster,
      wallet_address,
      owner_type,
      profile_id,
      organization_id,
      bound_by_auth_user_id,
      provenance
    )
    values (
      '20000000-0000-4000-8000-000000000001',
      'solana:devnet',
      '11111111111111111111111111111111',
      'personal',
      '91000000-0000-4000-8000-000000000010',
      '30000000-0000-4000-8000-000000000001',
      '91000000-0000-4000-8000-000000000001',
      'prepared'
    )
  $$::text,
  '23514'::character(5),
  null::text,
  'one binding cannot target a profile and organization together'::text
);

select * from finish();
rollback;
