import { test, expect } from "@playwright/test";

test("home discovery links preserve usable catalogue destinations", async ({
  page,
}, testInfo) => {
  await page.goto("/");
  await expect(page).toHaveTitle(/MovX Club/);
  await expect(page.locator("body")).not.toContainText("RepX Club");
  await expect(
    page.getByRole("heading", { name: /FIND YOUR PEOPLE.*MOVE TOGETHER/ }),
  ).toBeVisible();
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({
    path: testInfo.outputPath("club-home-viewport.png"),
  });
  await page.screenshot({
    path: testInfo.outputPath("club-home.png"),
    fullPage: true,
  });
  const explore = page
    .locator(".club-hero")
    .getByRole("link", { name: "Explore classes" });
  await explore.focus();
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/\/explore$/);
  await expect(page.getByRole("tab", { name: /Classes/ })).toHaveAttribute(
    "aria-selected",
    "true",
  );
  await page.goto("/");
  await page
    .locator(".club-hero")
    .getByRole("link", { name: "Find a challenge" })
    .click();
  await expect(page).toHaveURL(/\/challenges$/);
  await expect(page.locator(".challenge-card")).toHaveCount(3);
  for (const studio of ["Fabrik Training", "Kru Tiger"]) {
    await page.goto("/");
    await page.locator(".club-studio-card").filter({ hasText: studio }).click();
    await expect(page).toHaveURL(/view=studios&q=/);
    expect(new URL(page.url()).searchParams.get("q")).toBe(studio);
    await expect(page.getByRole("tab", { name: /Studios/ })).toHaveAttribute(
      "aria-selected",
      "true",
    );
    await expect(page.locator(".studio-card")).toHaveCount(1);
    await expect(page.locator(".studio-card")).toContainText(studio);
  }
  await page.goto("/");
  await page
    .locator(".club-event-card")
    .getByRole("link", { name: "View event" })
    .click();
  await expect(page).toHaveURL(/\/events\/run-and-coffee$/);
  await expect(
    page.getByRole("heading", { name: "Run & Coffee", exact: true }),
  ).toBeVisible();
});

test("club layout remains usable at narrow and intermediate widths", async ({
  page,
}, testInfo) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  for (const width of [320, 600, 820, 1100]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");
    await page.evaluate(() => document.fonts.ready);
    await expect(page.locator(".footer-tagline")).toBeVisible();
    await expect(
      page
        .getByRole("link", { name: "MovX Club home" })
        .filter({ visible: true }),
    ).toBeVisible();
    await expect(
      page.locator(".brand").filter({ visible: true }),
    ).toContainText("MovXClub");
    const contact = page.getByRole("link", { name: "hello@movx.club" });
    await expect(contact).toBeVisible();
    await expect(contact).toHaveAttribute("href", "mailto:hello@movx.club");
    await contact.focus();
    await expect(contact).toBeFocused();
    await expect(contact).toBeInViewport();
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    const button = page
      .locator(".club-hero")
      .getByRole("link", { name: "Explore classes" });
    await button.focus();
    await expect(button).toBeFocused();
    await expect(button).toBeInViewport();
    expect(
      await page.locator(".challenge-card-facts dd").evaluateAll((nodes) =>
        nodes.every((node) => {
          const card = node.closest(".challenge-card")!;
          return (
            node.getBoundingClientRect().right <=
            card.getBoundingClientRect().right
          );
        }),
      ),
    ).toBe(true);
    await page.locator(".club-studio-card").last().scrollIntoViewIfNeeded();
    await expect
      .poll(() =>
        page
          .locator(".club-studio-photo img")
          .evaluateAll((images) =>
            images.every(
              (image) =>
                (image as HTMLImageElement).complete &&
                (image as HTMLImageElement).naturalWidth > 0,
            ),
          ),
      )
      .toBe(true);
    await page.evaluate(() => scrollTo(0, 0));
    await page.screenshot({
      path: testInfo.outputPath(`club-${width}.png`),
      fullPage: true,
    });
  }
});

test("simplified navigation keeps destinations and nested selection without header search", async ({
  page,
}, testInfo) => {
  await page.goto("/");
  const nav = page.getByRole("navigation", {
    name:
      testInfo.project.name === "mobile"
        ? "Mobile navigation"
        : "Main navigation",
    exact: true,
  });
  for (const [label, route] of [
    ["Explore", "/explore"],
    ["Challenges", "/challenges"],
    ["Profile", "/profile"],
    ["Feed", "/"],
  ]) {
    const link = nav.getByRole("link", { name: label, exact: true });
    await link.focus();
    await page.keyboard.press("Enter");
    await expect(page).toHaveURL(new RegExp(`${route}$`));
    await expect(link).toHaveAttribute("aria-current", "page");
    await expect(
      page.locator(".topbar input, .topbar a[href='/search']"),
    ).toHaveCount(0);
  }
  await page.screenshot({ path: testInfo.outputPath("navigation.png") });
  await page.goto("/events/run-and-coffee");
  await expect(
    nav.getByRole("link", { name: "Explore", exact: true }),
  ).toHaveAttribute("aria-current", "page");
});
