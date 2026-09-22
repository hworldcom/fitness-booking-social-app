import { test, expect } from "@playwright/test";

test("public guide is reachable by keyboard and explains distinct participation flows", async ({
  page,
}, testInfo) => {
  await page.goto("/explore");
  const help = page
    .locator("header")
    .getByRole("link", { name: "How it works", exact: true });
  await expect(help).toBeVisible();
  await help.focus();
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/\/how-it-works$/);
  for (const name of [
    "Classes",
    "Events",
    "Community challenges",
    "Sponsored challenges",
  ])
    await expect(
      page.getByRole("heading", { name, exact: true }),
    ).toBeVisible();
  const walletQuestion = page.getByText("Do I need a wallet?", { exact: true });
  await walletQuestion.focus();
  await page.keyboard.press("Enter");
  await expect(
    page.getByText(/MovX Club sign-in and payments are not connected/),
  ).toBeVisible();
  await page.screenshot({
    path: testInfo.outputPath("how-it-works.png"),
    fullPage: true,
  });
  await page.getByRole("link", { name: "See sponsored challenges" }).click();
  await expect(page.locator(".challenge-card")).toHaveCount(1);
  await expect(
    page.getByRole("button", { name: "Sponsored", exact: true }),
  ).toHaveAttribute("aria-pressed", "true");
});

test("challenge comparison filters, chronology and reset work together", async ({
  page,
}, testInfo) => {
  await page.goto("/challenges");
  const cards = page.locator(".challenge-card");
  await expect(cards).toHaveCount(3);
  await expect(cards.first()).toContainText("22 Sept 2026");
  await expect(cards.first()).toContainText("Participants vote");
  await page.getByLabel("Sort by", { exact: true }).selectOption("newest");
  await expect(cards.first()).toContainText("The show-up club");
  await page.getByLabel("Search challenges", { exact: true }).fill("coffee");
  await expect(cards).toHaveCount(1);
  await page.getByLabel("Activities", { exact: true }).selectOption("Yoga");
  await expect(
    page.getByRole("heading", { name: "No challenges match yet." }),
  ).toBeVisible();
  await page
    .getByRole("button", { name: "Reset filters", exact: true })
    .click();
  await expect(cards).toHaveCount(3);
  await expect(page.getByLabel("Sort by")).toHaveValue("starting");
  await page.screenshot({
    path: testInfo.outputPath("challenge-discovery.png"),
    fullPage: true,
  });
});

test("direct catalogue search includes events and challenges and handles empty/malformed queries", async ({
  page,
}, testInfo) => {
  await page.goto("/search");
  await page
    .getByRole("textbox", { name: "Search the public catalogue", exact: true })
    .fill("coffee");
  await page.getByRole("button", { name: "Search", exact: true }).click();
  await expect(page.locator(".discovery-result")).toHaveCount(2);
  await expect(
    page
      .locator(".search-group")
      .getByRole("heading", { name: "Events", exact: true }),
  ).toBeVisible();
  await expect(
    page
      .locator(".search-group")
      .getByRole("heading", { name: "Challenges", exact: true }),
  ).toBeVisible();
  await page.screenshot({
    path: testInfo.outputPath("search.png"),
    fullPage: true,
  });
  await page.getByRole("link", { name: /Run & Coffee/ }).click();
  await expect(page).toHaveURL(/\/events\/run-and-coffee$/);
  await page.goto("/search?q=not-a-real-activity");
  await expect(
    page.getByRole("heading", { name: "No matches this time." }),
  ).toBeVisible();
  await page.getByRole("link", { name: "Clear search", exact: true }).click();
  await expect(
    page.getByRole("heading", { name: "A little inspiration" }),
  ).toBeVisible();
  await page.goto("/search?q=coffee&q=yoga");
  await expect(
    page.getByRole("heading", { name: "A little inspiration" }),
  ).toBeVisible();
});

test("rules, preview next step, public sharing and clipboard failure stay honest", async ({
  page,
}, testInfo) => {
  await page.addInitScript(() => {
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: {
        writeText: async (text: string) => {
          (window as Window & { copiedLink?: string }).copiedLink = text;
        },
      },
    });
  });
  await page.goto("/challenges/show-up-club?private-query=discard-me");
  await expect(
    page.getByRole("heading", { name: "Your challenge at a glance" }),
  ).toBeVisible();
  await expect(page.locator(".rules-summary")).toContainText("within 24 hours");
  await expect(page.locator(".entry-next-step")).toContainText(
    "Entry not open",
  );
  await page.getByRole("button", { name: "Copy link", exact: true }).click();
  await expect(
    page.getByRole("button", { name: "Link copied", exact: true }),
  ).toBeVisible();
  expect(
    await page.evaluate(
      () => (window as Window & { copiedLink?: string }).copiedLink,
    ),
  ).toBe("http://127.0.0.1:3101/challenges/show-up-club");
  await page.screenshot({
    path: testInfo.outputPath("challenge-detail.png"),
    fullPage: true,
  });
  await page
    .locator(".related-activities")
    .getByRole("link", { name: /Strength, together/ })
    .click();
  await expect(page).toHaveURL(/\/classes\/strength$/);
  await page.goto("/events/run-and-coffee");
  await page.evaluate(() => {
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: {
        writeText: async () => {
          throw new Error("Permission denied");
        },
      },
    });
  });
  await page.getByRole("button", { name: "Copy link", exact: true }).click();
  const fallback = page.getByRole("textbox", {
    name: "Select and copy this public link",
  });
  await expect(fallback).toHaveValue(
    "http://127.0.0.1:3101/events/run-and-coffee",
  );
  await expect(
    page.getByRole("button", { name: "Link copied", exact: true }),
  ).toHaveCount(0);
  await fallback.focus();
  expect(
    await fallback.evaluate(
      (node: HTMLInputElement) => node.selectionEnd! - node.selectionStart!,
    ),
  ).toBeGreaterThan(20);
  await page.screenshot({
    path: testInfo.outputPath("share-fallback.png"),
    fullPage: true,
  });
  await page
    .locator(".related-activities")
    .getByRole("link", { name: /The 5K before coffee/ })
    .click();
  await expect(page.locator(".rules-summary")).toContainText(
    "24-hour voting window is proposed",
  );
});

test("public discovery helpers fit narrow screens and expose no console errors", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.setViewportSize({ width: 320, height: 780 });
  for (const path of [
    "/how-it-works",
    "/search?q=Fabrik",
    "/challenges",
    "/challenges/show-up-club",
    "/events/run-and-coffee",
  ]) {
    await page.goto(path);
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
      path,
    ).toBe(true);
  }
  expect(errors).toEqual([]);
});
