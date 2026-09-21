"use client";

import {
  isActorSnapshot,
  UNAVAILABLE_ACTOR,
  type ActorSnapshot,
} from "../actor-contracts";

export async function fetchCurrentActor(): Promise<ActorSnapshot> {
  try {
    const response = await fetch("/api/auth/actor", {
      cache: "no-store",
      headers: { accept: "application/json" },
    });
    const value: unknown = await response.json();
    return isActorSnapshot(value) ? value : UNAVAILABLE_ACTOR;
  } catch {
    return UNAVAILABLE_ACTOR;
  }
}
