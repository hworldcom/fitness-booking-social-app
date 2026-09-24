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
    "This browser-local interaction check requires preview mode.",
  );
}

test("four surfaces render without browser errors or horizontal overflow", async ({
  page,
}, testInfo) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/");
  const configuredGuest =
    (await page.request.get("/api/auth/actor")).status() === 401;
  await expect(
    page.getByRole("heading", { name: /FIND YOUR PEOPLE.*MOVE TOGETHER/ }),
  ).toBeVisible();
  await page.screenshot({
    path: testInfo.outputPath("feed.png"),
    fullPage: true,
  });
  const nav = page.getByRole("navigation", {
    name:
      testInfo.project.name === "mobile"
        ? "Mobile navigation"
        : "Main navigation",
    exact: true,
  });
  for (const [label, route] of [
    ["Explore", "/explore"],
    ["My Access", "/my-access"],
    ["Profile", "/profile"],
    ["Home", "/"],
  ]) {
    await nav.getByRole("link", { name: label, exact: true }).click();
    const privateGuestRoute =
      configuredGuest && ["My Access", "Profile"].includes(label);
    await expect(page).toHaveURL((url) =>
      privateGuestRoute
        ? url.pathname === "/sign-in" &&
          url.searchParams.get("returnTo") === route
        : url.pathname === route,
    );
    if (!privateGuestRoute) {
      await expect(
        nav.getByRole("link", { name: label, exact: true }),
      ).toHaveAttribute("aria-current", "page");
    }
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= window.innerWidth,
      ),
    ).toBe(true);
    if (label !== "Home") {
      await page.screenshot({
        path: testInfo.outputPath(`${label.toLowerCase()}.png`),
        fullPage: true,
      });
    }
  }
  await page.goto("/classes/missing-session");
  await expect(
    page.getByRole("heading", { name: "A little off the beaten track." }),
  ).toBeVisible();
  expect(errors).toEqual([]);
});

