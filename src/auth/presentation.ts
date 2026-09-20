import {
  WalletAccountChangedError,
  WalletProofUnsupportedError,
} from "./wallet-adapter";

const REJECTION_MARKERS = ["cancel", "declin", "reject", "denied"];

function errorDetails(error: unknown) {
  if (!error || typeof error !== "object") {
    return {
      code: null as number | null,
      message: "",
      status: null as number | null,
    };
  }

  const candidate = error as {
    code?: unknown;
    message?: unknown;
    status?: unknown;
  };
  return {
    code: typeof candidate.code === "number" ? candidate.code : null,
    message:
      typeof candidate.message === "string"
        ? candidate.message.toLowerCase()
        : "",
    status: typeof candidate.status === "number" ? candidate.status : null,
  };
}

export function authenticationErrorMessage(error: unknown): string {
  if (error instanceof WalletAccountChangedError) {
    return "The active Phantom account changed during sign-in. No session was created; review the selected account and try again.";
  }
  if (error instanceof WalletProofUnsupportedError) {
    return "This Phantom account does not expose a supported message-only sign-in method. Update Phantom, reconnect it, and try again.";
  }

  const { code, message, status } = errorDetails(error);

  if (
    (error instanceof DOMException && error.name === "AbortError") ||
    code === 4001 ||
    REJECTION_MARKERS.some((marker) => message.includes(marker))
  ) {
    return "The message-signature request was cancelled. You remain signed out and can try again when you’re ready.";
  }
  if (status === 429 || message.includes("rate limit")) {
    return "Too many sign-in attempts were made. Wait a few minutes before trying again.";
  }
  if (code === 4100) {
    return "Phantom has not authorized this account for RepX Club. Reconnect the selected account and try again.";
  }
  if (message.includes("lock")) {
    return "Unlock Phantom, confirm the selected account, and try signing in again.";
  }
  if (
    message.includes("url") ||
    message.includes("uri") ||
    message.includes("domain") ||
    message.includes("origin") ||
    message.includes("redirect")
  ) {
    return "This page is not an approved RepX Club sign-in address. Open the canonical sign-in page and try again.";
  }
  if (message.includes("expired") || message.includes("issued")) {
    return "The sign-in proof expired before it could be verified. Start a new sign-in attempt.";
  }
  if (
    status !== null &&
    (message.includes("signature") || message.includes("sign message"))
  ) {
    return "Supabase could not verify the Phantom message signature. Confirm the selected account and try again.";
  }
  if (message.includes("signature") || message.includes("sign message")) {
    return "Phantom could not complete the message-signature request. Update or reconnect Phantom, then try again.";
  }
  if (
    message.includes("fetch") ||
    message.includes("network") ||
    message.includes("unavailable") ||
    status === 500 ||
    status === 502 ||
    status === 503 ||
    status === 504
  ) {
    return "The local authentication service is unavailable. Public browsing still works; start Supabase Auth and retry.";
  }
  return "RepX Club could not verify this sign-in attempt. You remain signed out and can safely try again.";
}
