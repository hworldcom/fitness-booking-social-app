import type { Discipline } from "./catalogue";

export type ActivityFilter = "all" | Discipline;
export type TimeFilter = "any" | "morning" | "afternoon" | "evening";
export type ClassFilters = {
  activity: ActivityFilter;
  query?: string;
  date: string;
  time: TimeFilter;
};

export type DiscoveryItem = {
  kind: "Class" | "Studio" | "Event";
  title: string;
  detail: string;
  href: string;
  activity: string;
  venueId?: string;
};

export function relatedActivities(
  catalogue: readonly DiscoveryItem[],
  activity: Discipline,
  excludeHref: string,
  venueId?: string,
) {
  return catalogue
    .filter(
      (item) =>
        item.kind !== "Studio" &&
        item.href !== excludeHref &&
        (venueId ? item.venueId === venueId : item.activity === activity),
    )
    .slice(0, 3);
}
