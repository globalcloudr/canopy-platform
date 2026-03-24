"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { resolvePortalSession } from "@/lib/platform";
import { getEnabledLauncherProducts } from "@/lib/products";

export function PortalHeader() {
  const searchParams = useSearchParams();
  const session = resolvePortalSession({
    email: searchParams.get("email") ?? undefined,
    workspace: searchParams.get("workspace") ?? undefined,
  });
  const { activeWorkspace, user, memberships, entitlements } = session;
  const activeMembership = memberships.find((m) => m.workspaceId === activeWorkspace.id);
  const enabledProducts = getEnabledLauncherProducts(entitlements).filter((p) => p.kind === "product");

  const initials = user.email
    .split("@")[0]
    .split(/[.\-_]/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");

  const qs = searchParams.toString();
  const suffix = qs ? `?${qs}` : "";

  const [switcherOpen, setSwitcherOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const switcherRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (switcherRef.current && !switcherRef.current.contains(e.target as Node)) setSwitcherOpen(false);
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div className="border-b border-[rgba(15,31,61,0.1)] bg-white/95 backdrop-blur-sm">
      <div className="flex h-14 items-center justify-between gap-3 px-4 sm:px-6">

        {/* Brand */}
        <Link href={`/app${suffix}`} className="flex items-center gap-2.5 no-underline text-inherit shrink-0">
          <div
            className="grid place-items-center w-8 h-8 rounded-[7px] bg-navy text-white text-[0.95rem] font-extrabold tracking-[-0.02em] shrink-0"
            aria-hidden="true"
          >
            C
          </div>
          <p className="m-0 text-[0.95rem] font-bold text-ink tracking-[-0.01em]">Canopy</p>
        </Link>

        {/* Right side */}
        <div className="flex items-center gap-3 shrink-0">

          {/* Product switcher chip */}
          <div className="relative hidden sm:block" ref={switcherRef}>
            <button
              onClick={() => setSwitcherOpen((o) => !o)}
              className="flex items-center gap-1.5 px-3 py-[5px] border border-[rgba(15,31,61,0.18)] rounded-md bg-white text-[0.8rem] font-medium text-ink-2 whitespace-nowrap transition-colors hover:bg-[rgba(15,31,61,0.03)] cursor-pointer"
              aria-expanded={switcherOpen}
            >
              <span className="text-[0.7rem] font-bold uppercase tracking-[0.06em] text-muted-light mr-0.5">Org</span>
              {activeWorkspace.displayName}
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="ml-0.5 text-muted-light">
                <polyline points="6 9 12 15 18 9"/>
              </svg>
            </button>

            {switcherOpen && (
              <div className="absolute top-[calc(100%+8px)] right-0 w-64 bg-white border border-[rgba(15,31,61,0.1)] rounded-xl shadow-[0_8px_24px_rgba(15,31,61,0.12)] z-[200] overflow-hidden">
                <div className="px-3 pt-3 pb-1.5">
                  <p className="text-[0.68rem] font-bold uppercase tracking-[0.12em] text-muted-light">Your apps</p>
                </div>
                <div className="p-1.5">
                  {enabledProducts.map((product) => {
                    const isExternal = !!product.externalUrl;
                    const href = product.externalUrl ?? `/app/products/${product.productKey.replace(/_/g, "-")}`;
                    return (
                      <a
                        key={product.productKey}
                        href={href}
                        target={isExternal ? "_blank" : undefined}
                        rel={isExternal ? "noopener noreferrer" : undefined}
                        onClick={() => setSwitcherOpen(false)}
                        className="flex items-center gap-2.5 px-2.5 py-2 rounded-md no-underline transition-colors hover:bg-[rgba(15,31,61,0.04)]"
                      >
                        <div
                          className="grid place-items-center w-6 h-6 rounded-[5px] text-white text-[0.65rem] font-extrabold shrink-0"
                          style={{ background: product.iconColor }}
                        >
                          {product.displayName[0]}
                        </div>
                        <span className="text-[0.875rem] font-medium text-ink flex-1">{product.displayName}</span>
                        {isExternal && (
                          <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-muted-light shrink-0">
                            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
                          </svg>
                        )}
                      </a>
                    );
                  })}
                </div>
                <div className="border-t border-[rgba(15,31,61,0.08)] p-1.5">
                  <Link
                    href={`/app${suffix}`}
                    className="flex items-center gap-2.5 px-2.5 py-2 rounded-md text-[0.875rem] font-medium text-muted no-underline hover:bg-[rgba(15,31,61,0.04)] hover:text-ink transition-colors"
                    onClick={() => setSwitcherOpen(false)}
                  >
                    Back to portal home
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Avatar + dropdown */}
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setMenuOpen((o) => !o)}
              className="grid place-items-center w-[34px] h-[34px] rounded-full bg-navy text-white text-[0.78rem] font-bold shrink-0 transition-colors hover:bg-navy-mid cursor-pointer"
              aria-label="Open account menu"
              aria-expanded={menuOpen}
            >
              {initials || "??"}
            </button>

            {menuOpen && (
              <div className="absolute top-[calc(100%+8px)] right-0 w-72 bg-white border border-[rgba(15,31,61,0.1)] rounded-xl shadow-[0_8px_24px_rgba(15,31,61,0.12)] z-[200] overflow-hidden">
                <div className="px-4 py-3 border-b border-[rgba(15,31,61,0.08)]">
                  <p className="text-[0.9rem] font-semibold text-ink m-0">{user.displayName}</p>
                  <p className="text-[0.8rem] text-muted m-0">{user.email}</p>
                  <span className="inline-block mt-1.5 px-2 py-0.5 rounded-full border border-[rgba(15,31,61,0.15)] text-[0.7rem] font-semibold uppercase tracking-[0.06em] text-muted">
                    {activeMembership?.role ?? "staff"}
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
                    href="mailto:support@canopy.school"
                    className="flex items-center gap-2.5 px-3 py-2 rounded-md text-[0.875rem] text-ink-2 no-underline hover:bg-[rgba(15,31,61,0.04)] transition-colors"
                  >
                    <IconHelp />
                    Help &amp; support
                  </a>
                  <a
                    href="mailto:feedback@canopy.school"
                    className="flex items-center gap-2.5 px-3 py-2 rounded-md text-[0.875rem] text-ink-2 no-underline hover:bg-[rgba(15,31,61,0.04)] transition-colors"
                  >
                    <IconFeedback />
                    Send feedback
                  </a>
                </div>
                <div className="p-1.5 border-t border-[rgba(15,31,61,0.08)]">
                  <Link
                    href="/sign-in"
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
