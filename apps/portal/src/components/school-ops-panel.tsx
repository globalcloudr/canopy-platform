"use client";

import { useMemo, useState } from "react";
import type { PortalWorkspace } from "@/lib/platform";
import type { WorkspaceOwnerStatus } from "@/lib/provisioning";
import { Button, Input, Label, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@canopy/ui";

type SchoolOpsPanelProps = {
  workspaces: PortalWorkspace[];
  ownerStatuses: WorkspaceOwnerStatus[];
  activeWorkspaceId?: string | null;
};

const HANDLING_OPTIONS = [
  { value: "remove", label: "Remove previous owner" },
  { value: "viewer", label: "Keep previous owner as viewer" },
  { value: "uploader", label: "Keep previous owner as uploader" },
] as const;

function buildPhotoVaultLaunchHref(workspaceSlug: string, path: string) {
  const params = new URLSearchParams({
    workspace: workspaceSlug,
  });
  if (path && path !== "/") {
    params.set("path", path);
  }
  return `/auth/launch/photovault?${params.toString()}`;
}

export function SchoolOpsPanel({ workspaces, ownerStatuses, activeWorkspaceId }: SchoolOpsPanelProps) {
  const [transferWorkspaceId, setTransferWorkspaceId] = useState<string | null>(null);
  const [transferEmail, setTransferEmail] = useState("");
  const [previousOwnerHandling, setPreviousOwnerHandling] = useState<"remove" | "viewer" | "uploader">("remove");
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState<string | null>(null);

  const ownerStatusByWorkspaceId = useMemo(
    () => new Map(ownerStatuses.map((status) => [status.workspaceId, status])),
    [ownerStatuses]
  );

  const transferWorkspace = transferWorkspaceId
    ? workspaces.find((workspace) => workspace.id === transferWorkspaceId) ?? null
    : null;

  async function submitTransferOwnership(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!transferWorkspaceId) {
      setStatus("Choose a workspace first.");
      return;
    }
    if (!transferEmail.trim()) {
      setStatus("Enter the new owner email.");
      return;
    }

    setBusy(true);
    setStatus(null);

    const response = await fetch("/api/transfer-workspace-owner", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        workspaceId: transferWorkspaceId,
        email: transferEmail.trim(),
        previousOwnerHandling,
      }),
    });

    const body = (await response.json()) as { ok?: boolean; message?: string; error?: string };
    setBusy(false);

    if (!response.ok || !body.ok) {
      setStatus(body.error ?? "Ownership transfer failed.");
      return;
    }

    setStatus(body.message ?? "Ownership transfer started.");
    setTransferEmail("");
  }

  return (
    <div className="space-y-6 pb-10">
      <header className="rounded-[30px] border border-[var(--app-surface-border)] bg-transparent p-5 shadow-none">
        <p className="eyebrow">School Ops</p>
        <h2 className="mb-1">Workspace operations</h2>
        <p className="m-0 max-w-[68ch] text-sm text-[var(--text-muted)]">
          Review workspace ownership at a glance, jump directly into Brand Portal or audit, and transfer ownership when needed. School
          creation and admin invite flow now live in Portal provisioning.
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <a
            href="/app/provisioning"
            className="inline-flex items-center rounded-2xl bg-[#172033] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#0f172a]"
          >
            Open provisioning
          </a>
        </div>
      </header>

      <section className="rounded-[30px] border border-[var(--app-surface-border)] bg-transparent p-5 shadow-none">
        <p className="eyebrow">Client Workspaces</p>
        <h3 className="mb-4 text-[1.15rem] font-semibold tracking-[-0.03em] text-ink">Active schools</h3>
        {workspaces.length === 0 ? (
          <p className="text-sm text-[var(--text-muted)]">No workspaces found.</p>
        ) : (
          <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
            {workspaces.map((workspace) => {
              const ownerStatus = ownerStatusByWorkspaceId.get(workspace.id);
              const ownerCount = ownerStatus?.ownerCount ?? 0;
              const acceptedOwnerCount = ownerStatus?.acceptedOwnerCount ?? 0;
              const ownerLabel = ownerStatus?.owners.length
                ? ownerStatus.owners.map((owner) => owner.email ?? owner.userId).join(", ")
                : "No owner assigned yet";

              return (
                <article
                  key={workspace.id}
                  className="rounded-[24px] border border-[var(--app-surface-soft-border)] bg-white/60 p-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h4 className="truncate text-[1rem] font-semibold tracking-[-0.02em] text-ink">{workspace.displayName}</h4>
                      <p className="mt-1 text-sm text-[var(--text-muted)]">{workspace.slug}</p>
                    </div>
                    {workspace.id === activeWorkspaceId ? (
                      <span className="rounded-full bg-sky-50 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-sky-700">
                        Active
                      </span>
                    ) : null}
                  </div>

                  <div className="mt-3 flex flex-wrap gap-2">
                    {acceptedOwnerCount > 0 ? (
                      <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-emerald-700">
                        Owner active
                      </span>
                    ) : ownerCount > 0 ? (
                      <span className="rounded-full bg-amber-50 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-amber-700">
                        Owner invited
                      </span>
                    ) : (
                      <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-700">
                        Needs owner
                      </span>
                    )}
                  </div>

                  <p className="mt-3 text-sm text-[var(--text-muted)]">{ownerLabel}</p>

                  <div className="mt-4 flex flex-wrap gap-2">
                    <a
                      href={buildPhotoVaultLaunchHref(workspace.slug, "/collections/brand-guidelines")}
                      className="inline-flex items-center rounded-2xl border border-[var(--app-surface-soft-border)] bg-white px-3 py-2 text-sm font-medium text-ink transition hover:bg-slate-50"
                    >
                      Open Brand Portal
                    </a>
                    <a
                      href={buildPhotoVaultLaunchHref(workspace.slug, "/audit")}
                      className="inline-flex items-center rounded-2xl border border-[var(--app-surface-soft-border)] bg-white px-3 py-2 text-sm font-medium text-ink transition hover:bg-slate-50"
                    >
                      Open audit
                    </a>
                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      onClick={() => {
                        setTransferWorkspaceId(workspace.id);
                        setStatus(null);
                      }}
                    >
                      Transfer ownership
                    </Button>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>

      <section className="rounded-[30px] border border-[var(--app-surface-border)] bg-transparent p-5 shadow-none">
        <p className="eyebrow">Ownership</p>
        <h3 className="mb-4 text-[1.15rem] font-semibold tracking-[-0.03em] text-ink">Transfer workspace ownership</h3>
        <form onSubmit={submitTransferOwnership} className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_260px_auto] lg:items-end">
          <label className="space-y-2">
            <Label>Workspace</Label>
            <Select value={transferWorkspaceId ?? ""} onValueChange={(value) => setTransferWorkspaceId(value || null)}>
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
          <label className="space-y-2">
            <Label>New owner email</Label>
            <Input
              type="email"
              value={transferEmail}
              onChange={(event) => setTransferEmail(event.target.value)}
              className="text-sm"
              placeholder="owner@school.org"
              required
            />
          </label>
          <label className="space-y-2">
            <Label>Previous owner</Label>
            <Select value={previousOwnerHandling} onValueChange={(value) => setPreviousOwnerHandling(value as "remove" | "viewer" | "uploader")}>
              <SelectTrigger className="text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {HANDLING_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </label>
          <Button type="submit" disabled={busy} variant="primary">
            {busy ? "Starting..." : "Transfer ownership"}
          </Button>
        </form>
        <p className="mt-3 text-sm text-[var(--text-muted)]">
          {transferWorkspace
            ? `The invite will be sent for ${transferWorkspace.displayName}, and previous owner memberships will be handled according to the selected option.`
            : "Choose a workspace to start an ownership transfer."}
        </p>
        {status ? (
          <div className="mt-4 rounded-xl border border-[rgba(15,31,61,0.1)] bg-white/60 px-4 py-3 text-sm text-ink">
            {status}
          </div>
        ) : null}
      </section>
    </div>
  );
}
