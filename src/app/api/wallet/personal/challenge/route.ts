import { NextResponse } from "next/server";
import { supabasePublicConfig } from "@/auth/config";
import {
  isPersonalWalletPurpose,
  type PersonalWalletChallengeResult,
} from "@/solana/personal-wallet";
import { issuePersonalWalletChallenge } from "@/server/wallet/service";

export const dynamic = "force-dynamic";

const responseStatus: Record<PersonalWalletChallengeResult["status"], number> =
  {
    challenge: 200,
    "invalid-request": 400,
    "reauth-required": 409,
    conflict: 409,
    "signed-out": 401,
    forbidden: 403,
    unavailable: 503,
  };

function response(result: PersonalWalletChallengeResult) {
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
    body.length > 256 ||
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
    if (
      Object.keys(record).length !== 2 ||
      !isPersonalWalletPurpose(record.purpose) ||
      !("walletAddress" in record)
    ) {
      return response({ status: "invalid-request" });
    }
    return response(
      await issuePersonalWalletChallenge({
        purpose: record.purpose,
        walletAddress: record.walletAddress,
        origin: config.siteUrl,
      }),
    );
  } catch {
    return response({ status: "invalid-request" });
  }
}
