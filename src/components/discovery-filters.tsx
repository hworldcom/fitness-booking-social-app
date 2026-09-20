"use client";
import { CalendarDays, Clock3, SlidersHorizontal, X } from "lucide-react";
import {
  ACTIVITIES,
  TIME_OPTIONS,
  type ActivityFilter,
  type TimeFilter,
} from "@/lib/explore";

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

export function ScheduleControls({
  prefix,
  date,
  time,
  onDate,
  onTime,
}: {
  prefix: string;
  date: string;
  time: TimeFilter;
  onDate: (value: string) => void;
  onTime: (value: TimeFilter) => void;
}) {
  return (
    <>
      <div className="discovery-filter">
        <label htmlFor={`${prefix}-date`}>
          <CalendarDays size={14} aria-hidden="true" />
          Date
        </label>
        <div className="date-filter-control">
          <input
            id={`${prefix}-date`}
            type="date"
            value={date}
            onChange={(event) => onDate(event.target.value)}
            aria-describedby={`${prefix}-schedule-note`}
          />
          {date && (
            <button
              className="icon-button"
              onClick={() => onDate("")}
              aria-label="Clear date"
            >
              <X size={15} />
            </button>
          )}
        </div>
      </div>
      <div className="discovery-filter">
        <label htmlFor={`${prefix}-time`}>
          <Clock3 size={14} aria-hidden="true" />
          Time
        </label>
        <select
          id={`${prefix}-time`}
          value={time}
          onChange={(event) => onTime(event.target.value as TimeFilter)}
        >
          {TIME_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    </>
  );
}
