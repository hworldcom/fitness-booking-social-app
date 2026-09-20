"use client";

import { walletClient } from "@/solana/client/wallet-client";
import {
  createSolanaAuthWallet,
  runAccountBoundSignIn,
  WalletAccountChangedError,
  WalletProofUnsupportedError,
  type WalletMessageSource,
} from "../wallet-adapter";

const SIGN_IN_FEATURE = "solana:signIn";
const SIGN_MESSAGE_FEATURE = "solana:signMessage";

const phantomMessageSource: WalletMessageSource = {
  currentAddress() {
    return walletClient.wallet.getState().connected?.account.address ?? null;
  },
  async signMessage(message) {
    const account = walletClient.wallet.getState().connected?.account;
    if (!account?.features.includes(SIGN_MESSAGE_FEATURE)) {
      throw new WalletProofUnsupportedError();
    }
    return new Uint8Array(await walletClient.wallet.signMessage(message));
  },
};

export function phantomAuthWallet(expectedAddress: string) {
  const connected = walletClient.wallet.getState().connected;
  if (!connected || connected.account.address !== expectedAddress) {
    throw new WalletAccountChangedError();
  }

  const messageWallet = createSolanaAuthWallet(
    expectedAddress,
    phantomMessageSource,
  );

  if (!connected.wallet.features.includes(SIGN_IN_FEATURE)) {
    return messageWallet;
  }

  return {
    ...messageWallet,
    async signIn(
      input: Parameters<typeof walletClient.wallet.signIn>[1],
    ): Promise<Awaited<ReturnType<typeof walletClient.wallet.signIn>>> {
      return runAccountBoundSignIn(
        expectedAddress,
        phantomMessageSource.currentAddress,
        () => walletClient.wallet.signIn(connected.wallet, input),
      );
    },
  };
}
