import { test, expect } from "@playwright/test";

test("four surfaces render without browser errors or horizontal overflow", async ({
  page,
}, testInfo) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/");
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
  for (const label of ["Explore", "Challenges", "Profile", "Feed"]) {
    await nav.getByRole("link", { name: label, exact: true }).click();
    await expect(
      nav.getByRole("link", { name: label, exact: true }),
    ).toHaveAttribute("aria-current", "page");
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= window.innerWidth,
      ),
    ).toBe(true);
    if (label !== "Feed") {
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

test("search, activity filters, saved challenges and following persist", async ({
  page,
}) => {
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
  await page.goto("/challenges");
  await page.getByRole("button", { name: "Sponsored", exact: true }).click();
  await expect(page.locator(".challenge-card")).toHaveCount(1);
  await page
    .getByRole("button", { name: "Save The show-up club", exact: true })
    .click();
  await page.reload();
  await page.getByRole("button", { name: "Saved", exact: true }).click();
  await expect(page.locator(".challenge-card")).toHaveCount(1);
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

test("draft validation, sponsor mode, reload and delete work without funding", async ({
  page,
}, testInfo) => {
  await page.goto("/challenges/new");
  await page.getByRole("button", { name: "Save challenge draft" }).click();
  await expect(page.locator("#title")).toBeFocused();
  await expect(page.locator("#title-error")).toBeVisible();
  await page.getByLabel("Sponsored challenge", { exact: false }).check();
  await page.getByLabel("Challenge name").fill("The lunch break club");
  await page
    .getByLabel("What’s the challenge?")
    .fill("Meet at the studio for three friendly lunchtime sessions.");
  await page.getByLabel("Your sponsored prize").fill("10");
  await page.getByLabel("Ends", { exact: true }).fill("2026-09-21");
  await page.getByRole("button", { name: "Save challenge draft" }).click();
  await expect(page.locator("#end-error")).toBeVisible();
  await page.getByLabel("Ends", { exact: true }).fill("2026-09-29");
  await page.screenshot({
    path: testInfo.outputPath("create-challenge.png"),
    fullPage: true,
  });
  await page.getByRole("button", { name: "Save challenge draft" }).click();
  await expect(page).toHaveURL(/challenges\/draft-/);
  await expect(
    page.getByRole("heading", { name: "The lunch break club" }),
  ).toBeVisible();
  await expect(page.getByText("Saved locally · Not published")).toBeVisible();
  await page.reload();
  await expect(
    page.getByRole("heading", { name: "The lunch break club" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Delete draft", exact: true }).click();
  await page
    .getByRole("dialog")
    .getByRole("button", { name: "Delete draft", exact: true })
    .click();
  await expect(page).toHaveURL(/\/challenges$/);
  await page.getByRole("button", { name: "My drafts", exact: true }).click();
  await expect(
    page.getByRole("heading", { name: "Every club starts with an idea." }),
  ).toBeVisible();
});

test("class-pass and challenge previews never create reservations or funded state", async ({
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
  await page.goto("/challenges/before-coffee");
  await page.getByRole("button", { name: "Preview entry" }).click();
  await expect(page.getByRole("dialog")).toContainText(
    "You haven’t registered or paid.",
  );
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
    page.getByRole("link", { name: "Get Phantom from the official site" }),
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
  await page.goto("/challenges");
  await page
    .getByRole("button", { name: "Save The show-up club", exact: true })
    .click();
  await expect(
    page.getByRole("button", { name: "Unsave The show-up club", exact: true }),
  ).toBeVisible();
});
