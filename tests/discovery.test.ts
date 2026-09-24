import test from "node:test";
import assert from "node:assert/strict";
import { relatedActivities } from "../src/domain/discovery";
import { searchCatalogue } from "../src/features/discovery/queries";
import { previewDiscoveryCatalogue } from "../src/features/preview/discovery";

test("public search covers supported types, accents and multiword intersections", () => {
  assert.deepEqual(
    new Set(
      searchCatalogue(previewDiscoveryCatalogue, "yoga").map((x) => x.kind),
    ),
    new Set(["Class", "Studio"]),
  );
  assert.deepEqual(
    searchCatalogue(previewDiscoveryCatalogue, "coffee").map((x) => x.kind),
    ["Event"],
  );
  assert.deepEqual(
    searchCatalogue(previewDiscoveryCatalogue, "mayá fabrik").map(
      (x) => x.kind,
    ),
    ["Class", "Studio"],
  );
  assert.equal(
    searchCatalogue(previewDiscoveryCatalogue, "yoga fabrik").length,
    0,
  );
  assert.equal(searchCatalogue(previewDiscoveryCatalogue, "   ").length, 0);
  assert.equal(
    searchCatalogue(previewDiscoveryCatalogue, "event-draft-private").length,
    0,
  );
  assert.ok(
    searchCatalogue(previewDiscoveryCatalogue, "Fabrik").every(
      (x) => x.href.startsWith("/") && !x.href.includes("draft-"),
    ),
  );
});

test("the public catalogue contains no retired product route", () => {
  assert.ok(
    previewDiscoveryCatalogue.every(
      (item) => !item.href.startsWith("/challenges"),
    ),
  );
});

test("related content excludes itself and uses actual venue association", () => {
  assert.deepEqual(
    relatedActivities(
      previewDiscoveryCatalogue,
      "Strength",
      "/classes/strength",
      "fabrik",
    ),
    [],
  );
  assert.deepEqual(
    relatedActivities(
      previewDiscoveryCatalogue,
      "Running",
      "/events/run-and-coffee",
    ),
    [],
  );
  assert.deepEqual(
    relatedActivities(
      previewDiscoveryCatalogue,
      "Yoga",
      "/classes/sunday-flow",
      "vela",
    ),
    [],
  );
});
