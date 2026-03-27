import { Badge } from "@canopy/ui";
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
    workspaceSlug: session.activeWorkspace.slug,
  });
  const additionalProducts = getAdditionalLauncherProducts(session.entitlements, {
    workspaceSlug: session.activeWorkspace.slug,
  });
  const launcherServices = getLauncherServices(session.entitlements, {
    workspaceSlug: session.activeWorkspace.slug,
  });
  const launchableCount = launcherProducts.filter((p) => p.canLaunch).length;
  const workspaceName = session.activeWorkspace.displayName;
  const firstName = session.user.displayName.split(" ")[0];
  const activeMembership = session.memberships.find((m) => m.workspaceId === session.activeWorkspace.id);

  return (
    <div className="space-y-8 pb-10">

      {/* ── Page header ──────────────────────────────── */}
      <header className="rounded-2xl border border-[rgba(15,31,61,0.1)] bg-white p-5 shadow-[0_1px_3px_rgba(15,31,61,0.08)]">
        <p className="eyebrow">Dashboard</p>
        <h2 className="mb-1">Welcome back, {firstName}.</h2>
        <div className="flex items-center gap-2 text-sm text-muted flex-wrap">
          <span>{workspaceName}</span>
          <span className="text-[rgba(15,31,61,0.25)]">·</span>
          <span>{launchableCount} product{launchableCount === 1 ? "" : "s"} active</span>
          <span className="text-[rgba(15,31,61,0.25)]">·</span>
          <span>{activeMembership?.role ?? "staff"}</span>
        </div>
      </header>

      {/* ── Your Apps ────────────────────────────────── */}
      {launcherProducts.length > 0 && (
        <section id="products">
          <div className="flex justify-between items-end gap-6 mb-4">
            <div>
              <p className="eyebrow">Your Apps</p>
              <h2>What would you like to do today?</h2>
            </div>
            <p className="text-muted text-[0.9rem] max-w-[44ch] m-0 hidden sm:block">Products your organization has access to.</p>
          </div>
          <div className="grid grid-cols-3 gap-4 max-[840px]:grid-cols-2 max-[580px]:grid-cols-1">
            {launcherProducts.map((product) => (
              <ProductLauncherCard key={product.productKey} product={product} />
            ))}
          </div>
        </section>
      )}

      {/* ── Active services ──────────────────────────── */}
      {launcherServices.length > 0 && (
        <section>
          <div className="flex justify-between items-end gap-6 mb-4">
            <div>
              <p className="eyebrow">Services</p>
              <h2>Active services</h2>
            </div>
            <p className="text-muted text-[0.9rem] max-w-[44ch] m-0 hidden sm:block">Managed services running for your organization.</p>
          </div>
          <div className="flex flex-col bg-white border border-[rgba(15,31,61,0.1)] rounded-xl overflow-hidden shadow-[0_1px_3px_rgba(15,31,61,0.08)]">
            {launcherServices.map((service, i) => (
              <div
                key={service.productKey}
                className={`flex items-center justify-between gap-4 px-5 py-3.5 ${i < launcherServices.length - 1 ? "border-b border-[rgba(15,31,61,0.1)]" : ""}`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="grid place-items-center w-8 h-8 rounded-[7px] text-white text-[0.8rem] font-extrabold shrink-0"
                    style={{ background: service.iconColor }}
                  >
                    {service.displayName[0]}
                  </div>
                  <div>
                    <p className="text-[0.9rem] font-semibold text-ink m-0">{service.displayName}</p>
                    <p className="text-[0.8rem] text-muted m-0">{service.shortDescription}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <Badge variant={service.state as ProductState}>{service.stateLabel}</Badge>
                  <a
                    className="text-[0.845rem] font-semibold text-blue no-underline whitespace-nowrap transition-colors hover:text-blue-hover hover:underline"
                    href={service.primaryActionTarget}
                  >
                    {service.primaryActionLabel} →
                  </a>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── More from Canopy ─────────────────────────── */}
      {additionalProducts.length > 0 && (
        <div className="bg-[rgba(15,31,61,0.025)] border border-[rgba(15,31,61,0.1)] rounded-2xl p-7 pb-6">
          <div className="flex justify-between items-end gap-6 mb-4">
            <div>
              <p className="eyebrow">More from Canopy</p>
              <h2>Expand your platform</h2>
            </div>
            <p className="text-muted text-[0.9rem] max-w-[44ch] m-0 hidden sm:block">
              Contact Canopy to add these products to your workspace.
            </p>
          </div>
          <div className="grid grid-cols-3 gap-4 max-[840px]:grid-cols-2 max-[580px]:grid-cols-1">
            {additionalProducts.map((product) => (
              <ProductLauncherCard key={product.productKey} product={product} dim />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
