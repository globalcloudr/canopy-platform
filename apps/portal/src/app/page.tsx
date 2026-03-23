import Link from "next/link";

export default function MarketingHomePage() {
  return (
    <main className="shell">
      <section className="public-hero">
        <div className="public-copy">
          <p className="eyebrow">Canopy</p>
          <h1>Connected school growth tools built on one shared platform.</h1>
          <p className="lede">
            Canopy helps schools organize assets, publish clearly, communicate consistently, and grow visibility across
            channels.
          </p>
          <div className="public-actions">
            <Link className="launch-button" href="/sign-in">
              Sign In
            </Link>
            <Link className="secondary-link" href="/app">
              View Portal Mock
            </Link>
          </div>
        </div>

        <div className="public-panel">
          <p className="card-label">Platform scope</p>
          <h2>One portal. Multiple connected products.</h2>
          <ul>
            <li>Asset foundation through PhotoVault</li>
            <li>Workspace-aware product access</li>
            <li>Shared account, branding, and launch logic</li>
          </ul>
        </div>
      </section>
    </main>
  );
}
