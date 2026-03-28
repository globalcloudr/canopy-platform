import { Badge, Button, CardTitle, BodyText, typography, cn } from "@canopy/ui";
import type { LauncherProduct, ProductState } from "@/lib/products";

type ProductLauncherCardProps = {
  product: LauncherProduct;
  dim?: boolean;
};

export function ProductLauncherCard({ product, dim }: ProductLauncherCardProps) {
  return (
    <article
      className={cn(
        "overflow-hidden rounded-xl border border-slate-200 bg-white transition-[box-shadow,border-color,transform] duration-200",
        dim
          ? "opacity-70 hover:opacity-90"
          : "shadow-[0_1px_3px_rgba(15,31,61,0.08)] hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-[0_6px_18px_rgba(15,31,61,0.08)]"
      )}
    >
      <div className="h-20 border-b border-slate-200" style={{ background: product.iconColor }} />

      <div className="relative p-4">
        <div className="-mt-10 mb-3 flex items-start justify-between gap-3">
          <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-full border-2 border-white bg-white shadow-sm">
            <div
              className="grid h-12 w-12 place-items-center rounded-full text-[0.95rem] font-extrabold tracking-[-0.02em] text-white"
              style={{ background: product.iconColor }}
            >
              {product.displayName[0]}
            </div>
          </div>
          <Badge variant={product.state as ProductState}>{product.stateLabel}</Badge>
        </div>

        <CardTitle className="mb-1 text-slate-900">{product.displayName}</CardTitle>
        <BodyText muted className="m-0 text-[0.84rem]">{product.category}</BodyText>
        <BodyText muted className="mt-2 min-h-[3.3rem] text-[0.86rem]">{product.shortDescription}</BodyText>
      </div>

      <div className="space-y-3 border-t border-slate-200 px-3 py-3">
        <div className="flex flex-wrap items-center gap-2">
          <Button asChild size="sm" variant="secondary">
            <a href={product.primaryActionTarget}>{product.primaryActionLabel}</a>
          </Button>
          {product.secondaryActionLabel && product.secondaryActionTarget ? (
            <a
              className={cn(typography.meta, "inline-flex items-center no-underline transition-colors hover:text-slate-900")}
              href={product.secondaryActionTarget}
            >
              {product.secondaryActionLabel}
            </a>
          ) : null}
        </div>
      </div>
    </article>
  );
}
