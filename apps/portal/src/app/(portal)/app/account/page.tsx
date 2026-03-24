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
    <>
      <header className="hero" id="account">
        <div className="hero-copy">
          <p className="eyebrow">Account</p>
          <h1>{activeWorkspace.displayName}</h1>
          <p className="lede">
            Workspace settings, team access, and your active Canopy products and services.
          </p>
        </div>
        <div className="hero-card">
          <p className="card-label">Signed in as</p>
          <h2>{user.displayName}</h2>
          <ul>
            <li>{user.email}</li>
            <li>{activeMembership?.role ?? "staff"} access</li>
            <li>{memberships.length} workspace{memberships.length === 1 ? "" : "s"}</li>
          </ul>
        </div>
      </header>

      <section className="section" id="workspace">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Workspace</p>
            <h2>Organization details</h2>
          </div>
          <p className="section-copy">
            Your organization profile and workspace settings.
          </p>
        </div>
        <div className="stats-grid">
          <article className="stat-card">
            <p className="stat-label">Organization</p>
            <strong>{activeWorkspace.displayName}</strong>
            <span>{activeWorkspace.slug}</span>
          </article>
          <article className="stat-card">
            <p className="stat-label">Your role</p>
            <strong>{activeMembership?.role ?? "staff"}</strong>
            <span>Workspace access level for {user.displayName}</span>
          </article>
          <article className="stat-card">
            <p className="stat-label">Active products</p>
            <strong>{activeEntitlements.length}</strong>
            <span>Products and services enabled for this workspace</span>
          </article>
        </div>
      </section>

      <section className="section" id="products">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Products &amp; Services</p>
            <h2>What&apos;s enabled for {activeWorkspace.displayName}</h2>
          </div>
          <p className="section-copy">
            Contact Canopy to add or change your product access.
          </p>
        </div>
        <div className="stats-grid">
          {activeEntitlements.map((entitlement) => (
            <article key={entitlement.productKey} className="stat-card">
              <p className="stat-label">{entitlement.productKey.replace(/_/g, " ")}</p>
              <strong>{entitlement.status}</strong>
              <span>Setup: {entitlement.setupState.replace(/_/g, " ")}</span>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
