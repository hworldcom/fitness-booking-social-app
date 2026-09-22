import "server-only";

import { createHash, randomBytes } from "node:crypto";
import { isRecentEmailOtpAuthentication } from "@/auth/reauthentication";
import { verifiedAuthContext } from "@/server/auth/session";
import { withAuthorizedSession } from "@/server/authorization/service";
import { applicationAccessMode } from "@/server/authorization/env";
import {
  PersonalWalletChallengeRejectedError,
  PersonalWalletStateConflictError,
  completePersonalWalletChallengeRecord,
  currentPersonalWalletBinding,
  issuePersonalWalletChallengeRecord,
  personalWalletChallengeClock,
  unlinkPersonalWalletRecord,
  type PersonalWalletBindingRecord,
} from "@/server/db/wallet/repository";
import {
  PERSONAL_WALLET_CHALLENGE_LIFETIME_SECONDS,
  PERSONAL_WALLET_CLUSTER,
  buildPersonalWalletMessage,
  normalizePersonalWalletAddress,
  normalizePersonalWalletChallengeId,
  type PersonalWalletChallengeResult,
  type PersonalWalletMutationResult,
  type PersonalWalletPurpose,
  type PersonalWalletSnapshot,
} from "@/solana/personal-wallet";
import { verifyPersonalWalletSignature } from "./signature";

function accessStatus(
  status: "preview" | "signed-out" | "forbidden" | "unavailable",
) {
  return Object.freeze({ status });
}

function mutationAccessStatus(
  status: "preview" | "signed-out" | "forbidden" | "unavailable",
) {
  return Object.freeze({
    status: status === "preview" ? ("unavailable" as const) : status,
  });
}

function mapBinding(
  binding: PersonalWalletBindingRecord,
): PersonalWalletSnapshot & { status: "linked" } {
  return Object.freeze({
    status: "linked",
    wallet: Object.freeze({
      address: binding.address,
      cluster: PERSONAL_WALLET_CLUSTER,
      verifiedAt: binding.verifiedAt,
    }),
  });
}

function hashHex(value: Uint8Array | string) {
  return createHash("sha256").update(value).digest("hex");
}

function reauthenticatedAtIso(timestamp: number | null) {
  return timestamp === null ? null : new Date(timestamp * 1_000).toISOString();
}

function initialAccessStatus() {
  const mode = applicationAccessMode();
  return mode === "preview"
    ? accessStatus("preview")
    : mode === "unavailable"
      ? accessStatus("unavailable")
      : null;
}

export async function personalWalletSnapshot(): Promise<PersonalWalletSnapshot> {
  const initial = initialAccessStatus();
  if (initial) return initial;

  const context = await verifiedAuthContext();
  const result = await withAuthorizedSession(
    context.session,
    currentPersonalWalletBinding,
  );
  if (result.status !== "authorized") return accessStatus(result.status);
  return result.value
    ? mapBinding(result.value)
    : Object.freeze({ status: "unlinked" });
}

export async function issuePersonalWalletChallenge(input: {
  purpose: PersonalWalletPurpose;
  walletAddress: unknown;
  origin: string;
}): Promise<PersonalWalletChallengeResult> {
  const initial = initialAccessStatus();
  if (initial) return mutationAccessStatus(initial.status);
  const walletAddress = normalizePersonalWalletAddress(input.walletAddress);
  if (!walletAddress) return Object.freeze({ status: "invalid-request" });

  const context = await verifiedAuthContext();
  const session = context.session;
  if (session.status !== "signed-in") {
    return mutationAccessStatus(
      session.status === "signed-out" ? "signed-out" : "unavailable",
    );
  }
  if (
    input.purpose === "replace-personal-wallet" &&
    !isRecentEmailOtpAuthentication(context.emailOtpAuthenticatedAt)
  ) {
    return Object.freeze({ status: "reauth-required" });
  }

  try {
    const result = await withAuthorizedSession(session, async (transaction) => {
      try {
        const clock = await personalWalletChallengeClock(transaction);
        const issuedAt = new Date(clock.issuedAt);
        const expiresAt = new Date(
          issuedAt.getTime() +
            PERSONAL_WALLET_CHALLENGE_LIFETIME_SECONDS * 1_000,
        ).toISOString();
        const nonceBytes = randomBytes(32);
        const nonce = nonceBytes.toString("base64url");
        const message = buildPersonalWalletMessage({
          purpose: input.purpose,
          email: session.email,
          origin: input.origin,
          address: walletAddress,
          challengeId: clock.id,
          nonce,
          issuedAt: issuedAt.toISOString(),
          expiresAt,
        });
        await issuePersonalWalletChallengeRecord(transaction, {
          id: clock.id,
          purpose: input.purpose,
          address: walletAddress,
          origin: input.origin,
          nonceHashHex: hashHex(nonceBytes),
          messageHashHex: hashHex(message),
          issuedAt: issuedAt.toISOString(),
          expiresAt,
        });
        return Object.freeze({
          status: "challenge" as const,
          challenge: Object.freeze({
            id: clock.id,
            purpose: input.purpose,
            address: walletAddress,
            message,
            expiresAt,
          }),
        });
      } catch (error) {
        if (error instanceof PersonalWalletStateConflictError) {
          return Object.freeze({ status: "conflict" as const });
        }
        throw error;
      }
    });
    if (result.status !== "authorized") {
      return mutationAccessStatus(result.status);
    }
    return result.value;
  } catch (error) {
    return error instanceof PersonalWalletStateConflictError
      ? Object.freeze({ status: "conflict" })
      : Object.freeze({ status: "unavailable" });
  }
}

