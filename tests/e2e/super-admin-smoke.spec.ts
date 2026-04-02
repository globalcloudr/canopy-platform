import { expect, test } from "@playwright/test";
import { hasSuperAdminCredentials } from "./support/env";
import { signInToPortalAsSuperAdmin } from "./support/portal";

test.describe("Super-admin smoke", () => {
  test.skip(!hasSuperAdminCredentials(), "Set E2E_SUPER_ADMIN_EMAIL and E2E_SUPER_ADMIN_PASSWORD to run super-admin smoke tests.");

  test("loads provisioning for a platform operator", async ({ page }) => {
    await signInToPortalAsSuperAdmin(page);

    await page.goto("/app/provisioning");
    await page.waitForURL((url) => url.pathname === "/app/provisioning", { timeout: 60_000 });

    await expect(page.getByText("Workspace Provisioning")).toBeVisible();
    await expect(page.getByRole("button", { name: "Provision workspace" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Provisioning" })).toBeVisible();
  });
});
