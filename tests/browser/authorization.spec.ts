import { test, expect, type Page } from "@playwright/test";

async function requireConfiguredGuest(page: Page) {
  const response = await page.request.get("/api/auth/actor");
  const actor: unknown = await response.json();
  test.skip(
    response.status() === 200 &&
      typeof actor === "object" &&
      actor !== null &&
      "status" in actor &&
      actor.status === "preview",
    "This check requires the configured local Auth/database mode.",
  );
  expect(response.status()).toBe(401);
  expect(actor).toEqual({ status: "signed-out" });
}

test("configured guests keep public routes and are redirected from private pages", async ({
  page,
}) => {
  await requireConfiguredGuest(page);

  for (const path of [
    "/",
    "/explore",
    "/challenges",
    "/classes/muay-thai",
    "/events/run-and-coffee",
    "/sign-in",
  ]) {
    const response = await page.goto(path);
    expect(response?.status()).toBeLessThan(400);
    expect(new URL(page.url()).pathname).toBe(path);
  }

  for (const path of [
    "/profile",
    "/users/max",
    "/challenges/new",
    "/events/new",
    "/challenges/draft-00000000-0000-4000-8000-000000000001",
    "/events/event-draft-00000000-0000-4000-8000-000000000001",
  ]) {
    await page.goto(path);
    const destination = new URL(page.url());
    expect(destination.pathname).toBe("/sign-in");
    expect(destination.searchParams.get("returnTo")).toBe(path);
  }
});

test("configured guest actions request sign-in without changing preview state", async ({
  page,
}) => {
  await requireConfiguredGuest(page);
  await page.goto("/challenges");
  await page.evaluate(() => localStorage.removeItem("repx-club-preview-v1"));

  await page
    .getByRole("button", { name: "Save The show-up club", exact: true })
    .click();
  let destination = new URL(page.url());
  expect(destination.pathname).toBe("/sign-in");
  expect(destination.searchParams.get("returnTo")).toBe("/challenges");
  expect(
    await page.evaluate(() => localStorage.getItem("repx-club-preview-v1")),
  ).toBeNull();

  await page.goto("/challenges");
  await page.getByRole("button", { name: "My drafts", exact: true }).click();
  destination = new URL(page.url());
  expect(destination.pathname).toBe("/sign-in");
  expect(destination.searchParams.get("returnTo")).toBe("/challenges");
});
