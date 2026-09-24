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

  await expect(
    page.getByRole("heading", {
      name: "Fitness access that doesn't lose its value.",
    }),
  ).toBeVisible();
  await expect(page.locator(".hiw-hero-copy > p")).toContainText(
    "transfer eligible memberships when your plans change",
  );
  const membership = page.getByRole("article", {
    name: "Example transferable membership",
  });
  await expect(membership).toContainText("3 Month Membership");
  await expect(membership).toContainText("TRANSFERABLE");
  await expect(membership).toContainText("42 days remaining");
  await expect(membership).toContainText("€69 / month");
  await expect(membership).toContainText("Transfer remaining access");
  await expect(
    page.getByText("Product concept · Solana Devnet demo"),
  ).toBeVisible();

  const journeyLink = page.getByRole("link", {
    name: "See how it works",
    exact: true,
  });
  await journeyLink.focus();
  await expect(journeyLink).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/\/how-it-works#access-journey$/);
  await expect(
    page.getByRole("heading", {
      name: "From discovery to flexible access.",
    }),
  ).toBeVisible();
  for (const name of ["Discover", "Get access", "Show up", "Keep it flexible"])
    await expect(
      page.getByRole("heading", { name, exact: true }),
    ).toBeVisible();
  await expect(page.locator(".hiw-journey-grid li.featured")).toContainText(
    "Transfer eligible remaining access",
  );

  const transfer = page.locator(".hiw-transfer");
  await expect(transfer).toContainText("Alex");
  await expect(transfer).toContainText("ELIGIBLE TRANSFER");
  await expect(transfer).toContainText("Small transfer fee paid to the gym");
  await expect(transfer).toContainText("Sam");

  const peopleSection = page.locator("#for-people");
  await expect(
    peopleSection.getByRole("heading", {
      name: "Your access stays useful.",
    }),
  ).toBeVisible();
  await expect(peopleSection).toContainText(
    "Transfer eligible access when plans change",
  );
  await expect(peopleSection).toContainText(
    "Community based on actually showing up",
  );

  const clubSection = page.locator("#for-clubs");
  await expect(
    clubSection.getByRole("heading", {
      name: "Grow without another transaction tax.",
    }),
  ).toBeVisible();
  await expect(clubSection).toContainText(
    "Publish memberships, passes and sponsored events",
  );
  await expect(clubSection).toContainText(
    "Predictable pricing without hidden MovX surcharges",
  );
  await expect(
    page.getByRole("heading", {
      name: "Solana stays underneath the fitness experience.",
    }),
  ).toBeVisible();
  for (const rail of ["Email-first", "EURC", "Programmable", "Verifiable"])
    await expect(
      page.locator(".hiw-rail-node").filter({ hasText: rail }),
    ).toBeVisible();
  await expect(page.locator(".hiw-solana")).toContainText(
    "program-derived addresses (PDAs); NFTs are not required",
  );
  await expect(
    page.getByRole("heading", { name: "Be first to try MovX." }),
  ).toBeVisible();
  await expect(page.locator(".hiw-demo-status")).toHaveText(
    "Solana Devnet · Test EURC · No real funds",
  );
  const guide = page.locator(".how-it-works");
  await expect(guide).not.toContainText(/challenge/i);
  await expect(guide).not.toContainText(/reaction/i);

  const walletQuestion = page.getByText("Do I need a wallet?", { exact: true });
  await walletQuestion.focus();
  await page.keyboard.press("Enter");
  await expect(
    page.getByText(/A wallet enters only for a wallet-backed action/),
  ).toBeVisible();
  const realMoneyQuestion = page.getByText("Is this using real money?", {
    exact: true,
  });
  await realMoneyQuestion.focus();
  await page.keyboard.press("Enter");
  await expect(
    page.getByText(/demonstration does not move real funds/),
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
    .getByRole("link", { name: "Join the waitlist", exact: true })
    .click();
  await expect(page).toHaveURL(/\/coming-soon$/);
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
