import path from "node:path";
import { expect, test } from "@playwright/test";
import { getPortalE2EConfig, hasPortalCredentials } from "./support/env";
import { launchPortalProduct, signInToPortal, waitForReachShellReady } from "./support/portal";

const REACH_UPLOAD_FIXTURE = path.resolve("/Users/zylstra/Code/photovault/public/images/home/logo_1_bv.png");

test.describe("Reach media smoke", () => {
  test.skip(!hasPortalCredentials(), "Set E2E_PORTAL_EMAIL and E2E_PORTAL_PASSWORD to run Reach media smoke tests.");

  test("uploads an image into the Reach composer", async ({ page }) => {
    const config = getPortalE2EConfig();

    await signInToPortal(page);
    await launchPortalProduct(page, "New Post", config.reachURL);
    await waitForReachShellReady(page);

    await expect(page.getByText("Build one school update, then choose how it goes out.")).toBeVisible();

    const fileInput = page.locator('input[type="file"][accept="image/*"]').first();
    await fileInput.setInputFiles(REACH_UPLOAD_FIXTURE);

    await expect(page.locator("body")).not.toContainText("Failed to upload image.");
    await expect(page.getByText("Workspace image attached")).toBeVisible({ timeout: 60_000 });
    await expect(page.getByAltText("Selected post media")).toBeVisible({ timeout: 60_000 });
  });
});
