import { cookies } from "next/headers";

export type WorkspaceRole = "owner" | "admin" | "staff" | "social_media" | "uploader" | "viewer";
export type MembershipStatus = "invited" | "active" | "suspended";
export type EntitlementStatus = "trial" | "active" | "pilot" | "paused";
export type SetupState = "not_started" | "in_setup" | "ready" | "blocked";
export type ServiceStatus = "active" | "available" | "paused" | "inactive";
export type ServiceSetupState = "setup" | "ready" | "pilot";

export type ProductKey =
  | "photovault"
  | "canopy_web"
  | "create_canopy"
  | "publish_canopy"
  | "stories_canopy"
  | "community_canopy"
  | "reach_canopy"
  | "assist_canopy"
  | "insights_canopy"
  | "website_setup"
  | "design_support"
  | "communications_support";

export type PortalUser = {
  id: string;
  email: string;
  displayName: string;
};

export type PortalWorkspace = {
  id: string;
  slug: string;
  displayName: string;
};

export type PortalMembership = {
  userId: string;
  workspaceId: string;
  role: WorkspaceRole;
  status: MembershipStatus;
  workspace: PortalWorkspace;
};

export type PortalEntitlement = {
  workspaceId: string;
  productKey: ProductKey;
  status: EntitlementStatus;
  setupState: SetupState;
  planKey?: string;
};

export type PortalSession = {
  user: PortalUser;
  activeWorkspace: PortalWorkspace | null;
  memberships: PortalMembership[];
  entitlements: PortalEntitlement[];
  platformRole: string | null;
  isPlatformOperator: boolean;
};

export const ACCESS_TOKEN_COOKIE = "canopy_portal_access_token";
export const REFRESH_TOKEN_COOKIE = "canopy_portal_refresh_token";

type ServiceEnv = {
  supabaseUrl: string;
  serviceRoleKey: string;
  anonKey: string;
};

type AuthAdminUser = {
  id: string;
  email?: string | null;
  user_metadata?: {
    full_name?: string | null;
    name?: string | null;
  } | null;
};

export type SupabasePasswordAuthResult = {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  token_type: string;
  user: AuthAdminUser;
};

type MembershipRow = {
  user_id: string;
  org_id: string;
  role: string | null;
};

type OrganizationRow = {
  id: string;
  name: string | null;
  slug: string | null;
};

type ProfileRow = {
  user_id: string;
  is_super_admin: boolean | null;
  platform_role: string | null;
};

type EntitlementRow = {
  workspace_id?: string | null;
  organization_id?: string | null;
  org_id?: string | null;
  product_key?: string | null;
  status?: string | null;
  setup_state?: string | null;
  plan_key?: string | null;
};

export function getServiceEnv(): ServiceEnv | null {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !serviceRoleKey || !anonKey) {
    return null;
  }

  return { supabaseUrl, serviceRoleKey, anonKey };
}

