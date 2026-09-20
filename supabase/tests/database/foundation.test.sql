begin;

create extension if not exists pgtap with schema extensions;
set local search_path = extensions, public, pg_catalog;

select plan(23);

select has_schema('app', 'app schema exists');

select is(
  (
    select count(*)::integer
    from information_schema.tables
    where table_schema = 'app'
      and table_type = 'BASE TABLE'
      and table_name in (
        'profiles',
        'demo_runs',
        'demo_run_memberships',
        'organizations',
        'organization_memberships',
        'venues',
        'venue_staff',
        'trainer_affiliations',
        'class_sessions',
        'membership_entitlements'
      )
  ),
  10,
  'app schema has exactly ten foundation tables'
);

select ok(
  (
    select bool_and(c.relrowsecurity)
    from pg_class c
    join pg_namespace n on n.oid = c.relnamespace
    where n.nspname = 'app' and c.relkind = 'r'
  ),
  'RLS is enabled on every app table'
);

select ok(
  (
    select bool_and(c.relforcerowsecurity)
    from pg_class c
    join pg_namespace n on n.oid = c.relnamespace
    where n.nspname = 'app' and c.relkind = 'r'
  ),
  'RLS is forced on every app table'
);

select is(
  (
    select count(*)::integer
    from pg_class c
    join pg_namespace n on n.oid = c.relnamespace
    join pg_roles r on r.oid = c.relowner
    where n.nspname = 'app'
      and c.relkind = 'r'
      and r.rolname = 'app_owner'
      and c.relname in (
        'profiles',
        'demo_runs',
        'demo_run_memberships',
        'organizations',
        'organization_memberships',
        'venues',
        'venue_staff',
        'trainer_affiliations',
        'class_sessions',
        'membership_entitlements'
      )
  ),
  10,
  'app_owner owns every foundation table'
);

select ok(
  exists (select 1 from pg_roles where rolname = 'app_owner'),
  'app_owner role exists'
);

select ok(
  exists (select 1 from pg_roles where rolname = 'app_runtime'),
  'app_runtime role exists'
);

select ok(
  (
    select not rolsuper and not rolcreatedb and not rolcreaterole
      and not rolcanlogin and not rolbypassrls
    from pg_roles
    where rolname = 'app_owner'
  ),
  'app_owner has no login or elevated cluster privileges'
);

select ok(
  (
    select not rolsuper and not rolcreatedb and not rolcreaterole
      and not rolcanlogin and not rolbypassrls
    from pg_roles
    where rolname = 'app_runtime'
  ),
  'app_runtime has no login or elevated cluster privileges'
);

select ok(
  has_schema_privilege('app_runtime', 'app', 'usage'),
  'app_runtime may use the private app schema'
);

select ok(
  not has_schema_privilege('anon', 'app', 'usage'),
  'anon cannot use the app schema'
);

select ok(
  not has_schema_privilege('authenticated', 'app', 'usage'),
  'authenticated cannot use the app schema directly'
);

select ok(
  not has_schema_privilege('service_role', 'app', 'usage'),
  'service_role cannot use the app schema directly'
);

select is((select count(*)::integer from app.profiles), 6, 'six profiles are seeded');
select is((select count(*)::integer from app.class_sessions), 3, 'three classes are seeded');
select is(
  (select count(*)::integer from app.membership_entitlements),
  1,
  'one membership entitlement is seeded'
);

select ok(
  not exists (select 1 from app.profiles where auth_user_id is not null),
  'fixture profiles remain unclaimed'
);

select is(
  (
    select count(*)::integer
    from pg_indexes
    where schemaname = 'app'
      and indexname in (
        'class_sessions_run_starts_at_idx',
        'class_sessions_run_venue_starts_at_idx',
        'class_sessions_run_discipline_starts_at_idx'
      )
  ),
  3,
  'class schedule lookup indexes exist'
);

select is(
  (
    with expected(table_name, column_count) as (
      values
        ('profiles', 11),
        ('demo_runs', 11),
        ('demo_run_memberships', 8),
        ('organizations', 10),
        ('organization_memberships', 8),
        ('venues', 16),
        ('venue_staff', 8),
        ('trainer_affiliations', 8),
        ('class_sessions', 19),
        ('membership_entitlements', 11)
    ),
    actual as (
      select table_name, count(*)::integer as column_count
      from information_schema.columns
      where table_schema = 'app'
        and table_name in (select expected.table_name from expected)
      group by table_name
    )
    select count(*)::integer
    from expected
    full join actual using (table_name, column_count)
    where expected.table_name is null or actual.table_name is null
  ),
  0,
  'every foundation table has its exact planned column count'
);

select is(
  (
    select count(*)::integer
    from pg_constraint constraint_record
    join pg_namespace namespace_record
      on namespace_record.oid = constraint_record.connamespace
    join pg_class table_record on table_record.oid = constraint_record.conrelid
    where namespace_record.nspname = 'app'
      and constraint_record.contype = 'f'
      and table_record.relname in (
        'profiles',
        'demo_runs',
        'demo_run_memberships',
        'organizations',
        'organization_memberships',
        'venues',
        'venue_staff',
        'trainer_affiliations',
        'class_sessions',
        'membership_entitlements'
      )
  ),
  15,
  'all fifteen foundation foreign keys exist'
);

