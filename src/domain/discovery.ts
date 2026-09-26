import type { Discipline, MembershipPlanId } from "./catalogue";

export type ActivityFilter = "all" | Discipline;
export type AreaFilter = "all" | string;
export type PlanFilter = "all" | MembershipPlanId;

export type DiscoveryItem = {
  kind: "Studio";
  title: string;
  detail: string;
  href: string;
  activity: string;
};
