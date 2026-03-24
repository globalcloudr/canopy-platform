import { ProductLauncherCard } from "@/components/product-launcher-card";
import { resolvePortalSession } from "@/lib/platform";
import { getAdditionalLauncherProducts, getEnabledLauncherProducts, getLauncherServices } from "@/lib/products";

type PortalDashboardPageProps = {
  searchParams?: Promise<{
    email?: string;
    workspace?: string;
  }>;
};

export default async function PortalDashboardPage({ searchParams }: PortalDashboardPageProps) {
  const params = (await searchParams) ?? {};
  const session = resolvePortalSession(params);
  const launcherProducts = getEnabledLauncherProducts(session.entitlements);
  const additionalProducts = getAdditionalLauncherProducts(session.entitlements);
  const launcherServices = getLauncherServices(session.entitlements);
  const launchableCount = launcherProducts.filter((p) => p.canLaunch).length;
  const workspaceName = session.activeWorkspace.displayName;
  const activeMembership = session.memberships.find((m) => m.workspaceId === session.activeWorkspace.id);

  return (
    <div className="shell">
      <div className="page-header" id="overview">
        <h1>Welcome back.</h1>
        <div className="page-meta">
          <span>{workspaceName}</span>
          <span className="page-meta-dot">·</span>
          <span>{launchableCount} product{launchableCount === 1 ? "" : "s"} active</span>
          <span className="page-meta-dot">·</span>
          <span>{activeMembership?.role ?? "staff"}</span>
        </div>
      </div>

      {launcherProducts.length > 0 && (
        <section className="section" id="products">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Your Apps</p>
              <h2>What would you like to do today?</h2>
            </div>
            <p className="section-copy">Products your organization has access to.</p>
          </div>
          <div className="product-grid">
            {launcherProducts.map((product) => (
              <ProductLauncherCard key={product.productKey} product={product} />
            ))}
          </div>
        </section>
      )}

      {launcherServices.length > 0 && (
        <section className="section">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Services</p>
              <h2>Active services</h2>
            </div>
            <p className="section-copy">Managed services running for your organization.</p>
          </div>
          <div className="services-list">
            {launcherServices.map((service) => (
              <div key={service.productKey} className="service-row">
                <div className="service-row-left">
                  <div className="service-icon" style={{ background: service.iconColor }}>
                    {service.displayName[0]}
                  </div>
                  <div>
                    <p className="service-name">{service.displayName}</p>
                    <p className="service-desc">{service.shortDescription}</p>
                  </div>
                </div>
                <div className="service-row-right">
                  <span className={`pill pill-${service.state}`}>{service.stateLabel}</span>
                  <a className="card-action" href={service.primaryActionTarget}>
                    {service.primaryActionLabel} →
                  </a>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {additionalProducts.length > 0 && (
        <section className="section">
          <div className="section-heading">
            <div>
              <p className="eyebrow">More from Canopy</p>
              <h2>Expand your platform</h2>
            </div>
            <p className="section-copy">Contact Canopy to add these products to your workspace.</p>
          </div>
          <div className="product-grid product-grid-dim">
            {additionalProducts.map((product) => (
              <ProductLauncherCard key={product.productKey} product={product} dim />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
