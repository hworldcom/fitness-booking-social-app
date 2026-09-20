import {
  challenges,
  classes,
  studios,
  type ClubChallenge,
  type Discipline,
} from "./fixtures";
import { events } from "./events";
import type { ActivityFilter } from "./explore";

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

export function challengeDate(date: string) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${date}T00:00:00Z`));
}

export type DiscoveryItem = {
  kind: "Class" | "Studio" | "Event" | "Challenge";
  title: string;
  detail: string;
  href: string;
  activity: string;
  venueId?: string;
};

// Only the public, labelled fixture catalogue is indexed. Browser drafts are private.
export function publicCatalogue(): DiscoveryItem[] {
  return [
    ...classes.map((item): DiscoveryItem => ({
      kind: "Class",
      title: item.title,
      detail: `${item.gym} · ${item.trainer} · ${item.area} · ${item.date}, ${item.time}`,
      href: `/classes/${item.id}`,
      activity: item.discipline,
      venueId: item.gymId,
    })),
    ...studios.map((item): DiscoveryItem => ({
      kind: "Studio",
      title: item.name,
      detail: `${item.area} · ${item.coaches.join(", ")}`,
      href: `/explore?view=studios&q=${encodeURIComponent(item.name)}`,
      activity: item.activities.join(" "),
      venueId: item.id,
    })),
    ...events.map((item): DiscoveryItem => ({
      kind: "Event",
      title: item.title,
      detail: `${item.host} · ${item.location} · ${challengeDate(item.dateISO)}`,
      href: `/events/${item.id}`,
      activity: item.discipline,
    })),
    ...challenges.map((item): DiscoveryItem => ({
      kind: "Challenge",
      title: item.title,
      detail: `${item.organizer} · ${item.date} · ${item.mode === "community" ? "Participants vote" : "Organizer chooses"}`,
      href: `/challenges/${item.id}`,
      activity: item.discipline,
      venueId: item.venueId,
    })),
  ];
}

export function searchCatalogue(query: string) {
  if (!query.trim()) return [];
  return publicCatalogue().filter((item) =>
    matches(query, `${item.title} ${item.detail} ${item.activity}`),
  );
}

export function relatedActivities(
  activity: Discipline,
  excludeHref: string,
  venueId?: string,
) {
  return publicCatalogue()
    .filter(
      (item) =>
        item.kind !== "Studio" &&
        item.href !== excludeHref &&
        (venueId ? item.venueId === venueId : item.activity === activity),
    )
    .slice(0, 3);
}
