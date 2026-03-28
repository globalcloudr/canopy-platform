"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { cn } from "@canopy/ui";

function navClass(active: boolean) {
  return cn(
    "flex items-center gap-2.5 px-1 py-2.5 font-outfit text-base font-medium tracking-[-0.015em] transition-colors",
    active ? "text-slate-900" : "text-slate-700 hover:text-slate-900"
  );
}

function IconHome({ className }: { className?: string }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
      <polyline points="9 22 9 12 15 12 15 22"/>
    </svg>
  );
}

function IconUser({ className }: { className?: string }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/>
      <circle cx="12" cy="7" r="4"/>
    </svg>
  );
}

function IconShield({ className }: { className?: string }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
    </svg>
  );
}

export function PortalSidebar({ showProvisioning = false }: { showProvisioning?: boolean }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const qs = searchParams.toString();
  const suffix = qs ? `?${qs}` : "";
  const workspace = searchParams.get("workspace");
  const photoVaultHref = workspace ? `/auth/launch/photovault?workspace=${encodeURIComponent(workspace)}` : "/auth/launch/photovault";

  return (
    <div className="flex h-full flex-col">
      <div className="px-1">
        <p className="font-outfit text-lg font-semibold tracking-[-0.03em] text-[var(--foreground, var(--ink))]">Canopy Platform</p>
        <p className="mt-1 text-sm text-muted">Workspace launch, account context, and product access</p>
        <p className="mt-2 text-sm text-muted">Portal control plane</p>
      </div>

      <nav className="mt-3 px-1">
        <p className="mb-1.5 px-1 text-[11px] font-bold uppercase tracking-[0.24em] text-slate-400">Portal</p>
        <div className="space-y-0.5">
          <Link href={`/app${suffix}`} className={navClass(pathname === "/app")}>
            <IconHome className="shrink-0" />
            Home
          </Link>
          <Link href={`/app/account${suffix}`} className={navClass(pathname.startsWith("/app/account"))}>
            <IconUser className="shrink-0" />
            Account
          </Link>
          {showProvisioning ? (
            <Link href={`/app/provisioning${suffix}`} className={navClass(pathname.startsWith("/app/provisioning"))}>
              <IconShield className="shrink-0" />
              Provisioning
            </Link>
          ) : null}
        </div>
      </nav>

      <section className="mt-3 px-1">
        <p className="mb-1.5 px-1 text-[11px] font-bold uppercase tracking-[0.24em] text-slate-400">Shortcuts</p>
        <div className="space-y-0.5">
          <Link href={`${workspace ? `/app?workspace=${encodeURIComponent(workspace)}#products` : "/app#products"}`} className={navClass(false)}>
            <IconHome className="shrink-0" />
            Product Launcher
          </Link>
          <Link href={photoVaultHref} className={navClass(false)}>
            <IconShield className="shrink-0" />
            Open PhotoVault
          </Link>
        </div>
      </section>

      <section className="mt-auto px-1 pb-1 pt-4">
        <p className="mb-1 px-1 text-[11px] font-bold uppercase tracking-[0.24em] text-slate-400">Context</p>
        <div className="mt-2 space-y-1.5 pl-1">
          <p className="m-0 text-sm text-muted">{workspace ? `Workspace: ${workspace}` : "Platform overview active"}</p>
          <p className="m-0 text-sm text-muted">Use the header switcher to change workspace context.</p>
        </div>
      </section>
    </div>
  );
}
