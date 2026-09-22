import { NextResponse } from "next/server";
import { supabasePublicConfig } from "@/auth/config";
import type {
  PersonalWalletMutationResult,
  PersonalWalletSnapshot,
} from "@/solana/personal-wallet";
import {
  personalWalletSnapshot,
  unlinkPersonalWallet,
} from "@/server/wallet/service";

export const dynamic = "force-dynamic";

const snapshotStatus: Record<PersonalWalletSnapshot["status"], number> = {
  preview: 200,
  unlinked: 200,
  linked: 200,
  "signed-out": 401,
  forbidden: 403,
  unavailable: 503,
};

const mutationStatus: Record<PersonalWalletMutationResult["status"], number> = {
  unlinked: 200,
  linked: 200,
  "invalid-request": 400,
  "invalid-proof": 400,
  "reauth-required": 409,
  conflict: 409,
  "signed-out": 401,
  forbidden: 403,
  unavailable: 503,
};

function response<T>(value: T, status: number) {
  return NextResponse.json(value, {
    status,
    headers: { "cache-control": "private, no-store" },
  });
}

function hasCanonicalOrigin(request: Request) {
  const config = supabasePublicConfig();
  return config !== null && request.headers.get("origin") === config.siteUrl;
}

export async function GET() {
  const snapshot = await personalWalletSnapshot();
  return response(snapshot, snapshotStatus[snapshot.status]);
}

export async function DELETE(request: Request) {
  if (!hasCanonicalOrigin(request)) {
    return response({ status: "forbidden" } as const, 403);
  }
  const result = await unlinkPersonalWallet();
  return response(result, mutationStatus[result.status]);
}
