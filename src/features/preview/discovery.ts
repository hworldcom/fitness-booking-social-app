import type { DiscoveryItem } from "@/domain/discovery";
import { studios } from "./catalogue";

// Only the public, labelled gym fixtures are indexed.
export const previewDiscoveryCatalogue: DiscoveryItem[] = [
  ...studios.map((item): DiscoveryItem => ({
    kind: "Studio",
    title: item.name,
    detail: `${item.area} · ${item.coaches.join(", ")}`,
    href: `/explore?q=${encodeURIComponent(item.name)}`,
    activity: item.activities.join(" "),
  })),
];
