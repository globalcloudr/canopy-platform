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
    <div className="max-w-[1160px] mx-auto px-6 pb-20 max-[580px]:px-4">

      {/* ── Page header ──────────────────────────────── */}
      <div className="pt-11 pb-9 border-b border-[rgba(15,31,61,0.1)] mb-10 flex items-center justify-between gap-6 overflow-hidden">
        <div className="min-w-0">
          <h1 className="mb-2!">Welcome back, {firstName}.</h1>
          <div className="flex items-center gap-2 text-sm text-muted flex-wrap">
            <span>{workspaceName}</span>
            <span className="text-[rgba(15,31,61,0.18)]">·</span>
            <span>{launchableCount} product{launchableCount === 1 ? "" : "s"} active</span>
            <span className="text-[rgba(15,31,61,0.18)]">·</span>
            <span>{activeMembership?.role ?? "staff"}</span>
          </div>
        </div>
        <svg className="w-[220px] h-[100px] shrink-0 opacity-90 max-[580px]:hidden" viewBox="0 0 220 100" fill="none" aria-hidden="true">
          <circle cx="200" cy="50" r="20" stroke="#2563eb" strokeWidth="1.5" strokeOpacity="0.18" fill="none"/>
          <circle cx="200" cy="50" r="38" stroke="#2563eb" strokeWidth="1.5" strokeOpacity="0.13" fill="none"/>
          <circle cx="200" cy="50" r="56" stroke="#2563eb" strokeWidth="1.5" strokeOpacity="0.09" fill="none"/>
          <circle cx="200" cy="50" r="74" stroke="#2563eb" strokeWidth="1.5" strokeOpacity="0.06" fill="none"/>
          <circle cx="200" cy="50" r="92" stroke="#2563eb" strokeWidth="1.5" strokeOpacity="0.04" fill="none"/>
          <circle cx="200" cy="50" r="4" fill="#2563eb" fillOpacity="0.35"/>
          <circle cx="162" cy="50" r="2.5" fill="#2563eb" fillOpacity="0.25"/>
          <circle cx="175" cy="26" r="2" fill="#0f1f3d" fillOpacity="0.2"/>
          <circle cx="175" cy="74" r="2" fill="#0f1f3d" fillOpacity="0.2"/>
          <circle cx="144" cy="34" r="1.5" fill="#2563eb" fillOpacity="0.18"/>
          <circle cx="144" cy="66" r="1.5" fill="#2563eb" fillOpacity="0.18"/>
          <line x1="200" y1="50" x2="162" y2="50" stroke="#2563eb" strokeWidth="1" strokeOpacity="0.2" strokeDasharray="3 3"/>
          <line x1="162" y1="50" x2="144" y2="34" stroke="#2563eb" strokeWidth="1" strokeOpacity="0.15" strokeDasharray="3 3"/>
          <line x1="162" y1="50" x2="144" y2="66" stroke="#2563eb" strokeWidth="1" strokeOpacity="0.15" strokeDasharray="3 3"/>
        </svg>
      </div>

      {/* ── Your Apps ────────────────────────────────── */}
      {launcherProducts.length > 0 && (
        <section className="mb-12" id="products">
          <div className="flex justify-between items-end gap-6 mb-5">
            <div>
              <p className="eyebrow">Your Apps</p>
              <h2>What would you like to do today?</h2>
            </div>
            <p className="text-muted text-[0.9rem] max-w-[44ch] m-0">Products your organization has access to.</p>
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
        <section className="mb-12">
          <div className="flex justify-between items-end gap-6 mb-5">
            <div>
              <p className="eyebrow">Services</p>
              <h2>Active services</h2>
            </div>
            <p className="text-muted text-[0.9rem] max-w-[44ch] m-0">Managed services running for your organization.</p>
          </div>
          <div className="flex flex-col bg-surface border border-[rgba(15,31,61,0.1)] rounded-xl overflow-hidden shadow-[0_1px_3px_rgba(15,31,61,0.08)]">
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
                  <span className={`pill pill-${service.state}`}>{service.stateLabel}</span>
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
        <div className="bg-[rgba(15,31,61,0.025)] border border-[rgba(15,31,61,0.1)] rounded-2xl p-7 pb-6 mb-12">
          <div className="flex justify-between items-end gap-6 mb-5">
            <div>
              <p className="eyebrow">More from Canopy</p>
              <h2>Expand your platform</h2>
            </div>
            <p className="text-muted text-[0.9rem] max-w-[44ch] m-0">
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
