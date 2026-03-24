import { resolvePortalSession } from "@/lib/platform";
import { getProductDefinition } from "@/lib/products";

type AccountPageProps = {
  searchParams?: Promise<{
    email?: string;
    workspace?: string;
  }>;
};

export default async function AccountPage({ searchParams }: AccountPageProps) {
  const params = (await searchParams) ?? {};
  const session = resolvePortalSession(params);
  const { activeWorkspace, user, memberships, entitlements } = session;
  const activeMembership = memberships.find((m) => m.workspaceId === activeWorkspace.id);
  const activeEntitlements = entitlements.filter((e) => e.status !== "paused");

  return (
    <div className="max-w-[1160px] mx-auto px-6 pb-20 max-[580px]:px-4">

      {/* ── Page header ──────────────────────────────── */}
      <div className="pt-11 pb-9 border-b border-[rgba(15,31,61,0.1)] mb-10">
        <h1 className="mb-2">{activeWorkspace.displayName}</h1>
        <div className="flex items-center gap-2 text-sm text-muted flex-wrap">
          <span>{user.email}</span>
          <span className="text-[rgba(15,31,61,0.18)]">·</span>
          <span>{activeMembership?.role ?? "staff"} access</span>
          <span className="text-[rgba(15,31,61,0.18)]">·</span>
          <span>{memberships.length} workspace{memberships.length === 1 ? "" : "s"}</span>
        </div>
      </div>

      {/* ── Workspace details ────────────────────────── */}
      <section className="mb-12">
        <div className="flex justify-between items-end gap-6 mb-5">
          <div>
            <p className="eyebrow">Workspace</p>
            <h2>Organization details</h2>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4 mb-9 max-[840px]:grid-cols-2 max-[580px]:grid-cols-1">
          {[
            { label: "Organization", value: activeWorkspace.displayName, sub: activeWorkspace.slug },
            { label: "Your role", value: activeMembership?.role ?? "staff", sub: `Signed in as ${user.displayName}` },
            { label: "Active products", value: String(activeEntitlements.length), sub: "Products and services enabled" },
          ].map((stat) => (
            <div key={stat.label} className="bg-surface border border-[rgba(15,31,61,0.1)] rounded-xl p-5 shadow-[0_1px_3px_rgba(15,31,61,0.08)]">
              <p className="text-[0.72rem] font-bold uppercase tracking-[0.08em] text-muted mb-2">{stat.label}</p>
              <strong className="block text-2xl font-bold tracking-[-0.02em] text-ink mb-1">{stat.value}</strong>
              <span className="text-[0.825rem] text-muted leading-relaxed">{stat.sub}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── Products & services ──────────────────────── */}
      <section className="mb-12">
        <div className="flex justify-between items-end gap-6 mb-5">
          <div>
            <p className="eyebrow">Products &amp; Services</p>
            <h2>What&apos;s enabled for your workspace</h2>
          </div>
          <p className="text-muted text-[0.9rem] max-w-[44ch] m-0">
            Contact Canopy to make changes to your product access.
          </p>
        </div>

        <div className="flex flex-col bg-surface border border-[rgba(15,31,61,0.1)] rounded-xl overflow-hidden shadow-[0_1px_3px_rgba(15,31,61,0.08)]">
          {activeEntitlements.map((entitlement, i) => {
            const def = getProductDefinition(entitlement.productKey);
            return (
              <div
                key={entitlement.productKey}
                className={`flex items-center justify-between gap-4 px-5 py-3.5 ${i < activeEntitlements.length - 1 ? "border-b border-[rgba(15,31,61,0.1)]" : ""}`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="grid place-items-center w-8 h-8 rounded-[7px] text-white text-[0.8rem] font-extrabold shrink-0"
                    style={{ background: def?.iconColor ?? "#374151" }}
                  >
                    {(def?.displayName ?? entitlement.productKey)[0].toUpperCase()}
                  </div>
                  <div>
                    <p className="text-[0.9rem] font-semibold text-ink m-0">
                      {def?.displayName ?? entitlement.productKey}
                    </p>
                    <p className="text-[0.8rem] text-muted m-0">
                      Setup: {entitlement.setupState.replace(/_/g, " ")}
                    </p>
                  </div>
                </div>
                <span className={`pill pill-${entitlement.status === "active" ? "enabled" : entitlement.status}`}>
                  {entitlement.status.charAt(0).toUpperCase() + entitlement.status.slice(1)}
                </span>
              </div>
            );
          })}
        </div>
      </section>

    </div>
  );
}
