import { test } from "@playwright/test";
import { getPortalE2EConfig, hasPortalCredentials } from "./support/env";
import {
  expectPortalDashboard,
  launchPortalProduct,
  openPhotoVaultReturnControl,
  openReachSwitcher,
  signInToPortal,
  waitForPhotoVaultReady,
  waitForReachShellReady,
} from "./support/portal";

test.describe("Product return smoke", () => {
  test.skip(!hasPortalCredentials(), "Set E2E_PORTAL_EMAIL and E2E_PORTAL_PASSWORD to run product return smoke tests.");

  test("launches PhotoVault from Portal and returns to Portal", async ({ page }) => {
    const config = getPortalE2EConfig();

    await signInToPortal(page);
    await launchPortalProduct(page, "View Photos", config.photovaultURL);
    await waitForPhotoVaultReady(page);

    await openPhotoVaultReturnControl(page);
    await expectPortalDashboard(page);
  });

  test("launches Reach from Portal and returns to Portal", async ({ page }) => {
    const config = getPortalE2EConfig();

    await signInToPortal(page);
    await launchPortalProduct(page, "New Post", config.reachURL);
    await waitForReachShellReady(page);

    await openReachSwitcher(page);
    await page.getByRole("menuitem", { name: "Canopy Portal" }).click();

    await expectPortalDashboard(page);
  });
});
