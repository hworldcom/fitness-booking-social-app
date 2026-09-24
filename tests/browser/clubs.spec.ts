import { expect, test } from "@playwright/test";

test("club value proposition leads to the bounded club access page", async ({
  page,
}, testInfo) => {
  await page.goto("/how-it-works");
  const clubSection = page.locator("#for-clubs");
  await expect(
    clubSection.getByRole("heading", {
      name: "Grow without another transaction tax.",
    }),
  ).toBeVisible();
  await expect(clubSection).toContainText(
    "Predictable pricing without hidden MovX surcharges",
  );
  await expect(clubSection).toContainText("sponsored events");
  await expect(page.locator(".hiw-fee-note")).toContainText(
    "payment, network and account costs",
  );
  await page.screenshot({
    path: testInfo.outputPath("club-value-proposition.png"),
    fullPage: true,
  });

  const manageClub = clubSection.getByRole("link", {
    name: "Manage a fitness business",
    exact: true,
  });
  await manageClub.focus();
  await expect(manageClub).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/\/clubs\/sign-in$/);
  await expect(
    page.getByRole("heading", { name: /Manage your club/ }),
  ).toBeVisible();
  await expect(page.getByLabel("Email address")).toHaveCount(0);
  await expect(
    page.getByText("Personal email identity", { exact: true }),
  ).toBeVisible();
  await expect(
    page.getByText("Server-derived club access", { exact: true }),
  ).toBeVisible();
  await expect(
    page.getByText("Separate club wallet", { exact: true }),
  ).toBeVisible();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true);
  await page.screenshot({
    path: testInfo.outputPath("club-access-entry.png"),
    fullPage: true,
  });
});

test("signed-out club access delegates to the canonical email sign-in", async ({
  page,
}) => {
  await page.goto("/clubs/sign-in");
  const signIn = page.getByRole("link", {
    name: "Sign in with email",
    exact: true,
  });

  if ((await signIn.count()) === 0) {
    await expect(
      page.getByRole("heading", {
        name: "Club management needs account-backed mode.",
      }),
    ).toBeVisible();
    await expect(
      page.getByText(/does not assign a demonstration club/),
    ).toBeVisible();
    return;
  }

  await expect(signIn).toHaveAttribute(
    "href",
    "/sign-in?returnTo=%2Fclubs%2Fsign-in",
  );
  await signIn.focus();
  await expect(signIn).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/\/sign-in\?returnTo=%2Fclubs%2Fsign-in$/);
  const destination = new URL(page.url());
  expect(destination.pathname).toBe("/sign-in");
  expect(destination.searchParams.get("returnTo")).toBe("/clubs/sign-in");
  await expect(page.getByLabel("Email address")).toHaveCount(1);
});
