import type { ClubClass, ClubStudio } from "@/domain/catalogue";
import type { ClubEvent } from "@/domain/events";
import type {
  ActivityFilter,
  ClassFilters,
  TimeFilter,
} from "@/domain/discovery";

type ActivityQuery = { activity: ActivityFilter; query?: string };

function matchesTime(start: string, filter: TimeFilter) {
  switch (filter) {
    case "morning":
      return start < "12:00";
    case "afternoon":
      return start >= "12:00" && start < "17:00";
    case "evening":
      return start >= "17:00";
    default:
      return true;
  }
}

export function filterClasses(
  catalogue: readonly ClubClass[],
  filters: ClassFilters,
) {
  const query = (filters.query || "").trim().toLowerCase();
  return catalogue.filter(
    (session) =>
      (filters.activity === "all" || session.discipline === filters.activity) &&
      (!filters.date || session.dateISO === filters.date) &&
      matchesTime(session.time, filters.time) &&
      `${session.title} ${session.gym} ${session.area} ${session.trainer} ${session.discipline}`
        .toLowerCase()
        .includes(query),
  );
}

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

export function filterEvents(
  catalogue: readonly ClubEvent[],
  filters: ClassFilters,
) {
  const query = (filters.query || "").trim().toLowerCase();
  return catalogue.filter(
    (event) =>
      (filters.activity === "all" || event.discipline === filters.activity) &&
      (!filters.date || event.dateISO === filters.date) &&
      matchesTime(event.time, filters.time) &&
      `${event.title} ${event.host} ${event.location} ${event.discipline} ${event.included}`
        .toLowerCase()
        .includes(query),
  );
}
