import { expect, test } from "@playwright/test";
import { getPortalE2EConfig, hasPortalCredentials } from "./support/env";
import {
  expectPortalDashboard,
  openPhotoVaultReturnControl,
  openReachSwitcher,
  openStoriesSwitcher,
  signInToPortal,
  waitForPhotoVaultReady,
  waitForReachShellReady,
  waitForStoriesShellReady,
} from "./support/portal";

test.describe("Cross-product switch smoke", () => {
  test.skip(!hasPortalCredentials(), "Set E2E_PORTAL_EMAIL and E2E_PORTAL_PASSWORD to run cross-product smoke tests.");

  test("switches from Stories to PhotoVault and returns to Portal", async ({ page }) => {
    const config = getPortalE2EConfig();

    await signInToPortal(page);
    await page.getByRole("link", { name: "View Stories" }).first().click();
    await page.waitForURL((url) => url.toString().startsWith(config.storiesURL), { timeout: 60_000 });
    await waitForStoriesShellReady(page);

    await openStoriesSwitcher(page);
    await page.getByRole("menuitem", { name: "PhotoVault" }).click();

    await page.waitForURL((url) => url.hostname.includes("photovault"), { timeout: 60_000 });
    await waitForPhotoVaultReady(page);

    await openPhotoVaultReturnControl(page);
    await expectPortalDashboard(page);
  });

  test("switches from Reach to PhotoVault and returns to Portal", async ({ page }) => {
    const config = getPortalE2EConfig();

    await signInToPortal(page);
    await page.getByRole("link", { name: "New Post" }).first().click();
    await page.waitForURL((url) => url.toString().startsWith(config.reachURL), { timeout: 60_000 });
    await waitForReachShellReady(page);

    await openReachSwitcher(page);
    await page.getByRole("menuitem", { name: "PhotoVault" }).click();

    await page.waitForURL((url) => url.hostname.includes("photovault"), { timeout: 60_000 });
    await waitForPhotoVaultReady(page);

    await openPhotoVaultReturnControl(page);
    await expectPortalDashboard(page);
  });
});
