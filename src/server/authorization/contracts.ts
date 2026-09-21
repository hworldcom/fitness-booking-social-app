import "server-only";

import type { ActorRole } from "@/auth/actor-contracts";

export type AuthorizedActor = Readonly<{
  authUserId: string;
  profileId: string;
  runId: string;
  runRole: ActorRole;
}>;
