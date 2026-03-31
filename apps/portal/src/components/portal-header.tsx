"use client";

import { useEffect, useState } from "react";
import { CanopyHeader } from "@canopy/ui";
import { useSearchParams } from "next/navigation";
import type { PortalSession } from "@/lib/platform";

const ACTIVE_WORKSPACE_COOKIE = "canopy_portal_workspace";

export function PortalHeader() {
  const searchParams = useSearchParams();
  const qs = searchParams.toString();
  const suffix = qs ? `?${qs}` : "";
  const [session, setSession] = useState<PortalSession | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    async function loadSession() {
      try {
        const res = await fetch(`/api/portal-session${suffix}`, { cache: "no-store", signal: controller.signal });
        if (!res.ok) return;
        const payload = (await res.json()) as { session?: PortalSession | null };
        setSession(payload.session ?? null);
      } catch {
        if (!controller.signal.aborted) setSession(null);
      }
    }
    void loadSession();
    return () => controller.abort();
  }, [suffix]);

  const activeWorkspace = session?.activeWorkspace ?? null;
  const user = session?.user ?? null;
  const memberships = session?.memberships ?? [];

  useEffect(() => {
    if (!activeWorkspace?.slug || typeof document === "undefined") {
      return;
    }

    document.cookie = `${ACTIVE_WORKSPACE_COOKIE}=${encodeURIComponent(activeWorkspace.slug)}; path=/; max-age=31536000; samesite=lax`;
  }, [activeWorkspace?.slug]);

  const workspaceLabel = activeWorkspace?.displayName
    ?? (session ? (session.isPlatformOperator ? "All workspaces" : "Select workspace") : "Loading...");

  const workspaceLinks = session?.isPlatformOperator
    ? memberships
        .map((m) => m.workspace)
        .filter((w, i, arr) => arr.findIndex((c) => c.id === w.id) === i)
        .map((w) => {
          const params = new URLSearchParams(qs);
          params.set("workspace", w.slug);
          return { id: w.id, label: w.displayName, href: `/app?${params.toString()}` };
        })
    : [];

  const userInitials = user?.email
    ? user.email.split("@")[0].split(/[.\-_]/).filter(Boolean).slice(0, 2).map((p) => p[0]?.toUpperCase() ?? "").join("")
    : session ? "C" : "…";

  const displayName = user?.displayName ?? user?.email ?? "Canopy User";
  const roleLabel = session?.platformRole ? session.platformRole.replace(/_/g, " ") : null;

  return (
    <CanopyHeader
      brandHref={`/app${suffix}`}
      workspaceLabel={workspaceLabel}
      workspaceLinks={workspaceLinks}
      isPlatformOperator={session?.isPlatformOperator}
      platformOverviewHref={`/app${suffix}`}
      userInitials={userInitials}
      displayName={displayName}
      email={user?.displayName ? user.email : null}
      roleLabel={roleLabel}
      accountMenuItems={[
        { label: "Account", href: `/app/account${suffix}` },
        { label: "Portal overview", href: `/app${suffix}` },
        { label: "Questions / feedback", href: "mailto:info@akkedisdigital.com?subject=Canopy%20Portal%20Feedback" },
      ]}
      signOutHref="/auth/sign-out"
    />
  );
}
