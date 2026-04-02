import { chromium } from "@playwright/test";

function requiredEnv(name) {
  const value = process.env[name]?.trim();
  if (!value) {
    throw new Error(`Missing required env var: ${name}`);
  }
  return value;
}

const portalUrl = process.env.PLAYWRIGHT_BASE_URL?.trim() || "https://usecanopy.school";
const portalEmail = requiredEnv("E2E_PORTAL_EMAIL");
const portalPassword = requiredEnv("E2E_PORTAL_PASSWORD");
const storiesUrl = process.env.E2E_STORIES_URL?.trim() || "https://canopy-stories.vercel.app";

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();

page.on("console", async (message) => {
  if (message.type() === "error" || message.type() === "warning") {
    console.log(`[console.${message.type()}] ${message.text()}`);
  }
});

page.on("response", async (response) => {
  const url = response.url();
  if (url.includes("/auth/portal-return") || url.includes("/api/app-session")) {
    console.log("[response]", response.status(), response.request().method(), url);
  }
});

try {
  await page.goto(`${portalUrl}/sign-in`, { waitUntil: "domcontentloaded" });
  await page.getByLabel("Email address").fill(portalEmail);
  await page.getByLabel("Password").fill(portalPassword);
  await page.getByRole("button", { name: "Sign in" }).click();
  await page.waitForURL(/\/app(?:\?.*)?$/, { timeout: 60_000 });

  await page.getByRole("link", { name: "View Stories" }).first().click();
  await page.waitForURL((url) => url.toString().startsWith(storiesUrl), { timeout: 60_000 });
  await page.waitForFunction(() => !document.body.innerText.includes("Application error:"));
  await page.waitForFunction(() => !document.body.innerText.includes("Loading..."), undefined, { timeout: 30_000 });

  const switcher = page.locator("button").filter({ hasText: /Canopy Stories/i }).first();
  await switcher.click();

  const hasPortalMenuItem = await page.getByRole("menuitem", { name: "Canopy Portal" }).count();
  console.log("[has-portal-menu-item]", hasPortalMenuItem);

  const sessionState = await page.evaluate(async () => {
    const localStorageKeys = Object.keys(localStorage);
    return { localStorageKeys };
  });
  console.log("[state-before-return]", JSON.stringify(sessionState, null, 2));

  await page.getByRole("menuitem", { name: "Canopy Portal" }).click();
  await page.waitForTimeout(5000);

  console.log("[final-url]", page.url());
  console.log("[body-text]", (await page.locator("body").innerText()).slice(0, 800));
} finally {
  await browser.close();
}
