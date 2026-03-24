import type { LauncherProduct } from "@/lib/products";

type ProductLauncherCardProps = {
  product: LauncherProduct;
  dim?: boolean;
};

export function ProductLauncherCard({ product, dim }: ProductLauncherCardProps) {
  return (
    <article
      className={`product-card${dim ? " product-card-dim" : ""}`}
      style={{
        borderTop: `3px solid ${product.iconColor}`,
        background: `linear-gradient(160deg, #fff 55%, ${product.iconColor}0d 100%)`,
      }}
    >
      <div className="product-icon" style={{ background: product.iconColor }}>
        {product.displayName[0]}
      </div>
      <h3>{product.displayName}</h3>
      <p>{product.shortDescription}</p>
      <div className="product-card-footer">
        <span className={`pill pill-${product.state}`}>{product.stateLabel}</span>
        <div className="card-actions">
          {!dim && product.secondaryActionLabel && product.secondaryActionTarget && (
            <a className="card-action-secondary" href={product.secondaryActionTarget}>
              {product.secondaryActionLabel}
            </a>
          )}
          <a className="card-action" href={product.primaryActionTarget}>
            {product.primaryActionLabel} →
          </a>
        </div>
      </div>
    </article>
  );
}
