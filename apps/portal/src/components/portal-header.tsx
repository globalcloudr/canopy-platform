"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { resolvePortalSession } from "@/lib/platform";
import { cn } from "@/lib/cn";

const navLink = cn(
  "text-muted no-underline text-sm font-medium px-3 py-1.5 rounded-md",
  "transition-colors hover:text-ink hover:bg-[rgba(15,31,61,0.05)]"
);

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
    <header className="sticky top-0 z-[100] flex justify-between items-center gap-4 px-6 max-[840px]:px-4 h-14 bg-surface border-b border-[rgba(15,31,61,0.1)] shadow-[0_1px_3px_rgba(15,31,61,0.08),0_1px_2px_rgba(15,31,61,0.04)]">
      <Link href={`/app${suffix}`} className="flex items-center gap-2.5 no-underline text-inherit shrink-0">
        <div
          className="grid place-items-center w-8 h-8 rounded-[7px] bg-navy text-white text-[0.95rem] font-extrabold tracking-[-0.02em] shrink-0"
          aria-hidden="true"
        >
          C
        </div>
        <p className="m-0 text-[0.95rem] font-bold text-ink tracking-[-0.01em]">Canopy</p>
      </Link>

      <nav className="flex items-center gap-0.5 max-[840px]:hidden" aria-label="Primary">
        <Link href={`/app${suffix}`} className={navLink}>Home</Link>
        <Link href={`/app${suffix}#products`} className={navLink}>Products</Link>
        <Link href={`/app/account${suffix}`} className={navLink}>Account</Link>
      </nav>

      <div className="flex items-center gap-3 shrink-0">
        <div className="flex items-center gap-1.5 px-3 py-[5px] border border-[rgba(15,31,61,0.18)] rounded-md bg-surface text-[0.8rem] font-medium text-ink-2 whitespace-nowrap max-[840px]:hidden">
          <span className="text-[0.7rem] font-bold uppercase tracking-[0.06em] text-muted-light mr-0.5">Org</span>
          {workspaceName}
        </div>
        <Link
          href={`/app/account${suffix}`}
          className="grid place-items-center w-[34px] h-[34px] rounded-full bg-navy text-white text-[0.78rem] font-bold no-underline shrink-0 transition-colors hover:bg-navy-mid"
          aria-label="Account settings"
        >
          {initials || "??"}
        </Link>
      </div>
    </header>
  );
}
