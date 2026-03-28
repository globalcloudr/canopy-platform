import { Button } from "@canopy/ui";
import { notFound } from "next/navigation";
import { getProductDefinition } from "@/lib/products";
import type { ProductKey } from "@/lib/platform";

type ServicePageProps = {
  params: Promise<{ slug: string }>;
};

export default async function ServicePage({ params }: ServicePageProps) {
  const { slug } = await params;
  const productKey = slug.replace(/-/g, "_") as ProductKey;
  const def = getProductDefinition(productKey);

  if (!def || def.kind !== "service") notFound();

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
            <p className="eyebrow">Managed Service</p>
            <h2 className="mb-1">{def.displayName}</h2>
            <p className="text-muted text-[0.9rem] m-0 max-w-[52ch]">{def.shortDescription}</p>
          </div>
        </div>
      </header>

      {/* ── Service info ─────────────────────────────── */}
      <div className="rounded-2xl border border-[rgba(15,31,61,0.1)] bg-white shadow-[0_1px_3px_rgba(15,31,61,0.08)] overflow-hidden">
        <div className="h-1.5 w-full bg-[#374151]" aria-hidden="true" />
        <div className="px-8 py-12 text-center">
          <p className="eyebrow mb-3">Managed by Canopy</p>
          <h2 className="mb-3">{def.displayName}</h2>
          <p className="text-muted text-[0.9rem] max-w-[44ch] mx-auto mb-8 leading-relaxed">
            {def.shortDescription} Reach out to your Canopy contact or email us to get started or check on status.
          </p>
          <div className="flex items-center justify-center gap-3 flex-wrap">
            <Button asChild variant="primary">
              <a href="mailto:info@akkedisdigital.com">Contact Canopy</a>
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
