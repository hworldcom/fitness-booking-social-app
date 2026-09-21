import test from "node:test";
import assert from "node:assert/strict";
import {
  INITIAL_STATE,
  parseDemo,
  reduceDemo,
} from "../src/features/preview/state";
import { validateEventDraft, type EventDraftInput } from "../src/domain/events";
import { events } from "../src/features/preview/catalogue";
import { filterEvents } from "../src/features/discovery/filters";

const input: EventDraftInput = {
  title: "Run and coffee",
  host: "Sunday Coffee",
  location: "Kreuzberg, Berlin",
  description: "An easy 5K followed by a coffee together.",
  included: "One social run and a filter coffee.",
  discipline: "Running",
  price: "2",
  dateISO: "2026-09-27",
  time: "09:00",
  duration: "90",
  capacity: "12",
};

test("event drafts require a benefit, valid schedule, capacity and positive bounded ticket price", () => {
  assert.deepEqual(validateEventDraft(input), {});
  for (const price of ["0", "-2", "1000.01", "2.001", "1e2", "NaN", ""])
    assert.ok(validateEventDraft({ ...input, price }).price, price);
  assert.equal(
    Object.keys(
      validateEventDraft({
        ...input,
        included: " ",
        dateISO: "2026-02-30",
        time: "24:00",
        duration: "0",
        capacity: "1.5",
      }),
    ).length,
    5,
  );
  assert.ok(validateEventDraft({ ...input, time: "09:60" }).time);
  assert.ok(validateEventDraft({ ...input, capacity: "101" }).capacity);
  assert.ok(validateEventDraft({ ...input, duration: "721" }).duration);
  assert.deepEqual(
    validateEventDraft({
      ...input,
      price: "0.01",
      time: "23:59",
      dateISO: "2028-02-29",
      capacity: "1",
      duration: "15",
    }),
    {},
  );
});

test("event drafts persist without creating challenge entries, deduplicate and delete", () => {
  const draft = {
    ...input,
    id: "event-draft-example",
    createdAt: "2026-09-19T12:00:00Z",
  };
  assert.equal(
    reduceDemo(INITIAL_STATE, {
      type: "event-draft",
      draft: { ...draft, included: "" },
    }),
    INITIAL_STATE,
  );
  const saved = reduceDemo(INITIAL_STATE, { type: "event-draft", draft });
  const again = reduceDemo(saved, {
    type: "event-draft",
    draft: { ...draft, title: "Updated run & coffee" },
  });
  assert.equal(again.eventDrafts.length, 1);
  assert.equal(again.eventDrafts[0].title, "Updated run & coffee");
  assert.deepEqual(parseDemo(JSON.stringify(again)), again);
  assert.deepEqual(saved.drafts, []);
  assert.equal(
    reduceDemo(saved, { type: "delete-event-draft", id: draft.id }).eventDrafts
      .length,
    0,
  );
  assert.deepEqual(reduceDemo(saved, { type: "reset" }), INITIAL_STATE);
});

test("old local stores migrate and malformed event drafts preserve other choices", () => {
  const followed = reduceDemo(INITIAL_STATE, { type: "follow", id: "lea" });
  const old = { ...followed, eventDrafts: undefined };
  assert.deepEqual(parseDemo(JSON.stringify(old)), followed);
  for (const eventDrafts of [
    null,
    {},
    [null],
    [{ ...input, id: "event-draft-test", createdAt: "now", included: 12 }],
  ]) {
    const parsed = parseDemo(JSON.stringify({ ...followed, eventDrafts }));
    assert.deepEqual(parsed.following, followed.following);
    assert.deepEqual(parsed.eventDrafts, []);
  }
});

test("event discovery intersects host or benefit search with activity and local schedule", () => {
  const filters = {
    activity: "Running",
    date: "2026-09-27",
    time: "morning",
    query: "  SUNDAY COFFEE ",
  } as const;
  assert.deepEqual(
    filterEvents(events, filters).map((e) => e.id),
    ["run-and-coffee"],
  );
  for (const change of [
    { activity: "Yoga" as const },
    { date: "2026-09-26" },
    { time: "evening" as const },
    { query: "missing" },
  ])
    assert.equal(filterEvents(events, { ...filters, ...change }).length, 0);
  assert.equal(
    filterEvents(events, { ...filters, query: "espresso" }).length,
    1,
  );
});
