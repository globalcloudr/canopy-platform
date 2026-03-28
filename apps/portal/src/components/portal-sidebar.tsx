"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { cn } from "@canopy/ui";

function navClass(active: boolean) {
  return cn(
    "flex items-center gap-2.5 px-2 py-2.5 rounded-md text-[0.9rem] font-semibold tracking-[-0.01em] transition-colors",
    active
      ? "text-navy bg-[rgba(15,31,61,0.06)]"
      : "text-muted hover:text-ink hover:bg-[rgba(15,31,61,0.04)]"
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

  return (
    <div className="flex h-full flex-col p-3">
      <nav className="flex flex-col gap-0.5 mt-1">
        <p className="text-[0.68rem] font-bold uppercase tracking-[0.12em] text-muted-light px-2 mb-1.5">
          Portal
        </p>
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
      </nav>
    </div>
  );
}
