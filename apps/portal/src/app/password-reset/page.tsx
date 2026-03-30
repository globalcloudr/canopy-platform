type PasswordResetPageProps = {
  searchParams?: Promise<{ sent?: string; error?: string }>;
};

export default async function PasswordResetPage({ searchParams }: PasswordResetPageProps) {
  const params = (await searchParams) ?? {};
  const sent = params.sent === "1";
  const error = params.error;

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center px-4">
      <div className="w-full max-w-[380px]">

        {/* Logo */}
        <div className="flex items-center gap-2.5 mb-10">
          <div className="grid place-items-center w-8 h-8 rounded-[7px] bg-navy text-white text-[0.95rem] font-extrabold tracking-[-0.02em]">
            C
          </div>
          <p className="m-0 text-ink text-[1.05rem] font-bold tracking-[-0.01em]">Canopy</p>
        </div>

        {sent ? (
          /* ── Success state ── */
          <div>
            <div className="grid place-items-center w-12 h-12 rounded-full bg-[#dcfce7] mb-5">
              <svg viewBox="0 0 20 20" fill="none" className="w-5 h-5" aria-hidden="true">
                <path d="M4 10l4 4 8-8" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <h1 className="text-[1.5rem] mb-2">Check your email</h1>
            <p className="text-muted text-[0.9rem] leading-relaxed mb-8">
              If an account exists for that email address, we&apos;ve sent a password reset link. It may take a minute to arrive.
            </p>
            <a
              href="/sign-in"
              className="text-sm font-medium text-blue no-underline hover:underline"
            >
              ← Back to sign in
            </a>
          </div>
        ) : (
          /* ── Request form ── */
          <div>
            <h1 className="text-[1.5rem] mb-2">Reset your password</h1>
            <p className="text-muted text-[0.9rem] leading-relaxed mb-6">
              Enter your email address and we&apos;ll send you a link to reset your password.
            </p>

            {error && (
              <div className="mb-4 rounded-xl border border-[rgba(220,38,38,0.18)] bg-[rgba(220,38,38,0.06)] px-4 py-3 text-[0.875rem] text-[rgb(153,27,27)]">
                Something went wrong. Please try again.
              </div>
            )}

            <form action="/auth/password-reset" method="POST" className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label htmlFor="email" className="text-sm font-medium text-ink-2">
                  Email address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="you@school.edu"
                  autoComplete="email"
                  required
                  className="h-11 w-full rounded-[var(--radius-control)] border border-[var(--border)] bg-white px-3.5 text-sm text-ink outline-none transition-[border-color,box-shadow] placeholder:text-muted-foreground focus:border-blue focus:ring-2 focus:ring-[var(--ring)]"
                />
              </div>

              <button
                type="submit"
                className="h-11 w-full rounded-[var(--radius-control)] bg-navy text-white text-sm font-semibold tracking-[-0.01em] transition-colors hover:bg-navy-mid mt-1"
              >
                Send reset link
              </button>
            </form>

            <p className="mt-5 text-center text-[0.825rem] text-muted">
              Remember your password?{" "}
              <a href="/sign-in" className="font-medium text-ink no-underline hover:underline">
                Sign in
              </a>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
