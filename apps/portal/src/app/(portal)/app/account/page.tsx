import { resolvePortalSession } from "@/lib/platform";

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
    <div className="shell">
      <div className="page-header" id="account">
        <h1>{activeWorkspace.displayName}</h1>
        <div className="page-meta">
          <span>{user.email}</span>
          <span className="page-meta-dot">·</span>
          <span>{activeMembership?.role ?? "staff"} access</span>
          <span className="page-meta-dot">·</span>
          <span>{memberships.length} workspace{memberships.length === 1 ? "" : "s"}</span>
        </div>
      </div>

      <section className="section">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Workspace</p>
            <h2>Organization details</h2>
          </div>
        </div>
        <div className="stats-grid">
          <div className="stat-card">
            <p className="stat-label">Organization</p>
            <strong>{activeWorkspace.displayName}</strong>
            <span>{activeWorkspace.slug}</span>
          </div>
          <div className="stat-card">
            <p className="stat-label">Your role</p>
            <strong>{activeMembership?.role ?? "staff"}</strong>
            <span>Signed in as {user.displayName}</span>
          </div>
          <div className="stat-card">
            <p className="stat-label">Active products</p>
            <strong>{activeEntitlements.length}</strong>
            <span>Products and services enabled</span>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Products &amp; Services</p>
            <h2>What&apos;s enabled for your workspace</h2>
          </div>
          <p className="section-copy">Contact Canopy to make changes to your product access.</p>
        </div>
        <div className="services-list">
          {activeEntitlements.map((entitlement) => (
            <div key={entitlement.productKey} className="service-row">
              <div className="service-row-left">
                <div>
                  <p className="service-name" style={{ textTransform: "capitalize" }}>
                    {entitlement.productKey.replace(/_/g, " ")}
                  </p>
                  <p className="service-desc">Setup: {entitlement.setupState.replace(/_/g, " ")}</p>
                </div>
              </div>
              <div className="service-row-right">
                <span className={`pill pill-${entitlement.status === "active" ? "enabled" : entitlement.status}`}>
                  {entitlement.status.charAt(0).toUpperCase() + entitlement.status.slice(1)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
