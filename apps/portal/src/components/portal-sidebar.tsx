"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { cn } from "@canopy/ui";

function navClass(active: boolean) {
  return cn(
    "group relative flex items-center gap-2.5 rounded-[12px] px-3 py-2.5 text-[0.9rem] font-semibold tracking-[-0.01em] transition-colors",
    active
      ? "bg-white text-navy shadow-[0_8px_18px_rgba(15,31,61,0.06)]"
      : "text-muted hover:bg-white/70 hover:text-ink"
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
      <section className="rounded-[18px] border border-[rgba(15,31,61,0.08)] bg-white/76 px-4 py-4 shadow-[0_1px_2px_rgba(15,31,61,0.04)]">
        <p className="text-[0.68rem] font-bold uppercase tracking-[0.12em] text-muted-light">Context rail</p>
        <h2 className="mt-2 mb-1 text-[1.02rem] font-bold tracking-[-0.02em] text-ink">Portal workspace</h2>
        <p className="m-0 text-[0.82rem] leading-6 text-muted">
          Keep this rail local to the current area. Product switching lives in the app strip above.
        </p>
      </section>

      <nav className="mt-4 flex flex-col gap-1">
        <p className="mb-1.5 px-3 text-[0.68rem] font-bold uppercase tracking-[0.12em] text-muted-light">
          In this area
        </p>
        <Link href={`/app${suffix}`} className={navClass(pathname === "/app")}>
          {pathname === "/app" ? <span className="absolute left-0 top-2.5 bottom-2.5 w-[3px] rounded-full bg-navy" aria-hidden="true" /> : null}
          <IconHome className="shrink-0" />
          Home
        </Link>
        <Link href={`/app/account${suffix}`} className={navClass(pathname.startsWith("/app/account"))}>
          {pathname.startsWith("/app/account") ? <span className="absolute left-0 top-2.5 bottom-2.5 w-[3px] rounded-full bg-navy" aria-hidden="true" /> : null}
          <IconUser className="shrink-0" />
          Account
        </Link>
        {showProvisioning ? (
          <Link href={`/app/provisioning${suffix}`} className={navClass(pathname.startsWith("/app/provisioning"))}>
            {pathname.startsWith("/app/provisioning") ? <span className="absolute left-0 top-2.5 bottom-2.5 w-[3px] rounded-full bg-navy" aria-hidden="true" /> : null}
            <IconShield className="shrink-0" />
            Provisioning
          </Link>
        ) : null}
      </nav>

      <div className="mt-auto px-1 pb-1">
        <div className="rounded-[18px] border border-[rgba(15,31,61,0.08)] bg-[rgba(255,255,255,0.7)] px-4 py-4">
          <p className="mb-1 text-[0.72rem] font-bold uppercase tracking-[0.12em] text-muted-light">Shell direction</p>
          <p className="m-0 text-[0.82rem] leading-6 text-muted">
            This layout is the base contract for Canopy products: workspace up top, apps across, local navigation here.
          </p>
        </div>
      </div>
    </div>
  );
}
