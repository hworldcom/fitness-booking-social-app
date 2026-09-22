import {
  normalizePersonalWalletAddress,
  normalizePersonalWalletChallengeId,
} from "./personal-wallet";

export const CLUB_WALLET_CLUSTER = "solana:devnet" as const;
export const CLUB_WALLET_PURPOSE = "authorize-club-wallet" as const;
export const CLUB_WALLET_CHALLENGE_LIFETIME_SECONDS = 5 * 60;
export const CLUB_WALLET_AUTHORITY_LIFETIME_SECONDS = 10 * 60;

export type ClubWallet = Readonly<{
  address: string;
  cluster: typeof CLUB_WALLET_CLUSTER;
  verifiedAt: string;
}>;

export type ClubWalletContext = Readonly<{
  slug: string;
  name: string;
  wallet: ClubWallet;
}>;

export type ClubWalletAuthority = Readonly<{
  grantedAt: string;
  expiresAt: string;
}>;

export type ClubWalletSnapshot =
  | Readonly<{ status: "preview" | "signed-out" | "forbidden" | "unavailable" }>
  | Readonly<{ status: "no-club-access" }>
  | Readonly<{ status: "eligible"; club: ClubWalletContext }>
  | Readonly<{
      status: "authorized";
      club: ClubWalletContext;
      authority: ClubWalletAuthority;
    }>;

export type ClubWalletChallenge = Readonly<{
  id: string;
  purpose: typeof CLUB_WALLET_PURPOSE;
  address: string;
  message: string;
  expiresAt: string;
}>;

export type ClubWalletChallengeResult =
  | Readonly<{ status: "challenge"; challenge: ClubWalletChallenge }>
  | Readonly<{
      status:
        | "invalid-request"
        | "no-club-access"
        | "conflict"
        | "signed-out"
        | "forbidden"
        | "unavailable";
    }>;

export type ClubWalletMutationResult =
  | Extract<ClubWalletSnapshot, { status: "eligible" | "authorized" }>
  | Readonly<{ status: "revoked" | "no-authority" }>
  | Readonly<{
      status:
        | "invalid-request"
        | "invalid-proof"
        | "no-club-access"
        | "conflict"
        | "signed-out"
        | "forbidden"
        | "unavailable";
    }>;

function isTimestamp(value: unknown): value is string {
  return typeof value === "string" && Number.isFinite(Date.parse(value));
}

function isClubWallet(value: unknown): value is ClubWallet {
  if (!value || typeof value !== "object" || Array.isArray(value)) return false;
  const wallet = value as Record<string, unknown>;
  return (
    normalizePersonalWalletAddress(wallet.address) !== null &&
    wallet.cluster === CLUB_WALLET_CLUSTER &&
    isTimestamp(wallet.verifiedAt)
  );
}

function isClubWalletContext(value: unknown): value is ClubWalletContext {
  if (!value || typeof value !== "object" || Array.isArray(value)) return false;
  const club = value as Record<string, unknown>;
  return (
    typeof club.slug === "string" &&
    /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(club.slug) &&
    typeof club.name === "string" &&
    club.name.length > 0 &&
    club.name.length <= 120 &&
    isClubWallet(club.wallet)
  );
}

export function buildClubWalletMessage(input: {
  email: string;
  origin: string;
  organizationId: string;
  clubSlug: string;
  clubName: string;
  address: string;
  challengeId: string;
  nonce: string;
  issuedAt: string;
  expiresAt: string;
}) {
  return [
    "MovX Club club wallet authority proof",
    "",
    "Action: Authorize club wallet",
    `Administrator: ${input.email}`,
    `Club: ${input.clubName} (${input.clubSlug})`,
    `Club ID: ${input.organizationId}`,
    `Origin: ${input.origin}`,
    `Network: ${CLUB_WALLET_CLUSTER}`,
    `Wallet: ${input.address}`,
    `Challenge ID: ${input.challengeId}`,
    `Nonce: ${input.nonce}`,
    `Issued at: ${input.issuedAt}`,
    `Expires at: ${input.expiresAt}`,
    "",
    "This grants short-lived club authority. It does not create a transaction or move funds.",
  ].join("\n");
}

export function isClubWalletSnapshot(
  value: unknown,
): value is ClubWalletSnapshot {
  if (!value || typeof value !== "object" || !("status" in value)) {
    return false;
  }
  const snapshot = value as Record<string, unknown>;
  if (
    snapshot.status === "preview" ||
    snapshot.status === "signed-out" ||
    snapshot.status === "forbidden" ||
    snapshot.status === "unavailable" ||
    snapshot.status === "no-club-access"
  ) {
    return true;
  }
  if (!isClubWalletContext(snapshot.club)) return false;
  if (snapshot.status === "eligible") return true;
  if (
    snapshot.status !== "authorized" ||
    !snapshot.authority ||
    typeof snapshot.authority !== "object" ||
    Array.isArray(snapshot.authority)
  ) {
    return false;
  }
  const authority = snapshot.authority as Record<string, unknown>;
  return isTimestamp(authority.grantedAt) && isTimestamp(authority.expiresAt);
}

export function isClubWalletChallengeResult(
  value: unknown,
): value is ClubWalletChallengeResult {
  if (!value || typeof value !== "object" || !("status" in value)) {
    return false;
  }
  const result = value as Record<string, unknown>;
  if (
    result.status === "invalid-request" ||
    result.status === "no-club-access" ||
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
    challenge.purpose === CLUB_WALLET_PURPOSE &&
    normalizePersonalWalletAddress(challenge.address) !== null &&
    typeof challenge.message === "string" &&
    challenge.message.length > 0 &&
    challenge.message.length <= 2_048 &&
    isTimestamp(challenge.expiresAt)
  );
}

export function isClubWalletMutationResult(
  value: unknown,
): value is ClubWalletMutationResult {
  if (isClubWalletSnapshot(value)) {
    return value.status === "eligible" || value.status === "authorized";
  }
  if (!value || typeof value !== "object" || !("status" in value)) {
    return false;
  }
  const status = (value as Record<string, unknown>).status;
  return (
    status === "revoked" ||
    status === "no-authority" ||
    status === "invalid-request" ||
    status === "invalid-proof" ||
    status === "no-club-access" ||
    status === "conflict" ||
    status === "signed-out" ||
    status === "forbidden" ||
    status === "unavailable"
  );
}
