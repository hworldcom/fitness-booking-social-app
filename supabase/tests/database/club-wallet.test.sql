begin;

create extension if not exists pgtap with schema extensions;
set local search_path = extensions, public, pg_catalog;

select plan(20);

select has_table(
  'app',
  'organization_wallet_authorities',
  'club wallet authority table exists'
);

select has_column(
  'app',
  'auth_challenges',
  'auth_session_id',
  'club challenges can bind the exact Supabase session'
);

select has_column(
  'app',
  'organization_wallet_authorities',
  'auth_session_id',
  'club authority records bind the exact Supabase session'
);

select ok(
  (
    select relrowsecurity
    from pg_class table_record
    join pg_namespace namespace_record
      on namespace_record.oid = table_record.relnamespace
    where namespace_record.nspname = 'app'
      and table_record.relname = 'organization_wallet_authorities'
  ),
  'club wallet authority table has RLS enabled'
);

select ok(
  (
    select relforcerowsecurity
    from pg_class table_record
    join pg_namespace namespace_record
      on namespace_record.oid = table_record.relnamespace
    where namespace_record.nspname = 'app'
      and table_record.relname = 'organization_wallet_authorities'
  ),
  'club wallet authority table forces RLS'
);

select is(
  (
    select owner.rolname
    from pg_class table_record
    join pg_namespace namespace_record
      on namespace_record.oid = table_record.relnamespace
    join pg_roles owner on owner.oid = table_record.relowner
    where namespace_record.nspname = 'app'
      and table_record.relname = 'organization_wallet_authorities'
  ),
  'app_owner',
  'app_owner owns club wallet authorities'
);

select ok(
  not has_table_privilege(
    'app_runtime',
    'app.organization_wallet_authorities',
    'select'
  ),
  'app_runtime cannot read club authority rows directly'
);

select has_function(
  'app',
  'current_club_wallet_context',
  array[]::text[],
  'bounded club context function exists'
);

select has_function(
  'app',
  'issue_club_wallet_challenge',
  array['uuid', 'text', 'text', 'bytea', 'bytea', 'timestamptz', 'timestamptz'],
  'club challenge issue function exists'
);

select has_function(
  'app',
  'complete_club_wallet_challenge',
  array['uuid', 'text', 'bytea'],
  'club challenge completion function exists'
);

select has_function(
  'app',
  'revoke_club_wallet_authority',
  array[]::text[],
  'club authority revocation function exists'
);

select ok(
  has_function_privilege(
    'app_runtime',
    'app.current_club_wallet_context()',
    'execute'
  ),
  'app_runtime may execute bounded club context lookup'
);

select ok(
  has_function_privilege(
    'app_runtime',
    'app.issue_club_wallet_challenge(uuid,text,text,bytea,bytea,timestamptz,timestamptz)',
    'execute'
  ),
  'app_runtime may issue bounded club challenges'
);

select ok(
  has_function_privilege(
    'app_runtime',
    'app.complete_club_wallet_challenge(uuid,text,bytea)',
    'execute'
  ),
  'app_runtime may complete bounded club challenges'
);

select ok(
  has_function_privilege(
    'app_runtime',
    'app.revoke_club_wallet_authority()',
    'execute'
  ),
  'app_runtime may revoke its current club authority'
);

select ok(
  not has_function_privilege(
    'anon',
    'app.issue_club_wallet_challenge(uuid,text,text,bytea,bytea,timestamptz,timestamptz)',
    'execute'
  )
    and not has_function_privilege(
      'authenticated',
      'app.complete_club_wallet_challenge(uuid,text,bytea)',
      'execute'
    ),
  'public Supabase roles cannot call club wallet functions'
);

select ok(
  exists (
    select 1
    from pg_constraint constraint_record
    join pg_class table_record on table_record.oid = constraint_record.conrelid
    join pg_namespace namespace_record
      on namespace_record.oid = table_record.relnamespace
    where namespace_record.nspname = 'app'
      and table_record.relname = 'auth_challenges'
      and constraint_record.conname = 'auth_challenges_owner_purpose_check'
      and pg_get_constraintdef(constraint_record.oid) like '%authorize-club-wallet%'
  ),
  'shared challenges bind the club purpose to organization ownership'
);

select ok(
  to_regclass('app.organization_memberships_one_active_primary_admin_idx')
    is not null,
  'a club has at most one active primary administrator in the MVP'
);

select is(
  (
    select count(*)::integer
    from pg_indexes
    where schemaname = 'app'
      and indexname in (
        'organization_wallet_authorities_active_actor_idx',
        'organization_wallet_authorities_active_organization_idx',
        'organization_wallet_authorities_expiry_idx'
      )
  ),
  3,
  'club authority has actor, organization and expiry indexes'
);

select is(
  (
    select count(*)::integer
    from pg_policies
    where schemaname = 'app'
      and policyname in (
        'organizations_wallet_management_select',
        'organization_memberships_wallet_management_select',
        'organization_wallet_authorities_wallet_management_all'
      )
  ),
  3,
  'club wallet access uses exactly three narrow management policies'
);

select * from finish();
rollback;
