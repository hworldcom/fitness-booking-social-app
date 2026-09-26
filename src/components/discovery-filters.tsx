"use client";
import { SlidersHorizontal } from "lucide-react";
import type { Discipline } from "@/domain/catalogue";
import type { ActivityFilter } from "@/domain/discovery";

const ACTIVITIES: Discipline[] = ["Muay Thai", "Strength", "Yoga", "Running"];
export function ActivityControl({
  id,
  value,
  onChange,
}: {
  id: string;
  value: ActivityFilter;
  onChange: (value: ActivityFilter) => void;
}) {
  return (
    <div className="discovery-filter">
      <label htmlFor={id}>
        <SlidersHorizontal size={14} aria-hidden="true" />
        Activities
      </label>
      <select
        id={id}
        value={value}
        onChange={(event) => onChange(event.target.value as ActivityFilter)}
      >
        <option value="all">All activities</option>
        {ACTIVITIES.map((activity) => (
          <option key={activity} value={activity}>
            {activity}
          </option>
        ))}
      </select>
    </div>
  );
}
