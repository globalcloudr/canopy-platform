export type WorkspaceRole = "owner" | "admin" | "staff";
export type MembershipStatus = "invited" | "active" | "suspended";
export type EntitlementStatus = "trial" | "active" | "pilot" | "paused";
export type SetupState = "not_started" | "in_setup" | "ready" | "blocked";

export type ProductKey =
  | "photovault"
  | "canopy_web"
  | "create_canopy"
  | "publish_canopy"
  | "community_canopy"
  | "reach_canopy"
  | "assist_canopy"
  | "insights_canopy"
  | "website_setup"
  | "design_support"
  | "communications_support";

type MockUser = {
  id: string;
  email: string;
  displayName: string;
};

type MockWorkspace = {
  id: string;
  slug: string;
  displayName: string;
};

type MockMembership = {
  userId: string;
  workspaceId: string;
  role: WorkspaceRole;
  status: MembershipStatus;
};

export type MockEntitlement = {
  workspaceId: string;
  productKey: ProductKey;
  status: EntitlementStatus;
  setupState: SetupState;
  planKey?: string;
};

export type PortalSession = {
  user: MockUser;
  activeWorkspace: MockWorkspace;
  memberships: Array<MockMembership & { workspace: MockWorkspace }>;
  entitlements: MockEntitlement[];
};

const users: MockUser[] = [
  {
    id: "user-sarah",
    email: "sarah.zylstra@school.edu",
    displayName: "Sarah Zylstra",
  },
  {
    id: "user-maria",
    email: "maria.admin@northvalley.edu",
    displayName: "Maria Flores",
  },
  {
    id: "user-jordan",
    email: "jordan@usecanopy.school",
    displayName: "Jordan Canopy",
  },
];

const workspaces: MockWorkspace[] = [
  {
    id: "ws-example",
    slug: "example-adult-school",
    displayName: "Example Adult School",
  },
  {
    id: "ws-north-valley",
    slug: "north-valley-campus",
    displayName: "North Valley Campus",
  },
  {
    id: "ws-bay-learning",
    slug: "bay-learning-center",
    displayName: "Bay Learning Center",
  },
];

const memberships: MockMembership[] = [
  {
    userId: "user-sarah",
    workspaceId: "ws-example",
    role: "owner",
    status: "active",
  },
  {
    userId: "user-maria",
    workspaceId: "ws-north-valley",
    role: "admin",
    status: "active",
  },
  {
    userId: "user-jordan",
    workspaceId: "ws-example",
    role: "admin",
    status: "active",
  },
  {
    userId: "user-jordan",
    workspaceId: "ws-north-valley",
    role: "admin",
    status: "active",
  },
  {
    userId: "user-jordan",
    workspaceId: "ws-bay-learning",
    role: "admin",
    status: "active",
  },
];

const entitlements: MockEntitlement[] = [
  {
    workspaceId: "ws-example",
    productKey: "photovault",
    status: "active",
    setupState: "ready",
    planKey: "standard",
  },
  {
    workspaceId: "ws-example",
    productKey: "community_canopy",
    status: "pilot",
    setupState: "in_setup",
  },
  {
    workspaceId: "ws-example",
    productKey: "canopy_web",
    status: "active",
    setupState: "in_setup",
  },
  {
    workspaceId: "ws-example",
    productKey: "assist_canopy",
    status: "trial",
    setupState: "in_setup",
  },
  {
    workspaceId: "ws-example",
    productKey: "website_setup",
    status: "active",
    setupState: "in_setup",
  },
  {
    workspaceId: "ws-example",
    productKey: "communications_support",
    status: "active",
    setupState: "ready",
  },
  {
    workspaceId: "ws-north-valley",
    productKey: "photovault",
    status: "active",
    setupState: "ready",
  },
  {
    workspaceId: "ws-north-valley",
    productKey: "community_canopy",
    status: "active",
    setupState: "ready",
  },
  {
    workspaceId: "ws-bay-learning",
    productKey: "photovault",
    status: "pilot",
    setupState: "in_setup",
  },
];

function getUserByEmail(email?: string) {
  return users.find((user) => user.email === email) ?? users[0];
}

function getWorkspaceBySlug(workspaceSlug?: string) {
  return workspaces.find((workspace) => workspace.slug === workspaceSlug) ?? null;
}

function getMembershipsForUser(userId: string) {
  return memberships
    .filter((membership) => membership.userId === userId && membership.status === "active")
    .map((membership) => ({
      ...membership,
      workspace: workspaces.find((workspace) => workspace.id === membership.workspaceId)!,
    }));
}

export function resolvePortalSession(options?: { email?: string; workspace?: string }): PortalSession {
  const user = getUserByEmail(options?.email);
  const userMemberships = getMembershipsForUser(user.id);

  const requestedWorkspace = options?.workspace ? getWorkspaceBySlug(options.workspace) : null;
  const lastUsedWorkspace =
    requestedWorkspace && userMemberships.some((membership) => membership.workspaceId === requestedWorkspace.id)
      ? requestedWorkspace
      : null;

  const activeWorkspace = lastUsedWorkspace ?? userMemberships[0]?.workspace ?? workspaces[0];

  return {
    user,
    activeWorkspace,
    memberships: userMemberships,
    entitlements: entitlements.filter((entitlement) => entitlement.workspaceId === activeWorkspace.id),
  };
}

export function getWorkspaceName(workspaceSlug?: string) {
  return getWorkspaceBySlug(workspaceSlug)?.displayName ?? workspaces[0].displayName;
}

export const mockWorkspaces = workspaces.map((workspace) => ({
  slug: workspace.slug,
  displayName: workspace.displayName,
}));
