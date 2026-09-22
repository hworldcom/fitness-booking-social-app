import "server-only";

import { sql } from "drizzle-orm";
import type { ActorDatabaseTransaction } from "@/server/db/authorization/repository";
import type { PersonalWalletPurpose } from "@/solana/personal-wallet";

type BindingRow = Readonly<{
  binding_id: string | null;
  binding_wallet_address: string | null;
  binding_cluster: string | null;
  binding_verified_at: string | Date | null;
  binding_provenance: string | null;
}>;

type CompletionRow = BindingRow &
  Readonly<{
    completion_result:
      | "linked"
      | "replaced"
      | "invalid-proof"
      | "wallet-conflict"
      | "state-conflict";
  }>;

export type PersonalWalletBindingRecord = Readonly<{
  id: string;
  address: string;
  cluster: "solana:devnet";
  verifiedAt: string;
  provenance: "prepared" | "user-proof";
}>;

export type PersonalWalletCompletion =
  | Readonly<{
      result: "linked" | "replaced";
      binding: PersonalWalletBindingRecord;
    }>
  | Readonly<{
      result: "invalid-proof" | "wallet-conflict" | "state-conflict";
    }>;

export class PersonalWalletStateConflictError extends Error {
  constructor() {
    super("The wallet action conflicts with the current binding state.");
    this.name = "PersonalWalletStateConflictError";
  }
}

export class PersonalWalletChallengeRejectedError extends Error {
  constructor() {
    super("The wallet challenge is invalid, expired or already used.");
    this.name = "PersonalWalletChallengeRejectedError";
  }
}

function isoTimestamp(value: string | Date) {
  return new Date(value).toISOString();
}

function mapBinding(row: BindingRow): PersonalWalletBindingRecord {
  if (
    !row.binding_id ||
    !row.binding_wallet_address ||
    row.binding_cluster !== "solana:devnet" ||
    !row.binding_verified_at ||
    (row.binding_provenance !== "prepared" &&
      row.binding_provenance !== "user-proof")
  ) {
    throw new PersonalWalletStateConflictError();
  }
  return Object.freeze({
    id: row.binding_id,
    address: row.binding_wallet_address,
    cluster: row.binding_cluster,
    verifiedAt: isoTimestamp(row.binding_verified_at),
    provenance: row.binding_provenance,
  });
}

function isPostgresError(error: unknown, messagePart: string) {
  let current = error;
  for (let depth = 0; depth < 4; depth += 1) {
    if (typeof current !== "object" || current === null) return false;
    if (
      "code" in current &&
      current.code === "P0001" &&
      "message" in current &&
      typeof current.message === "string" &&
      current.message.includes(messagePart)
    ) {
      return true;
    }
    current = "cause" in current ? current.cause : null;
  }
  return false;
}

export async function currentPersonalWalletBinding(
  transaction: ActorDatabaseTransaction,
) {
  const rows = await transaction.execute<BindingRow>(sql`
    select * from app.current_personal_wallet_binding()
  `);
  if (rows.length > 1) throw new PersonalWalletStateConflictError();
  return rows[0] ? mapBinding(rows[0]) : null;
}

export async function personalWalletChallengeClock(
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
  if (!row) throw new PersonalWalletStateConflictError();
  return Object.freeze({
    id: row.challenge_id,
    issuedAt: isoTimestamp(row.issued_at),
  });
}

export async function issuePersonalWalletChallengeRecord(
  transaction: ActorDatabaseTransaction,
  input: {
    id: string;
    purpose: PersonalWalletPurpose;
    address: string;
    origin: string;
    nonceHashHex: string;
    messageHashHex: string;
    issuedAt: string;
    expiresAt: string;
  },
) {
  try {
    const rows = await transaction.execute<{ result: string }>(sql`
      select app.issue_personal_wallet_challenge(
        ${input.id}::uuid,
        ${input.purpose}::text,
        ${input.address}::text,
        ${input.origin}::text,
        decode(${input.nonceHashHex}, 'hex'),
        decode(${input.messageHashHex}, 'hex'),
        ${input.issuedAt}::timestamptz,
        ${input.expiresAt}::timestamptz
      ) as result
    `);
    if (rows[0]?.result === "state-conflict") {
      throw new PersonalWalletStateConflictError();
    }
    if (rows.length !== 1 || rows[0]?.result !== "issued") {
      throw new PersonalWalletStateConflictError();
    }
  } catch (error) {
    if (error instanceof PersonalWalletStateConflictError) throw error;
    if (isPostgresError(error, "conflicts with current binding state")) {
      throw new PersonalWalletStateConflictError();
    }
    throw error;
  }
}

export async function completePersonalWalletChallengeRecord(
  transaction: ActorDatabaseTransaction,
  input: {
    id: string;
    purpose: PersonalWalletPurpose;
    address: string;
    messageHashHex: string;
    reauthenticatedAt: string | null;
  },
): Promise<PersonalWalletCompletion> {
  try {
    const rows = await transaction.execute<CompletionRow>(sql`
      select *
      from app.complete_personal_wallet_challenge(
        ${input.id}::uuid,
        ${input.purpose}::text,
        ${input.address}::text,
        decode(${input.messageHashHex}, 'hex'),
        ${input.reauthenticatedAt}::timestamptz
      )
    `);
    const row = rows[0];
    if (rows.length !== 1 || !row) {
      throw new PersonalWalletChallengeRejectedError();
    }
    if (
      row.completion_result === "invalid-proof" ||
      row.completion_result === "wallet-conflict" ||
      row.completion_result === "state-conflict"
    ) {
      return Object.freeze({ result: row.completion_result });
    }
    return Object.freeze({
      result: row.completion_result,
      binding: mapBinding(row),
    });
  } catch (error) {
    if (isPostgresError(error, "challenge is invalid or expired")) {
      throw new PersonalWalletChallengeRejectedError();
    }
    throw error;
  }
}

export async function unlinkPersonalWalletRecord(
  transaction: ActorDatabaseTransaction,
  reauthenticatedAt: string,
) {
  const rows = await transaction.execute<{ result: string }>(sql`
    select app.unlink_personal_wallet(
      ${reauthenticatedAt}::timestamptz
    ) as result
  `);
  return rows[0]?.result === "unlinked" ? "unlinked" : "state-conflict";
}
