import { test, expect } from "@playwright/test";

test("public guide is reachable by keyboard and explains the access model clearly", async ({
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

  const peopleAudience = page.locator('.guide-audiences a[href="#for-people"]');
  const clubAudience = page.locator('.guide-audiences a[href="#for-clubs"]');
  await expect(peopleAudience).toContainText("FOR PEOPLE");
  await expect(peopleAudience).toContainText(
    "Keep access useful. Find your people.",
  );
  await expect(peopleAudience).toContainText("transfer eligible memberships");
  await expect(clubAudience).toContainText("FOR FITNESS BUSINESSES");
  await expect(clubAudience).toContainText("Grow community, not overhead");
  await expect(clubAudience).toContainText(
    "no surprise MovX transaction charges",
  );

  await expect(
    page.getByRole("heading", {
      name: "Flexible for members. Built to grow with fitness businesses.",
    }),
  ).toBeVisible();
  await expect(page.locator(".guide-hero-copy > p")).toHaveText(
    "MovX Club connects flexible fitness access with real communities—giving members more freedom and businesses a direct way to grow.",
  );
  await expect(
    page.getByRole("heading", { name: "From discovery to showing up." }),
  ).toBeVisible();
  for (const name of ["Discover", "Choose access", "Show up", "Stay connected"])
    await expect(
      page.getByRole("heading", { name, exact: true }),
    ).toBeVisible();

  const audienceSections = page.locator("#for-people, #for-clubs");
  await expect(audienceSections).toHaveCount(2);
  await peopleAudience.focus();
  await expect(peopleAudience).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/\/how-it-works#for-people$/);

  const peopleSection = page.locator("#for-people");
  await expect(
    peopleSection.getByRole("heading", {
      name: "Access that can keep working for you.",
    }),
  ).toBeVisible();
  await expect(
    peopleSection.getByRole("heading", {
      name: "Transfer an eligible membership",
    }),
  ).toBeVisible();
  await expect(
    peopleSection.getByRole("heading", { name: "Connect by taking part" }),
  ).toBeVisible();
  await expect(peopleSection).toContainText("under clear terms");
  for (const name of ["Memberships", "Passes", "Events"]) {
    await expect(
      peopleSection.getByRole("heading", { name, exact: true }),
    ).toBeVisible();
  }
  await expect(
    peopleSection.getByRole("heading", {
      name: "A business can help cover the cost of showing up.",
    }),
  ).toBeVisible();
  await expect(peopleSection).toContainText(
    "not a contest, prize pool or vote",
  );

  await clubAudience.focus();
  await expect(clubAudience).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/\/how-it-works#for-clubs$/);
  await expect(
    page.getByRole("heading", {
      name: "Grow your community—not your overhead.",
    }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", {
      name: "Access gets you through the door. Showing up builds the community.",
    }),
  ).toBeVisible();

  for (const name of [
    "Reach more people",
    "Keep platform fees minimal",
    "No transaction surprises",
  ])
    await expect(
      page.getByRole("heading", { name, exact: true }),
    ).toBeVisible();
  await expect(clubAudience).toContainText("minimal fees");
  await expect(page.locator("#for-clubs")).toContainText(
    "no per-transaction platform surcharge or hidden charge",
  );
  await expect(page.locator("#for-clubs")).toContainText(
    "network/account costs still exist",
  );
  await expect(
    page.getByRole("heading", {
      name: "What works today—and what comes next.",
    }),
  ).toBeVisible();
  const guide = page.locator(".how-it-works");
  await expect(guide).not.toContainText(/challenge/i);
  await expect(guide).not.toContainText(/reaction/i);

  const walletQuestion = page.getByText("Do I need a wallet?", { exact: true });
  await walletQuestion.focus();
  await page.keyboard.press("Enter");
  await expect(
    page.getByText(/connecting one does not approve a transaction/),
  ).toBeVisible();
  const sponsoredQuestion = page.getByText("What is a sponsored event?", {
    exact: true,
  });
  await sponsoredQuestion.focus();
  await page.keyboard.press("Enter");
  await expect(
    page.getByText(/cost is partly or fully covered by a sponsor/),
  ).toBeVisible();
  const businessCostQuestion = page.getByText(
    "What does MovX cost a fitness business?",
    { exact: true },
  );
  await businessCostQuestion.focus();
  await page.keyboard.press("Enter");
  await expect(
    page.getByText(/Exact pricing and payments are not live/),
  ).toBeVisible();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true);
  await page.screenshot({
    path: testInfo.outputPath("how-it-works.png"),
    fullPage: true,
  });
  if (testInfo.project.name === "mobile") {
    await page.setViewportSize({ width: 768, height: 1024 });
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= window.innerWidth,
      ),
    ).toBe(true);
    await page.screenshot({
      path: testInfo.outputPath("how-it-works-tablet.png"),
      fullPage: true,
    });
    await page.setViewportSize({ width: 320, height: 800 });
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= window.innerWidth,
      ),
    ).toBe(true);
    await page.screenshot({
      path: testInfo.outputPath("how-it-works-narrow.png"),
      fullPage: true,
    });
  }
  await page
    .getByRole("link", { name: "Explore activities", exact: true })
    .first()
    .click();
  await expect(page).toHaveURL(/\/explore$/);
});

test("direct catalogue search includes supported products and handles empty or malformed queries", async ({
  page,
}, testInfo) => {
  await page.goto("/search");
  await page
    .getByRole("textbox", { name: "Search the public catalogue", exact: true })
    .fill("coffee");
  await page.getByRole("button", { name: "Search", exact: true }).click();
  await expect(page.locator(".discovery-result")).toHaveCount(1);
  await expect(
    page
      .locator(".search-group")
      .getByRole("heading", { name: "Events", exact: true }),
  ).toBeVisible();
  await expect(page.locator(".search-group")).toHaveCount(1);
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

test("public event sharing and clipboard failure stay honest", async ({
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
});

test("retired product challenge URLs return not found", async ({ page }) => {
  for (const path of [
    "/challenges",
    "/challenges/show-up-club",
    "/challenges/new",
  ]) {
    const response = await page.goto(path);
    expect(response?.status(), path).toBe(404);
  }
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
    "/my-access",
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
