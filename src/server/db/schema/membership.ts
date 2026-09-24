import { sql } from "drizzle-orm";
import {
  boolean,
  check,
  foreignKey,
  index,
  integer,
  numeric,
  text,
  timestamp,
  unique,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";
import { app, demoRunParticipants, organizations } from "./foundation";

const auditColumns = {
  createdAt: timestamp("created_at", { withTimezone: true, mode: "string" })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true, mode: "string" })
    .defaultNow()
    .notNull(),
};

export const membershipProducts = app.table(
  "membership_products",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    runId: uuid("run_id").notNull(),
    organizationId: uuid("organization_id").notNull(),
    slug: text("slug").notNull(),
    status: text("status").notNull(),
    recordSource: text("record_source").notNull(),
    createdByProfileId: uuid("created_by_profile_id"),
    ...auditColumns,
  },
  (table) => [
    foreignKey({
      name: "membership_products_run_organization_fkey",
      columns: [table.runId, table.organizationId],
      foreignColumns: [organizations.runId, organizations.id],
    }).onDelete("restrict"),
    foreignKey({
      name: "membership_products_creator_fkey",
      columns: [table.runId, table.createdByProfileId],
      foreignColumns: [
        demoRunParticipants.runId,
        demoRunParticipants.profileId,
      ],
    }).onDelete("restrict"),
    unique("membership_products_run_id_id_key").on(table.runId, table.id),
    unique("membership_products_run_organization_slug_key").on(
      table.runId,
      table.organizationId,
      table.slug,
    ),
    check(
      "membership_products_slug_format_check",
      sql`${table.slug} ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'`,
    ),
    check(
      "membership_products_status_check",
      sql`${table.status} in ('active', 'retired')`,
    ),
    check(
      "membership_products_record_source_check",
      sql`${table.recordSource} in ('fixture', 'user')`,
    ),
    check(
      "membership_products_creator_source_check",
      sql`(${table.recordSource} = 'fixture' and ${table.createdByProfileId} is null) or (${table.recordSource} = 'user' and ${table.createdByProfileId} is not null)`,
    ),
    index("membership_products_run_organization_status_idx").on(
      table.runId,
      table.organizationId,
      table.status,
    ),
  ],
);

export const membershipProductVersions = app.table(
  "membership_product_versions",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    runId: uuid("run_id").notNull(),
    productId: uuid("product_id").notNull(),
    versionNumber: integer("version_number").notNull(),
    name: text("name").notNull(),
    description: text("description").notNull(),
    currencyCode: text("currency_code").notNull(),
    priceBaseUnits: numeric("price_base_units", {
      precision: 20,
      scale: 0,
      mode: "string",
    }),
    durationSeconds: integer("duration_seconds").notNull(),
    accessModel: text("access_model").notNull(),
    initialEntryAllowance: integer("initial_entry_allowance"),
    transferable: boolean("transferable").notNull(),
    transferFeeBaseUnits: numeric("transfer_fee_base_units", {
      precision: 20,
      scale: 0,
      mode: "string",
    }).notNull(),
    minimumHoldSeconds: integer("minimum_hold_seconds").notNull(),
    minimumRemainingTransferSeconds: integer(
      "minimum_remaining_transfer_seconds",
    ).notNull(),
    status: text("status").notNull(),
    publishedAt: timestamp("published_at", {
      withTimezone: true,
      mode: "string",
    }),
    retiredAt: timestamp("retired_at", {
      withTimezone: true,
      mode: "string",
    }),
    createdByProfileId: uuid("created_by_profile_id"),
    ...auditColumns,
  },
  (table) => [
    foreignKey({
      name: "membership_product_versions_product_fkey",
      columns: [table.runId, table.productId],
      foreignColumns: [membershipProducts.runId, membershipProducts.id],
    }).onDelete("restrict"),
    foreignKey({
      name: "membership_product_versions_creator_fkey",
      columns: [table.runId, table.createdByProfileId],
      foreignColumns: [
        demoRunParticipants.runId,
        demoRunParticipants.profileId,
      ],
    }).onDelete("restrict"),
    unique("membership_product_versions_run_id_id_key").on(
      table.runId,
      table.id,
    ),
    unique("membership_product_versions_product_version_key").on(
      table.runId,
      table.productId,
      table.versionNumber,
    ),
    check(
      "membership_product_versions_version_check",
      sql`${table.versionNumber} > 0`,
    ),
    check(
      "membership_product_versions_name_length_check",
      sql`char_length(${table.name}) between 2 and 120`,
    ),
    check(
      "membership_product_versions_description_length_check",
      sql`char_length(${table.description}) between 1 and 2000`,
    ),
    check(
      "membership_product_versions_currency_check",
      sql`${table.currencyCode} = 'EURC'`,
    ),
    check(
      "membership_product_versions_price_check",
      sql`${table.priceBaseUnits} is null or (${table.priceBaseUnits} >= 0 and ${table.priceBaseUnits} <= 18446744073709551615)`,
    ),
    check(
      "membership_product_versions_access_model_check",
      sql`${table.accessModel} in ('unlimited', 'entry_limited')`,
    ),
    check(
      "membership_product_versions_access_terms_check",
      sql`(${table.accessModel} = 'unlimited' and ${table.durationSeconds} = 31536000 and ${table.initialEntryAllowance} is null) or (${table.accessModel} = 'entry_limited' and ${table.durationSeconds} = 15811200 and ${table.initialEntryAllowance} = 12)`,
    ),
    check(
      "membership_product_versions_transfer_terms_check",
      sql`(${table.transferable} and ${table.transferFeeBaseUnits} = 10000000 and ${table.minimumHoldSeconds} = 2592000 and ${table.minimumRemainingTransferSeconds} = 2592000) or (not ${table.transferable} and ${table.transferFeeBaseUnits} = 0 and ${table.minimumHoldSeconds} = 0 and ${table.minimumRemainingTransferSeconds} = 0)`,
    ),
    check(
      "membership_product_versions_status_check",
      sql`${table.status} in ('draft', 'published', 'retired')`,
    ),
    check(
      "membership_product_versions_lifecycle_check",
      sql`(${table.status} = 'draft' and ${table.publishedAt} is null and ${table.retiredAt} is null) or (${table.status} = 'published' and ${table.priceBaseUnits} is not null and ${table.publishedAt} is not null and ${table.retiredAt} is null) or (${table.status} = 'retired' and ${table.priceBaseUnits} is not null and ${table.publishedAt} is not null and ${table.retiredAt} is not null and ${table.retiredAt} >= ${table.publishedAt})`,
    ),
    index("membership_product_versions_run_product_status_idx").on(
      table.runId,
      table.productId,
      table.status,
    ),
    uniqueIndex("membership_product_versions_one_published_idx")
      .on(table.runId, table.productId)
      .where(sql`${table.status} = 'published'`),
  ],
);

export type MembershipProductRow = typeof membershipProducts.$inferSelect;
export type MembershipProductVersionRow =
  typeof membershipProductVersions.$inferSelect;
