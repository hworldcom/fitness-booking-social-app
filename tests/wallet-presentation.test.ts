import assert from "node:assert/strict";
import test from "node:test";
import {
  shortenWalletAddress,
  walletErrorMessage,
} from "../src/solana/client/wallet-presentation";

test("shortens public addresses without changing short values", () => {
  assert.equal(shortenWalletAddress("1234567890"), "1234567890");
  assert.equal(
    shortenWalletAddress("7YWHMfk9JZe0LM1W7mFDJH8QvJ75zEQY4zBbDx8kPn9M"),
    "7YWH…Pn9M",
  );
});

test("maps wallet failures to bounded, actionable messages", () => {
  assert.match(
    walletErrorMessage(new Error("User rejected the request")) ?? "",
    /cancelled/i,
  );
  assert.match(
    walletErrorMessage(new Error("Wallet is locked")) ?? "",
    /unlock Phantom/i,
  );
  assert.match(
    walletErrorMessage(new Error("No accounts returned")) ?? "",
    /Solana account/i,
  );
  assert.equal(
    walletErrorMessage(new DOMException("Superseded", "AbortError")),
    null,
  );
  assert.equal(
    walletErrorMessage({ dangerous: "untrusted provider output" }),
    "Phantom could not connect. Check the extension and try again.",
  );
});
