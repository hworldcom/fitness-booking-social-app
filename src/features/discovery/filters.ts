import type { ClubStudio } from "@/domain/catalogue";
import type { ActivityFilter } from "@/domain/discovery";

type ActivityQuery = { activity: ActivityFilter; query?: string };

export function filterStudios(
  catalogue: readonly ClubStudio[],
  filters: ActivityQuery,
) {
  const query = (filters.query || "").trim().toLowerCase();
  return catalogue.filter(
    (studio) =>
      (filters.activity === "all" ||
        studio.activities.includes(filters.activity)) &&
      `${studio.name} ${studio.area} ${studio.activities.join(" ")} ${studio.coaches.join(" ")}`
        .toLowerCase()
        .includes(query),
  );
}
