import { ProductLauncherCard } from "@/components/product-launcher-card";
import { getLauncherProducts } from "@/lib/products";

export default function PortalDashboardPage() {
  const launcherProducts = getLauncherProducts();
  const launchableProducts = launcherProducts.filter((product) => product.canLaunch);
  const nextActionProduct = launcherProducts[0];

  return (
    <>
      <header className="hero" id="overview">
        <div className="hero-copy">
          <p className="eyebrow">Canopy Platform</p>
          <h1>One shared portal for school growth tools.</h1>
          <p className="lede">
            Canopy helps schools organize, publish, communicate, and grow through connected products built around a
            shared workspace, entitlement, and launch model.
          </p>
        </div>
        <div className="hero-card">
          <p className="card-label">Workspace</p>
          <h2>Example Adult School</h2>
          <ul>
            <li>{launchableProducts.length} launch-ready product</li>
            <li>1 active workspace</li>
            <li>Shared account, entitlement, and launch flow</li>
          </ul>
        </div>
      </header>

      <section className="section section-dashboard" id="account">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Workspace Snapshot</p>
            <h2>Example Adult School</h2>
          </div>
          <p className="section-copy">
            A lightweight portal home should help staff understand their account, product state, and what needs
            attention next.
          </p>
        </div>

        <div className="stats-grid">
          <article className="stat-card">
            <p className="stat-label">Visible products</p>
            <strong>{launcherProducts.length}</strong>
            <span>Product cards should be driven by the launcher contract, not a static list of ideas.</span>
          </article>
          <article className="stat-card">
            <p className="stat-label">Team members</p>
            <strong>14</strong>
            <span>Workspace roles and product access should resolve from one shared platform account model.</span>
          </article>
          <article className="stat-card">
            <p className="stat-label">Next action</p>
            <strong>{nextActionProduct?.primaryActionLabel ?? "Launch Product"}</strong>
            <span>The portal should always surface the clearest next step for the active workspace.</span>
          </article>
        </div>
      </section>

      <section className="section" id="products">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Portal MVP</p>
            <h2>Product launcher</h2>
          </div>
          <p className="section-copy">
            The first version of `usecanopy.school` should help a school sign in, resolve its workspace, and act on
            real product state with confidence.
          </p>
        </div>

        <div className="product-grid">
          {launcherProducts.map((product) => (
            <ProductLauncherCard key={product.productKey} product={product} />
          ))}
        </div>
      </section>

      <section className="section section-alt">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Architecture</p>
            <h2>Platform core first</h2>
          </div>
        </div>

        <div className="principles">
          <article>
            <h3>Shared portal</h3>
            <p>One login, one workspace model, one place to access enabled products and services.</p>
          </article>
          <article>
            <h3>Launcher contract</h3>
            <p>Product cards should reflect entitlement, setup state, and next action rather than static marketing labels.</p>
          </article>
          <article>
            <h3>Connected outcomes</h3>
            <p>Assets, branding, publishing, outreach, and insights can connect without becoming one brittle app.</p>
          </article>
        </div>
      </section>
    </>
  );
}
