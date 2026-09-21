import "server-only";

import { and, eq, sql } from "drizzle-orm";
import type { AuthorizedActor } from "@/server/authorization/contracts";
import { databaseConnection, type DatabaseConnection } from "../client";
import { demoRunMemberships, demoRuns, profiles } from "../schema";

export type ActorDatabaseTransaction = Parameters<
  Parameters<DatabaseConnection["db"]["transaction"]>[0]
>[0];

export type ActorProjection = Readonly<{
  profileSlug: string;
  displayName: string;
  runSlug: string;
  runName: string;
  role: "member" | "operator";
}>;

export class ActorContextRejectedError extends Error {
  constructor() {
    super("The verified actor is no longer authorized.");
    this.name = "ActorContextRejectedError";
  }
}

function isActorRole(value: string): value is "member" | "operator" {
  return value === "member" || value === "operator";
}

export async function withActorDatabaseContext<T>(
  actor: AuthorizedActor,
  work: (transaction: ActorDatabaseTransaction) => Promise<T>,
) {
  return databaseConnection().db.transaction(async (transaction) => {
    await transaction.execute(sql`
      select
        set_config('app.current_auth_user_id', ${actor.authUserId}, true),
        set_config('app.current_profile_id', ${actor.profileId}, true),
        set_config('app.current_run_id', ${actor.runId}, true),
        set_config('app.current_run_role', ${actor.runRole}, true),
        set_config(
          'app.current_wallet_binding_id',
          ${actor.walletBindingId},
          true
        )
    `);

    const validation = await transaction.execute<{ is_valid: boolean }>(sql`
      select app.authorized_actor_context_valid(
        ${actor.profileId}::uuid,
        ${actor.runId}::uuid,
        ${actor.runRole}::text
      ) as is_valid
    `);
    if (validation[0]?.is_valid !== true) {
      throw new ActorContextRejectedError();
    }

    return work(transaction);
  });
}

export async function currentActorProjection(
  transaction: ActorDatabaseTransaction,
  actor: AuthorizedActor,
): Promise<ActorProjection> {
  const rows = await transaction
    .select({
      profileSlug: profiles.slug,
      displayName: profiles.displayName,
      runSlug: demoRuns.slug,
      runName: demoRuns.name,
      role: demoRunMemberships.role,
    })
    .from(profiles)
    .innerJoin(
      demoRunMemberships,
      and(
        eq(demoRunMemberships.profileId, profiles.id),
        eq(demoRunMemberships.runId, actor.runId),
      ),
    )
    .innerJoin(demoRuns, eq(demoRuns.id, demoRunMemberships.runId))
    .where(and(eq(profiles.id, actor.profileId), eq(demoRuns.id, actor.runId)));

  const row = rows[0];
  if (rows.length !== 1 || !row || !isActorRole(row.role)) {
    throw new ActorContextRejectedError();
  }
  return Object.freeze({ ...row, role: row.role });
}
