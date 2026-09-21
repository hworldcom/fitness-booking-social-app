import "server-only";

import type { AuthError } from "@supabase/supabase-js";
import {
  DISABLED_AUTH_SESSION,
  SIGNED_OUT_AUTH_SESSION,
  UNAVAILABLE_AUTH_SESSION,
  type AuthSessionSnapshot,
} from "@/auth/contracts";
import { normalizeEmail } from "@/auth/email-otp";
import { serverAuthClient } from "./client";

function isMissingSession(error: AuthError) {
  return (
    error.name === "AuthSessionMissingError" ||
    error.code === "session_not_found" ||
    error.message.toLowerCase().includes("session missing")
  );
}

export async function verifiedAuthSession(): Promise<AuthSessionSnapshot> {
  try {
    const client = await serverAuthClient();
    if (!client) return DISABLED_AUTH_SESSION;

    const claimsResult = await client.auth.getClaims();
    if (claimsResult.error) {
      return isMissingSession(claimsResult.error)
        ? SIGNED_OUT_AUTH_SESSION
        : UNAVAILABLE_AUTH_SESSION;
    }

    const claims = claimsResult.data?.claims;
    const subject = claims?.sub;
    if (typeof subject !== "string" || !subject) {
      return SIGNED_OUT_AUTH_SESSION;
    }

    const userResult = await client.auth.getUser();
    if (userResult.error || !userResult.data.user) {
      return UNAVAILABLE_AUTH_SESSION;
    }
    if (userResult.data.user.id !== subject) {
      return UNAVAILABLE_AUTH_SESSION;
    }

    const user = userResult.data.user;
    const email = normalizeEmail(user.email);
    const hasVerifiedEmailIdentity =
      typeof user.email_confirmed_at === "string" &&
      user.identities?.some((identity) => identity.provider === "email") ===
        true;
    if (!email || !hasVerifiedEmailIdentity) return UNAVAILABLE_AUTH_SESSION;

    const expiry = claims.exp;
    return Object.freeze({
      status: "signed-in",
      subject,
      email,
      expiresAt: typeof expiry === "number" ? expiry : null,
    });
  } catch {
    return UNAVAILABLE_AUTH_SESSION;
  }
}
