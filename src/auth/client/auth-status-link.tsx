"use client";

import Link from "next/link";
import { LogIn, UserCheck } from "lucide-react";
import { shortenWalletAddress } from "@/solana/client/wallet-presentation";
import { useAuthSession } from "./session-provider";

export function AuthStatusLink() {
  const { session } = useAuthSession();
  const signedIn = session.status === "signed-in";
  const label = signedIn
    ? `Signed in ${shortenWalletAddress(session.walletAddress)}`
    : session.status === "unavailable"
      ? "Check sign-in"
      : "Sign in";
  const Icon = signedIn ? UserCheck : LogIn;

  return (
    <Link
      href="/sign-in"
      className={`auth-status-link ${signedIn ? "signed-in" : ""}`}
      aria-label={
        signedIn
          ? `RepX Club signed in with wallet ${session.walletAddress}`
          : label
      }
    >
      <Icon size={16} aria-hidden="true" />
      <span>{label}</span>
    </Link>
  );
}
