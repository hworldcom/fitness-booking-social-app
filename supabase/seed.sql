insert into app.profiles (
  id,
  auth_user_id,
  slug,
  display_name,
  initials,
  bio,
  avatar_color,
  record_source,
  claimed_at,
  created_at,
  updated_at
)
values
  ('10000000-0000-4000-8000-000000000001', null, 'anna-klein', 'Anna Klein', 'AK', 'Here for the movement, staying for the people.', 'lime', 'fixture', null, '2026-09-20T00:00:00Z', '2026-09-20T00:00:00Z'),
  ('10000000-0000-4000-8000-000000000002', null, 'daniel-park', 'Daniel Park', 'DP', 'Runs on good coffee', 'peach', 'fixture', null, '2026-09-20T00:00:00Z', '2026-09-20T00:00:00Z'),
  ('10000000-0000-4000-8000-000000000003', null, 'lea-weber', 'Lea Weber', 'LW', 'Yoga & everyday movement', 'lavender', 'fixture', null, '2026-09-20T00:00:00Z', '2026-09-20T00:00:00Z'),
  ('10000000-0000-4000-8000-000000000004', null, 'max-mueller', 'Max Müller', 'MM', 'Always up for one more rep', 'blue', 'fixture', null, '2026-09-20T00:00:00Z', '2026-09-20T00:00:00Z'),
  ('10000000-0000-4000-8000-000000000005', null, 'kru-sam', 'Kru Sam', 'KS', 'Muay Thai coach at Kru Tiger', 'orange', 'fixture', null, '2026-09-20T00:00:00Z', '2026-09-20T00:00:00Z'),
  ('10000000-0000-4000-8000-000000000006', null, 'maya-fischer', 'Maya Fischer', 'MF', 'Strength coach at Fabrik Training', 'blue', 'fixture', null, '2026-09-20T00:00:00Z', '2026-09-20T00:00:00Z')
on conflict do nothing;

insert into app.demo_runs (
  id,
  slug,
  name,
  status,
  catalogue_visibility,
  schedule_anchor_date,
  starts_at,
  ends_at,
  retired_at,
  created_at,
  updated_at
)
values (
  '20000000-0000-4000-8000-000000000001',
  'local-foundation-2030',
  'Local foundation run',
  'active',
  'public',
  '2030-09-23',
  '2030-09-22T22:00:00Z',
  '2030-10-22T22:00:00Z',
  null,
  '2026-09-20T00:00:00Z',
  '2026-09-20T00:00:00Z'
)
on conflict do nothing;

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
values
  ('20000000-0000-4000-8000-000000000001', '10000000-0000-4000-8000-000000000001', 'member', 'active', '2026-09-20T00:00:00Z', null, '2026-09-20T00:00:00Z', '2026-09-20T00:00:00Z'),
  ('20000000-0000-4000-8000-000000000001', '10000000-0000-4000-8000-000000000002', 'member', 'active', '2026-09-20T00:00:00Z', null, '2026-09-20T00:00:00Z', '2026-09-20T00:00:00Z'),
  ('20000000-0000-4000-8000-000000000001', '10000000-0000-4000-8000-000000000003', 'member', 'active', '2026-09-20T00:00:00Z', null, '2026-09-20T00:00:00Z', '2026-09-20T00:00:00Z'),
  ('20000000-0000-4000-8000-000000000001', '10000000-0000-4000-8000-000000000004', 'member', 'active', '2026-09-20T00:00:00Z', null, '2026-09-20T00:00:00Z', '2026-09-20T00:00:00Z'),
  ('20000000-0000-4000-8000-000000000001', '10000000-0000-4000-8000-000000000005', 'operator', 'active', '2026-09-20T00:00:00Z', null, '2026-09-20T00:00:00Z', '2026-09-20T00:00:00Z'),
  ('20000000-0000-4000-8000-000000000001', '10000000-0000-4000-8000-000000000006', 'operator', 'active', '2026-09-20T00:00:00Z', null, '2026-09-20T00:00:00Z', '2026-09-20T00:00:00Z')
on conflict do nothing;

