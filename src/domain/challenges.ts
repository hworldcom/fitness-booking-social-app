import type { ChallengeMode, ClubChallenge, Discipline } from "./catalogue";
import type { ActivityFilter } from "./discovery";

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

const normalize = (text: string) =>
  text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();

function matches(query: string, text: string) {
  const haystack = normalize(text);
  return normalize(query.trim())
    .split(/\s+/)
    .every((term) => haystack.includes(term));
}

export type ChallengeSort = "starting" | "newest";

export function discoverChallenges(
  items: ClubChallenge[],
  options: {
    query?: string;
    activity?: ActivityFilter;
    mode?: "all" | "community" | "sponsored";
    sort?: ChallengeSort;
  },
) {
  return items
    .filter(
      (item) =>
        (!options.activity ||
          options.activity === "all" ||
          item.discipline === options.activity) &&
        (!options.mode ||
          options.mode === "all" ||
          item.mode === options.mode) &&
        matches(
          options.query || "",
          `${item.title} ${item.organizer} ${item.discipline} ${item.description}`,
        ),
    )
    .sort((a, b) => {
      const order =
        options.sort === "newest"
          ? b.createdAt.localeCompare(a.createdAt)
          : a.startDate.localeCompare(b.startDate);
      return order || a.title.localeCompare(b.title);
    });
}
