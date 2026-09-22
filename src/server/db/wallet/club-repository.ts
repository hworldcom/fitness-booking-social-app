import "server-only";

import { sql } from "drizzle-orm";
import type { ActorDatabaseTransaction } from "@/server/db/authorization/repository";

type ClubContextRow = Readonly<{
  organization_id: string;
  organization_slug: string;
  organization_name: string;
  binding_id: string | null;
  binding_wallet_address: string | null;
  binding_cluster: string | null;
  binding_verified_at: string | Date | null;
  authority_id: string | null;
  authority_granted_at: string | Date | null;
  authority_expires_at: string | Date | null;
}>;

type CompletionRow = Readonly<{
  completion_result: "authorized" | "invalid-proof" | "state-conflict";
  organization_slug: string | null;
  organization_name: string | null;
  binding_wallet_address: string | null;
  binding_cluster: string | null;
  binding_verified_at: string | Date | null;
  authority_granted_at: string | Date | null;
  authority_expires_at: string | Date | null;
}>;

export type ClubWalletContextRecord = Readonly<{
  organizationId: string;
  slug: string;
  name: string;
  bindingId: string;
  address: string;
  cluster: "solana:devnet";
  verifiedAt: string;
  authority: Readonly<{
    id: string;
    grantedAt: string;
    expiresAt: string;
  }> | null;
}>;

export type ClubWalletCompletion =
  | Readonly<{
      result: "authorized";
      context: Omit<ClubWalletContextRecord, "organizationId" | "bindingId">;
    }>
  | Readonly<{ result: "invalid-proof" | "state-conflict" }>;

export class ClubWalletStateConflictError extends Error {
  constructor() {
    super("The club wallet action conflicts with the current prepared state.");
    this.name = "ClubWalletStateConflictError";
  }
}

export class ClubWalletNoAccessError extends Error {
  constructor() {
    super("The current account does not administer a prepared club.");
    this.name = "ClubWalletNoAccessError";
  }
}

export async function setClubWalletAuthSession(
  transaction: ActorDatabaseTransaction,
  authSessionId: string,
) {
  await transaction.execute(sql`
    select set_config('app.current_auth_session_id', ${authSessionId}, true)
  `);
}

function isoTimestamp(value: string | Date) {
  return new Date(value).toISOString();
}

function mapContext(row: ClubContextRow): ClubWalletContextRecord {
  if (
    !row.organization_id ||
    !row.organization_slug ||
    !row.organization_name ||
    !row.binding_id ||
    !row.binding_wallet_address ||
    row.binding_cluster !== "solana:devnet" ||
    !row.binding_verified_at
  ) {
    throw new ClubWalletStateConflictError();
  }
  const authorityFields = [
    row.authority_id,
    row.authority_granted_at,
    row.authority_expires_at,
  ];
  const hasAuthority = authorityFields.every((value) => value !== null);
  if (!hasAuthority && authorityFields.some((value) => value !== null)) {
    throw new ClubWalletStateConflictError();
  }
  return Object.freeze({
    organizationId: row.organization_id,
    slug: row.organization_slug,
    name: row.organization_name,
    bindingId: row.binding_id,
    address: row.binding_wallet_address,
    cluster: row.binding_cluster,
    verifiedAt: isoTimestamp(row.binding_verified_at),
    authority: hasAuthority
      ? Object.freeze({
          id: row.authority_id!,
          grantedAt: isoTimestamp(row.authority_granted_at!),
          expiresAt: isoTimestamp(row.authority_expires_at!),
        })
      : null,
  });
}

export async function currentClubWalletContextRecord(
  transaction: ActorDatabaseTransaction,
) {
  const rows = await transaction.execute<ClubContextRow>(sql`
    select * from app.current_club_wallet_context()
  `);
  if (rows.length > 1) throw new ClubWalletStateConflictError();
  return rows[0] ? mapContext(rows[0]) : null;
}

export async function clubWalletChallengeClock(
  transaction: ActorDatabaseTransaction,
) {
  const rows = await transaction.execute<{
    challenge_id: string;
    issued_at: string | Date;
  }>(sql`
    select
      gen_random_uuid() as challenge_id,
      statement_timestamp() as issued_at
  `);
  const row = rows[0];
  if (!row) throw new ClubWalletStateConflictError();
  return Object.freeze({
    id: row.challenge_id,
    issuedAt: isoTimestamp(row.issued_at),
  });
}

export async function issueClubWalletChallengeRecord(
  transaction: ActorDatabaseTransaction,
  input: {
    id: string;
    address: string;
    origin: string;
    nonceHashHex: string;
    messageHashHex: string;
    issuedAt: string;
    expiresAt: string;
  },
) {
  const rows = await transaction.execute<{ result: string }>(sql`
    select app.issue_club_wallet_challenge(
      ${input.id}::uuid,
      ${input.address}::text,
      ${input.origin}::text,
      decode(${input.nonceHashHex}, 'hex'),
      decode(${input.messageHashHex}, 'hex'),
      ${input.issuedAt}::timestamptz,
      ${input.expiresAt}::timestamptz
    ) as result
  `);
  const result = rows[0]?.result;
  if (result === "no-club-access") throw new ClubWalletNoAccessError();
  if (result !== "issued") throw new ClubWalletStateConflictError();
}

export async function completeClubWalletChallengeRecord(
  transaction: ActorDatabaseTransaction,
  input: {
    id: string;
    address: string;
    messageHashHex: string;
  },
): Promise<ClubWalletCompletion> {
  const rows = await transaction.execute<CompletionRow>(sql`
    select *
    from app.complete_club_wallet_challenge(
      ${input.id}::uuid,
      ${input.address}::text,
      decode(${input.messageHashHex}, 'hex')
    )
  `);
  const row = rows[0];
  if (!row || rows.length !== 1) throw new ClubWalletStateConflictError();
  if (
    row.completion_result === "invalid-proof" ||
    row.completion_result === "state-conflict"
  ) {
    return Object.freeze({ result: row.completion_result });
  }
  if (
    !row.organization_slug ||
    !row.organization_name ||
    !row.binding_wallet_address ||
    row.binding_cluster !== "solana:devnet" ||
    !row.binding_verified_at ||
    !row.authority_granted_at ||
    !row.authority_expires_at
  ) {
    throw new ClubWalletStateConflictError();
  }
  return Object.freeze({
    result: "authorized",
    context: Object.freeze({
      slug: row.organization_slug,
      name: row.organization_name,
      address: row.binding_wallet_address,
      cluster: row.binding_cluster,
      verifiedAt: isoTimestamp(row.binding_verified_at),
      authority: Object.freeze({
        id: input.id,
        grantedAt: isoTimestamp(row.authority_granted_at),
        expiresAt: isoTimestamp(row.authority_expires_at),
      }),
    }),
  });
}

export async function revokeClubWalletAuthorityRecord(
  transaction: ActorDatabaseTransaction,
) {
  const rows = await transaction.execute<{ result: string }>(sql`
    select app.revoke_club_wallet_authority() as result
  `);
  return rows[0]?.result === "revoked" ? "revoked" : "no-authority";
}
