import Link from "next/link";

const allProducts = [
  {
    key: "photovault",
    name: "PhotoVault",
    desc: "Organize approved school photos, logos, and brand assets in one shared library.",
    color: "#0f1f3d",
  },
  {
    key: "community",
    name: "Community Canopy",
    desc: "Create and send recurring newsletters that keep your school community informed.",
    color: "#7c3aed",
  },
  {
    key: "reach",
    name: "Reach Canopy",
    desc: "Write, schedule, and publish social posts to Facebook, Instagram, LinkedIn, and more.",
    color: "#db2777",
  },
  {
    key: "stories",
    name: "Stories Canopy",
    desc: "Turn student successes into blog posts, social content, and short video — automatically.",
    color: "#d97706",
  },
  {
    key: "publish",
    name: "Publish Canopy",
    desc: "Give schools a digital home for class catalogs, brochures, and program guides.",
    color: "#0369a1",
  },
  {
    key: "create",
    name: "Create Canopy",
    desc: "Submit design requests, track revisions, and download finished files — all in one place.",
    color: "#ea580c",
  },
  {
    key: "web",
    name: "Canopy Web",
    desc: "Publish school websites and program pages that stay current and on-brand.",
    color: "#0d9488",
  },
  {
    key: "assist",
    name: "Assist Canopy",
    desc: "Give staff a smart assistant for drafting communications and answering everyday questions.",
    color: "#4f46e5",
  },
  {
    key: "insights",
    name: "Insights Canopy",
    desc: "Track campaign performance, social reach, and school visibility across every channel.",
    color: "#16a34a",
  },
];

export default function MarketingHomePage() {
  return (
    <div className="marketing-shell">

      {/* ── Dark hero band ───────────────────────────── */}
      <div className="marketing-hero-band">
        <div className="marketing-hero-inner">
          <nav className="marketing-nav">
            <div className="marketing-nav-brand">
              <div className="brand-mark" aria-hidden="true">C</div>
              <p className="brand-name">Canopy</p>
            </div>
            <div className="marketing-nav-links">
              <a href="#products">Products</a>
              <a href="#products">Services</a>
              <a href="#products">About</a>
              <Link className="btn-hero-primary" href="/sign-in">Sign in</Link>
            </div>
          </nav>

          <section className="marketing-hero">
            <p className="eyebrow">School growth platform</p>
            <h1>Everything your school needs to communicate, grow, and get noticed.</h1>
            <p className="lede">
              Canopy brings newsletters, social media, success stories, publications,
              and design into one connected platform — built for adult education schools.
            </p>
            <div className="marketing-hero-actions">
              <Link className="btn-hero-primary" href="/sign-in">Sign in to your workspace</Link>
              <Link className="btn-hero-outline" href="/app">View platform demo →</Link>
            </div>
          </section>
        </div>
      </div>

      {/* ── Product section ──────────────────────────── */}
      <div className="marketing-content">
        <section className="marketing-products" id="products">
          <p className="eyebrow">The platform</p>
          <h2>Nine tools. One login. One dashboard.</h2>
          <p className="section-copy" style={{ marginTop: "8px" }}>
            Everything is connected. Content you create in one product flows into the others.
          </p>

          <div className="marketing-product-grid">
            {allProducts.map((product) => (
              <div key={product.key} className="marketing-product-cell">
                <div className="product-icon" style={{ background: product.color }} aria-hidden="true">
                  {product.name[0]}
                </div>
                <h3>{product.name}</h3>
                <p>{product.desc}</p>
              </div>
            ))}
          </div>
        </section>
      </div>

    </div>
  );
}
