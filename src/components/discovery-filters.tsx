"use client";
import { MapPin, SlidersHorizontal, WalletCards } from "lucide-react";
import type { Discipline } from "@/domain/catalogue";
import type {
  ActivityFilter,
  AreaFilter,
  PlanFilter,
} from "@/domain/discovery";

export function ActivityControl({
  id,
  value,
  options,
  onChange,
}: {
  id: string;
  value: ActivityFilter;
  options: readonly Discipline[];
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
        {options.map((activity) => (
          <option key={activity} value={activity}>
            {activity}
          </option>
        ))}
      </select>
    </div>
  );
}

export function AreaControl({
  id,
  value,
  options,
  onChange,
}: {
  id: string;
  value: AreaFilter;
  options: readonly string[];
  onChange: (value: AreaFilter) => void;
}) {
  return (
    <div className="discovery-filter">
      <label htmlFor={id}>
        <MapPin size={14} aria-hidden="true" />
        Area
      </label>
      <select
        id={id}
        value={value}
        onChange={(event) => onChange(event.target.value)}
      >
        <option value="all">All Berlin areas</option>
        {options.map((area) => (
          <option key={area} value={area}>
            {area}
          </option>
        ))}
      </select>
    </div>
  );
}

export function PlanControl({
  id,
  value,
  onChange,
}: {
  id: string;
  value: PlanFilter;
  onChange: (value: PlanFilter) => void;
}) {
  return (
    <div className="discovery-filter">
      <label htmlFor={id}>
        <WalletCards size={14} aria-hidden="true" />
        Plan
      </label>
      <select
        id={id}
        value={value}
        onChange={(event) => onChange(event.target.value as PlanFilter)}
      >
        <option value="all">All plans</option>
        <option value="basic">Basic eligible</option>
        <option value="classic">Classic eligible</option>
      </select>
    </div>
  );
}
