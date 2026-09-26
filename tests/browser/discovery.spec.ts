import { expect, test } from "@playwright/test";

test("public guide explains the complete focused membership story", async ({
  page,
}, testInfo) => {
  await page.goto("/explore");
  const help = page
    .locator("header")
    .getByRole("link", { name: "How it works", exact: true });
  await help.focus();
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/\/how-it-works$/);

  await expect(
    page.getByRole("heading", {
      name: "More places to train. One clear membership.",
    }),
  ).toBeVisible();
  for (const heading of [
    "Two plans. The same four-gym freedom.",
    "From choosing gyms to showing up.",
    "Your network extends beyond your four.",
    "Useful for members. Understandable for gyms.",
    "Usage informs a provisional allocation.",
    "Solana supports the demo rails.",
  ]) {
    await expect(
      page.getByRole("heading", { name: heading, exact: true }),
    ).toBeVisible();
  }
  const guide = page.locator(".how-it-works");
  await expect(guide).toContainText("Choose four core gyms");
  for (const content of [
    "€80",
    "10",
    "€150",
    "unlimited included check-ins",
    "One included check-in per venue-local day",
    "€15",
    "payment goes directly to the destination gym",
    "private unless you explicitly share",
    "not a finalized or claimable payout",
    "Solana Devnet",
    "No real funds",
  ]) {
    await expect(guide).toContainText(content);
  }
  await expect(guide).not.toContainText(
    /\b(passes|events|transferable|sponsorships|challenges|reactions)\b/i,
  );

  const gymSection = page.locator(".hiw-value-card.gyms");
  await expect(gymSection).toContainText("Staff-confirmed evidence");
  await expect(gymSection).toContainText("Direct payment");

  const headings = await guide.locator("h1, h2").allTextContents();
  expect(
    headings.indexOf("Two plans. The same four-gym freedom."),
  ).toBeLessThan(headings.indexOf("Solana supports the demo rails."));

  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true);
  await page.screenshot({
    path: testInfo.outputPath("how-it-works.png"),
    fullPage: true,
  });
  await page
    .getByRole("link", { name: "Join the waitlist", exact: true })
    .click();
  await expect(page).toHaveURL(/\/coming-soon$/);
});

test("public search indexes only illustrative gyms", async ({ page }) => {
  await page.goto("/search");
  await page
    .getByRole("textbox", { name: "Search the public catalogue", exact: true })
    .fill("Fabrik");
  await page.getByRole("button", { name: "Search", exact: true }).click();
  await expect(page.locator(".discovery-result")).toHaveCount(1);
  await expect(
    page.getByRole("heading", { name: "Gyms", exact: true }),
  ).toBeVisible();
  await expect(page.locator(".discovery-result")).toContainText(
    "Illustrative gym",
  );
  await page.getByRole("link", { name: /Fabrik Training/ }).click();
  await expect(page).toHaveURL(/\/explore\?q=Fabrik%20Training$/);

  await page.goto("/search?q=not-a-real-gym");
  await expect(
    page.getByRole("heading", { name: "No matches this time." }),
  ).toBeVisible();
  await page.getByRole("link", { name: "Clear search", exact: true }).click();
  await expect(
    page.getByRole("heading", { name: "A little inspiration" }),
  ).toBeVisible();
});

test("removed product routes return not found", async ({ page }) => {
  for (const path of [
    "/classes/muay-thai",
    "/classes/missing-session",
    "/events/run-and-coffee",
    "/events/new",
    "/challenges",
    "/challenges/show-up-club",
    "/challenges/new",
  ]) {
    const response = await page.goto(path);
    expect(response?.status(), path).toBe(404);
    await expect(
      page.getByRole("heading", { name: "A little off the beaten track." }),
    ).toBeVisible();
  }
});

test("retained public surfaces fit narrow screens without browser errors", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.setViewportSize({ width: 320, height: 780 });
  for (const path of [
    "/",
    "/explore",
    "/how-it-works",
    "/search?q=Fabrik",
    "/coming-soon",
  ]) {
    await page.goto(path);
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= window.innerWidth,
      ),
      path,
    ).toBe(true);
  }
  expect(errors).toEqual([]);
});
