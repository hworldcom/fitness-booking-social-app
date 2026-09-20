import "server-only";

import { parsePreparedPersonalIdentities } from "./config";

export function preparedPersonalIdentities() {
  return parsePreparedPersonalIdentities(
    process.env.PREPARED_PERSONAL_IDENTITIES_JSON,
  );
}
