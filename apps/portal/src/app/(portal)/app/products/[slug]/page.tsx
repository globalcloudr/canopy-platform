import { notFound } from "next/navigation";
import { getProductDefinition } from "@/lib/products";
import type { ProductKey } from "@/lib/platform";

type ProductPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const productKey = slug.replace(/-/g, "_") as ProductKey;
  const def = getProductDefinition(productKey);

  if (!def || def.kind === "service") notFound();

  return (
    <div className="space-y-6 pb-10">

      {/* ── Page header ──────────────────────────────── */}
      <header className="rounded-2xl border border-[rgba(15,31,61,0.1)] bg-white p-6 shadow-[0_1px_3px_rgba(15,31,61,0.08)]">
        <div className="flex items-start gap-5">
          <div
            className="grid place-items-center w-14 h-14 rounded-[12px] text-white text-[1.4rem] font-extrabold tracking-[-0.02em] shrink-0"
            style={{ background: def.iconColor }}
          >
            {def.displayName[0]}
          </div>
          <div>
            <p className="eyebrow">{def.category}</p>
            <h2 className="mb-1">{def.displayName}</h2>
            <p className="text-muted text-[0.9rem] m-0 max-w-[52ch]">{def.shortDescription}</p>
          </div>
        </div>
      </header>

      {/* ── Coming soon ───────────────────────────────── */}
      <div className="rounded-2xl border border-[rgba(15,31,61,0.1)] bg-white shadow-[0_1px_3px_rgba(15,31,61,0.08)] overflow-hidden">
        <div
          className="h-1.5 w-full"
          style={{ background: def.iconColor }}
          aria-hidden="true"
        />
        <div className="px-8 py-12 text-center">
          <div
            className="inline-grid place-items-center w-12 h-12 rounded-[10px] text-white text-[1.1rem] font-extrabold mb-5"
            style={{ background: def.iconColor }}
          >
            {def.displayName[0]}
          </div>
          <p className="eyebrow mb-3">Coming soon</p>
          <h2 className="mb-3">{def.displayName} is on the way</h2>
          <p className="text-muted text-[0.9rem] max-w-[44ch] mx-auto mb-8 leading-relaxed">
            {def.shortDescription} Contact us to learn more or ask about early access for your organization.
          </p>
          <div className="flex items-center justify-center gap-3 flex-wrap">
            <a
              href={`mailto:info@akkedisdigital.com?subject=${encodeURIComponent(`Interest in ${def.displayName}`)}`}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-navy text-white text-[0.875rem] font-semibold rounded-lg no-underline transition-colors hover:bg-navy-mid"
            >
              Contact us about {def.displayName}
            </a>
            <a
              href="/app"
              className="inline-flex items-center gap-2 px-5 py-2.5 border border-[rgba(15,31,61,0.18)] text-ink-2 text-[0.875rem] font-semibold rounded-lg no-underline transition-colors hover:bg-[rgba(15,31,61,0.03)]"
            >
              Back to dashboard
            </a>
          </div>
        </div>
      </div>

    </div>
  );
}
