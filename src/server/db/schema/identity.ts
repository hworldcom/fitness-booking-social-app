import { sql } from "drizzle-orm";
import {
  customType,
  check,
  foreignKey,
  index,
  integer,
  pgSchema,
  text,
  timestamp,
  unique,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";
import {
  app,
  demoRunMemberships,
  demoRuns,
  organizationMemberships,
  organizations,
} from "./foundation";

const auth = pgSchema("auth");
const authUsers = auth.table("users", {
  id: uuid("id").primaryKey(),
});

const bytea = customType<{ data: Uint8Array }>({
  dataType() {
    return "bytea";
  },
});

export const authChallenges = app.table(
  "auth_challenges",
  {
    id: uuid("id").primaryKey(),
    runId: uuid("run_id")
      .notNull()
      .references(() => demoRuns.id, { onDelete: "restrict" }),
    authUserId: uuid("auth_user_id")
      .notNull()
      .references(() => authUsers.id, { onDelete: "restrict" }),
    authSessionId: uuid("auth_session_id"),
    ownerType: text("owner_type").notNull(),
    profileId: uuid("profile_id"),
    organizationId: uuid("organization_id"),
    purpose: text("purpose").notNull(),
    cluster: text("cluster").notNull(),
    walletAddress: text("wallet_address").notNull(),
    origin: text("origin").notNull(),
    messageVersion: integer("message_version").notNull(),
    nonceHash: bytea("nonce_hash").notNull(),
    messageHash: bytea("message_hash").notNull(),
    issuedAt: timestamp("issued_at", {
      withTimezone: true,
      mode: "string",
    }).notNull(),
    expiresAt: timestamp("expires_at", {
      withTimezone: true,
      mode: "string",
    }).notNull(),
    consumedAt: timestamp("consumed_at", {
      withTimezone: true,
      mode: "string",
    }),
    consumedResult: text("consumed_result"),
    createdAt: timestamp("created_at", {
      withTimezone: true,
      mode: "string",
    })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", {
      withTimezone: true,
      mode: "string",
    })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    unique("auth_challenges_run_id_id_key").on(table.runId, table.id),
    foreignKey({
      name: "auth_challenges_personal_target_fkey",
      columns: [table.runId, table.profileId],
      foreignColumns: [demoRunMemberships.runId, demoRunMemberships.profileId],
    }).onDelete("restrict"),
    foreignKey({
      name: "auth_challenges_organization_target_fkey",
      columns: [table.runId, table.organizationId],
      foreignColumns: [organizations.runId, organizations.id],
    }).onDelete("restrict"),
    check(
      "auth_challenges_owner_type_check",
      sql`${table.ownerType} in ('personal', 'organization')`,
    ),
    check(
      "auth_challenges_owner_target_check",
      sql`(${table.ownerType} = 'personal' and ${table.profileId} is not null and ${table.organizationId} is null) or (${table.ownerType} = 'organization' and ${table.profileId} is null and ${table.organizationId} is not null)`,
    ),
    check(
      "auth_challenges_purpose_check",
      sql`${table.purpose} in ('link-personal-wallet', 'replace-personal-wallet', 'authorize-club-wallet')`,
    ),
    check(
      "auth_challenges_owner_purpose_check",
      sql`(${table.ownerType} = 'personal' and ${table.authSessionId} is null and ${table.purpose} in ('link-personal-wallet', 'replace-personal-wallet')) or (${table.ownerType} = 'organization' and ${table.authSessionId} is not null and ${table.purpose} = 'authorize-club-wallet')`,
    ),
    check(
      "auth_challenges_cluster_check",
      sql`${table.cluster} = 'solana:devnet'`,
    ),
    check(
      "auth_challenges_wallet_address_check",
      sql`char_length(${table.walletAddress}) between 32 and 44 and ${table.walletAddress} ~ '^[1-9A-HJ-NP-Za-km-z]+$'`,
    ),
    check(
      "auth_challenges_origin_check",
      sql`char_length(${table.origin}) between 8 and 255 and ${table.origin} !~ '[[:space:]]' and (${table.origin} ~ '^https://[A-Za-z0-9.-]+(:[0-9]{1,5})?$' or ${table.origin} ~ '^http://localhost:[0-9]{2,5}$')`,
    ),
    check(
      "auth_challenges_message_version_check",
      sql`${table.messageVersion} = 1`,
    ),
    check(
      "auth_challenges_nonce_hash_check",
      sql`octet_length(${table.nonceHash}) = 32`,
    ),
    check(
      "auth_challenges_message_hash_check",
      sql`octet_length(${table.messageHash}) = 32`,
    ),
    check(
      "auth_challenges_lifetime_check",
      sql`${table.expiresAt} = ${table.issuedAt} + interval '5 minutes'`,
    ),
    check(
      "auth_challenges_consumed_state_check",
      sql`(${table.consumedAt} is null) = (${table.consumedResult} is null)`,
    ),
    check(
      "auth_challenges_consumed_result_check",
      sql`${table.consumedResult} is null or ${table.consumedResult} in ('linked', 'replaced', 'authorized', 'wallet-conflict', 'state-conflict')`,
    ),
    index("auth_challenges_actor_expiry_idx").on(
      table.authUserId,
      table.runId,
      table.purpose,
      table.expiresAt,
    ),
    index("auth_challenges_unconsumed_expiry_idx")
      .on(table.expiresAt)
      .where(sql`${table.consumedAt} is null`),
  ],
);

