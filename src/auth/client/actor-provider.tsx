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
import {
  SIGNED_OUT_ACTOR,
  UNAVAILABLE_ACTOR,
  type ActorSnapshot,
} from "../actor-contracts";
import {
  actorSessionKey,
  visibleActorForSession,
  type ActorState,
} from "../actor-state";
import { fetchCurrentActor } from "./actor-client";
import { useAuthSession } from "./session-provider";

type ActorContextValue = Readonly<{
  actor: ActorSnapshot;
  refreshActor: () => Promise<ActorSnapshot>;
}>;

type ActorRefresh = Readonly<{
  sessionKey: string;
  promise: Promise<ActorSnapshot>;
}>;

const ActorContext = createContext<ActorContextValue | null>(null);

export function ActorProvider({
  children,
  initialActor,
}: {
  children: ReactNode;
  initialActor: ActorSnapshot;
}) {
  const { session } = useAuthSession();
  const sessionKey = actorSessionKey(session);
  const [actorState, setActorState] = useState<ActorState>({
    sessionKey,
    actor: initialActor,
  });
  const refresh = useRef<ActorRefresh | null>(null);

  const refreshActor = useCallback(() => {
    if (session.status !== "signed-in") {
      if (session.status === "signed-out") {
        return Promise.resolve(SIGNED_OUT_ACTOR);
      }
      if (session.status === "disabled" && initialActor.status === "preview") {
        return Promise.resolve(initialActor);
      }
      return Promise.resolve(UNAVAILABLE_ACTOR);
    }
    if (refresh.current?.sessionKey === sessionKey) {
      return refresh.current.promise;
    }

    const request = fetchCurrentActor()
      .then((nextActor) => {
        if (refresh.current?.promise === request) {
          setActorState({ sessionKey, actor: nextActor });
        }
        return nextActor;
      })
      .finally(() => {
        if (refresh.current?.promise === request) refresh.current = null;
      });
    refresh.current = { sessionKey, promise: request };
    return request;
  }, [initialActor, session.status, sessionKey]);

  useEffect(() => {
    if (session.status === "signed-in") void refreshActor();
  }, [refreshActor, session]);

  const currentActor = visibleActorForSession(session, actorState);

  return (
    <ActorContext.Provider value={{ actor: currentActor, refreshActor }}>
      {children}
    </ActorContext.Provider>
  );
}

export function useActor() {
  const context = useContext(ActorContext);
  if (!context) throw new Error("useActor must be used within ActorProvider.");
  return context;
}
