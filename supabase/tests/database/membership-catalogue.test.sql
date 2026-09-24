begin;

create extension if not exists pgtap with schema extensions;
set local search_path = extensions, public, pg_catalog;

select plan(20);

select has_table(
  'app',
  'membership_products',
  'membership product identities exist'
);

select has_table(
  'app',
  'membership_product_versions',
  'versioned membership offer terms exist'
);

select is(
  (
    select owner.rolname
    from pg_class table_record
    join pg_namespace namespace_record
      on namespace_record.oid = table_record.relnamespace
    join pg_roles owner on owner.oid = table_record.relowner
    where namespace_record.nspname = 'app'
      and table_record.relname = 'membership_products'
  ),
  'app_owner',
  'app_owner owns membership products'
);

select is(
  (
    select owner.rolname
    from pg_class table_record
    join pg_namespace namespace_record
      on namespace_record.oid = table_record.relnamespace
    join pg_roles owner on owner.oid = table_record.relowner
    where namespace_record.nspname = 'app'
      and table_record.relname = 'membership_product_versions'
  ),
  'app_owner',
  'app_owner owns membership product versions'
);

select ok(
  (
    select bool_and(table_record.relrowsecurity)
    from pg_class table_record
    join pg_namespace namespace_record
      on namespace_record.oid = table_record.relnamespace
    where namespace_record.nspname = 'app'
      and table_record.relname in (
        'membership_products',
        'membership_product_versions'
      )
  ),
  'membership catalogue tables enable RLS'
);

select ok(
  (
    select bool_and(table_record.relforcerowsecurity)
    from pg_class table_record
    join pg_namespace namespace_record
      on namespace_record.oid = table_record.relnamespace
    where namespace_record.nspname = 'app'
      and table_record.relname in (
        'membership_products',
        'membership_product_versions'
      )
  ),
  'membership catalogue tables force RLS'
);

select ok(
  not has_table_privilege('anon', 'app.membership_products', 'select')
    and not has_table_privilege(
      'authenticated',
      'app.membership_products',
      'select'
    )
    and not has_table_privilege(
      'service_role',
      'app.membership_products',
      'select'
    )
    and not has_table_privilege(
      'anon',
      'app.membership_product_versions',
      'select'
    )
    and not has_table_privilege(
      'authenticated',
      'app.membership_product_versions',
      'select'
    )
    and not has_table_privilege(
      'service_role',
      'app.membership_product_versions',
      'select'
    ),
  'browser-facing roles have no direct membership catalogue access'
);

select is(
  (
    select count(*)::integer
    from pg_policies
    where schemaname = 'app'
      and tablename in (
        'membership_products',
        'membership_product_versions'
      )
  ),
  0,
  'no runtime catalogue policy is opened by the schema ticket'
);

select has_function(
  'app',
  'enforce_membership_product_version_lifecycle',
  array[]::text[],
  'membership version lifecycle trigger function exists'
);

select ok(
  has_function_privilege(
    'app_runtime',
    'app.enforce_membership_product_version_lifecycle()',
    'execute'
  )
    and not has_function_privilege(
      'anon',
      'app.enforce_membership_product_version_lifecycle()',
      'execute'
    )
    and not has_function_privilege(
      'authenticated',
      'app.enforce_membership_product_version_lifecycle()',
      'execute'
    ),
  'only the server runtime can invoke the lifecycle trigger path'
);

select is(
  (select count(*)::integer from app.membership_products),
  2,
  'the two membership product identities are seeded'
);

select is(
  (select count(*)::integer from app.membership_product_versions),
  2,
  'the two membership product versions are seeded'
);

select ok(
  not exists (
    select 1
    from app.membership_product_versions
    where status <> 'draft'
      or price_base_units is not null
      or published_at is not null
      or retired_at is not null
  ),
  'membership fixtures remain unpublished price-pending drafts'
);

select is(
  (
    select count(*)::integer
    from app.membership_product_versions
    where (
      name = 'Annual Unlimited'
      and access_model = 'unlimited'
      and duration_seconds = 31536000
      and initial_entry_allowance is null
    )
      or (
        name = 'Six-Month Flex 12'
        and access_model = 'entry_limited'
        and duration_seconds = 15811200
        and initial_entry_allowance = 12
      )
  ),
  2,
  'fixtures use the two frozen duration and allowance models'
);

select ok(
  not exists (
    select 1
    from app.membership_product_versions
    where not transferable
      or transfer_fee_base_units <> 10000000
      or minimum_hold_seconds <> 2592000
      or minimum_remaining_transfer_seconds <> 2592000
  ),
  'fixture transfer terms use ten EURC and both thirty-day gates'
);

select is(
  (
    with expected(index_name) as (
      values
        ('membership_products_run_organization_status_idx'),
        ('membership_product_versions_run_product_status_idx'),
        ('membership_product_versions_one_published_idx')
    )
    select count(*)::integer
    from expected
    left join pg_indexes
      on pg_indexes.schemaname = 'app'
      and pg_indexes.indexname = expected.index_name
    where pg_indexes.indexname is null
  ),
  0,
  'membership catalogue lookup and single-published-version indexes exist'
);

select is(
  (
    with expected(constraint_name) as (
      values
        ('membership_products_run_organization_fkey'),
        ('membership_products_creator_fkey'),
        ('membership_product_versions_product_fkey'),
        ('membership_product_versions_creator_fkey'),
        ('membership_product_versions_access_terms_check'),
        ('membership_product_versions_transfer_terms_check'),
        ('membership_product_versions_lifecycle_check')
    )
    select count(*)::integer
    from expected
    left join pg_constraint
      on pg_constraint.conname = expected.constraint_name
    where pg_constraint.conname is null
  ),
  0,
  'same-dataset and frozen-term constraints exist'
);

set local role app_runtime;
select set_config(
  'app.test_runtime_membership_catalogue_count',
  (
    (
      select count(*)
      from app.membership_products
    ) + (
      select count(*)
      from app.membership_product_versions
    )
  )::text,
  true
);
reset role;

select is(
  current_setting('app.test_runtime_membership_catalogue_count')::integer,
  0,
  'default-deny RLS hides membership catalogue rows from app_runtime'
);

select ok(
  obj_description('app.membership_products'::regclass, 'pg_class')
    like '%not customer ownership%'
    and obj_description(
      'app.membership_product_versions'::regclass,
      'pg_class'
    ) like '%not purchased entitlements%',
  'table comments distinguish offers from customer entitlements'
);

select ok(
  to_regclass('app.membership_entitlements') is null,
  'the catalogue migration does not recreate customer entitlements'
);

select * from finish();
rollback;
