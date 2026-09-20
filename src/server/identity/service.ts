import "server-only";

import type {
  ApplicationIdentitySnapshot,
  EnrolledApplicationIdentity,
} from "@/auth/identity-contracts";
import type { AuthSessionSnapshot } from "@/auth/contracts";
import {
  currentPreparedPersonalIdentity,
  enrollPreparedPersonalIdentity,
  PreparedIdentityConflictError,
  type PreparedIdentityRecord,
} from "@/server/db/identity/repository";
import {
  preparedIdentityForWallet,
  PreparedIdentityConfigurationError,
} from "./config";
import { preparedPersonalIdentities } from "./env";

function enrolledSnapshot(
  identity: PreparedIdentityRecord,
): EnrolledApplicationIdentity {
  return Object.freeze({
    status: "enrolled",
    profile: Object.freeze({
      id: identity.profileId,
      slug: identity.profileSlug,
      displayName: identity.displayName,
    }),
    demoRun: Object.freeze({
      id: identity.runId,
      slug: identity.runSlug,
      name: identity.runName,
    }),
    role: identity.role,
    wallet: Object.freeze({
      bindingId: identity.walletBindingId,
      address: identity.walletAddress,
      cluster: identity.cluster,
    }),
  });
}

function preparedIdentityFromSession(session: AuthSessionSnapshot) {
  if (session.status !== "signed-in") return null;
  const identities = preparedPersonalIdentities();
  return preparedIdentityForWallet(identities, session.walletAddress) ?? null;
}

function failedIdentity(error: unknown): ApplicationIdentitySnapshot {
  if (error instanceof PreparedIdentityConflictError) {
    return Object.freeze({ status: "not-prepared" });
  }
  if (error instanceof PreparedIdentityConfigurationError) {
    return Object.freeze({ status: "unavailable" });
  }
  return Object.freeze({ status: "unavailable" });
}

export async function enrollApplicationIdentity(
  session: AuthSessionSnapshot,
): Promise<ApplicationIdentitySnapshot> {
  if (session.status !== "signed-in") {
    return Object.freeze({
      status: session.status === "signed-out" ? "signed-out" : "unavailable",
    });
  }

  try {
    const prepared = preparedIdentityFromSession(session);
    if (!prepared) return Object.freeze({ status: "not-prepared" });
    const identity = await enrollPreparedPersonalIdentity(
      session.subject,
      prepared,
    );
    return identity
      ? enrolledSnapshot(identity)
      : Object.freeze({ status: "not-prepared" });
  } catch (error) {
    return failedIdentity(error);
  }
}

export async function currentApplicationIdentity(
  session: AuthSessionSnapshot,
): Promise<ApplicationIdentitySnapshot> {
  if (session.status !== "signed-in") {
    return Object.freeze({
      status: session.status === "signed-out" ? "signed-out" : "unavailable",
    });
  }

  try {
    const prepared = preparedIdentityFromSession(session);
    if (!prepared) return Object.freeze({ status: "not-prepared" });
    const identity = await currentPreparedPersonalIdentity(
      session.subject,
      prepared,
    );
    return identity
      ? enrolledSnapshot(identity)
      : Object.freeze({ status: "not-enrolled" });
  } catch (error) {
    return failedIdentity(error);
  }
}
