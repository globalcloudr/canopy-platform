import { Badge, BodyText, Card, Eyebrow, PageTitle, SectionTitle } from "@canopy/ui";
import { redirect } from "next/navigation";
import { ProductLauncherCard } from "@/components/product-launcher-card";
import { resolvePortalSession } from "@/lib/platform";
import { getAdditionalLauncherProducts, getEnabledLauncherProducts, getLauncherServices } from "@/lib/products";
import type { ProductState } from "@/lib/products";

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
  const launchableCount = launcherProducts.filter((p) => p.canLaunch).length;
  const firstName = session.user.displayName.split(" ")[0];
  const activeWorkspace = session.activeWorkspace;
  const activeMembership = activeWorkspace
    ? session.memberships.find((m) => m.workspaceId === activeWorkspace.id)
    : null;
  const totalServices = launcherServices.length;

  if (session.isPlatformOperator && !activeWorkspace) {
    return (
      <div className="space-y-5 pb-10">
        <header>
          <PageTitle className="mb-2 text-slate-900">Platform Overview</PageTitle>
          <BodyText muted className="m-0 max-w-3xl text-[0.95rem]">
            Platform operations, workspace visibility, and launcher access across Canopy.
          </BodyText>
        </header>

        <Card className="overflow-hidden">
          <div className="relative h-36 border-b border-slate-200 bg-gradient-to-r from-slate-900 to-slate-700 sm:h-44">
            <div className="absolute inset-0 bg-slate-900/20" />
            <div className="absolute inset-x-0 bottom-0 p-4 text-white sm:p-5">
              <Eyebrow className="text-slate-100">Platform Control</Eyebrow>
              <SectionTitle as="h2" className="mb-1 text-white">Welcome back, {firstName}.</SectionTitle>
              <BodyText muted className="m-0 text-slate-200">
                Neutral overview for support and operator work before entering a client workspace.
              </BodyText>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2 px-4 py-3">
            <Badge>{session.memberships.length} workspaces visible</Badge>
            <Badge>{session.platformRole?.replace(/_/g, " ") ?? "platform operator"}</Badge>
            <Badge>Workspace context not selected</Badge>
          </div>
        </Card>

        <Card padding="md" className="sm:p-6">
          <SectionTitle as="h2" className="mb-1 text-slate-900">Workspace Context</SectionTitle>
          <BodyText muted className="m-0 max-w-[58ch]">
            Use the workspace menu in the header when you want to inspect launcher state, account details, or enter a
            product in client context. Until then, this view stays intentionally neutral.
          </BodyText>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-5 pb-10">
      <header>
        <PageTitle className="mb-2 text-slate-900">{activeWorkspace?.displayName ?? "Workspace Overview"}</PageTitle>
        <BodyText muted className="m-0 max-w-3xl text-[0.95rem]">
          Launch products, review active services, and move across your Canopy workspace.
        </BodyText>
      </header>

      <Card className="overflow-hidden">
        <div className="relative h-36 border-b border-slate-200 bg-gradient-to-r from-slate-900 to-slate-700 sm:h-44">
          <div className="absolute inset-0 bg-slate-900/20" />
          <div className="absolute inset-x-0 bottom-0 p-4 text-white sm:p-5">
            <Eyebrow className="text-slate-100">Workspace Control</Eyebrow>
            <SectionTitle as="h2" className="mb-1 text-white">Welcome back, {firstName}.</SectionTitle>
            <BodyText muted className="m-0 text-slate-200">
              {activeWorkspace?.displayName} is ready for product launch and workspace operations.
            </BodyText>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2 px-4 py-3">
          <Badge>{launchableCount} active product{launchableCount === 1 ? "" : "s"}</Badge>
          <Badge>{totalServices} service{totalServices === 1 ? "" : "s"}</Badge>
          <Badge>{activeMembership?.role ?? "staff"} access</Badge>
        </div>
      </Card>

      {launcherProducts.length > 0 && (
        <Card id="products" padding="md" className="sm:p-6">
          <div className="mb-4 flex justify-between gap-6 max-sm:flex-col sm:items-end">
            <div>
              <Eyebrow>Your Apps</Eyebrow>
              <SectionTitle as="h2" className="text-slate-900">Launch into your products</SectionTitle>
              <BodyText muted className="m-0 max-w-[54ch]">Products your workspace can access right now.</BodyText>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4 max-[960px]:grid-cols-2 max-[620px]:grid-cols-1">
            {launcherProducts.map((product) => (
              <ProductLauncherCard key={product.productKey} product={product} />
            ))}
          </div>
        </Card>
      )}

      {launcherServices.length > 0 && (
        <Card padding="md" className="sm:p-6">
          <div className="mb-4 flex justify-between gap-6 max-sm:flex-col sm:items-end">
            <div>
              <Eyebrow>Services</Eyebrow>
              <SectionTitle as="h2" className="text-slate-900">Active services</SectionTitle>
              <BodyText muted className="m-0 max-w-[54ch]">
                Managed services currently running for your workspace.
              </BodyText>
            </div>
          </div>
          <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
            {launcherServices.map((service, i) => (
              <div
                key={service.productKey}
                className={`flex items-center justify-between gap-4 px-5 py-3.5 ${i < launcherServices.length - 1 ? "border-b border-slate-200" : ""}`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="grid h-8 w-8 place-items-center rounded-[7px] text-[0.8rem] font-extrabold text-white"
                    style={{ background: service.iconColor }}
                  >
                    {service.displayName[0]}
                  </div>
                  <div>
                    <SectionTitle as="h3" className="m-0 text-lg text-slate-900">{service.displayName}</SectionTitle>
                    <BodyText muted className="m-0 text-[0.8rem]">{service.shortDescription}</BodyText>
                  </div>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <Badge variant={service.state as ProductState}>{service.stateLabel}</Badge>
                  <a
                    className="text-[0.845rem] font-semibold text-blue no-underline whitespace-nowrap transition-colors hover:text-blue-hover hover:underline"
                    href={service.primaryActionTarget}
                  >
                    {service.primaryActionLabel}
                  </a>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {additionalProducts.length > 0 && (
        <Card variant="soft" padding="md" className="sm:p-6">
          <div className="mb-4 flex justify-between gap-6 max-sm:flex-col sm:items-end">
            <div>
              <Eyebrow>More from Canopy</Eyebrow>
              <SectionTitle as="h2" className="text-slate-900">Expand your platform</SectionTitle>
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
        </Card>
      )}
    </div>
  );
}
