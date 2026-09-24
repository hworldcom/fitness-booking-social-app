import test, { after } from "node:test";
import assert from "node:assert/strict";
import { asc, eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import {
  membershipProducts,
  membershipProductVersions,
} from "@/server/db/schema";

const connectionString = process.env.DATABASE_TEST_URL;
if (!connectionString) {
  throw new Error(
    "DATABASE_TEST_URL is required for database integration tests.",
  );
}

const queryClient = postgres(connectionString, {
  max: 1,
  prepare: false,
  ssl: false,
});
const db = drizzle(queryClient);

after(async () => {
  await queryClient.end();
});

function hasDatabaseCode(code: string) {
  return (error: unknown) =>
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    error.code === code;
}

test("Drizzle mappings expose the two price-pending membership drafts", async () => {
  const products = await db
    .select({ slug: membershipProducts.slug })
    .from(membershipProducts)
    .orderBy(asc(membershipProducts.slug));
  assert.deepEqual(products, [
    { slug: "annual-unlimited" },
    { slug: "six-month-flex-12" },
  ]);

  const versions = await db
    .select({
      name: membershipProductVersions.name,
      priceBaseUnits: membershipProductVersions.priceBaseUnits,
      durationSeconds: membershipProductVersions.durationSeconds,
      accessModel: membershipProductVersions.accessModel,
      initialEntryAllowance: membershipProductVersions.initialEntryAllowance,
      transferFeeBaseUnits: membershipProductVersions.transferFeeBaseUnits,
      minimumHoldSeconds: membershipProductVersions.minimumHoldSeconds,
      minimumRemainingTransferSeconds:
        membershipProductVersions.minimumRemainingTransferSeconds,
      status: membershipProductVersions.status,
    })
    .from(membershipProductVersions)
    .orderBy(asc(membershipProductVersions.name));

  assert.deepEqual(versions, [
    {
      name: "Annual Unlimited",
      priceBaseUnits: null,
      durationSeconds: 31_536_000,
      accessModel: "unlimited",
      initialEntryAllowance: null,
      transferFeeBaseUnits: "10000000",
      minimumHoldSeconds: 2_592_000,
      minimumRemainingTransferSeconds: 2_592_000,
      status: "draft",
    },
    {
      name: "Six-Month Flex 12",
      priceBaseUnits: null,
      durationSeconds: 15_811_200,
      accessModel: "entry_limited",
      initialEntryAllowance: 12,
      transferFeeBaseUnits: "10000000",
      minimumHoldSeconds: 2_592_000,
      minimumRemainingTransferSeconds: 2_592_000,
      status: "draft",
    },
  ]);
});

test("database checks reject invalid membership access and transfer terms", async () => {
  await assert.rejects(
    queryClient.begin(async (transaction) => {
      await transaction.unsafe(`
        insert into app.membership_product_versions (
          id, run_id, product_id, version_number, name, description,
          currency_code, price_base_units, duration_seconds, access_model,
          initial_entry_allowance, transferable, transfer_fee_base_units,
          minimum_hold_seconds, minimum_remaining_transfer_seconds, status
        ) values (
          '62000000-0000-4000-8000-000000000001',
          '20000000-0000-4000-8000-000000000001',
          '60000000-0000-4000-8000-000000000001',
          2, 'Invalid unlimited', 'Must fail', 'EURC', null, 31536000,
          'unlimited', 12, true, 10000000, 2592000, 2592000, 'draft'
        )
      `);
    }),
    hasDatabaseCode("23514"),
  );

  await assert.rejects(
    queryClient.begin(async (transaction) => {
      await transaction.unsafe(`
        insert into app.membership_product_versions (
          id, run_id, product_id, version_number, name, description,
          currency_code, price_base_units, duration_seconds, access_model,
          initial_entry_allowance, transferable, transfer_fee_base_units,
          minimum_hold_seconds, minimum_remaining_transfer_seconds, status
        ) values (
          '62000000-0000-4000-8000-000000000002',
          '20000000-0000-4000-8000-000000000001',
          '60000000-0000-4000-8000-000000000001',
          2, 'Invalid fee', 'Must fail', 'EURC', null, 31536000,
          'unlimited', null, true, 9000000, 2592000, 2592000, 'draft'
        )
      `);
    }),
    hasDatabaseCode("23514"),
  );

  await queryClient.begin(async (transaction) => {
    await transaction.unsafe(`
      insert into app.membership_product_versions (
        id, run_id, product_id, version_number, name, description,
        currency_code, price_base_units, duration_seconds, access_model,
        initial_entry_allowance, transferable, transfer_fee_base_units,
        minimum_hold_seconds, minimum_remaining_transfer_seconds, status
      ) values (
        '62000000-0000-4000-8000-000000000005',
        '20000000-0000-4000-8000-000000000001',
        '60000000-0000-4000-8000-000000000001',
        2, 'Non-transferable annual', 'Accepted rule combination', 'EURC',
        null, 31536000, 'unlimited', null, false, 0, 0, 0, 'draft'
      )
    `);
    const inserted = await transaction<{ count: string }[]>`
      select count(*)::text as count
      from app.membership_product_versions
      where id = '62000000-0000-4000-8000-000000000005'
    `;
    assert.equal(inserted[0]?.count, "1");
    await transaction.unsafe(`
      delete from app.membership_product_versions
      where id = '62000000-0000-4000-8000-000000000005'
    `);
  });
});

test("publication requires a price and freezes version terms", async () => {
  await assert.rejects(
    queryClient.begin(async (transaction) => {
      await transaction.unsafe(`
        update app.membership_product_versions
        set status = 'published', published_at = statement_timestamp()
        where id = '61000000-0000-4000-8000-000000000001'
      `);
    }),
    hasDatabaseCode("23514"),
  );

  await assert.rejects(
    queryClient.begin(async (transaction) => {
      await transaction.unsafe(`
        update app.membership_product_versions
        set price_base_units = 600000000,
            status = 'published',
            published_at = statement_timestamp()
        where id = '61000000-0000-4000-8000-000000000001'
      `);
      await transaction.unsafe(`
        update app.membership_product_versions
        set price_base_units = 650000000
        where id = '61000000-0000-4000-8000-000000000001'
      `);
    }),
    hasDatabaseCode("23514"),
  );
});

test("only one version can be published and retirement is final", async () => {
  await assert.rejects(
    queryClient.begin(async (transaction) => {
      await transaction.unsafe(`
        update app.membership_product_versions
        set price_base_units = 600000000,
            status = 'published',
            published_at = statement_timestamp()
        where id = '61000000-0000-4000-8000-000000000001'
      `);
      await transaction.unsafe(`
        insert into app.membership_product_versions (
          id, run_id, product_id, version_number, name, description,
          currency_code, price_base_units, duration_seconds, access_model,
          initial_entry_allowance, transferable, transfer_fee_base_units,
          minimum_hold_seconds, minimum_remaining_transfer_seconds, status
        ) values (
          '62000000-0000-4000-8000-000000000003',
          '20000000-0000-4000-8000-000000000001',
          '60000000-0000-4000-8000-000000000001',
          2, 'Annual Unlimited v2', 'Second version', 'EURC', null,
          31536000, 'unlimited', null, true, 10000000, 2592000,
          2592000, 'draft'
        )
      `);
      await transaction.unsafe(`
        update app.membership_product_versions
        set price_base_units = 650000000,
            status = 'published',
            published_at = statement_timestamp()
        where id = '62000000-0000-4000-8000-000000000003'
      `);
    }),
    hasDatabaseCode("23505"),
  );

  await assert.rejects(
    queryClient.begin(async (transaction) => {
      await transaction.unsafe(`
        update app.membership_product_versions
        set price_base_units = 600000000,
            status = 'published',
            published_at = statement_timestamp()
        where id = '61000000-0000-4000-8000-000000000001'
      `);
      await transaction.unsafe(`
        update app.membership_product_versions
        set status = 'retired', retired_at = statement_timestamp()
        where id = '61000000-0000-4000-8000-000000000001'
      `);
      await transaction.unsafe(`
        delete from app.membership_product_versions
        where id = '61000000-0000-4000-8000-000000000001'
      `);
    }),
    hasDatabaseCode("23514"),
  );
});

test("same-dataset references and default-deny runtime access hold", async () => {
  await assert.rejects(
    queryClient.begin(async (transaction) => {
      await transaction.unsafe(`
        insert into app.membership_product_versions (
          id, run_id, product_id, version_number, name, description,
          currency_code, price_base_units, duration_seconds, access_model,
          initial_entry_allowance, transferable, transfer_fee_base_units,
          minimum_hold_seconds, minimum_remaining_transfer_seconds, status
        ) values (
          '62000000-0000-4000-8000-000000000004',
          '90000000-0000-4000-8000-000000000001',
          '60000000-0000-4000-8000-000000000001',
          2, 'Cross-run version', 'Must fail', 'EURC', null, 31536000,
          'unlimited', null, true, 10000000, 2592000, 2592000, 'draft'
        )
      `);
    }),
    hasDatabaseCode("23503"),
  );

  await queryClient.begin(async (transaction) => {
    await transaction.unsafe("set local role app_runtime");
    const rows = await transaction<{ count: string }[]>`
      select count(*)::text as count
      from app.membership_product_versions
    `;
    assert.equal(rows[0]?.count, "0");
  });

  await assert.rejects(
    queryClient.begin(async (transaction) => {
      await transaction.unsafe("set local role app_runtime");
      await transaction.unsafe(`
          insert into app.membership_products (
            run_id, organization_id, slug, status, record_source
          ) values (
            '20000000-0000-4000-8000-000000000001',
            '30000000-0000-4000-8000-000000000002',
            'runtime-must-not-insert', 'active', 'fixture'
          )
        `);
    }),
    hasDatabaseCode("42501"),
  );

  const unchanged = await db
    .select({ status: membershipProductVersions.status })
    .from(membershipProductVersions)
    .where(
      eq(membershipProductVersions.id, "61000000-0000-4000-8000-000000000001"),
    );
  assert.deepEqual(unchanged, [{ status: "draft" }]);
});
