import { parseSupabasePublicConfig } from "@/auth/config";
import { parseDatabaseUrl } from "@/server/db/config";

export type ApplicationAccessMode = "preview" | "database" | "unavailable";

export type ApplicationAccessEnvironment = Readonly<{
  databaseUrl?: string;
  supabaseUrl?: string;
  supabasePublishableKey?: string;
  siteUrl?: string;
}>;

function present(value: string | undefined) {
  return Boolean(value?.trim());
}

export function parseApplicationAccessMode(
  environment: ApplicationAccessEnvironment,
): ApplicationAccessMode {
  const values = [
    environment.databaseUrl,
    environment.supabaseUrl,
    environment.supabasePublishableKey,
    environment.siteUrl,
  ];
  const presentCount = values.filter(present).length;
  if (presentCount === 0) return "preview";
  if (presentCount !== values.length) return "unavailable";

  try {
    parseDatabaseUrl(environment.databaseUrl);
    if (
      !parseSupabasePublicConfig(
        environment.supabaseUrl,
        environment.supabasePublishableKey,
        environment.siteUrl,
      )
    ) {
      return "unavailable";
    }
    return "database";
  } catch {
    return "unavailable";
  }
}
