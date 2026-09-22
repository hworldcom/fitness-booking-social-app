"use client";

import {
  isPersonalWalletChallengeResult,
  isPersonalWalletMutationResult,
  isPersonalWalletSnapshot,
  type PersonalWalletChallengeResult,
  type PersonalWalletMutationResult,
  type PersonalWalletPurpose,
  type PersonalWalletSnapshot,
} from "../personal-wallet";

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

export async function fetchPersonalWallet(): Promise<PersonalWalletSnapshot> {
  try {
    const value = await jsonRequest("/api/wallet/personal");
    return isPersonalWalletSnapshot(value) ? value : { status: "unavailable" };
  } catch {
    return { status: "unavailable" };
  }
}

export async function requestPersonalWalletChallenge(
  purpose: PersonalWalletPurpose,
  walletAddress: string,
): Promise<PersonalWalletChallengeResult> {
  try {
    const value = await jsonRequest("/api/wallet/personal/challenge", {
      method: "POST",
      body: JSON.stringify({ purpose, walletAddress }),
    });
    return isPersonalWalletChallengeResult(value)
      ? value
      : { status: "unavailable" };
  } catch {
    return { status: "unavailable" };
  }
}

export async function submitPersonalWalletProof(input: {
  challengeId: string;
  purpose: PersonalWalletPurpose;
  walletAddress: string;
  message: string;
  signature: string;
}): Promise<PersonalWalletMutationResult> {
  try {
    const value = await jsonRequest("/api/wallet/personal/proof", {
      method: "POST",
      body: JSON.stringify(input),
    });
    return isPersonalWalletMutationResult(value)
      ? value
      : { status: "unavailable" };
  } catch {
    return { status: "unavailable" };
  }
}

export async function unlinkPersonalWalletBinding(): Promise<PersonalWalletMutationResult> {
  try {
    const value = await jsonRequest("/api/wallet/personal", {
      method: "DELETE",
    });
    return isPersonalWalletMutationResult(value)
      ? value
      : { status: "unavailable" };
  } catch {
    return { status: "unavailable" };
  }
}
