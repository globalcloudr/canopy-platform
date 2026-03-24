import type { LauncherProduct } from "@/lib/products";

type ProductLauncherCardProps = {
  product: LauncherProduct;
};

export function ProductLauncherCard({ product }: ProductLauncherCardProps) {
  return (
    <article className="product-card">
      <div className="product-top">
        <p className="product-category">{product.category}</p>
        <span className={`pill pill-${product.state}`}>{product.stateLabel}</span>
      </div>
      <h3>{product.displayName}</h3>
      <p>{product.shortDescription}</p>
      <div className="product-actions">
        <a className="launch-button" href={product.primaryActionTarget}>
          {product.primaryActionLabel}
        </a>
        {product.secondaryActionLabel && product.secondaryActionTarget ? (
          <a className="secondary-link" href={product.secondaryActionTarget}>
            {product.secondaryActionLabel}
          </a>
        ) : null}
      </div>
    </article>
  );
}
