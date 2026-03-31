"use client";

import * as React from "react";
import { Button } from "./button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./dropdown-menu";

function ChevronDown({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

export type CanopyHeaderWorkspaceLink = {
  id: string;
  label: string;
  /** Navigate to this href when selected (portal-style) */
  href?: string;
  /** Call this function when selected (stories-style in-memory switch) */
  onSelect?: () => void;
  /** Highlight as the active workspace */
  active?: boolean;
};

export type CanopyHeaderAccountMenuItem = {
  label: string;
  href: string;
};

export type CanopyHeaderProps = {
  /** Where the brand logo links to */
  brandHref?: string;
  /** Label shown in the workspace switcher button */
  workspaceLabel: string;
  /** List of workspaces the user can switch to */
  workspaceLinks: CanopyHeaderWorkspaceLink[];
  /** Show a "Platform overview" item at the top of the workspace list */
  isPlatformOperator?: boolean;
  /** Href for the platform overview item */
  platformOverviewHref?: string;
  /** Initials displayed in the avatar button */
  userInitials: string;
  /** Full name shown at the top of the account dropdown */
  displayName: string;
  /** Email shown below the display name */
  email?: string | null;
  /** Role badge shown in the account dropdown header */
  roleLabel?: string | null;
  /** Menu items in the account dropdown (above sign out) */
  accountMenuItems?: CanopyHeaderAccountMenuItem[];
  /** Simple href for sign-out (use one of signOutHref or onSignOut) */
  signOutHref?: string;
  /** Callback for sign-out (use when sign-out requires async logic) */
  onSignOut?: () => void;
  /** Label for the sign-out item */
  signOutLabel?: string;
};

export function CanopyHeader({
  brandHref = "/",
  workspaceLabel,
  workspaceLinks,
  isPlatformOperator = false,
  platformOverviewHref = "/",
  userInitials,
  displayName,
  email,
  roleLabel,
  accountMenuItems = [],
  signOutHref,
  onSignOut,
  signOutLabel = "Sign out",
}: CanopyHeaderProps) {
  return (
    <header className="border-b border-[var(--border)] bg-white/95">
      <div className="flex h-14 items-center justify-between gap-3 px-4 sm:px-6">

        {/* Left: brand + workspace switcher */}
        <div className="flex min-w-0 items-center gap-3">
          <a href={brandHref} className="flex shrink-0 items-center gap-2 no-underline text-inherit outline-none">
            <div className="grid h-8 w-8 place-items-center rounded-[7px] bg-[#0f1f3d] text-[0.95rem] font-extrabold tracking-[-0.02em] text-white" aria-hidden="true">
              C
            </div>
            <span className="text-[0.95rem] font-bold tracking-[-0.01em] text-[var(--foreground)]">Canopy</span>
          </a>

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
                {isPlatformOperator && (
                  <DropdownMenuItem onSelect={() => { window.location.assign(platformOverviewHref); }}>
                    Platform overview
                  </DropdownMenuItem>
                )}
                {workspaceLinks.map((ws) =>
                  ws.onSelect ? (
                    <DropdownMenuItem
                      key={ws.id}
                      onSelect={ws.onSelect}
                      className={ws.active ? "font-semibold" : ""}
                    >
                      {ws.label}
                      {ws.active && <span className="ml-auto text-[11px] text-[var(--text-muted)]">active</span>}
                    </DropdownMenuItem>
                  ) : (
                    <DropdownMenuItem key={ws.id} asChild>
                      <a href={ws.href ?? "#"}>{ws.label}</a>
                    </DropdownMenuItem>
                  )
                )}
                {workspaceLinks.length === 0 && !isPlatformOperator && (
                  <DropdownMenuItem disabled>No workspaces found</DropdownMenuItem>
                )}
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Right: avatar */}
        <div className="flex shrink-0 items-center">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="secondary"
                size="icon"
                className="h-10 w-10 rounded-full border-[var(--border)] bg-[var(--surface-muted)] text-sm font-semibold text-[var(--foreground)] shadow-none hover:bg-[var(--surface)]"
                aria-label="Open account menu"
              >
                {userInitials}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-72 p-0 bg-white">
              <div className="flex items-start justify-between gap-3 border-b border-[var(--border)] px-4 py-3">
                <div className="min-w-0">
                  <p className="m-0 truncate text-base font-semibold text-[var(--foreground)]">{displayName}</p>
                  {email && <p className="m-0 truncate text-[0.8rem] text-[var(--text-muted)]">{email}</p>}
                </div>
                {roleLabel && (
                  <span className="shrink-0 rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5 text-xs font-medium text-slate-600">
                    {roleLabel}
                  </span>
                )}
              </div>
              <div className="p-2">
                {accountMenuItems.map((item) => (
                  <DropdownMenuItem key={item.href} asChild>
                    <a href={item.href}>{item.label}</a>
                  </DropdownMenuItem>
                ))}
              </div>
              <DropdownMenuSeparator />
              <div className="p-2">
                {onSignOut ? (
                  <DropdownMenuItem onSelect={onSignOut}>{signOutLabel}</DropdownMenuItem>
                ) : (
                  <DropdownMenuItem asChild>
                    <a href={signOutHref ?? "/auth/sign-out"}>{signOutLabel}</a>
                  </DropdownMenuItem>
                )}
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

      </div>
    </header>
  );
}
