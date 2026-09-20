import "server-only";

import type { PreparedPersonalIdentity } from "@/server/identity/config";
import { databaseConnection } from "../client";

type PreparedIdentityRow = Readonly<{
  identity_profile_id: string;
  identity_profile_slug: string;
  identity_display_name: string;
  identity_run_id: string;
  identity_run_slug: string;
  identity_run_name: string;
  identity_role: string;
  identity_wallet_binding_id: string;
  identity_wallet_address: string;
  identity_cluster: "solana:devnet";
}>;

export type PreparedIdentityRecord = Readonly<{
  profileId: string;
  profileSlug: string;
  displayName: string;
  runId: string;
  runSlug: string;
  runName: string;
  role: string;
  walletBindingId: string;
  walletAddress: string;
  cluster: "solana:devnet";
}>;

export class PreparedIdentityConflictError extends Error {
  constructor() {
    super("Prepared identity enrollment conflicts with existing state.");
    this.name = "PreparedIdentityConflictError";
  }
}

function mapIdentity(row: PreparedIdentityRow): PreparedIdentityRecord {
  return Object.freeze({
    profileId: row.identity_profile_id,
    profileSlug: row.identity_profile_slug,
    displayName: row.identity_display_name,
    runId: row.identity_run_id,
    runSlug: row.identity_run_slug,
    runName: row.identity_run_name,
    role: row.identity_role,
    walletBindingId: row.identity_wallet_binding_id,
    walletAddress: row.identity_wallet_address,
    cluster: row.identity_cluster,
  });
}

function isPreparedIdentityConflict(error: unknown) {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    error.code === "P0001"
  );
}

async function callIdentityFunction(
  functionName:
    "enroll_prepared_personal_identity" | "current_prepared_personal_identity",
  authUserId: string,
  identity: PreparedPersonalIdentity,
) {
  const { queryClient } = databaseConnection();

  try {
    const rows = await queryClient<PreparedIdentityRow[]>`
      select *
      from app.${queryClient(functionName)}(
        ${authUserId}::uuid,
        ${identity.demoRunSlug}::text,
        ${identity.profileSlug}::text,
        ${identity.cluster}::text,
        ${identity.walletAddress}::text
      )
    `;
    if (rows.length > 1) throw new PreparedIdentityConflictError();
    return rows[0] ? mapIdentity(rows[0]) : null;
  } catch (error) {
    if (isPreparedIdentityConflict(error)) {
      throw new PreparedIdentityConflictError();
    }
    throw error;
  }
}

export function enrollPreparedPersonalIdentity(
  authUserId: string,
  identity: PreparedPersonalIdentity,
) {
  return callIdentityFunction(
    "enroll_prepared_personal_identity",
    authUserId,
    identity,
  );
}

export function currentPreparedPersonalIdentity(
  authUserId: string,
  identity: PreparedPersonalIdentity,
) {
  return callIdentityFunction(
    "current_prepared_personal_identity",
    authUserId,
    identity,
  );
}
