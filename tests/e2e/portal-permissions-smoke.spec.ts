import { expect, test } from "@playwright/test";
import { hasPortalCredentials } from "./support/env";
import { signInToPortal } from "./support/portal";

test.describe("Portal permissions smoke", () => {
  test.skip(!hasPortalCredentials(), "Set E2E_PORTAL_EMAIL and E2E_PORTAL_PASSWORD to run portal permission smoke tests.");

  test("regular workspace users are redirected away from provisioning", async ({ page }) => {
    await signInToPortal(page);

    await expect(page.getByRole("link", { name: "Provisioning" })).toHaveCount(0);

    await page.goto("/app/provisioning");
    await page.waitForURL((url) => url.pathname === "/app", { timeout: 60_000 });

    await expect(page.getByRole("heading", { name: "Welcome to Canopy by Akkedis Digital" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Provisioning" })).toHaveCount(0);
  });
});
