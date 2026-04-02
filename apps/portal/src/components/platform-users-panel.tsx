"use client";

import { useEffect, useMemo, useState } from "react";
import { AppSurface, Button, Input, Label, SectionTitle, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@canopy/ui";

type PlatformRole = "super_admin" | "platform_staff";

type PlatformUserRow = {
  userId: string;
  email: string | null;
  fullName: string | null;
  role: PlatformRole | null;
  roleLabel: string;
  invited: boolean;
  lastSignInAt: string | null;
};

type PlatformUsersPanelProps = {
  auditWorkspaceId?: string | null;
  currentUserId?: string | null;
};

const ROLE_OPTIONS: Array<{ value: PlatformRole; label: string; description: string }> = [
  {
    value: "super_admin",
    label: "Super Admin",
    description: "Full platform governance. Can manage schools, ownership, audit, products, services, and platform users.",
  },
  {
    value: "platform_staff",
    label: "Platform Staff",
    description: "Internal support role. Can assist with workspace operations, but cannot manage platform users or governance actions.",
  },
];

function formatLastSeen(value: string | null) {
  if (!value) {
    return "No sign-in yet";
  }

  try {
    return `Last signed in ${new Date(value).toLocaleString()}`;
  } catch {
    return value;
  }
}

export function PlatformUsersPanel({ auditWorkspaceId, currentUserId = null }: PlatformUsersPanelProps) {
  const [users, setUsers] = useState<PlatformUserRow[]>([]);
  const [draftRoles, setDraftRoles] = useState<Record<string, PlatformRole>>({});
  const [loading, setLoading] = useState(true);
  const [busyUserId, setBusyUserId] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<PlatformRole>("platform_staff");
  const [inviteBusy, setInviteBusy] = useState(false);

  async function loadUsers() {
    setLoading(true);
    setStatus(null);

    try {
      const response = await fetch("/api/platform-users", { cache: "no-store" });
      const body = (await response.json()) as { users?: PlatformUserRow[]; error?: string };
      if (!response.ok) {
        setStatus(body.error ?? "Failed to load platform users.");
        return;
      }

      const nextUsers = body.users ?? [];
      setUsers(nextUsers);
      setDraftRoles(
        Object.fromEntries(
          nextUsers
            .filter((user): user is PlatformUserRow & { role: PlatformRole } => Boolean(user.role))
            .map((user) => [user.userId, user.role])
        )
      );
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Failed to load platform users.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadUsers();
  }, []);

  const counts = useMemo(
    () => ({
      total: users.length,
      superAdmins: users.filter((user) => user.role === "super_admin").length,
      platformStaff: users.filter((user) => user.role === "platform_staff").length,
    }),
    [users]
  );

  async function invitePlatformUser(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setInviteBusy(true);
    setStatus(null);

    try {
      const response = await fetch("/api/platform-users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: inviteEmail.trim(),
          role: inviteRole,
          orgId: auditWorkspaceId ?? undefined,
        }),
      });

      const body = (await response.json()) as { message?: string; error?: string };
      if (!response.ok) {
        setStatus(body.error ?? "Invite failed.");
        return;
      }

      setStatus(body.message ?? "Platform invite sent.");
      setInviteEmail("");
      await loadUsers();
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Invite failed.");
    } finally {
      setInviteBusy(false);
    }
  }

  async function saveRole(userId: string) {
    const role = draftRoles[userId];
    if (!role) {
      return;
    }

    setBusyUserId(userId);
    setStatus(null);
    try {
      const response = await fetch("/api/platform-users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          role,
          orgId: auditWorkspaceId ?? undefined,
        }),
      });

      const body = (await response.json()) as { message?: string; error?: string };
      if (!response.ok) {
        setStatus(body.error ?? "Role update failed.");
        return;
      }

      setStatus(body.message ?? "Platform role updated.");
      await loadUsers();
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Role update failed.");
    } finally {
      setBusyUserId(null);
    }
  }

  async function removePlatformUser(userId: string) {
    setBusyUserId(userId);
    setStatus(null);
    try {
      const response = await fetch("/api/platform-users", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          orgId: auditWorkspaceId ?? undefined,
        }),
      });

      const body = (await response.json()) as { message?: string; error?: string };
      if (!response.ok) {
        setStatus(body.error ?? "Remove access failed.");
        return;
      }

      setStatus(body.message ?? "Platform access removed.");
      await loadUsers();
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Remove access failed.");
    } finally {
      setBusyUserId(null);
    }
  }

  return (
    <div className="space-y-5">
      <AppSurface variant="clear" padding="md" className="sm:p-6">
        <SectionTitle as="h2" className="mb-2 text-slate-900">Access overview</SectionTitle>
        <p className="m-0 max-w-[64ch] text-sm text-[var(--text-muted)]">
          Invite and manage internal Portal users. Super Admin handles governance-level actions here instead of relying on the old PhotoVault platform console.
        </p>
        <div className="mt-4 flex flex-wrap gap-3 text-sm text-[var(--text-muted)]">
          <span>{counts.total} platform users</span>
          <span>{counts.superAdmins} Super Admin</span>
          <span>{counts.platformStaff} Platform Staff</span>
        </div>
      </AppSurface>

      <AppSurface variant="clear" padding="md" className="sm:p-6">
        <p className="eyebrow">Invite</p>
        <h3 className="mb-4 text-[1.15rem] font-semibold tracking-[-0.03em] text-ink">Add platform access</h3>
        <form className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_260px_auto]" onSubmit={invitePlatformUser}>
          <label className="space-y-2">
            <Label>User email</Label>
            <Input
              type="email"
              value={inviteEmail}
              onChange={(event) => setInviteEmail(event.target.value)}
              className="text-sm"
              placeholder="team@akkedisdigital.com"
              required
            />
          </label>
          <label className="space-y-2">
            <Label>Platform role</Label>
            <Select value={inviteRole} onValueChange={(value) => setInviteRole(value as PlatformRole)}>
              <SelectTrigger className="text-sm">
                <SelectValue />
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
          <Button type="submit" disabled={inviteBusy} variant="primary">
            {inviteBusy ? "Inviting..." : "Invite user"}
          </Button>
        </form>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {ROLE_OPTIONS.map((option) => (
            <div key={option.value} className="rounded-[22px] border border-[var(--app-surface-soft-border)] bg-white/52 p-4">
              <p className="m-0 text-sm font-semibold text-ink">{option.label}</p>
              <p className="mt-1 text-sm text-[var(--text-muted)]">{option.description}</p>
            </div>
          ))}
        </div>
        {status ? (
          <div className="mt-4 rounded-xl border border-[rgba(15,31,61,0.1)] bg-white/60 px-4 py-3 text-sm text-ink">
            {status}
          </div>
        ) : null}
      </AppSurface>

      <AppSurface variant="clear" padding="md" className="sm:p-6">
        <p className="eyebrow">Current Access</p>
        <h3 className="mb-4 text-[1.15rem] font-semibold tracking-[-0.03em] text-ink">Active platform users</h3>
        {loading ? (
          <p className="text-sm text-[var(--text-muted)]">Loading platform users...</p>
        ) : users.length === 0 ? (
          <p className="text-sm text-[var(--text-muted)]">No platform users yet.</p>
        ) : (
          <div className="space-y-3">
            {users.map((user) => {
              const roleValue = draftRoles[user.userId] ?? user.role ?? "platform_staff";
              const saving = busyUserId === user.userId;
              return (
                <div
                  key={user.userId}
                  className="flex flex-col gap-4 rounded-[22px] border border-[var(--app-surface-soft-border)] bg-white/52 px-4 py-4 lg:flex-row lg:items-center lg:justify-between"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-ink">{user.fullName || user.email || user.userId}</p>
                    <p className="mt-1 truncate text-sm text-[var(--text-muted)]">{user.email ?? "No email"}</p>
                    <p className="mt-1 text-sm text-[var(--text-muted)]">
                      {user.roleLabel} {user.invited ? "• Invited" : "• Active"} • {formatLastSeen(user.lastSignInAt)}
                    </p>
                  </div>
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                    <Select value={roleValue} onValueChange={(value) => setDraftRoles((current) => ({ ...current, [user.userId]: value as PlatformRole }))}>
                      <SelectTrigger className="w-full text-sm sm:w-[180px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {ROLE_OPTIONS.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button type="button" variant="secondary" size="sm" disabled={saving} onClick={() => void saveRole(user.userId)}>
                      {saving ? "Saving..." : "Save role"}
                    </Button>
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      disabled={saving || currentUserId === user.userId}
                      onClick={() => void removePlatformUser(user.userId)}
                    >
                      {saving ? "Removing..." : "Remove access"}
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </AppSurface>
    </div>
  );
}
