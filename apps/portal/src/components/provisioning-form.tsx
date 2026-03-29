"use client";

import { useEffect, useMemo, useState } from "react";
import {
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
import type { PortalWorkspace, WorkspaceRole } from "@/lib/platform";
import type { WorkspaceAdminInvitation } from "@/lib/provisioning";

type ProvisioningFormProps = {
  workspaces: PortalWorkspace[];
  invitations: WorkspaceAdminInvitation[];
};

type ProvisioningResult = {
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
];

function slugify(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function invitationStatusLabel(status: ProvisioningResult["invitation"]["status"]) {
  if (status === "existing_membership") return "Existing member";
  if (status === "membership_prepared") return "Membership prepared";
  if (status === "invitation_sent") return "Invitation sent";
  return "Invitation recorded";
}

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

export function ProvisioningForm({ workspaces, invitations }: ProvisioningFormProps) {
  const [workspaceMode, setWorkspaceMode] = useState<"existing" | "new">("existing");
  const [workspaceId, setWorkspaceId] = useState(workspaces[0]?.id ?? "");
  const [workspaceName, setWorkspaceName] = useState("");
  const [workspaceSlug, setWorkspaceSlug] = useState("");
  const [primaryAdminEmail, setPrimaryAdminEmail] = useState("");
  const [initialRole, setInitialRole] = useState<WorkspaceRole>("owner");
  const [enablePhotoVault, setEnablePhotoVault] = useState(false);
  const [photoVaultSetupState, setPhotoVaultSetupState] = useState("ready");
  const [enableStories, setEnableStories] = useState(false);
  const [storiesSetupState, setStoriesSetupState] = useState("ready");
  const [enableWebsiteSetup, setEnableWebsiteSetup] = useState(false);
  const [websiteSetupState, setWebsiteSetupState] = useState("setup");
  const [enableCreativeRetainer, setEnableCreativeRetainer] = useState(false);
  const [creativeRetainerState, setCreativeRetainerState] = useState("ready");
  const [notes, setNotes] = useState("");
  const [busy, setBusy] = useState(false);
  const [resendId, setResendId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ProvisioningResult | null>(null);
  const [invitationRows, setInvitationRows] = useState<WorkspaceAdminInvitation[]>(invitations);

  const selectedWorkspace = useMemo(
    () => workspaces.find((workspace) => workspace.id === workspaceId) ?? null,
    [workspaceId, workspaces]
  );

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError(null);
    setResult(null);

    const response = await fetch("/api/provision-workspace", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        workspaceMode,
        workspaceId: workspaceMode === "existing" ? workspaceId : undefined,
        workspaceName: workspaceMode === "new" ? workspaceName.trim() : undefined,
        workspaceSlug: workspaceMode === "new" ? slugify(workspaceSlug || workspaceName) : undefined,
        primaryAdminEmail,
        initialRole,
        products: [
          ...(enablePhotoVault
            ? [{ productKey: "photovault", status: "active", setupState: photoVaultSetupState }]
            : []),
          ...(enableStories
            ? [{ productKey: "stories_canopy", status: "active", setupState: storiesSetupState }]
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

    const body = (await response.json()) as { result?: ProvisioningResult; error?: string };
    setBusy(false);

    if (!response.ok || !body.result) {
      setError(body.error ?? "Provisioning failed.");
      return;
    }

    const nextResult = body.result;
    setResult(nextResult);
    const invitationId = nextResult.invitation.id;
    const invitationCreatedAt = nextResult.invitation.createdAt;
    if ((nextResult.invitation.status === "invitation_recorded" || nextResult.invitation.status === "invitation_sent") && invitationId && invitationCreatedAt) {
      setInvitationRows((current) => {
        const next = current.filter((row) => row.id !== invitationId);
        next.unshift({
          id: invitationId,
          workspaceId: nextResult.workspace.id,
          email: nextResult.invitation.email,
          role: nextResult.invitation.role ?? initialRole,
          status: nextResult.invitation.invitationStatus ?? "pending",
          deliveryStatus: nextResult.invitation.status === "invitation_sent" ? "sent" : "pending_unsent",
          createdAt: invitationCreatedAt,
          sentAt: nextResult.invitation.status === "invitation_sent" ? invitationCreatedAt : null,
          acceptedAt: null,
        });
        return next;
      });
    }
  }

  const selectedWorkspaceId = workspaceMode === "existing" ? workspaceId : result?.workspace.id ?? null;
  const workspaceInvitations = invitationRows.filter((row) => row.workspaceId === selectedWorkspaceId);
  const latestPendingInvitation = useMemo(
    () => workspaceInvitations.find((row) => row.status === "pending") ?? workspaceInvitations[0] ?? null,
    [workspaceInvitations]
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
    <div className="space-y-6 pb-10">
      <header className="rounded-2xl border border-[rgba(15,31,61,0.1)] bg-white p-5 shadow-[0_1px_3px_rgba(15,31,61,0.08)]">
        <p className="eyebrow">Admin</p>
        <h2 className="mb-1">Workspace Provisioning</h2>
        <p className="m-0 max-w-[60ch] text-sm text-muted">
          Create or update a client workspace, assign the initial school admin, and enable the products or services
          they should see in Canopy.
        </p>
      </header>

      <form onSubmit={onSubmit} className="space-y-6">
        <section className="rounded-2xl border border-[rgba(15,31,61,0.1)] bg-white p-5 shadow-[0_1px_3px_rgba(15,31,61,0.08)]">
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
            <p className="mt-3 text-sm text-muted">Provisioning will update access for {selectedWorkspace.displayName}.</p>
          ) : null}
        </section>

        <section className="rounded-2xl border border-[rgba(15,31,61,0.1)] bg-white p-5 shadow-[0_1px_3px_rgba(15,31,61,0.08)]">
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
                required
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
            <p className="mt-3 text-sm text-muted">
              Prefilled from the latest saved invitation for this workspace.
            </p>
          ) : null}
        </section>

        <section className="rounded-2xl border border-[rgba(15,31,61,0.1)] bg-white p-5 shadow-[0_1px_3px_rgba(15,31,61,0.08)]">
          <p className="eyebrow">Products</p>
          <h3 className="mb-4 text-[1.15rem] font-semibold tracking-[-0.03em] text-ink">Enable workspace apps</h3>
          <div className="rounded-xl border border-[rgba(15,31,61,0.1)] p-4">
            <label className="flex items-start justify-between gap-4">
              <div>
                <p className="m-0 text-sm font-semibold text-ink">PhotoVault</p>
                <p className="m-0 mt-1 text-sm text-muted">Media library, albums, and approved brand assets.</p>
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

          <div className="mt-4 rounded-xl border border-[rgba(15,31,61,0.1)] p-4">
            <label className="flex items-start justify-between gap-4">
              <div>
                <p className="m-0 text-sm font-semibold text-ink">Canopy Stories</p>
                <p className="m-0 mt-1 text-sm text-muted">Automated success story production — blog, social, and video.</p>
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
        </section>

        <section className="rounded-2xl border border-[rgba(15,31,61,0.1)] bg-white p-5 shadow-[0_1px_3px_rgba(15,31,61,0.08)]">
          <p className="eyebrow">Services</p>
          <h3 className="mb-4 text-[1.15rem] font-semibold tracking-[-0.03em] text-ink">Set service visibility</h3>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-xl border border-[rgba(15,31,61,0.1)] p-4">
              <label className="flex items-start justify-between gap-4">
                <div>
                  <p className="m-0 text-sm font-semibold text-ink">School Website Setup</p>
                  <p className="m-0 mt-1 text-sm text-muted">Managed implementation support for a school website.</p>
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

            <div className="rounded-xl border border-[rgba(15,31,61,0.1)] p-4">
              <label className="flex items-start justify-between gap-4">
                <div>
                  <p className="m-0 text-sm font-semibold text-ink">Creative Retainer</p>
                  <p className="m-0 mt-1 text-sm text-muted">Ongoing design and creative support visibility.</p>
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
          </div>
        </section>

        <section className="rounded-2xl border border-[rgba(15,31,61,0.1)] bg-white p-5 shadow-[0_1px_3px_rgba(15,31,61,0.08)]">
          <p className="eyebrow">Notes</p>
          <h3 className="mb-4 text-[1.15rem] font-semibold tracking-[-0.03em] text-ink">Internal context</h3>
          <Label className="sr-only">Internal context notes</Label>
          <Textarea
            value={notes}
            onChange={(event) => setNotes(event.target.value)}
            className="min-h-28"
            placeholder="Optional operator notes for this provisioning action."
          />
        </section>

        <section className="rounded-2xl border border-[rgba(15,31,61,0.1)] bg-[rgba(15,31,61,0.025)] p-5">
          <p className="eyebrow">Review</p>
          <h3 className="mb-4 text-[1.15rem] font-semibold tracking-[-0.03em] text-ink">Provision this workspace</h3>
          <div className="grid gap-3 text-sm text-ink sm:grid-cols-2">
            <p className="m-0"><span className="font-semibold">Workspace:</span> {workspaceMode === "existing" ? (selectedWorkspace?.displayName ?? "Select a workspace") : (workspaceName || "New workspace")}</p>
            <p className="m-0"><span className="font-semibold">Admin:</span> {primaryAdminEmail || "Enter an email"}</p>
            <p className="m-0"><span className="font-semibold">Role:</span> {initialRole}</p>
            <p className="m-0"><span className="font-semibold">Products:</span> {[enablePhotoVault ? "PhotoVault" : null, enableStories ? "Canopy Stories" : null].filter(Boolean).join(", ") || "None selected"}</p>
            <p className="m-0"><span className="font-semibold">Services:</span> {[enableWebsiteSetup ? "School Website Setup" : null, enableCreativeRetainer ? "Creative Retainer" : null].filter(Boolean).join(", ") || "None selected"}</p>
          </div>

          {error ? (
            <div className="mt-4 rounded-xl border border-[rgba(185,28,28,0.18)] bg-[rgba(254,242,242,0.92)] px-3 py-2 text-sm text-[rgb(153,27,27)]">
              {error}
            </div>
          ) : null}

          <div className="mt-5 flex items-center gap-3">
            <Button type="submit" disabled={busy} variant="primary">
              {busy ? "Provisioning..." : "Provision workspace"}
            </Button>
          </div>
        </section>
      </form>

      {result ? (
        <section className="rounded-2xl border border-[rgba(15,31,61,0.1)] bg-white p-5 shadow-[0_1px_3px_rgba(15,31,61,0.08)]">
          <p className="eyebrow">Provisioning Result</p>
          <h3 className="mb-4 text-[1.15rem] font-semibold tracking-[-0.03em] text-ink">{result.workspace.displayName}</h3>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-xl border border-[rgba(15,31,61,0.1)] p-4">
              <p className="m-0 text-sm font-semibold text-ink">Invitation</p>
              <p className="m-0 mt-1 text-sm text-muted">{result.invitation.email}</p>
              <p className="m-0 mt-2 text-sm text-ink">{invitationStatusLabel(result.invitation.status)}</p>
            </div>
            <div className="rounded-xl border border-[rgba(15,31,61,0.1)] p-4">
              <p className="m-0 text-sm font-semibold text-ink">Membership</p>
              <p className="m-0 mt-1 text-sm text-muted">
                {result.membership ? `${result.membership.role} • ${result.membership.created ? "Created now" : "Already existed"}` : "No membership row created yet"}
              </p>
            </div>
          </div>

          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <div className="rounded-xl border border-[rgba(15,31,61,0.1)] p-4">
              <p className="m-0 text-sm font-semibold text-ink">Products</p>
              <div className="mt-3 space-y-2">
                {result.entitlements.map((item) => (
                  <div key={item.productKey} className="flex items-center justify-between gap-3 text-sm">
                    <span className="font-medium text-ink">{item.productKey}</span>
                    <span className="text-muted">{item.status} • {item.setupState}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-xl border border-[rgba(15,31,61,0.1)] p-4">
              <p className="m-0 text-sm font-semibold text-ink">Services</p>
              <div className="mt-3 space-y-2">
                {result.services.length === 0 ? (
                  <p className="m-0 text-sm text-muted">No services selected.</p>
                ) : (
                  result.services.map((item) => (
                    <div key={item.serviceKey} className="flex items-center justify-between gap-3 text-sm">
                      <span className="font-medium text-ink">{serviceLabel(item.serviceKey)}</span>
                      <span className="text-muted">{item.status} • {item.setupState}</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </section>
      ) : null}

      <section className="rounded-2xl border border-[rgba(15,31,61,0.1)] bg-white p-5 shadow-[0_1px_3px_rgba(15,31,61,0.08)]">
        <p className="eyebrow">Invitation Status</p>
        <h3 className="mb-4 text-[1.15rem] font-semibold tracking-[-0.03em] text-ink">Current workspace invitations</h3>
        {workspaceMode !== "existing" && !result ? (
          <p className="m-0 text-sm text-muted">Select an existing workspace or submit a new one to view invitation status.</p>
        ) : workspaceInvitations.length === 0 ? (
          <p className="m-0 text-sm text-muted">No invitation records found for this workspace yet.</p>
        ) : (
          <div className="space-y-3">
            {workspaceInvitations.map((invitation) => (
              <div
                key={invitation.id}
                className="flex items-center justify-between gap-4 rounded-xl border border-[rgba(15,31,61,0.1)] px-4 py-3"
              >
                <div>
                  <p className="m-0 text-sm font-semibold text-ink">{invitation.email}</p>
                  <p className="m-0 mt-1 text-sm text-muted">
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
      </section>
    </div>
  );
}
