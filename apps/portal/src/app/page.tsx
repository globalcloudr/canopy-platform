import Link from "next/link";

const featuredProducts = [
  {
    key: "photovault",
    name: "PhotoVault",
    desc: "Manage approved school photos, brand assets, and media in one organized library.",
    color: "#0f1f3d",
  },
  {
    key: "community",
    name: "Community Canopy",
    desc: "Build and send recurring newsletters that keep your school community informed.",
    color: "#7c3aed",
  },
  {
    key: "reach",
    name: "Reach Canopy",
    desc: "Schedule social posts, coordinate storytelling, and track your school's visibility.",
    color: "#db2777",
  },
  {
    key: "web",
    name: "Canopy Web",
    desc: "Publish school websites and program pages that stay current and on-brand.",
    color: "#0d9488",
  },
  {
    key: "publish",
    name: "Publish Canopy",
    desc: "Manage digital publications, class catalogs, and embedded content for your site.",
    color: "#0369a1",
  },
  {
    key: "insights",
    name: "Insights Canopy",
    desc: "Track campaign activity, channel performance, and school visibility over time.",
    color: "#16a34a",
  },
];

export default function MarketingHomePage() {
  return (
    <div className="marketing-shell">
      <nav className="marketing-nav">
        <div className="marketing-nav-brand">
          <div className="brand-mark" aria-hidden="true">C</div>
          <p className="brand-name">Canopy</p>
        </div>
        <div className="marketing-nav-links">
          <a href="#products">Products</a>
          <a href="#products">Services</a>
          <a href="#products">About</a>
          <Link className="btn-primary" href="/sign-in">Sign in</Link>
        </div>
      </nav>

      <section className="marketing-hero">
        <p className="eyebrow">School growth platform</p>
        <h1>The connected platform built for school communications.</h1>
        <p className="lede">
          Canopy brings together publishing, newsletters, social, media management,
          and visibility into one connected experience for your school team.
        </p>
        <div className="marketing-hero-actions">
          <Link className="btn-primary" href="/sign-in">Sign in to your workspace</Link>
          <Link className="btn-outline" href="/app">View platform demo →</Link>
        </div>
      </section>

      <div className="marketing-divider" />

      <section className="marketing-products" id="products">
        <p className="eyebrow">Platform</p>
        <h2>Everything your school needs, connected in one place.</h2>
        <p className="section-copy" style={{ marginTop: "8px" }}>
          Six integrated products. One login. One dashboard. No disconnected tools.
        </p>

        <div className="marketing-product-grid">
          {featuredProducts.map((product) => (
            <div key={product.key} className="marketing-product-cell">
              <div className="product-icon" style={{ background: product.color }}>
                {product.name[0]}
              </div>
              <h3>{product.name}</h3>
              <p>{product.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
