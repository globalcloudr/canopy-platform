"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { resolvePortalSession } from "@/lib/platform";

export function PortalHeader() {
  const searchParams = useSearchParams();
  const session = resolvePortalSession({
    email: searchParams.get("email") ?? undefined,
    workspace: searchParams.get("workspace") ?? undefined,
  });
  const workspaceName = session.activeWorkspace.displayName;
  const email = session.user.email;
  const initials = email
    .split("@")[0]
    .split(/[.\-_]/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");

  const qs = searchParams.toString();
  const suffix = qs ? `?${qs}` : "";

  return (
    <header className="portal-header">
      <Link href={`/app${suffix}`} className="portal-brand-link">
        <div className="brand-mark" aria-hidden="true">C</div>
        <p className="brand-name">Canopy</p>
      </Link>

      <nav className="portal-nav" aria-label="Primary">
        <Link href={`/app${suffix}`}>Home</Link>
        <Link href={`/app${suffix}#products`}>Products</Link>
        <Link href={`/app/account${suffix}`}>Account</Link>
      </nav>

      <div className="portal-actions">
        <div className="workspace-chip">
          <span className="workspace-chip-label">Org</span>
          {workspaceName}
        </div>
        <Link href={`/app/account${suffix}`} className="account-chip" aria-label="Account settings">
          {initials || "??"}
        </Link>
      </div>
    </header>
  );
}
