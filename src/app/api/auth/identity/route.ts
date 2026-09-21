import { NextResponse } from "next/server";
import { supabasePublicConfig } from "@/auth/config";
import { normalizeDisplayName } from "@/auth/identity-contracts";
import type { ApplicationIdentitySnapshot } from "@/auth/identity-contracts";
import { verifiedAuthSession } from "@/server/auth/session";
import {
  currentApplicationIdentity,
  enrollApplicationIdentity,
} from "@/server/identity/service";

export const dynamic = "force-dynamic";

const responseStatus: Record<ApplicationIdentitySnapshot["status"], number> = {
  enrolled: 200,
  "profile-required": 200,
  "signed-out": 401,
  unavailable: 503,
};

function identityResponse(
  identity: ApplicationIdentitySnapshot,
  status = responseStatus[identity.status],
) {
  return NextResponse.json(identity, {
    status,
    headers: { "cache-control": "private, no-store" },
  });
}

export async function GET() {
  return identityResponse(
    await currentApplicationIdentity(await verifiedAuthSession()),
  );
}

export async function POST(request: Request) {
  const config = supabasePublicConfig();
  if (!config || request.headers.get("origin") !== config.siteUrl) {
    return identityResponse({ status: "unavailable" });
  }

  const body = await request.text();
  if (
    body.length === 0 ||
    body.length > 512 ||
    !request.headers.get("content-type")?.startsWith("application/json")
  ) {
    return identityResponse({ status: "profile-required" }, 400);
  }

  let displayName: string | null = null;
  try {
    const value: unknown = JSON.parse(body);
    if (
      value &&
      typeof value === "object" &&
      !Array.isArray(value) &&
      Object.keys(value).length === 1 &&
      "displayName" in value
    ) {
      displayName = normalizeDisplayName(
        (value as Record<string, unknown>).displayName,
      );
    }
  } catch {
    // Invalid JSON receives the same bounded profile-required response.
  }
  if (!displayName) {
    return identityResponse({ status: "profile-required" }, 400);
  }

  return identityResponse(
    await enrollApplicationIdentity(await verifiedAuthSession(), displayName),
  );
}
