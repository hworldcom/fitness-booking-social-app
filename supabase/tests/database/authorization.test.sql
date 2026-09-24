begin;

create extension if not exists pgtap with schema extensions;
set local search_path = extensions, public, pg_catalog;

select plan(20);

select has_function(
  'app',
  'authorized_actor_context_valid',
  array['uuid', 'uuid', 'text'],
  'authorized actor validation predicate exists'
);

select ok(
  has_function_privilege(
    'app_runtime',
    'app.authorized_actor_context_valid(uuid,uuid,text)',
    'execute'
  ),
  'app_runtime may execute only the bounded actor predicate'
);

select ok(
  not has_function_privilege(
    'anon',
    'app.authorized_actor_context_valid(uuid,uuid,text)',
    'execute'
  ),
  'anon cannot execute actor validation'
);

select is(
  (
    select count(*)::integer
    from pg_policies
    where schemaname = 'app'
      and policyname in (
        'profiles_authorized_actor_select',
        'demo_runs_authorized_actor_select',
        'demo_run_participants_authorized_actor_select'
      )
  ),
  3,
  'the exact three app_runtime actor policies exist'
);

select ok(
  not has_table_privilege('app_runtime', 'app.wallet_bindings', 'select'),
  'app_runtime cannot read wallet bindings directly'
);

select ok(
  has_table_privilege('app_runtime', 'app.profiles', 'select'),
  'app_runtime may select profiles through row-level security'
);

select ok(
  has_table_privilege('app_runtime', 'app.demo_runs', 'select'),
  'app_runtime may select demo datasets through row-level security'
);

select ok(
  has_table_privilege(
    'app_runtime',
    'app.demo_run_participants',
    'select'
  ),
  'app_runtime may select dataset participation through row-level security'
);

select ok(
  not has_table_privilege('app_runtime', 'app.profiles', 'insert')
    and not has_table_privilege('app_runtime', 'app.profiles', 'update')
    and not has_table_privilege('app_runtime', 'app.profiles', 'delete'),
  'app_runtime has no profile write privilege'
);

select ok(
  not has_table_privilege('app_runtime', 'app.demo_runs', 'insert')
    and not has_table_privilege('app_runtime', 'app.demo_runs', 'update')
    and not has_table_privilege('app_runtime', 'app.demo_runs', 'delete'),
  'app_runtime has no demo-dataset write privilege'
);

select ok(
  not has_table_privilege(
    'app_runtime',
    'app.demo_run_participants',
    'insert'
  )
    and not has_table_privilege(
      'app_runtime',
      'app.demo_run_participants',
      'update'
    )
    and not has_table_privilege(
      'app_runtime',
      'app.demo_run_participants',
      'delete'
    ),
  'app_runtime has no dataset-participation write privilege'
);

insert into auth.users (id, is_sso_user, is_anonymous)
values ('93000000-0000-4000-8000-000000000001', false, false);

set local role app_runtime;

select set_config(
  'app.test_actor_profile_id',
  (
    select identity_profile_id::text
    from app.enroll_application_identity(
      '93000000-0000-4000-8000-000000000001',
      'Authorization Test Person'
    )
  ),
  true
);

select set_config(
  'app.test_missing_profile_count',
  (select count(*)::text from app.profiles),
  true
);

select set_config('app.current_auth_user_id', 'not-a-uuid', true);
select set_config(
  'app.current_profile_id',
  current_setting('app.test_actor_profile_id'),
  true
);
select set_config(
  'app.current_run_id',
  '20000000-0000-4000-8000-000000000001',
  true
);
select set_config('app.current_run_role', 'member', true);
select set_config(
  'app.test_malformed_context_valid',
  app.authorized_actor_context_valid(
    current_setting('app.test_actor_profile_id')::uuid,
    '20000000-0000-4000-8000-000000000001',
    'member'
  )::text,
  true
);

select set_config(
  'app.current_auth_user_id',
  '93000000-0000-4000-8000-000000000001',
  true
);

select set_config(
  'app.test_complete_context_valid',
  app.authorized_actor_context_valid(
    current_setting('app.test_actor_profile_id')::uuid,
    '20000000-0000-4000-8000-000000000001',
    'member'
  )::text,
  true
);

select set_config(
  'app.test_profile_count',
  (select count(*)::text from app.profiles),
  true
);

select set_config(
  'app.test_run_count',
  (select count(*)::text from app.demo_runs),
  true
);

select set_config(
  'app.test_participant_count',
  (select count(*)::text from app.demo_run_participants),
  true
);

select set_config(
  'app.test_other_profile_count',
  (
    select count(*)::text
    from app.profiles
    where id = '10000000-0000-4000-8000-000000000002'
  ),
  true
);

reset role;

select is(
  current_setting('app.test_missing_profile_count')::integer,
  0,
  'missing actor settings reveal no profile rows'
);

select is(
  current_setting('app.test_malformed_context_valid')::boolean,
  false,
  'malformed context fails closed without raising'
);

select is(
  current_setting('app.test_complete_context_valid')::boolean,
  true,
  'the complete verified actor tuple validates'
);

select is(
  current_setting('app.test_profile_count')::integer,
  1,
  'the actor can read only their claimed profile'
);

select is(
  current_setting('app.test_run_count')::integer,
  1,
  'the actor can read only their active demo dataset'
);

select is(
  current_setting('app.test_participant_count')::integer,
  1,
  'the actor can read only their exact active participation row'
);

select is(
  current_setting('app.test_other_profile_count')::integer,
  0,
  'another fixture profile stays hidden'
);

update app.demo_run_participants
set status = 'revoked', revoked_at = statement_timestamp()
where run_id = '20000000-0000-4000-8000-000000000001'
  and profile_id = current_setting('app.test_actor_profile_id')::uuid;

set local role app_runtime;

select set_config(
  'app.test_revoked_context_valid',
  app.authorized_actor_context_valid(
    current_setting('app.test_actor_profile_id')::uuid,
    '20000000-0000-4000-8000-000000000001',
    'member'
  )::text,
  true
);

select set_config(
  'app.test_revoked_profile_count',
  (select count(*)::text from app.profiles),
  true
);

reset role;

select is(
  current_setting('app.test_revoked_context_valid')::boolean,
  false,
  'revoked dataset participation invalidates the actor immediately'
);

select is(
  current_setting('app.test_revoked_profile_count')::integer,
  0,
  'revocation removes the previously readable profile row'
);

select * from finish();
rollback;
