import type { ActorSnapshot } from "@/auth/actor-contracts";
import { signInHref } from "@/auth/return-to";
import type { ClubWalletSnapshot } from "@/solana/club-wallet";

export const CLUB_SIGN_IN_PATH = "/clubs/sign-in";
export const CLUB_EMAIL_SIGN_IN_HREF = signInHref(CLUB_SIGN_IN_PATH);

export type ClubEntryState =
  ClubWalletSnapshot | Readonly<{ status: "loading" }>;

export function visibleClubEntryState(
  actor: ActorSnapshot,
  clubSnapshot: ClubWalletSnapshot | null,
): ClubEntryState {
  if (actor.status !== "authorized") {
    return Object.freeze({ status: actor.status });
  }
  return clubSnapshot ?? Object.freeze({ status: "loading" });
}
