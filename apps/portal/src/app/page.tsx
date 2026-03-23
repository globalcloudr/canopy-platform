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
      <header className="portal-header">
        <div className="portal-brand">
          <div className="brand-mark" aria-hidden="true">
            C
          </div>
          <div>
            <p className="brand-name">Canopy</p>
            <p className="brand-subtitle">School growth platform</p>
          </div>
        </div>

        <nav className="portal-nav" aria-label="Primary">
          <a href="#overview">Home</a>
          <a href="#products">Products</a>
          <a href="#account">Account</a>
        </nav>

        <div className="portal-actions">
          <label className="workspace-switcher">
            <span>Workspace</span>
            <select defaultValue="example-adult-school" name="workspace">
              <option value="example-adult-school">Example Adult School</option>
              <option value="north-valley-campus">North Valley Campus</option>
              <option value="bay-learning-center">Bay Learning Center</option>
            </select>
          </label>
          <button className="account-chip" type="button">
            SZ
          </button>
        </div>
      </header>

      <header className="hero" id="overview">
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

      <section className="section section-dashboard" id="account">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Workspace Snapshot</p>
            <h2>Example Adult School</h2>
          </div>
          <p className="section-copy">A lightweight portal home should help staff understand their account, enabled products, and what needs attention next.</p>
        </div>

        <div className="stats-grid">
          <article className="stat-card">
            <p className="stat-label">Active products</p>
            <strong>3</strong>
            <span>PhotoVault live, additional modules staged through the portal.</span>
          </article>
          <article className="stat-card">
            <p className="stat-label">Team members</p>
            <strong>14</strong>
            <span>Workspace roles and product access should resolve from one shared account model.</span>
          </article>
          <article className="stat-card">
            <p className="stat-label">Next action</p>
            <strong>Launch PhotoVault</strong>
            <span>Most schools should be able to open their primary product in one click.</span>
          </article>
        </div>
      </section>

      <section className="section" id="products">
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
