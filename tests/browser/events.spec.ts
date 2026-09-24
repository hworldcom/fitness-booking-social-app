import { test, expect } from "@playwright/test";

async function requirePreviewMode(page: import("@playwright/test").Page) {
  const response = await page.request.get("/api/auth/actor");
  const actor: unknown = await response.json();
  test.skip(
    !(
      response.status() === 200 &&
      typeof actor === "object" &&
      actor !== null &&
      "status" in actor &&
      actor.status === "preview"
    ),
    "Event-draft browser persistence requires preview mode.",
  );
}

test("event discovery and ticket preview stay honest", async ({
  page,
}, testInfo) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto("/explore?view=events");
  const eventsTab = page.getByRole("tab", { name: "Events", exact: true });
  await expect(eventsTab).toHaveAttribute("aria-selected", "true");
  await page
    .getByRole("combobox", { name: "Activities", exact: true })
    .selectOption("Yoga");
  await expect(
    page.getByRole("heading", { name: "Another day, another good plan." }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Show all events" }).click();
  await page
    .getByRole("tabpanel")
    .getByLabel("Date", { exact: true })
    .fill("2026-09-27");
  await page
    .getByRole("combobox", { name: "Time", exact: true })
    .selectOption("evening");
  await expect(page.locator(".event-card")).toHaveCount(0);
  await page
    .getByRole("combobox", { name: "Time", exact: true })
    .selectOption("morning");
  await expect(page.locator(".event-card")).toHaveCount(1);
  await eventsTab.focus();
  await page.keyboard.press("ArrowLeft");
  await expect(
    page.getByRole("tab", { name: "Classes", exact: true }),
  ).toBeFocused();
  await expect(
    page.getByRole("tabpanel").getByLabel("Date", { exact: true }),
  ).toHaveValue("");
  await page.keyboard.press("ArrowRight");
  await expect(
    page.getByRole("tabpanel").getByLabel("Date", { exact: true }),
  ).toHaveValue("2026-09-27");
  await page.screenshot({
    path: testInfo.outputPath("events.png"),
    fullPage: true,
  });
  await page
    .getByRole("link", { name: "Open Run & Coffee", exact: true })
    .click();
  await expect(
    page.getByRole("heading", { name: "Included with every ticket" }),
  ).toBeVisible();
  await expect(
    page.getByText(
      "Everyone with a valid ticket gets the included experience. No winner, voting or prize pool.",
    ),
  ).toBeVisible();
  await expect(
    page.getByText(/Buying or redeeming an event ticket won’t increase/),
  ).toBeVisible();
  await page.screenshot({
    path: testInfo.outputPath("event-detail.png"),
    fullPage: true,
  });
  const before = await page.evaluate(() =>
    localStorage.getItem("repx-club-preview-v1"),
  );
  const preview = page.getByRole("button", {
    name: "Preview ticket",
    exact: true,
  });
  await preview.focus();
  await page.keyboard.press("Enter");
  await expect(page.getByRole("dialog")).toContainText("€2.00 test EURC");
  await expect(page.getByRole("dialog")).toContainText(
    "No payment, reservation or ticket has been created.",
  );
  await page.screenshot({ path: testInfo.outputPath("ticket-preview.png") });
  await page.keyboard.press("Escape");
  await expect(preview).toBeFocused();
  expect(
    await page.evaluate(() => localStorage.getItem("repx-club-preview-v1")),
  ).toEqual(before);
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  await page.goto("/events/missing");
  await expect(
    page.getByRole("heading", { name: "A little off the beaten track." }),
  ).toBeVisible();
  expect(errors).toEqual([]);
});

test("event drafts validate, persist privately, reload and delete", async ({
  page,
}, testInfo) => {
  await requirePreviewMode(page);
  await page.goto("/explore?view=events");
  await page.getByRole("link", { name: "Create event", exact: true }).click();
  await page.getByRole("button", { name: "Save event draft" }).click();
  await expect(page.getByLabel("Event name", { exact: true })).toBeFocused();
  await expect(page.locator("#event-title-error")).toBeVisible();
  await page
    .getByLabel("Event name", { exact: true })
    .fill("Sunday run with friends");
  await page.getByLabel("Host name", { exact: true }).fill("Corner Café");
  await page
    .getByLabel("Meeting point", { exact: true })
    .fill("Outside the café in Kreuzberg");
  await page
    .getByLabel("What’s the plan?", { exact: true })
    .fill("Meet for an easy 5K and come back for coffee together.");
  await page
    .getByLabel("Included with every ticket", { exact: true })
    .fill("One group run and one regular coffee afterwards.");
  await page.getByLabel("Ticket price (test EURC)", { exact: true }).fill("0");
  await page.getByRole("button", { name: "Save event draft" }).click();
  await expect(page.locator("#event-price-error")).toBeVisible();
  await expect(
    page.getByLabel("Ticket price (test EURC)", { exact: true }),
  ).toBeFocused();
  await page.getByLabel("Ticket price (test EURC)", { exact: true }).fill("2");
  await page.screenshot({
    path: testInfo.outputPath("create-event.png"),
    fullPage: true,
  });
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  await page.getByRole("button", { name: "Save event draft" }).click();
  await expect(page).toHaveURL(/\/events\/event-draft-/);
  const url = page.url();
  await page.reload();
  await expect(
    page.getByRole("heading", { name: "Sunday run with friends", exact: true }),
  ).toBeVisible();
  await expect(page.getByText("Saved locally · Not published")).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Preview ticket" }),
  ).toHaveCount(0);
  await page.getByRole("link", { name: "Explore events", exact: true }).click();
  await expect(page.locator(".event-card")).toHaveCount(1);
  await page.getByRole("link", { name: /Sunday run with friends/ }).click();
  await page
    .getByRole("button", { name: "Delete event draft", exact: true })
    .click();
  await page
    .getByRole("dialog")
    .getByRole("button", { name: "Keep draft" })
    .click();
  await page
    .getByRole("button", { name: "Delete event draft", exact: true })
    .click();
  await page
    .getByRole("dialog")
    .getByRole("button", { name: "Delete event draft", exact: true })
    .click();
  await expect(page).toHaveURL(/\/explore\?view=events$/);
  const state = await page.evaluate(() =>
    JSON.parse(localStorage.getItem("repx-club-preview-v1") || "{}"),
  );
  expect(state.eventDrafts).toEqual([]);
  expect(state.version).toBe(2);
  expect(state.drafts).toBeUndefined();
  expect(state.saved).toBeUndefined();
  expect(state.bookings).toBeUndefined();
  await page.goto(url);
  await expect(
    page.getByRole("heading", { name: "This event draft isn’t here." }),
  ).toBeVisible();
});
