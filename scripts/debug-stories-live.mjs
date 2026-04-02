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
    const args = await Promise.all(
      message.args().map(async (arg) => {
        try {
          return await arg.jsonValue();
        } catch {
          return await arg.evaluate((value) => String(value));
        }
      })
    );
    console.log(`[console.${message.type()}] ${message.text()}`);
    if (args.length > 0) {
      console.log("[console.args]", JSON.stringify(args, null, 2));
    }
  }
});

page.on("pageerror", (error) => {
  console.log("[pageerror]", error.name, error.message);
  console.log(error.stack ?? "(no stack)");
});

page.on("requestfailed", (request) => {
  console.log("[requestfailed]", request.method(), request.url(), request.failure()?.errorText ?? "unknown");
});

page.on("response", async (response) => {
  if (response.status() < 400) {
    return;
  }

  const url = response.url();
  console.log("[response]", response.status(), response.request().method(), url);

  if (url.includes("/api/launcher-products") || url.includes("/api/app-session") || url.includes("/api/auth/exchange-handoff")) {
    try {
      const text = await response.text();
      console.log("[response.body]", text);
    } catch {
      console.log("[response.body]", "(unavailable)");
    }
  }
});

try {
  await page.goto(`${portalUrl}/sign-in`, { waitUntil: "domcontentloaded" });
  await page.getByLabel("Email address").fill(portalEmail);
  await page.getByLabel("Password").fill(portalPassword);
  await page.getByRole("button", { name: "Sign in" }).click();
  await page.waitForURL(/\/app(?:\?.*)?$/, { timeout: 60_000 });

  const storiesButton = page.getByRole("link", { name: "View Stories" }).first();
  await storiesButton.click();
  await page.waitForURL((url) => url.toString().startsWith(storiesUrl), { timeout: 60_000 });

  await page.waitForTimeout(10_000);
  try {
    const launcherPayload = await page.evaluate(async () => {
      const tokenKeyCandidates = Object.keys(localStorage);
      return {
        localStorageKeys: tokenKeyCandidates,
      };
    });
    console.log("[page.state]", JSON.stringify(launcherPayload, null, 2));
  } catch {
    // ignore evaluation errors on crash pages
  }
  console.log("[final-url]", page.url());
  console.log("[body-text]", (await page.locator("body").innerText()).slice(0, 1200));
} finally {
  await browser.close();
}