test("search, activity filters and following persist", async ({ page }) => {
  await requirePreviewMode(page);
  await page.goto("/explore?q=Fabrik");
  await expect(page.locator(".class-card")).toHaveCount(1);
  await expect(
    page.getByRole("heading", { name: "Strength, together" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Clear search" }).click();
  await expect(page.locator(".class-card")).toHaveCount(3);
  const activityFilter = page.getByRole("combobox", {
    name: "Activities",
    exact: true,
  });
  await activityFilter.selectOption("Muay Thai");
  await expect(page.locator(".class-card")).toHaveCount(1);
  await expect(
    page.getByRole("heading", { name: "Muay Thai fundamentals" }),
  ).toBeVisible();
  await activityFilter.selectOption("Running");
  await expect(
    page.getByRole("heading", { name: "A little change of pace?" }),
  ).toBeVisible();
  await page.goto("/users/max");
  await expect(page.getByText("Available test EURC")).toHaveCount(0);
  await page.getByRole("button", { name: "Follow", exact: true }).click();
  await page.reload();
  await expect(
    page.getByRole("button", { name: "Following", exact: true }),
  ).toBeVisible();
});

test("Explore separates class dates/times from studio activity and links to classes", async ({
  page,
}, testInfo) => {
  await page.goto("/explore");
  const classesTab = page.getByRole("tab", { name: "Classes", exact: true });
  const studiosTab = page.getByRole("tab", { name: "Studios", exact: true });
  await expect(classesTab).toHaveAttribute("aria-selected", "true");
  await page
    .getByRole("tabpanel")
    .getByLabel("Date", { exact: true })
    .fill("2026-09-27");
  await page
    .getByRole("combobox", { name: "Time", exact: true })
    .selectOption("morning");
  await expect(page.locator(".class-card")).toHaveCount(1);
  await expect(
    page.getByRole("heading", { name: "Sunday reset flow" }),
  ).toBeVisible();
  await page
    .getByRole("combobox", { name: "Time", exact: true })
    .selectOption("evening");
  await expect(
    page.getByRole("heading", { name: "A little change of pace?" }),
  ).toBeVisible();
  await page.screenshot({
    path: testInfo.outputPath("empty-classes.png"),
    fullPage: true,
  });
  await classesTab.focus();
  await page.keyboard.press("ArrowRight");
  await expect(
    page.getByRole("tab", { name: "Events", exact: true }),
  ).toBeFocused();
  await page.keyboard.press("ArrowRight");
  await expect(studiosTab).toHaveAttribute("aria-selected", "true");
  await expect(studiosTab).toBeFocused();
  await expect(
    page.getByRole("tabpanel", { name: "Studios" }).getByRole("combobox"),
  ).toHaveCount(1);
  await expect(page.locator("#class-date")).toBeHidden();
  await expect(page.locator("#class-time")).toBeHidden();
  await expect(page.locator(".studio-card")).toHaveCount(3);
  const studioActivity = page.getByRole("combobox", {
    name: "Activities",
    exact: true,
  });
  await studioActivity.focus();
  await page.keyboard.press("m");
  await page.keyboard.press("Tab");
  await expect(studioActivity).toHaveValue("Muay Thai");
  await expect(page.locator(".studio-card")).toHaveCount(1);
  await studioActivity.selectOption("Strength");
  await expect(
    page.getByRole("heading", { name: "Fabrik Training", exact: true }),
  ).toBeVisible();
  await studiosTab.focus();
  await page.keyboard.press("Home");
  await expect(classesTab).toBeFocused();
  await expect(
    page.getByRole("tabpanel").getByLabel("Date", { exact: true }),
  ).toHaveValue("2026-09-27");
  await expect(
    page.getByRole("combobox", { name: "Time", exact: true }),
  ).toHaveValue("evening");
  await page.getByRole("button", { name: "Show all classes" }).click();
  await expect(page.locator(".class-card")).toHaveCount(3);
  await classesTab.focus();
  await page.keyboard.press("End");
  await expect(
    page.getByRole("combobox", { name: "Activities", exact: true }),
  ).toHaveValue("Strength");
  await page
    .getByRole("combobox", { name: "Activities", exact: true })
    .selectOption("Running");
  await expect(
    page.getByRole("heading", { name: "Your next space is out there." }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Show all studios" }).click();
  await expect(page.locator(".studio-card")).toHaveCount(3);
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  await page.screenshot({
    path: testInfo.outputPath("studios.png"),
    fullPage: true,
  });
  const openStudio = page.getByRole("button", {
    name: "View Kru Tiger",
    exact: true,
  });
  await openStudio.click();
  const dialog = page.getByRole("dialog", { name: "Kru Tiger", exact: true });
  await expect(dialog).toContainText("Kreuzberg, Berlin");
  await expect(dialog).toContainText("Kru Sam");
  await page.screenshot({ path: testInfo.outputPath("studio-details.png") });
  await page.keyboard.press("Escape");
  await expect(openStudio).toBeFocused();
  await page.keyboard.press("Enter");
  await dialog.getByRole("link", { name: /Muay Thai fundamentals/ }).click();
  await expect(page).toHaveURL(/\/classes\/muay-thai$/);
  await expect(
    page.getByRole("button", { name: "Preview checkout" }),
  ).toBeVisible();
});

test("class-pass previews never create reservations or paid access", async ({
  page,
}) => {
  await page.goto("/classes/muay-thai");
  const before = await page.evaluate(() =>
    localStorage.getItem("repx-club-preview-v1"),
  );
  await page.getByRole("button", { name: "Preview checkout" }).click();
  await expect(page.getByRole("dialog")).toContainText(
    "Checkout isn’t connected yet.",
  );
  await page.keyboard.press("Escape");
  expect(
    await page.evaluate(() => localStorage.getItem("repx-club-preview-v1")),
  ).toEqual(before);
});

test("every class uses the same class-pass checkout preview", async ({
  page,
}) => {
  for (const classId of ["muay-thai", "strength", "sunday-flow"]) {
    await page.goto(`/classes/${classId}`);
    await expect(
      page.getByRole("button", { name: "Preview checkout" }),
    ).toBeVisible();
    await expect(page.getByText("test EURC / one class")).toBeVisible();
    await expect(page.getByText(/membership/i)).toHaveCount(0);
  }
});

test("keyboard dialog focus and blocked/corrupt storage recover gracefully", async ({
  page,
  context,
}) => {
  await page.goto("/");
  await page.keyboard.press("Tab");
  await expect(
    page.getByRole("link", { name: "Skip to content" }),
  ).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page.locator("#main-content")).toBeFocused();
  const wallet = page.getByRole("button", { name: "Connect Phantom wallet" });
  await expect(wallet).toBeEnabled();
  await wallet.focus();
  await page.keyboard.press("Enter");
  await expect(
    page.getByRole("dialog", { name: "Your club. Your wallet." }),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Close dialog" }),
  ).toBeFocused();
  await page.keyboard.press("Shift+Tab");
  await expect(
    page.getByRole("link", { name: "Sign in with email" }),
  ).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(wallet).toBeFocused();
  await page.evaluate(() =>
    localStorage.setItem("repx-club-preview-v1", "corrupt"),
  );
  await page.reload();
  await expect(
    page.getByRole("heading", { name: /FIND YOUR PEOPLE.*MOVE TOGETHER/ }),
  ).toBeVisible();
  await context.addInitScript(() => {
    Object.defineProperty(window, "localStorage", {
      get() {
        throw new DOMException("Blocked", "SecurityError");
      },
    });
  });
  await page.reload();
  await expect(page.getByRole("status")).toContainText(
    "Browser storage is unavailable",
  );
  await page.goto("/explore");
  await expect(
    page.getByRole("heading", { name: "Find your next move." }),
  ).toBeVisible();
});
