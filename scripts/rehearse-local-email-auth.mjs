import assert from "node:assert/strict";
import { chromium } from "@playwright/test";

const siteUrl = process.env.AUTH_TEST_SITE_URL ?? "http://localhost:3100";
const mailboxUrl =
  process.env.AUTH_TEST_MAILPIT_URL ?? "http://127.0.0.1:55324";
const nonce = Date.now();

async function emailCodeFor(email) {
  for (let attempt = 0; attempt < 30; attempt += 1) {
    const response = await fetch(`${mailboxUrl}/api/v1/messages`);
    if (!response.ok) throw new Error("The local captured mailbox is offline.");
    const mailbox = await response.json();
    const message = mailbox.messages?.find((candidate) =>
      candidate.To?.some((recipient) => recipient.Address === email),
    );
    if (message) {
      assert.equal(message.Subject, "Your MovX Club sign-in code");
      assert.match(message.Snippet ?? "", /MovX Club/);
    }
    const code = message?.Snippet?.match(/\b\d{6}\b/)?.[0];
    if (code) return code;
    await new Promise((resolve) => setTimeout(resolve, 500));
  }
  throw new Error("The local OTP email did not arrive in time.");
}

async function submitForm(page) {
  await page.locator("form.auth-form").evaluate((form) => form.requestSubmit());
}

async function requestAndVerify(
  page,
  email,
  { testInvalidCode = false, replayedCode = null } = {},
) {
  await page.goto(`${siteUrl}/sign-in`, { waitUntil: "domcontentloaded" });
  await page.getByLabel("Email address").fill(email);
  await submitForm(page);
  await page.getByText("Check your email.").waitFor({ timeout: 60_000 });
  const code = await emailCodeFor(email);

  if (testInvalidCode) {
    await page.getByLabel("Six-digit code").fill("000000");
    await submitForm(page);
    await page.getByText(/invalid or expired/i).waitFor();
  }

  if (replayedCode) {
    await page.getByLabel("Six-digit code").fill(replayedCode);
    await submitForm(page);
    await page.getByText(/invalid or expired/i).waitFor();
  }

  await page.getByLabel("Six-digit code").fill(code);
  await submitForm(page);
  await page
    .getByText(/Email verified|Signed in as/)
    .first()
    .waitFor({ timeout: 20_000 });
  return code;
}

async function completeProfile(page, displayName) {
  await page.getByLabel("Display name").fill(displayName);
  await submitForm(page);
  await page
    .getByText(`Signed in as ${displayName}.`)
    .waitFor({ timeout: 20_000 });
  const response = await page.request.get(`${siteUrl}/api/auth/actor`);
  assert.equal(response.status(), 200);
  const actor = await response.json();
  assert.equal(actor.status, "authorized");
  assert.equal(actor.profile.displayName, displayName);
  assert.equal(actor.role, "member");
  assert.equal("wallet" in actor, false);
  return actor;
}

async function signOut(page) {
  await page.getByRole("button", { name: "Sign out on this device" }).click();
  await page.getByLabel("Email address").waitFor();
  const response = await page.request.get(`${siteUrl}/api/auth/actor`);
  assert.equal(response.status(), 401);
  assert.deepEqual(await response.json(), { status: "signed-out" });
}

const browser = await chromium.launch({ channel: "chrome" });
try {
  const firstContext = await browser.newContext({
    viewport: { width: 1440, height: 1040 },
  });
  const firstPage = await firstContext.newPage();
  const firstErrors = [];
  firstPage.on("pageerror", (error) => firstErrors.push(error.message));
  const firstEmail = `dev0046-anna-${nonce}@example.com`;

  const firstCode = await requestAndVerify(firstPage, firstEmail, {
    testInvalidCode: true,
  });
  const firstActor = await completeProfile(firstPage, "Anna Klein");
  await signOut(firstPage);

  const secondContext = await browser.newContext({
    viewport: { width: 393, height: 852 },
    isMobile: true,
    hasTouch: true,
  });
  const secondPage = await secondContext.newPage();
  const secondErrors = [];
  secondPage.on("pageerror", (error) => secondErrors.push(error.message));
  const secondEmail = `dev0046-daniel-${nonce}@example.com`;

  await requestAndVerify(secondPage, secondEmail);
  const secondActor = await completeProfile(secondPage, "Daniel Park");
  assert.notEqual(firstActor.profile.slug, secondActor.profile.slug);
  assert.equal(
    await secondPage.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
    true,
  );

  await requestAndVerify(firstPage, firstEmail, { replayedCode: firstCode });
  await firstPage
    .getByText("Signed in as Anna Klein.")
    .waitFor({ timeout: 20_000 });
  assert.equal(await firstPage.getByLabel("Display name").count(), 0);

  assert.deepEqual(firstErrors, []);
  assert.deepEqual(secondErrors, []);
  console.log(
    "Email OTP rehearsal passed for two new accounts, one returning account, invalid/replayed-code recovery, profile isolation and sign-out.",
  );
} finally {
  await browser.close();
}
