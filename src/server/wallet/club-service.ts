import "server-only";

import { createHash, randomBytes } from "node:crypto";
import { verifiedAuthContext } from "@/server/auth/session";
import { applicationAccessMode } from "@/server/authorization/env";
import { withAuthorizedSession } from "@/server/authorization/service";
import {
  ClubWalletNoAccessError,
  ClubWalletStateConflictError,
  clubWalletChallengeClock,
  completeClubWalletChallengeRecord,
  currentClubWalletContextRecord,
  issueClubWalletChallengeRecord,
  revokeClubWalletAuthorityRecord,
  setClubWalletAuthSession,
  type ClubWalletContextRecord,
} from "@/server/db/wallet/club-repository";
import {
  CLUB_WALLET_CHALLENGE_LIFETIME_SECONDS,
  CLUB_WALLET_PURPOSE,
  buildClubWalletMessage,
  type ClubWalletChallengeResult,
  type ClubWalletMutationResult,
  type ClubWalletSnapshot,
} from "@/solana/club-wallet";
import {
  normalizePersonalWalletAddress,
  normalizePersonalWalletChallengeId,
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

function hashHex(value: Uint8Array | string) {
  return createHash("sha256").update(value).digest("hex");
}

function initialAccessStatus() {
  const mode = applicationAccessMode();
  return mode === "preview"
    ? accessStatus("preview")
    : mode === "unavailable"
      ? accessStatus("unavailable")
      : null;
}

function mapContext(
  context: Pick<
    ClubWalletContextRecord,
    "slug" | "name" | "address" | "cluster" | "verifiedAt" | "authority"
  >,
): Extract<ClubWalletSnapshot, { status: "eligible" | "authorized" }> {
  const club = Object.freeze({
    slug: context.slug,
    name: context.name,
    wallet: Object.freeze({
      address: context.address,
      cluster: context.cluster,
      verifiedAt: context.verifiedAt,
    }),
  });
  return context.authority
    ? Object.freeze({
        status: "authorized" as const,
        club,
        authority: Object.freeze({
          grantedAt: context.authority.grantedAt,
          expiresAt: context.authority.expiresAt,
        }),
      })
    : Object.freeze({ status: "eligible" as const, club });
}

export async function clubWalletSnapshot(): Promise<ClubWalletSnapshot> {
  const initial = initialAccessStatus();
  if (initial) return initial;

  const context = await verifiedAuthContext();
  const authSessionId = context.authSessionId;
  if (!authSessionId) return accessStatus("unavailable");
  const result = await withAuthorizedSession(
    context.session,
    async (transaction) => {
      await setClubWalletAuthSession(transaction, authSessionId);
      return currentClubWalletContextRecord(transaction);
    },
  );
  if (result.status !== "authorized") return accessStatus(result.status);
  return result.value
    ? mapContext(result.value)
    : Object.freeze({ status: "no-club-access" });
}

export async function issueClubWalletChallenge(input: {
  walletAddress: unknown;
  origin: string;
}): Promise<ClubWalletChallengeResult> {
  const initial = initialAccessStatus();
  if (initial) return mutationAccessStatus(initial.status);
  const walletAddress = normalizePersonalWalletAddress(input.walletAddress);
  if (!walletAddress) return Object.freeze({ status: "invalid-request" });

  const context = await verifiedAuthContext();
  if (context.session.status !== "signed-in") {
    return mutationAccessStatus(
      context.session.status === "signed-out" ? "signed-out" : "unavailable",
    );
  }
  const session = context.session;
  const authSessionId = context.authSessionId;
  if (!authSessionId) return Object.freeze({ status: "unavailable" });

  try {
    const result = await withAuthorizedSession(session, async (transaction) => {
      await setClubWalletAuthSession(transaction, authSessionId);
      const club = await currentClubWalletContextRecord(transaction);
      if (!club) return Object.freeze({ status: "no-club-access" as const });
      if (club.address !== walletAddress) {
        return Object.freeze({ status: "conflict" as const });
      }

      const clock = await clubWalletChallengeClock(transaction);
      const issuedAt = new Date(clock.issuedAt);
      const expiresAt = new Date(
        issuedAt.getTime() + CLUB_WALLET_CHALLENGE_LIFETIME_SECONDS * 1_000,
      ).toISOString();
      const nonceBytes = randomBytes(32);
      const message = buildClubWalletMessage({
        email: session.email,
        origin: input.origin,
        organizationId: club.organizationId,
        clubSlug: club.slug,
        clubName: club.name,
        address: walletAddress,
        challengeId: clock.id,
        nonce: nonceBytes.toString("base64url"),
        issuedAt: issuedAt.toISOString(),
        expiresAt,
      });
      await issueClubWalletChallengeRecord(transaction, {
        id: clock.id,
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
          purpose: CLUB_WALLET_PURPOSE,
          address: walletAddress,
          message,
          expiresAt,
        }),
      });
    });
    if (result.status !== "authorized") {
      return mutationAccessStatus(result.status);
    }
    return result.value;
  } catch (error) {
    if (error instanceof ClubWalletNoAccessError) {
      return Object.freeze({ status: "no-club-access" });
    }
    return error instanceof ClubWalletStateConflictError
      ? Object.freeze({ status: "conflict" })
      : Object.freeze({ status: "unavailable" });
  }
}

