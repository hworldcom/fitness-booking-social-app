import assert from "node:assert/strict";
import test from "node:test";
import { generateKeyPairSigner, signBytes } from "@solana/kit";
import { verifyPersonalWalletSignature } from "../../src/server/wallet/signature";

test("the server accepts only the exact Ed25519 wallet message proof", async () => {
  const signer = await generateKeyPairSigner();
  const message = "MovX Club test ownership proof";
  const signature = await signBytes(
    signer.keyPair.privateKey,
    new TextEncoder().encode(message),
  );
  const base64Signature = Buffer.from(signature).toString("base64");

  assert.equal(
    await verifyPersonalWalletSignature({
      walletAddress: signer.address,
      message,
      signature: base64Signature,
    }),
    true,
  );
  assert.equal(
    await verifyPersonalWalletSignature({
      walletAddress: signer.address,
      message: `${message}.`,
      signature: base64Signature,
    }),
    false,
  );
  assert.equal(
    await verifyPersonalWalletSignature({
      walletAddress: signer.address,
      message,
      signature: `${base64Signature.slice(0, -2)}AA`,
    }),
    false,
  );
  assert.equal(
    await verifyPersonalWalletSignature({
      walletAddress: "not-a-wallet",
      message,
      signature: base64Signature,
    }),
    false,
  );
});
