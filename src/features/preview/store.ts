"use client";
import { useCallback, useSyncExternalStore } from "react";
import { useActor } from "@/auth/client/actor-provider";
import { signInHref } from "@/auth/return-to";
import {
  INITIAL_STATE,
  parseDemo,
  reduceDemo,
  type DemoAction,
  type DemoState,
} from "./state";

const KEY = "repx-club-preview-v1";
type StoreSnapshot = { state: DemoState; storageUnavailable: boolean };
const INITIAL_SNAPSHOT: StoreSnapshot = {
  state: INITIAL_STATE,
  storageUnavailable: false,
};
let snapshot: StoreSnapshot | undefined;
const listeners = new Set<() => void>();

function getSnapshot() {
  if (!snapshot) {
    try {
      snapshot = {
        state: parseDemo(window.localStorage.getItem(KEY)),
        storageUnavailable: false,
      };
    } catch {
      snapshot = { state: INITIAL_STATE, storageUnavailable: true };
    }
  }
  return snapshot;
}

const serverSnapshot = () => INITIAL_SNAPSHOT;

function subscribe(listener: () => void) {
  listeners.add(listener);
  const onStorage = (event: StorageEvent) => {
    if (event.key === KEY || event.key === null) {
      snapshot = undefined;
      listener();
    }
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

function dispatchPreviewAction(action: DemoAction) {
  const state = reduceDemo(getSnapshot().state, action);
  let storageUnavailable = false;
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    storageUnavailable = true;
  }
  snapshot = { state, storageUnavailable };
  listeners.forEach((listener) => listener());
}

export function useDemo() {
  const { actor } = useActor();
  const current = useSyncExternalStore(subscribe, getSnapshot, serverSnapshot);
  const canAccessPrivatePreview =
    actor.status === "preview" || actor.status === "authorized";
  const requestPrivateAccess = useCallback(() => {
    if (canAccessPrivatePreview) return true;
    const returnTo = `${window.location.pathname}${window.location.search}${window.location.hash}`;
    window.location.assign(signInHref(returnTo));
    return false;
  }, [canAccessPrivatePreview]);
  const dispatch = useCallback(
    (action: DemoAction) => {
      if (!requestPrivateAccess()) return;
      dispatchPreviewAction(action);
    },
    [requestPrivateAccess],
  );
  return {
    ...current,
    state: canAccessPrivatePreview ? current.state : INITIAL_STATE,
    dispatch,
    requestPrivateAccess,
  };
}
