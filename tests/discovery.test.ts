import test from "node:test";
import assert from "node:assert/strict";
import { challenges } from "../src/lib/fixtures";
import {
  discoverChallenges,
  searchCatalogue,
  relatedActivities,
} from "../src/lib/discovery";

test("challenge search intersects mode, activity and normalized words", () => {
  assert.deepEqual(
    discoverChallenges(challenges, {
      query: "  FABRIK strength ",
      mode: "sponsored",
      activity: "Strength",
    }).map((x) => x.id),
    ["show-up-club"],
  );
  assert.equal(
    discoverChallenges(challenges, { query: "Fabrik", mode: "community" })
      .length,
    0,
  );
  assert.equal(
    discoverChallenges(challenges, { query: "coffee", activity: "Yoga" })
      .length,
    0,
  );
  assert.equal(
    discoverChallenges(challenges, { query: "nothing-matches" }).length,
    0,
  );
  assert.equal(discoverChallenges(challenges, { query: "  " }).length, 3);
});

test("chronological sort crosses months/years and does not mutate the catalogue", () => {
  const items = [
    {
      ...challenges[0],
      id: "later",
      startDate: "2027-01-01",
      createdAt: "2026-12-28T09:00:00Z",
    },
    {
      ...challenges[1],
      id: "early",
      startDate: "2026-12-30",
      createdAt: "2026-12-29T09:00:00Z",
    },
  ];
  const before = structuredClone(items);
  assert.deepEqual(
    discoverChallenges(items, { sort: "starting" }).map((x) => x.id),
    ["early", "later"],
  );
  assert.deepEqual(
    discoverChallenges(items, { sort: "newest" }).map((x) => x.id),
    ["early", "later"],
  );
  assert.deepEqual(items, before);
  assert.deepEqual(
    discoverChallenges(challenges, { sort: "newest" }).map((x) => x.id),
    ["show-up-club", "find-your-flow", "before-coffee"],
  );
});

test("public search covers every type, names with accents and multiword intersections", () => {
  assert.deepEqual(
    new Set(searchCatalogue("yoga").map((x) => x.kind)),
    new Set(["Class", "Studio", "Challenge"]),
  );
  assert.deepEqual(
    searchCatalogue("coffee").map((x) => x.kind),
    ["Event", "Challenge"],
  );
  assert.deepEqual(
    searchCatalogue("mayá fabrik").map((x) => x.kind),
    ["Class", "Studio"],
  );
  assert.equal(searchCatalogue("yoga fabrik").length, 0);
  assert.equal(searchCatalogue("   ").length, 0);
  assert.equal(searchCatalogue("event-draft-private").length, 0);
  assert.ok(
    searchCatalogue("Fabrik").every(
      (x) => x.href.startsWith("/") && !x.href.includes("draft-"),
    ),
  );
});

test("related content excludes itself and prioritizes actual venue association", () => {
  assert.deepEqual(
    relatedActivities("Strength", "/challenges/show-up-club", "fabrik").map(
      (x) => x.href,
    ),
    ["/classes/strength"],
  );
  assert.deepEqual(
    relatedActivities("Running", "/events/run-and-coffee").map((x) => x.href),
    ["/challenges/before-coffee"],
  );
  assert.deepEqual(
    relatedActivities("Yoga", "/challenges/find-your-flow", "unknown-venue"),
    [],
  );
});
