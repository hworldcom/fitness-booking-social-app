export const EMAIL_REAUTHENTICATION_WINDOW_SECONDS = 10 * 60;
const MAX_FUTURE_CLOCK_SKEW_SECONDS = 30;

export function latestEmailOtpAuthenticationAt(amr: unknown): number | null {
  if (!Array.isArray(amr)) return null;

  let latest: number | null = null;
  for (const entry of amr) {
    if (
      !entry ||
      typeof entry !== "object" ||
      Array.isArray(entry) ||
      !("method" in entry) ||
      !("timestamp" in entry) ||
      entry.method !== "otp" ||
      typeof entry.timestamp !== "number" ||
      !Number.isSafeInteger(entry.timestamp) ||
      entry.timestamp <= 0
    ) {
      continue;
    }
    latest =
      latest === null ? entry.timestamp : Math.max(latest, entry.timestamp);
  }
  return latest;
}

export function isRecentEmailOtpAuthentication(
  authenticatedAt: number | null,
  now = Math.floor(Date.now() / 1000),
) {
  return (
    authenticatedAt !== null &&
    authenticatedAt <= now + MAX_FUTURE_CLOCK_SKEW_SECONDS &&
    authenticatedAt >= now - EMAIL_REAUTHENTICATION_WINDOW_SECONDS
  );
}
