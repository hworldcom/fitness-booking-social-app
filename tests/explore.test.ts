import test from "node:test";
import assert from "node:assert/strict";
import { classes, studios } from "../src/lib/fixtures";
import {
  filterClasses,
  filterStudios,
  type ClassFilters,
} from "../src/lib/explore";

const all: ClassFilters = { activity: "all", date: "", time: "any" };
test("class filters intersect activity, local date, time and global search", () => {
  assert.equal(filterClasses(classes, all).length, 3);
  assert.deepEqual(
    filterClasses(classes, {
      ...all,
      activity: "Yoga",
      date: "2026-09-27",
      time: "morning",
    }).map((c) => c.id),
    ["sunday-flow"],
  );
  assert.equal(
    filterClasses(classes, {
      ...all,
      activity: "Yoga",
      date: "2026-09-27",
      time: "evening",
    }).length,
    0,
  );
  assert.equal(
    filterClasses(classes, { ...all, date: "2026-09-26" }).length,
    0,
  );
  assert.equal(
    filterClasses(classes, { ...all, date: "2027-09-27" }).length,
    0,
  );
  assert.deepEqual(
    filterClasses(classes, { ...all, query: "  FABRIK " }).map((c) => c.id),
    ["strength"],
  );
  assert.equal(
    filterClasses(classes, { ...all, activity: "Yoga", query: "Fabrik" })
      .length,
    0,
  );
});

test("time presets handle noon and 17:00 boundaries without gaps or overlap", () => {
  const boundaryClasses = [
    "00:00",
    "11:59",
    "12:00",
    "16:59",
    "17:00",
    "23:59",
  ].map((time) => ({ ...classes[0], id: time, time }));
  assert.deepEqual(
    filterClasses(boundaryClasses, { ...all, time: "morning" }).map(
      (c) => c.time,
    ),
    ["00:00", "11:59"],
  );
  assert.deepEqual(
    filterClasses(boundaryClasses, { ...all, time: "afternoon" }).map(
      (c) => c.time,
    ),
    ["12:00", "16:59"],
  );
  assert.deepEqual(
    filterClasses(boundaryClasses, { ...all, time: "evening" }).map(
      (c) => c.time,
    ),
    ["17:00", "23:59"],
  );
});

test("studio discovery matches offered activities and coaches independently of schedules", () => {
  assert.equal(filterStudios(studios, { activity: "all" }).length, 3);
  assert.deepEqual(
    filterStudios(studios, { activity: "Yoga" }).map((s) => s.id),
    ["vela"],
  );
  assert.equal(filterStudios(studios, { activity: "Running" }).length, 0);
  assert.deepEqual(
    filterStudios(studios, { activity: "all", query: "maya fischer" }).map(
      (s) => s.id,
    ),
    ["fabrik"],
  );
  assert.equal(
    filterStudios(studios, { activity: "Yoga", query: "Kreuzberg" }).length,
    0,
  );
  const withoutClasses = {
    ...studios[0],
    id: "studio-without-scheduled-classes",
    activities: ["Yoga", "Running"] as const,
  };
  assert.equal(
    filterStudios(
      [{ ...withoutClasses, activities: [...withoutClasses.activities] }],
      { activity: "Running" },
    ).length,
    1,
  );
});
