"use client";

import {
  isApplicationIdentitySnapshot,
  UNAVAILABLE_APPLICATION_IDENTITY,
  type ApplicationIdentitySnapshot,
} from "../identity-contracts";

async function identityRequest(
  method: "GET" | "POST",
): Promise<ApplicationIdentitySnapshot> {
  try {
    const response = await fetch("/api/auth/identity", {
      method,
      cache: "no-store",
      headers: { accept: "application/json" },
    });
    const value: unknown = await response.json();
    return isApplicationIdentitySnapshot(value)
      ? value
      : UNAVAILABLE_APPLICATION_IDENTITY;
  } catch {
    return UNAVAILABLE_APPLICATION_IDENTITY;
  }
}

export function enrollPreparedIdentity() {
  return identityRequest("POST");
}

export function fetchCurrentIdentity() {
  return identityRequest("GET");
}
