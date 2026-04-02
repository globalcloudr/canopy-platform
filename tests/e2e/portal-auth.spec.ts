import { test, expect } from "@playwright/test";
import { hasPortalCredentials } from "./support/env";
import { signInToPortal } from "./support/portal";

test.describe("Portal authentication smoke", () => {
  test.skip(!hasPortalCredentials(), "Set E2E_PORTAL_EMAIL and E2E_PORTAL_PASSWORD to run portal smoke tests.");

  test("signs in and loads the dashboard", async ({ page }) => {
    await signInToPortal(page);

    await expect(page.getByText("Launch into your products")).toBeVisible();
    await expect(page.getByText("Canopy Stories")).toBeVisible();
    await expect(page.getByText("PhotoVault by Canopy")).toBeVisible();
  });
});
