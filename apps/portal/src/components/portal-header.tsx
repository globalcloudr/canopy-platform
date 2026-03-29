"use client";

import { useEffect, useState } from "react";
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@canopy/ui";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import type { PortalSession } from "@/lib/platform";

function ChevronDown({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

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
  const workspaceLinks = memberships
    .map((m) => m.workspace)
    .filter((w, i, arr) => arr.findIndex((c) => c.id === w.id) === i);
  const workspaceLabel = activeWorkspace?.displayName
    ?? (session ? (session.isPlatformOperator ? "All workspaces" : "Select workspace") : "Loading...");
  const initials = user?.email
    ? user.email.split("@")[0].split(/[.\-_]/).filter(Boolean).slice(0, 2).map((p) => p[0]?.toUpperCase() ?? "").join("")
    : "C";
  const displayName = user?.displayName ?? user?.email ?? "Canopy User";
  const roleLabel = session?.platformRole ? session.platformRole.replace(/_/g, " ") : null;

  return (
    <header className="border-b border-[var(--border)] bg-white/95">
      <div className="flex h-14 items-center justify-between gap-3 px-4 sm:px-6">

        {/* Left: brand + workspace switcher */}
        <div className="flex min-w-0 items-center gap-3">
          <Link href={`/app${suffix}`} className="flex shrink-0 items-center gap-2 no-underline text-inherit outline-none">
            <div className="grid h-8 w-8 place-items-center rounded-[7px] bg-[#0f1f3d] text-[0.95rem] font-extrabold tracking-[-0.02em] text-white" aria-hidden="true">
              C
            </div>
            <span className="text-[0.95rem] font-bold tracking-[-0.01em] text-[var(--foreground)]">Canopy</span>
          </Link>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary" size="sm" className="hidden min-w-[200px] justify-start gap-1.5 shadow-none sm:inline-flex">
                <span className="mr-0.5 text-[0.7rem] font-bold uppercase tracking-[0.06em] text-[var(--text-muted)]">Workspace</span>
                <span className="truncate">{workspaceLabel}</span>
                <ChevronDown className="ml-auto shrink-0 text-[var(--text-muted)]" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-72 bg-white">
              <DropdownMenuLabel>Switch workspace</DropdownMenuLabel>
              <DropdownMenuGroup>
                {session?.isPlatformOperator && (
                  <DropdownMenuItem asChild>
                    <Link href={`/app${suffix}`}>Platform overview</Link>
                  </DropdownMenuItem>
                )}
                {workspaceLinks.map((workspace) => {
                  const params = new URLSearchParams(qs);
                  params.set("workspace", workspace.slug);
                  return (
                    <DropdownMenuItem key={workspace.id} asChild>
                      <Link href={`/app?${params.toString()}`}>{workspace.displayName}</Link>
                    </DropdownMenuItem>
                  );
                })}
                {workspaceLinks.length === 0 && session && !session.isPlatformOperator && (
                  <DropdownMenuItem disabled>No workspaces found</DropdownMenuItem>
                )}
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Right: app pill + avatar */}
        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          <div className="hidden sm:flex items-center gap-1.5 rounded-md border border-[var(--border)] bg-[var(--surface)] px-3 py-[5px] text-[0.8rem] font-medium text-[var(--foreground)]">
            <span className="mr-0.5 text-[0.7rem] font-bold uppercase tracking-[0.06em] text-[var(--text-muted)]">App</span>
            Portal
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="secondary"
                size="icon"
                className="h-10 w-10 rounded-full border-[var(--border)] bg-[var(--surface-muted)] text-sm font-semibold text-[var(--foreground)] shadow-none hover:bg-[var(--surface)]"
                aria-label="Open account menu"
              >
                {session ? initials : "…"}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-72 p-0 bg-white">
              <div className="flex items-start justify-between gap-3 border-b border-[var(--border)] px-4 py-3">
                <div className="min-w-0">
                  <p className="m-0 truncate text-base font-semibold text-[var(--foreground)]">{displayName}</p>
                  {user?.displayName && <p className="m-0 truncate text-[0.8rem] text-[var(--text-muted)]">{user.email}</p>}
                </div>
                {roleLabel && (
                  <span className="shrink-0 rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5 text-xs font-medium text-slate-600">
                    {roleLabel}
                  </span>
                )}
              </div>
              <div className="p-2">
                <DropdownMenuItem asChild><Link href={`/app/account${suffix}`}>Account</Link></DropdownMenuItem>
                <DropdownMenuItem asChild><Link href={`/app${suffix}`}>Portal overview</Link></DropdownMenuItem>
                <DropdownMenuItem asChild><a href="mailto:info@akkedisdigital.com?subject=Canopy%20Portal%20Feedback">Questions / feedback</a></DropdownMenuItem>
              </div>
              <DropdownMenuSeparator />
              <div className="p-2">
                <DropdownMenuItem asChild><Link href="/auth/sign-out">Sign out</Link></DropdownMenuItem>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
