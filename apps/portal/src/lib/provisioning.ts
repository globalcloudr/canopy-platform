import {
  type PortalWorkspace,
  type ProductKey,
  type ServiceSetupState,
  type ServiceStatus,
  type SetupState,
  type WorkspaceRole,
} from "@/lib/platform";
import { logAuditEvent } from "@/lib/audit";

type ProvisioningEnv = {
  supabaseUrl: string;
  serviceRoleKey: string;
};

export type ProvisionedProductInput = {
  productKey: ProductKey;
  status?: "trial" | "active" | "pilot" | "paused";
  setupState?: SetupState;
  planKey?: string;
};

export type ProvisionedServiceInput = {
  serviceKey: string;
  status?: ServiceStatus;
  setupState?: ServiceSetupState;
};

export type ProvisionWorkspaceInput = {
  workspaceMode: "existing" | "new";
  workspaceId?: string;
  workspaceName?: string;
  workspaceSlug?: string;
  primaryAdminEmail: string;
  initialRole: WorkspaceRole;
  products: ProvisionedProductInput[];
  services: ProvisionedServiceInput[];
  notes?: string;
  provisionedByUserId: string;
  inviteRedirectTo?: string;
};

export type ProvisionWorkspaceResult = {
  workspace: PortalWorkspace;
  invitation: {
    id?: string;
    email: string;
    status: "existing_membership" | "membership_prepared" | "invitation_recorded" | "invitation_sent";
    role?: WorkspaceRole;
    invitationStatus?: "pending" | "accepted" | "cancelled";
    createdAt?: string;
  };
  membership: {
    userId: string;
    role: WorkspaceRole;
    created: boolean;
  } | null;
  entitlements: Array<{
    productKey: ProductKey;
    status: "trial" | "active" | "pilot" | "paused";
    setupState: SetupState;
    planKey?: string;
  }>;
  services: Array<{
    serviceKey: string;
    status: ServiceStatus;
    setupState: ServiceSetupState;
  }>;
};

export type WorkspaceAdminInvitation = {
  id: string;
  workspaceId: string;
  email: string;
  role: WorkspaceRole;
  status: "pending" | "accepted" | "cancelled";
  deliveryStatus: "pending_unsent" | "sent" | "failed";
  createdAt: string;
  sentAt?: string | null;
  acceptedAt?: string | null;
};

type OrganizationRow = {
  id: string;
  name: string | null;
  slug: string | null;
};

type AuthAdminUser = {
  id: string;
  email?: string | null;
};

type InviteUserResponse = {
  user?: AuthAdminUser | null;
};

type MembershipRow = {
  user_id: string;
  org_id: string;
  role: string | null;
};

type InvitationRow = {
  id: string;
  organization_id?: string;
  email: string;
  role?: string | null;
  status: "pending" | "accepted" | "cancelled";
  delivery_status?: "pending_unsent" | "sent" | "failed" | null;
  created_at?: string | null;
  sent_at?: string | null;
  accepted_at?: string | null;
};

type ServiceStateRow = {
  workspace_id?: string | null;
  organization_id?: string | null;
  org_id?: string | null;
  service_key?: string | null;
  status?: string | null;
  setup_state?: string | null;
};

function getProvisioningEnv(): ProvisioningEnv {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error("Missing Supabase environment variables.");
  }

  return { supabaseUrl, serviceRoleKey };
}

