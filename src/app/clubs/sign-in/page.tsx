import type { Metadata } from "next";
import { ClubSignInScreen } from "@/features/clubs/club-sign-in";

export const metadata: Metadata = {
  title: "Manage a club",
  description:
    "Sign in with your personal MovX Club account and check prepared club administrator access.",
};

export default function ClubSignInPage() {
  return <ClubSignInScreen />;
}
