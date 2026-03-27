import { SignInForm } from "@/components/sign-in-form";

type SignInPageProps = {
  searchParams?: Promise<{
    error?: string;
    email?: string;
  }>;
};

function getErrorMessage(error?: string) {
  if (error === "missing_credentials") {
    return "Enter both your email and password to sign in.";
  }
  if (error === "invalid_credentials") {
    return "That email and password combination was not recognized.";
  }
  return null;
}

export default async function SignInPage({ searchParams }: SignInPageProps) {
  const params = (await searchParams) ?? {};
  const errorMessage = getErrorMessage(params.error);

  return (
    <div className="grid grid-cols-[2fr_3fr] min-h-screen max-[840px]:grid-cols-1">

      {/* ── Brand panel ──────────────────────────────── */}
      <aside className="bg-navy px-11 py-12 flex flex-col justify-between max-[840px]:px-6 max-[840px]:py-8">
        <div className="flex flex-col gap-10">
          <div className="flex items-center gap-2.5">
            <div className="grid place-items-center w-8 h-8 rounded-[7px] bg-white/15 text-white text-[0.95rem] font-extrabold tracking-[-0.02em]">
              C
            </div>
            <p className="m-0 text-white text-[1.05rem] font-bold tracking-[-0.01em]">Canopy</p>
          </div>

          <div>
            <h2 className="text-white font-extrabold tracking-[-0.025em] leading-tight mb-6">
              Your school&apos;s platform.
            </h2>
            <ul className="flex flex-col gap-3 list-none p-0 m-0">
              {[
                "Manage assets, media, and brand resources",
                "Send newsletters and community communications",
                "Schedule social posts and track visibility",
                "One login for every tool your school uses",
              ].map((item) => (
                <li key={item} className="flex items-center gap-2.5 text-sm text-white/70">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <p className="text-[0.825rem] text-white/40 m-0">
          New to Canopy?{" "}
          <a href="/" className="text-white/65 no-underline transition-colors hover:text-white">
            Contact us to get started →
          </a>
        </p>
      </aside>

      {/* ── Form panel ───────────────────────────────── */}
      <main className="bg-bg flex items-center justify-center px-11 py-12 max-[840px]:px-6 max-[840px]:py-10">
        <div className="w-full max-w-[380px]">
          <p className="eyebrow">Canopy Portal</p>
          <h1 className="text-[1.75rem] mb-[6px]">Sign in to your workspace.</h1>
          <p className="m-0 text-muted text-[0.9rem]">
            Enter your credentials to access your organization&apos;s tools.
          </p>
          {errorMessage && (
            <div className="mt-4 rounded-xl border border-[rgba(220,38,38,0.18)] bg-[rgba(220,38,38,0.06)] px-4 py-3 text-[0.875rem] text-[rgb(153,27,27)]">
              {errorMessage}
            </div>
          )}
          <SignInForm defaultEmail={params.email} />
        </div>
      </main>

    </div>
  );
}
