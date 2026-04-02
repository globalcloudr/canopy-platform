import { expect, type Page } from "@playwright/test";
import { getPortalE2EConfig } from "./env";

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

export async function launchPortalProduct(page: Page, buttonName: string, expectedBaseURL: string) {
  const button = page.getByRole("link", { name: buttonName }).first();
  await expect(button).toBeVisible();
  await button.click();
  await page.waitForURL((url) => url.toString().startsWith(expectedBaseURL), { timeout: 60_000 });
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
