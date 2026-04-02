import { test, expect } from "@playwright/test";
import { getPortalE2EConfig, hasPortalCredentials } from "./support/env";
import { clickFirstVisibleMenuItem, launchPortalProduct, openReachSwitcher, openStoriesSwitcher, signInToPortal } from "./support/portal";

test.describe("Cross-app launcher smoke", () => {
  test.skip(!hasPortalCredentials(), "Set E2E_PORTAL_EMAIL and E2E_PORTAL_PASSWORD to run cross-app smoke tests.");

  test("launches Stories, switches to another available app, then returns to Portal", async ({ page }) => {
    const config = getPortalE2EConfig();

    await signInToPortal(page);
    await launchPortalProduct(page, "View Stories", config.storiesURL);

    await expect(page.locator("body")).toContainText("Canopy Stories");

    await openStoriesSwitcher(page);
    const selectedProduct = await clickFirstVisibleMenuItem(page, ["Canopy Reach", "PhotoVault"]);

    if (selectedProduct === "Canopy Reach") {
      await page.waitForURL((url) => url.toString().startsWith(config.reachURL), { timeout: 60_000 });
      await expect(page.locator("body")).toContainText("Canopy Reach");

      await openReachSwitcher(page);
      await page.getByRole("menuitem", { name: "Canopy Portal" }).click();
    } else {
      await page.waitForURL((url) => url.hostname.includes("photovault"), { timeout: 60_000 });
      await expect(page.locator("body")).toContainText("PhotoVault");

      await page.getByRole("button", { name: /Open account menu/i }).click();
      await page.getByRole("menuitem", { name: "Canopy Portal" }).click();
    }

    await page.waitForURL(
      (url) =>
        url.origin === new URL(config.baseURL).origin &&
        url.pathname === "/app" &&
        (config.workspaceSlug ? url.searchParams.get("workspace") === config.workspaceSlug : true),
      { timeout: 60_000 }
    );

    await expect(page.getByRole("heading", { name: "Welcome to Canopy by Akkedis Digital" })).toBeVisible();
  });
});
