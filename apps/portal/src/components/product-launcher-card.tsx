import type { LauncherProduct } from "@/lib/products";

type ProductLauncherCardProps = {
  product: LauncherProduct;
};

export function ProductLauncherCard({ product }: ProductLauncherCardProps) {
  const taskLabel = product.kind === "service" ? "Most common next step" : "Most common task";

  return (
    <article className="product-card">
      <div className="product-top">
        <p className="product-category">{product.category}</p>
        <span className={`pill pill-${product.state}`}>{product.stateLabel}</span>
      </div>
      <h3>{product.displayName}</h3>
      <p>{product.shortDescription}</p>
      <p className="task-label">{taskLabel}</p>
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