select is(
  (
    select count(*)::integer
    from pg_trigger trigger_record
    join pg_class table_record on table_record.oid = trigger_record.tgrelid
    join pg_namespace namespace_record on namespace_record.oid = table_record.relnamespace
    where namespace_record.nspname = 'app'
      and not trigger_record.tgisinternal
      and trigger_record.tgname like '%_set_updated_at'
      and table_record.relname in (
        'profiles',
        'demo_runs',
        'demo_run_memberships',
        'organizations',
        'organization_memberships',
        'venues',
        'venue_staff',
        'trainer_affiliations',
        'class_sessions',
        'membership_entitlements'
      )
  ),
  10,
  'every foundation table maintains updated_at'
);

select is(
  (
    with expected(index_name) as (
      values
        ('demo_runs_one_active_public_idx'),
        ('demo_runs_status_visibility_idx'),
        ('demo_run_memberships_profile_status_run_idx'),
        ('organizations_run_kind_status_idx'),
        ('organization_memberships_run_profile_status_idx'),
        ('venues_run_kind_status_idx'),
        ('venues_activity_tags_idx'),
        ('venue_staff_run_profile_status_idx'),
        ('trainer_affiliations_run_profile_status_idx'),
        ('trainer_affiliations_activity_tags_idx'),
        ('class_sessions_run_starts_at_idx'),
        ('class_sessions_run_venue_starts_at_idx'),
        ('class_sessions_run_discipline_starts_at_idx'),
        ('membership_entitlements_lookup_idx')
    )
    select count(*)::integer
    from expected
    left join pg_indexes
      on pg_indexes.schemaname = 'app'
      and pg_indexes.indexname = expected.index_name
    where pg_indexes.indexname is null
  ),
  0,
  'all required lookup and GIN indexes exist'
);

do $constraint_test$
begin
  begin
    insert into app.class_sessions (
      id, run_id, venue_id, trainer_profile_id, slug, title, description,
      discipline, timezone, currency_code, starts_at, ends_at, capacity,
      price_base_units, membership_eligible, status, record_source
    )
    select
      gen_random_uuid(), run_id, venue_id, trainer_profile_id,
      'invalid-sql-test-price', title, description, discipline, timezone,
      currency_code, starts_at, ends_at, capacity, -1,
      membership_eligible, status, record_source
    from app.class_sessions
    limit 1;
    raise exception 'negative class price was accepted';
  exception when check_violation then
    null;
  end;
end
$constraint_test$;

do $time_constraint_test$
begin
  begin
    insert into app.class_sessions (
      id, run_id, venue_id, trainer_profile_id, slug, title, description,
      discipline, timezone, currency_code, starts_at, ends_at, capacity,
      price_base_units, membership_eligible, status, record_source
    )
    select
      gen_random_uuid(), run_id, venue_id, trainer_profile_id,
      'invalid-sql-test-time', title, description, discipline, timezone,
      currency_code, starts_at, starts_at, capacity, price_base_units,
      membership_eligible, status, record_source
    from app.class_sessions
    limit 1;
    raise exception 'invalid class interval was accepted';
  exception when check_violation then
    null;
  end;
end
$time_constraint_test$;

do $duplicate_constraint_test$
declare
  membership_record app.demo_run_memberships%rowtype;
begin
  select * into membership_record from app.demo_run_memberships limit 1;
  begin
    insert into app.demo_run_memberships (
      run_id,
      profile_id,
      role,
      status,
      joined_at,
      revoked_at,
      created_at,
      updated_at
    )
    values (
      membership_record.run_id,
      membership_record.profile_id,
      membership_record.role,
      membership_record.status,
      membership_record.joined_at,
      membership_record.revoked_at,
      membership_record.created_at,
      membership_record.updated_at
    );
    raise exception 'duplicate run membership was accepted';
  exception when unique_violation then
    null;
  end;
end
$duplicate_constraint_test$;

do $cross_run_constraint_test$
declare
  original_run uuid := '20000000-0000-4000-8000-000000000001';
  other_run uuid := '90000000-0000-4000-8000-000000000001';
  other_organization uuid := '90000000-0000-4000-8000-000000000002';
begin
  insert into app.demo_runs (
    id, slug, name, status, catalogue_visibility, schedule_anchor_date,
    starts_at, ends_at
  )
  values (
    other_run, 'cross-run-test', 'Cross-run test', 'prepared', 'private',
    '2031-01-01', '2031-01-01T00:00:00Z', '2031-01-02T00:00:00Z'
  );

  insert into app.organizations (
    id, run_id, slug, name, description, kind, status, record_source
  )
  values (
    other_organization, other_run, 'cross-run-owner', 'Cross-run owner',
    'Constraint fixture', 'gym', 'active', 'fixture'
  );

  begin
    insert into app.venues (
      id, run_id, organization_id, slug, name, area, city, country_code,
      timezone, description, kind, status, record_source, activity_tags
    )
    values (
      gen_random_uuid(), original_run, other_organization,
      'invalid-cross-run-venue', 'Invalid cross-run venue', 'Kreuzberg',
      'Berlin', 'DE', 'Europe/Berlin', 'Must fail', 'gym', 'active',
      'fixture', array['Strength']
    );
    raise exception 'cross-run venue relationship was accepted';
  exception when foreign_key_violation then
    null;
  end;
end
$cross_run_constraint_test$;

set local role app_runtime;
select set_config(
  'app.test_runtime_profile_count',
  (select count(*)::text from app.profiles),
  true
);
reset role;
select is(
  current_setting('app.test_runtime_profile_count')::integer,
  0,
  'default-deny RLS hides profiles from app_runtime'
);

select * from finish();
rollback;
