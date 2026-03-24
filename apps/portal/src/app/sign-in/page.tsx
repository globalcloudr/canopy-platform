import { SignInForm } from "@/components/sign-in-form";

export default function SignInPage() {
  return (
    <div className="signin-shell">
      <aside className="signin-brand">
        <div className="signin-brand-top">
          <div className="signin-brand-mark">
            <div className="brand-mark" aria-hidden="true">C</div>
            <p className="brand-name">Canopy</p>
          </div>
          <div>
            <h2>Your school&apos;s platform.</h2>
            <ul className="signin-brand-features">
              <li>Manage assets, media, and brand resources</li>
              <li>Send newsletters and community communications</li>
              <li>Schedule social posts and track visibility</li>
              <li>One login for every tool your school uses</li>
            </ul>
          </div>
        </div>
        <p className="signin-brand-footer">
          New to Canopy?{" "}
          <a href="/">Contact us to get started →</a>
        </p>
      </aside>

      <main className="signin-form-panel">
        <div className="signin-form-inner">
          <p className="eyebrow">Canopy Portal</p>
          <h1 style={{ fontSize: "1.75rem", marginBottom: "6px" }}>Sign in to your workspace.</h1>
          <p style={{ color: "var(--muted)", fontSize: "0.9rem", marginBottom: "0" }}>
            Enter your credentials to access your organization&apos;s tools.
          </p>
          <SignInForm />
        </div>
      </main>
    </div>
  );
}
