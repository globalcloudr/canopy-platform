import * as React from "react";
import { cn } from "../../lib/cn";

export interface DashboardHeroProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Small uppercase label above the headline */
  eyebrow?: string;
  /** Main headline text */
  headline: string;
  /** Optional supporting text below the headline */
  subheading?: string;
  /** CTA button label — requires onCtaClick or ctaHref */
  ctaLabel?: string;
  /** CTA click handler (use this or ctaHref) */
  onCtaClick?: () => void;
  /** CTA link href (use this or onCtaClick) */
  ctaHref?: string;
  /**
   * @deprecated The decorative right-side illustration from the old gradient
   * hero is no longer rendered. Prop is kept for API compatibility. The new
   * editorial treatment relies on typography and whitespace, not illustration.
   */
  illustration?: React.ReactNode;
}

/**
 * DashboardHero — editorial header for dashboard pages.
 *
 * Renders a quiet editorial block: eyebrow, headline, optional subheading,
 * optional CTA button anchored to the right. The accent color comes from the
 * active `.product-*` class on the page root (cobalt for Canopy, rust for
 * PhotoVault, etc.), via `var(--accent)`.
 *
 * Replaces the prior navy-to-blue gradient banner — same prop API, different
 * visual register: editorial rather than enterprise SaaS.
 *
 * @example
 * <DashboardHero
 *   eyebrow="Canopy Reach"
 *   headline="Schedule & publish your school's social content"
 *   subheading="Connect your accounts, compose posts, and track engagement."
 *   ctaLabel="New post"
 *   onCtaClick={() => router.push('/posts/new')}
 * />
 */
export function DashboardHero({
  eyebrow,
  headline,
  subheading,
  ctaLabel,
  onCtaClick,
  ctaHref,
  className,
  ...props
}: DashboardHeroProps) {
  const showCta = ctaLabel && (onCtaClick || ctaHref);

  return (
    <header
      className={cn(
        "flex flex-col gap-4 border-b border-[var(--rule)] pb-6 sm:flex-row sm:items-end sm:justify-between",
        className
      )}
      {...props}
    >
      <div className="min-w-0 flex-1">
        {eyebrow && (
          <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--faint)]">
            {eyebrow}
          </p>
        )}

        <h2 className="m-0 text-[32px] font-semibold leading-[1.08] tracking-[-0.015em] text-[var(--foreground)] sm:text-[36px]">
          {headline}
        </h2>

        {subheading && (
          <p className="mt-2 max-w-[56ch] text-sm leading-relaxed text-[var(--text-muted)]">
            {subheading}
          </p>
        )}
      </div>

      {showCta && (
        <div className="shrink-0">
          {ctaHref ? (
            <a
              href={ctaHref}
              className="inline-flex items-center gap-2 rounded-[var(--radius-tight)] bg-[var(--accent)] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[var(--accent-ink)]"
            >
              {ctaLabel}
            </a>
          ) : (
            <button
              type="button"
              onClick={onCtaClick}
              className="inline-flex items-center gap-2 rounded-[var(--radius-tight)] bg-[var(--accent)] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[var(--accent-ink)]"
            >
              {ctaLabel}
            </button>
          )}
        </div>
      )}
    </header>
  );
}
