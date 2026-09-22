const REJECTION_MARKERS = ["cancel", "declin", "reject", "denied"];

export function shortenWalletAddress(address: string): string {
  if (address.length <= 12) return address;
  return `${address.slice(0, 4)}…${address.slice(-4)}`;
}

export function walletErrorMessage(error: unknown): string | null {
  if (!error) return null;
  if (error instanceof DOMException && error.name === "AbortError") return null;

  const message = error instanceof Error ? error.message.toLowerCase() : "";

  if (REJECTION_MARKERS.some((marker) => message.includes(marker))) {
    return "The Phantom connection request was cancelled. You can try again when you’re ready.";
  }
  if (message.includes("lock")) {
    return "Unlock Phantom, then try connecting again.";
  }
  if (message.includes("account")) {
    return "Phantom did not provide a Solana account. Select an account in Phantom and try again.";
  }
  return "Phantom could not connect. Check the extension and try again.";
}

export function walletProofErrorMessage(error: unknown): string {
  const message = error instanceof Error ? error.message.toLowerCase() : "";
  if (REJECTION_MARKERS.some((marker) => message.includes(marker))) {
    return "The Phantom message request was cancelled. Your wallet link was not changed.";
  }
  if (message.includes("lock")) {
    return "Unlock Phantom, then try the message request again.";
  }
  return "Phantom could not sign the ownership message. Your wallet link was not changed.";
}
