import type { Metadata } from "next";
import { supabasePublicConfig } from "@/auth/config";
import { safeReturnTo } from "@/auth/return-to";
import { SignInScreen } from "@/features/auth/sign-in";

export const metadata: Metadata = {
  title: "Sign in",
  description:
    "Connect Phantom and approve a message signature to sign in to RepX Club.",
};

export default async function SignInPage({
  searchParams,
}: {
  searchParams: Promise<{
    returnTo?: string | string[];
    reason?: string | string[];
  }>;
}) {
  const params = await searchParams;
  const config = supabasePublicConfig();
  const returnTo =
    config && params.returnTo !== undefined
      ? safeReturnTo(params.returnTo, config.siteUrl)
      : null;
  return (
    <SignInScreen
      returnTo={returnTo}
      accessRequired={params.reason === "forbidden"}
    />
  );
}
