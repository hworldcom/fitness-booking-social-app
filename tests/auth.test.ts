import assert from "node:assert/strict";
import test from "node:test";
import {
  isCanonicalSignInLocation,
  parseSupabasePublicConfig,
  WEB3_SIGN_IN_STATEMENT,
} from "../src/auth/config";
import {
  isAuthSessionSnapshot,
  walletSessionRelationship,
  type AuthSessionSnapshot,
} from "../src/auth/contracts";
import { authenticationErrorMessage } from "../src/auth/presentation";
import { solanaAddressFromWeb3Identities } from "../src/auth/web3-identity";
import {
  createSolanaAuthWallet,
  runAccountBoundSignIn,
  WalletAccountChangedError,
  WalletProofUnsupportedError,
} from "../src/auth/wallet-adapter";

const address = "7YWHMfk9JZe1LM1W7mFDJH8QvJ75zEQY4zBbDx8kPn9M";
const otherAddress = "9xQeWvG816bUx9EPfDdSpq5Bg6DXyAzQfQ54qVZ4T2QJ";

test("public Auth config requires a secure site or literal localhost", () => {
  const local = parseSupabasePublicConfig(
    "http://127.0.0.1:55321/",
    "public-key",
    "http://localhost:3100",
  );
  assert.deepEqual(local, {
    url: "http://127.0.0.1:55321",
    publishableKey: "public-key",
    siteUrl: "http://localhost:3100",
    signInUrl: "http://localhost:3100/sign-in",
  });
  assert.equal(
    parseSupabasePublicConfig(
      "http://127.0.0.1:55321",
      "public-key",
      "http://127.0.0.1:3100",
    ),
    null,
  );
  assert.equal(
    parseSupabasePublicConfig(
      "https://example.supabase.co",
      "public-key",
      "https://club.example/sign-in",
    ),
    null,
  );
  assert.equal(
    parseSupabasePublicConfig(undefined, undefined, undefined),
    null,
  );
  assert.equal(WEB3_SIGN_IN_STATEMENT.includes("\n"), false);
});

test("the message signer is bound to one account before and after approval", async () => {
  let currentAddress = address;
  const signedMessages: Uint8Array[] = [];
  const wallet = createSolanaAuthWallet(address, {
    currentAddress: () => currentAddress,
    async signMessage(message) {
      signedMessages.push(message);
      return new Uint8Array([1, 2, 3]);
    },
  });

  assert.equal(wallet.publicKey.toBase58(), address);
  assert.deepEqual(
    await wallet.signMessage(new TextEncoder().encode("Sign in")),
    new Uint8Array([1, 2, 3]),
  );
  assert.equal(signedMessages.length, 1);

  currentAddress = otherAddress;
  await assert.rejects(
    wallet.signMessage(new Uint8Array([4])),
    WalletAccountChangedError,
  );
  assert.equal(signedMessages.length, 1);
});

test("an account change after the wallet prompt invalidates the proof", async () => {
  let currentAddress = address;
  const wallet = createSolanaAuthWallet(address, {
    currentAddress: () => currentAddress,
    async signMessage() {
      currentAddress = otherAddress;
      return new Uint8Array([1]);
    },
  });

  await assert.rejects(
    wallet.signMessage(new Uint8Array([4])),
    WalletAccountChangedError,
  );
});

test("structured wallet sign-in keeps the exact result bound to one account", async () => {
  let currentAddress = address;
  const output = {
    account: { address },
    signedMessage: new TextEncoder().encode("wallet-built message"),
    signature: new Uint8Array(64),
  };

  assert.equal(
    await runAccountBoundSignIn(
      address,
      () => currentAddress,
      async () => output,
    ),
    output,
  );

  await assert.rejects(
    runAccountBoundSignIn(
      address,
      () => currentAddress,
      async () => ({
        ...output,
        account: { address: otherAddress },
      }),
    ),
    WalletAccountChangedError,
  );

  await assert.rejects(
    runAccountBoundSignIn(
      address,
      () => currentAddress,
      async () => {
        currentAddress = otherAddress;
        return output;
      },
    ),
    WalletAccountChangedError,
  );
});

test("only a bounded Web3 Solana provider subject yields a session address", () => {
  assert.equal(
    solanaAddressFromWeb3Identities([
      {
        provider: "web3",
        identity_id: `web3:solana:${address}`,
      },
    ]),
    address,
  );
  assert.equal(
    solanaAddressFromWeb3Identities([
      {
        provider: "web3",
        identity_id: "database-uuid",
        identity_data: { sub: `web3:solana:${address}` },
      },
    ]),
    address,
  );
  assert.equal(
    solanaAddressFromWeb3Identities([
      {
        provider: "email",
        identity_id: `web3:solana:${address}`,
      },
      {
        provider: "web3",
        identity_data: { sub: "web3:ethereum:not-solana" },
      },
    ]),
    null,
  );
});

test("wallet and verified session states never imply automatic identity transfer", () => {
  const session: AuthSessionSnapshot = {
    status: "signed-in",
    subject: "user-id",
    walletAddress: address,
    expiresAt: 1_800_000_000,
  };

  assert.equal(walletSessionRelationship(session, address), "matched");
  assert.equal(
    walletSessionRelationship(session, otherAddress),
    "wallet-mismatch",
  );
  assert.equal(walletSessionRelationship(session, null), "wallet-disconnected");
  assert.equal(
    walletSessionRelationship({ status: "signed-out" }, address),
    "signed-out",
  );
  assert.equal(isAuthSessionSnapshot(session), true);
  assert.equal(
    isAuthSessionSnapshot({ ...session, walletAddress: { dangerous: true } }),
    false,
  );
});

test("Auth failures map to bounded copy without echoing provider text", () => {
  assert.match(
    authenticationErrorMessage(new Error("User rejected request")),
    /cancelled/i,
  );
  assert.match(
    authenticationErrorMessage({ status: 429, message: "raw provider body" }),
    /too many/i,
  );
  assert.match(
    authenticationErrorMessage(new Error("fetch failed for secret.example")),
    /unavailable/i,
  );
  assert.match(
    authenticationErrorMessage({
      message: "Signature verification failed in wallet",
    }),
    /Phantom could not complete/i,
  );
  assert.match(
    authenticationErrorMessage({
      message: "Signature does not match address in message",
      status: 400,
    }),
    /Supabase could not verify/i,
  );
  assert.match(
    authenticationErrorMessage(new WalletProofUnsupportedError()),
    /does not expose/i,
  );
  assert.equal(
    authenticationErrorMessage({
      message: "DANGEROUS UNTRUSTED CONTENT",
    }).includes("DANGEROUS"),
    false,
  );
});

test("canonical sign-in checking permits return queries on the exact route", () => {
  const config = parseSupabasePublicConfig(
    "http://127.0.0.1:55321",
    "public-key",
    "http://localhost:3100",
  );
  assert.ok(config);
  assert.equal(
    isCanonicalSignInLocation(config, {
      origin: "http://localhost:3100",
      pathname: "/sign-in",
      search: "",
      hash: "",
    }),
    true,
  );
  assert.equal(
    isCanonicalSignInLocation(config, {
      origin: "http://localhost:3100",
      pathname: "/sign-in",
      search: "?returnTo=/profile",
      hash: "",
    }),
    true,
  );
  assert.equal(
    isCanonicalSignInLocation(config, {
      origin: "https://example.com",
      pathname: "/sign-in",
      search: "?returnTo=/profile",
      hash: "",
    }),
    false,
  );
});
