import test from "node:test";
import assert from "node:assert/strict";
import { searchCatalogue } from "../src/features/discovery/queries";
import { previewDiscoveryCatalogue } from "../src/features/preview/discovery";

test("public search indexes only the interim gym catalogue", () => {
  const yogaResults = searchCatalogue(previewDiscoveryCatalogue, "yoga");
  assert.deepEqual(
    yogaResults.map((item) => item.title),
    ["Studio Vela", "Nightshift Athletic Club"],
  );
  assert.ok(yogaResults.every((item) => item.kind === "Studio"));
  assert.deepEqual(
    searchCatalogue(previewDiscoveryCatalogue, "mayá fabrik").map(
      (item) => item.title,
    ),
    ["Fabrik Training"],
  );
  assert.equal(
    searchCatalogue(previewDiscoveryCatalogue, "yoga fabrik").length,
    0,
  );
  assert.equal(searchCatalogue(previewDiscoveryCatalogue, "   ").length, 0);
});

test("the public catalogue contains only Explore gym destinations", () => {
  assert.ok(previewDiscoveryCatalogue.length > 0);
  assert.ok(
    previewDiscoveryCatalogue.every(
      (item) => item.kind === "Studio" && item.href.startsWith("/explore?q="),
    ),
  );
  assert.ok(
    previewDiscoveryCatalogue.every(
      (item) =>
        !item.href.startsWith("/classes") &&
        !item.href.startsWith("/events") &&
        !item.href.startsWith("/challenges"),
    ),
  );
});
