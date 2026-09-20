"use client";
import { useSyncExternalStore } from "react";
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

export function dispatch(action: DemoAction) {
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
  const current = useSyncExternalStore(subscribe, getSnapshot, serverSnapshot);
  return { ...current, dispatch };
}
