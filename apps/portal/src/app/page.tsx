const products = [
  {
    name: "PhotoVault by Canopy",
    category: "Asset Foundation",
    status: "Active",
    description: "Manage approved photos, brand assets, and share-ready media.",
  },
  {
    name: "Reach Canopy",
    category: "Outreach and Storytelling",
    status: "Planned",
    description: "Coordinate social scheduling, storytelling, and visibility workflows.",
  },
  {
    name: "Community Canopy",
    category: "Community Communication",
    status: "Planned",
    description: "Run recurring school-to-community newsletter and communication flows.",
  },
];

export default function HomePage() {
  return (
    <main className="shell">
      <header className="hero">
        <div className="hero-copy">
          <p className="eyebrow">Canopy Platform</p>
          <h1>One shared portal for school growth tools.</h1>
          <p className="lede">
            Canopy helps schools organize, publish, communicate, and grow through connected products built around a
            shared workspace and identity model.
          </p>
        </div>
        <div className="hero-card">
          <p className="card-label">Workspace</p>
          <h2>Example Adult School</h2>
          <ul>
            <li>3 enabled products</li>
            <li>1 active workspace</li>
            <li>Shared account and launch flow</li>
          </ul>
        </div>
      </header>

      <section className="section">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Portal MVP</p>
            <h2>Product launcher</h2>
          </div>
          <p className="section-copy">
            The first version of `usecanopy.school` should help a school sign in, resolve its workspace, and launch
            the right product with confidence.
          </p>
        </div>

        <div className="product-grid">
          {products.map((product) => (
            <article className="product-card" key={product.name}>
              <div className="product-top">
                <p className="product-category">{product.category}</p>
                <span className={`pill pill-${product.status.toLowerCase()}`}>{product.status}</span>
              </div>
              <h3>{product.name}</h3>
              <p>{product.description}</p>
              <button className="launch-button" type="button">
                {product.status === "Active" ? "Launch Product" : "View Plan"}
              </button>
            </article>
          ))}
        </div>
      </section>

      <section className="section section-alt">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Architecture</p>
            <h2>Platform core first</h2>
          </div>
        </div>

        <div className="principles">
          <article>
            <h3>Shared portal</h3>
            <p>One login, one workspace model, one place to access enabled products and services.</p>
          </article>
          <article>
            <h3>Modular products</h3>
            <p>Each product keeps its own workflows while inheriting platform identity and entitlement context.</p>
          </article>
          <article>
            <h3>Connected outcomes</h3>
            <p>Assets, branding, publishing, outreach, and insights can connect without becoming one brittle app.</p>
          </article>
        </div>
      </section>
    </main>
  );
}
