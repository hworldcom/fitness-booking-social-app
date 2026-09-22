import { NextResponse } from "next/server";
import { supabasePublicConfig } from "@/auth/config";
import type {
  ClubWalletMutationResult,
  ClubWalletSnapshot,
} from "@/solana/club-wallet";
import {
  clubWalletSnapshot,
  revokeClubWalletAuthority,
} from "@/server/wallet/club-service";

export const dynamic = "force-dynamic";

const snapshotStatus: Record<ClubWalletSnapshot["status"], number> = {
  preview: 200,
  eligible: 200,
  authorized: 200,
  "no-club-access": 200,
  "signed-out": 401,
  forbidden: 403,
  unavailable: 503,
};

const mutationStatus: Record<ClubWalletMutationResult["status"], number> = {
  eligible: 200,
  authorized: 200,
  revoked: 200,
  "no-authority": 200,
  "invalid-request": 400,
  "invalid-proof": 400,
  "no-club-access": 403,
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

export async function GET() {
  const snapshot = await clubWalletSnapshot();
  return response(snapshot, snapshotStatus[snapshot.status]);
}

export async function DELETE(request: Request) {
  const config = supabasePublicConfig();
  if (!config || request.headers.get("origin") !== config.siteUrl) {
    return response({ status: "forbidden" } as const, 403);
  }
  const result = await revokeClubWalletAuthority();
  return response(result, mutationStatus[result.status]);
}
