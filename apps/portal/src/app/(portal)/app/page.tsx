import { ProductLauncherCard } from "@/components/product-launcher-card";
import { getWorkspaceName } from "@/lib/mock-session";
import { getAdditionalLauncherProducts, getEnabledLauncherProducts, getLauncherServices } from "@/lib/products";

type PortalDashboardPageProps = {
  searchParams?: Promise<{
    email?: string;
    workspace?: string;
  }>;
};

export default async function PortalDashboardPage({ searchParams }: PortalDashboardPageProps) {
  const params = (await searchParams) ?? {};
  const launcherProducts = getEnabledLauncherProducts();
  const additionalProducts = getAdditionalLauncherProducts();
  const launcherServices = getLauncherServices();
  const launchableProducts = launcherProducts.filter((product) => product.canLaunch);
  const nextActionProduct = launcherProducts[0];
  const workspaceName = getWorkspaceName(params.workspace);
  const email = params.email ?? "sarah.zylstra@school.edu";

  return (
    <>
      <header className="hero" id="overview">
        <div className="hero-copy">
          <p className="eyebrow">Dashboard</p>
          <h1>Welcome back.</h1>
          <p className="lede">
            Your organization&apos;s tools and services are available here, so you can jump straight into the work you
            need to do today.
          </p>
        </div>
        <div className="hero-card">
          <p className="card-label">Organization</p>
          <h2>{workspaceName}</h2>
          <ul>
            <li>{launchableProducts.length} ready to use today</li>
            <li>1 organization dashboard</li>
            <li>{email}</li>
          </ul>
        </div>
      </header>

      <section className="section section-dashboard" id="account">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Today</p>
            <h2>{workspaceName}</h2>
          </div>
          <p className="section-copy">
            The dashboard should help school staff understand what tools are available, what is ready to use, and what
            action makes sense next.
          </p>
        </div>

        <div className="stats-grid">
          <article className="stat-card">
            <p className="stat-label">Apps available</p>
            <strong>{launcherProducts.length}</strong>
            <span>Your dashboard should show the products your organization can use or is actively setting up.</span>
          </article>
          <article className="stat-card">
            <p className="stat-label">Signed in as</p>
            <strong>{email}</strong>
            <span>{email} is working inside this organization through one shared Canopy account.</span>
          </article>
          <article className="stat-card">
            <p className="stat-label">Suggested next step</p>
            <strong>{nextActionProduct?.primaryActionLabel ?? "Launch Product"}</strong>
            <span>The portal should surface useful next actions instead of generic product-launch language.</span>
          </article>
        </div>
      </section>

      <section className="section" id="products">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Your Apps</p>
            <h2>What would you like to do today?</h2>
          </div>
          <p className="section-copy">
            These are the Canopy products your organization already has access to or is actively rolling out.
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
            <h2>More Canopy products</h2>
          </div>
          <p className="section-copy">
            This part of the catalog helps staff and administrators see what else Canopy offers without confusing those
            products with the apps their organization already uses today.
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
            <h2>Canopy services for your organization</h2>
          </div>
          <p className="section-copy">
            Some Canopy offerings are delivered as managed services or implementation support rather than standalone
            apps. They should still appear clearly on the dashboard.
          </p>
        </div>

        <div className="product-grid">
          {launcherServices.map((service) => (
            <ProductLauncherCard key={service.productKey} product={service} />
          ))}
        </div>
      </section>

      <section className="section section-alt">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Why This Works</p>
            <h2>One dashboard, multiple connected tools</h2>
          </div>
        </div>

        <div className="principles">
          <article>
            <h3>Simple entry</h3>
            <p>Users sign in once and land on a dashboard that reflects what their organization has access to.</p>
          </article>
          <article>
            <h3>Useful actions</h3>
            <p>Cards should present meaningful tasks like viewing photos or creating a newsletter, not just “launch product.”</p>
          </article>
          <article>
            <h3>Shared platform</h3>
            <p>Canopy can keep products modular behind the scenes while still feeling like one connected customer experience.</p>
          </article>
        </div>
      </section>
    </>
  );
}
