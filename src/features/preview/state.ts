import type { Draft } from "@/domain/challenges";
import { validateDraft } from "@/domain/challenges";
import { isEventDraft, type EventDraft } from "@/domain/events";

export type DemoState = {
  version: 1;
  following: string[];
  saved: string[];
  drafts: Draft[];
  eventDrafts: EventDraft[];
};

export const INITIAL_STATE: DemoState = {
  version: 1,
  following: ["daniel"],
  saved: [],
  drafts: [],
  eventDrafts: [],
};

export type DemoAction =
  | { type: "follow"; id: string }
  | { type: "save"; id: string }
  | { type: "draft"; draft: Draft }
  | { type: "delete-draft"; id: string }
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
    case "save":
      return { ...state, saved: toggle(state.saved, action.id) };
    case "draft":
      return Object.keys(validateDraft(action.draft)).length
        ? state
        : {
            ...state,
            drafts: [
              action.draft,
              ...state.drafts.filter((d) => d.id !== action.draft.id),
            ],
          };
    case "delete-draft":
      return {
        ...state,
        drafts: state.drafts.filter((d) => d.id !== action.id),
      };
    case "reset":
      return {
        version: 1,
        following: ["daniel"],
        saved: [],
        drafts: [],
        eventDrafts: [],
      };
  }
}

export function parseDemo(raw: string | null): DemoState {
  if (!raw) return INITIAL_STATE;
  try {
    const s = JSON.parse(raw);
    if (
      s?.version !== 1 ||
      ![s.following, s.saved, s.drafts].every(Array.isArray)
    )
      return INITIAL_STATE;
    if (![...s.following, ...s.saved].every((x) => typeof x === "string"))
      return INITIAL_STATE;
    if (
      !s.drafts.every(
        (d: Draft) =>
          d &&
          [
            d.id,
            d.title,
            d.description,
            d.mode,
            d.discipline,
            d.amount,
            d.start,
            d.end,
            d.createdAt,
          ].every((x) => typeof x === "string") &&
          !Object.keys(validateDraft(d)).length,
      )
    )
      return INITIAL_STATE;
    // Older previews have no event drafts. Preserve their existing local state.
    const eventDrafts = s.eventDrafts === undefined ? [] : s.eventDrafts;
    if (
      !Array.isArray(eventDrafts) ||
      !eventDrafts.every(isEventDraft) ||
      new Set(eventDrafts.map((d: EventDraft) => d.id)).size !==
        eventDrafts.length
    )
      return {
        version: 1,
        following: s.following,
        saved: s.saved,
        drafts: s.drafts,
        eventDrafts: [],
      };
    return {
      version: 1,
      following: s.following,
      saved: s.saved,
      drafts: s.drafts,
      eventDrafts,
    };
  } catch {
    return INITIAL_STATE;
  }
}