export const walletBindings = app.table(
  "wallet_bindings",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    runId: uuid("run_id")
      .notNull()
      .references(() => demoRuns.id, { onDelete: "restrict" }),
    cluster: text("cluster").notNull(),
    walletAddress: text("wallet_address").notNull(),
    ownerType: text("owner_type").notNull(),
    profileId: uuid("profile_id"),
    organizationId: uuid("organization_id"),
    boundByAuthUserId: uuid("bound_by_auth_user_id")
      .notNull()
      .references(() => authUsers.id, { onDelete: "restrict" }),
    provenance: text("provenance").notNull(),
    status: text("status").default("active").notNull(),
    verifiedAt: timestamp("verified_at", {
      withTimezone: true,
      mode: "string",
    })
      .defaultNow()
      .notNull(),
    revokedAt: timestamp("revoked_at", {
      withTimezone: true,
      mode: "string",
    }),
    verifiedByChallengeId: uuid("verified_by_challenge_id").references(
      () => authChallenges.id,
      { onDelete: "restrict" },
    ),
    reauthenticatedAt: timestamp("reauthenticated_at", {
      withTimezone: true,
      mode: "string",
    }),
    revocationReason: text("revocation_reason"),
    replacementBindingId: uuid("replacement_binding_id"),
    createdAt: timestamp("created_at", {
      withTimezone: true,
      mode: "string",
    })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", {
      withTimezone: true,
      mode: "string",
    })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    unique("wallet_bindings_run_id_id_key").on(table.runId, table.id),
    foreignKey({
      name: "wallet_bindings_personal_target_fkey",
      columns: [table.runId, table.profileId],
      foreignColumns: [demoRunMemberships.runId, demoRunMemberships.profileId],
    }).onDelete("restrict"),
    foreignKey({
      name: "wallet_bindings_organization_target_fkey",
      columns: [table.runId, table.organizationId],
      foreignColumns: [organizations.runId, organizations.id],
    }).onDelete("restrict"),
    foreignKey({
      name: "wallet_bindings_replacement_binding_id_fkey",
      columns: [table.replacementBindingId],
      foreignColumns: [table.id],
    }).onDelete("restrict"),
    check(
      "wallet_bindings_cluster_check",
      sql`${table.cluster} = 'solana:devnet'`,
    ),
    check(
      "wallet_bindings_wallet_address_check",
      sql`char_length(${table.walletAddress}) between 32 and 44 and ${table.walletAddress} ~ '^[1-9A-HJ-NP-Za-km-z]+$'`,
    ),
    check(
      "wallet_bindings_owner_type_check",
      sql`${table.ownerType} in ('personal', 'organization')`,
    ),
    check(
      "wallet_bindings_owner_target_check",
      sql`(${table.ownerType} = 'personal' and ${table.profileId} is not null and ${table.organizationId} is null) or (${table.ownerType} = 'organization' and ${table.profileId} is null and ${table.organizationId} is not null)`,
    ),
    check(
      "wallet_bindings_provenance_check",
      sql`${table.provenance} in ('prepared', 'user-proof')`,
    ),
    check(
      "wallet_bindings_proof_state_check",
      sql`(${table.provenance} = 'prepared' and ${table.verifiedByChallengeId} is null) or (${table.provenance} = 'user-proof' and ${table.verifiedByChallengeId} is not null)`,
    ),
    check(
      "wallet_bindings_status_check",
      sql`${table.status} in ('active', 'revoked')`,
    ),
    check(
      "wallet_bindings_revocation_reason_check",
      sql`${table.revocationReason} is null or ${table.revocationReason} in ('legacy', 'unlinked', 'replaced')`,
    ),
    check(
      "wallet_bindings_revoked_state_check",
      sql`(${table.status} = 'active' and ${table.revokedAt} is null and ${table.revocationReason} is null and ${table.replacementBindingId} is null) or (${table.status} = 'revoked' and ${table.revokedAt} is not null and ${table.revocationReason} is not null and ((${table.revocationReason} = 'replaced' and ${table.replacementBindingId} is not null) or (${table.revocationReason} <> 'replaced' and ${table.replacementBindingId} is null)) and (${table.revocationReason} = 'legacy' or ${table.reauthenticatedAt} is not null))`,
    ),
    uniqueIndex("wallet_bindings_active_wallet_owner_idx")
      .on(table.runId, table.cluster, table.walletAddress)
      .where(sql`${table.status} = 'active'`),
    uniqueIndex("wallet_bindings_active_personal_profile_idx")
      .on(table.runId, table.profileId)
      .where(
        sql`${table.status} = 'active' and ${table.ownerType} = 'personal'`,
      ),
    uniqueIndex("wallet_bindings_active_organization_idx")
      .on(table.runId, table.organizationId)
      .where(
        sql`${table.status} = 'active' and ${table.ownerType} = 'organization'`,
      ),
    uniqueIndex("wallet_bindings_active_personal_auth_user_idx")
      .on(table.runId, table.boundByAuthUserId)
      .where(
        sql`${table.status} = 'active' and ${table.ownerType} = 'personal'`,
      ),
    index("wallet_bindings_auth_user_status_run_idx").on(
      table.boundByAuthUserId,
      table.status,
      table.runId,
    ),
  ],
);

