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
  /** Illustration or icon rendered on the right side (hidden on mobile) */
  illustration?: React.ReactNode;
}

/**
 * DashboardHero — full-width navy-to-blue gradient banner for dashboard pages.
 *
 * Used at the top of each product's dashboard to establish context and provide
 * a primary call-to-action. Pass an `illustration` to fill the right side with
 * a product-relevant icon or decorative element.
 *
 * @example
 * <DashboardHero
 *   eyebrow="Canopy Reach"
 *   headline="Schedule & publish your school's social content"
 *   subheading="Connect your accounts, compose posts, and track engagement."
 *   ctaLabel="New post"
 *   onCtaClick={() => router.push('/posts/new')}
 *   illustration={<ReachIllustration />}
 * />
 */
export function DashboardHero({
  eyebrow,
  headline,
  subheading,
  ctaLabel,
  onCtaClick,
  ctaHref,
  illustration,
  className,
  ...props
}: DashboardHeroProps) {
  const showCta = ctaLabel && (onCtaClick || ctaHref);

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-[28px] px-8 py-9",
        className
      )}
      style={{
        background:
          "linear-gradient(135deg, #0f172a 0%, #1a3260 45%, #2563eb 100%)",
      }}
      {...props}
    >
      {/* Decorative radial blurs */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-10 -top-10 h-56 w-56 rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(255,255,255,0.10) 0%, transparent 70%)",
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-14 right-28 h-36 w-36 rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(255,255,255,0.06) 0%, transparent 70%)",
        }}
      />

      <div className="relative flex items-center justify-between gap-8">
        {/* Left: text + CTA */}
        <div className="min-w-0 flex-1">
          {eyebrow && (
            <p
              className="mb-3 text-[11px] font-semibold uppercase tracking-[0.16em]"
              style={{ color: "rgba(255,255,255,0.55)" }}
            >
              {eyebrow}
            </p>
          )}

          <h2
            className="text-2xl font-bold tracking-[-0.03em] text-white sm:text-[1.75rem]"
            style={{ margin: 0, lineHeight: 1.15 }}
          >
            {headline}
          </h2>

          {subheading && (
            <p
              className="mt-2.5 max-w-lg text-sm leading-relaxed sm:text-[15px]"
              style={{ color: "rgba(255,255,255,0.68)" }}
            >
              {subheading}
            </p>
          )}

          {showCta && (
            <div className="mt-6">
              {ctaHref ? (
                <a
                  href={ctaHref}
                  className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-[#0f172a] transition hover:bg-white/90 active:bg-white/80"
                >
                  {ctaLabel}
                </a>
              ) : (
                <button
                  type="button"
                  onClick={onCtaClick}
                  className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-[#0f172a] transition hover:bg-white/90 active:bg-white/80"
                >
                  {ctaLabel}
                </button>
              )}
            </div>
          )}
        </div>

        {/* Right: illustration slot */}
        {illustration && (
          <div
            className="hidden shrink-0 sm:block"
            style={{ color: "rgba(255,255,255,0.18)" }}
          >
            {illustration}
          </div>
        )}
      </div>
    </div>
  );
}
