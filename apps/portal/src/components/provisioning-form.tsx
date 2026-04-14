"use client";

import { useEffect, useMemo, useState } from "react";
import {
  AppSurface,
  Button,
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Textarea,
} from "@canopy/ui";
import type { PortalWorkspace, ProductKey, WorkspaceRole } from "@/lib/platform";
import type { WorkspaceAdminInvitation, WorkspaceEntitlement, WorkspaceServiceState } from "@/lib/provisioning";
import { DEFAULT_INVITE_TEMPLATE, renderInviteTemplate, type InviteTemplate } from "@/lib/invite-template";

const PORTAL_SESSION_REFRESH_EVENT = "canopy:portal-session-refresh";

type ProvisioningFormProps = {
  workspaces: PortalWorkspace[];
  invitations: WorkspaceAdminInvitation[];
  activeWorkspaceId?: string | null;
  canManageProductAccess: boolean;
  canManageInviteTemplate: boolean;
  currentUserEmail: string;
};

type WorkspaceSetupResult = {
  workspace: PortalWorkspace;
  entitlements: Array<{
    productKey: string;
    status: string;
    setupState: string;
    planKey?: string;
  }>;
  services: Array<{
    serviceKey: string;
    status: string;
    setupState: string;
  }>;
};

const ROLE_OPTIONS: Array<{ value: WorkspaceRole; label: string }> = [
  { value: "owner", label: "Owner" },
  { value: "admin", label: "Admin" },
  { value: "staff", label: "Staff" },
  { value: "social_media", label: "Social Media" },
  { value: "uploader", label: "Uploader" },
  { value: "viewer", label: "Viewer" },
];

