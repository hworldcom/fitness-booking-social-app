import assert from "node:assert/strict";
import test from "node:test";
import {
  isCanonicalSignInLocation,
  parseSupabasePublicConfig,
} from "../src/auth/config";
import { isAuthSessionSnapshot } from "../src/auth/contracts";
import {
  emailOtpErrorMessage,
  normalizeEmail,
  normalizeEmailOtp,
} from "../src/auth/email-otp";

test("public Auth config requires a secure site or literal localhost", () => {
  const local = parseSupabasePublicConfig(
    "http://127.0.0.1:55321/",
    "public-key",
    "http://localhost:3100",
  );
  assert.deepEqual(local, {
    url: "http://127.0.0.1:55321",
    publishableKey: "public-key",
    siteUrl: "http://localhost:3100",
    signInUrl: "http://localhost:3100/sign-in",
  });
  assert.equal(
    parseSupabasePublicConfig(
      "http://127.0.0.1:55321",
      "public-key",
      "http://127.0.0.1:3100",
    ),
    null,
  );
  assert.equal(
    parseSupabasePublicConfig(
      "https://example.supabase.co",
      "public-key",
      "https://club.example/sign-in",
    ),
    null,
  );
  assert.equal(
    parseSupabasePublicConfig(undefined, undefined, undefined),
    null,
  );
});

test("email and one-time-code inputs normalize to bounded values", () => {
  assert.equal(normalizeEmail(" Anna@Example.COM "), "anna@example.com");
  assert.equal(normalizeEmail("not-an-email"), null);
  assert.equal(normalizeEmail(`${"a".repeat(250)}@example.com`), null);
  assert.equal(normalizeEmailOtp(" 123 456 "), "123456");
  assert.equal(normalizeEmailOtp("12345"), null);
  assert.equal(normalizeEmailOtp("12345a"), null);
});

test("verified session responses require a bounded email identity", () => {
  const session = {
    status: "signed-in",
    subject: "93000000-0000-4000-8000-000000000001",
    email: "anna@example.com",
    expiresAt: 1_800_000_000,
  };
  assert.equal(isAuthSessionSnapshot(session), true);
  assert.equal(isAuthSessionSnapshot({ ...session, email: "invalid" }), false);
  assert.equal(
    isAuthSessionSnapshot({
      status: "signed-in",
      subject: session.subject,
      walletAddress: "7YWHMfk9JZe1LM1W7mFDJH8QvJ75zEQY4zBbDx8kPn9M",
      expiresAt: session.expiresAt,
    }),
    false,
  );
});

test("OTP failures use bounded copy without echoing provider details", () => {
  assert.match(
    emailOtpErrorMessage({ status: 429, message: "raw body" }, "request"),
    /too many/i,
  );
  assert.match(
    emailOtpErrorMessage(
      { status: 400, message: "User account does not exist" },
      "request",
    ),
    /couldn’t send/i,
  );
  assert.match(
    emailOtpErrorMessage(
      { status: 403, message: "token for secret@example.com expired" },
      "verify",
    ),
    /invalid or expired/i,
  );
  assert.equal(
    emailOtpErrorMessage(
      { status: 400, message: "User account does not exist" },
      "request",
    ).includes("does not exist"),
    false,
  );
});

test("canonical sign-in checking permits return queries on the exact route", () => {
  const config = parseSupabasePublicConfig(
    "http://127.0.0.1:55321",
    "public-key",
    "http://localhost:3100",
  );
  assert.ok(config);
  assert.equal(
    isCanonicalSignInLocation(config, {
      origin: "http://localhost:3100",
      pathname: "/sign-in",
      search: "?returnTo=/profile",
      hash: "",
    }),
    true,
  );
  assert.equal(
    isCanonicalSignInLocation(config, {
      origin: "https://example.com",
      pathname: "/sign-in",
      search: "?returnTo=/profile",
      hash: "",
    }),
    false,
  );
});
