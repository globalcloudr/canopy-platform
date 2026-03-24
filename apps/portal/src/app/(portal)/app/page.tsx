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
  const firstName = session.user.displayName.split(" ")[0];
  const activeMembership = session.memberships.find((m) => m.workspaceId === session.activeWorkspace.id);

  return (
    <div className="shell">
      <div className="page-header" id="overview">
        <div className="page-header-content">
          <h1>Welcome back, {firstName}.</h1>
          <div className="page-meta">
            <span>{workspaceName}</span>
            <span className="page-meta-dot">·</span>
            <span>{launchableCount} product{launchableCount === 1 ? "" : "s"} active</span>
            <span className="page-meta-dot">·</span>
            <span>{activeMembership?.role ?? "staff"}</span>
          </div>
        </div>
        <svg className="page-header-graphic" viewBox="0 0 220 100" fill="none" aria-hidden="true">
          {/* Concentric arcs — signal/community motif */}
          <circle cx="200" cy="50" r="20" stroke="#2563eb" strokeWidth="1.5" strokeOpacity="0.18" fill="none"/>
          <circle cx="200" cy="50" r="38" stroke="#2563eb" strokeWidth="1.5" strokeOpacity="0.13" fill="none"/>
          <circle cx="200" cy="50" r="56" stroke="#2563eb" strokeWidth="1.5" strokeOpacity="0.09" fill="none"/>
          <circle cx="200" cy="50" r="74" stroke="#2563eb" strokeWidth="1.5" strokeOpacity="0.06" fill="none"/>
          <circle cx="200" cy="50" r="92" stroke="#2563eb" strokeWidth="1.5" strokeOpacity="0.04" fill="none"/>
          {/* Center dot */}
          <circle cx="200" cy="50" r="4" fill="#2563eb" fillOpacity="0.35"/>
          {/* Small satellite dots */}
          <circle cx="162" cy="50" r="2.5" fill="#2563eb" fillOpacity="0.25"/>
          <circle cx="175" cy="26" r="2" fill="#0f1f3d" fillOpacity="0.2"/>
          <circle cx="175" cy="74" r="2" fill="#0f1f3d" fillOpacity="0.2"/>
          <circle cx="144" cy="34" r="1.5" fill="#2563eb" fillOpacity="0.18"/>
          <circle cx="144" cy="66" r="1.5" fill="#2563eb" fillOpacity="0.18"/>
          {/* Connector lines */}
          <line x1="200" y1="50" x2="162" y2="50" stroke="#2563eb" strokeWidth="1" strokeOpacity="0.2" strokeDasharray="3 3"/>
          <line x1="162" y1="50" x2="144" y2="34" stroke="#2563eb" strokeWidth="1" strokeOpacity="0.15" strokeDasharray="3 3"/>
          <line x1="162" y1="50" x2="144" y2="66" stroke="#2563eb" strokeWidth="1" strokeOpacity="0.15" strokeDasharray="3 3"/>
        </svg>
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
        <div className="section-discover">
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
        </div>
      )}
    </div>
  );
}
