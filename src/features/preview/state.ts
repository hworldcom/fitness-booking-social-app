import { isEventDraft, type EventDraft } from "@/domain/events";

export type DemoState = {
  version: 2;
  following: string[];
  eventDrafts: EventDraft[];
};

export const INITIAL_STATE: DemoState = {
  version: 2,
  following: ["daniel"],
  eventDrafts: [],
};

export type DemoAction =
  | { type: "follow"; id: string }
  | { type: "event-draft"; draft: EventDraft }
  | { type: "delete-event-draft"; id: string }
  | { type: "reset" };

const toggle = (values: string[], id: string) =>
  values.includes(id) ? values.filter((x) => x !== id) : [...values, id];

export function reduceDemo(state: DemoState, action: DemoAction): DemoState {
  switch (action.type) {
    case "event-draft":
      return isEventDraft(action.draft)
        ? {
            ...state,
            eventDrafts: [
              action.draft,
              ...state.eventDrafts.filter((d) => d.id !== action.draft.id),
            ],
          }
        : state;
    case "delete-event-draft":
      return {
        ...state,
        eventDrafts: state.eventDrafts.filter((d) => d.id !== action.id),
      };
    case "follow":
      return { ...state, following: toggle(state.following, action.id) };
    case "reset":
      return {
        version: 2,
        following: ["daniel"],
        eventDrafts: [],
      };
  }
}

export function parseDemo(raw: string | null): DemoState {
  if (!raw) return INITIAL_STATE;
  try {
    const s = JSON.parse(raw);
    if ((s?.version !== 1 && s?.version !== 2) || !Array.isArray(s.following))
      return INITIAL_STATE;
    if (!s.following.every((x: unknown) => typeof x === "string"))
      return INITIAL_STATE;
    // Version 1 also contained product-challenge saves and drafts. They are
    // deliberately ignored while supported follows and event drafts survive.
    const eventDrafts = s.eventDrafts === undefined ? [] : s.eventDrafts;
    if (
      !Array.isArray(eventDrafts) ||
      !eventDrafts.every(isEventDraft) ||
      new Set(eventDrafts.map((d: EventDraft) => d.id)).size !==
        eventDrafts.length
    )
      return {
        version: 2,
        following: s.following,
        eventDrafts: [],
      };
    return {
      version: 2,
      following: s.following,
      eventDrafts,
    };
  } catch {
    return INITIAL_STATE;
  }
}
