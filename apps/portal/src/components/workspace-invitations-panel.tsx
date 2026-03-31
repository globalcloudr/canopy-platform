"use client";

import { useMemo, useState } from "react";
import { AppPill, AppSurface, BodyText, Button, Input, Label, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@canopy/ui";
import type { PortalWorkspace, WorkspaceRole } from "@/lib/platform";
import type { WorkspaceAdminInvitation } from "@/lib/provisioning";

const ROLE_OPTIONS: Array<{ value: WorkspaceRole; label: string }> = [
  { value: "owner", label: "Owner" },
  { value: "admin", label: "Admin" },
  { value: "staff", label: "Staff" },
  { value: "social_media", label: "Social Media" },
  { value: "uploader", label: "Uploader" },
  { value: "viewer", label: "Viewer" },
];

const ROLE_DESCRIPTIONS: Array<{
  role: WorkspaceRole;
  title: string;
  description: string;
}> = [
  {
    role: "owner",
    title: "Owner",
    description: "Full workspace control, including staff access, approved social accounts, and school-level settings.",
  },
  {
    role: "admin",
    title: "Admin",
    description: "Can manage staff access and approved social accounts, but is not the primary workspace owner.",
  },
  {
    role: "staff",
    title: "Staff",
    description: "General workspace access for day-to-day work, including creating and managing posts where supported.",
  },
  {
    role: "social_media",
    title: "Social Media",
    description: "Designed for communications staff who create, schedule, and manage social posts and can upload photos by default.",
  },
  {
    role: "uploader",
    title: "Uploader",
    description: "Can add media assets for the school, but should not manage publishing or workspace access.",
  },
  {
    role: "viewer",
    title: "Viewer",
    description: "Read-only access for staff who only need to view workspace information and approved resources.",
  },
];

function formatRole(role: WorkspaceRole) {
  return role.replace(/_/g, " ");
}

function statusLabel(invitation: WorkspaceAdminInvitation) {
  if (invitation.status === "accepted") return "Accepted";
  if (invitation.status === "cancelled") return "Cancelled";
  if (invitation.deliveryStatus === "sent") return "Invite sent";
  if (invitation.deliveryStatus === "failed") return "Send failed";
  return "Pending";
}

type WorkspaceInvitationsPanelProps = {
  workspace: PortalWorkspace;
  initialInvitations: WorkspaceAdminInvitation[];
};

export function WorkspaceInvitationsPanel({
  workspace,
  initialInvitations,
}: WorkspaceInvitationsPanelProps) {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<WorkspaceRole>("social_media");
  const [busy, setBusy] = useState(false);
  const [resendId, setResendId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [invitations, setInvitations] = useState(initialInvitations);

  const sortedInvitations = useMemo(
    () => [...invitations].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
    [invitations]
  );
  const selectedRoleDescription = ROLE_DESCRIPTIONS.find((item) => item.role === role) ?? ROLE_DESCRIPTIONS[0];

  async function submitInvite(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError(null);
    setMessage(null);

    try {
      const response = await fetch("/api/workspace-invitations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          workspaceId: workspace.id,
          email,
          role,
        }),
      });

      const body = (await response.json()) as {
        error?: string;
        result?: {
          invitation?: WorkspaceAdminInvitation | null;
          membership?: { created: boolean; role: WorkspaceRole } | null;
          email: string;
          role: WorkspaceRole;
          inviteSent: boolean;
        };
      };

      if (!response.ok || !body.result) {
        throw new Error(body.error ?? "Invite failed.");
      }

      if (body.result.invitation) {
        setInvitations((current) => {
          const next = current.filter((item) => item.id !== body.result!.invitation!.id);
          next.unshift(body.result!.invitation!);
          return next;
        });
        setMessage(
          body.result.inviteSent
            ? `Invitation sent to ${body.result.email}.`
            : `Invitation recorded for ${body.result.email}.`
        );
      } else {
        setMessage(
          body.result.membership?.created
            ? `${body.result.email} was added to the workspace as ${formatRole(body.result.role)}.`
            : `${body.result.email} already has workspace access as ${formatRole(body.result.role)}.`
        );
      }

      setEmail("");
      setRole("social_media");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Invite failed.");
    } finally {
      setBusy(false);
    }
  }

  async function resendInvitation(invitationId: string) {
    setResendId(invitationId);
    setError(null);
    setMessage(null);

    try {
      const response = await fetch("/api/resend-workspace-invitation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ invitationId }),
      });
      const body = (await response.json()) as { invitation?: WorkspaceAdminInvitation; error?: string };
      if (!response.ok || !body.invitation) {
        throw new Error(body.error ?? "Resend failed.");
      }

      setInvitations((current) => current.map((row) => (row.id === body.invitation?.id ? body.invitation : row)));
      setMessage(`Invitation resent to ${body.invitation.email}.`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Resend failed.");
    } finally {
      setResendId(null);
    }
  }

  return (
    <AppSurface variant="clear" padding="md" className="sm:p-6">
      <div className="mb-4">
        <h2 className="text-[1.1rem] font-semibold tracking-[-0.03em] text-slate-900">Workspace access</h2>
        <BodyText muted className="m-0 max-w-[56ch]">
          Invite staff into {workspace.displayName} from Canopy Portal and assign the role they should use across Reach and the rest of Canopy.
        </BodyText>
      </div>

      <form className="grid gap-4 rounded-[24px] border border-[var(--app-surface-soft-border)] bg-white/54 p-4 sm:grid-cols-[minmax(0,1fr)_220px_auto]" onSubmit={submitInvite}>
        <label className="space-y-2">
          <Label>Email</Label>
          <Input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="communications@school.org"
            required
          />
        </label>
        <label className="space-y-2">
          <Label>Role</Label>
          <Select value={role} onValueChange={(value) => setRole(value as WorkspaceRole)}>
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
          <p className="text-sm leading-6 text-slate-600">
            <span className="font-semibold text-slate-900">{selectedRoleDescription.title}:</span>{" "}
            {selectedRoleDescription.description}
          </p>
        </label>
        <div className="flex items-end">
          <Button type="submit" variant="primary" disabled={busy}>
            {busy ? "Inviting..." : "Invite user"}
          </Button>
        </div>
      </form>

      <BodyText muted className="mt-3 text-[0.85rem]">
        Recommended: use <span className="font-medium text-slate-700">Social Media</span> for staff who should create and schedule posts. Social Media users can upload photos by default.
      </BodyText>

      <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {ROLE_DESCRIPTIONS.map((item) => (
          <div
            key={item.role}
            className={[
              "rounded-xl border px-4 py-3",
              role === item.role ? "border-blue-300 bg-blue-50/70" : "border-slate-200 bg-white",
              
            ].join(" ")}
          >
            <p className="m-0 text-sm font-semibold text-slate-900">{item.title}</p>
            <p className="m-0 mt-1 text-sm leading-6 text-slate-600">{item.description}</p>
          </div>
        ))}
      </div>

      {message ? (
        <div className="mt-4 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-[0.875rem] text-green-700">
          {message}
        </div>
      ) : null}
      {error ? (
        <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-[0.875rem] text-red-700">
          {error}
        </div>
      ) : null}

      <div className="mt-6">
        <h3 className="mb-3 text-[0.98rem] font-semibold tracking-[-0.02em] text-slate-900">Recent invitations</h3>
        {sortedInvitations.length === 0 ? (
          <BodyText muted className="m-0">No invitation records yet for this workspace.</BodyText>
        ) : (
          <div className="overflow-hidden rounded-[24px] border border-[var(--app-surface-soft-border)] bg-white/72">
            {sortedInvitations.map((invitation, index) => (
              <div
                key={invitation.id}
                className={`flex items-center justify-between gap-4 px-5 py-3.5 ${index < sortedInvitations.length - 1 ? "border-b border-slate-200" : ""}`}
              >
                <div>
                  <p className="m-0 text-sm font-semibold text-slate-900">{invitation.email}</p>
                  <p className="m-0 mt-1 text-sm text-slate-500">
                    {formatRole(invitation.role)} • {new Date(invitation.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <AppPill>{statusLabel(invitation)}</AppPill>
                  {invitation.status === "pending" ? (
                    <Button
                      type="button"
                      size="sm"
                      variant="secondary"
                      disabled={resendId === invitation.id}
                      onClick={() => void resendInvitation(invitation.id)}
                    >
                      {resendId === invitation.id ? "Resending..." : "Resend"}
                    </Button>
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AppSurface>
  );
}