export async function completePersonalWalletProof(input: {
  challengeId: string;
  purpose: PersonalWalletPurpose;
  walletAddress: unknown;
  message: unknown;
  signature: unknown;
}): Promise<PersonalWalletMutationResult> {
  const initial = initialAccessStatus();
  if (initial) return mutationAccessStatus(initial.status);
  const walletAddress = normalizePersonalWalletAddress(input.walletAddress);
  const challengeId = normalizePersonalWalletChallengeId(input.challengeId);
  const message = input.message;
  if (
    !walletAddress ||
    !challengeId ||
    typeof message !== "string" ||
    message.length === 0 ||
    message.length > 2_048
  ) {
    return Object.freeze({ status: "invalid-request" });
  }

  const context = await verifiedAuthContext();
  if (context.session.status !== "signed-in") {
    return mutationAccessStatus(
      context.session.status === "signed-out" ? "signed-out" : "unavailable",
    );
  }
  if (
    input.purpose === "replace-personal-wallet" &&
    !isRecentEmailOtpAuthentication(context.emailOtpAuthenticatedAt)
  ) {
    return Object.freeze({ status: "reauth-required" });
  }
  if (
    !(await verifyPersonalWalletSignature({
      walletAddress,
      message,
      signature: input.signature,
    }))
  ) {
    return Object.freeze({ status: "invalid-proof" });
  }

  try {
    const result = await withAuthorizedSession(
      context.session,
      async (transaction) => {
        try {
          return await completePersonalWalletChallengeRecord(transaction, {
            id: challengeId,
            purpose: input.purpose,
            address: walletAddress,
            messageHashHex: hashHex(message),
            reauthenticatedAt:
              input.purpose === "replace-personal-wallet"
                ? reauthenticatedAtIso(context.emailOtpAuthenticatedAt)
                : null,
          });
        } catch (error) {
          if (error instanceof PersonalWalletChallengeRejectedError) {
            return Object.freeze({ result: "invalid-proof" as const });
          }
          throw error;
        }
      },
    );
    if (result.status !== "authorized") {
      return mutationAccessStatus(result.status);
    }
    if (result.value.result === "invalid-proof") {
      return Object.freeze({ status: "invalid-proof" });
    }
    if (
      result.value.result !== "linked" &&
      result.value.result !== "replaced"
    ) {
      return Object.freeze({ status: "conflict" });
    }
    return mapBinding(result.value.binding);
  } catch (error) {
    return error instanceof PersonalWalletChallengeRejectedError
      ? Object.freeze({ status: "invalid-proof" })
      : Object.freeze({ status: "unavailable" });
  }
}

export async function unlinkPersonalWallet(): Promise<PersonalWalletMutationResult> {
  const initial = initialAccessStatus();
  if (initial) return mutationAccessStatus(initial.status);

  const context = await verifiedAuthContext();
  if (context.session.status !== "signed-in") {
    return mutationAccessStatus(
      context.session.status === "signed-out" ? "signed-out" : "unavailable",
    );
  }
  if (!isRecentEmailOtpAuthentication(context.emailOtpAuthenticatedAt)) {
    return Object.freeze({ status: "reauth-required" });
  }
  const reauthenticatedAt = reauthenticatedAtIso(
    context.emailOtpAuthenticatedAt,
  );
  if (!reauthenticatedAt) {
    return Object.freeze({ status: "reauth-required" });
  }

  try {
    const result = await withAuthorizedSession(context.session, (transaction) =>
      unlinkPersonalWalletRecord(transaction, reauthenticatedAt),
    );
    if (result.status !== "authorized") {
      return mutationAccessStatus(result.status);
    }
    return Object.freeze({
      status: result.value === "unlinked" ? "unlinked" : "conflict",
    });
  } catch {
    return Object.freeze({ status: "unavailable" });
  }
}
