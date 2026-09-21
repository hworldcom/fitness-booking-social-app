import "server-only";

import { parseApplicationAccessMode } from "./config";

export function applicationAccessMode() {
  return parseApplicationAccessMode({
    databaseUrl: process.env.DATABASE_URL,
    preparedPersonalIdentitiesJson:
      process.env.PREPARED_PERSONAL_IDENTITIES_JSON,
    supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
    supabasePublishableKey: process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
    siteUrl: process.env.NEXT_PUBLIC_SITE_URL,
  });
}
