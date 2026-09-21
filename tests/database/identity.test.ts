import assert from "node:assert/strict";
import test, { after, before } from "node:test";
import { eq, sql } from "drizzle-orm";
import postgres from "postgres";
import type { AuthorizedActor } from "@/server/authorization/contracts";
import {
  ActorContextRejectedError,
  currentActorProjection,
  withActorDatabaseContext,
} from "@/server/db/authorization/repository";
import {
  currentPreparedPersonalIdentity,
  enrollPreparedPersonalIdentity,
  PreparedIdentityConflictError,
} from "@/server/db/identity/repository";
import {
  closeDatabaseConnection,
  databaseConnection,
} from "@/server/db/client";
import { profiles } from "@/server/db/schema";
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
const secondAuthUserId = "92000000-0000-4000-8000-000000000003";
const profileId = "92000000-0000-4000-8000-000000000010";
const secondProfileId = "92000000-0000-4000-8000-000000000011";
const runId = "20000000-0000-4000-8000-000000000001";
const walletAddress = "7YWHMfk9JZe1LM1W7mFDJH8QvJ75zEQY4zBbDx8kPn9M";
const conflictingWalletAddress = "9xQeWvG816bUx9EPfDdSpq5Bg6DXyAzQfQ54qVZ4T2QJ";
const secondWalletAddress = "8opHzTAnfzRpPEx21XtnrVTX28YQuCpAjcn1PczScKh";

const identity: PreparedPersonalIdentity = {
  walletAddress,
  profileSlug: "driver-identity-person",
  demoRunSlug: "local-foundation-2030",
  cluster: "solana:devnet",
};

