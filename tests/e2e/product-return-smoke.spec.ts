import { expect, test } from "@playwright/test";
import { getPortalE2EConfig, hasPortalCredentials } from "./support/env";
import {
  launchPortalProduct,
  openPhotoVaultReturnControl,
  openReachSwitcher,
  signInToPortal,
  waitForPhotoVaultReady,
  waitForReachShellReady,
} from "./support/portal";

async function expectPortalDashboard(page: Parameters<typeof signInToPortal>[0]) {
  const config = getPortalE2EConfig();

  await page.waitForURL(
    (url) =>
      url.origin === new URL(config.expectedPortalReturnURL).origin &&
      url.pathname === "/app" &&
      (
        !config.workspaceSlug ||
        !url.searchParams.has("workspace") ||
        url.searchParams.get("workspace") === config.workspaceSlug
      ),
    { timeout: 60_000 }
  );

  await expect(page.getByRole("heading", { name: "Welcome to Canopy by Akkedis Digital" })).toBeVisible();
}

test.describe("Product return smoke", () => {
  test.skip(!hasPortalCredentials(), "Set E2E_PORTAL_EMAIL and E2E_PORTAL_PASSWORD to run product return smoke tests.");

  test("launches PhotoVault from Portal and returns to Portal", async ({ page }) => {
    const config = getPortalE2EConfig();

    await signInToPortal(page);
    await launchPortalProduct(page, "View PhotoVault", config.photovaultURL);
    await waitForPhotoVaultReady(page);

    await openPhotoVaultReturnControl(page);
    await expectPortalDashboard(page);
  });

  test("launches Reach from Portal and returns to Portal", async ({ page }) => {
    const config = getPortalE2EConfig();

    await signInToPortal(page);
    await launchPortalProduct(page, "View Reach", config.reachURL);
    await waitForReachShellReady(page);

    await openReachSwitcher(page);
    await page.getByRole("menuitem", { name: "Canopy Portal" }).click();

    await expectPortalDashboard(page);
  });
});
