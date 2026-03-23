import Link from "next/link";
import { SignInForm } from "@/components/sign-in-form";

export default function SignInPage() {
  return (
    <main className="shell shell-narrow">
      <section className="auth-card">
        <div className="auth-copy">
          <p className="eyebrow">Canopy Portal</p>
          <h1>Sign in to your workspace.</h1>
          <p className="lede">
            Access your enabled Canopy products, manage your workspace, and launch the tools your school uses every
            day.
          </p>
        </div>

        <SignInForm />

        <div className="auth-footer">
          <Link className="secondary-link" href="/">
            Back to Canopy
          </Link>
        </div>
      </section>
    </main>
  );
}
