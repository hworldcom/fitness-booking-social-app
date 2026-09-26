import test from "node:test";
import assert from "node:assert/strict";
import {
  INITIAL_STATE,
  parseDemo,
  reduceDemo,
} from "../src/features/preview/state";

test("retired preview fields are discarded while supported follows survive", () => {
  const legacy = {
    version: 1,
    following: ["daniel", "lea"],
    saved: ["show-up-club"],
    drafts: [{ id: "obsolete-challenge-draft" }],
    reactions: { "obsolete-activity": "cheer" },
    eventDrafts: [],
  };

  assert.deepEqual(parseDemo(JSON.stringify(legacy)), {
    version: 3,
    following: ["daniel", "lea"],
  });
});

test("older preview stores preserve unique follows during migration", () => {
  assert.deepEqual(
    parseDemo(
      JSON.stringify({
        version: 1,
        following: ["daniel", "max", "daniel"],
        saved: [],
        drafts: [],
      }),
    ),
    { version: 3, following: ["daniel", "max"] },
  );
});

test("malformed retired state is ignored without erasing supported follows", () => {
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
    version: 3,
    following: ["daniel", "lea"],
  });
});

test("corrupt and incompatible persisted state recover without crashing", () => {
  for (const raw of [
    null,
    "{broken",
    "null",
    "42",
    JSON.stringify({ ...INITIAL_STATE, version: 4 }),
    JSON.stringify({ ...INITIAL_STATE, following: [3] }),
  ]) {
    assert.equal(parseDemo(raw), INITIAL_STATE);
  }
});

test("follow and reset keep the version 3 preview shape", () => {
  const followed = reduceDemo(INITIAL_STATE, { type: "follow", id: "lea" });
  assert.deepEqual(followed.following, ["daniel", "lea"]);
  assert.deepEqual(reduceDemo(followed, { type: "reset" }), INITIAL_STATE);
  assert.equal(INITIAL_STATE.version, 3);
});
