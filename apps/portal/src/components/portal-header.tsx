export function PortalHeader() {
  return (
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
  );
}
