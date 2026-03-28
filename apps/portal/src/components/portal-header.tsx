"use client";

import { useEffect, useState } from "react";
import {
  Avatar,
  AvatarFallback,
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

export function PortalHeader() {
  const searchParams = useSearchParams();
  const qs = searchParams.toString();
  const suffix = qs ? `?${qs}` : "";
  const [session, setSession] = useState<PortalSession | null>(null);

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

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="secondary"
                size="sm"
                className="hidden min-w-[220px] justify-start gap-1.5 border-[var(--border)] shadow-none font-outfit text-[0.8rem] text-[var(--foreground, var(--ink))] md:inline-flex"
              >
                <span className="mr-0.5 text-[0.7rem] font-bold uppercase tracking-[0.06em] text-[var(--text-muted, var(--muted))]">Workspace</span>
                <span className="truncate">{workspaceLabel}</span>
                <ChevronDown className="ml-0.5 shrink-0 text-[var(--text-muted, var(--muted))]" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-72">
              <DropdownMenuLabel>Workspace context</DropdownMenuLabel>
              <DropdownMenuGroup>
                {session?.isPlatformOperator ? (
                  <DropdownMenuItem asChild>
                    <Link href={`/app${suffix}`}>Platform overview</Link>
                  </DropdownMenuItem>
                ) : null}
                {workspaceLinks.map((workspace) => {
                  const params = new URLSearchParams(qs);
                  params.set("workspace", workspace.slug);
                  const href = `/app?${params.toString()}`;

                  return (
                    <DropdownMenuItem key={workspace.id} asChild>
                      <Link href={href}>{workspace.displayName}</Link>
                    </DropdownMenuItem>
                  );
                })}
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
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
              <ChevronDown className="ml-0.5 text-[var(--text-muted, var(--muted))]" />
            </a>
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="secondary"
                size="icon"
                className="rounded-full border-[var(--border)] bg-[var(--surface-muted)] p-0 shadow-none hover:bg-[var(--surface)]"
                aria-label="Open account menu"
              >
                <Avatar className="h-10 w-10">
                  <AvatarFallback>{initials || "C"}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-72 p-0">
              <div className="flex items-start justify-between gap-3 border-b border-[var(--border)] px-4 py-3">
                <div className="min-w-0">
                  <p className="m-0 truncate text-base font-semibold text-ink">{user?.displayName ?? "Canopy User"}</p>
                  <p className="m-0 truncate text-[0.8rem] text-muted">{user?.email ?? "Sign in to load account data"}</p>
                </div>
                <p className="shrink-0 rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5 font-outfit text-xs font-medium text-slate-600">
                  {roleLabel}
                </p>
              </div>
              <div className="p-2">
                <DropdownMenuItem asChild>
                  <Link href={`/app/account${suffix}`}>Account</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href={`/app${suffix}`}>Portal Overview</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <a href="mailto:info@akkedisdigital.com">Questions / feedback</a>
                </DropdownMenuItem>
              </div>
              <DropdownMenuSeparator />
              <div className="p-2">
                <DropdownMenuItem asChild>
                  <Link href="/auth/sign-out">Sign out</Link>
                </DropdownMenuItem>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}

function ChevronDown({ className }: { className?: string }) {
  return (
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
      className={className}
      aria-hidden="true"
    >
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}
