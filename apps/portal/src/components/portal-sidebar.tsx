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
import { getAdditionalLauncherProducts, getEnabledLauncherProducts, getLauncherServices } from "@/lib/products";

const ACTIVE_WORKSPACE_COOKIE = "canopy_portal_workspace";
const PORTAL_SESSION_REFRESH_EVENT = "canopy:portal-session-refresh";

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

function formatWorkspaceLabel(slug: string | null | undefined) {
  if (!slug) {
    return null;
  }

  return slug
    .split("-")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function navClass(active: boolean) {
  return cn(
    "flex items-center gap-2.5 rounded-2xl px-3.5 py-3 font-medium text-[15px] tracking-[-0.01em] transition",
    active
      ? "bg-white/82 text-[#172033] shadow-[0_10px_24px_rgba(35,74,144,0.08)]"
      : "text-[#506176] hover:bg-white/48 hover:text-[#172033]"
  );
}

function subnavClass() {
  return "ml-[30px] flex items-center rounded-xl px-3 py-2 text-[13px] font-medium tracking-[-0.01em] text-[#6d7d90] transition hover:bg-white/32 hover:text-[#172033]";
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

function ChevronDown({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className} aria-hidden="true">
      <path d="m6 9 6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function PortalSidebar({
  showProvisioning = false,
}: {
  showProvisioning?: boolean;
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const queryWorkspace = searchParams.get("workspace")?.trim() || null;
  const requestedWorkspace = queryWorkspace;
  const workspaceRequest = new URLSearchParams();
  if (requestedWorkspace) {
    workspaceRequest.set("workspace", requestedWorkspace);
  }
  const suffix = workspaceRequest.toString() ? `?${workspaceRequest.toString()}` : "";
  const [session, setSession] = useState<PortalSession | null>(null);
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

    function handleRefresh() {
      void loadSession();
    }

    void loadSession();
    window.addEventListener(PORTAL_SESSION_REFRESH_EVENT, handleRefresh);
    return () => {
      controller.abort();
      window.removeEventListener(PORTAL_SESSION_REFRESH_EVENT, handleRefresh);
    };
  }, [suffix]);

  const activeWorkspace = session?.activeWorkspace ?? null;
  const isSuperAdmin = session?.platformRole === "super_admin";
  const sessionMatchesWorkspace = !requestedWorkspace || activeWorkspace?.slug === requestedWorkspace;
  const workspace = requestedWorkspace ?? (sessionMatchesWorkspace ? activeWorkspace?.slug : null) ?? workspaceCookie;
  const photoVaultHref = workspace
    ? `/auth/launch/photovault?workspace=${encodeURIComponent(workspace)}`
    : "/auth/launch/photovault";
  const storiesHref = workspace
    ? `/auth/launch/stories?workspace=${encodeURIComponent(workspace)}`
    : "/auth/launch/stories";
  const communityHref = workspace
    ? `/auth/launch/community?workspace=${encodeURIComponent(workspace)}`
    : "/auth/launch/community";
  const reachHref = workspace
    ? `/auth/launch/reach?workspace=${encodeURIComponent(workspace)}`
    : "/auth/launch/reach";
  const createHref = workspace
    ? `/auth/launch/create?workspace=${encodeURIComponent(workspace)}`
    : "/auth/launch/create";
  const launchableProductKeys = new Set(
    getEnabledLauncherProducts(sessionMatchesWorkspace ? session?.entitlements ?? [] : [], { workspaceSlug: workspace ?? undefined })
      .filter((product) => product.canLaunch)
      .map((product) => product.productKey)
  );
  const additionalProducts = getAdditionalLauncherProducts(sessionMatchesWorkspace ? session?.entitlements ?? [] : [], {
    workspaceSlug: workspace ?? undefined,
  });
  const launcherServices = getLauncherServices(sessionMatchesWorkspace ? session?.entitlements ?? [] : [], {
    workspaceSlug: workspace ?? undefined,
  });
  const showHomeSubnav = pathname === "/";
  const showAccountSubnav = pathname.startsWith("/account");
  const homeSubItems =
    session?.isPlatformOperator && !activeWorkspace
      ? [{ label: "Workspace Context", href: `/${suffix}#workspace-context` }]
      : [
          { label: "Your Apps", href: `/${suffix}#products` },
          ...(launcherServices.length > 0 ? [{ label: "Active Services", href: `/${suffix}#services` }] : []),
          ...(additionalProducts.length > 0 ? [{ label: "More from Canopy", href: `/${suffix}#more-products` }] : []),
        ];
  const accountSubItems =
    session?.isPlatformOperator && !activeWorkspace
      ? [{ label: "Platform Context", href: `/account${suffix}#platform-context` }]
      : [
          { label: "Organization Details", href: `/account${suffix}#organization-details` },
          { label: "Workspace Access", href: `/account${suffix}#workspace-access` },
          { label: "Products & Services", href: `/account${suffix}#products-services` },
        ];

  const displayName = sessionMatchesWorkspace ? activeWorkspace?.displayName ?? formatWorkspaceLabel(workspace) : formatWorkspaceLabel(requestedWorkspace);
  const orgInitials = displayName
    ? displayName.split(" ").map((p: string) => p[0] ?? "").join("").slice(0, 2).toUpperCase()
    : "CP";
  const portalHomeHref = `/${suffix}`;
  const schoolOpsHref = `/school-ops${suffix}`;
  const platformUsersHref = `/platform-users${suffix}`;
  const launcherItems = [
    { key: "portal", label: "Canopy Portal", href: portalHomeHref, current: true },
    ...(launchableProductKeys.has("photovault") ? [{ key: "photovault", label: "PhotoVault", href: photoVaultHref }] : []),
    ...(launchableProductKeys.has("stories_canopy") ? [{ key: "stories", label: "Canopy Stories", href: storiesHref }] : []),
    ...(launchableProductKeys.has("create_canopy") ? [{ key: "create", label: "Canopy Create", href: createHref }] : []),
    ...(launchableProductKeys.has("community_canopy") ? [{ key: "community", label: "Canopy Community", href: communityHref }] : []),
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
              <div className="grid h-12 w-12 shrink-0 place-items-center rounded-[var(--radius-soft)] bg-[var(--accent)] text-[1.05rem] font-semibold tracking-[-0.02em] text-white shadow-[var(--shadow-sm)]">
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
            <DropdownMenuLabel className="text-[#66758a]">{displayName ?? "Workspace"}</DropdownMenuLabel>
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
          <p className="mb-3 px-3 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#8ea0b7]">Workspace</p>
          <div className="space-y-1.5">
            <div>
              <Link href={`/${suffix}`} className={navClass(pathname === "/")}>
                <IconHome className="h-[18px] w-[18px]" />
                Home
              </Link>
              {showHomeSubnav ? (
                <div className="mt-1 space-y-1">
                  {homeSubItems.map((item) => (
                    <Link key={item.href} href={item.href} className={subnavClass()}>
                      {item.label}
                    </Link>
                  ))}
                </div>
              ) : null}
            </div>
            <div>
              <Link href={`/account${suffix}`} className={navClass(pathname.startsWith("/account"))}>
                <IconUser className="h-[18px] w-[18px]" />
                Account
              </Link>
              {showAccountSubnav ? (
                <div className="mt-1 space-y-1">
                  {accountSubItems.map((item) => (
                    <Link key={item.href} href={item.href} className={subnavClass()}>
                      {item.label}
                    </Link>
                  ))}
                </div>
              ) : null}
            </div>
          </div>
          {(showProvisioning || isSuperAdmin) ? (
            <>
              <p className="mb-3 mt-6 px-3 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#8ea0b7]">Super Admin</p>
              <div className="space-y-1.5">
                {showProvisioning && (
                  <Link href={`/provisioning${suffix}`} className={navClass(pathname.startsWith("/provisioning"))}>
                    <IconShield className="h-[18px] w-[18px]" />
                    Provisioning
                  </Link>
                )}
                {isSuperAdmin && (
                  <Link href={schoolOpsHref} className={navClass(pathname.startsWith("/school-ops"))}>
                    <IconShield className="h-[18px] w-[18px]" />
                    School Ops
                  </Link>
                )}
                {isSuperAdmin && (
                  <Link href={platformUsersHref} className={navClass(pathname.startsWith("/platform-users"))}>
                    <IconUser className="h-[18px] w-[18px]" />
                    Platform Users
                  </Link>
                )}
              </div>
            </>
          ) : null}
        </div>
      </nav>
    </div>
  );
}
