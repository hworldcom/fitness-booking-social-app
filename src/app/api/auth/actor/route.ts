import { NextResponse } from "next/server";
import type { ActorSnapshot } from "@/auth/actor-contracts";
import { currentActorSnapshot } from "@/server/authorization/service";

export const dynamic = "force-dynamic";

const responseStatus: Record<ActorSnapshot["status"], number> = {
  preview: 200,
  authorized: 200,
  "signed-out": 401,
  forbidden: 403,
  unavailable: 503,
};

export async function GET() {
  const actor = await currentActorSnapshot();
  return NextResponse.json(actor, {
    status: responseStatus[actor.status],
    headers: { "cache-control": "private, no-store" },
  });
}
