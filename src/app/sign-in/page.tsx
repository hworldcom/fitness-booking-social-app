import type { Metadata } from "next";
import { SignInScreen } from "@/features/auth/sign-in";

export const metadata: Metadata = {
  title: "Sign in",
  description:
    "Connect Phantom and approve a message signature to sign in to RepX Club.",
};

export default function SignInPage() {
  return <SignInScreen />;
}
