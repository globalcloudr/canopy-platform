"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import type { PortalSession } from "@/lib/platform";
import { getEnabledLauncherProducts } from "@/lib/products";

export function PortalHeader() {
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
      if (switcherRef.current && !switcherRef.current.contains(e.target as Node)) setSwitcherOpen(false);
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false);
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
  const enabledProducts = getEnabledLauncherProducts(entitlements).filter((p) => p.kind === "product");
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

  return (
    <div className="border-b border-[rgba(15,31,61,0.1)] bg-white/95 backdrop-blur-sm">
      <div className="flex h-14 items-center justify-between gap-3 px-4 sm:px-6">
        <Link href={`/app${suffix}`} className="flex items-center gap-2.5 no-underline text-inherit shrink-0">
          <div
            className="grid place-items-center w-8 h-8 rounded-[7px] bg-navy text-white text-[0.95rem] font-extrabold tracking-[-0.02em] shrink-0"
            aria-hidden="true"
          >
            C
          </div>
          <p className="m-0 text-[0.95rem] font-bold text-ink tracking-[-0.01em]">Canopy</p>
        </Link>

        <div className="flex items-center gap-3 shrink-0">
          <div className="relative hidden sm:block" ref={switcherRef}>
            <button
              onClick={() => setSwitcherOpen((o) => !o)}
              className="flex items-center gap-1.5 px-3 py-[5px] border border-[rgba(15,31,61,0.18)] rounded-md bg-white text-[0.8rem] font-medium text-ink-2 whitespace-nowrap transition-colors hover:bg-[rgba(15,31,61,0.03)] cursor-pointer"
              aria-expanded={switcherOpen}
            >
              <span className="text-[0.7rem] font-bold uppercase tracking-[0.06em] text-muted-light mr-0.5">Org</span>
              {activeWorkspace?.displayName ?? (session?.isPlatformOperator ? "Platform" : "Workspace")}
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="ml-0.5 text-muted-light">
                <polyline points="6 9 12 15 18 9"/>
              </svg>
            </button>

            {switcherOpen && (
              <div className="absolute top-[calc(100%+8px)] right-0 w-64 bg-white border border-[rgba(15,31,61,0.1)] rounded-xl shadow-[0_8px_24px_rgba(15,31,61,0.12)] z-[200] overflow-hidden">
                <div className="px-3 pt-3 pb-1.5">
                  <p className="text-[0.68rem] font-bold uppercase tracking-[0.12em] text-muted-light">Workspace context</p>
                </div>
                <div className="p-1.5">
                  {session?.isPlatformOperator ? (
                    <Link
                      href={`/app${suffix}`}
                      onClick={() => setSwitcherOpen(false)}
                      className="flex items-center gap-2.5 px-2.5 py-2 rounded-md no-underline transition-colors hover:bg-[rgba(15,31,61,0.04)]"
                    >
                      <div className="grid place-items-center w-6 h-6 rounded-[5px] bg-[#16233f] text-white text-[0.65rem] font-extrabold shrink-0">
                        P
                      </div>
                      <span className="text-[0.875rem] font-medium text-ink flex-1">Platform overview</span>
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
                        className="flex items-center gap-2.5 px-2.5 py-2 rounded-md no-underline transition-colors hover:bg-[rgba(15,31,61,0.04)]"
                      >
                        <div className="grid place-items-center w-6 h-6 rounded-[5px] bg-[rgba(15,31,61,0.08)] text-[#16233f] text-[0.65rem] font-extrabold shrink-0">
                          {workspace.displayName[0]}
                        </div>
                        <span className="text-[0.875rem] font-medium text-ink flex-1">{workspace.displayName}</span>
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setMenuOpen((o) => !o)}
              className="grid place-items-center w-[34px] h-[34px] rounded-full bg-navy text-white text-[0.78rem] font-bold shrink-0 transition-colors hover:bg-navy-mid cursor-pointer"
              aria-label="Open account menu"
              aria-expanded={menuOpen}
            >
              {initials || "C"}
            </button>

            {menuOpen && (
              <div className="absolute top-[calc(100%+8px)] right-0 w-72 bg-white border border-[rgba(15,31,61,0.1)] rounded-xl shadow-[0_8px_24px_rgba(15,31,61,0.12)] z-[200] overflow-hidden">
                <div className="px-4 py-3 border-b border-[rgba(15,31,61,0.08)]">
                  <p className="text-[0.9rem] font-semibold text-ink m-0">{user?.displayName ?? "Canopy User"}</p>
                  <p className="text-[0.8rem] text-muted m-0">{user?.email ?? "Sign in to load account data"}</p>
                  <span className="inline-block mt-1.5 px-2 py-0.5 rounded-full border border-[rgba(15,31,61,0.15)] text-[0.7rem] font-semibold uppercase tracking-[0.06em] text-muted">
                    {activeMembership?.role ?? session?.platformRole?.replace(/_/g, " ") ?? "staff"}
                  </span>
                </div>
                <div className="p-1.5">
                  <Link
                    href={`/app/account${suffix}`}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-md text-[0.875rem] text-ink-2 no-underline hover:bg-[rgba(15,31,61,0.04)] transition-colors"
                    onClick={() => setMenuOpen(false)}
                  >
                    <IconSettingsMenu />
                    Account settings
                  </Link>
                  <a
                    href="mailto:info@akkedisdigital.com"
                    className="flex items-center gap-2.5 px-3 py-2 rounded-md text-[0.875rem] text-ink-2 no-underline hover:bg-[rgba(15,31,61,0.04)] transition-colors"
                  >
                    <IconHelp />
                    Help &amp; support
                  </a>
                  <a
                    href="mailto:info@akkedisdigital.com"
                    className="flex items-center gap-2.5 px-3 py-2 rounded-md text-[0.875rem] text-ink-2 no-underline hover:bg-[rgba(15,31,61,0.04)] transition-colors"
                  >
                    <IconFeedback />
                    Send feedback
                  </a>
                </div>
                <div className="p-1.5 border-t border-[rgba(15,31,61,0.08)]">
                  <Link
                    href="/auth/sign-out"
                    className="flex items-center gap-2.5 px-3 py-2 rounded-md text-[0.875rem] text-muted no-underline hover:bg-[rgba(15,31,61,0.04)] hover:text-ink-2 transition-colors"
                    onClick={() => setMenuOpen(false)}
                  >
                    <IconLogout />
                    Sign out
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function IconSettingsMenu() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 text-muted">
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
    </svg>
  );
}

function IconHelp() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 text-muted">
      <circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><path d="M12 17h.01"/>
    </svg>
  );
}

function IconFeedback() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 text-muted">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
    </svg>
  );
}

function IconLogout() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 text-muted">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
    </svg>
  );
}
