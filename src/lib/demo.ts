import { classes, type ChallengeMode, type Discipline } from "./fixtures";
import { isEventDraft, type EventDraft } from "./events";

export type Draft = {
  id: string;
  title: string;
  description: string;
  mode: ChallengeMode;
  discipline: Discipline;
  amount: string;
  start: string;
  end: string;
  createdAt: string;
};
export type Booking = {
  classId: string;
  status: "booked" | "cancelled";
  shared: boolean;
  hidden: boolean;
  createdAt: string;
};
export type DemoState = {
  version: 1;
  following: string[];
  saved: string[];
  drafts: Draft[];
  eventDrafts: EventDraft[];
  bookings: Booking[];
};
export const INITIAL_STATE: DemoState = {
  version: 1,
  following: ["daniel"],
  saved: [],
  drafts: [],
  eventDrafts: [],
  bookings: [],
};
export type DraftInput = Omit<Draft, "id" | "createdAt">;
const disciplines = ["Running", "Strength", "Muay Thai", "Yoga"];
function validDate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const parsed = new Date(`${value}T00:00:00Z`);
  return (
    Number.isFinite(parsed.getTime()) &&
    parsed.toISOString().slice(0, 10) === value
  );
}
export function validateDraft(input: DraftInput): Record<string, string> {
  const errors: Record<string, string> = {};
  if (input.title.trim().length < 4 || input.title.trim().length > 80)
    errors.title = "Use a title between 4 and 80 characters.";
  if (input.description.trim().length < 12 || input.description.length > 1200)
    errors.description = "Describe the activity in 12–1,200 characters.";
  if (!["community", "sponsored"].includes(input.mode))
    errors.mode = "Choose a challenge type.";
  if (!disciplines.includes(input.discipline))
    errors.discipline = "Choose a listed activity.";
  if (
    !/^\d{1,4}(\.\d{1,2})?$/.test(input.amount) ||
    Number(input.amount) <= 0 ||
    Number(input.amount) > 1000
  )
    errors.amount =
      "Enter an amount between €0.01 and €1,000, with up to 2 decimals.";
  if (!validDate(input.start)) errors.start = "Choose a valid start date.";
  if (!validDate(input.end) || input.end <= input.start)
    errors.end = "End the challenge after its start date.";
  return errors;
}
export type DemoAction =
  | { type: "follow"; id: string }
  | { type: "save"; id: string }
  | { type: "draft"; draft: Draft }
  | { type: "delete-draft"; id: string }
  | { type: "event-draft"; draft: EventDraft }
  | { type: "delete-event-draft"; id: string }
  | { type: "book"; classId: string; shared: boolean; now: string }
  | { type: "cancel" | "hide"; classId: string }
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
    case "book": {
      if (
        !classes.some((c) => c.id === action.classId && c.membership) ||
        state.bookings.some((b) => b.classId === action.classId)
      )
        return state;
      return {
        ...state,
        bookings: [
          ...state.bookings,
          {
            classId: action.classId,
            status: "booked",
            shared: action.shared,
            hidden: false,
            createdAt: action.now,
          },
        ],
      };
    }
    case "cancel":
      return {
        ...state,
        bookings: state.bookings.map((b) =>
          b.classId === action.classId ? { ...b, status: "cancelled" } : b,
        ),
      };
    case "hide":
      return {
        ...state,
        bookings: state.bookings.map((b) =>
          b.classId === action.classId ? { ...b, hidden: true } : b,
        ),
      };
    case "reset":
      return {
        version: 1,
        following: ["daniel"],
        saved: [],
        drafts: [],
        eventDrafts: [],
        bookings: [],
      };
  }
}
export function parseDemo(raw: string | null): DemoState {
  if (!raw) return INITIAL_STATE;
  try {
    const s = JSON.parse(raw);
    if (
      s?.version !== 1 ||
      ![s.following, s.saved, s.drafts, s.bookings].every(Array.isArray)
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
    if (
      !s.bookings.every(
        (b: Booking) =>
          b &&
          classes.some((c) => c.id === b.classId && c.membership) &&
          ["booked", "cancelled"].includes(b.status) &&
          typeof b.shared === "boolean" &&
          typeof b.hidden === "boolean" &&
          typeof b.createdAt === "string",
      )
    )
      return INITIAL_STATE;
    if (
      new Set(s.bookings.map((b: Booking) => b.classId)).size !==
      s.bookings.length
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
      return { ...s, eventDrafts: [] } as DemoState;
    return { ...s, eventDrafts } as DemoState;
  } catch {
    return INITIAL_STATE;
  }
}
export const visibleBookings = (state: DemoState) =>
  state.bookings.filter((b) => b.shared && !b.hidden);