insert into app.organizations (
  id,
  run_id,
  slug,
  name,
  description,
  kind,
  status,
  record_source,
  created_at,
  updated_at
)
values
  ('30000000-0000-4000-8000-000000000001', '20000000-0000-4000-8000-000000000001', 'kru-tiger', 'Kru Tiger', 'A welcoming Muay Thai gym in Kreuzberg.', 'gym', 'active', 'fixture', '2026-09-20T00:00:00Z', '2026-09-20T00:00:00Z'),
  ('30000000-0000-4000-8000-000000000002', '20000000-0000-4000-8000-000000000001', 'fabrik-training', 'Fabrik Training', 'Small-group strength training in Neukölln.', 'gym', 'active', 'fixture', '2026-09-20T00:00:00Z', '2026-09-20T00:00:00Z'),
  ('30000000-0000-4000-8000-000000000003', '20000000-0000-4000-8000-000000000001', 'studio-vela', 'Studio Vela', 'Mindful movement and yoga in Prenzlauer Berg.', 'studio', 'active', 'fixture', '2026-09-20T00:00:00Z', '2026-09-20T00:00:00Z'),
  ('30000000-0000-4000-8000-000000000004', '20000000-0000-4000-8000-000000000001', 'sunday-coffee', 'Sunday Coffee', 'A neighbourhood café and community meeting point.', 'cafe', 'active', 'fixture', '2026-09-20T00:00:00Z', '2026-09-20T00:00:00Z')
on conflict do nothing;

insert into app.organization_memberships (
  run_id,
  organization_id,
  profile_id,
  role,
  status,
  created_at,
  updated_at,
  revoked_at
)
values
  ('20000000-0000-4000-8000-000000000001', '30000000-0000-4000-8000-000000000001', '10000000-0000-4000-8000-000000000005', 'primary_admin', 'active', '2026-09-20T00:00:00Z', '2026-09-20T00:00:00Z', null),
  ('20000000-0000-4000-8000-000000000001', '30000000-0000-4000-8000-000000000002', '10000000-0000-4000-8000-000000000006', 'primary_admin', 'active', '2026-09-20T00:00:00Z', '2026-09-20T00:00:00Z', null),
  ('20000000-0000-4000-8000-000000000001', '30000000-0000-4000-8000-000000000003', '10000000-0000-4000-8000-000000000003', 'primary_admin', 'active', '2026-09-20T00:00:00Z', '2026-09-20T00:00:00Z', null)
on conflict do nothing;

insert into app.venues (
  id,
  run_id,
  organization_id,
  slug,
  name,
  area,
  city,
  country_code,
  timezone,
  description,
  kind,
  status,
  record_source,
  activity_tags,
  created_at,
  updated_at
)
values
  ('40000000-0000-4000-8000-000000000001', '20000000-0000-4000-8000-000000000001', '30000000-0000-4000-8000-000000000001', 'kru-tiger', 'Kru Tiger', 'Kreuzberg', 'Berlin', 'DE', 'Europe/Berlin', 'Find your footing with technique, pad work and good people on the mats.', 'gym', 'active', 'fixture', array['Muay Thai'], '2026-09-20T00:00:00Z', '2026-09-20T00:00:00Z'),
  ('40000000-0000-4000-8000-000000000002', '20000000-0000-4000-8000-000000000001', '30000000-0000-4000-8000-000000000002', 'fabrik', 'Fabrik Training', 'Neukölln', 'Berlin', 'DE', 'Europe/Berlin', 'Small groups, thoughtful coaching and encouragement.', 'gym', 'active', 'fixture', array['Strength'], '2026-09-20T00:00:00Z', '2026-09-20T00:00:00Z'),
  ('40000000-0000-4000-8000-000000000003', '20000000-0000-4000-8000-000000000001', '30000000-0000-4000-8000-000000000003', 'vela', 'Studio Vela', 'Prenzlauer Berg', 'Berlin', 'DE', 'Europe/Berlin', 'Gentle movement, mindful breathing and a welcoming community.', 'studio', 'active', 'fixture', array['Yoga'], '2026-09-20T00:00:00Z', '2026-09-20T00:00:00Z'),
  ('40000000-0000-4000-8000-000000000004', '20000000-0000-4000-8000-000000000001', '30000000-0000-4000-8000-000000000004', 'sunday-coffee', 'Sunday Coffee', 'Kreuzberg', 'Berlin', 'DE', 'Europe/Berlin', 'A café meeting point for neighbourhood runs and conversation.', 'cafe', 'active', 'fixture', array['Running'], '2026-09-20T00:00:00Z', '2026-09-20T00:00:00Z')
