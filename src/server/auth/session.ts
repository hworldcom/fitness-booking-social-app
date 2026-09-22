import "server-only";

import type { AuthError } from "@supabase/supabase-js";
import {
  DISABLED_AUTH_SESSION,
  SIGNED_OUT_AUTH_SESSION,
  UNAVAILABLE_AUTH_SESSION,
  type AuthSessionSnapshot,
} from "@/auth/contracts";
import { normalizeEmail } from "@/auth/email-otp";
import { latestEmailOtpAuthenticationAt } from "@/auth/reauthentication";
import { serverAuthClient } from "./client";

export type VerifiedAuthContext = Readonly<{
  session: AuthSessionSnapshot;
  emailOtpAuthenticatedAt: number | null;
}>;

function isMissingSession(error: AuthError) {
  return (
    error.name === "AuthSessionMissingError" ||
    error.code === "session_not_found" ||
    error.message.toLowerCase().includes("session missing")
  );
}

export async function verifiedAuthContext(): Promise<VerifiedAuthContext> {
  try {
    const client = await serverAuthClient();
    if (!client) {
      return Object.freeze({
        session: DISABLED_AUTH_SESSION,
        emailOtpAuthenticatedAt: null,
      });
    }

    const claimsResult = await client.auth.getClaims();
    if (claimsResult.error) {
      return Object.freeze({
        session: isMissingSession(claimsResult.error)
          ? SIGNED_OUT_AUTH_SESSION
          : UNAVAILABLE_AUTH_SESSION,
        emailOtpAuthenticatedAt: null,
      });
    }

    const claims = claimsResult.data?.claims;
    const subject = claims?.sub;
    if (typeof subject !== "string" || !subject) {
      return Object.freeze({
        session: SIGNED_OUT_AUTH_SESSION,
        emailOtpAuthenticatedAt: null,
      });
    }

    const userResult = await client.auth.getUser();
    if (userResult.error || !userResult.data.user) {
      return Object.freeze({
        session: UNAVAILABLE_AUTH_SESSION,
        emailOtpAuthenticatedAt: null,
      });
    }
    if (userResult.data.user.id !== subject) {
      return Object.freeze({
        session: UNAVAILABLE_AUTH_SESSION,
        emailOtpAuthenticatedAt: null,
      });
    }

    const user = userResult.data.user;
    const email = normalizeEmail(user.email);
    const hasVerifiedEmailIdentity =
      typeof user.email_confirmed_at === "string" &&
      user.identities?.some((identity) => identity.provider === "email") ===
        true;
    if (!email || !hasVerifiedEmailIdentity) {
      return Object.freeze({
        session: UNAVAILABLE_AUTH_SESSION,
        emailOtpAuthenticatedAt: null,
      });
    }

    const expiry = claims.exp;
    return Object.freeze({
      session: Object.freeze({
        status: "signed-in",
        subject,
        email,
        expiresAt: typeof expiry === "number" ? expiry : null,
      }),
      emailOtpAuthenticatedAt: latestEmailOtpAuthenticationAt(claims.amr),
    });
  } catch {
    return Object.freeze({
      session: UNAVAILABLE_AUTH_SESSION,
      emailOtpAuthenticatedAt: null,
    });
  }
}

export async function verifiedAuthSession(): Promise<AuthSessionSnapshot> {
  return (await verifiedAuthContext()).session;
}