function formatDisplayName(user: AuthAdminUser) {
  const fullName = user.user_metadata?.full_name?.trim() || user.user_metadata?.name?.trim();
  if (fullName) {
    return fullName;
  }

  const email = user.email?.trim();
  if (!email) {
    return "Canopy User";
  }

  return email
    .split("@")[0]
    .split(/[.\-_]/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

async function requestJson<T>(path: string, searchParams?: URLSearchParams): Promise<T> {
  const env = getServiceEnv();
  if (!env) {
    throw new Error("Missing Supabase environment variables.");
  }

  const url = new URL(path, env.supabaseUrl);
  if (searchParams) {
    url.search = searchParams.toString();
  }

  const response = await fetch(url.toString(), {
    headers: {
      apikey: env.serviceRoleKey,
      Authorization: `Bearer ${env.serviceRoleKey}`,
      "Content-Type": "application/json",
    },
    cache: "no-store",
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Supabase request failed (${response.status}): ${text}`);
  }

  return (await response.json()) as T;
}

export async function getUserFromAccessToken(accessToken: string) {
  const env = getServiceEnv();
  if (!env) {
    return null;
  }

  const response = await fetch(new URL("/auth/v1/user", env.supabaseUrl), {
    headers: {
      apikey: env.anonKey,
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    cache: "no-store",
  });

  if (!response.ok) {
    return null;
  }

  return (await response.json()) as AuthAdminUser;
}

async function findUserByEmail(email?: string) {
  const normalizedEmail = email?.trim().toLowerCase();
  if (!normalizedEmail) {
    return null;
  }

  const payload = await requestJson<{ users?: AuthAdminUser[] }>(
    "/auth/v1/admin/users",
    new URLSearchParams({
      page: "1",
      per_page: "1000",
    })
  );

  return payload.users?.find((candidate) => candidate.email?.trim().toLowerCase() === normalizedEmail) ?? null;
}

async function getProfile(userId: string) {
  const rows = await requestJson<ProfileRow[]>(
    "/rest/v1/profiles",
    new URLSearchParams({
      select: "user_id,is_super_admin,platform_role",
      user_id: `eq.${userId}`,
      limit: "1",
    })
  );

  return rows[0] ?? null;
}

async function getMembershipRows(userId: string) {
  return requestJson<MembershipRow[]>(
    "/rest/v1/memberships",
    new URLSearchParams({
      select: "user_id,org_id,role",
      user_id: `eq.${userId}`,
    })
  );
}

async function getOrganizationsByIds(ids: string[]) {
  if (ids.length === 0) {
    return [];
  }

  return requestJson<OrganizationRow[]>(
    "/rest/v1/organizations",
    new URLSearchParams({
      select: "id,name,slug",
      id: `in.(${ids.join(",")})`,
      order: "name.asc",
    })
  );
}

async function getAllOrganizations() {
  return requestJson<OrganizationRow[]>(
    "/rest/v1/organizations",
    new URLSearchParams({
      select: "id,name,slug",
      order: "name.asc",
    })
  );
}

function isPlatformOperator(profile: ProfileRow | null) {
  return Boolean(profile?.is_super_admin) || profile?.platform_role === "super_admin" || profile?.platform_role === "platform_staff";
}

function normalizeWorkspaceRole(value: string | null | undefined): WorkspaceRole {
  if (value === "owner" || value === "admin" || value === "staff" || value === "social_media" || value === "uploader" || value === "viewer") {
    return value;
  }

  return "viewer";
}

export function canManageWorkspaceInvitations(role: WorkspaceRole | null | undefined) {
  return role === "owner" || role === "admin";
}

function normalizeWorkspace(row: OrganizationRow): PortalWorkspace | null {
  if (!row.id || !row.slug) {
    return null;
  }

  return {
    id: row.id,
    slug: row.slug,
    displayName: row.name?.trim() || row.slug,
  };
}

function normalizeEntitlement(row: EntitlementRow, fallbackWorkspaceId: string): PortalEntitlement | null {
  const productKey = row.product_key;
  if (!productKey) {
    return null;
  }

  if (
    productKey !== "photovault" &&
    productKey !== "canopy_web" &&
    productKey !== "create_canopy" &&
    productKey !== "publish_canopy" &&
    productKey !== "stories_canopy" &&
    productKey !== "community_canopy" &&
    productKey !== "reach_canopy" &&
    productKey !== "assist_canopy" &&
    productKey !== "insights_canopy" &&
    productKey !== "website_setup" &&
    productKey !== "design_support" &&
    productKey !== "communications_support"
  ) {
    return null;
  }

  const workspaceId = row.workspace_id || row.organization_id || row.org_id || fallbackWorkspaceId;
  const status = row.status;
  const setupState = row.setup_state;

  return {
    workspaceId,
    productKey,
    status:
      status === "trial" || status === "pilot" || status === "paused" || status === "active"
        ? status
        : "active",
    setupState:
      setupState === "not_started" || setupState === "in_setup" || setupState === "blocked" || setupState === "ready"
        ? setupState
        : "ready",
    planKey: row.plan_key ?? undefined,
  };
}

async function getEntitlementsForWorkspace(workspaceId: string) {
  const attempts = [
    new URLSearchParams({
      select: "organization_id,product_key,status,setup_state,plan_key",
      organization_id: `eq.${workspaceId}`,
    }),
    new URLSearchParams({
      select: "org_id,product_key,status,setup_state,plan_key",
      org_id: `eq.${workspaceId}`,
    }),
    new URLSearchParams({
      select: "workspace_id,product_key,status,setup_state,plan_key",
      workspace_id: `eq.${workspaceId}`,
    }),
  ];

  for (const params of attempts) {
    try {
      const rows = await requestJson<EntitlementRow[]>("/rest/v1/product_entitlements", params);
      return rows
        .map((row) => normalizeEntitlement(row, workspaceId))
        .filter((value): value is PortalEntitlement => value !== null);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      if (
        !message.includes("product_entitlements") &&
        !message.includes("workspace_id") &&
        !message.includes("organization_id") &&
        !message.includes("org_id")
      ) {
        throw error;
      }
    }
  }

  return [];
}

async function resolveUserFromRequest(options?: { email?: string }) {
  const store = await cookies();
  const accessToken = store.get(ACCESS_TOKEN_COOKIE)?.value;

  if (accessToken) {
    const authedUser = await getUserFromAccessToken(accessToken);
    if (authedUser?.id && authedUser.email) {
      return authedUser;
    }
  }

  return findUserByEmail(options?.email);
}

export async function signInWithSupabasePassword(email: string, password: string): Promise<SupabasePasswordAuthResult> {
  const env = getServiceEnv();
  if (!env) {
    throw new Error("Missing Supabase environment variables.");
  }

  const response = await fetch(new URL("/auth/v1/token?grant_type=password", env.supabaseUrl), {
    method: "POST",
    headers: {
      apikey: env.anonKey,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
    cache: "no-store",
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Supabase sign-in failed (${response.status}): ${text}`);
  }

  return (await response.json()) as SupabasePasswordAuthResult;
}

export async function resolvePortalSession(options?: {
  email?: string;
  workspace?: string;
}): Promise<PortalSession | null> {
  if (!getServiceEnv()) {
    return null;
  }

  const user = await resolveUserFromRequest(options);
  if (!user?.id || !user.email) {
    return null;
  }

  const profile = await getProfile(user.id);
  const membershipRows = await getMembershipRows(user.id);
  const organizations = isPlatformOperator(profile)
    ? await getAllOrganizations()
    : await getOrganizationsByIds(
        Array.from(new Set(membershipRows.map((membership) => membership.org_id).filter(Boolean)))
      );

  const workspaces = organizations
    .map(normalizeWorkspace)
    .filter((workspace): workspace is PortalWorkspace => workspace !== null);

  if (workspaces.length === 0) {
    return null;
  }

  const memberships: PortalMembership[] = workspaces.map((workspace) => {
    const membership = membershipRows.find((row) => row.org_id === workspace.id);
    return {
      userId: user.id,
      workspaceId: workspace.id,
      role: normalizeWorkspaceRole(membership?.role),
      status: "active",
      workspace,
    };
  });

  const activeWorkspace = isPlatformOperator(profile)
    ? workspaces.find((workspace) => workspace.slug === options?.workspace) ?? null
    : workspaces.find((workspace) => workspace.slug === options?.workspace) ?? workspaces[0];
  const entitlements = activeWorkspace ? await getEntitlementsForWorkspace(activeWorkspace.id) : [];

  return {
    user: {
      id: user.id,
      email: user.email,
      displayName: formatDisplayName(user),
    },
    activeWorkspace,
    memberships,
    entitlements,
    platformRole: profile?.platform_role ?? (profile?.is_super_admin ? "super_admin" : null),
    isPlatformOperator: isPlatformOperator(profile),
  };
}
