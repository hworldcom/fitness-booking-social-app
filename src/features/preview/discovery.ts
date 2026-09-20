import { challengeDate } from "@/components/format";
import type { DiscoveryItem } from "@/domain/discovery";
import { challenges, classes, events, studios } from "./catalogue";

// Only the public, labelled fixture catalogue is indexed. Browser drafts are private.
export const previewDiscoveryCatalogue: DiscoveryItem[] = [
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
