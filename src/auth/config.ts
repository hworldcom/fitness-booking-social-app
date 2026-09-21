export const SIGN_IN_PATH = "/sign-in";

export const WEB3_SIGN_IN_STATEMENT =
  "Sign in to RepX Club. This proves control of your wallet and does not authorize a transaction.";

export type SupabasePublicConfig = Readonly<{
  url: string;
  publishableKey: string;
  siteUrl: string;
  signInUrl: string;
}>;

function normalizedUrl(value: string | undefined): URL | null {
  if (!value?.trim()) return null;

  try {
    const url = new URL(value);
    if (!url.hostname || url.username || url.password) return null;
    if (url.protocol !== "https:" && url.protocol !== "http:") return null;
    return url;
  } catch {
    return null;
  }
}

export function parseSupabasePublicConfig(
  urlValue: string | undefined,
  publishableKeyValue: string | undefined,
  siteUrlValue: string | undefined,
): SupabasePublicConfig | null {
  const url = normalizedUrl(urlValue);
  const siteUrl = normalizedUrl(siteUrlValue);
  const publishableKey = publishableKeyValue?.trim();

  if (!url || !siteUrl || !publishableKey) return null;
  if (siteUrl.search || siteUrl.hash || siteUrl.pathname !== "/") return null;
  if (siteUrl.protocol === "http:" && siteUrl.hostname !== "localhost") {
    return null;
  }

  const normalizedSiteUrl = siteUrl.origin;

  return Object.freeze({
    url: url.toString().replace(/\/$/, ""),
    publishableKey,
    siteUrl: normalizedSiteUrl,
    signInUrl: new URL(SIGN_IN_PATH, `${normalizedSiteUrl}/`).toString(),
  });
}

export function supabasePublicConfig(): SupabasePublicConfig | null {
  return parseSupabasePublicConfig(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
    process.env.NEXT_PUBLIC_SITE_URL,
  );
}

export function isCanonicalSignInLocation(
  config: SupabasePublicConfig,
  location: Pick<Location, "origin" | "pathname" | "search" | "hash">,
) {
  const currentUrl = `${location.origin}${location.pathname}`;
  return currentUrl === config.signInUrl && !location.hash;
}
