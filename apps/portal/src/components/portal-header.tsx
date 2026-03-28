"use client";

import { useEffect, useRef, useState } from "react";
import { Button, MenuSurface, MenuHeader, MenuSection, MenuItem, MenuButton, MenuSeparator } from "@canopy/ui";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import type { PortalSession } from "@/lib/platform";

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
  const workspaceLinks = memberships
    .map((membership) => membership.workspace)
    .filter((workspace, index, array) => array.findIndex((candidate) => candidate.id === workspace.id) === index);
  const workspaceLabel = activeWorkspace?.displayName ?? (session?.isPlatformOperator ? "Platform overview" : "Select workspace");
  const initials = user?.email
    ? user.email
        .split("@")[0]
        .split(/[.\-_]/)
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0]?.toUpperCase() ?? "")
        .join("")
    : "C";
  const roleLabel = session?.platformRole ? session.platformRole.replace(/_/g, " ") : "portal user";

  return (
    <header className="border-b border-[var(--border)] bg-white/95">
      <div className="flex h-14 items-center justify-between gap-3 px-4 sm:px-6">
        <div className="flex min-w-0 items-center gap-4">
          <Link
            href={`/app${suffix}`}
            className="flex shrink-0 items-center gap-2 no-underline text-inherit outline-none focus:outline-none focus-visible:outline-none"
          >
            <div
              className="grid h-8 w-8 place-items-center rounded-[7px] bg-navy text-[0.95rem] font-extrabold tracking-[-0.02em] text-white"
              aria-hidden="true"
            >
              C
            </div>
            <span className="text-[0.95rem] font-bold tracking-[-0.01em] text-[var(--foreground, var(--ink))]">Canopy</span>
          </Link>

          <div className="relative hidden min-w-0 md:block" ref={switcherRef}>
            <Button
              onClick={() => setSwitcherOpen((open) => !open)}
              variant="secondary"
              size="sm"
              className="min-w-[220px] justify-start gap-1.5 border-[var(--border)] shadow-none font-outfit text-[0.8rem] text-[var(--foreground, var(--ink))]"
              aria-expanded={switcherOpen}
            >
              <span className="mr-0.5 text-[0.7rem] font-bold uppercase tracking-[0.06em] text-[var(--text-muted, var(--muted))]">Workspace</span>
              <span className="truncate">{workspaceLabel}</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="11"
                height="11"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="ml-0.5 shrink-0 text-[var(--text-muted, var(--muted))]"
              >
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </Button>

            {switcherOpen ? (
              <MenuSurface className="absolute top-[calc(100%+8px)] left-0 z-[200] w-72 border-[var(--border)]">
                <div className="px-3 pt-3 pb-1.5">
                  <p className="m-0 text-[0.68rem] font-bold uppercase tracking-[0.12em] text-[var(--text-muted, var(--muted))]">Workspace context</p>
                </div>
                <MenuSection className="pt-0">
                  {session?.isPlatformOperator ? (
                    <MenuItem
                      href={`/app${suffix}`}
                      onClick={() => setSwitcherOpen(false)}
                    >
                      <span className="flex-1 text-[0.875rem] font-medium text-ink">Platform overview</span>
                    </MenuItem>
                  ) : null}
                  {workspaceLinks.map((workspace) => {
                    const params = new URLSearchParams(qs);
                    params.set("workspace", workspace.slug);
                    const href = `/app?${params.toString()}`;

                    return (
                      <MenuItem
                        key={workspace.id}
                        href={href}
                        onClick={() => setSwitcherOpen(false)}
                      >
                        <span className="flex-1 text-[0.875rem] font-medium text-ink">{workspace.displayName}</span>
                      </MenuItem>
                    );
                  })}
                </MenuSection>
              </MenuSurface>
            ) : null}
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <a
            href="mailto:info@akkedisdigital.com"
            className="hidden text-sm font-medium text-muted no-underline transition-colors hover:text-ink sm:inline"
          >
            Support
          </a>
          <Button
            asChild
            variant="secondary"
            size="sm"
            className="hidden border-[var(--border)] shadow-none font-outfit text-[0.8rem] text-[var(--foreground, var(--ink))] sm:inline-flex"
          >
            <a href="/app">
              <span className="mr-0.5 text-[0.7rem] font-bold uppercase tracking-[0.06em] text-[var(--text-muted, var(--muted))]">App</span>
              Portal
              <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="ml-0.5 text-[var(--text-muted, var(--muted))]">
                <polyline points="6 9 12 15 18 9"/>
              </svg>
            </a>
          </Button>

          <div className="relative" ref={menuRef}>
            <Button
              onClick={() => setMenuOpen((open) => !open)}
              variant="secondary"
              size="icon"
              className="rounded-full border-[var(--border)] bg-[var(--surface-muted)] shadow-none font-outfit text-sm font-semibold text-[var(--foreground, var(--ink))] hover:bg-[var(--surface)]"
              aria-label="Open account menu"
              aria-expanded={menuOpen}
            >
              {initials || "C"}
            </Button>

            {menuOpen ? (
              <MenuSurface className="absolute top-[calc(100%+8px)] right-0 z-[200] w-72 border-[var(--border)]">
                <MenuHeader className="border-[var(--border)]">
                  <div className="min-w-0">
                    <p className="m-0 truncate text-base font-semibold text-ink">{user?.displayName ?? "Canopy User"}</p>
                    <p className="m-0 truncate text-[0.8rem] text-muted">{user?.email ?? "Sign in to load account data"}</p>
                  </div>
                  <p className="shrink-0 rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5 font-outfit text-xs font-medium text-slate-600">
                    {roleLabel}
                  </p>
                </MenuHeader>
                <MenuSection>
                  <MenuItem
                    href={`/app/account${suffix}`}
                    onClick={() => setMenuOpen(false)}
                  >
                    Account
                  </MenuItem>
                  <MenuItem
                    href={`/app${suffix}`}
                    onClick={() => setMenuOpen(false)}
                  >
                    Portal Overview
                  </MenuItem>
                  <MenuItem
                    href="mailto:info@akkedisdigital.com"
                  >
                    Questions / feedback
                  </MenuItem>
                </MenuSection>
                <MenuSeparator />
                <MenuSection>
                  <MenuItem
                    href="/auth/sign-out"
                    onClick={() => setMenuOpen(false)}
                  >
                    Sign out
                  </MenuItem>
                </MenuSection>
              </MenuSurface>
            ) : null}
          </div>
        </div>
      </div>
    </header>
  );
}
