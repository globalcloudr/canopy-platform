import path from "node:path";
import { expect, test } from "@playwright/test";
import { getPortalE2EConfig, hasPortalCredentials } from "./support/env";
import { launchPortalProduct, signInToPortal, waitForPhotoVaultReady } from "./support/portal";

const PHOTOVAULT_UPLOAD_FIXTURE = path.resolve("/Users/zylstra/Code/photovault/public/images/home/logo_1_bv.png");

test.describe("PhotoVault media smoke", () => {
  test.skip(!hasPortalCredentials(), "Set E2E_PORTAL_EMAIL and E2E_PORTAL_PASSWORD to run PhotoVault media smoke tests.");

  test("creates an album and uploads one image", async ({ page }) => {
    const config = getPortalE2EConfig();
    const albumName = `Playwright Upload ${Date.now()}`;

    await signInToPortal(page);
    await launchPortalProduct(page, "View Photos", config.photovaultURL);
    await waitForPhotoVaultReady(page);

    await page.getByRole("link", { name: "New album" }).click();
    await page.waitForURL((url) => url.hostname.includes("photovault") && url.pathname === "/albums/new", { timeout: 60_000 });

    await page.getByPlaceholder("e.g., Spring Graduation").fill(albumName);
    await page.getByPlaceholder("Event Date").click();
    await page.locator('input[type="date"]').fill("2026-04-02");
    await expect(page.locator("select").nth(1)).toContainText("AWD", { timeout: 60_000 });
    await page.getByRole("button", { name: "Create album" }).click();

    await page.waitForURL((url) => url.hostname.includes("photovault") && url.pathname === "/albums", { timeout: 60_000 });
    await page.getByRole("link", { name: `Open ${albumName}` }).first().click();

    await page.waitForURL((url) => url.hostname.includes("photovault") && /^\/albums\/[^/]+$/.test(url.pathname), { timeout: 60_000 });
    await expect(page.getByRole("heading", { name: "Photos", exact: true })).toBeVisible();
    await expect(page.locator("body")).not.toContainText("Loading photos...");

    const fileInput = page.locator('input[type="file"][accept="image/*"]').first();
    await fileInput.setInputFiles(PHOTOVAULT_UPLOAD_FIXTURE);

    await expect(page.locator("body")).not.toContainText("Upload failed:");
    await expect(page.locator("body")).toContainText("Uploaded.", { timeout: 60_000 });
    await expect(page.locator("body")).toContainText("Total photos: 1", { timeout: 60_000 });
    await expect(page.locator("body")).not.toContainText("No photos uploaded yet");
  });
});
