import { NextResponse } from "next/server";
import { supabasePublicConfig } from "@/auth/config";
import type { ClubWalletChallengeResult } from "@/solana/club-wallet";
import { issueClubWalletChallenge } from "@/server/wallet/club-service";

export const dynamic = "force-dynamic";

const responseStatus: Record<ClubWalletChallengeResult["status"], number> = {
  challenge: 200,
  "invalid-request": 400,
  "no-club-access": 403,
  conflict: 409,
  "signed-out": 401,
  forbidden: 403,
  unavailable: 503,
};

function response(result: ClubWalletChallengeResult) {
  return NextResponse.json(result, {
    status: responseStatus[result.status],
    headers: { "cache-control": "private, no-store" },
  });
}

export async function POST(request: Request) {
  const config = supabasePublicConfig();
  if (!config || request.headers.get("origin") !== config.siteUrl) {
    return response({ status: "forbidden" });
  }
  const body = await request.text();
  if (
    body.length === 0 ||
    body.length > 128 ||
    !request.headers.get("content-type")?.startsWith("application/json")
  ) {
    return response({ status: "invalid-request" });
  }

  try {
    const value: unknown = JSON.parse(body);
    if (!value || typeof value !== "object" || Array.isArray(value)) {
      return response({ status: "invalid-request" });
    }
    const record = value as Record<string, unknown>;
    if (Object.keys(record).length !== 1 || !("walletAddress" in record)) {
      return response({ status: "invalid-request" });
    }
    return response(
      await issueClubWalletChallenge({
        walletAddress: record.walletAddress,
        origin: config.siteUrl,
      }),
    );
  } catch {
    return response({ status: "invalid-request" });
  }
}
