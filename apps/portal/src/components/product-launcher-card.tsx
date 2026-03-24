import type { LauncherProduct } from "@/lib/products";

type ProductLauncherCardProps = {
  product: LauncherProduct;
  dim?: boolean;
};

export function ProductLauncherCard({ product, dim }: ProductLauncherCardProps) {
  return (
    <article className={`product-card${dim ? " product-card-dim" : ""}`}>
      <div className="product-icon" style={{ background: product.iconColor }}>
        {product.displayName[0]}
      </div>
      <h3>{product.displayName}</h3>
      <p>{product.shortDescription}</p>
      <div className="product-card-footer">
        <span className={`pill pill-${product.state}`}>{product.stateLabel}</span>
        <a className="card-action" href={product.primaryActionTarget}>
          {product.primaryActionLabel} →
        </a>
      </div>
    </article>
  );
}
