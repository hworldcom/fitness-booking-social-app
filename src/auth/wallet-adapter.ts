export class WalletAccountChangedError extends Error {
  constructor() {
    super(
      "The active wallet account changed while the sign-in proof was running.",
    );
    this.name = "WalletAccountChangedError";
  }
}

export class WalletProofUnsupportedError extends Error {
  constructor() {
    super(
      "The connected wallet does not support a message-only sign-in proof.",
    );
    this.name = "WalletProofUnsupportedError";
  }
}

export type WalletMessageSource = Readonly<{
  currentAddress: () => string | null;
  signMessage: (message: Uint8Array) => Promise<Uint8Array>;
}>;

type WalletSignInResult = Readonly<{
  account: Readonly<{ address: string }>;
}>;

export async function runAccountBoundSignIn<TResult extends WalletSignInResult>(
  expectedAddress: string,
  currentAddress: () => string | null,
  signIn: () => Promise<TResult>,
): Promise<TResult> {
  if (currentAddress() !== expectedAddress) {
    throw new WalletAccountChangedError();
  }

  const result = await signIn();

  if (
    currentAddress() !== expectedAddress ||
    result.account.address !== expectedAddress
  ) {
    throw new WalletAccountChangedError();
  }

  return result;
}

export function createSolanaAuthWallet(
  expectedAddress: string,
  source: WalletMessageSource,
) {
  return {
    publicKey: {
      toBase58: () => expectedAddress,
    },
    async signMessage(message: Uint8Array) {
      if (source.currentAddress() !== expectedAddress) {
        throw new WalletAccountChangedError();
      }

      const signature = await source.signMessage(message);

      if (source.currentAddress() !== expectedAddress) {
        throw new WalletAccountChangedError();
      }

      return new Uint8Array(signature);
    },
  };
}
