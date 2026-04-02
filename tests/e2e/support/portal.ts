import { expect, type Page } from "@playwright/test";
import { getPortalE2EConfig } from "./env";

function matchesExpectedOrigin(actual: URL, expectedBaseURL: string) {
  const expected = new URL(expectedBaseURL);
  const expectedHostname = expected.hostname.replace(/^www\./i, "");
  const actualHostname = actual.hostname.replace(/^www\./i, "");
  const expectedPath = expected.pathname === "/" ? "" : expected.pathname;

  return (
    actual.protocol === expected.protocol &&
    actualHostname === expectedHostname &&
    (expectedPath ? actual.pathname.startsWith(expectedPath) : true)
  );
}

export async function signInToPortal(page: Page) {
  const config = getPortalE2EConfig();

  await page.goto("/sign-in");
  await page.getByLabel("Email address").fill(config.portalEmail);
  await page.getByLabel("Password").fill(config.portalPassword);
  await page.getByRole("button", { name: "Sign in" }).click();

  await page.waitForURL((url) => url.origin === new URL(config.baseURL).origin && url.pathname === "/app", {
    timeout: 60_000,
  });
  await expect(page.getByRole("heading", { name: "Welcome to Canopy by Akkedis Digital" })).toBeVisible();
}

export async function signInToPortalAs(page: Page, email: string, password: string) {
  const config = getPortalE2EConfig();

  await page.goto("/sign-in");
  await page.getByLabel("Email address").fill(email);
  await page.getByLabel("Password").fill(password);
  await page.getByRole("button", { name: "Sign in" }).click();

  await page.waitForURL((url) => url.origin === new URL(config.baseURL).origin && url.pathname === "/app", {
    timeout: 60_000,
  });
}

export async function signInToPortalAsSuperAdmin(page: Page) {
  const config = getPortalE2EConfig();

  if (!config.superAdminEmail || !config.superAdminPassword) {
    throw new Error("Missing E2E_SUPER_ADMIN_EMAIL or E2E_SUPER_ADMIN_PASSWORD.");
  }

  await signInToPortalAs(page, config.superAdminEmail, config.superAdminPassword);
  await expect(page.getByRole("heading", { name: "Platform Overview" })).toBeVisible();
}

export async function launchPortalProduct(page: Page, buttonName: string, expectedBaseURL: string) {
  const button = page.getByRole("link", { name: buttonName }).first();
  await expect(button).toBeVisible();
  await button.click();
  await page.waitForURL((url) => matchesExpectedOrigin(url, expectedBaseURL), { timeout: 60_000 });
}

export async function openStoriesSwitcher(page: Page) {
  const switcher = page.locator("button").filter({ hasText: /Canopy Stories/i }).first();
  await expect(switcher).toBeVisible();
  await switcher.click();
}

export async function openReachSwitcher(page: Page) {
  const switcher = page.locator("button").filter({ hasText: /Canopy Reach/i }).first();
  await expect(switcher).toBeVisible();
  await switcher.click();
}

export async function openPhotoVaultReturnControl(page: Page) {
  const control = page.getByRole("button", { name: /PhotoVault/i }).first();
  await expect(control).toBeVisible();
  await control.click();
}

export async function clickFirstVisibleMenuItem(page: Page, names: string[]) {
  for (const name of names) {
    const item = page.getByRole("menuitem", { name });
    if (await item.count()) {
      await item.first().click();
      return name;
    }
  }

  throw new Error(`None of the expected menu items were visible: ${names.join(", ")}`);
}

export async function waitForStoriesShellReady(page: Page) {
  await expect(page.locator("body")).toContainText("Canopy Stories");
  await expect(page.locator("body")).not.toContainText("Application error:");
  await expect(page.locator("button").filter({ hasText: /Loading\.\.\./i }).first()).toHaveCount(0, { timeout: 30_000 });
}

export async function waitForReachShellReady(page: Page) {
  await expect(page.locator("body")).toContainText("Canopy Reach");
  await expect(page.locator("body")).not.toContainText("Application error:");
  await expect(page.locator("button").filter({ hasText: /Loading\.\.\./i }).first()).toHaveCount(0, { timeout: 30_000 });
}

export async function waitForPhotoVaultReady(page: Page) {
  await expect(page.locator("body")).toContainText("PhotoVault");
  await expect(page.locator("body")).not.toContainText("Application error:");
  await expect(page.locator("body")).not.toContainText("No active organization selected");
}
