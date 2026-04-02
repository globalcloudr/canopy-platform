import { readFile, writeFile } from "node:fs/promises";
import { spawn } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, "..");
const portalNextEnvPath = path.join(repoRoot, "apps/portal/next-env.d.ts");

const originalNextEnv = await readFile(portalNextEnvPath, "utf8");
const playwrightArgs = process.argv.slice(2);

const child = spawn("npx", ["playwright", ...playwrightArgs], {
  cwd: repoRoot,
  env: process.env,
  stdio: "inherit",
});

const exitCode = await new Promise((resolve, reject) => {
  child.on("error", reject);
  child.on("close", resolve);
});

const currentNextEnv = await readFile(portalNextEnvPath, "utf8");
if (currentNextEnv !== originalNextEnv) {
  await writeFile(portalNextEnvPath, originalNextEnv, "utf8");
}

process.exit(exitCode ?? 1);
