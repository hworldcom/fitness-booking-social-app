import assert from "node:assert/strict";
import test from "node:test";
import {
  DEVNET_CLUSTER,
  parsePreparedPersonalIdentities,
  preparedIdentityForWallet,
  PreparedIdentityConfigurationError,
} from "@/server/identity/config";
import { isApplicationIdentitySnapshot } from "@/auth/identity-contracts";

const annaWallet = "7YWHMfk9JZe1LM1W7mFDJH8QvJ75zEQY4zBbDx8kPn9M";
const secondWallet = "9xQeWvG816bUx9EPfDdSpq5Bg6DXyAzQfQ54qVZ4T2QJ";

const anna = {
  walletAddress: annaWallet,
  profileSlug: "anna-klein",
  demoRunSlug: "local-foundation-2030",
  cluster: DEVNET_CLUSTER,
};

test("the prepared roster accepts bounded Devnet entries and resolves by wallet", () => {
  const identities = parsePreparedPersonalIdentities(
    JSON.stringify([
      anna,
      {
        walletAddress: secondWallet,
        profileSlug: "daniel-park",
        demoRunSlug: "local-foundation-2030",
        cluster: DEVNET_CLUSTER,
      },
    ]),
  );

  assert.equal(Object.isFrozen(identities), true);
  assert.equal(Object.isFrozen(identities[0]), true);
  assert.deepEqual(preparedIdentityForWallet(identities, annaWallet), anna);
  assert.equal(
    preparedIdentityForWallet(identities, "11111111111111111111111111111111"),
    undefined,
  );
});

test("the prepared roster rejects malformed, ambiguous and non-Devnet mappings", () => {
  const invalidValues: Array<string | undefined> = [
    undefined,
    "not-json",
    "[]",
    JSON.stringify([{ ...anna, cluster: "solana:mainnet" }]),
    JSON.stringify([{ ...anna, walletAddress: "not-a-solana-address" }]),
    JSON.stringify([{ ...anna, profileSlug: "Anna Klein" }]),
    JSON.stringify([{ ...anna, browserMayChooseProfile: true }]),
    JSON.stringify([anna, { ...anna, profileSlug: "daniel-park" }]),
    JSON.stringify([
      anna,
      {
        ...anna,
        walletAddress: secondWallet,
      },
    ]),
  ];

  for (const value of invalidValues) {
    assert.throws(
      () => parsePreparedPersonalIdentities(value),
      PreparedIdentityConfigurationError,
    );
  }
});

test("the browser identity contract accepts only the bounded response shape", () => {
  const enrolled = {
    status: "enrolled",
    profile: {
      id: "10000000-0000-4000-8000-000000000001",
      slug: "anna-klein",
      displayName: "Anna Klein",
    },
    demoRun: {
      id: "20000000-0000-4000-8000-000000000001",
      slug: "local-foundation-2030",
      name: "Local foundation run",
    },
    role: "member",
    wallet: {
      bindingId: "90000000-0000-4000-8000-000000000001",
      address: annaWallet,
      cluster: DEVNET_CLUSTER,
    },
  };

  assert.equal(isApplicationIdentitySnapshot(enrolled), true);
  assert.equal(isApplicationIdentitySnapshot({ status: "not-prepared" }), true);
  assert.equal(
    isApplicationIdentitySnapshot({ status: "not-prepared", roster: [anna] }),
    false,
  );
  assert.equal(
    isApplicationIdentitySnapshot({
      ...enrolled,
      wallet: { ...enrolled.wallet, address: "not-a-wallet" },
    }),
    false,
  );
  assert.equal(
    isApplicationIdentitySnapshot({
      ...enrolled,
      profile: { ...enrolled.profile, privileged: true },
    }),
    false,
  );
});
