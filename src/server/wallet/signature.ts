import "server-only";

import {
  address,
  getPublicKeyFromAddress,
  isSignatureBytes,
  verifySignature,
} from "@solana/kit";
import { normalizePersonalWalletAddress } from "@/solana/personal-wallet";

function decodeCanonicalBase64Signature(value: unknown) {
  if (
    typeof value !== "string" ||
    value.length !== 88 ||
    !/^[A-Za-z0-9+/]{86}==$/.test(value)
  ) {
    return null;
  }
  const buffer = Buffer.from(value, "base64");
  if (buffer.toString("base64") !== value) return null;
  const bytes = new Uint8Array(buffer);
  return isSignatureBytes(bytes) ? bytes : null;
}

export async function verifyPersonalWalletSignature(input: {
  walletAddress: unknown;
  message: unknown;
  signature: unknown;
}) {
  const walletAddress = normalizePersonalWalletAddress(input.walletAddress);
  if (
    !walletAddress ||
    typeof input.message !== "string" ||
    input.message.length === 0 ||
    input.message.length > 2_048
  ) {
    return false;
  }
  const signature = decodeCanonicalBase64Signature(input.signature);
  if (!signature) return false;

  try {
    const publicKey = await getPublicKeyFromAddress(address(walletAddress));
    return await verifySignature(
      publicKey,
      signature,
      new TextEncoder().encode(input.message),
    );
  } catch {
    return false;
  }
}
