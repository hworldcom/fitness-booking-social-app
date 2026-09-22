"use client";

import {
  isClubWalletChallengeResult,
  isClubWalletMutationResult,
  isClubWalletSnapshot,
  type ClubWalletChallengeResult,
  type ClubWalletMutationResult,
  type ClubWalletSnapshot,
} from "../club-wallet";

async function jsonRequest(path: string, init?: RequestInit): Promise<unknown> {
  const response = await fetch(path, {
    cache: "no-store",
    credentials: "same-origin",
    headers: {
      accept: "application/json",
      ...(init?.body ? { "content-type": "application/json" } : {}),
    },
    ...init,
  });
  return response.json();
}

export async function fetchClubWallet(): Promise<ClubWalletSnapshot> {
  try {
    const value = await jsonRequest("/api/wallet/club");
    return isClubWalletSnapshot(value) ? value : { status: "unavailable" };
  } catch {
    return { status: "unavailable" };
  }
}

export async function requestClubWalletChallenge(
  walletAddress: string,
): Promise<ClubWalletChallengeResult> {
  try {
    const value = await jsonRequest("/api/wallet/club/challenge", {
      method: "POST",
      body: JSON.stringify({ walletAddress }),
    });
    return isClubWalletChallengeResult(value)
      ? value
      : { status: "unavailable" };
  } catch {
    return { status: "unavailable" };
  }
}

export async function submitClubWalletProof(input: {
  challengeId: string;
  walletAddress: string;
  message: string;
  signature: string;
}): Promise<ClubWalletMutationResult> {
  try {
    const value = await jsonRequest("/api/wallet/club/proof", {
      method: "POST",
      body: JSON.stringify(input),
    });
    return isClubWalletMutationResult(value)
      ? value
      : { status: "unavailable" };
  } catch {
    return { status: "unavailable" };
  }
}

export async function revokeClubWallet(): Promise<ClubWalletMutationResult> {
  try {
    const value = await jsonRequest("/api/wallet/club", {
      method: "DELETE",
    });
    return isClubWalletMutationResult(value)
      ? value
      : { status: "unavailable" };
  } catch {
    return { status: "unavailable" };
  }
}
