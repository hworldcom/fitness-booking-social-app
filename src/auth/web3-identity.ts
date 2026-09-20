const SOLANA_ADDRESS = /^[1-9A-HJ-NP-Za-km-z]{32,44}$/;
const SOLANA_WEB3_PREFIX = "web3:solana:";

type AuthIdentity = Readonly<{
  provider?: unknown;
  identity_id?: unknown;
  identity_data?: unknown;
}>;

function addressFromProviderSubject(value: unknown): string | null {
  if (typeof value !== "string" || !value.startsWith(SOLANA_WEB3_PREFIX)) {
    return null;
  }

  const address = value.slice(SOLANA_WEB3_PREFIX.length);
  return SOLANA_ADDRESS.test(address) ? address : null;
}

export function solanaAddressFromWeb3Identities(
  identities: readonly AuthIdentity[] | null | undefined,
): string | null {
  for (const identity of identities ?? []) {
    if (identity.provider !== "web3") continue;

    const direct = addressFromProviderSubject(identity.identity_id);
    if (direct) return direct;

    if (
      identity.identity_data &&
      typeof identity.identity_data === "object" &&
      "sub" in identity.identity_data
    ) {
      const subject = addressFromProviderSubject(
        (identity.identity_data as Record<string, unknown>).sub,
      );
      if (subject) return subject;
    }
  }

  return null;
}
