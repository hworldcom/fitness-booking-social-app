import { sql } from "drizzle-orm";
import {
  check,
  foreignKey,
  index,
  pgSchema,
  text,
  timestamp,
  unique,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";
import { app, demoRunMemberships, demoRuns, organizations } from "./foundation";

const auth = pgSchema("auth");
const authUsers = auth.table("users", {
  id: uuid("id").primaryKey(),
});

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
      sql`${table.provenance} = 'prepared'`,
    ),
    check(
      "wallet_bindings_status_check",
      sql`${table.status} in ('active', 'revoked')`,
    ),
    check(
      "wallet_bindings_revoked_state_check",
      sql`(${table.status} = 'revoked') = (${table.revokedAt} is not null)`,
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
