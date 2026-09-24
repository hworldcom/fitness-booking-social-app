begin;

create extension if not exists pgtap with schema extensions;
set local search_path = extensions, public, pg_catalog;

select plan(23);

select has_function(
  'app',
  'enroll_application_identity',
  array['uuid', 'text'],
  'application profile enrollment function exists'
);

select has_function(
  'app',
  'current_application_identity',
  array['uuid'],
  'current application identity function exists'
);

select hasnt_function(
  'app',
  'enroll_prepared_personal_identity',
  array['uuid', 'text', 'text', 'text', 'text'],
  'prepared wallet enrollment function was removed'
);

select hasnt_function(
  'app',
  'current_prepared_personal_identity',
  array['uuid', 'text', 'text', 'text', 'text'],
  'prepared wallet identity lookup was removed'
);

select ok(
  has_function_privilege(
    'app_runtime',
    'app.enroll_application_identity(uuid,text)',
    'execute'
  ),
  'app_runtime may execute bounded profile enrollment'
);

select ok(
  has_function_privilege(
    'app_runtime',
    'app.current_application_identity(uuid)',
    'execute'
  ),
  'app_runtime may read the current application identity'
);

select ok(
  not has_function_privilege(
    'anon',
    'app.enroll_application_identity(uuid,text)',
    'execute'
  ),
  'anon cannot execute application profile enrollment'
);

select is(
  (
    select count(*)::integer
    from pg_policies
    where schemaname = 'app'
      and policyname like '%application_identity%'
  ),
  5,
  'only five narrow application-identity policies exist'
);

select ok(
  not has_table_privilege('app_runtime', 'app.profiles', 'insert')
    and not has_table_privilege(
      'app_runtime',
      'app.demo_run_participants',
      'insert'
    ),
  'app_runtime cannot write identity tables directly'
);

insert into auth.users (id, is_sso_user, is_anonymous)
values
  ('91000000-0000-4000-8000-000000000001', false, false),
  ('91000000-0000-4000-8000-000000000002', false, false),
  ('91000000-0000-4000-8000-000000000003', false, false);

insert into app.profiles (
  id,
  auth_user_id,
  slug,
  display_name,
  initials,
  bio,
  avatar_color,
  record_source,
  claimed_at
)
values (
  '91000000-0000-4000-8000-000000000010',
  '91000000-0000-4000-8000-000000000003',
  'old-prepared-identity',
  'Old Prepared Identity',
  'OP',
  '',
  'blue',
  'fixture',
  statement_timestamp()
);

set local role app_runtime;

select set_config(
  'app.test_direct_binding_select',
  has_table_privilege(
    current_user,
    'app.wallet_bindings',
    'select'
  )::text,
  true
);

select set_config(
  'app.test_enrolled_name',
  (
    select identity_display_name
    from app.enroll_application_identity(
      '91000000-0000-4000-8000-000000000001',
      '  Email   Person  '
    )
  ),
  true
);

select set_config(
  'app.test_enrolled_profile_id',
  (
    select identity_profile_id::text
    from app.enroll_application_identity(
      '91000000-0000-4000-8000-000000000001',
      'Ignored Retry Name'
    )
  ),
  true
);

select set_config(
  'app.test_current_profile_id',
  (
    select identity_profile_id::text
    from app.current_application_identity(
      '91000000-0000-4000-8000-000000000001'
    )
  ),
  true
);

select set_config(
  'app.test_retry_name',
  (
    select identity_display_name
    from app.enroll_application_identity(
      '91000000-0000-4000-8000-000000000001',
      'Ignored Retry Name'
    )
  ),
  true
);

reset role;

select is(
  current_setting('app.test_direct_binding_select')::boolean,
  false,
  'app_runtime still has no direct wallet-binding read privilege'
);

select is(
  current_setting('app.test_enrolled_name'),
  'Email Person',
  'enrollment normalizes the verified account display name'
);

select matches(
  (
    select slug
    from app.profiles
    where auth_user_id = '91000000-0000-4000-8000-000000000001'
  ),
  '^email-person-910000000000$',
  'the server generates a stable collision-resistant profile slug'
);

select is(
  (
    select count(*)::integer
    from app.profiles
    where auth_user_id = '91000000-0000-4000-8000-000000000001'
  ),
  1,
  'enrollment creates exactly one user profile'
);

select is(
  (
    select count(*)::integer
    from app.demo_run_participants as participant
    join app.profiles as profile on profile.id = participant.profile_id
    where profile.auth_user_id = '91000000-0000-4000-8000-000000000001'
  ),
  1,
  'enrollment creates exactly one dataset-participation row'
);

select is(
  (
    select count(*)::integer
    from app.wallet_bindings as binding
    join app.profiles as profile on profile.id = binding.profile_id
    where profile.auth_user_id = '91000000-0000-4000-8000-000000000001'
  ),
  0,
  'email enrollment creates no wallet binding'
);

select is(
  (
    select participant.role
    from app.demo_run_participants as participant
    join app.profiles as profile on profile.id = participant.profile_id
    where profile.auth_user_id = '91000000-0000-4000-8000-000000000001'
  ),
  'member',
  'signup grants only the ordinary member role'
);

select is(
  (
    select record_source
    from app.profiles
    where auth_user_id = '91000000-0000-4000-8000-000000000001'
  ),
  'user',
  'open signup creates a user-sourced profile'
);

select is(
  current_setting('app.test_enrolled_profile_id'),
  current_setting('app.test_current_profile_id'),
  'current identity returns the same durable profile'
);

select is(
  current_setting('app.test_retry_name'),
  'Email Person',
  'a retry cannot rename or duplicate the existing profile'
);

select throws_ok(
  $$
    select *
    from app.enroll_application_identity(
      '91000000-0000-4000-8000-000000000002',
      'A'
    )
  $$::text,
  'P0001'::character(5),
  'application profile details are invalid'::text,
  'invalid display names are rejected'
);

select is(
  (
    select count(*)::integer
    from app.profiles
    where auth_user_id = '91000000-0000-4000-8000-000000000002'
  ),
  0,
  'invalid enrollment leaves no partial profile'
);

select throws_ok(
  $$
    select *
    from app.enroll_application_identity(
      '91000000-0000-4000-8000-000000000003',
      'Replacement Name'
    )
  $$::text,
  'P0001'::character(5),
  'application identity conflicts with existing state'::text,
  'an old fixture claim cannot become an open user profile'
);

select is(
  (
    select count(*)::integer
    from app.demo_run_participants
    where profile_id = '91000000-0000-4000-8000-000000000010'
  ),
  0,
  'conflicting fixture enrollment creates no partial participation'
);

select * from finish();
rollback;
