"use client";

import {
  isApplicationIdentitySnapshot,
  UNAVAILABLE_APPLICATION_IDENTITY,
  type ApplicationIdentitySnapshot,
} from "../identity-contracts";

async function identityRequest(
  method: "GET" | "POST",
  displayName?: string,
): Promise<ApplicationIdentitySnapshot> {
  try {
    const response = await fetch("/api/auth/identity", {
      method,
      cache: "no-store",
      headers: {
        accept: "application/json",
        ...(method === "POST" ? { "content-type": "application/json" } : {}),
      },
      body: method === "POST" ? JSON.stringify({ displayName }) : undefined,
    });
    const value: unknown = await response.json();
    return isApplicationIdentitySnapshot(value)
      ? value
      : UNAVAILABLE_APPLICATION_IDENTITY;
  } catch {
    return UNAVAILABLE_APPLICATION_IDENTITY;
  }
}

export function completeApplicationProfile(displayName: string) {
  return identityRequest("POST", displayName);
}

export function fetchCurrentIdentity() {
  return identityRequest("GET");
}
