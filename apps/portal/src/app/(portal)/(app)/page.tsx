import { AppPill, AppSurface, BodyText, DashboardHero, Eyebrow, SectionTitle } from "@canopy/ui";
import { redirect } from "next/navigation";
import { PortalPageHeader } from "@/components/portal-page-header";
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
  const session = await resolvePortalSession(params);

  if (!session) {
    redirect("/sign-in");
  }

  const launcherProducts = getEnabledLauncherProducts(session.entitlements, {
    workspaceSlug: session.activeWorkspace?.slug,
  });
  const additionalProducts = getAdditionalLauncherProducts(session.entitlements, {
    workspaceSlug: session.activeWorkspace?.slug,
  });
  const launcherServices = getLauncherServices(session.entitlements, {
    workspaceSlug: session.activeWorkspace?.slug,
  });
  const activeWorkspace = session.activeWorkspace;

  if (session.isPlatformOperator && !activeWorkspace) {
    return (
      <div className="space-y-5 pb-10">
        <DashboardHero
          eyebrow="Platform Home"
          headline="Platform Overview"
          subheading="Platform operations, workspace visibility, and launcher access across Canopy."
          illustration={
            <svg width="140" height="120" viewBox="0 0 140 120" fill="none" aria-hidden="true">
              <rect x="10" y="20" width="48" height="36" rx="8" stroke="currentColor" strokeWidth="2" />
              <rect x="68" y="20" width="48" height="36" rx="8" stroke="currentColor" strokeWidth="2" opacity="0.7" />
              <rect x="10" y="68" width="48" height="36" rx="8" stroke="currentColor" strokeWidth="2" opacity="0.7" />
              <rect x="68" y="68" width="48" height="36" rx="8" stroke="currentColor" strokeWidth="2" opacity="0.4" />
            </svg>
          }
        />

        <AppSurface id="workspace-context" variant="clear" padding="md" className="sm:p-6">
          <SectionTitle as="h2" className="mb-1 text-[var(--foreground)]">Workspace Context</SectionTitle>
          <BodyText muted className="m-0 max-w-[58ch]">
            Use the workspace menu in the header when you want to inspect launcher state, account details, or enter a
            product in client context. Until then, this view stays intentionally neutral.
          </BodyText>
        </AppSurface>
      </div>
    );
  }

  return (
    <div className="space-y-5 pb-10">
      <DashboardHero
        eyebrow="Workspace Home"
        headline="Welcome to Canopy"
        subheading="Launch products, review active services, and manage your workspace."
        ctaLabel="Your Apps"
        ctaHref="#products"
        illustration={
          <svg width="140" height="120" viewBox="0 0 140 120" fill="none" aria-hidden="true">
            <rect x="10" y="20" width="48" height="36" rx="8" stroke="currentColor" strokeWidth="2" />
            <rect x="68" y="20" width="48" height="36" rx="8" stroke="currentColor" strokeWidth="2" opacity="0.7" />
            <rect x="10" y="68" width="48" height="36" rx="8" stroke="currentColor" strokeWidth="2" opacity="0.7" />
            <rect x="68" y="68" width="48" height="36" rx="8" stroke="currentColor" strokeWidth="2" opacity="0.4" />
          </svg>
        }
      />

      {launcherProducts.length > 0 && (
        <AppSurface id="products" variant="clear" padding="md" className="sm:p-6">
          <div className="mb-4 flex justify-between gap-6 max-sm:flex-col sm:items-end">
            <div>
              <Eyebrow>Your Apps</Eyebrow>
              <SectionTitle as="h2" className="text-[var(--foreground)]">Launch into your products</SectionTitle>
              <BodyText muted className="m-0 max-w-[54ch]">Products your workspace can access right now.</BodyText>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4 max-[960px]:grid-cols-2 max-[620px]:grid-cols-1">
            {launcherProducts.map((product) => (
              <ProductLauncherCard key={product.productKey} product={product} />
            ))}
          </div>
        </AppSurface>
      )}

      {launcherServices.length > 0 && (
        <AppSurface id="services" variant="clear" padding="md" className="sm:p-6">
          <div className="mb-4 flex justify-between gap-6 max-sm:flex-col sm:items-end">
            <div>
              <Eyebrow>Services</Eyebrow>
              <SectionTitle as="h2" className="text-[var(--foreground)]">Active services</SectionTitle>
              <BodyText muted className="m-0 max-w-[54ch]">
                Managed services currently running for your workspace.
              </BodyText>
            </div>
          </div>
          <div className="overflow-hidden rounded-[var(--radius-soft)] border border-[var(--rule)] bg-[var(--paper)]">
            {launcherServices.map((service, i) => (
              <div
                key={service.productKey}
                className={`flex items-center justify-between gap-4 px-5 py-3.5 ${i < launcherServices.length - 1 ? "border-b border-[var(--rule)]" : ""}`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="grid h-8 w-8 place-items-center rounded-[7px] text-[0.8rem] font-extrabold text-white"
                    style={{ background: service.iconColor }}
                  >
                    {service.displayName[0]}
                  </div>
                  <div>
                    <SectionTitle as="h3" className="m-0 text-lg text-[var(--foreground)]">{service.displayName}</SectionTitle>
                    <BodyText muted className="m-0 text-[0.8rem]">{service.shortDescription}</BodyText>
                  </div>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <AppPill>{service.stateLabel}</AppPill>
                  <a
                    className="text-[0.845rem] font-semibold text-[var(--accent)] no-underline whitespace-nowrap transition-colors hover:text-[var(--accent-ink)] hover:underline"
                    href={service.primaryActionTarget}
                  >
                    {service.primaryActionLabel}
                  </a>
                </div>
              </div>
            ))}
          </div>
        </AppSurface>
      )}

      {additionalProducts.length > 0 && (
        <AppSurface id="more-products" variant="clear" padding="md" className="sm:p-6">
          <div className="mb-4 flex justify-between gap-6 max-sm:flex-col sm:items-end">
            <div>
              <Eyebrow>More from Canopy</Eyebrow>
              <SectionTitle as="h2" className="text-[var(--foreground)]">Expand your platform</SectionTitle>
              <BodyText muted className="m-0 max-w-[54ch]">
                Additional products that can be added to this workspace when you are ready.
              </BodyText>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4 max-[960px]:grid-cols-2 max-[620px]:grid-cols-1">
            {additionalProducts.map((product) => (
              <ProductLauncherCard key={product.productKey} product={product} dim />
            ))}
          </div>
        </AppSurface>
      )}
    </div>
  );
}
