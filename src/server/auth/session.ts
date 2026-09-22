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
  authSessionId: string | null;
  emailOtpAuthenticatedAt: number | null;
}>;

function normalizedAuthSessionId(value: unknown) {
  if (typeof value !== "string") return null;
  const normalized = value.toLowerCase();
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/.test(
    normalized,
  )
    ? normalized
    : null;
}

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
        authSessionId: null,
        emailOtpAuthenticatedAt: null,
      });
    }

    const claimsResult = await client.auth.getClaims();
    if (claimsResult.error) {
      return Object.freeze({
        session: isMissingSession(claimsResult.error)
          ? SIGNED_OUT_AUTH_SESSION
          : UNAVAILABLE_AUTH_SESSION,
        authSessionId: null,
        emailOtpAuthenticatedAt: null,
      });
    }

    const claims = claimsResult.data?.claims;
    const subject = claims?.sub;
    if (typeof subject !== "string" || !subject) {
      return Object.freeze({
        session: SIGNED_OUT_AUTH_SESSION,
        authSessionId: null,
        emailOtpAuthenticatedAt: null,
      });
    }

    const userResult = await client.auth.getUser();
    if (userResult.error || !userResult.data.user) {
      return Object.freeze({
        session: UNAVAILABLE_AUTH_SESSION,
        authSessionId: null,
        emailOtpAuthenticatedAt: null,
      });
    }
    if (userResult.data.user.id !== subject) {
      return Object.freeze({
        session: UNAVAILABLE_AUTH_SESSION,
        authSessionId: null,
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
        authSessionId: null,
        emailOtpAuthenticatedAt: null,
      });
    }

    const authSessionId = normalizedAuthSessionId(claims.session_id);
    if (!authSessionId) {
      return Object.freeze({
        session: UNAVAILABLE_AUTH_SESSION,
        authSessionId: null,
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
      authSessionId,
      emailOtpAuthenticatedAt: latestEmailOtpAuthenticationAt(claims.amr),
    });
  } catch {
    return Object.freeze({
      session: UNAVAILABLE_AUTH_SESSION,
      authSessionId: null,
      emailOtpAuthenticatedAt: null,
    });
  }
}

export async function verifiedAuthSession(): Promise<AuthSessionSnapshot> {
  return (await verifiedAuthContext()).session;
}
