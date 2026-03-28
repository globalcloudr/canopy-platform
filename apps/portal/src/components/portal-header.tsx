"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import type { PortalSession } from "@/lib/platform";
import { getEnabledLauncherProducts } from "@/lib/products";

type StripItem = {
  key: string;
  label: string;
  meta: string;
  href: string;
  active: boolean;
  accent: string;
  external: boolean;
};

export function PortalHeader() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const qs = searchParams.toString();
  const suffix = qs ? `?${qs}` : "";
  const [session, setSession] = useState<PortalSession | null>(null);
  const [switcherOpen, setSwitcherOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const switcherRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const controller = new AbortController();

    async function loadSession() {
      try {
        const response = await fetch(`/api/portal-session${suffix}`, {
          cache: "no-store",
          signal: controller.signal,
        });

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

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (switcherRef.current && !switcherRef.current.contains(e.target as Node)) {
        setSwitcherOpen(false);
      }

      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const activeWorkspace = session?.activeWorkspace ?? null;
  const user = session?.user ?? null;
  const memberships = session?.memberships ?? [];
  const entitlements = session?.entitlements ?? [];
  const activeMembership = activeWorkspace
    ? memberships.find((membership) => membership.workspaceId === activeWorkspace.id)
    : null;
  const enabledProducts = getEnabledLauncherProducts(entitlements, {
    workspaceSlug: activeWorkspace?.slug,
  }).filter((p) => p.kind === "product");
  const workspaceLinks = memberships
    .map((membership) => membership.workspace)
    .filter((workspace, index, array) => array.findIndex((candidate) => candidate.id === workspace.id) === index);
  const initials = user?.email
    ? user.email
        .split("@")[0]
        .split(/[.\-_]/)
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0]?.toUpperCase() ?? "")
        .join("")
    : "C";
  const workspaceLabel = activeWorkspace?.displayName ?? (session?.isPlatformOperator ? "Platform overview" : "Select workspace");
  const topBarStatus = activeWorkspace
    ? `${enabledProducts.length} app${enabledProducts.length === 1 ? "" : "s"} available`
    : `${workspaceLinks.length} workspace${workspaceLinks.length === 1 ? "" : "s"} visible`;
  const portalActive = !pathname.startsWith("/app/products/");

  const stripItems: StripItem[] = [
    {
      key: "portal",
      label: "Portal",
      meta: portalActive ? "Overview" : "Return home",
      href: `/app${suffix}`,
      active: portalActive,
      accent: "#0f1f3d",
      external: false,
    },
    ...enabledProducts.map((product) => {
      const targetPath = product.primaryActionTarget.startsWith("/")
        ? product.primaryActionTarget.split("?")[0]
        : null;
      const active = targetPath ? pathname === targetPath : false;

      return {
        key: product.productKey,
        label: product.displayName.replace(" by Canopy", ""),
        meta: product.stateLabel,
        href: product.primaryActionTarget,
        active,
        accent: product.iconColor,
        external: product.primaryActionTarget.startsWith("http") || product.primaryActionTarget.startsWith("/auth/launch/"),
      };
    }),
  ];

  return (
    <header className="border-b border-[var(--shell-rail-border)] bg-[var(--shell-topbar)] shadow-[0_1px_0_rgba(15,31,61,0.04)]">
      <div className="flex h-14 items-center justify-between gap-3 px-4 sm:px-6">
        <div className="flex min-w-0 items-center gap-3">
          <Link href={`/app${suffix}`} className="flex items-center gap-2.5 no-underline text-inherit shrink-0">
            <div
              className="grid h-8 w-8 place-items-center rounded-[7px] bg-navy text-[0.95rem] font-extrabold tracking-[-0.02em] text-white"
              aria-hidden="true"
            >
              C
            </div>
            <p className="m-0 text-[0.95rem] font-bold tracking-[-0.01em] text-ink">Canopy</p>
          </Link>

          <div className="hidden h-7 w-px bg-[var(--shell-divider)] md:block" />

          <div className="relative hidden sm:block" ref={switcherRef}>
            <button
              onClick={() => setSwitcherOpen((open) => !open)}
              className="flex min-w-[220px] items-center gap-2 rounded-[12px] border border-[var(--shell-chip-border)] bg-white/88 px-3 py-2 text-left whitespace-nowrap transition-colors hover:bg-white"
              aria-expanded={switcherOpen}
            >
              <div className="grid h-8 w-8 place-items-center rounded-[10px] bg-[var(--shell-chip-icon-bg)] text-[0.75rem] font-bold uppercase tracking-[0.04em] text-navy">
                {workspaceLabel[0] ?? "W"}
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-[0.66rem] font-bold uppercase tracking-[0.12em] text-muted-light">Workspace</div>
                <div className="truncate text-[0.88rem] font-semibold text-ink">{workspaceLabel}</div>
              </div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="ml-0.5 shrink-0 text-muted-light"
              >
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>

            {switcherOpen ? (
              <div className="absolute top-[calc(100%+8px)] left-0 z-[200] w-72 overflow-hidden rounded-[18px] border border-[rgba(15,31,61,0.12)] bg-white shadow-[0_20px_42px_rgba(15,31,61,0.16)]">
                <div className="px-3 pt-3 pb-1.5">
                  <p className="text-[0.68rem] font-bold uppercase tracking-[0.12em] text-muted-light">Workspace context</p>
                </div>
                <div className="p-1.5">
                  {session?.isPlatformOperator ? (
                    <Link
                      href={`/app${suffix}`}
                      onClick={() => setSwitcherOpen(false)}
                      className="flex items-center gap-2.5 rounded-md px-2.5 py-2 no-underline transition-colors hover:bg-[rgba(15,31,61,0.04)]"
                    >
                      <div className="grid h-6 w-6 place-items-center rounded-[5px] bg-[#16233f] text-[0.65rem] font-extrabold text-white shrink-0">
                        P
                      </div>
                      <span className="flex-1 text-[0.875rem] font-medium text-ink">Platform overview</span>
                    </Link>
                  ) : null}
                  {workspaceLinks.map((workspace) => {
                    const params = new URLSearchParams(qs);
                    params.set("workspace", workspace.slug);
                    const href = `/app?${params.toString()}`;

                    return (
                      <Link
                        key={workspace.id}
                        href={href}
                        onClick={() => setSwitcherOpen(false)}
                        className="flex items-center gap-2.5 rounded-md px-2.5 py-2 no-underline transition-colors hover:bg-[rgba(15,31,61,0.04)]"
                      >
                        <div className="grid h-6 w-6 place-items-center rounded-[5px] bg-[rgba(15,31,61,0.08)] text-[0.65rem] font-extrabold text-[#16233f] shrink-0">
                          {workspace.displayName[0]}
                        </div>
                        <span className="flex-1 text-[0.875rem] font-medium text-ink">{workspace.displayName}</span>
                      </Link>
                    );
                  })}
                </div>
              </div>
            ) : null}
          </div>

          <div className="hidden items-center gap-2 text-[0.78rem] text-muted lg:flex">
            <span className="rounded-full border border-[var(--shell-chip-border)] bg-white/72 px-2.5 py-1 font-semibold text-ink-2">
              {activeMembership?.role ?? session?.platformRole?.replace(/_/g, " ") ?? "workspace access"}
            </span>
            <span>{topBarStatus}</span>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <a
            href="mailto:info@akkedisdigital.com"
            className="hidden h-9 items-center justify-center rounded-full border border-[var(--shell-chip-border)] bg-white/72 px-3.5 text-[0.82rem] font-semibold text-ink-2 no-underline transition-colors hover:bg-white sm:inline-flex"
          >
            Support
          </a>
          <a
            href="mailto:info@akkedisdigital.com"
            className="grid h-9 w-9 place-items-center rounded-full border border-[var(--shell-chip-border)] bg-white/72 text-muted transition-colors hover:bg-white hover:text-ink-2"
            aria-label="Send feedback"
          >
            <IconFeedback />
          </a>

          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setMenuOpen((open) => !open)}
              className="grid h-10 w-10 place-items-center rounded-full bg-navy text-[0.78rem] font-bold text-white shrink-0 transition-colors hover:bg-navy-mid cursor-pointer"
              aria-label="Open account menu"
              aria-expanded={menuOpen}
            >
              {initials || "C"}
            </button>

            {menuOpen ? (
              <div className="absolute top-[calc(100%+8px)] right-0 z-[200] w-72 overflow-hidden rounded-xl border border-[rgba(15,31,61,0.1)] bg-white shadow-[0_8px_24px_rgba(15,31,61,0.12)]">
                <div className="border-b border-[rgba(15,31,61,0.08)] px-4 py-3">
                  <p className="m-0 text-[0.9rem] font-semibold text-ink">{user?.displayName ?? "Canopy User"}</p>
                  <p className="m-0 text-[0.8rem] text-muted">{user?.email ?? "Sign in to load account data"}</p>
                  <span className="mt-1.5 inline-block rounded-full border border-[rgba(15,31,61,0.15)] px-2 py-0.5 text-[0.7rem] font-semibold uppercase tracking-[0.06em] text-muted">
                    {activeMembership?.role ?? session?.platformRole?.replace(/_/g, " ") ?? "staff"}
                  </span>
                </div>
                <div className="p-1.5">
                  <Link
                    href={`/app/account${suffix}`}
                    className="flex items-center gap-2.5 rounded-md px-3 py-2 text-[0.875rem] text-ink-2 no-underline transition-colors hover:bg-[rgba(15,31,61,0.04)]"
                    onClick={() => setMenuOpen(false)}
                  >
                    <IconSettingsMenu />
                    Account settings
                  </Link>
                  <a
                    href="mailto:info@akkedisdigital.com"
                    className="flex items-center gap-2.5 rounded-md px-3 py-2 text-[0.875rem] text-ink-2 no-underline transition-colors hover:bg-[rgba(15,31,61,0.04)]"
                  >
                    <IconHelp />
                    Help &amp; support
                  </a>
                  <a
                    href="mailto:info@akkedisdigital.com"
                    className="flex items-center gap-2.5 rounded-md px-3 py-2 text-[0.875rem] text-ink-2 no-underline transition-colors hover:bg-[rgba(15,31,61,0.04)]"
                  >
                    <IconFeedback />
                    Send feedback
                  </a>
                </div>
                <div className="border-t border-[rgba(15,31,61,0.08)] p-1.5">
                  <Link
                    href="/auth/sign-out"
                    className="flex items-center gap-2.5 rounded-md px-3 py-2 text-[0.875rem] text-muted no-underline transition-colors hover:bg-[rgba(15,31,61,0.04)] hover:text-ink-2"
                    onClick={() => setMenuOpen(false)}
                  >
                    <IconLogout />
                    Sign out
                  </Link>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>

      <div className="border-t border-[var(--shell-rail-border)] bg-[var(--shell-appbar)]">
        <div className="flex items-stretch overflow-x-auto px-2 sm:px-4">
          {stripItems.map((item) => (
            <Link
              key={item.key}
              href={item.href}
              className={[
                "group relative flex min-w-[116px] shrink-0 flex-col items-center justify-center gap-1 border-r border-[var(--shell-rail-border)] px-4 py-3.5 text-center no-underline transition-colors",
                item.active ? "bg-white text-ink" : "text-muted hover:bg-white/70 hover:text-ink-2",
              ].join(" ")}
            >
              {item.active ? (
                <span
                  className="absolute inset-x-0 top-0 h-[2px]"
                  style={{ backgroundColor: item.accent }}
                  aria-hidden="true"
                />
              ) : null}
              <span
                className="grid h-8 w-8 place-items-center rounded-[10px] text-[0.78rem] font-extrabold tracking-[-0.02em] transition-colors"
                style={{
                  backgroundColor: item.active ? item.accent : "rgba(15,31,61,0.06)",
                  color: item.active ? "#ffffff" : item.accent,
                }}
              >
                {item.label[0]}
              </span>
              <span className="text-[0.82rem] font-semibold tracking-[-0.01em]">{item.label}</span>
              <span className="text-[0.68rem] font-medium uppercase tracking-[0.08em] text-muted-light">
                {item.meta}
                {item.external ? " ↗" : ""}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </header>
  );
}

function IconSettingsMenu() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 text-muted">
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

function IconHelp() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 text-muted">
      <circle cx="12" cy="12" r="10" />
      <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
      <path d="M12 17h.01" />
    </svg>
  );
}

function IconFeedback() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  );
}

function IconLogout() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 text-muted">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  );
}
