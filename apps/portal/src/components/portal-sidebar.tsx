"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import {
  cn,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@canopy/ui";
import type { PortalSession } from "@/lib/platform";
import { getEnabledLauncherProducts } from "@/lib/products";

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
    "flex items-center gap-2.5 rounded-2xl px-3.5 py-3 font-medium text-[15px] tracking-[-0.01em] transition",
    active
      ? "bg-white/82 text-[#172033] shadow-[0_10px_24px_rgba(35,74,144,0.08)]"
      : "text-[#506176] hover:bg-white/48 hover:text-[#172033]"
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

function ChevronDown({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className} aria-hidden="true">
      <path d="m6 9 6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function PortalSidebar({
  showProvisioning = false,
  workspaceName,
  workspaceSlug,
  initialSession = null,
}: {
  showProvisioning?: boolean;
  workspaceName?: string | null;
  workspaceSlug?: string | null;
  initialSession?: PortalSession | null;
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const requestedWorkspace = searchParams.get("workspace") ?? workspaceSlug ?? null;
  const workspaceRequest = new URLSearchParams();
  if (requestedWorkspace) {
    workspaceRequest.set("workspace", requestedWorkspace);
  }
  const suffix = workspaceRequest.toString() ? `?${workspaceRequest.toString()}` : "";
  const [session, setSession] = useState<PortalSession | null>(initialSession);
  const [workspaceCookie, setWorkspaceCookie] = useState<string | null>(null);

  useEffect(() => {
    setWorkspaceCookie(readCookie(ACTIVE_WORKSPACE_COOKIE));
  }, [requestedWorkspace]);

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

  const workspace = requestedWorkspace ?? session?.activeWorkspace?.slug ?? workspaceCookie;
  const photoVaultHref = workspace
    ? `/auth/launch/photovault?workspace=${encodeURIComponent(workspace)}`
    : "/auth/launch/photovault";
  const storiesHref = workspace
    ? `/auth/launch/stories?workspace=${encodeURIComponent(workspace)}`
    : "/auth/launch/stories";
  const reachHref = workspace
    ? `/auth/launch/reach?workspace=${encodeURIComponent(workspace)}`
    : "/auth/launch/reach";
  const launchableProductKeys = new Set(
    getEnabledLauncherProducts(session?.entitlements ?? [], { workspaceSlug: workspace ?? undefined })
      .filter((product) => product.canLaunch)
      .map((product) => product.productKey)
  );

  const displayName = workspaceName ?? session?.activeWorkspace?.displayName ?? workspace ?? null;
  const orgInitials = displayName
    ? displayName.split(" ").map((p: string) => p[0] ?? "").join("").slice(0, 2).toUpperCase()
    : "CP";
  const portalHomeHref = `/app${suffix}`;
  const launcherItems = [
    { key: "portal", label: "Canopy Portal", href: portalHomeHref, current: true },
    ...(launchableProductKeys.has("photovault") ? [{ key: "photovault", label: "PhotoVault", href: photoVaultHref }] : []),
    ...(launchableProductKeys.has("stories_canopy") ? [{ key: "stories", label: "Canopy Stories", href: storiesHref }] : []),
    ...(launchableProductKeys.has("reach_canopy") ? [{ key: "reach", label: "Canopy Reach", href: reachHref }] : []),
  ];

  return (
    <div className="flex h-full flex-col">

      {/* Workspace lockup */}
      <div className="mx-4 mt-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              className="flex w-full items-center gap-4 rounded-[28px] bg-transparent px-6 py-6 text-left transition hover:bg-white/28"
            >
              <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-[linear-gradient(135deg,#2f76dd_0%,#5c96ea_100%)] text-[1.05rem] font-semibold tracking-[-0.02em] text-white shadow-[0_10px_24px_rgba(47,118,221,0.28)]">
                {orgInitials}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-[15px] font-semibold tracking-[-0.02em] text-[#202020]">
                  {displayName ?? "Canopy Platform"}
                </p>
                <p className="mt-0.5 text-[13px] text-[#6f7e90]">Canopy Portal</p>
              </div>
              <ChevronDown className="h-4 w-4 shrink-0 text-[#94a3b8]" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-72 bg-white">
            <DropdownMenuLabel>{displayName ?? "Workspace"}</DropdownMenuLabel>
            <DropdownMenuGroup>
              {launcherItems.map((item) =>
                item.current ? (
                  <DropdownMenuItem key={item.key} className="font-medium">
                    {item.label}
                    <span className="ml-auto text-[11px] text-[var(--text-muted)]">current</span>
                  </DropdownMenuItem>
                ) : (
                  <DropdownMenuItem key={item.key} asChild>
                    <a href={item.href}>{item.label}</a>
                  </DropdownMenuItem>
                )
              )}
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <a href={portalHomeHref}>Back to portal home</a>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Nav */}
      <nav className="px-4 py-6">
        <div className="rounded-[28px] bg-transparent px-4 py-4 shadow-none">
          <p className="mb-3 px-3 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#8ea0b7]">Navigation</p>
          <div className="space-y-1.5">
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

          <p className="mb-3 mt-6 px-3 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#8ea0b7]">Launch</p>
          <div className="space-y-1.5">
            {launchableProductKeys.has("photovault") && (
              <Link href={photoVaultHref} className={navClass(false)}>
                <IconPhoto className="h-[18px] w-[18px]" />
                Open PhotoVault
              </Link>
            )}
            {launchableProductKeys.has("stories_canopy") && (
              <Link href={storiesHref} className={navClass(false)}>
                <IconStories className="h-[18px] w-[18px]" />
                Open Stories
              </Link>
            )}
            {launchableProductKeys.has("reach_canopy") && (
              <Link href={reachHref} className={navClass(false)}>
                <IconReach className="h-[18px] w-[18px]" />
                Open Reach
              </Link>
            )}
          </div>
        </div>
      </nav>
    </div>
  );
}
