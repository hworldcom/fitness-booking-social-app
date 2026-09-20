import test from "node:test";
import assert from "node:assert/strict";
import {
  INITIAL_STATE,
  parseDemo,
  reduceDemo,
  visibleBookings,
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

test("only the seeded membership can produce a local booking, with duplicate protection", () => {
  for (const classId of ["strength", "sunday-flow", "missing"]) {
    assert.equal(
      reduceDemo(INITIAL_STATE, { type: "book", classId, shared: true, now }),
      INITIAL_STATE,
    );
  }
  const once = reduceDemo(INITIAL_STATE, {
    type: "book",
    classId: "muay-thai",
    shared: true,
    now,
  });
  assert.equal(once.bookings.length, 1);
  assert.equal(
    reduceDemo(once, { type: "book", classId: "muay-thai", shared: true, now }),
    once,
  );
  assert.equal(visibleBookings(once).length, 1);
  assert.deepEqual(INITIAL_STATE.bookings, []);
});

test("cancellation updates one shared activity; hiding persists across cancellation", () => {
  const booked = reduceDemo(INITIAL_STATE, {
    type: "book",
    classId: "muay-thai",
    shared: true,
    now,
  });
  const cancelled = reduceDemo(booked, {
    type: "cancel",
    classId: "muay-thai",
  });
  assert.equal(visibleBookings(cancelled).length, 1);
  assert.equal(visibleBookings(cancelled)[0].status, "cancelled");
  assert.equal(cancelled.bookings[0].createdAt, now);
  const hidden = reduceDemo(booked, { type: "hide", classId: "muay-thai" });
  assert.equal(
    visibleBookings(
      reduceDemo(hidden, { type: "cancel", classId: "muay-thai" }),
    ).length,
    0,
  );
});

test("privacy opt-out never adds feed activity, including after reload or cancellation", () => {
  const booked = reduceDemo(INITIAL_STATE, {
    type: "book",
    classId: "muay-thai",
    shared: false,
    now,
  });
  const reloaded = parseDemo(JSON.stringify(booked));
  assert.equal(reloaded.bookings.length, 1);
  assert.equal(visibleBookings(reloaded).length, 0);
  assert.equal(
    visibleBookings(
      reduceDemo(reloaded, { type: "cancel", classId: "muay-thai" }),
    ).length,
    0,
  );
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
  const paidBooking = {
    classId: "strength",
    status: "booked",
    shared: true,
    hidden: false,
    createdAt: now,
  };
  assert.equal(
    parseDemo(JSON.stringify({ ...INITIAL_STATE, bookings: [paidBooking] })),
    INITIAL_STATE,
  );
  const booking = { ...paidBooking, classId: "muay-thai" };
  assert.equal(
    parseDemo(
      JSON.stringify({ ...INITIAL_STATE, bookings: [booking, booking] }),
    ),
    INITIAL_STATE,
  );
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
