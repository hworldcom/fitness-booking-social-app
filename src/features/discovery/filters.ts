import type { ClubStudio } from "@/domain/catalogue";
import type {
  ActivityFilter,
  AreaFilter,
  PlanFilter,
} from "@/domain/discovery";

type GymFilters = {
  activity: ActivityFilter;
  area?: AreaFilter;
  plan?: PlanFilter;
  query?: string;
};

export function filterStudios(
  catalogue: readonly ClubStudio[],
  filters: GymFilters,
) {
  const query = (filters.query || "").trim().toLowerCase();
  return catalogue.filter(
    (studio) =>
      (filters.activity === "all" ||
        studio.activities.includes(filters.activity)) &&
      (!filters.area ||
        filters.area === "all" ||
        studio.area === filters.area) &&
      (!filters.plan ||
        filters.plan === "all" ||
        studio.eligiblePlans.includes(filters.plan)) &&
      `${studio.name} ${studio.area} ${studio.activities.join(" ")} ${studio.coaches.join(" ")} ${studio.mapAnchor.address}`
        .toLowerCase()
        .includes(query),
  );
}
