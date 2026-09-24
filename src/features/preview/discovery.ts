import { eventDate } from "@/components/format";
import type { DiscoveryItem } from "@/domain/discovery";
import { classes, events, studios } from "./catalogue";

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
    detail: `${item.host} · ${item.location} · ${eventDate(item.dateISO)}`,
    href: `/events/${item.id}`,
    activity: item.discipline,
  })),
];
