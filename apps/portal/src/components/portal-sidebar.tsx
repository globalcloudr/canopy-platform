"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { cn } from "@canopy/ui";
import type { PortalSession } from "@/lib/platform";

const ACTIVE_WORKSPACE_COOKIE = "canopy_portal_workspace";

function readCookie(name: string) {
  if (typeof document === "undefined") {
    return null;
  }

  const prefix = `${name}=`;
  const match = document.cookie
    .split(";")
    .map((value) => value.trim())
    .find((value) => value.startsWith(prefix));

  return match ? decodeURIComponent(match.slice(prefix.length)) : null;
}

function navClass(active: boolean) {
  return cn(
    "flex items-center gap-2.5 px-3 py-2.5 font-medium text-[15px] tracking-[-0.01em] rounded-xl transition",
    active ? "bg-[#f1f3f5] text-[var(--foreground)]" : "text-[#2d2d2d] hover:bg-[#f7f7f8]"
  );
}

function IconHome({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className} aria-hidden="true">
      <rect x="3" y="3" width="7" height="7" rx="1.5" />
      <rect x="14" y="3" width="7" height="7" rx="1.5" />
      <rect x="3" y="14" width="7" height="7" rx="1.5" />
      <rect x="14" y="14" width="7" height="7" rx="1.5" />
    </svg>
  );
}

function IconUser({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className} aria-hidden="true">
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

function IconShield({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className} aria-hidden="true">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  );
}

function IconRocket({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className} aria-hidden="true">
      <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
      <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
      <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" />
      <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
    </svg>
  );
}

function IconPhoto({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className} aria-hidden="true">
      <rect x="3" y="4" width="18" height="16" rx="2.5" />
      <circle cx="8.5" cy="9" r="1.5" />
      <path d="M5.5 17l4.5-4.5 3.5 3.5 2.5-2.5 2.5 3.5" />
    </svg>
  );
}

function IconStories({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className} aria-hidden="true">
      <path d="M7 3.5h7l4 4v13A2.5 2.5 0 0 1 15.5 23h-8A2.5 2.5 0 0 1 5 20.5v-14A2.5 2.5 0 0 1 7.5 4Z" />
      <path d="M14 3.5V8h4.5" />
      <path d="M8.5 12h7M8.5 16h7" />
    </svg>
  );
}

function IconReach({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className} aria-hidden="true">
      <circle cx="18" cy="5" r="3" />
      <circle cx="6" cy="12" r="3" />
      <circle cx="18" cy="19" r="3" />
      <path d="M8.59 13.51l6.83 3.98M15.41 6.51L8.59 10.49" strokeLinecap="round" />
    </svg>
  );
}

export function PortalSidebar({
  showProvisioning = false,
  workspaceName,
  workspaceSlug,
}: {
  showProvisioning?: boolean;
  workspaceName?: string | null;
  workspaceSlug?: string | null;
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const qs = searchParams.toString();
  const suffix = qs ? `?${qs}` : "";
  const [session, setSession] = useState<PortalSession | null>(null);
  const [workspaceCookie, setWorkspaceCookie] = useState<string | null>(null);

  useEffect(() => {
    setWorkspaceCookie(readCookie(ACTIVE_WORKSPACE_COOKIE));
  }, [qs]);

  useEffect(() => {
    const controller = new AbortController();

    async function loadSession() {
      try {
        const response = await fetch(`/api/portal-session${suffix}`, { cache: "no-store", signal: controller.signal });
        if (!response.ok) {
          return;
        }
        const payload = (await response.json()) as { session?: PortalSession | null };
        setSession(payload.session ?? null);
      } catch {
        if (!controller.signal.aborted) {
          setSession(null);
        }
      }
    }

    void loadSession();
    return () => controller.abort();
  }, [suffix]);

  const workspace = workspaceSlug ?? searchParams.get("workspace") ?? session?.activeWorkspace?.slug ?? workspaceCookie;
  const photoVaultHref = workspace
    ? `/auth/launch/photovault?workspace=${encodeURIComponent(workspace)}`
    : "/auth/launch/photovault";
  const storiesHref = workspace
    ? `/auth/launch/stories?workspace=${encodeURIComponent(workspace)}`
    : "/auth/launch/stories";
  const reachHref = workspace
    ? `/auth/launch/reach?workspace=${encodeURIComponent(workspace)}`
    : "/auth/launch/reach";

  const displayName = workspaceName ?? session?.activeWorkspace?.displayName ?? workspace ?? null;
  const orgInitials = displayName
    ? displayName.split(" ").map((p: string) => p[0] ?? "").join("").slice(0, 2).toUpperCase()
    : "CP";

  return (
    <div className="flex h-full flex-col">

      {/* Workspace lockup */}
      <section className="flex items-center gap-4 border-b border-[#e5e7eb] px-6 py-6">
        <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-[#2f76dd] text-[1.05rem] font-semibold tracking-[-0.02em] text-white">
          {orgInitials}
        </div>
        <div className="min-w-0">
          <p className="truncate text-[15px] font-semibold tracking-[-0.02em] text-[#202020]">
            {displayName ?? "Canopy Platform"}
          </p>
          <p className="mt-0.5 text-[13px] text-[#6b7280]">Canopy Portal</p>
        </div>
      </section>

      {/* Nav */}
      <nav className="px-4 py-6">
        <p className="mb-3 px-3 text-[12px] font-semibold uppercase tracking-[0.06em] text-[#9ca3af]">Navigation</p>
        <div className="space-y-0.5">
          <Link href={`/app${suffix}`} className={navClass(pathname === "/app")}>
            <IconHome className="h-[18px] w-[18px]" />
            Home
          </Link>
          <Link href={`/app/account${suffix}`} className={navClass(pathname.startsWith("/app/account"))}>
            <IconUser className="h-[18px] w-[18px]" />
            Account
          </Link>
          {showProvisioning && (
            <Link href={`/app/provisioning${suffix}`} className={navClass(pathname.startsWith("/app/provisioning"))}>
              <IconShield className="h-[18px] w-[18px]" />
              Provisioning
            </Link>
          )}
        </div>

        <p className="mb-3 mt-6 px-3 text-[12px] font-semibold uppercase tracking-[0.06em] text-[#9ca3af]">Launch</p>
        <div className="space-y-0.5">
          <Link href={photoVaultHref} className={navClass(false)}>
            <IconPhoto className="h-[18px] w-[18px]" />
            Open PhotoVault
          </Link>
          <Link href={storiesHref} className={navClass(false)}>
            <IconStories className="h-[18px] w-[18px]" />
            Open Stories
          </Link>
          <Link href={reachHref} className={navClass(false)}>
            <IconReach className="h-[18px] w-[18px]" />
            Open Reach
          </Link>
        </div>
      </nav>
    </div>
  );
}
