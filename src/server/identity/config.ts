import { isAddress } from "@solana/kit";

export const DEVNET_CLUSTER = "solana:devnet" as const;

export type PreparedPersonalIdentity = Readonly<{
  walletAddress: string;
  profileSlug: string;
  demoRunSlug: string;
  cluster: typeof DEVNET_CLUSTER;
}>;

export class PreparedIdentityConfigurationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "PreparedIdentityConfigurationError";
  }
}

const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const allowedKeys = new Set([
  "walletAddress",
  "profileSlug",
  "demoRunSlug",
  "cluster",
]);

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function invalidConfiguration(): never {
  throw new PreparedIdentityConfigurationError(
    "PREPARED_PERSONAL_IDENTITIES_JSON must contain valid, unique prepared identity entries.",
  );
}

export function parsePreparedPersonalIdentities(
  value: string | undefined,
): readonly PreparedPersonalIdentity[] {
  if (!value?.trim()) {
    throw new PreparedIdentityConfigurationError(
      "PREPARED_PERSONAL_IDENTITIES_JSON is required for prepared enrollment.",
    );
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(value);
  } catch {
    invalidConfiguration();
  }

  if (!Array.isArray(parsed) || parsed.length === 0 || parsed.length > 20) {
    invalidConfiguration();
  }

  const walletKeys = new Set<string>();
  const actorKeys = new Set<string>();
  const entries = parsed.map((candidate) => {
    if (
      !isRecord(candidate) ||
      Object.keys(candidate).some((key) => !allowedKeys.has(key)) ||
      Object.keys(candidate).length !== allowedKeys.size
    ) {
      invalidConfiguration();
    }

    const { walletAddress, profileSlug, demoRunSlug, cluster } = candidate;
    if (
      typeof walletAddress !== "string" ||
      walletAddress !== walletAddress.trim() ||
      !isAddress(walletAddress) ||
      typeof profileSlug !== "string" ||
      !slugPattern.test(profileSlug) ||
      typeof demoRunSlug !== "string" ||
      !slugPattern.test(demoRunSlug) ||
      cluster !== DEVNET_CLUSTER
    ) {
      invalidConfiguration();
    }

    const walletKey = `${cluster}:${walletAddress}`;
    const actorKey = `${demoRunSlug}:${profileSlug}`;
    if (walletKeys.has(walletKey) || actorKeys.has(actorKey)) {
      invalidConfiguration();
    }
    walletKeys.add(walletKey);
    actorKeys.add(actorKey);

    return Object.freeze({
      walletAddress,
      profileSlug,
      demoRunSlug,
      cluster,
    });
  });

  return Object.freeze(entries);
}

export function preparedIdentityForWallet(
  identities: readonly PreparedPersonalIdentity[],
  walletAddress: string,
) {
  return identities.find(
    (identity) => identity.walletAddress === walletAddress,
  );
}