function slugify(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

type InvitationActionResult = {
  workspace?: PortalWorkspace;
  invitation?: WorkspaceAdminInvitation | null;
  membership?: {
    userId: string;
    role: WorkspaceRole;
    created: boolean;
  } | null;
  email?: string;
  role?: WorkspaceRole;
  inviteSent?: boolean;
};

function storedInvitationStatusLabel(status: WorkspaceAdminInvitation["status"]) {
  if (status === "accepted") return "Accepted";
  if (status === "cancelled") return "Cancelled";
  return "Pending";
}

function deliveryStatusLabel(invitation: WorkspaceAdminInvitation) {
  if (invitation.status !== "pending") {
    return storedInvitationStatusLabel(invitation.status);
  }

  if (invitation.deliveryStatus === "sent") {
    return "Invite sent";
  }

  if (invitation.deliveryStatus === "failed") {
    return "Send failed";
  }

  return "Needs resend";
}

function serviceLabel(key: string) {
  if (key === "school-website-setup") return "School Website Setup";
  if (key === "creative-retainer") return "Creative Retainer";
  return key;
}

function productLabel(key: ProductKey) {
  const labels: Record<ProductKey, string> = {
    photovault: "PhotoVault",
    canopy_web: "Canopy Website",
    create_canopy: "Canopy Create",
    publish_canopy: "Canopy Publish",
    stories_canopy: "Canopy Stories",
    community_canopy: "Canopy Community",
    reach_canopy: "Canopy Reach",
    assist_canopy: "Canopy Assistant",
    insights_canopy: "Canopy Insights",
    website_setup: "School Website Setup",
    design_support: "Creative Retainer",
    communications_support: "Communications Support",
  };
  return labels[key] ?? key;
}

function entitlementStatusLabel(status: WorkspaceEntitlement["status"]) {
  if (status === "paused") return "Paused";
  if (status === "pilot") return "Pilot";
  if (status === "trial") return "Trial";
  return "Active";
}

function serviceStatusLabel(service: WorkspaceServiceState) {
  const status = service.status === "active" ? "Active" : service.status === "paused" ? "Paused" : service.status === "inactive" ? "Inactive" : "Available";
  return `${status} \u00b7 ${service.setupState}`;
}

function deriveProvisioningSummary(
  invitations: WorkspaceAdminInvitation[],
  entitlements: WorkspaceEntitlement[],
  services: WorkspaceServiceState[]
) {
  const pendingInvitations = invitations.filter((invitation) => invitation.status === "pending");
  const acceptedInvitations = invitations.filter((invitation) => invitation.status === "accepted");
  const cancelledInvitations = invitations.filter((invitation) => invitation.status === "cancelled");
  const hasProvisionedAccess = entitlements.length > 0 || services.length > 0;
  const hasDeliveryProblem = pendingInvitations.some((invitation) => invitation.deliveryStatus !== "sent");

  if (hasDeliveryProblem) {
    return {
      label: "Incomplete",
      detail: "A pending invitation still needs to be sent or resent before provisioning is complete.",
      tone: "border-amber-200 bg-amber-50/80 text-amber-900",
    };
  }

  if (pendingInvitations.length > 0) {
    return {
      label: "Invited",
      detail: "An invitation has been sent and is still awaiting acceptance.",
      tone: "border-sky-200 bg-sky-50/80 text-sky-900",
    };
  }

  if (acceptedInvitations.length > 0 && hasProvisionedAccess) {
    return {
      label: "Active",
      detail: "Invitation acceptance is complete and the workspace has active products or services.",
      tone: "border-emerald-200 bg-emerald-50/80 text-emerald-900",
    };
  }

  if (acceptedInvitations.length > 0) {
    return {
      label: "Accepted",
      detail: "The invitation has been accepted, but products or services still need review before the workspace is fully active.",
      tone: "border-indigo-200 bg-indigo-50/80 text-indigo-900",
    };
  }

  if (hasProvisionedAccess) {
    return {
      label: "Active",
      detail: "The workspace already has active products or services and no pending invitation work.",
      tone: "border-emerald-200 bg-emerald-50/80 text-emerald-900",
    };
  }

  if (cancelledInvitations.length > 0) {
    return {
      label: "Incomplete",
      detail: "Past invitation activity exists, but the workspace does not currently show active provisioning.",
      tone: "border-amber-200 bg-amber-50/80 text-amber-900",
    };
  }

  return {
    label: "Not started",
    detail: "No invitation, product, or service setup is visible yet for this workspace.",
    tone: "border-slate-200 bg-slate-50/80 text-slate-900",
  };
}

function recommendedProvisioningAction(summaryLabel: string) {
  if (summaryLabel === "Incomplete") {
    return "Resend the pending admin invitation, then confirm the school has the right products and services.";
  }
  if (summaryLabel === "Invited") {
    return "Wait for invite acceptance, or resend the invite if the school has not received it yet.";
  }
  if (summaryLabel === "Accepted") {
    return "Review products and services next so the workspace is fully active before launch.";
  }
  if (summaryLabel === "Active") {
    return "Check whether any products, services, or owner details need an update for this workspace.";
  }
  return "Create the workspace setup first, then invite or assign the school admin as the next step.";
}

export function ProvisioningForm({
  workspaces,
  invitations,
  activeWorkspaceId,
  canManageProductAccess,
  canManageInviteTemplate,
  currentUserEmail,
}: ProvisioningFormProps) {
  const initialWorkspaceId =
    (activeWorkspaceId && workspaces.some((workspace) => workspace.id === activeWorkspaceId) ? activeWorkspaceId : null)
    ?? workspaces[0]?.id
    ?? "";
  const [workspaceMode, setWorkspaceMode] = useState<"existing" | "new">("existing");
  const [workspaceId, setWorkspaceId] = useState(initialWorkspaceId);
  const [workspaceName, setWorkspaceName] = useState("");
  const [workspaceSlug, setWorkspaceSlug] = useState("");
  const [primaryAdminEmail, setPrimaryAdminEmail] = useState("");
  const [initialRole, setInitialRole] = useState<WorkspaceRole>("owner");
  const [enablePhotoVault, setEnablePhotoVault] = useState(false);
  const [photoVaultSetupState, setPhotoVaultSetupState] = useState("ready");
  const [enableStories, setEnableStories] = useState(false);
  const [storiesSetupState, setStoriesSetupState] = useState("ready");
  const [enableCreate, setEnableCreate] = useState(false);
  const [createSetupState, setCreateSetupState] = useState("ready");
  const [enableCommunity, setEnableCommunity] = useState(false);
  const [communitySetupState, setCommunitySetupState] = useState("ready");
  const [enableReach, setEnableReach] = useState(false);
  const [reachSetupState, setReachSetupState] = useState("ready");
  const [enableWebsiteSetup, setEnableWebsiteSetup] = useState(false);
  const [websiteSetupState, setWebsiteSetupState] = useState("setup");
  const [enableCreativeRetainer, setEnableCreativeRetainer] = useState(false);
  const [creativeRetainerState, setCreativeRetainerState] = useState("ready");
  const [notes, setNotes] = useState("");
  const [busy, setBusy] = useState(false);
  const [inviteBusy, setInviteBusy] = useState(false);
  const [resendId, setResendId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [inviteError, setInviteError] = useState<string | null>(null);
  const [inviteStatus, setInviteStatus] = useState<string | null>(null);
  const [result, setResult] = useState<WorkspaceSetupResult | null>(null);
  const [invitationRows, setInvitationRows] = useState<WorkspaceAdminInvitation[]>(invitations);
  const [currentEntitlements, setCurrentEntitlements] = useState<WorkspaceEntitlement[]>([]);
  const [currentServices, setCurrentServices] = useState<WorkspaceServiceState[]>([]);
  const [entitlementsLoading, setEntitlementsLoading] = useState(false);
  const [servicesLoading, setServicesLoading] = useState(false);
  const [entitlementActionId, setEntitlementActionId] = useState<string | null>(null);
  const [serviceActionId, setServiceActionId] = useState<string | null>(null);
  const [templateSubject, setTemplateSubject] = useState(DEFAULT_INVITE_TEMPLATE.subject);
  const [templateBody, setTemplateBody] = useState(DEFAULT_INVITE_TEMPLATE.body);
  const [templateSignature, setTemplateSignature] = useState(DEFAULT_INVITE_TEMPLATE.signature);
  const [templateLoading, setTemplateLoading] = useState(false);
  const [templateSaving, setTemplateSaving] = useState(false);
  const [templateStatus, setTemplateStatus] = useState<string | null>(null);

  const selectedWorkspace = useMemo(
    () => workspaces.find((workspace) => workspace.id === workspaceId) ?? null,
    [workspaceId, workspaces]
  );

  useEffect(() => {
    if (workspaceMode !== "existing") {
      return;
    }

    const preferredWorkspaceId =
      (activeWorkspaceId && workspaces.some((workspace) => workspace.id === activeWorkspaceId) ? activeWorkspaceId : null)
      ?? workspaces[0]?.id
      ?? "";

    if (!workspaceId || !workspaces.some((workspace) => workspace.id === workspaceId)) {
      setWorkspaceId(preferredWorkspaceId);
    }
  }, [activeWorkspaceId, workspaceId, workspaceMode, workspaces]);

  function notifyPortalSessionRefresh() {
    if (typeof window === "undefined") {
      return;
    }

    window.dispatchEvent(new CustomEvent(PORTAL_SESSION_REFRESH_EVENT));
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError(null);
    setResult(null);

    const response = await fetch("/api/save-workspace-provisioning", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        workspaceMode,
        workspaceId: workspaceMode === "existing" ? workspaceId : undefined,
        workspaceName: workspaceMode === "new" ? workspaceName.trim() : undefined,
        workspaceSlug: workspaceMode === "new" ? slugify(workspaceSlug || workspaceName) : undefined,
        products: [
          ...(enablePhotoVault
            ? [{ productKey: "photovault", status: "active", setupState: photoVaultSetupState }]
            : []),
          ...(enableStories
            ? [{ productKey: "stories_canopy", status: "active", setupState: storiesSetupState }]
            : []),
          ...(enableCreate
            ? [{ productKey: "create_canopy", status: "active", setupState: createSetupState }]
            : []),
          ...(enableCommunity
            ? [{ productKey: "community_canopy", status: "active", setupState: communitySetupState }]
            : []),
          ...(enableReach
            ? [{ productKey: "reach_canopy", status: "active", setupState: reachSetupState }]
            : []),
        ],
        services: [
          ...(enableWebsiteSetup
            ? [{ serviceKey: "school-website-setup", status: "active", setupState: websiteSetupState }]
            : []),
          ...(enableCreativeRetainer
            ? [{ serviceKey: "creative-retainer", status: "active", setupState: creativeRetainerState }]
            : []),
        ],
        notes,
      }),
    });

    const body = (await response.json()) as { result?: WorkspaceSetupResult; error?: string };
    setBusy(false);

    if (!response.ok || !body.result) {
      setError(body.error ?? "Workspace setup failed.");
      return;
    }

    const nextResult = body.result;
    setResult(nextResult);
    if (workspaceMode === "existing" && nextResult.workspace.id === workspaceId) {
      setCurrentEntitlements(
        nextResult.entitlements.map((item) => ({
          productKey: item.productKey as ProductKey,
          status: item.status as WorkspaceEntitlement["status"],
          setupState: item.setupState as WorkspaceEntitlement["setupState"],
          planKey: item.planKey,
        }))
      );
      setCurrentServices(
        nextResult.services.map((item) => ({
          serviceKey: item.serviceKey,
          status: item.status as WorkspaceServiceState["status"],
          setupState: item.setupState as WorkspaceServiceState["setupState"],
        }))
      );
    }
    if (workspaceMode === "new") {
      setWorkspaceMode("existing");
      setWorkspaceId(nextResult.workspace.id);
    }
    setEnablePhotoVault(false);
    setEnableStories(false);
    setEnableCreate(false);
    setEnableCommunity(false);
    setEnableReach(false);
    setEnableWebsiteSetup(false);
    setEnableCreativeRetainer(false);
    setNotes("");
    notifyPortalSessionRefresh();
  }

  async function submitAdminAssignment() {
    if (workspaceMode !== "existing" || !workspaceId) {
      setInviteError("Create or select a workspace first, then invite or assign the admin.");
      return;
    }

    if (!primaryAdminEmail.trim()) {
      setInviteError("School-admin email is required.");
      return;
    }

    setInviteBusy(true);
    setInviteError(null);
    setInviteStatus(null);

    try {
      if (canManageInviteTemplate) {
        const templateResponse = await fetch("/api/invite-template", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            workspaceId,
            subject: templateSubject,
            body: templateBody,
            signature: templateSignature,
          }),
        });

        const templateBodyResult = (await templateResponse.json()) as { ok?: boolean; error?: string };
        if (!templateResponse.ok || !templateBodyResult.ok) {
          setInviteError(templateBodyResult.error ?? "Failed to save invite template.");
          return;
        }
      }

      const response = await fetch("/api/workspace-invitations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          workspaceId,
          email: primaryAdminEmail.trim(),
          role: initialRole,
        }),
      });

      const body = (await response.json()) as { result?: InvitationActionResult; error?: string };
      if (!response.ok || !body.result) {
        setInviteError(body.error ?? "Admin invite failed.");
        return;
      }

      const invitation = body.result.invitation;
      if (invitation) {
        setInvitationRows((current) => {
          const next = current.filter((row) => row.id !== invitation.id);
          next.unshift(invitation);
          return next;
        });
        setInviteStatus(body.result.inviteSent ? "Admin invite sent." : "Admin invitation recorded.");
      } else if (body.result.membership) {
        setInviteStatus(
          body.result.membership.created
            ? `Admin access assigned as ${body.result.membership.role}.`
            : `Admin already has ${body.result.membership.role} access.`
        );
      } else {
        setInviteStatus("Admin access updated.");
      }
    } catch (error) {
      setInviteError(error instanceof Error ? error.message : "Admin invite failed.");
    } finally {
      setInviteBusy(false);
    }
  }

  const enabledProductKeys = new Set(currentEntitlements.map((e) => e.productKey));
  const enabledServiceKeys = new Set(currentServices.map((service) => service.serviceKey));
  const selectedWorkspaceId = workspaceMode === "existing" ? workspaceId : result?.workspace.id ?? null;
  const workspaceInvitations = invitationRows.filter((row) => row.workspaceId === selectedWorkspaceId);
  const provisioningSummary = useMemo(
    () => deriveProvisioningSummary(workspaceInvitations, currentEntitlements, currentServices),
    [currentEntitlements, currentServices, workspaceInvitations]
  );
  const provisioningNextAction = useMemo(
    () => recommendedProvisioningAction(provisioningSummary.label),
    [provisioningSummary.label]
  );
  const latestPendingInvitation = useMemo(
    () => workspaceInvitations.find((row) => row.status === "pending") ?? workspaceInvitations[0] ?? null,
    [workspaceInvitations]
  );
  const invitePreview = renderInviteTemplate(
    {
      subject: templateSubject,
      body: templateBody,
      signature: templateSignature,
    },
    {
      schoolName: selectedWorkspace?.displayName ?? (workspaceName || "School"),
      inviteeEmail: primaryAdminEmail || "user@school.edu",
      senderName: currentUserEmail || "Canopy",
    }
  );

  useEffect(() => {
    if (workspaceMode !== "existing") {
      return;
    }

    if (!latestPendingInvitation) {
      setPrimaryAdminEmail("");
      setInitialRole("owner");
      return;
    }

    setPrimaryAdminEmail(latestPendingInvitation.email);
    setInitialRole(latestPendingInvitation.role);
  }, [latestPendingInvitation, workspaceMode]);

  useEffect(() => {
    if (workspaceMode !== "existing" || !workspaceId) {
      setCurrentEntitlements([]);
      setCurrentServices([]);
      return;
    }
    const controller = new AbortController();
    setEntitlementsLoading(true);
    setServicesLoading(true);
    setCurrentEntitlements([]);
    setCurrentServices([]);
    fetch(`/api/get-workspace-entitlements?workspaceId=${encodeURIComponent(workspaceId)}`, { signal: controller.signal })
      .then((res) => res.json())
      .then((body: { entitlements?: WorkspaceEntitlement[]; error?: string }) => {
        if (!controller.signal.aborted) setCurrentEntitlements(body.entitlements ?? []);
      })
      .catch(() => { /* aborted or failed — leave empty */ })
      .finally(() => { if (!controller.signal.aborted) setEntitlementsLoading(false); });
    fetch(`/api/get-workspace-services?workspaceId=${encodeURIComponent(workspaceId)}`, { signal: controller.signal })
      .then((res) => res.json())
      .then((body: { services?: WorkspaceServiceState[]; error?: string }) => {
        if (!controller.signal.aborted) setCurrentServices(body.services ?? []);
      })
      .catch(() => { /* aborted or failed — leave empty */ })
      .finally(() => { if (!controller.signal.aborted) setServicesLoading(false); });
    return () => controller.abort();
  }, [workspaceId, workspaceMode]);

  useEffect(() => {
    if (!canManageInviteTemplate) {
      return;
    }

    if (workspaceMode === "new") {
      setTemplateSubject(DEFAULT_INVITE_TEMPLATE.subject);
      setTemplateBody(DEFAULT_INVITE_TEMPLATE.body);
      setTemplateSignature(DEFAULT_INVITE_TEMPLATE.signature);
      setTemplateStatus(null);
      setTemplateLoading(false);
      return;
    }

    if (!workspaceId) {
      return;
    }

    const controller = new AbortController();
    setTemplateLoading(true);
    setTemplateStatus(null);

    fetch(`/api/invite-template?workspaceId=${encodeURIComponent(workspaceId)}`, { signal: controller.signal })
      .then((res) => res.json())
      .then((body: { template?: InviteTemplate; error?: string }) => {
        if (controller.signal.aborted) {
          return;
        }
        const template = body.template ?? DEFAULT_INVITE_TEMPLATE;
        setTemplateSubject(template.subject);
        setTemplateBody(template.body);
        setTemplateSignature(template.signature);
      })
      .catch(() => {
        if (!controller.signal.aborted) {
          setTemplateSubject(DEFAULT_INVITE_TEMPLATE.subject);
          setTemplateBody(DEFAULT_INVITE_TEMPLATE.body);
          setTemplateSignature(DEFAULT_INVITE_TEMPLATE.signature);
          setTemplateStatus("Failed to load invite template.");
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setTemplateLoading(false);
        }
      });

    return () => controller.abort();
  }, [canManageInviteTemplate, workspaceId, workspaceMode]);

  async function saveInviteTemplate() {
    if (!canManageInviteTemplate || workspaceMode !== "existing" || !workspaceId) {
      return;
    }

    setTemplateSaving(true);
    setTemplateStatus(null);

    const response = await fetch("/api/invite-template", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        workspaceId,
        subject: templateSubject,
        body: templateBody,
        signature: templateSignature,
      }),
    });

    const body = (await response.json()) as { ok?: boolean; message?: string; error?: string };
    setTemplateSaving(false);

    if (!response.ok || !body.ok) {
      setTemplateStatus(body.error ?? "Failed to save invite template.");
      return;
    }

    setTemplateStatus(body.message ?? "Invite template saved.");
  }

  async function handleEntitlementAction(productKey: ProductKey, action: "pause" | "resume" | "remove") {
    if (!canManageProductAccess) {
      setError("Only Super Admin can change products.");
      return;
    }
    const id = `${productKey}:${action}`;
    setEntitlementActionId(id);
    setError(null);
    const response = await fetch("/api/update-entitlement", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ workspaceId, productKey, action }),
    });
    const body = (await response.json()) as { ok?: boolean; error?: string };
    setEntitlementActionId(null);
    if (!response.ok || !body.ok) {
      setError(body.error ?? "Action failed.");
      return;
    }
    setCurrentEntitlements((prev) => {
      if (action === "remove") {
        if (productKey === "photovault") setEnablePhotoVault(false);
        if (productKey === "stories_canopy") setEnableStories(false);
        if (productKey === "create_canopy") setEnableCreate(false);
        if (productKey === "community_canopy") setEnableCommunity(false);
        if (productKey === "reach_canopy") setEnableReach(false);
        return prev.filter((e) => e.productKey !== productKey);
      }
      return prev.map((e) => e.productKey === productKey ? { ...e, status: action === "pause" ? "paused" : "active" } : e);
    });
    notifyPortalSessionRefresh();
  }

  async function handleServiceAction(serviceKey: string, action: "pause" | "resume" | "remove") {
    if (!canManageProductAccess) {
      setError("Only Super Admin can change services.");
      return;
    }
    const id = `${serviceKey}:${action}`;
    setServiceActionId(id);
    setError(null);
    const response = await fetch("/api/update-service-state", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ workspaceId, serviceKey, action }),
    });
    const body = (await response.json()) as { ok?: boolean; error?: string };
    setServiceActionId(null);
    if (!response.ok || !body.ok) {
      setError(body.error ?? "Action failed.");
      return;
    }
    setCurrentServices((prev) => {
      if (action === "remove") {
        if (serviceKey === "school-website-setup") setEnableWebsiteSetup(false);
        if (serviceKey === "creative-retainer") setEnableCreativeRetainer(false);
        return prev.filter((service) => service.serviceKey !== serviceKey);
      }
      return prev.map((service) =>
        service.serviceKey === serviceKey
          ? { ...service, status: action === "pause" ? "paused" : "active" }
          : service
      );
    });
    notifyPortalSessionRefresh();
  }

  async function resendInvitation(invitationId: string) {
    setError(null);
    setResendId(invitationId);

    const response = await fetch("/api/resend-workspace-invitation", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ invitationId }),
    });

    const body = (await response.json()) as { invitation?: WorkspaceAdminInvitation; error?: string };
    setResendId(null);

    if (!response.ok || !body.invitation) {
      setError(body.error ?? "Resend failed.");
      return;
    }

    setInvitationRows((current) =>
      current.map((row) => (row.id === body.invitation?.id ? body.invitation : row))
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5">
        <AppSurface variant="clear" padding="md" className="sm:p-6">
          <p className="eyebrow">Workspace</p>
          <h3 className="mb-4 text-[1.15rem] font-semibold tracking-[-0.03em] text-ink">Choose a workspace</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="space-y-2">
              <Label>Mode</Label>
              <Select
                value={workspaceMode}
                onValueChange={(value) => setWorkspaceMode(value === "new" ? "new" : "existing")}
              >
                <SelectTrigger className="text-sm">
                  <SelectValue placeholder="Select existing" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="existing">Select existing</SelectItem>
                  <SelectItem value="new">Create new</SelectItem>
                </SelectContent>
              </Select>
            </label>

            {workspaceMode === "existing" ? (
              <label className="space-y-2">
                <Label>Workspace</Label>
                <Select
                  value={workspaceId}
                  onValueChange={setWorkspaceId}
                >
                  <SelectTrigger className="text-sm">
                    <SelectValue placeholder="Select a workspace" />
                  </SelectTrigger>
                  <SelectContent>
                  {workspaces.map((workspace) => (
                    <SelectItem key={workspace.id} value={workspace.id}>
                      {workspace.displayName}
                    </SelectItem>
                  ))}
                  </SelectContent>
                </Select>
              </label>
            ) : (
              <>
                <label className="space-y-2">
                  <Label>Workspace name</Label>
                  <Input
                    value={workspaceName}
                    onChange={(event) => {
                      const next = event.target.value;
                      setWorkspaceName(next);
                      if (!workspaceSlug) {
                        setWorkspaceSlug(slugify(next));
                      }
                    }}
                    className="text-sm"
                    placeholder="Berkeley Adult School"
                    required
                  />
                </label>
                <label className="space-y-2">
                  <Label>Workspace slug</Label>
                  <Input
                    value={workspaceSlug}
                    onChange={(event) => setWorkspaceSlug(slugify(event.target.value))}
                    className="text-sm"
                    placeholder="berkeley-adult-school"
                    required
                  />
                </label>
              </>
            )}
          </div>
          {workspaceMode === "existing" && selectedWorkspace ? (
            <p className="mt-3 text-sm text-[var(--text-muted)]">Provisioning will update access for {selectedWorkspace.displayName}.</p>
          ) : null}
        </AppSurface>

        <AppSurface variant="clear" padding="md" className="sm:p-6">
          <p className="eyebrow">Primary Admin</p>
          <h3 className="mb-4 text-[1.15rem] font-semibold tracking-[-0.03em] text-ink">Assign the initial admin</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="space-y-2">
              <Label>School-admin email</Label>
              <Input
                type="email"
                value={primaryAdminEmail}
                onChange={(event) => setPrimaryAdminEmail(event.target.value)}
                className="text-sm"
                placeholder="admin@school.org"
              />
            </label>
            <label className="space-y-2">
              <Label>Initial role</Label>
              <Select
                value={initialRole}
                onValueChange={(value) => setInitialRole(value as WorkspaceRole)}
              >
                <SelectTrigger className="text-sm">
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                {ROLE_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
                </SelectContent>
              </Select>
            </label>
          </div>
          {workspaceMode === "existing" && latestPendingInvitation ? (
            <p className="mt-3 text-sm text-[var(--text-muted)]">
              Prefilled from the latest saved invitation for this workspace.
            </p>
          ) : null}
          {workspaceMode === "new" ? (
            <p className="mt-3 text-sm text-[var(--text-muted)]">
              Create the workspace first, then invite or assign the school admin as a separate step.
            </p>
          ) : null}
          <div className="mt-4 flex items-center gap-3">
            <Button
              type="button"
              disabled={inviteBusy || workspaceMode !== "existing" || !workspaceId}
              variant="primary"
              onClick={() => void submitAdminAssignment()}
            >
              {inviteBusy ? "Saving admin..." : "Invite or assign admin"}
            </Button>
          </div>
          {inviteError ? (
            <div className="mt-4 rounded-xl border border-[rgba(185,28,28,0.18)] bg-[rgba(254,242,242,0.92)] px-3 py-2 text-sm text-[rgb(153,27,27)]">
              {inviteError}
            </div>
          ) : null}
          {inviteStatus ? (
            <div className="mt-4 rounded-xl border border-[rgba(15,31,61,0.1)] bg-white/60 px-4 py-3 text-sm text-ink">
              {inviteStatus}
            </div>
          ) : null}
        </AppSurface>

        <AppSurface variant="clear" padding="md" className="sm:p-6">
          <p className="eyebrow">Invite Email</p>
          <div className="mb-4 flex items-start justify-between gap-4">
            <div>
              <h3 className="mb-1 text-[1.15rem] font-semibold tracking-[-0.03em] text-ink">Invite message template</h3>
              <p className="m-0 text-sm text-[var(--text-muted)]">
                Placeholders: {"{{school_name}}"}, {"{{invitee_email}}"}, {"{{sender_name}}"}
              </p>
            </div>
            {workspaceMode === "existing" && canManageInviteTemplate ? (
              <Button
                type="button"
                variant="secondary"
                size="sm"
                disabled={templateSaving || templateLoading || !workspaceId}
                onClick={() => void saveInviteTemplate()}
              >
                {templateSaving ? "Saving..." : "Save template"}
              </Button>
            ) : null}
          </div>

          {canManageInviteTemplate ? (
            <>
              <div className="space-y-4">
                <label className="space-y-2">
                  <Label>Subject</Label>
                  <Input
                    type="text"
                    value={templateSubject}
                    onChange={(event) => setTemplateSubject(event.target.value)}
                    className="text-sm"
                    required
                  />
                </label>
                <label className="space-y-2">
                  <Label>Body</Label>
                  <Textarea
                    value={templateBody}
                    onChange={(event) => setTemplateBody(event.target.value)}
                    className="min-h-32"
                    required
                  />
                </label>
                <label className="space-y-2">
                  <Label>Signature</Label>
                  <Input
                    type="text"
                    value={templateSignature}
                    onChange={(event) => setTemplateSignature(event.target.value)}
                    className="text-sm"
                    required
                  />
                </label>
              </div>

              <div className="mt-4 rounded-[22px] border border-[var(--app-surface-soft-border)] bg-white/52 p-4">
                <p className="m-0 text-sm font-semibold text-ink">{invitePreview.subject}</p>
                <p className="m-0 mt-3 whitespace-pre-wrap text-sm text-[var(--text-muted)]">{invitePreview.body}</p>
                <p className="m-0 mt-3 text-sm text-[var(--text-muted)]">{invitePreview.signature}</p>
              </div>

              <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-[var(--text-muted)]">
                {templateLoading ? <p className="m-0">Loading saved template...</p> : null}
                {!templateLoading && workspaceMode === "new" ? (
                  <p className="m-0">This draft will be saved to the new workspace when you provision it.</p>
                ) : null}
                {templateStatus ? <p className="m-0">{templateStatus}</p> : null}
              </div>
            </>
          ) : (
            <p className="text-sm text-[var(--text-muted)]">Only Super Admin can edit invite templates.</p>
          )}
        </AppSurface>

        {workspaceMode === "existing" && (
          <AppSurface variant="clear" padding="md" className="sm:p-6">
            <p className="eyebrow">Provisioning Status</p>
            <h3 className="mb-4 text-[1.15rem] font-semibold tracking-[-0.03em] text-ink">Current workspace readiness</h3>
            <div className={`rounded-[22px] border px-4 py-4 ${provisioningSummary.tone}`}>
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="m-0 text-sm font-semibold">{provisioningSummary.label}</p>
                  <p className="m-0 mt-1 text-sm opacity-80">{provisioningSummary.detail}</p>
                </div>
              </div>
              <div className="mt-4 grid gap-3 text-sm sm:grid-cols-4">
                <p className="m-0"><span className="font-semibold">Products:</span> {currentEntitlements.length}</p>
                <p className="m-0"><span className="font-semibold">Services:</span> {currentServices.length}</p>
                <p className="m-0"><span className="font-semibold">Pending invites:</span> {workspaceInvitations.filter((item) => item.status === "pending").length}</p>
                <p className="m-0"><span className="font-semibold">Accepted invites:</span> {workspaceInvitations.filter((item) => item.status === "accepted").length}</p>
              </div>
              <div className="mt-4 rounded-[18px] border border-current/12 bg-white/55 px-4 py-3">
                <p className="m-0 text-[11px] font-semibold uppercase tracking-[0.12em] opacity-70">Recommended next step</p>
                <p className="m-0 mt-1 text-sm font-medium">{provisioningNextAction}</p>
              </div>
            </div>
          </AppSurface>
        )}

        {workspaceMode === "existing" && (
          <AppSurface variant="clear" padding="md" className="sm:p-6">
            <p className="eyebrow">Currently Enabled</p>
            <h3 className="mb-4 text-[1.15rem] font-semibold tracking-[-0.03em] text-ink">Active products for this workspace</h3>
            {entitlementsLoading ? (
              <p className="text-sm text-[var(--text-muted)]">Loading...</p>
            ) : currentEntitlements.length === 0 ? (
              <p className="text-sm text-[var(--text-muted)]">No products currently enabled for this workspace.</p>
            ) : (
              <div className="space-y-2">
                {currentEntitlements.map((ent) => {
                  const isPaused = ent.status === "paused";
                  const pauseId = `${ent.productKey}:pause`;
                  const resumeId = `${ent.productKey}:resume`;
                  const removeId = `${ent.productKey}:remove`;
                  return (
                    <div
                      key={ent.productKey}
                      className="flex items-center justify-between gap-4 rounded-[22px] border border-[var(--app-surface-soft-border)] bg-white/52 px-4 py-3"
                    >
                      <div>
                        <p className="m-0 text-sm font-semibold text-ink">{productLabel(ent.productKey)}</p>
                        <p className="m-0 mt-0.5 text-sm text-[var(--text-muted)]">{entitlementStatusLabel(ent.status)} · {ent.setupState}</p>
                      </div>
                      <div className="flex shrink-0 items-center gap-2">
                        {canManageProductAccess ? (
                          <>
                            {isPaused ? (
                              <Button
                                type="button"
                                size="sm"
                                variant="secondary"
                                disabled={entitlementActionId === resumeId}
                                onClick={() => void handleEntitlementAction(ent.productKey, "resume")}
                              >
                                {entitlementActionId === resumeId ? "Resuming..." : "Resume"}
                              </Button>
                            ) : (
                              <Button
                                type="button"
                                size="sm"
                                variant="secondary"
                                disabled={entitlementActionId === pauseId}
                                onClick={() => void handleEntitlementAction(ent.productKey, "pause")}
                              >
                                {entitlementActionId === pauseId ? "Pausing..." : "Pause"}
                              </Button>
                            )}
                            <Button
                              type="button"
                              size="sm"
                              variant="destructive"
                              disabled={entitlementActionId === removeId}
                              onClick={() => void handleEntitlementAction(ent.productKey, "remove")}
                            >
                              {entitlementActionId === removeId ? "Removing..." : "Remove"}
                            </Button>
                          </>
                        ) : (
                          <p className="m-0 text-sm text-[var(--text-muted)]">Super Admin only</p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </AppSurface>
        )}

        {workspaceMode === "existing" && (
          <AppSurface variant="clear" padding="md" className="sm:p-6">
            <p className="eyebrow">Current Services</p>
            <h3 className="mb-4 text-[1.15rem] font-semibold tracking-[-0.03em] text-ink">Service visibility for this workspace</h3>
            {servicesLoading ? (
              <p className="text-sm text-[var(--text-muted)]">Loading...</p>
            ) : currentServices.length === 0 ? (
              <p className="text-sm text-[var(--text-muted)]">No services currently configured for this workspace.</p>
            ) : (
              <div className="space-y-2">
                {currentServices.map((service) => {
                  const isPaused = service.status === "paused" || service.status === "inactive";
                  const pauseId = `${service.serviceKey}:pause`;
                  const resumeId = `${service.serviceKey}:resume`;
                  const removeId = `${service.serviceKey}:remove`;
                  return (
                    <div
                      key={service.serviceKey}
                      className="flex items-center justify-between gap-4 rounded-[22px] border border-[var(--app-surface-soft-border)] bg-white/52 px-4 py-3"
                    >
                      <div>
                        <p className="m-0 text-sm font-semibold text-ink">{serviceLabel(service.serviceKey)}</p>
                        <p className="m-0 mt-0.5 text-sm text-[var(--text-muted)]">{serviceStatusLabel(service)}</p>
                      </div>
                      <div className="flex shrink-0 items-center gap-2">
                        {canManageProductAccess ? (
                          <>
                            {isPaused ? (
                              <Button
                                type="button"
                                size="sm"
                                variant="secondary"
                                disabled={serviceActionId === resumeId}
                                onClick={() => void handleServiceAction(service.serviceKey, "resume")}
                              >
                                {serviceActionId === resumeId ? "Resuming..." : "Resume"}
                              </Button>
                            ) : (
                              <Button
                                type="button"
                                size="sm"
                                variant="secondary"
                                disabled={serviceActionId === pauseId}
                                onClick={() => void handleServiceAction(service.serviceKey, "pause")}
                              >
                                {serviceActionId === pauseId ? "Pausing..." : "Pause"}
                              </Button>
                            )}
                            <Button
                              type="button"
                              size="sm"
                              variant="destructive"
                              disabled={serviceActionId === removeId}
                              onClick={() => void handleServiceAction(service.serviceKey, "remove")}
                            >
                              {serviceActionId === removeId ? "Removing..." : "Remove"}
                            </Button>
                          </>
                        ) : (
                          <p className="m-0 text-sm text-[var(--text-muted)]">Super Admin only</p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </AppSurface>
        )}

        {canManageProductAccess ? (
          <AppSurface variant="clear" padding="md" className="sm:p-6">
            <p className="eyebrow">Products</p>
            <h3 className="mb-4 text-[1.15rem] font-semibold tracking-[-0.03em] text-ink">Enable workspace apps</h3>
            {!enabledProductKeys.has("photovault") && (
            <div className="rounded-[22px] border border-[var(--app-surface-soft-border)] bg-white/52 p-4">
              <label className="flex items-start justify-between gap-4">
                <div>
                  <p className="m-0 text-sm font-semibold text-ink">PhotoVault</p>
                  <p className="m-0 mt-1 text-sm text-[var(--text-muted)]">Media library, albums, and approved brand assets.</p>
                </div>
                <input
                  type="checkbox"
                  checked={enablePhotoVault}
                  onChange={(event) => setEnablePhotoVault(event.target.checked)}
                  className="mt-1 h-4 w-4"
                />
              </label>
              {enablePhotoVault ? (
                <label className="mt-4 block space-y-2">
                  <Label>Setup state</Label>
                  <Select
                    value={photoVaultSetupState}
                    onValueChange={setPhotoVaultSetupState}
                  >
                    <SelectTrigger className="text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ready">Ready</SelectItem>
                      <SelectItem value="in_setup">In setup</SelectItem>
                      <SelectItem value="not_started">Not started</SelectItem>
                      <SelectItem value="blocked">Blocked</SelectItem>
                    </SelectContent>
                  </Select>
                </label>
              ) : null}
            </div>
          )}

            {!enabledProductKeys.has("stories_canopy") && (
            <div className="mt-4 rounded-[22px] border border-[var(--app-surface-soft-border)] bg-white/52 p-4">
              <label className="flex items-start justify-between gap-4">
                <div>
                  <p className="m-0 text-sm font-semibold text-ink">Canopy Stories</p>
                  <p className="m-0 mt-1 text-sm text-[var(--text-muted)]">Automated success story production — blog, social, and video.</p>
                </div>
                <input
                  type="checkbox"
                  checked={enableStories}
                  onChange={(event) => setEnableStories(event.target.checked)}
                  className="mt-1 h-4 w-4"
                />
              </label>
              {enableStories ? (
                <label className="mt-4 block space-y-2">
                  <Label>Setup state</Label>
                  <Select
                    value={storiesSetupState}
                    onValueChange={setStoriesSetupState}
                  >
                    <SelectTrigger className="text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ready">Ready</SelectItem>
                      <SelectItem value="in_setup">In setup</SelectItem>
                      <SelectItem value="not_started">Not started</SelectItem>
                      <SelectItem value="blocked">Blocked</SelectItem>
                    </SelectContent>
                  </Select>
                </label>
              ) : null}
            </div>
          )}

            {!enabledProductKeys.has("create_canopy") && (
            <div className="mt-4 rounded-[22px] border border-[var(--app-surface-soft-border)] bg-white/52 p-4">
              <label className="flex items-start justify-between gap-4">
                <div>
                  <p className="m-0 text-sm font-semibold text-ink">Canopy Create</p>
                  <p className="m-0 mt-1 text-sm text-[var(--text-muted)]">Creative and web request intake, production tracking, revisions, and delivery.</p>
                </div>
                <input
                  type="checkbox"
                  checked={enableCreate}
                  onChange={(event) => setEnableCreate(event.target.checked)}
                  className="mt-1 h-4 w-4"
                />
              </label>
              {enableCreate ? (
                <label className="mt-4 block space-y-2">
                  <Label>Setup state</Label>
                  <Select
                    value={createSetupState}
                    onValueChange={setCreateSetupState}
                  >
                    <SelectTrigger className="text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ready">Ready</SelectItem>
                      <SelectItem value="in_setup">In setup</SelectItem>
                      <SelectItem value="not_started">Not started</SelectItem>
                      <SelectItem value="blocked">Blocked</SelectItem>
                    </SelectContent>
                  </Select>
                </label>
              ) : null}
            </div>
          )}

            {!enabledProductKeys.has("community_canopy") && (
            <div className="mt-4 rounded-[22px] border border-[var(--app-surface-soft-border)] bg-white/52 p-4">
              <label className="flex items-start justify-between gap-4">
                <div>
                  <p className="m-0 text-sm font-semibold text-ink">Canopy Community</p>
                  <p className="m-0 mt-1 text-sm text-[var(--text-muted)]">Newsletter publishing and school-to-community email communication.</p>
                </div>
                <input
                  type="checkbox"
                  checked={enableCommunity}
                  onChange={(event) => setEnableCommunity(event.target.checked)}
                  className="mt-1 h-4 w-4"
                />
              </label>
              {enableCommunity ? (
                <label className="mt-4 block space-y-2">
                  <Label>Setup state</Label>
                  <Select
                    value={communitySetupState}
                    onValueChange={setCommunitySetupState}
                  >
                    <SelectTrigger className="text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ready">Ready</SelectItem>
                      <SelectItem value="in_setup">In setup</SelectItem>
                      <SelectItem value="not_started">Not started</SelectItem>
                      <SelectItem value="blocked">Blocked</SelectItem>
                    </SelectContent>
                  </Select>
                </label>
              ) : null}
            </div>
          )}

            {!enabledProductKeys.has("reach_canopy") && (
            <div className="mt-4 rounded-[22px] border border-[var(--app-surface-soft-border)] bg-white/52 p-4">
              <label className="flex items-start justify-between gap-4">
                <div>
                  <p className="m-0 text-sm font-semibold text-ink">Canopy Reach</p>
                  <p className="m-0 mt-1 text-sm text-[var(--text-muted)]">Social media scheduling and publishing.</p>
                </div>
                <input
                  type="checkbox"
                  checked={enableReach}
                  onChange={(event) => setEnableReach(event.target.checked)}
                  className="mt-1 h-4 w-4"
                />
              </label>
              {enableReach ? (
                <label className="mt-4 block space-y-2">
                  <Label>Setup state</Label>
                  <Select
                    value={reachSetupState}
                    onValueChange={setReachSetupState}
                  >
                    <SelectTrigger className="text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ready">Ready</SelectItem>
                      <SelectItem value="in_setup">In setup</SelectItem>
                      <SelectItem value="not_started">Not started</SelectItem>
                      <SelectItem value="blocked">Blocked</SelectItem>
                    </SelectContent>
                  </Select>
                </label>
              ) : null}
            </div>
          )}

            {enabledProductKeys.has("photovault") && enabledProductKeys.has("stories_canopy") && enabledProductKeys.has("create_canopy") && enabledProductKeys.has("community_canopy") && enabledProductKeys.has("reach_canopy") && (
              <p className="text-sm text-[var(--text-muted)]">All available products are already enabled for this workspace.</p>
            )}
          </AppSurface>
        ) : (
          <AppSurface variant="clear" padding="md" className="sm:p-6">
            <p className="eyebrow">Products</p>
            <h3 className="mb-2 text-[1.15rem] font-semibold tracking-[-0.03em] text-ink">Enable workspace apps</h3>
            <p className="text-sm text-[var(--text-muted)]">Only Super Admin can add, pause, resume, or remove products.</p>
          </AppSurface>
        )}

        {canManageProductAccess ? (
          <AppSurface variant="clear" padding="md" className="sm:p-6">
            <p className="eyebrow">Services</p>
            <h3 className="mb-4 text-[1.15rem] font-semibold tracking-[-0.03em] text-ink">Set service visibility</h3>
            <div className="grid gap-4 md:grid-cols-2">
              {!enabledServiceKeys.has("school-website-setup") && (
              <div className="rounded-[22px] border border-[var(--app-surface-soft-border)] bg-white/52 p-4">
                <label className="flex items-start justify-between gap-4">
                  <div>
                    <p className="m-0 text-sm font-semibold text-ink">School Website Setup</p>
                    <p className="m-0 mt-1 text-sm text-[var(--text-muted)]">Managed implementation support for a school website.</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={enableWebsiteSetup}
                    onChange={(event) => setEnableWebsiteSetup(event.target.checked)}
                    className="mt-1 h-4 w-4"
                  />
                </label>
                {enableWebsiteSetup ? (
                  <label className="mt-4 block space-y-2">
                    <Label>Setup state</Label>
                    <Select
                      value={websiteSetupState}
                      onValueChange={setWebsiteSetupState}
                    >
                      <SelectTrigger className="text-sm">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="setup">Setup</SelectItem>
                        <SelectItem value="ready">Ready</SelectItem>
                        <SelectItem value="pilot">Pilot</SelectItem>
                      </SelectContent>
                    </Select>
                  </label>
                ) : null}
              </div>
            )}

              {!enabledServiceKeys.has("creative-retainer") && (
              <div className="rounded-[22px] border border-[var(--app-surface-soft-border)] bg-white/52 p-4">
                <label className="flex items-start justify-between gap-4">
                  <div>
                    <p className="m-0 text-sm font-semibold text-ink">Creative Retainer</p>
                    <p className="m-0 mt-1 text-sm text-[var(--text-muted)]">Ongoing design and creative support visibility.</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={enableCreativeRetainer}
                    onChange={(event) => setEnableCreativeRetainer(event.target.checked)}
                    className="mt-1 h-4 w-4"
                  />
                </label>
                {enableCreativeRetainer ? (
                  <label className="mt-4 block space-y-2">
                    <Label>Setup state</Label>
                    <Select
                      value={creativeRetainerState}
                      onValueChange={setCreativeRetainerState}
                    >
                      <SelectTrigger className="text-sm">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ready">Ready</SelectItem>
                        <SelectItem value="setup">Setup</SelectItem>
                        <SelectItem value="pilot">Pilot</SelectItem>
                      </SelectContent>
                    </Select>
                  </label>
                ) : null}
              </div>
            )}
            </div>
            {enabledServiceKeys.has("school-website-setup") && enabledServiceKeys.has("creative-retainer") && (
              <p className="text-sm text-[var(--text-muted)]">All available services are already configured for this workspace.</p>
            )}
          </AppSurface>
        ) : (
          <AppSurface variant="clear" padding="md" className="sm:p-6">
            <p className="eyebrow">Services</p>
            <h3 className="mb-2 text-[1.15rem] font-semibold tracking-[-0.03em] text-ink">Set service visibility</h3>
            <p className="text-sm text-[var(--text-muted)]">Only Super Admin can add, pause, resume, or remove services.</p>
          </AppSurface>
        )}

        <AppSurface variant="clear" padding="md" className="sm:p-6">
          <p className="eyebrow">Notes</p>
          <h3 className="mb-4 text-[1.15rem] font-semibold tracking-[-0.03em] text-ink">Internal context</h3>
          <Label className="sr-only">Internal context notes</Label>
          <Textarea
            value={notes}
            onChange={(event) => setNotes(event.target.value)}
            className="min-h-28"
            placeholder="Optional operator notes for this provisioning action."
          />
        </AppSurface>

        <AppSurface variant="fill" padding="md" className="sm:p-6">
          <p className="eyebrow">Review</p>
          <h3 className="mb-4 text-[1.15rem] font-semibold tracking-[-0.03em] text-ink">Save workspace products and services</h3>
          <div className="grid gap-3 text-sm text-ink sm:grid-cols-2">
            <p className="m-0"><span className="font-semibold">Workspace:</span> {workspaceMode === "existing" ? (selectedWorkspace?.displayName ?? "Select a workspace") : (workspaceName || "New workspace")}</p>
            <p className="m-0"><span className="font-semibold">Products:</span> {[enablePhotoVault ? "PhotoVault" : null, enableStories ? "Canopy Stories" : null, enableCreate ? "Canopy Create" : null, enableCommunity ? "Canopy Community" : null, enableReach ? "Canopy Reach" : null].filter(Boolean).join(", ") || "None selected"}</p>
            <p className="m-0"><span className="font-semibold">Services:</span> {[enableWebsiteSetup ? "School Website Setup" : null, enableCreativeRetainer ? "Creative Retainer" : null].filter(Boolean).join(", ") || "None selected"}</p>
          </div>
          <p className="mt-4 text-sm text-[var(--text-muted)]">
            Admin invitation and role assignment are handled separately above so product and service changes can be saved independently.
          </p>

          {error ? (
            <div className="mt-4 rounded-xl border border-[rgba(185,28,28,0.18)] bg-[rgba(254,242,242,0.92)] px-3 py-2 text-sm text-[rgb(153,27,27)]">
              {error}
            </div>
          ) : null}

          <div className="mt-5 flex items-center gap-3">
            <Button type="submit" disabled={busy} variant="primary">
              {busy ? "Saving..." : workspaceMode === "new" ? "Create workspace" : "Save products & services"}
            </Button>
          </div>
        </AppSurface>

      {result ? (
        <AppSurface variant="clear" padding="md" className="sm:p-6">
          <p className="eyebrow">Workspace Setup</p>
          <h3 className="mb-4 text-[1.15rem] font-semibold tracking-[-0.03em] text-ink">{result.workspace.displayName}</h3>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-xl border border-[rgba(15,31,61,0.1)] p-4">
              <p className="m-0 text-sm font-semibold text-ink">Products</p>
              <div className="mt-3 space-y-2">
                {result.entitlements.length === 0 ? (
                  <p className="m-0 text-sm text-[var(--text-muted)]">No products enabled.</p>
                ) : (
                  result.entitlements.map((item) => (
                    <div key={item.productKey} className="flex items-center justify-between gap-3 text-sm">
                      <span className="font-medium text-ink">{productLabel(item.productKey as ProductKey)}</span>
                      <span className="text-[var(--text-muted)]">{entitlementStatusLabel(item.status as WorkspaceEntitlement["status"])} • {item.setupState}</span>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="rounded-xl border border-[rgba(15,31,61,0.1)] p-4">
              <p className="m-0 text-sm font-semibold text-ink">Services</p>
              <div className="mt-3 space-y-2">
                {result.services.length === 0 ? (
                  <p className="m-0 text-sm text-[var(--text-muted)]">No services selected.</p>
                ) : (
                  result.services.map((item) => (
                    <div key={item.serviceKey} className="flex items-center justify-between gap-3 text-sm">
                      <span className="font-medium text-ink">{serviceLabel(item.serviceKey)}</span>
                      <span className="text-[var(--text-muted)]">{item.status} • {item.setupState}</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </AppSurface>
      ) : null}

        <AppSurface variant="clear" padding="md" className="sm:p-6">
        <p className="eyebrow">Invitation Status</p>
        <h3 className="mb-4 text-[1.15rem] font-semibold tracking-[-0.03em] text-ink">Current workspace invitations</h3>
        {workspaceMode !== "existing" && !result ? (
          <p className="m-0 text-sm text-[var(--text-muted)]">Select an existing workspace or submit a new one to view invitation status.</p>
        ) : workspaceInvitations.length === 0 ? (
          <p className="m-0 text-sm text-[var(--text-muted)]">No invitation records found for this workspace yet.</p>
        ) : (
          <div className="space-y-3">
            {workspaceInvitations.map((invitation) => (
              <div
                key={invitation.id}
                className="flex items-center justify-between gap-4 rounded-[22px] border border-[var(--app-surface-soft-border)] bg-white/52 px-4 py-3"
              >
                <div>
                  <p className="m-0 text-sm font-semibold text-ink">{invitation.email}</p>
                  <p className="m-0 mt-1 text-sm text-[var(--text-muted)]">
                    {invitation.role} • {new Date(invitation.createdAt).toLocaleDateString()}
                    {invitation.sentAt ? ` • Sent ${new Date(invitation.sentAt).toLocaleDateString()}` : ""}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <p className="m-0 text-sm font-medium text-ink">{deliveryStatusLabel(invitation)}</p>
                  {invitation.status === "pending" && invitation.deliveryStatus !== "sent" ? (
                    <Button
                      type="button"
                      onClick={() => void resendInvitation(invitation.id)}
                      disabled={resendId === invitation.id}
                      size="sm"
                      variant="secondary"
                    >
                      {resendId === invitation.id ? "Sending..." : "Resend"}
                    </Button>
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        )}
      </AppSurface>
    </form>
  );
}
