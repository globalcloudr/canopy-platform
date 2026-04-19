import type { ReactNode } from "react";

type PortalPageHeaderProps = {
  eyebrow: string;
  title: string;
  subtitle: string;
  meta?: ReactNode;
  actions?: ReactNode;
};

/**
 * Editorial page header shared across Portal pages. Matches the PhotoVault
 * editorial-header pattern: eyebrow → title → muted subtitle → rule. The rule
 * underline provides section boundary; no card chrome or gradient background.
 */
export function PortalPageHeader({ eyebrow, title, subtitle, meta, actions }: PortalPageHeaderProps) {
  return (
    <header className="flex flex-col gap-4 border-b border-[var(--rule)] pb-6 sm:flex-row sm:items-end sm:justify-between">
      <div className="min-w-0">
        <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--faint)]">
          {eyebrow}
        </p>
        <h1 className="m-0 text-[32px] font-semibold leading-[1.08] tracking-[-0.015em] text-[var(--foreground)] sm:text-[36px]">
          {title}
        </h1>
        <p className="mt-2 max-w-[56ch] text-sm leading-relaxed text-[var(--text-muted)]">
          {subtitle}
        </p>
        {meta ? <div className="mt-5 flex flex-wrap items-center gap-2">{meta}</div> : null}
      </div>
      {actions ? <div className="flex flex-wrap gap-3 shrink-0">{actions}</div> : null}
    </header>
  );
}
