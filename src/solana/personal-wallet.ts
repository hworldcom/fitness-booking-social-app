import { address } from "@solana/kit";

export const PERSONAL_WALLET_CLUSTER = "solana:devnet" as const;
export const PERSONAL_WALLET_CHALLENGE_LIFETIME_SECONDS = 5 * 60;
export const PERSONAL_WALLET_MESSAGE_VERSION = 1 as const;

export type PersonalWalletPurpose =
  "link-personal-wallet" | "replace-personal-wallet";

export type PersonalWalletBinding = Readonly<{
  address: string;
  cluster: typeof PERSONAL_WALLET_CLUSTER;
  verifiedAt: string;
}>;

export type PersonalWalletSnapshot =
  | Readonly<{ status: "preview" | "signed-out" | "forbidden" | "unavailable" }>
  | Readonly<{ status: "unlinked" }>
  | Readonly<{ status: "linked"; wallet: PersonalWalletBinding }>;

export type PersonalWalletChallenge = Readonly<{
  id: string;
  purpose: PersonalWalletPurpose;
  address: string;
  message: string;
  expiresAt: string;
}>;

export type PersonalWalletChallengeResult =
  | Readonly<{ status: "challenge"; challenge: PersonalWalletChallenge }>
  | Readonly<{
      status:
        | "invalid-request"
        | "reauth-required"
        | "conflict"
        | "signed-out"
        | "forbidden"
        | "unavailable";
    }>;

export type PersonalWalletMutationResult =
  | Readonly<{ status: "unlinked" }>
  | Readonly<{ status: "linked"; wallet: PersonalWalletBinding }>
  | Readonly<{
      status:
        | "invalid-request"
        | "invalid-proof"
        | "reauth-required"
        | "conflict"
        | "signed-out"
        | "forbidden"
        | "unavailable";
    }>;

export function normalizePersonalWalletAddress(value: unknown): string | null {
  if (
    typeof value !== "string" ||
    value.length < 32 ||
    value.length > 44 ||
    !/^[1-9A-HJ-NP-Za-km-z]+$/.test(value)
  ) {
    return null;
  }
  try {
    return address(value);
  } catch {
    return null;
  }
}

export function isPersonalWalletPurpose(
  value: unknown,
): value is PersonalWalletPurpose {
  return (
    value === "link-personal-wallet" || value === "replace-personal-wallet"
  );
}

export function normalizePersonalWalletChallengeId(
  value: unknown,
): string | null {
  if (typeof value !== "string") return null;
  const challengeId = value.toLowerCase();
  return /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/.test(
    challengeId,
  )
    ? challengeId
    : null;
}

export function buildPersonalWalletMessage(input: {
  purpose: PersonalWalletPurpose;
  email: string;
  origin: string;
  address: string;
  challengeId: string;
  nonce: string;
  issuedAt: string;
  expiresAt: string;
}) {
  const action =
    input.purpose === "link-personal-wallet"
      ? "Link personal wallet"
      : "Replace personal wallet";
  return [
    "MovX Club wallet ownership proof",
    "",
    `Action: ${action}`,
    `Account: ${input.email}`,
    `Origin: ${input.origin}`,
    `Network: ${PERSONAL_WALLET_CLUSTER}`,
    `Wallet: ${input.address}`,
    `Challenge ID: ${input.challengeId}`,
    `Nonce: ${input.nonce}`,
    `Issued at: ${input.issuedAt}`,
    `Expires at: ${input.expiresAt}`,
    "",
    "This request does not create a transaction or move funds.",
  ].join("\n");
}

function isWalletBinding(value: unknown): value is PersonalWalletBinding {
  if (!value || typeof value !== "object" || Array.isArray(value)) return false;
  const wallet = value as Record<string, unknown>;
  return (
    normalizePersonalWalletAddress(wallet.address) !== null &&
    wallet.cluster === PERSONAL_WALLET_CLUSTER &&
    typeof wallet.verifiedAt === "string" &&
    Number.isFinite(Date.parse(wallet.verifiedAt))
  );
}

export function isPersonalWalletSnapshot(
  value: unknown,
): value is PersonalWalletSnapshot {
  if (!value || typeof value !== "object" || !("status" in value)) {
    return false;
  }
  const snapshot = value as Record<string, unknown>;
  if (
    snapshot.status === "preview" ||
    snapshot.status === "signed-out" ||
    snapshot.status === "forbidden" ||
    snapshot.status === "unavailable" ||
    snapshot.status === "unlinked"
  ) {
    return true;
  }
  return snapshot.status === "linked" && isWalletBinding(snapshot.wallet);
}

export function isPersonalWalletChallengeResult(
  value: unknown,
): value is PersonalWalletChallengeResult {
  if (!value || typeof value !== "object" || !("status" in value)) {
    return false;
  }
  const result = value as Record<string, unknown>;
  if (
    result.status === "invalid-request" ||
    result.status === "reauth-required" ||
    result.status === "conflict" ||
    result.status === "signed-out" ||
    result.status === "forbidden" ||
    result.status === "unavailable"
  ) {
    return true;
  }
  if (
    result.status !== "challenge" ||
    !result.challenge ||
    typeof result.challenge !== "object" ||
    Array.isArray(result.challenge)
  ) {
    return false;
  }
  const challenge = result.challenge as Record<string, unknown>;
  return (
    normalizePersonalWalletChallengeId(challenge.id) !== null &&
    isPersonalWalletPurpose(challenge.purpose) &&
    normalizePersonalWalletAddress(challenge.address) !== null &&
    typeof challenge.message === "string" &&
    challenge.message.length <= 2_048 &&
    typeof challenge.expiresAt === "string" &&
    Number.isFinite(Date.parse(challenge.expiresAt))
  );
}

export function isPersonalWalletMutationResult(
  value: unknown,
): value is PersonalWalletMutationResult {
  if (isPersonalWalletSnapshot(value)) {
    return value.status === "linked" || value.status === "unlinked";
  }
  if (!value || typeof value !== "object" || !("status" in value)) {
    return false;
  }
  const status = (value as Record<string, unknown>).status;
  return (
    status === "invalid-request" ||
    status === "invalid-proof" ||
    status === "reauth-required" ||
    status === "conflict" ||
    status === "signed-out" ||
    status === "forbidden" ||
    status === "unavailable"
  );
}

export function walletSignatureToBase64(signature: Uint8Array) {
  let binary = "";
  for (const byte of signature) binary += String.fromCharCode(byte);
  return btoa(binary);
}