const secondIdentity: PreparedPersonalIdentity = {
  walletAddress: secondWalletAddress,
  profileSlug: "driver-identity-second-person",
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
    where profile_id in (${profileId}::uuid, ${secondProfileId}::uuid)
      or bound_by_auth_user_id in (
        ${authUserId}::uuid,
        ${conflictingAuthUserId}::uuid,
        ${secondAuthUserId}::uuid
      )
  `;
  await admin`
    delete from app.demo_run_memberships
    where profile_id in (${profileId}::uuid, ${secondProfileId}::uuid)
  `;
  await admin`
    delete from app.profiles
    where id in (${profileId}::uuid, ${secondProfileId}::uuid)
  `;
  await admin`
    delete from auth.users
    where id in (
      ${authUserId}::uuid,
      ${conflictingAuthUserId}::uuid,
      ${secondAuthUserId}::uuid
    )
  `;
}

before(async () => {
  await removeFixture();
  await admin`
    insert into auth.users (id, is_sso_user, is_anonymous)
    values
      (${authUserId}::uuid, false, false),
      (${conflictingAuthUserId}::uuid, false, false),
      (${secondAuthUserId}::uuid, false, false)
  `;
  await admin`
    insert into app.profiles (
      id, slug, display_name, initials, bio, avatar_color, record_source
    )
    values
      (
        ${profileId}::uuid,
        ${identity.profileSlug},
        'Driver Identity Person',
        'DI',
        'Disposable repository integration fixture',
        'blue',
        'fixture'
      ),
      (
        ${secondProfileId}::uuid,
        ${secondIdentity.profileSlug},
        'Driver Identity Second Person',
        'DS',
        'Second disposable authorization fixture',
        'purple',
        'fixture'
      )
  `;
  await admin`
    insert into app.demo_run_memberships (
      run_id, profile_id, role, status, joined_at
    )
    values
      (
        ${runId}::uuid,
        ${profileId}::uuid,
        'member',
        'active',
        statement_timestamp()
      ),
      (
        ${runId}::uuid,
        ${secondProfileId}::uuid,
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

test("the login role has no direct wallet-binding table privilege", async () => {
  await assert.rejects(
    runtimeA`select count(*) from app.wallet_bindings`,
    /permission denied for table wallet_bindings/,
  );
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

function authorizedActor(
  authUser: string,
  record: NonNullable<
    Awaited<ReturnType<typeof enrollPreparedPersonalIdentity>>
  >,
): AuthorizedActor {
  assert.equal(record.role, "member");
  return Object.freeze({
    authUserId: authUser,
    profileId: record.profileId,
    runId: record.runId,
    runRole: "member",
    walletBindingId: record.walletBindingId,
    walletAddress: record.walletAddress,
    walletCluster: record.cluster,
  });
}

async function assertPooledContextCleared() {
  const rows = await databaseConnection().queryClient<
    Array<{
      auth_user_id: string | null;
      profile_id: string | null;
      run_id: string | null;
      run_role: string | null;
      wallet_binding_id: string | null;
    }>
  >`
    select
      nullif(current_setting('app.current_auth_user_id', true), '') as auth_user_id,
      nullif(current_setting('app.current_profile_id', true), '') as profile_id,
      nullif(current_setting('app.current_run_id', true), '') as run_id,
      nullif(current_setting('app.current_run_role', true), '') as run_role,
      nullif(current_setting('app.current_wallet_binding_id', true), '') as wallet_binding_id
  `;
  assert.deepEqual(
    { ...rows[0] },
    {
      auth_user_id: null,
      profile_id: null,
      run_id: null,
      run_role: null,
      wallet_binding_id: null,
    },
  );
}

test("transaction-local actor context isolates alternating users and failures", async () => {
  const firstRecord = await enrollPreparedPersonalIdentity(
    authUserId,
    identity,
  );
  const secondRecord = await enrollPreparedPersonalIdentity(
    secondAuthUserId,
    secondIdentity,
  );
  assert.ok(firstRecord);
  assert.ok(secondRecord);

  const firstActor = authorizedActor(authUserId, firstRecord);
  const secondActor = authorizedActor(secondAuthUserId, secondRecord);

  const firstProjection = await withActorDatabaseContext(
    firstActor,
    async (transaction) => {
      const settings = await transaction.execute<{
        auth_user_id: string;
        profile_id: string;
        run_id: string;
        run_role: string;
        wallet_binding_id: string;
      }>(sql`
        select
          current_setting('app.current_auth_user_id') as auth_user_id,
          current_setting('app.current_profile_id') as profile_id,
          current_setting('app.current_run_id') as run_id,
          current_setting('app.current_run_role') as run_role,
          current_setting('app.current_wallet_binding_id') as wallet_binding_id
      `);
      assert.deepEqual(
        { ...settings[0] },
        {
          auth_user_id: firstActor.authUserId,
          profile_id: firstActor.profileId,
          run_id: firstActor.runId,
          run_role: firstActor.runRole,
          wallet_binding_id: firstActor.walletBindingId,
        },
      );

      const hiddenProfiles = await transaction
        .select({ id: profiles.id })
        .from(profiles)
        .where(eq(profiles.id, secondProfileId));
      assert.deepEqual(hiddenProfiles, []);
      return currentActorProjection(transaction, firstActor);
    },
  );
  assert.equal(firstProjection.profileSlug, identity.profileSlug);
  await assertPooledContextCleared();

  const secondProjection = await withActorDatabaseContext(
    secondActor,
    (transaction) => currentActorProjection(transaction, secondActor),
  );
  assert.equal(secondProjection.profileSlug, secondIdentity.profileSlug);
  await assertPooledContextCleared();

  await assert.rejects(
    withActorDatabaseContext(firstActor, async (transaction) => {
      transaction.rollback();
    }),
    /rollback/i,
  );
  await assertPooledContextCleared();

  await assert.rejects(
    withActorDatabaseContext(firstActor, async () => {
      throw new Error("forced actor callback failure");
    }),
    /forced actor callback failure/,
  );
  await assertPooledContextCleared();

  const projectionAfterFailures = await withActorDatabaseContext(
    secondActor,
    (transaction) => currentActorProjection(transaction, secondActor),
  );
  assert.equal(projectionAfterFailures.profileSlug, secondIdentity.profileSlug);

  await assert.rejects(
    withActorDatabaseContext(
      { ...firstActor, walletBindingId: secondActor.walletBindingId },
      async () => undefined,
    ),
    ActorContextRejectedError,
  );

  await admin`
    update app.demo_run_memberships
    set status = 'revoked', revoked_at = statement_timestamp()
    where run_id = ${runId}::uuid
      and profile_id = ${secondProfileId}::uuid
  `;
  await assert.rejects(
    withActorDatabaseContext(secondActor, async () => undefined),
    ActorContextRejectedError,
  );
  await assertPooledContextCleared();
});
