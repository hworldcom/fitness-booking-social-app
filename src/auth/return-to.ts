const MAXIMUM_RETURN_TO_LENGTH = 2_048;

export function safeReturnTo(
  value: string | string[] | null | undefined,
  siteOrigin: string,
) {
  if (typeof value !== "string" || value.length > MAXIMUM_RETURN_TO_LENGTH) {
    return "/";
  }
  if (
    !value.startsWith("/") ||
    value.startsWith("//") ||
    value.includes("\\") ||
    /[\u0000-\u001f\u007f]/.test(value)
  ) {
    return "/";
  }

  try {
    const decoded = decodeURIComponent(value);
    if (
      decoded.startsWith("//") ||
      decoded.includes("\\") ||
      /[\u0000-\u001f\u007f]/.test(decoded)
    ) {
      return "/";
    }
    const site = new URL(siteOrigin);
    const target = new URL(value, `${site.origin}/`);
    if (
      target.origin !== site.origin ||
      target.username ||
      target.password ||
      target.pathname === "/sign-in" ||
      target.pathname.startsWith("/sign-in/") ||
      target.pathname === "/api" ||
      target.pathname.startsWith("/api/") ||
      target.pathname === "/_next" ||
      target.pathname.startsWith("/_next/")
    ) {
      return "/";
    }
    return `${target.pathname}${target.search}${target.hash}`;
  } catch {
    return "/";
  }
}

export function signInHref(returnTo: string) {
  return `/sign-in?returnTo=${encodeURIComponent(returnTo)}`;
}
