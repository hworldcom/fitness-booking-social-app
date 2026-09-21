export type ActorRole = "member" | "operator";

export type ActorSnapshot =
  | Readonly<{ status: "preview" }>
  | Readonly<{
      status: "authorized";
      profile: Readonly<{ slug: string; displayName: string }>;
      demoRun: Readonly<{ slug: string; name: string }>;
      role: ActorRole;
    }>
  | Readonly<{ status: "signed-out" | "forbidden" | "unavailable" }>;

export const PREVIEW_ACTOR = Object.freeze({
  status: "preview",
} as const) satisfies ActorSnapshot;

export const SIGNED_OUT_ACTOR = Object.freeze({
  status: "signed-out",
} as const) satisfies ActorSnapshot;

export const FORBIDDEN_ACTOR = Object.freeze({
  status: "forbidden",
} as const) satisfies ActorSnapshot;

export const UNAVAILABLE_ACTOR = Object.freeze({
  status: "unavailable",
} as const) satisfies ActorSnapshot;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function hasExactKeys(value: Record<string, unknown>, keys: string[]) {
  const actual = Object.keys(value);
  return actual.length === keys.length && keys.every((key) => key in value);
}

function isSlug(value: unknown): value is string {
  return (
    typeof value === "string" &&
    value.length <= 80 &&
    /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value)
  );
}

function isName(value: unknown): value is string {
  return typeof value === "string" && value.length > 0 && value.length <= 120;
}

export function isActorRole(value: unknown): value is ActorRole {
  return value === "member" || value === "operator";
}

export function isActorSnapshot(value: unknown): value is ActorSnapshot {
  if (!isRecord(value) || typeof value.status !== "string") return false;
  if (
    value.status === "preview" ||
    value.status === "signed-out" ||
    value.status === "forbidden" ||
    value.status === "unavailable"
  ) {
    return hasExactKeys(value, ["status"]);
  }
  if (value.status !== "authorized") return false;
  if (!hasExactKeys(value, ["status", "profile", "demoRun", "role"])) {
    return false;
  }
  return (
    isRecord(value.profile) &&
    hasExactKeys(value.profile, ["slug", "displayName"]) &&
    isSlug(value.profile.slug) &&
    isName(value.profile.displayName) &&
    isRecord(value.demoRun) &&
    hasExactKeys(value.demoRun, ["slug", "name"]) &&
    isSlug(value.demoRun.slug) &&
    isName(value.demoRun.name) &&
    isActorRole(value.role)
  );
}
