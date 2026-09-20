import assert from "node:assert/strict";
import test, { after, before } from "node:test";
import postgres from "postgres";
import {
  currentPreparedPersonalIdentity,
  enrollPreparedPersonalIdentity,
  PreparedIdentityConflictError,
} from "@/server/db/identity/repository";
import { closeDatabaseConnection } from "@/server/db/client";
import type { PreparedPersonalIdentity } from "@/server/identity/config";

const adminConnectionString = process.env.DATABASE_TEST_URL;
if (!adminConnectionString) {
  throw new Error(
    "DATABASE_TEST_URL is required for database integration tests.",
  );
}

const runtimeUrl = new URL(adminConnectionString);
runtimeUrl.username = "repx_runtime_login";
runtimeUrl.password = "postgres";
process.env.DATABASE_URL = runtimeUrl.toString();

const authUserId = "92000000-0000-4000-8000-000000000001";
const conflictingAuthUserId = "92000000-0000-4000-8000-000000000002";
const profileId = "92000000-0000-4000-8000-000000000010";
const runId = "20000000-0000-4000-8000-000000000001";
const walletAddress = "7YWHMfk9JZe1LM1W7mFDJH8QvJ75zEQY4zBbDx8kPn9M";
const conflictingWalletAddress = "9xQeWvG816bUx9EPfDdSpq5Bg6DXyAzQfQ54qVZ4T2QJ";

const identity: PreparedPersonalIdentity = {
  walletAddress,
  profileSlug: "driver-identity-person",
  demoRunSlug: "local-foundation-2030",
  cluster: "solana:devnet",
};

type IdentityFunctionRow = {
  identity_profile_id: string;
  identity_wallet_binding_id: string;
};

const admin = postgres(adminConnectionString, {
  max: 1,
  prepare: false,
  ssl: false,
});
const runtimeA = postgres(runtimeUrl.toString(), {
  max: 1,
  prepare: false,
  ssl: false,
});
const runtimeB = postgres(runtimeUrl.toString(), {
  max: 1,
  prepare: false,
  ssl: false,
});

async function removeFixture() {
  await admin`
    delete from app.wallet_bindings
    where profile_id = ${profileId}::uuid
      or bound_by_auth_user_id in (
        ${authUserId}::uuid,
        ${conflictingAuthUserId}::uuid
      )
  `;
  await admin`
    delete from app.demo_run_memberships
    where profile_id = ${profileId}::uuid
  `;
  await admin`delete from app.profiles where id = ${profileId}::uuid`;
  await admin`
    delete from auth.users
    where id in (${authUserId}::uuid, ${conflictingAuthUserId}::uuid)
  `;
}

before(async () => {
  await removeFixture();
  await admin`
    insert into auth.users (id, is_sso_user, is_anonymous)
    values
      (${authUserId}::uuid, false, false),
      (${conflictingAuthUserId}::uuid, false, false)
  `;
  await admin`
    insert into app.profiles (
      id, slug, display_name, initials, bio, avatar_color, record_source
    )
    values (
      ${profileId}::uuid,
      ${identity.profileSlug},
      'Driver Identity Person',
      'DI',
      'Disposable repository integration fixture',
      'blue',
      'fixture'
    )
  `;
  await admin`
    insert into app.demo_run_memberships (
      run_id, profile_id, role, status, joined_at
    )
    values (
      ${runId}::uuid,
      ${profileId}::uuid,
      'member',
      'active',
      statement_timestamp()
    )
  `;
});

after(async () => {
  await closeDatabaseConnection();
  await runtimeA.end();
  await runtimeB.end();
  await removeFixture();
  await admin.end();
});

test("the login role remains unable to read private identity tables directly", async () => {
  const rows = await runtimeA<{ count: string }[]>`
    select count(*)::text as count from app.wallet_bindings
  `;
  assert.equal(rows[0]?.count, "0");
});

test("simultaneous enrollment and repository retries converge on one binding", async () => {
  const [first, second] = await Promise.all([
    runtimeA<IdentityFunctionRow[]>`
      select identity_profile_id, identity_wallet_binding_id
      from app.enroll_prepared_personal_identity(
        ${authUserId}::uuid,
        ${identity.demoRunSlug}::text,
        ${identity.profileSlug}::text,
        ${identity.cluster}::text,
        ${identity.walletAddress}::text
      )
    `,
    runtimeB<IdentityFunctionRow[]>`
      select identity_profile_id, identity_wallet_binding_id
      from app.enroll_prepared_personal_identity(
        ${authUserId}::uuid,
        ${identity.demoRunSlug}::text,
        ${identity.profileSlug}::text,
        ${identity.cluster}::text,
        ${identity.walletAddress}::text
      )
    `,
  ]);

  assert.equal(first.length, 1);
  assert.equal(second.length, 1);
  assert.equal(first[0]?.identity_profile_id, profileId);
  assert.equal(
    first[0]?.identity_wallet_binding_id,
    second[0]?.identity_wallet_binding_id,
  );

  const retried = await enrollPreparedPersonalIdentity(authUserId, identity);
  const current = await currentPreparedPersonalIdentity(authUserId, identity);
  assert.equal(retried?.walletBindingId, first[0]?.identity_wallet_binding_id);
  assert.deepEqual(current, retried);

  const bindings = await admin<{ count: string }[]>`
    select count(*)::text as count
    from app.wallet_bindings
    where profile_id = ${profileId}::uuid
  `;
  assert.equal(bindings[0]?.count, "1");
});

test("a different Auth subject cannot claim or partially rewrite the actor", async () => {
  await assert.rejects(
    enrollPreparedPersonalIdentity(conflictingAuthUserId, {
      ...identity,
      walletAddress: conflictingWalletAddress,
    }),
    PreparedIdentityConflictError,
  );

  const state = await admin<
    Array<{ auth_user_id: string; binding_count: string }>
  >`
    select
      profile.auth_user_id::text as auth_user_id,
      count(binding.id)::text as binding_count
    from app.profiles as profile
    left join app.wallet_bindings as binding on binding.profile_id = profile.id
    where profile.id = ${profileId}::uuid
    group by profile.auth_user_id
  `;
  assert.equal(state.length, 1);
  assert.deepEqual(
    { ...state[0] },
    {
      auth_user_id: authUserId,
      binding_count: "1",
    },
  );
});
