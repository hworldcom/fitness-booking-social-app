import { NextResponse } from "next/server";
import { supabasePublicConfig } from "@/auth/config";
import type { ApplicationIdentitySnapshot } from "@/auth/identity-contracts";
import { verifiedAuthSession } from "@/server/auth/session";
import {
  currentApplicationIdentity,
  enrollApplicationIdentity,
} from "@/server/identity/service";

export const dynamic = "force-dynamic";

const responseStatus: Record<ApplicationIdentitySnapshot["status"], number> = {
  enrolled: 200,
  "not-enrolled": 200,
  "not-prepared": 403,
  "signed-out": 401,
  unavailable: 503,
};

function identityResponse(identity: ApplicationIdentitySnapshot) {
  return NextResponse.json(identity, {
    status: responseStatus[identity.status],
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

  if ((await request.text()).length > 0) {
    return NextResponse.json(
      { status: "unavailable" } satisfies ApplicationIdentitySnapshot,
      {
        status: 400,
        headers: { "cache-control": "private, no-store" },
      },
    );
  }

  return identityResponse(
    await enrollApplicationIdentity(await verifiedAuthSession()),
  );
}