export async function completeClubWalletProof(input: {
  challengeId: string;
  walletAddress: unknown;
  message: unknown;
  signature: unknown;
}): Promise<ClubWalletMutationResult> {
  const initial = initialAccessStatus();
  if (initial) return mutationAccessStatus(initial.status);
  const walletAddress = normalizePersonalWalletAddress(input.walletAddress);
  const challengeId = normalizePersonalWalletChallengeId(input.challengeId);
  if (
    !walletAddress ||
    !challengeId ||
    typeof input.message !== "string" ||
    input.message.length === 0 ||
    input.message.length > 2_048
  ) {
    return Object.freeze({ status: "invalid-request" });
  }
  const message = input.message;

  const context = await verifiedAuthContext();
  if (context.session.status !== "signed-in") {
    return mutationAccessStatus(
      context.session.status === "signed-out" ? "signed-out" : "unavailable",
    );
  }
  const authSessionId = context.authSessionId;
  if (!authSessionId) return Object.freeze({ status: "unavailable" });
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
        await setClubWalletAuthSession(transaction, authSessionId);
        return completeClubWalletChallengeRecord(transaction, {
          id: challengeId,
          address: walletAddress,
          messageHashHex: hashHex(message),
        });
      },
    );
    if (result.status !== "authorized") {
      return mutationAccessStatus(result.status);
    }
    if (result.value.result === "invalid-proof") {
      return Object.freeze({ status: "invalid-proof" });
    }
    if (result.value.result !== "authorized") {
      return Object.freeze({ status: "conflict" });
    }
    return mapContext(result.value.context);
  } catch (error) {
    return error instanceof ClubWalletStateConflictError
      ? Object.freeze({ status: "conflict" })
      : Object.freeze({ status: "unavailable" });
  }
}

export async function revokeClubWalletAuthority(): Promise<ClubWalletMutationResult> {
  const initial = initialAccessStatus();
  if (initial) return mutationAccessStatus(initial.status);

  const context = await verifiedAuthContext();
  const authSessionId = context.authSessionId;
  if (!authSessionId) return mutationAccessStatus("unavailable");
  const result = await withAuthorizedSession(
    context.session,
    async (transaction) => {
      await setClubWalletAuthSession(transaction, authSessionId);
      return revokeClubWalletAuthorityRecord(transaction);
    },
  );
  if (result.status !== "authorized") {
    return mutationAccessStatus(result.status);
  }
  return Object.freeze({ status: result.value });
}
