import { Button } from "@canopy/ui";
import { notFound } from "next/navigation";
import { getProductDefinition } from "@/lib/products";
import type { ProductKey } from "@/lib/platform";

type ProductPageProps = {
  params: Promise<{ slug: string }>;
};

// ── Stories-specific detail page ─────────────────────────────────────────────

function StoriesDetailPage({ iconColor, displayName }: { iconColor: string; displayName: string }) {
  const steps = [
    {
      number: "1",
      title: "Capture the story",
      body: "Staff submit a story tip using a simple form — a student achievement, a program milestone, a behind-the-scenes moment. No writing required.",
    },
    {
      number: "2",
      title: "AI does the heavy lifting",
      body: "Canopy Stories turns the submission into a polished blog post, social caption, and optional short-form video script — all matched to your school's voice.",
    },
    {
      number: "3",
      title: "Review and publish",
      body: "Your team reviews the draft in seconds, makes any tweaks, and publishes straight to your website, newsletter, or social channels.",
    },
  ];

  const highlights = [
    { icon: "✦", label: "One submission, multiple formats — blog, social, video" },
    { icon: "✦", label: "Consistent school voice and brand across all content" },
    { icon: "✦", label: "Reduce content production from hours to minutes" },
    { icon: "✦", label: "Supports staff and student story submissions" },
    { icon: "✦", label: "Built for K–12 schools and independent schools" },
  ];

  return (
    <div className="space-y-6 pb-10">

      {/* ── Page header ──────────────────────────────── */}
      <header className="rounded-2xl border border-[rgba(15,31,61,0.1)] bg-white p-6 shadow-[0_1px_3px_rgba(15,31,61,0.08)]">
        <div className="flex items-start gap-5">
          <div
            className="grid place-items-center w-14 h-14 rounded-[12px] text-white text-[1.4rem] font-extrabold tracking-[-0.02em] shrink-0"
            style={{ background: iconColor }}
          >
            S
          </div>
          <div>
            <p className="eyebrow">Content Production</p>
            <h2 className="mb-1">{displayName}</h2>
            <p className="text-muted text-[0.9rem] m-0 max-w-[52ch]">
              Turn student and staff successes into blog posts, social content, and video — automatically.
            </p>
          </div>
        </div>
      </header>

      {/* ── How it works ─────────────────────────────── */}
      <div className="rounded-2xl border border-[rgba(15,31,61,0.1)] bg-white shadow-[0_1px_3px_rgba(15,31,61,0.08)] overflow-hidden">
        <div className="h-1.5 w-full" style={{ background: iconColor }} aria-hidden="true" />
        <div className="px-8 pt-8 pb-10">
          <p className="eyebrow mb-2">How it works</p>
          <h3 className="mb-8 text-[1.15rem] font-semibold tracking-[-0.01em]">
            From story tip to published content in minutes
          </h3>
          <div className="grid gap-6 sm:grid-cols-3">
            {steps.map((step) => (
              <div key={step.number} className="flex flex-col gap-3">
                <div
                  className="grid place-items-center h-9 w-9 rounded-full text-white text-[0.85rem] font-bold shrink-0"
                  style={{ background: iconColor }}
                >
                  {step.number}
                </div>
                <p className="m-0 text-[0.9rem] font-semibold tracking-[-0.01em] text-[var(--foreground)]">{step.title}</p>
                <p className="m-0 text-[0.875rem] leading-relaxed text-[var(--text-muted)]">{step.body}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Key highlights + CTA ──────────────────────── */}
      <div className="grid gap-6 md:grid-cols-[1fr_auto]">

        {/* Highlights */}
        <div className="rounded-2xl border border-[rgba(15,31,61,0.1)] bg-white p-6 shadow-[0_1px_3px_rgba(15,31,61,0.08)]">
          <p className="eyebrow mb-4">What you get</p>
          <ul className="m-0 space-y-3 p-0 list-none">
            {highlights.map((h) => (
              <li key={h.label} className="flex items-start gap-3 text-[0.875rem] text-[var(--foreground)]">
                <span className="mt-0.5 shrink-0 text-[0.7rem]" style={{ color: iconColor }} aria-hidden="true">{h.icon}</span>
                {h.label}
              </li>
            ))}
          </ul>
        </div>

        {/* CTA card */}
        <div className="flex flex-col justify-between gap-6 rounded-2xl border border-[rgba(15,31,61,0.1)] bg-white p-6 shadow-[0_1px_3px_rgba(15,31,61,0.08)] md:min-w-[280px]">
          <div>
            <p className="eyebrow mb-2">Ready to get started?</p>
            <p className="m-0 text-[0.875rem] leading-relaxed text-[var(--text-muted)]">
              Contact us to enable Canopy Stories for your school or to ask about pricing and onboarding.
            </p>
          </div>
          <div className="flex flex-col gap-2.5">
            <Button asChild variant="primary">
              <a href={`mailto:info@akkedisdigital.com?subject=${encodeURIComponent("Interest in Canopy Stories")}&body=${encodeURIComponent("Hi,\n\nI'd like to learn more about enabling Canopy Stories for our school.\n\nThanks")}`}>
                Request access
              </a>
            </Button>
            <Button asChild variant="secondary">
              <a href="/app">Back to dashboard</a>
            </Button>
          </div>
        </div>

      </div>
    </div>
  );
}

// ── PhotoVault-specific detail page ──────────────────────────────────────────

function PhotoVaultDetailPage({ iconColor, displayName }: { iconColor: string; displayName: string }) {
  const steps = [
    {
      number: "1",
      title: "Photos are organised for you",
      body: "School photos, event shots, and brand assets are uploaded and automatically categorised — no manual filing required.",
    },
    {
      number: "2",
      title: "Staff find what they need instantly",
      body: "Teachers and comms staff search by event, date, or subject and download approved, high-res images in seconds.",
    },
    {
      number: "3",
      title: "Always brand-safe, always permitted",
      body: "Every image in PhotoVault has been reviewed and approved for school use, so staff never accidentally share the wrong photo.",
    },
  ];

  const highlights = [
    { icon: "✦", label: "Centralised library for all school and event photography" },
    { icon: "✦", label: "Brand guidelines and approved assets in one place" },
    { icon: "✦", label: "Role-based access — staff see what they need" },
    { icon: "✦", label: "High-res downloads ready for print and digital use" },
    { icon: "✦", label: "Safe, permission-verified media for K–12 schools" },
  ];

  return (
    <div className="space-y-6 pb-10">

      {/* ── Page header ──────────────────────────────── */}
      <header className="rounded-2xl border border-[rgba(15,31,61,0.1)] bg-white p-6 shadow-[0_1px_3px_rgba(15,31,61,0.08)]">
        <div className="flex items-start gap-5">
          <div
            className="grid place-items-center w-14 h-14 rounded-[12px] text-white text-[1.4rem] font-extrabold tracking-[-0.02em] shrink-0"
            style={{ background: iconColor }}
          >
            P
          </div>
          <div>
            <p className="eyebrow">Media and Brand</p>
            <h2 className="mb-1">{displayName}</h2>
            <p className="text-muted text-[0.9rem] m-0 max-w-[52ch]">
              View school photos, brand assets, and approved media — all in one secure library.
            </p>
          </div>
        </div>
      </header>

      {/* ── How it works ─────────────────────────────── */}
      <div className="rounded-2xl border border-[rgba(15,31,61,0.1)] bg-white shadow-[0_1px_3px_rgba(15,31,61,0.08)] overflow-hidden">
        <div className="h-1.5 w-full" style={{ background: iconColor }} aria-hidden="true" />
        <div className="px-8 pt-8 pb-10">
          <p className="eyebrow mb-2">How it works</p>
          <h3 className="mb-8 text-[1.15rem] font-semibold tracking-[-0.01em]">
            The right photo, right when you need it
          </h3>
          <div className="grid gap-6 sm:grid-cols-3">
            {steps.map((step) => (
              <div key={step.number} className="flex flex-col gap-3">
                <div
                  className="grid place-items-center h-9 w-9 rounded-full text-white text-[0.85rem] font-bold shrink-0"
                  style={{ background: iconColor }}
                >
                  {step.number}
                </div>
                <p className="m-0 text-[0.9rem] font-semibold tracking-[-0.01em] text-[var(--foreground)]">{step.title}</p>
                <p className="m-0 text-[0.875rem] leading-relaxed text-[var(--text-muted)]">{step.body}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Key highlights + CTA ──────────────────────── */}
      <div className="grid gap-6 md:grid-cols-[1fr_auto]">

        {/* Highlights */}
        <div className="rounded-2xl border border-[rgba(15,31,61,0.1)] bg-white p-6 shadow-[0_1px_3px_rgba(15,31,61,0.08)]">
          <p className="eyebrow mb-4">What you get</p>
          <ul className="m-0 space-y-3 p-0 list-none">
            {highlights.map((h) => (
              <li key={h.label} className="flex items-start gap-3 text-[0.875rem] text-[var(--foreground)]">
                <span className="mt-0.5 shrink-0 text-[0.7rem]" style={{ color: iconColor }} aria-hidden="true">{h.icon}</span>
                {h.label}
              </li>
            ))}
          </ul>
        </div>

        {/* CTA card */}
        <div className="flex flex-col justify-between gap-6 rounded-2xl border border-[rgba(15,31,61,0.1)] bg-white p-6 shadow-[0_1px_3px_rgba(15,31,61,0.08)] md:min-w-[280px]">
          <div>
            <p className="eyebrow mb-2">Ready to get started?</p>
            <p className="m-0 text-[0.875rem] leading-relaxed text-[var(--text-muted)]">
              Contact us to enable PhotoVault for your school or to ask about pricing and onboarding.
            </p>
          </div>
          <div className="flex flex-col gap-2.5">
            <Button asChild variant="primary">
              <a href={`mailto:info@akkedisdigital.com?subject=${encodeURIComponent("Interest in PhotoVault by Canopy")}&body=${encodeURIComponent("Hi,\n\nI'd like to learn more about enabling PhotoVault for our school.\n\nThanks")}`}>
                Request access
              </a>
            </Button>
            <Button asChild variant="secondary">
              <a href="/app">Back to dashboard</a>
            </Button>
          </div>
        </div>

      </div>
    </div>
  );
}

// ── Canopy Reach detail page ──────────────────────────────────────────────────

function ReachDetailPage({ iconColor, displayName }: { iconColor: string; displayName: string }) {
  const steps = [
    {
      number: "1",
      title: "Connect your accounts",
      body: "Link your school's Facebook, Instagram, LinkedIn, and X accounts once — Canopy Reach handles the authentication securely.",
    },
    {
      number: "2",
      title: "Write and schedule posts",
      body: "Compose a post, pick your platforms, and choose a send time. Canopy Reach publishes to all selected accounts at the right moment.",
    },
    {
      number: "3",
      title: "Track what's working",
      body: "See impressions, likes, comments, and shares for every published post — all in one place, no jumping between apps.",
    },
  ];

  const highlights = [
    { icon: "✦", label: "Publish to Facebook, Instagram, LinkedIn, and X from one place" },
    { icon: "✦", label: "Schedule posts in advance with a visual calendar" },
    { icon: "✦", label: "Per-platform character limits and media previews" },
    { icon: "✦", label: "Engagement analytics for every published post" },
    { icon: "✦", label: "Brand voice guidelines built in for your school" },
  ];

  return (
    <div className="space-y-6 pb-10">

      {/* ── Page header ──────────────────────────────── */}
      <header className="rounded-2xl border border-[rgba(15,31,61,0.1)] bg-white p-6 shadow-[0_1px_3px_rgba(15,31,61,0.08)]">
        <div className="flex items-start gap-5">
          <div
            className="grid place-items-center w-14 h-14 rounded-[12px] text-white text-[1.4rem] font-extrabold tracking-[-0.02em] shrink-0"
            style={{ background: iconColor }}
          >
            R
          </div>
          <div>
            <p className="eyebrow">Outreach and Storytelling</p>
            <h2 className="mb-1">{displayName}</h2>
            <p className="text-muted text-[0.9rem] m-0 max-w-[52ch]">
              Write, schedule, and publish social media posts to your school's accounts — all from one place.
            </p>
          </div>
        </div>
      </header>

      {/* ── How it works ─────────────────────────────── */}
      <div className="rounded-2xl border border-[rgba(15,31,61,0.1)] bg-white shadow-[0_1px_3px_rgba(15,31,61,0.08)] overflow-hidden">
        <div className="h-1.5 w-full" style={{ background: iconColor }} aria-hidden="true" />
        <div className="px-8 pt-8 pb-10">
          <p className="eyebrow mb-2">How it works</p>
          <h3 className="mb-8 text-[1.15rem] font-semibold tracking-[-0.01em]">
            From draft to published in a few clicks
          </h3>
          <div className="grid gap-6 sm:grid-cols-3">
            {steps.map((step) => (
              <div key={step.number} className="flex flex-col gap-3">
                <div
                  className="grid place-items-center h-9 w-9 rounded-full text-white text-[0.85rem] font-bold shrink-0"
                  style={{ background: iconColor }}
                >
                  {step.number}
                </div>
                <p className="m-0 text-[0.9rem] font-semibold tracking-[-0.01em] text-[var(--foreground)]">{step.title}</p>
                <p className="m-0 text-[0.875rem] leading-relaxed text-[var(--text-muted)]">{step.body}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Key highlights + CTA ──────────────────────── */}
      <div className="grid gap-6 md:grid-cols-[1fr_auto]">

        {/* Highlights */}
        <div className="rounded-2xl border border-[rgba(15,31,61,0.1)] bg-white p-6 shadow-[0_1px_3px_rgba(15,31,61,0.08)]">
          <p className="eyebrow mb-4">What you get</p>
          <ul className="m-0 space-y-3 p-0 list-none">
            {highlights.map((h) => (
              <li key={h.label} className="flex items-start gap-3 text-[0.875rem] text-[var(--foreground)]">
                <span className="mt-0.5 shrink-0 text-[0.7rem]" style={{ color: iconColor }} aria-hidden="true">{h.icon}</span>
                {h.label}
              </li>
            ))}
          </ul>
        </div>

        {/* CTA card */}
        <div className="flex flex-col justify-between gap-6 rounded-2xl border border-[rgba(15,31,61,0.1)] bg-white p-6 shadow-[0_1px_3px_rgba(15,31,61,0.08)] md:min-w-[280px]">
          <div>
            <p className="eyebrow mb-2">Ready to get started?</p>
            <p className="m-0 text-[0.875rem] leading-relaxed text-[var(--text-muted)]">
              Contact us to enable Canopy Reach for your school or to ask about pricing and onboarding.
            </p>
          </div>
          <div className="flex flex-col gap-2.5">
            <Button asChild variant="primary">
              <a href={`mailto:info@akkedisdigital.com?subject=${encodeURIComponent("Interest in Canopy Reach")}&body=${encodeURIComponent("Hi,\n\nI'd like to learn more about enabling Canopy Reach for our school.\n\nThanks")}`}>
                Request access
              </a>
            </Button>
            <Button asChild variant="secondary">
              <a href="/app">Back to dashboard</a>
            </Button>
          </div>
        </div>

      </div>
    </div>
  );
}

// ── Generic coming-soon page ──────────────────────────────────────────────────

function ComingSoonPage({
  iconColor,
  displayName,
  shortDescription,
  category,
}: {
  iconColor: string;
  displayName: string;
  shortDescription: string;
  category: string;
}) {
  return (
    <div className="space-y-6 pb-10">

      {/* ── Page header ──────────────────────────────── */}
      <header className="rounded-2xl border border-[rgba(15,31,61,0.1)] bg-white p-6 shadow-[0_1px_3px_rgba(15,31,61,0.08)]">
        <div className="flex items-start gap-5">
          <div
            className="grid place-items-center w-14 h-14 rounded-[12px] text-white text-[1.4rem] font-extrabold tracking-[-0.02em] shrink-0"
            style={{ background: iconColor }}
          >
            {displayName[0]}
          </div>
          <div>
            <p className="eyebrow">{category}</p>
            <h2 className="mb-1">{displayName}</h2>
            <p className="text-muted text-[0.9rem] m-0 max-w-[52ch]">{shortDescription}</p>
          </div>
        </div>
      </header>

      {/* ── Coming soon ───────────────────────────────── */}
      <div className="rounded-2xl border border-[rgba(15,31,61,0.1)] bg-white shadow-[0_1px_3px_rgba(15,31,61,0.08)] overflow-hidden">
        <div
          className="h-1.5 w-full"
          style={{ background: iconColor }}
          aria-hidden="true"
        />
        <div className="px-8 py-12 text-center">
          <div
            className="inline-grid place-items-center w-12 h-12 rounded-[10px] text-white text-[1.1rem] font-extrabold mb-5"
            style={{ background: iconColor }}
          >
            {displayName[0]}
          </div>
          <p className="eyebrow mb-3">Coming soon</p>
          <h2 className="mb-3">{displayName} is on the way</h2>
          <p className="text-muted text-[0.9rem] max-w-[44ch] mx-auto mb-8 leading-relaxed">
            {shortDescription} Contact us to learn more or ask about early access for your organization.
          </p>
          <div className="flex items-center justify-center gap-3 flex-wrap">
            <Button asChild variant="primary">
              <a href={`mailto:info@akkedisdigital.com?subject=${encodeURIComponent(`Interest in ${displayName}`)}`}>
                Contact us about {displayName}
              </a>
            </Button>
            <Button asChild variant="secondary">
              <a href="/app">Back to dashboard</a>
            </Button>
          </div>
        </div>
      </div>

    </div>
  );
}

// ── Route ─────────────────────────────────────────────────────────────────────

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const productKey = slug.replace(/-/g, "_") as ProductKey;
  const def = getProductDefinition(productKey);

  if (!def || def.kind === "service") notFound();

  if (productKey === "stories_canopy") {
    return <StoriesDetailPage iconColor={def.iconColor} displayName={def.displayName} />;
  }

  if (productKey === "photovault") {
    return <PhotoVaultDetailPage iconColor={def.iconColor} displayName={def.displayName} />;
  }

  if (productKey === "reach_canopy") {
    return <ReachDetailPage iconColor={def.iconColor} displayName={def.displayName} />;
  }

  return (
    <ComingSoonPage
      iconColor={def.iconColor}
      displayName={def.displayName}
      shortDescription={def.shortDescription}
      category={def.category}
    />
  );
}
