import Link from "next/link";

export default function MarketingHomePage() {
  return (
    <main className="shell">
      <section className="public-hero">
        <div className="public-copy">
          <p className="eyebrow">Canopy</p>
          <h1>One practical platform for the school tools your team uses every day.</h1>
          <p className="lede">
            Canopy helps schools manage publishing, communications, media, outreach, and visibility from one connected customer experience.
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
          <h2>One dashboard. Multiple connected products and services.</h2>
          <ul>
            <li>Sign in once and go straight to your dashboard</li>
            <li>See the products your organization has access to</li>
            <li>Take action quickly without jumping between disconnected tools</li>
          </ul>
        </div>
      </section>
    </main>
  );
}
