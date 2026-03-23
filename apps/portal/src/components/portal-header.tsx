 "use client";

import { useSearchParams } from "next/navigation";
import { getWorkspaceName, mockWorkspaces } from "@/lib/mock-session";

export function PortalHeader() {
  const searchParams = useSearchParams();
  const workspace = searchParams.get("workspace") ?? mockWorkspaces[0].slug;
  const workspaceName = getWorkspaceName(workspace);
  const email = searchParams.get("email") ?? "sarah.zylstra@school.edu";
  const initials = email
    .split("@")[0]
    .split(/[.\-_]/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");

  return (
    <header className="portal-header">
      <div className="portal-brand">
        <div className="brand-mark" aria-hidden="true">
          C
        </div>
        <div>
          <p className="brand-name">Canopy</p>
          <p className="brand-subtitle">School growth platform</p>
        </div>
      </div>

      <nav className="portal-nav" aria-label="Primary">
        <a href="#overview">Home</a>
        <a href="#products">Products</a>
        <a href="#account">Account</a>
      </nav>

      <div className="portal-actions">
        <div className="workspace-summary">
          <span className="workspace-label">Organization</span>
          <p className="workspace-pill">{workspaceName}</p>
        </div>
        <button className="account-chip" type="button">
          {initials || "SZ"}
        </button>
      </div>
    </header>
  );
}
