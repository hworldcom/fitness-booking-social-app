import test from "node:test";
import assert from "node:assert/strict";
import {
  INITIAL_STATE,
  parseDemo,
  reduceDemo,
} from "../src/features/preview/state";

test("legacy challenge fields are discarded while supported choices survive", () => {
  const legacy = {
    version: 1,
    following: ["daniel", "lea"],
    saved: ["show-up-club"],
    drafts: [{ id: "obsolete-challenge-draft" }],
    reactions: { "obsolete-activity": "cheer" },
    eventDrafts: [],
  };

  assert.deepEqual(parseDemo(JSON.stringify(legacy)), {
    version: 2,
    following: ["daniel", "lea"],
    eventDrafts: [],
  });
});

test("older stores without event drafts preserve follows during migration", () => {
  assert.deepEqual(
    parseDemo(
      JSON.stringify({
        version: 1,
        following: ["daniel", "max"],
        saved: [],
        drafts: [],
      }),
    ),
    { version: 2, following: ["daniel", "max"], eventDrafts: [] },
  );
});

test("malformed event drafts are dropped without erasing supported follows", () => {
  const parsed = parseDemo(
    JSON.stringify({
      version: 1,
      following: ["daniel", "lea"],
      saved: ["obsolete"],
      drafts: [null],
      eventDrafts: [{ id: "broken" }],
    }),
  );
  assert.deepEqual(parsed, {
    version: 2,
    following: ["daniel", "lea"],
    eventDrafts: [],
  });
});

test("corrupt and incompatible persisted state recover without crashing", () => {
  for (const raw of [
    null,
    "{broken",
    "null",
    "42",
    JSON.stringify({ ...INITIAL_STATE, version: 3 }),
    JSON.stringify({ ...INITIAL_STATE, following: [3] }),
  ]) {
    assert.equal(parseDemo(raw), INITIAL_STATE);
  }
});

test("follow and reset keep the version 2 preview shape", () => {
  const followed = reduceDemo(INITIAL_STATE, { type: "follow", id: "lea" });
  assert.deepEqual(followed.following, ["daniel", "lea"]);
  assert.deepEqual(reduceDemo(followed, { type: "reset" }), INITIAL_STATE);
  assert.equal(INITIAL_STATE.version, 2);
});
