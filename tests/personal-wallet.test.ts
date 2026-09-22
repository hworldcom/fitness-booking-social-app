import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  buildPersonalWalletMessage,
  isPersonalWalletChallengeResult,
  isPersonalWalletMutationResult,
  isPersonalWalletSnapshot,
  normalizePersonalWalletAddress,
  normalizePersonalWalletChallengeId,
  walletSignatureToBase64,
} from "../src/solana/personal-wallet";

const walletAddress = "11111111111111111111111111111111";
const challengeId = "95000000-0000-4000-8000-000000000001";

test("personal wallet messages bind the visible action and security context", () => {
  const message = buildPersonalWalletMessage({
    purpose: "replace-personal-wallet",
    email: "anna@example.com",
    origin: "https://movx.club",
    address: walletAddress,
    challengeId,
    nonce: "a-random-base64url-nonce",
    issuedAt: "2026-09-22T12:00:00.000Z",
    expiresAt: "2026-09-22T12:05:00.000Z",
  });

  for (const expected of [
    "MovX Club wallet ownership proof",
    "Action: Replace personal wallet",
    "Account: anna@example.com",
    "Origin: https://movx.club",
    "Network: solana:devnet",
    `Wallet: ${walletAddress}`,
    `Challenge ID: ${challengeId}`,
    "This request does not create a transaction or move funds.",
  ]) {
    assert.match(
      message,
      new RegExp(expected.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")),
    );
  }
});

test("personal wallet transport validators reject malformed and expanded data", () => {
  assert.equal(normalizePersonalWalletAddress(walletAddress), walletAddress);
  assert.equal(normalizePersonalWalletAddress(`${walletAddress}0`), null);
  assert.equal(normalizePersonalWalletChallengeId(challengeId), challengeId);
  assert.equal(
    normalizePersonalWalletChallengeId("95000000-0000-1000-8000-000000000001"),
    null,
  );
  assert.equal(
    isPersonalWalletSnapshot({
      status: "linked",
      wallet: {
        address: walletAddress,
        cluster: "solana:mainnet",
        verifiedAt: "2026-09-22T12:00:00.000Z",
      },
    }),
    false,
  );
  assert.equal(
    isPersonalWalletChallengeResult({
      status: "challenge",
      challenge: {
        id: challengeId,
        purpose: "link-personal-wallet",
        address: walletAddress,
        message: "proof",
        expiresAt: "2026-09-22T12:05:00.000Z",
      },
    }),
    true,
  );
  assert.equal(
    isPersonalWalletMutationResult({ status: "invalid-proof" }),
    true,
  );
  assert.equal(isPersonalWalletMutationResult({ status: "preview" }), false);
  assert.equal(
    walletSignatureToBase64(new Uint8Array([0, 1, 2, 253, 254, 255])),
    "AAEC/f7/",
  );
});

test("personal wallet linking requests a message signature and no transaction", () => {
  const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
  const source = readFileSync(
    path.join(root, "src/solana/client/wallet-connection.tsx"),
    "utf8",
  );
  assert.match(source, /useSignMessage/);
  assert.doesNotMatch(source, /signTransaction|sendTransaction|signAndSend/);
});
