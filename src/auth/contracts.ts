export type AuthSessionSnapshot =
  | Readonly<{ status: "disabled" }>
  | Readonly<{ status: "signed-out" }>
  | Readonly<{ status: "unavailable" }>
  | Readonly<{
      status: "signed-in";
      subject: string;
      walletAddress: string;
      expiresAt: number | null;
    }>;

export type WalletSessionRelationship =
  | "signed-out"
  | "matched"
  | "wallet-disconnected"
  | "wallet-mismatch"
  | "session-unavailable";

export const DISABLED_AUTH_SESSION: AuthSessionSnapshot = Object.freeze({
  status: "disabled",
});

export const SIGNED_OUT_AUTH_SESSION: AuthSessionSnapshot = Object.freeze({
  status: "signed-out",
});

export const UNAVAILABLE_AUTH_SESSION: AuthSessionSnapshot = Object.freeze({
  status: "unavailable",
});

export function walletSessionRelationship(
  session: AuthSessionSnapshot,
  connectedAddress: string | null,
): WalletSessionRelationship {
  if (session.status === "disabled" || session.status === "unavailable") {
    return "session-unavailable";
  }
  if (session.status === "signed-out") return "signed-out";
  if (!connectedAddress) return "wallet-disconnected";
  return connectedAddress === session.walletAddress
    ? "matched"
    : "wallet-mismatch";
}

export function isAuthSessionSnapshot(
  value: unknown,
): value is AuthSessionSnapshot {
  if (!value || typeof value !== "object" || !("status" in value)) {
    return false;
  }

  const session = value as Record<string, unknown>;
  if (
    session.status === "disabled" ||
    session.status === "signed-out" ||
    session.status === "unavailable"
  ) {
    return true;
  }

  return (
    session.status === "signed-in" &&
    typeof session.subject === "string" &&
    typeof session.walletAddress === "string" &&
    (typeof session.expiresAt === "number" || session.expiresAt === null)
  );
}