on conflict do nothing;

insert into app.venue_staff (
  run_id,
  venue_id,
  profile_id,
  role,
  status,
  created_at,
  updated_at,
  revoked_at
)
values (
  '20000000-0000-4000-8000-000000000001',
  '40000000-0000-4000-8000-000000000001',
  '10000000-0000-4000-8000-000000000005',
  'check_in_staff',
  'active',
  '2026-09-20T00:00:00Z',
  '2026-09-20T00:00:00Z',
  null
)
on conflict do nothing;

insert into app.trainer_affiliations (
  run_id,
  venue_id,
  profile_id,
  title,
  activity_tags,
  status,
  created_at,
  updated_at
)
values
  ('20000000-0000-4000-8000-000000000001', '40000000-0000-4000-8000-000000000001', '10000000-0000-4000-8000-000000000005', 'Muay Thai coach', array['Muay Thai'], 'active', '2026-09-20T00:00:00Z', '2026-09-20T00:00:00Z'),
  ('20000000-0000-4000-8000-000000000001', '40000000-0000-4000-8000-000000000002', '10000000-0000-4000-8000-000000000006', 'Strength coach', array['Strength'], 'active', '2026-09-20T00:00:00Z', '2026-09-20T00:00:00Z'),
  ('20000000-0000-4000-8000-000000000001', '40000000-0000-4000-8000-000000000003', '10000000-0000-4000-8000-000000000003', 'Yoga teacher', array['Yoga'], 'active', '2026-09-20T00:00:00Z', '2026-09-20T00:00:00Z')
on conflict do nothing;

insert into app.class_sessions (
  id,
  run_id,
  venue_id,
  trainer_profile_id,
  slug,
  title,
  description,
  discipline,
  timezone,
  currency_code,
  starts_at,
  ends_at,
  capacity,
  price_base_units,
  status,
  record_source,
  created_at,
  updated_at
)
values
  ('50000000-0000-4000-8000-000000000001', '20000000-0000-4000-8000-000000000001', '40000000-0000-4000-8000-000000000001', '10000000-0000-4000-8000-000000000005', 'muay-thai', 'Muay Thai fundamentals', 'A welcoming session covering stance, movement and pad work.', 'Muay Thai', 'Europe/Berlin', 'EURC', '2030-09-24T16:00:00Z', '2030-09-24T17:00:00Z', 4, 12000000, 'scheduled', 'fixture', '2026-09-20T00:00:00Z', '2026-09-20T00:00:00Z'),
  ('50000000-0000-4000-8000-000000000002', '20000000-0000-4000-8000-000000000001', '40000000-0000-4000-8000-000000000002', '10000000-0000-4000-8000-000000000006', 'strength', 'Strength, together', 'A small-group strength session built around good technique.', 'Strength', 'Europe/Berlin', 'EURC', '2030-09-25T15:30:00Z', '2030-09-25T16:20:00Z', 6, 18000000, 'scheduled', 'fixture', '2026-09-20T00:00:00Z', '2026-09-20T00:00:00Z'),
  ('50000000-0000-4000-8000-000000000003', '20000000-0000-4000-8000-000000000001', '40000000-0000-4000-8000-000000000003', '10000000-0000-4000-8000-000000000003', 'sunday-flow', 'Sunday reset flow', 'Gentle movement, spacious breathing and a long stretch.', 'Yoga', 'Europe/Berlin', 'EURC', '2030-09-29T08:00:00Z', '2030-09-29T09:15:00Z', 8, 15000000, 'scheduled', 'fixture', '2026-09-20T00:00:00Z', '2026-09-20T00:00:00Z')
on conflict do nothing;
