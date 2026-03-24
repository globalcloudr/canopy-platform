import type { LauncherProduct } from "@/lib/products";
import { cn } from "@/lib/cn";

type ProductLauncherCardProps = {
  product: LauncherProduct;
  dim?: boolean;
};

export function ProductLauncherCard({ product, dim }: ProductLauncherCardProps) {
  return (
    <article
      className={cn(
        "flex flex-col rounded-[14px] p-[22px_22px_18px] border cursor-default",
        "transition-[box-shadow,border-color,transform] duration-200",
        dim
          ? "opacity-50 shadow-none border-dashed [border-top-style:solid] grayscale-[0.3] hover:opacity-80 hover:grayscale-0 hover:shadow-[0_1px_3px_rgba(15,31,61,0.08)] hover:-translate-y-px"
          : "border-[rgba(15,31,61,0.1)] shadow-[0_1px_3px_rgba(15,31,61,0.08),0_1px_2px_rgba(15,31,61,0.04)] hover:shadow-[0_4px_12px_rgba(15,31,61,0.08),0_2px_4px_rgba(15,31,61,0.05)] hover:border-[rgba(15,31,61,0.18)] hover:-translate-y-0.5"
      )}
      style={{
        borderTop: `3px solid ${product.iconColor}`,
        background: `linear-gradient(160deg, #fff 55%, ${product.iconColor}0d 100%)`,
      }}
    >
      <div
        className="grid place-items-center w-11 h-11 rounded-[11px] text-white text-[1.05rem] font-extrabold tracking-[-0.02em] shrink-0 mb-3.5"
        style={{ background: product.iconColor }}
      >
        {product.displayName[0]}
      </div>

      <h3 className="mb-[5px]!">{product.displayName}</h3>
      <p className="m-0 mb-auto! text-[0.845rem] text-muted leading-relaxed">{product.shortDescription}</p>

      <div className="flex items-center justify-between gap-2 pt-3.5 border-t border-[rgba(15,31,61,0.1)] mt-4 flex-nowrap min-w-0">
        <span className={`pill pill-${product.state}`}>{product.stateLabel}</span>
        <div className="flex items-center gap-3.5">
          {!dim && product.secondaryActionLabel && product.secondaryActionTarget && (
            <a
              className="text-[0.845rem] font-medium text-muted no-underline whitespace-nowrap transition-colors hover:text-ink-2"
              href={product.secondaryActionTarget}
            >
              {product.secondaryActionLabel}
            </a>
          )}
          <a
            className="text-[0.845rem] font-semibold text-blue no-underline whitespace-nowrap transition-colors hover:text-blue-hover hover:underline"
            href={product.primaryActionTarget}
          >
            {product.primaryActionLabel} →
          </a>
        </div>
      </div>
    </article>
  );
}
