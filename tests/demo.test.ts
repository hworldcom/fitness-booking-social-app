import test from "node:test";
import assert from "node:assert/strict";
import {
  INITIAL_STATE,
  parseDemo,
  reduceDemo,
} from "../src/features/preview/state";
import { validateDraft, type DraftInput } from "../src/domain/challenges";

const input: DraftInput = {
  title: "Lunch break movement",
  description: "Meet for a walk together every lunchtime.",
  mode: "community",
  discipline: "Running",
  amount: "2.50",
  start: "2026-09-22",
  end: "2026-09-29",
};
const now = "2026-09-19T12:00:00Z";

test("drafts validate dates and bounded decimal amounts for both funding modes", () => {
  assert.deepEqual(validateDraft(input), {});
  assert.deepEqual(
    validateDraft({ ...input, mode: "sponsored", amount: "1000" }),
    {},
  );
  for (const amount of ["0", "-2", "1000.01", "2.001", "1e2", "NaN", ""]) {
    assert.ok(validateDraft({ ...input, amount }).amount, amount);
  }
  assert.ok(validateDraft({ ...input, start: "2026-02-30" }).start);
  assert.ok(validateDraft({ ...input, end: input.start }).end);
  assert.ok(validateDraft({ ...input, end: "2026-09-21" }).end);
  assert.ok(
    validateDraft({ ...input, title: " ", description: "short" }).title,
  );
});

test("invalid drafts cannot enter persisted state; valid drafts can be removed", () => {
  const draft = { ...input, id: "draft-example", createdAt: now };
  assert.equal(
    reduceDemo(INITIAL_STATE, {
      type: "draft",
      draft: { ...draft, amount: "0" },
    }),
    INITIAL_STATE,
  );
  const saved = reduceDemo(INITIAL_STATE, { type: "draft", draft });
  assert.equal(saved.drafts.length, 1);
  assert.deepEqual(parseDemo(JSON.stringify(saved)), saved);
  assert.equal(
    reduceDemo(saved, { type: "delete-draft", id: draft.id }).drafts.length,
    0,
  );
});

test("obsolete local membership bookings are discarded without losing other choices", () => {
  const legacy = {
    ...reduceDemo(INITIAL_STATE, { type: "follow", id: "lea" }),
    bookings: [
      {
        classId: "muay-thai",
        status: "booked",
        shared: true,
        hidden: false,
        createdAt: now,
      },
    ],
  };
  assert.deepEqual(parseDemo(JSON.stringify(legacy)), {
    ...INITIAL_STATE,
    following: ["daniel", "lea"],
  });
});

test("corrupt, incompatible and invalid persisted state recover without crashing", () => {
  for (const raw of [
    null,
    "{broken",
    "null",
    "42",
    JSON.stringify({ ...INITIAL_STATE, version: 2 }),
    JSON.stringify({ ...INITIAL_STATE, drafts: [null] }),
    JSON.stringify({ ...INITIAL_STATE, following: [3] }),
  ]) {
    assert.equal(parseDemo(raw), INITIAL_STATE);
  }
});

test("reset clears local choices without mutating the original snapshot", () => {
  const state = reduceDemo(
    reduceDemo(INITIAL_STATE, { type: "follow", id: "lea" }),
    { type: "save", id: "show-up-club" },
  );
  assert.equal(state.following.length, 2);
  assert.equal(state.saved.length, 1);
  assert.deepEqual(reduceDemo(state, { type: "reset" }), INITIAL_STATE);
  assert.equal(INITIAL_STATE.following.length, 1);
});
