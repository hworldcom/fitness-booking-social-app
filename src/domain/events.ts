import type { Discipline } from "./catalogue";

export type ClubEvent = {
  id: string;
  title: string;
  host: string;
  location: string;
  description: string;
  included: string;
  discipline: Discipline;
  dateISO: string;
  time: string;
  duration: number;
  capacity: number;
  price: number;
};

export type EventDraftInput = {
  title: string;
  host: string;
  location: string;
  description: string;
  included: string;
  discipline: Discipline;
  dateISO: string;
  time: string;
  duration: string;
  capacity: string;
  price: string;
};

export type EventDraft = EventDraftInput & { id: string; createdAt: string };

export function validateEventDraft(input: EventDraftInput) {
  const errors: Record<string, string> = {};
  for (const [key, min, max, label] of [
    ["title", 4, 80, "Event name"],
    ["host", 2, 80, "Host name"],
    ["location", 5, 160, "Meeting point"],
    ["description", 12, 1200, "Event description"],
    ["included", 8, 600, "Ticket inclusions"],
  ] as const) {
    const value = input[key].trim();
    if (value.length < min || value.length > max)
      errors[key] = `${label} needs ${min}–${max} characters.`;
  }
  if (!["Running", "Strength", "Muay Thai", "Yoga"].includes(input.discipline))
    errors.discipline = "Choose a listed activity.";
  const date = new Date(`${input.dateISO}T00:00:00Z`);
  if (
    !/^\d{4}-\d{2}-\d{2}$/.test(input.dateISO) ||
    !Number.isFinite(date.getTime()) ||
    date.toISOString().slice(0, 10) !== input.dateISO
  )
    errors.dateISO = "Choose a valid event date.";
  if (!/^([01]\d|2[0-3]):[0-5]\d$/.test(input.time))
    errors.time = "Choose a valid start time.";
  if (
    !/^\d{1,4}(\.\d{1,2})?$/.test(input.price) ||
    Number(input.price) <= 0 ||
    Number(input.price) > 1000
  )
    errors.price = "Enter 0.01–1,000 test EURC, with up to 2 decimals.";
  if (
    !/^\d+$/.test(input.duration) ||
    Number(input.duration) < 15 ||
    Number(input.duration) > 720
  )
    errors.duration = "Choose a duration from 15 to 720 minutes.";
  if (
    !/^\d+$/.test(input.capacity) ||
    Number(input.capacity) < 1 ||
    Number(input.capacity) > 100
  )
    errors.capacity = "Choose 1–100 places for this demo event.";
  return errors;
}

export function isEventDraft(value: unknown): value is EventDraft {
  if (!value || typeof value !== "object") return false;
  const draft = value as EventDraft;
  return (
    [
      "id",
      "createdAt",
      "title",
      "host",
      "location",
      "description",
      "included",
      "discipline",
      "dateISO",
      "time",
      "duration",
      "capacity",
      "price",
    ].every(
      (key) => typeof (value as Record<string, unknown>)[key] === "string",
    ) &&
    draft.id.startsWith("event-draft-") &&
    !Object.keys(validateEventDraft(draft)).length
  );
}

export function eventFromDraft(draft: EventDraft): ClubEvent {
  return {
    ...draft,
    price: Number(draft.price),
    duration: Number(draft.duration),
    capacity: Number(draft.capacity),
  };
}
