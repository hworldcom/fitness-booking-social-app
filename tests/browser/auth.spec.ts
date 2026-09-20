import { test, expect } from "@playwright/test";

test("sign-in explains the wallet/session boundary without blocking public browsing", async ({
  page,
}, testInfo) => {
  let identityRequests = 0;
  await page.route("**/api/auth/identity", async (route) => {
    identityRequests += 1;
    await route.fulfill({ status: 500, body: "unexpected identity request" });
  });
  await page.goto("/sign-in");

  await expect(
    page.getByRole("heading", {
      name: "Sign in with your prepared Phantom wallet.",
    }),
  ).toBeVisible();
  await expect(page.getByText("Message only · No transaction")).toBeVisible();
  await expect(page.getByText("Three separate steps")).toBeVisible();
  await expect(
    page.getByText(
      "Sign in to RepX Club. This proves control of your wallet and does not authorize a transaction.",
    ),
  ).toBeVisible();
  await expect(
    page
      .getByText("Local authentication is not configured.")
      .or(page.getByText("RepX Club signed out.")),
  ).toBeVisible();
  await expect(
    page.getByRole("link", { name: "Get Phantom from the official site" }),
  ).toHaveAttribute("href", "https://phantom.com/download");

  await page.screenshot({
    path: testInfo.outputPath("phantom-sign-in.png"),
    fullPage: true,
  });

  await page
    .getByRole("link", { name: "Continue browsing without signing in" })
    .click();
  await expect(page).toHaveURL(/\/explore$/);
  await expect(
    page.getByRole("heading", { name: "Find your next move." }),
  ).toBeVisible();
  expect(identityRequests).toBe(0);
});

test("the global sign-in control is keyboard reachable", async ({ page }) => {
  await page.goto("/explore");
  const signIn = page.getByRole("link", { name: "Sign in", exact: true });
  await expect(signIn).toBeVisible();
  await signIn.focus();
  await expect(signIn).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/\/sign-in$/);
});