async function requestJson<T>(
  path: string,
  options?: {
    method?: "GET" | "POST" | "PATCH" | "DELETE";
    searchParams?: URLSearchParams;
    body?: unknown;
    prefer?: string;
  }
): Promise<T> {
  const env = getProvisioningEnv();
  const url = new URL(path, env.supabaseUrl);
  if (options?.searchParams) {
    url.search = options.searchParams.toString();
  }

  const response = await fetch(url.toString(), {
    method: options?.method ?? "GET",
    headers: {
      apikey: env.serviceRoleKey,
      Authorization: `Bearer ${env.serviceRoleKey}`,
      "Content-Type": "application/json",
      ...(options?.prefer ? { Prefer: options.prefer } : {}),
    },
    body: options?.body ? JSON.stringify(options.body) : undefined,
    cache: "no-store",
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Supabase request failed (${response.status}): ${text}`);
  }

  if (response.status === 204 || response.headers.get("content-length") === "0") {
    return undefined as T;
  }

  return (await response.json()) as T;
}

function normalizeWorkspaceRole(value: WorkspaceRole): WorkspaceRole {
  if (
    value === "owner" ||
    value === "admin" ||
    value === "staff" ||
    value === "social_media" ||
    value === "uploader" ||
    value === "viewer"
  ) {
    return value;
  }

  return "owner";
}

function normalizeSetupState(value?: SetupState): SetupState {
  if (value === "not_started" || value === "in_setup" || value === "ready" || value === "blocked") {
    return value;
  }

  return "ready";
}

function normalizeServiceStatus(value?: ServiceStatus): ServiceStatus {
  if (value === "active" || value === "available" || value === "paused" || value === "inactive") {
    return value;
  }

  return "available";
}

function normalizeServiceSetupState(value?: ServiceSetupState): ServiceSetupState {
  if (value === "setup" || value === "ready" || value === "pilot") {
    return value;
  }

  return "ready";
}

function normalizeProductStatus(value?: "trial" | "active" | "pilot" | "paused") {
  if (value === "trial" || value === "active" || value === "pilot" || value === "paused") {
    return value;
  }

  return "active";
}

function normalizeWorkspace(row: OrganizationRow): PortalWorkspace {
  return {
    id: row.id,
    slug: row.slug?.trim() || row.id,
    displayName: row.name?.trim() || row.slug?.trim() || "Workspace",
  };
}

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

function normalizeSlug(slug: string) {
  return slug
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function assertValidInput(input: ProvisionWorkspaceInput) {
  if (input.workspaceMode !== "existing" && input.workspaceMode !== "new") {
    throw new Error("Invalid workspace mode.");
  }

  if (input.workspaceMode === "existing" && !input.workspaceId?.trim()) {
    throw new Error("Existing workspace provisioning requires a workspace id.");
  }

  if (input.workspaceMode === "new") {
    if (!input.workspaceName?.trim()) {
      throw new Error("Workspace name is required when creating a workspace.");
    }
    if (!normalizeSlug(input.workspaceSlug ?? "")) {
      throw new Error("Workspace slug is required when creating a workspace.");
    }
  }

  if (!normalizeEmail(input.primaryAdminEmail)) {
    throw new Error("Primary admin email is required.");
  }

  if (input.products.length === 0 && input.services.length === 0) {
    throw new Error("Select at least one product or service.");
  }
}

async function resolveWorkspace(input: ProvisionWorkspaceInput): Promise<PortalWorkspace> {
  if (input.workspaceMode === "existing") {
    const rows = await requestJson<OrganizationRow[]>(
      "/rest/v1/organizations",
      {
        searchParams: new URLSearchParams({
          select: "id,name,slug",
          id: `eq.${input.workspaceId}`,
          limit: "1",
        }),
      }
    );

    const row = rows[0];
    if (!row?.id) {
      throw new Error("Workspace not found.");
    }

    return normalizeWorkspace(row);
  }

  const normalizedSlug = normalizeSlug(input.workspaceSlug ?? "");
  const existingRows = await requestJson<OrganizationRow[]>(
    "/rest/v1/organizations",
    {
      searchParams: new URLSearchParams({
        select: "id,name,slug",
        slug: `eq.${normalizedSlug}`,
        limit: "1",
      }),
    }
  );

  if (existingRows[0]?.id) {
    throw new Error("A workspace with this slug already exists.");
  }

  const rows = await requestJson<OrganizationRow[]>(
    "/rest/v1/organizations",
    {
      method: "POST",
      prefer: "return=representation",
      body: {
        name: input.workspaceName?.trim(),
        slug: normalizedSlug,
      },
    }
  );

  const row = rows[0];
  if (!row?.id) {
    throw new Error("Failed to create workspace.");
  }

  return normalizeWorkspace(row);
}

async function findUserByEmail(email: string) {
  const payload = await requestJson<{ users?: AuthAdminUser[] }>(
    "/auth/v1/admin/users",
    {
      searchParams: new URLSearchParams({
        page: "1",
        per_page: "1000",
      }),
    }
  );

  return payload.users?.find((candidate) => normalizeEmail(candidate.email ?? "") === email) ?? null;
}

async function inviteUserByEmail(email: string, input: ProvisionWorkspaceInput, workspace: PortalWorkspace) {
  const env = getProvisioningEnv();
  const response = await fetch(new URL("/auth/v1/invite", env.supabaseUrl), {
    method: "POST",
    headers: {
      apikey: env.serviceRoleKey,
      Authorization: `Bearer ${env.serviceRoleKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      data: {
        workspace_id: workspace.id,
        workspace_slug: workspace.slug,
        workspace_name: workspace.displayName,
        platform_role_hint: input.initialRole,
      },
      redirect_to: input.inviteRedirectTo,
    }),
    cache: "no-store",
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Invite send failed (${response.status}): ${text}`);
  }

  return (await response.json()) as InviteUserResponse;
}

async function getMembership(userId: string, workspaceId: string) {
  const rows = await requestJson<MembershipRow[]>(
    "/rest/v1/memberships",
    {
      searchParams: new URLSearchParams({
        select: "user_id,org_id,role",
        user_id: `eq.${userId}`,
        org_id: `eq.${workspaceId}`,
        limit: "1",
      }),
    }
  );

  return rows[0] ?? null;
}

async function ensureMembership(userId: string, workspaceId: string, role: WorkspaceRole) {
  const existing = await getMembership(userId, workspaceId);
  if (existing) {
    return {
      userId,
      role: normalizeWorkspaceRole((existing.role ?? role) as WorkspaceRole),
      created: false,
    };
  }

  await requestJson<MembershipRow[]>(
    "/rest/v1/memberships",
    {
      method: "POST",
      prefer: "return=representation",
      body: {
        user_id: userId,
        org_id: workspaceId,
        role,
      },
    }
  );

  return {
    userId,
    role,
    created: true,
  };
}

async function upsertEntitlements(workspaceId: string, products: ProvisionedProductInput[], notes: string | undefined) {
  if (products.length === 0) {
    return [];
  }

  const rows = products.map((product) => ({
    organization_id: workspaceId,
    product_key: product.productKey,
    status: normalizeProductStatus(product.status),
    plan_key: product.planKey ?? null,
    setup_state: normalizeSetupState(product.setupState),
    source: "manual_provisioning",
    notes: notes?.trim() || null,
  }));

  const result = await requestJson<
    Array<{ product_key: ProductKey; status: "trial" | "active" | "pilot" | "paused"; setup_state: SetupState; plan_key?: string | null }>
  >("/rest/v1/product_entitlements", {
    method: "POST",
    prefer: "resolution=merge-duplicates,return=representation",
    searchParams: new URLSearchParams({
      on_conflict: "organization_id,product_key",
    }),
    body: rows,
  });

  return result.map((row) => ({
    productKey: row.product_key,
    status: normalizeProductStatus(row.status),
    setupState: normalizeSetupState(row.setup_state),
    planKey: row.plan_key ?? undefined,
  }));
}

async function upsertServiceStates(workspaceId: string, services: ProvisionedServiceInput[], notes: string | undefined) {
  if (services.length === 0) {
    return [];
  }

  const rows = services.map((service) => ({
    organization_id: workspaceId,
    service_key: service.serviceKey,
    status: normalizeServiceStatus(service.status),
    setup_state: normalizeServiceSetupState(service.setupState),
    source: "manual_provisioning",
    notes: notes?.trim() || null,
  }));

  const result = await requestJson<
    Array<{ service_key: string; status: ServiceStatus; setup_state: ServiceSetupState }>
  >("/rest/v1/workspace_service_states", {
    method: "POST",
    prefer: "resolution=merge-duplicates,return=representation",
    searchParams: new URLSearchParams({
      on_conflict: "organization_id,service_key",
    }),
    body: rows,
  });

  return result.map((row) => ({
    serviceKey: row.service_key,
    status: normalizeServiceStatus(row.status),
    setupState: normalizeServiceSetupState(row.setup_state),
  }));
}

async function upsertInvitation(
  workspaceId: string,
  email: string,
  role: WorkspaceRole,
  provisionedByUserId: string,
  notes: string | undefined,
  delivery?: { sentAt?: string | null; deliveryStatus?: "pending_unsent" | "sent" | "failed" }
) {
  const rows = await requestJson<InvitationRow[]>(
    "/rest/v1/workspace_admin_invitations",
    {
      method: "POST",
      prefer: "resolution=merge-duplicates,return=representation",
      searchParams: new URLSearchParams({
        on_conflict: "organization_id,email",
      }),
      body: {
        organization_id: workspaceId,
        email,
        role,
        status: "pending",
        source: "manual_provisioning",
        invited_by_user_id: provisionedByUserId,
        sent_at: delivery?.sentAt ?? null,
        delivery_status: delivery?.deliveryStatus ?? "pending_unsent",
        notes: notes?.trim() || null,
      },
    }
  );

  return rows[0] ?? null;
}

function normalizeInvitationRole(value: string | null | undefined): WorkspaceRole {
  if (
    value === "owner" ||
    value === "admin" ||
    value === "staff" ||
    value === "social_media" ||
    value === "uploader" ||
    value === "viewer"
  ) {
    return value;
  }

  return "owner";
}

function normalizeWorkspaceInvitation(row: InvitationRow): WorkspaceAdminInvitation | null {
  if (!row.id || !row.organization_id || !row.email || !row.created_at) {
    return null;
  }

  return {
    id: row.id,
    workspaceId: row.organization_id,
    email: row.email,
    role: normalizeInvitationRole(row.role),
    status: row.status,
    deliveryStatus: row.delivery_status === "sent" || row.delivery_status === "failed" ? row.delivery_status : "pending_unsent",
    createdAt: row.created_at,
    sentAt: row.sent_at ?? null,
    acceptedAt: row.accepted_at ?? null,
  };
}

export async function listWorkspaceAdminInvitations(workspaceIds: string[]): Promise<WorkspaceAdminInvitation[]> {
  if (workspaceIds.length === 0) {
    return [];
  }

  const rows = await requestJson<InvitationRow[]>(
    "/rest/v1/workspace_admin_invitations",
    {
      searchParams: new URLSearchParams({
        select: "id,organization_id,email,role,status,delivery_status,created_at,sent_at,accepted_at",
        organization_id: `in.(${workspaceIds.join(",")})`,
        order: "created_at.desc",
      }),
    }
  );

  return rows
    .map(normalizeWorkspaceInvitation)
    .filter((row): row is WorkspaceAdminInvitation => row !== null);
}

async function listPendingInvitationsByEmail(email: string) {
  const rows = await requestJson<InvitationRow[]>(
    "/rest/v1/workspace_admin_invitations",
    {
      searchParams: new URLSearchParams({
        select: "id,organization_id,email,role,status,delivery_status,created_at,sent_at,accepted_at",
        email: `eq.${email}`,
        status: "eq.pending",
        order: "created_at.asc",
      }),
    }
  );

  return rows
    .map(normalizeWorkspaceInvitation)
    .filter((row): row is WorkspaceAdminInvitation => row !== null);
}

async function getWorkspaceById(workspaceId: string) {
  const rows = await requestJson<OrganizationRow[]>(
    "/rest/v1/organizations",
    {
      searchParams: new URLSearchParams({
        select: "id,name,slug",
        id: `eq.${workspaceId}`,
        limit: "1",
      }),
    }
  );

  const row = rows[0];
  return row?.id ? normalizeWorkspace(row) : null;
}

export async function resendWorkspaceAdminInvitation(options: {
  invitationId: string;
  provisionedByUserId: string;
  actorEmail?: string | null;
  inviteRedirectTo?: string;
}) {
  const rows = await requestJson<InvitationRow[]>(
    "/rest/v1/workspace_admin_invitations",
    {
      searchParams: new URLSearchParams({
        select: "id,organization_id,email,role,status,delivery_status,created_at,sent_at,accepted_at",
        id: `eq.${options.invitationId}`,
        limit: "1",
      }),
    }
  );

  const invitation = rows[0];
  if (!invitation?.id || !invitation.organization_id || !invitation.email) {
    throw new Error("Invitation not found.");
  }

  if (invitation.status !== "pending") {
    throw new Error("Only pending invitations can be resent.");
  }

  const workspace = await getWorkspaceById(invitation.organization_id);
  if (!workspace) {
    throw new Error("Workspace not found for invitation.");
  }

  await inviteUserByEmail(invitation.email, {
    workspaceMode: "existing",
    workspaceId: workspace.id,
    primaryAdminEmail: invitation.email,
    initialRole: normalizeInvitationRole(invitation.role),
    products: [],
    services: [],
    provisionedByUserId: options.provisionedByUserId,
    inviteRedirectTo: options.inviteRedirectTo,
  }, workspace);

  const sentAt = new Date().toISOString();

  const updatedRows = await requestJson<InvitationRow[]>(
    "/rest/v1/workspace_admin_invitations",
    {
      method: "POST",
      prefer: "resolution=merge-duplicates,return=representation",
      searchParams: new URLSearchParams({
        on_conflict: "organization_id,email",
      }),
      body: {
        organization_id: workspace.id,
        email: invitation.email,
        role: normalizeInvitationRole(invitation.role),
        status: "pending",
        source: "manual_provisioning",
        invited_by_user_id: options.provisionedByUserId,
        sent_at: sentAt,
        delivery_status: "sent",
      },
    }
  );

  const updated = updatedRows.map(normalizeWorkspaceInvitation).find((row): row is WorkspaceAdminInvitation => row !== null);
  if (!updated) {
    throw new Error("Invitation resend was sent, but the invitation row could not be updated.");
  }

  await logAuditEvent({
    orgId: workspace.id,
    actorUserId: options.provisionedByUserId,
    actorEmail: options.actorEmail ?? null,
    eventType: "workspace_invitation_resent",
    entityType: "workspace_invitation",
    entityId: updated.id,
    metadata: {
      invitedEmail: updated.email,
      role: updated.role,
    },
  });

  return updated;
}

export async function finalizeWorkspaceAdminInvitationsForUser(user: { id: string; email: string }) {
  const pendingInvitations = await listPendingInvitationsByEmail(normalizeEmail(user.email));
  if (pendingInvitations.length === 0) {
    return {
      acceptedInvitations: [] as WorkspaceAdminInvitation[],
      preferredWorkspaceSlug: null as string | null,
    };
  }

  const acceptedInvitations: WorkspaceAdminInvitation[] = [];

  for (const invitation of pendingInvitations) {
    await ensureMembership(user.id, invitation.workspaceId, invitation.role);

    const updatedRows = await requestJson<InvitationRow[]>(
      "/rest/v1/workspace_admin_invitations",
      {
        method: "PATCH",
        prefer: "return=representation",
        searchParams: new URLSearchParams({
          id: `eq.${invitation.id}`,
        }),
        body: {
          status: "accepted",
          accepted_by_user_id: user.id,
          accepted_at: new Date().toISOString(),
        },
      }
    );

    const updated = updatedRows.map(normalizeWorkspaceInvitation).find((row): row is WorkspaceAdminInvitation => row !== null);
    if (updated) {
      acceptedInvitations.push(updated);
      await logAuditEvent({
        orgId: updated.workspaceId,
        actorUserId: user.id,
        actorEmail: user.email,
        eventType: "workspace_invitation_accepted",
        entityType: "workspace_invitation",
        entityId: updated.id,
        metadata: {
          invitedEmail: updated.email,
          role: updated.role,
        },
      });
    }
  }

  const firstWorkspace = pendingInvitations[0]
    ? await getWorkspaceById(pendingInvitations[0].workspaceId)
    : null;

  return {
    acceptedInvitations,
    preferredWorkspaceSlug: firstWorkspace?.slug ?? null,
  };
}

type EntitlementRow = {
  workspace_id?: string | null;
  organization_id?: string | null;
  org_id?: string | null;
  product_key?: string | null;
  status?: string | null;
  setup_state?: string | null;
  plan_key?: string | null;
};

export type WorkspaceEntitlement = {
  productKey: ProductKey;
  status: "trial" | "active" | "pilot" | "paused";
  setupState: SetupState;
  planKey?: string;
};

export type WorkspaceServiceState = {
  serviceKey: string;
  status: ServiceStatus;
  setupState: ServiceSetupState;
};

export type WorkspaceProvisioningStatus =
  | "not_started"
  | "invited"
  | "accepted"
  | "active"
  | "incomplete";

export type WorkspaceProvisioningSummary = {
  status: WorkspaceProvisioningStatus;
  statusLabel: string;
  detail: string;
  productCount: number;
  serviceCount: number;
  pendingInvitationCount: number;
  acceptedInvitationCount: number;
  cancelledInvitationCount: number;
};

function normalizeEntitlement(row: EntitlementRow, workspaceId: string): WorkspaceEntitlement | null {
  const productKey = row.product_key;
  const validKeys: ProductKey[] = [
    "photovault", "canopy_web", "create_canopy", "publish_canopy", "stories_canopy",
    "community_canopy", "reach_canopy", "assist_canopy", "insights_canopy",
    "website_setup", "design_support", "communications_support",
  ];
  if (!productKey || !validKeys.includes(productKey as ProductKey)) return null;
  return {
    productKey: productKey as ProductKey,
    status: (["trial", "active", "pilot", "paused"].includes(row.status ?? "")) ? row.status as WorkspaceEntitlement["status"] : "active",
    setupState: (["not_started", "in_setup", "ready", "blocked"].includes(row.setup_state ?? "")) ? row.setup_state as SetupState : "ready",
    planKey: row.plan_key ?? undefined,
  };
}

export async function getWorkspaceEntitlements(workspaceId: string): Promise<WorkspaceEntitlement[]> {
  const attempts: Array<{ col: string; params: URLSearchParams }> = [
    {
      col: "workspace_id",
      params: new URLSearchParams({ select: "workspace_id,product_key,status,setup_state,plan_key", workspace_id: `eq.${workspaceId}` }),
    },
    {
      col: "organization_id",
      params: new URLSearchParams({ select: "organization_id,product_key,status,setup_state,plan_key", organization_id: `eq.${workspaceId}` }),
    },
    {
      col: "org_id",
      params: new URLSearchParams({ select: "org_id,product_key,status,setup_state,plan_key", org_id: `eq.${workspaceId}` }),
    },
  ];

  const entitlements = new Map<ProductKey, WorkspaceEntitlement>();

  for (const attempt of attempts) {
    try {
      const rows = await requestJson<EntitlementRow[]>("/rest/v1/product_entitlements", { searchParams: attempt.params });
      rows
        .map((row) => normalizeEntitlement(row, workspaceId))
        .filter((row): row is WorkspaceEntitlement => row !== null)
        .forEach((row) => {
          entitlements.set(row.productKey, row);
        });
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      if (!message.includes("product_entitlements") && !message.includes(attempt.col)) throw error;
    }
  }

  return [...entitlements.values()];
}

function normalizeWorkspaceServiceState(row: ServiceStateRow): WorkspaceServiceState | null {
  if (!row.service_key) {
    return null;
  }

  return {
    serviceKey: row.service_key,
    status: normalizeServiceStatus(row.status as ServiceStatus | undefined),
    setupState: normalizeServiceSetupState(row.setup_state as ServiceSetupState | undefined),
  };
}

export async function getWorkspaceServiceStates(workspaceId: string): Promise<WorkspaceServiceState[]> {
  const attempts: Array<{ col: string; params: URLSearchParams }> = [
    {
      col: "workspace_id",
      params: new URLSearchParams({ select: "workspace_id,service_key,status,setup_state", workspace_id: `eq.${workspaceId}` }),
    },
    {
      col: "organization_id",
      params: new URLSearchParams({ select: "organization_id,service_key,status,setup_state", organization_id: `eq.${workspaceId}` }),
    },
    {
      col: "org_id",
      params: new URLSearchParams({ select: "org_id,service_key,status,setup_state", org_id: `eq.${workspaceId}` }),
    },
  ];

  const serviceStates = new Map<string, WorkspaceServiceState>();

  for (const attempt of attempts) {
    try {
      const rows = await requestJson<ServiceStateRow[]>("/rest/v1/workspace_service_states", { searchParams: attempt.params });
      rows
        .map((row) => normalizeWorkspaceServiceState(row))
        .filter((row): row is WorkspaceServiceState => row !== null)
        .forEach((row) => {
          serviceStates.set(row.serviceKey, row);
        });
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      if (!message.includes("workspace_service_states") && !message.includes(attempt.col)) {
        throw error;
      }
    }
  }

  return [...serviceStates.values()];
}

export function deriveWorkspaceProvisioningSummary(args: {
  invitations: WorkspaceAdminInvitation[];
  entitlements: WorkspaceEntitlement[];
  services: WorkspaceServiceState[];
}): WorkspaceProvisioningSummary {
  const pendingInvitations = args.invitations.filter((invitation) => invitation.status === "pending");
  const acceptedInvitations = args.invitations.filter((invitation) => invitation.status === "accepted");
  const cancelledInvitations = args.invitations.filter((invitation) => invitation.status === "cancelled");
  const productCount = args.entitlements.length;
  const serviceCount = args.services.length;
  const hasProvisionedAccess = productCount > 0 || serviceCount > 0;
  const hasDeliveryProblem = pendingInvitations.some((invitation) => invitation.deliveryStatus !== "sent");

  if (hasDeliveryProblem) {
    return {
      status: "incomplete",
      statusLabel: "Incomplete",
      detail: "A pending invitation still needs to be sent or resent before provisioning is complete.",
      productCount,
      serviceCount,
      pendingInvitationCount: pendingInvitations.length,
      acceptedInvitationCount: acceptedInvitations.length,
      cancelledInvitationCount: cancelledInvitations.length,
    };
  }

  if (pendingInvitations.length > 0) {
    return {
      status: "invited",
      statusLabel: "Invited",
      detail: "An invitation has been sent and is still awaiting acceptance.",
      productCount,
      serviceCount,
      pendingInvitationCount: pendingInvitations.length,
      acceptedInvitationCount: acceptedInvitations.length,
      cancelledInvitationCount: cancelledInvitations.length,
    };
  }

  if (acceptedInvitations.length > 0 && hasProvisionedAccess) {
    return {
      status: "active",
      statusLabel: "Active",
      detail: "Invitation acceptance is complete and the workspace has active products or services.",
      productCount,
      serviceCount,
      pendingInvitationCount: pendingInvitations.length,
      acceptedInvitationCount: acceptedInvitations.length,
      cancelledInvitationCount: cancelledInvitations.length,
    };
  }

  if (acceptedInvitations.length > 0) {
    return {
      status: "accepted",
      statusLabel: "Accepted",
      detail: "The invitation has been accepted, but products or services still need review before the workspace is fully active.",
      productCount,
      serviceCount,
      pendingInvitationCount: pendingInvitations.length,
      acceptedInvitationCount: acceptedInvitations.length,
      cancelledInvitationCount: cancelledInvitations.length,
    };
  }

  if (hasProvisionedAccess) {
    return {
      status: "active",
      statusLabel: "Active",
      detail: "The workspace already has active products or services and no pending invitation work.",
      productCount,
      serviceCount,
      pendingInvitationCount: pendingInvitations.length,
      acceptedInvitationCount: acceptedInvitations.length,
      cancelledInvitationCount: cancelledInvitations.length,
    };
  }

  if (cancelledInvitations.length > 0) {
    return {
      status: "incomplete",
      statusLabel: "Incomplete",
      detail: "Past invitation activity exists, but the workspace does not currently show active provisioning.",
      productCount,
      serviceCount,
      pendingInvitationCount: pendingInvitations.length,
      acceptedInvitationCount: acceptedInvitations.length,
      cancelledInvitationCount: cancelledInvitations.length,
    };
  }

  return {
    status: "not_started",
    statusLabel: "Not started",
    detail: "No invitation, product, or service setup is visible yet for this workspace.",
    productCount,
    serviceCount,
    pendingInvitationCount: pendingInvitations.length,
    acceptedInvitationCount: acceptedInvitations.length,
    cancelledInvitationCount: cancelledInvitations.length,
  };
}

async function mutateEntitlement(
  workspaceId: string,
  productKey: ProductKey,
  method: "PATCH" | "DELETE",
  body?: { status: "active" | "paused" }
) {
  const attempts: Array<{ col: string; params: URLSearchParams }> = [
    {
      col: "workspace_id",
      params: new URLSearchParams({ workspace_id: `eq.${workspaceId}`, product_key: `eq.${productKey}` }),
    },
    {
      col: "organization_id",
      params: new URLSearchParams({ organization_id: `eq.${workspaceId}`, product_key: `eq.${productKey}` }),
    },
    {
      col: "org_id",
      params: new URLSearchParams({ org_id: `eq.${workspaceId}`, product_key: `eq.${productKey}` }),
    },
  ];

  for (const attempt of attempts) {
    try {
      await requestJson<unknown>("/rest/v1/product_entitlements", {
        method,
        searchParams: attempt.params,
        body,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      if (!message.includes("product_entitlements") && !message.includes(attempt.col)) {
        throw error;
      }
    }
  }
}

export async function pauseEntitlement(workspaceId: string, productKey: ProductKey): Promise<void> {
  await mutateEntitlement(workspaceId, productKey, "PATCH", { status: "paused" });
}

export async function resumeEntitlement(workspaceId: string, productKey: ProductKey): Promise<void> {
  await mutateEntitlement(workspaceId, productKey, "PATCH", { status: "active" });
}

export async function removeEntitlement(workspaceId: string, productKey: ProductKey): Promise<void> {
  await mutateEntitlement(workspaceId, productKey, "DELETE");
}

async function mutateServiceState(
  workspaceId: string,
  serviceKey: string,
  method: "PATCH" | "DELETE",
  body?: { status: ServiceStatus }
) {
  const attempts: Array<{ col: string; params: URLSearchParams }> = [
    {
      col: "workspace_id",
      params: new URLSearchParams({ workspace_id: `eq.${workspaceId}`, service_key: `eq.${serviceKey}` }),
    },
    {
      col: "organization_id",
      params: new URLSearchParams({ organization_id: `eq.${workspaceId}`, service_key: `eq.${serviceKey}` }),
    },
    {
      col: "org_id",
      params: new URLSearchParams({ org_id: `eq.${workspaceId}`, service_key: `eq.${serviceKey}` }),
    },
  ];

  for (const attempt of attempts) {
    try {
      await requestJson<unknown>("/rest/v1/workspace_service_states", {
        method,
        searchParams: attempt.params,
        body,
      });
      return;
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      if (!message.includes("workspace_service_states") && !message.includes(attempt.col)) {
        throw error;
      }
    }
  }
}

export async function pauseServiceState(workspaceId: string, serviceKey: string): Promise<void> {
  await mutateServiceState(workspaceId, serviceKey, "PATCH", { status: "paused" });
}

export async function resumeServiceState(workspaceId: string, serviceKey: string): Promise<void> {
  await mutateServiceState(workspaceId, serviceKey, "PATCH", { status: "active" });
}

export async function removeServiceState(workspaceId: string, serviceKey: string): Promise<void> {
  await mutateServiceState(workspaceId, serviceKey, "DELETE");
}

export async function provisionWorkspace(input: ProvisionWorkspaceInput): Promise<ProvisionWorkspaceResult> {
  assertValidInput(input);

  const workspace = await resolveWorkspace(input);
  const normalizedEmail = normalizeEmail(input.primaryAdminEmail);
  let existingUser = await findUserByEmail(normalizedEmail);
  let inviteSent = false;
  let inviteSentAt: string | null = null;

  if (!existingUser) {
    const invite = await inviteUserByEmail(normalizedEmail, input, workspace);
    existingUser = invite.user?.id ? { id: invite.user.id, email: invite.user.email ?? normalizedEmail } : null;
    inviteSent = true;
    inviteSentAt = new Date().toISOString();
  }

  const membership = existingUser?.id
    ? await ensureMembership(existingUser.id, workspace.id, normalizeWorkspaceRole(input.initialRole))
    : null;
  const invitation = existingUser?.id
    ? null
    : await upsertInvitation(
        workspace.id,
        normalizedEmail,
        normalizeWorkspaceRole(input.initialRole),
        input.provisionedByUserId,
        input.notes,
        {
          sentAt: inviteSentAt,
          deliveryStatus: inviteSent ? "sent" : "pending_unsent",
        }
      );

  await upsertEntitlements(workspace.id, input.products, input.notes);
  await upsertServiceStates(workspace.id, input.services, input.notes);
  const entitlements = await getWorkspaceEntitlements(workspace.id);
  const services = await getWorkspaceServiceStates(workspace.id);

  if (invitation?.id) {
    await logAuditEvent({
      orgId: workspace.id,
      actorUserId: input.provisionedByUserId,
      eventType: inviteSent ? "workspace_invitation_sent" : "workspace_invitation_recorded",
      entityType: "workspace_invitation",
      entityId: invitation.id,
      metadata: {
        invitedEmail: normalizedEmail,
        role: normalizeWorkspaceRole(input.initialRole),
      },
    });
  } else if (membership) {
    await logAuditEvent({
      orgId: workspace.id,
      actorUserId: input.provisionedByUserId,
      eventType: membership.created ? "workspace_membership_prepared" : "workspace_membership_confirmed",
      entityType: "membership",
      entityId: membership.userId,
      metadata: {
        memberUserId: membership.userId,
        role: membership.role,
        email: normalizedEmail,
      },
    });
  }

  return {
    workspace,
    invitation: {
      id: invitation?.id,
      email: normalizedEmail,
      status: membership
        ? inviteSent
          ? "invitation_sent"
          : membership.created
            ? "membership_prepared"
            : "existing_membership"
        : invitation
          ? inviteSent
            ? "invitation_sent"
            : "invitation_recorded"
          : inviteSent
            ? "invitation_sent"
            : "invitation_recorded",
      role: normalizeWorkspaceRole(input.initialRole),
      invitationStatus: invitation?.status,
      createdAt: invitation?.created_at ?? undefined,
    },
    membership,
    entitlements,
    services,
  };
}

export async function createWorkspaceInvitation(input: {
  workspaceId: string;
  email: string;
  role: WorkspaceRole;
  invitedByUserId: string;
  invitedByEmail?: string | null;
  inviteRedirectTo?: string;
}) {
  const workspace = await getWorkspaceById(input.workspaceId);
  if (!workspace) {
    throw new Error("Workspace not found.");
  }

  const normalizedEmail = normalizeEmail(input.email);
  const normalizedRole = normalizeWorkspaceRole(input.role);
  let existingUser = await findUserByEmail(normalizedEmail);
  let inviteSent = false;
  let inviteSentAt: string | null = null;

  if (!existingUser) {
    const invite = await inviteUserByEmail(
      normalizedEmail,
      {
        workspaceMode: "existing",
        workspaceId: workspace.id,
        primaryAdminEmail: normalizedEmail,
        initialRole: normalizedRole,
        products: [],
        services: [],
        provisionedByUserId: input.invitedByUserId,
        inviteRedirectTo: input.inviteRedirectTo,
      },
      workspace
    );
    existingUser = invite.user?.id ? { id: invite.user.id, email: invite.user.email ?? normalizedEmail } : null;
    inviteSent = true;
    inviteSentAt = new Date().toISOString();
  }

  const membership = existingUser?.id
    ? await ensureMembership(existingUser.id, workspace.id, normalizedRole)
    : null;
  const invitation = existingUser?.id
    ? null
    : await upsertInvitation(
        workspace.id,
        normalizedEmail,
        normalizedRole,
        input.invitedByUserId,
        undefined,
        {
          sentAt: inviteSentAt,
          deliveryStatus: inviteSent ? "sent" : "pending_unsent",
        }
      );

  if (invitation?.id) {
    await logAuditEvent({
      orgId: workspace.id,
      actorUserId: input.invitedByUserId,
      actorEmail: input.invitedByEmail ?? null,
      eventType: inviteSent ? "workspace_invitation_sent" : "workspace_invitation_recorded",
      entityType: "workspace_invitation",
      entityId: invitation.id,
      metadata: {
        invitedEmail: normalizedEmail,
        role: normalizedRole,
      },
    });
  } else if (membership) {
    await logAuditEvent({
      orgId: workspace.id,
      actorUserId: input.invitedByUserId,
      actorEmail: input.invitedByEmail ?? null,
      eventType: membership.created ? "workspace_membership_prepared" : "workspace_membership_confirmed",
      entityType: "membership",
      entityId: membership.userId,
      metadata: {
        memberUserId: membership.userId,
        role: membership.role,
        email: normalizedEmail,
      },
    });
  }

  return {
    workspace,
    invitation: invitation ? normalizeWorkspaceInvitation(invitation) : null,
    membership,
    email: normalizedEmail,
    role: normalizedRole,
    inviteSent,
  };
}
