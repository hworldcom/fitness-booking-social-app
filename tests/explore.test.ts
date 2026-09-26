import test from "node:test";
import assert from "node:assert/strict";
import { studios } from "../src/features/preview/catalogue";
import { filterStudios } from "../src/features/discovery/filters";

test("gym discovery intersects activity and search filters", () => {
  assert.equal(filterStudios(studios, { activity: "all" }).length, 3);
  assert.deepEqual(
    filterStudios(studios, { activity: "Yoga" }).map((studio) => studio.id),
    ["vela"],
  );
  assert.equal(filterStudios(studios, { activity: "Running" }).length, 0);
  assert.deepEqual(
    filterStudios(studios, {
      activity: "all",
      query: "maya fischer",
    }).map((studio) => studio.id),
    ["fabrik"],
  );
  assert.equal(
    filterStudios(studios, {
      activity: "Yoga",
      query: "Kreuzberg",
    }).length,
    0,
  );
});

test("gym discovery does not depend on standalone schedule inventory", () => {
  const gym = {
    ...studios[0],
    id: "gym-without-schedule",
    activities: ["Yoga", "Running"] as const,
  };
  assert.equal(
    filterStudios([{ ...gym, activities: [...gym.activities] }], {
      activity: "Running",
    }).length,
    1,
  );
});
