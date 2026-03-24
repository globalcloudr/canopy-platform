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
  const launchableProducts = launcherProducts.filter((product) => product.canLaunch);
  const workspaceName = session.activeWorkspace.displayName;
  const email = session.user.email;
  const activeMembership = session.memberships.find((membership) => membership.workspaceId === session.activeWorkspace.id);

  return (
    <>
      <header className="hero" id="overview">
        <div className="hero-copy">
          <p className="eyebrow">Dashboard</p>
          <h1>Welcome back.</h1>
          <p className="lede">
            Here&apos;s what&apos;s active for {workspaceName} today.
          </p>
        </div>
        <div className="hero-card">
          <p className="card-label">Organization</p>
          <h2>{workspaceName}</h2>
          <ul>
            <li>{launchableProducts.length} product{launchableProducts.length === 1 ? "" : "s"} ready to use</li>
            <li>{activeMembership?.role ?? "staff"} access</li>
            <li>{email}</li>
          </ul>
        </div>
      </header>

      <section className="section" id="products">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Your Apps</p>
            <h2>What would you like to do today?</h2>
          </div>
          <p className="section-copy">
            Products your organization has access to or is actively rolling out.
          </p>
        </div>

        <div className="product-grid">
          {launcherProducts.map((product) => (
            <ProductLauncherCard key={product.productKey} product={product} />
          ))}
        </div>
      </section>

      <section className="section">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Other Products</p>
            <h2>More from Canopy</h2>
          </div>
          <p className="section-copy">
            Other Canopy products available to your organization. Contact Canopy to get started.
          </p>
        </div>

        <div className="product-grid">
          {additionalProducts.map((product) => (
            <ProductLauncherCard key={product.productKey} product={product} />
          ))}
        </div>
      </section>

      <section className="section">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Services</p>
            <h2>Canopy services</h2>
          </div>
          <p className="section-copy">
            Managed services and implementation support active for your organization.
          </p>
        </div>

        <div className="product-grid">
          {launcherServices.map((service) => (
            <ProductLauncherCard key={service.productKey} product={service} />
          ))}
        </div>
      </section>

    </>
  );
}