export type WalletBindingRow = typeof walletBindings.$inferSelect;

export const organizationWalletAuthorities = app.table(
  "organization_wallet_authorities",
  {
    id: uuid("id").primaryKey(),
    runId: uuid("run_id").notNull(),
    authUserId: uuid("auth_user_id")
      .notNull()
      .references(() => authUsers.id, { onDelete: "restrict" }),
    authSessionId: uuid("auth_session_id").notNull(),
    profileId: uuid("profile_id").notNull(),
    organizationId: uuid("organization_id").notNull(),
    walletBindingId: uuid("wallet_binding_id").notNull(),
    walletAddress: text("wallet_address").notNull(),
    cluster: text("cluster").notNull(),
    challengeId: uuid("challenge_id").notNull(),
    grantedAt: timestamp("granted_at", {
      withTimezone: true,
      mode: "string",
    }).notNull(),
    expiresAt: timestamp("expires_at", {
      withTimezone: true,
      mode: "string",
    }).notNull(),
    revokedAt: timestamp("revoked_at", {
      withTimezone: true,
      mode: "string",
    }),
    revocationReason: text("revocation_reason"),
    createdAt: timestamp("created_at", {
      withTimezone: true,
      mode: "string",
    })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", {
      withTimezone: true,
      mode: "string",
    })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    foreignKey({
      name: "organization_wallet_authorities_membership_fkey",
      columns: [table.runId, table.organizationId, table.profileId],
      foreignColumns: [
        organizationMemberships.runId,
        organizationMemberships.organizationId,
        organizationMemberships.profileId,
      ],
    }).onDelete("restrict"),
    foreignKey({
      name: "organization_wallet_authorities_binding_fkey",
      columns: [table.runId, table.walletBindingId],
      foreignColumns: [walletBindings.runId, walletBindings.id],
    }).onDelete("restrict"),
    foreignKey({
      name: "organization_wallet_authorities_challenge_fkey",
      columns: [table.runId, table.challengeId],
      foreignColumns: [authChallenges.runId, authChallenges.id],
    }).onDelete("restrict"),
    unique("organization_wallet_authorities_challenge_key").on(
      table.challengeId,
    ),
    check(
      "organization_wallet_authorities_cluster_check",
      sql`${table.cluster} = 'solana:devnet'`,
    ),
    check(
      "organization_wallet_authorities_wallet_address_check",
      sql`char_length(${table.walletAddress}) between 32 and 44 and ${table.walletAddress} ~ '^[1-9A-HJ-NP-Za-km-z]+$'`,
    ),
    check(
      "organization_wallet_authorities_lifetime_check",
      sql`${table.expiresAt} = ${table.grantedAt} + interval '10 minutes'`,
    ),
    check(
      "organization_wallet_authorities_revoked_state_check",
      sql`(${table.revokedAt} is null) = (${table.revocationReason} is null)`,
    ),
    check(
      "organization_wallet_authorities_revocation_reason_check",
      sql`${table.revocationReason} is null or ${table.revocationReason} in ('client-disconnect', 'expired', 'context-changed', 'superseded')`,
    ),
    uniqueIndex("organization_wallet_authorities_active_actor_idx")
      .on(table.runId, table.authUserId)
      .where(sql`${table.revokedAt} is null`),
    uniqueIndex("organization_wallet_authorities_active_organization_idx")
      .on(table.runId, table.organizationId)
      .where(sql`${table.revokedAt} is null`),
    index("organization_wallet_authorities_expiry_idx")
      .on(table.expiresAt)
      .where(sql`${table.revokedAt} is null`),
  ],
);

export type OrganizationWalletAuthorityRow =
  typeof organizationWalletAuthorities.$inferSelect;
