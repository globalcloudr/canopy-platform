import { SignInForm } from "@/components/sign-in-form";
import { InviteAcceptanceHandler } from "@/components/invite-acceptance-handler";

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

const products = [
  { letter: "S", color: "#d97706", name: "Stories" },
  { letter: "P", color: "#0f1f3d", name: "PhotoVault" },
  { letter: "C", color: "#7c3aed", name: "Community" },
  { letter: "R", color: "#db2777", name: "Reach" },
];

export default async function SignInPage({ searchParams }: SignInPageProps) {
  const params = (await searchParams) ?? {};
  const errorMessage = getErrorMessage(params.error);

  return (
    <div className="grid grid-cols-[5fr_6fr] min-h-screen max-[840px]:grid-cols-1">

      {/* ── Brand panel ──────────────────────────────── */}
      <aside className="bg-navy px-12 py-12 flex flex-col justify-between max-[840px]:px-6 max-[840px]:py-8 max-[840px]:min-h-[260px]">
        <div className="flex flex-col justify-center flex-1 gap-14">

          {/* Logo */}
          <div className="flex items-center gap-2.5">
            <div className="grid place-items-center w-8 h-8 rounded-[7px] bg-white/15 text-white text-[0.95rem] font-extrabold tracking-[-0.02em]">
              C
            </div>
            <p className="m-0 text-white text-[1.05rem] font-bold tracking-[-0.01em]">Canopy</p>
          </div>

          {/* Headline */}
          <div>
            <p className="m-0 mb-4 text-[0.75rem] font-bold tracking-[0.1em] uppercase text-white/40">
              School growth platform
            </p>
            <h2 className="text-white font-extrabold tracking-[-0.03em] leading-[1.1] mb-0 text-[2.75rem]">
              Everything your school needs to communicate, grow, and get noticed.
            </h2>
          </div>

          {/* Product chips */}
          <div className="flex flex-col gap-5">
            {[
              { letter: "S", color: "#d97706", name: "Canopy Stories", desc: "Turn student successes into blog posts, social content, and video." },
              { letter: "P", color: "#0f1f3d", name: "PhotoVault", desc: "Organize approved photos, logos, and brand assets." },
              { letter: "C", color: "#7c3aed", name: "Canopy Community", desc: "Send newsletters and school-to-community communications." },
              { letter: "R", color: "#db2777", name: "Canopy Reach", desc: "Publish social posts to Facebook, Instagram, LinkedIn, and more." },
            ].map((p) => (
              <div key={p.name} className="flex items-center gap-4">
                <div
                  className="grid shrink-0 place-items-center w-12 h-12 rounded-[11px] text-white text-[1.05rem] font-extrabold tracking-[-0.01em]"
                  style={{ background: p.color }}
                  aria-hidden="true"
                >
                  {p.letter}
                </div>
                <div>
                  <p className="m-0 text-[1rem] font-semibold text-white/90 leading-none mb-1.5">{p.name}</p>
                  <p className="m-0 text-[0.9rem] text-white/55 leading-snug">{p.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <p className="text-[0.825rem] text-white/40 m-0 mt-10">
          New to Canopy?{" "}
          <a href="mailto:info@akkedisdigital.com" className="text-white/65 no-underline transition-colors hover:text-white">
            Contact us to get started →
          </a>
        </p>
      </aside>

      {/* ── Form panel ───────────────────────────────── */}
      <main className="bg-bg flex items-center justify-center px-11 py-12 max-[840px]:px-6 max-[840px]:py-10">
        <div className="w-full max-w-[380px]">
          <p className="eyebrow">Canopy Portal</p>
          <h1 className="text-[1.75rem] mb-[6px]">Sign in to your workspace.</h1>
          <p className="m-0 text-ink-2 text-[0.9rem]">
            Enter your credentials to access your school&apos;s tools.
          </p>
          {errorMessage && (
            <div className="mt-4 rounded-xl border border-[rgba(220,38,38,0.18)] bg-[rgba(220,38,38,0.06)] px-4 py-3 text-[0.875rem] text-[rgb(153,27,27)]">
              {errorMessage}
            </div>
          )}
          <InviteAcceptanceHandler />
          <SignInForm defaultEmail={params.email} />
        </div>
      </main>

    </div>
  );
}
