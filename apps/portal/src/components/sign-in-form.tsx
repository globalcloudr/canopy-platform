export function SignInForm() {
  return (
    <form action="/app" className="sign-in-form" method="GET">
      <div className="field">
        <label htmlFor="email">Email address</label>
        <input
          defaultValue="sarah.zylstra@school.edu"
          id="email"
          name="email"
          type="email"
          placeholder="you@school.edu"
          autoComplete="email"
        />
      </div>

      <div className="field">
        <label htmlFor="password">Password</label>
        <input
          id="password"
          name="password"
          type="password"
          placeholder="Enter your password"
          autoComplete="current-password"
        />
      </div>

      <button className="btn-primary" type="submit">
        Sign in
      </button>

      <div className="signin-links">
        <p className="form-note">Mock sign-in — any email will work.</p>
        <a className="ghost-link" href="/password-reset">
          Forgot password?
        </a>
      </div>
    </form>
  );
}
