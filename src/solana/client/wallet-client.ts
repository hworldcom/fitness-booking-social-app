import { createClient } from "@solana/kit";
import { walletSigner } from "@solana/kit-plugin-wallet";

export const SOLANA_WALLET_CHAIN = "solana:devnet" as const;
export const PHANTOM_DOWNLOAD_URL = "https://phantom.com/download";

export const walletClient = createClient().use(
  walletSigner({
    chain: SOLANA_WALLET_CHAIN,
    storageKey: "repx-club:phantom-wallet",
    filter: (wallet) => wallet.name.toLowerCase() === "phantom",
  }),
);

export type RepXWalletClient = typeof walletClient;
