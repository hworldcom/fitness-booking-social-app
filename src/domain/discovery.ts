import type { Discipline } from "./catalogue";

export type ActivityFilter = "all" | Discipline;

export type DiscoveryItem = {
  kind: "Studio";
  title: string;
  detail: string;
  href: string;
  activity: string;
};
