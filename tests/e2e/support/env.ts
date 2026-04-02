export type PortalE2EConfig = {
  baseURL: string;
  expectedPortalReturnURL: string;
  portalEmail: string;
  portalPassword: string;
  superAdminEmail: string | null;
  superAdminPassword: string | null;
  workspaceSlug: string | null;
  storiesURL: string;
  reachURL: string;
  photovaultURL: string;
};

function requiredEnv(name: string) {
  const value = process.env[name]?.trim();
  if (!value) {
    throw new Error(`Missing required E2E environment variable: ${name}`);
  }
  return value;
}

export function hasPortalCredentials() {
  return Boolean(process.env.E2E_PORTAL_EMAIL?.trim() && process.env.E2E_PORTAL_PASSWORD?.trim());
}

export function hasSuperAdminCredentials() {
  return Boolean(process.env.E2E_SUPER_ADMIN_EMAIL?.trim() && process.env.E2E_SUPER_ADMIN_PASSWORD?.trim());
}

export function getPortalE2EConfig(): PortalE2EConfig {
  return {
    baseURL: process.env.PLAYWRIGHT_BASE_URL?.trim() || "http://127.0.0.1:3100",
    expectedPortalReturnURL:
      process.env.E2E_EXPECTED_PORTAL_RETURN_URL?.trim() ||
      process.env.PLAYWRIGHT_BASE_URL?.trim() ||
      "http://127.0.0.1:3100",
    portalEmail: requiredEnv("E2E_PORTAL_EMAIL"),
    portalPassword: requiredEnv("E2E_PORTAL_PASSWORD"),
    superAdminEmail: process.env.E2E_SUPER_ADMIN_EMAIL?.trim() || null,
    superAdminPassword: process.env.E2E_SUPER_ADMIN_PASSWORD?.trim() || null,
    workspaceSlug: process.env.E2E_WORKSPACE_SLUG?.trim() || null,
    storiesURL: process.env.E2E_STORIES_URL?.trim() || "https://canopy-stories.vercel.app",
    reachURL: process.env.E2E_REACH_URL?.trim() || "https://canopy-reach.vercel.app",
    photovaultURL: process.env.E2E_PHOTOVAULT_URL?.trim() || "https://photovault.school",
  };
}
