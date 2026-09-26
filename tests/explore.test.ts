import test from "node:test";
import assert from "node:assert/strict";
import {
  loadPreviewCatalogue,
  plans,
  previewCatalogue,
  studios,
} from "../src/features/preview/catalogue";
import { filterStudios } from "../src/features/discovery/filters";

test("gym discovery intersects activity and search filters", () => {
  assert.equal(filterStudios(studios, { activity: "all" }).length, 7);
  assert.deepEqual(
    filterStudios(studios, { activity: "Yoga" }).map((studio) => studio.id),
    ["vela", "nightshift-athletic"],
  );
  assert.deepEqual(
    filterStudios(studios, { activity: "Massage" }).map((studio) => studio.id),
    ["quiet-current"],
  );
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
  assert.equal(
    filterStudios(studios, {
      activity: "all",
      area: "Kreuzberg",
      plan: "basic",
    }).length,
    3,
  );
  assert.deepEqual(
    filterStudios(studios, {
      activity: "all",
      plan: "basic",
    }).map((studio) => studio.id),
    ["northside-combat", "fabrik", "vela", "groundline-mma", "kiezstrike"],
  );
});

test("gym discovery does not depend on standalone schedule inventory", () => {
  const gym = {
    ...studios[0],
    id: "gym-without-schedule",
    activities: ["Yoga", "Grappling"] as const,
  };
  assert.equal(
    filterStudios([{ ...gym, activities: [...gym.activities] }], {
      activity: "Grappling",
    }).length,
    1,
  );
});

test("preview plans preserve the confirmed demo contract", () => {
  const basic = plans.find((plan) => plan.id === "basic");
  const classic = plans.find((plan) => plan.id === "classic");

  assert.deepEqual(basic?.price, { amount: 80, currency: "EUR" });
  assert.deepEqual(basic?.access, {
    model: "limited",
    includedCheckins: 10,
  });
  assert.deepEqual(classic?.price, { amount: 150, currency: "EUR" });
  assert.deepEqual(classic?.access, { model: "daily-uncapped" });
  for (const plan of plans) {
    assert.equal(plan.requiredCoreGyms, 4);
    assert.equal(plan.maxIncludedCheckinsPerDay, 1);
    assert.deepEqual(plan.nonCoreVisitPrice, {
      amount: 15,
      currency: "EUR",
    });
  }
});

test("seven fictional gyms use explicitly separate public map anchors", () => {
  assert.equal(studios.length, 7);
  assert.equal(new Set(studios.map((gym) => gym.id)).size, 7);
  assert.ok(studios.every((gym) => gym.fixture));
  assert.ok(studios.every((gym) => gym.mapAnchor.address.endsWith("Berlin")));

  const serialized = JSON.stringify(studios).toLowerCase();
  assert.doesNotMatch(serialized, /https?:\/\/|www\./);
  assert.ok(
    studios.every(
      (gym) =>
        !("website" in gym) &&
        !("source" in gym) &&
        !("sourceUrl" in gym) &&
        !("partner" in gym),
    ),
  );
});

test("the three combat gym map anchors are within one kilometre pairwise", () => {
  const combatIds = ["northside-combat", "groundline-mma", "kiezstrike"];
  const combatGyms = combatIds.map((id) => {
    const gym = studios.find((candidate) => candidate.id === id);
    assert.ok(gym);
    return gym;
  });
  const toRadians = (value: number) => (value * Math.PI) / 180;
  const distanceKm = (
    left: (typeof combatGyms)[number],
    right: (typeof combatGyms)[number],
  ) => {
    const radiusKm = 6371;
    const latitudeDelta = toRadians(
      right.mapAnchor.latitude - left.mapAnchor.latitude,
    );
    const longitudeDelta = toRadians(
      right.mapAnchor.longitude - left.mapAnchor.longitude,
    );
    const a =
      Math.sin(latitudeDelta / 2) ** 2 +
      Math.cos(toRadians(left.mapAnchor.latitude)) *
        Math.cos(toRadians(right.mapAnchor.latitude)) *
        Math.sin(longitudeDelta / 2) ** 2;
    return 2 * radiusKm * Math.asin(Math.sqrt(a));
  };

  for (let left = 0; left < combatGyms.length; left += 1) {
    for (let right = left + 1; right < combatGyms.length; right += 1) {
      assert.ok(distanceKm(combatGyms[left], combatGyms[right]) <= 1);
    }
  }
});

test("the preview adapter rejects malformed data and exposes an honest empty state", () => {
  assert.equal(previewCatalogue.status, "ready");
  assert.equal(loadPreviewCatalogue(null).status, "error");
  assert.equal(
    loadPreviewCatalogue({
      source: "preview-fixtures",
      version: "test",
      plans: [],
      gyms: [],
    }).status,
    "empty",
  );
  assert.equal(
    loadPreviewCatalogue({
      source: "preview-fixtures",
      version: "test",
      plans,
      gyms: [...studios, studios[0]],
    }).status,
    "error",
  );
});
