"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import type { AuthChangeEvent } from "@supabase/supabase-js";
import {
  isAuthSessionSnapshot,
  UNAVAILABLE_AUTH_SESSION,
  SIGNED_OUT_AUTH_SESSION,
  type AuthSessionSnapshot,
} from "../contracts";
import { browserAuthClient } from "./browser-client";

type AuthSessionContextValue = Readonly<{
  session: AuthSessionSnapshot;
  refreshSession: () => Promise<AuthSessionSnapshot>;
}>;

const AuthSessionContext = createContext<AuthSessionContextValue | null>(null);

export function AuthSessionProvider({
  children,
  initialSession,
}: {
  children: ReactNode;
  initialSession: AuthSessionSnapshot;
}) {
  const [session, setSession] = useState(initialSession);
  const refreshPromise = useRef<Promise<AuthSessionSnapshot> | null>(null);

  const refreshSession = useCallback(() => {
    if (refreshPromise.current) return refreshPromise.current;

    const request = fetch("/api/auth/session", {
      cache: "no-store",
      headers: { accept: "application/json" },
    })
      .then(async (response) => {
        if (!response.ok) return UNAVAILABLE_AUTH_SESSION;
        const value: unknown = await response.json();
        return isAuthSessionSnapshot(value) ? value : UNAVAILABLE_AUTH_SESSION;
      })
      .catch(() => UNAVAILABLE_AUTH_SESSION)
      .then((nextSession) => {
        setSession(nextSession);
        return nextSession;
      })
      .finally(() => {
        refreshPromise.current = null;
      });

    refreshPromise.current = request;
    return request;
  }, []);

  useEffect(() => {
    const client = browserAuthClient();
    if (!client) return;

    const { data } = client.auth.onAuthStateChange((event: AuthChangeEvent) => {
      if (event === "SIGNED_OUT") {
        setSession(SIGNED_OUT_AUTH_SESSION);
        return;
      }
      if (
        event === "SIGNED_IN" ||
        event === "TOKEN_REFRESHED" ||
        event === "USER_UPDATED"
      ) {
        queueMicrotask(() => void refreshSession());
      }
    });

    return () => data.subscription.unsubscribe();
  }, [refreshSession]);

  return (
    <AuthSessionContext.Provider value={{ session, refreshSession }}>
      {children}
    </AuthSessionContext.Provider>
  );
}

export function useAuthSession() {
  const context = useContext(AuthSessionContext);
  if (!context) {
    throw new Error("useAuthSession must be used within AuthSessionProvider.");
  }
  return context;
}
