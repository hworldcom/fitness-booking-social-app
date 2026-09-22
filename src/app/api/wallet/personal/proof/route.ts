import { NextResponse } from "next/server";
import { supabasePublicConfig } from "@/auth/config";
import {
  isPersonalWalletPurpose,
  type PersonalWalletMutationResult,
} from "@/solana/personal-wallet";
import { completePersonalWalletProof } from "@/server/wallet/service";

export const dynamic = "force-dynamic";

const responseStatus: Record<PersonalWalletMutationResult["status"], number> = {
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

function response(result: PersonalWalletMutationResult) {
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
    body.length > 4_096 ||
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
      Object.keys(record).length !== 5 ||
      !isPersonalWalletPurpose(record.purpose)
    ) {
      return response({ status: "invalid-request" });
    }
    return response(
      await completePersonalWalletProof({
        challengeId:
          typeof record.challengeId === "string" ? record.challengeId : "",
        purpose: record.purpose,
        walletAddress: record.walletAddress,
        message: record.message,
        signature: record.signature,
      }),
    );
  } catch {
    return response({ status: "invalid-request" });
  }
}
