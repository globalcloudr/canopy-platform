export function SignInForm() {
  return (
    <form action="/app" className="sign-in-form" method="GET">
      <div className="field">
        <label htmlFor="email">Email</label>
        <input defaultValue="sarah.zylstra@school.edu" id="email" name="email" type="email" placeholder="name@school.edu" />
      </div>

      <div className="field">
        <label htmlFor="password">Password</label>
        <input id="password" name="password" type="password" placeholder="Enter your password" />
      </div>

      <button className="launch-button" type="submit">
        Sign In
      </button>

      <p className="form-note">This is a mock sign-in flow. In the real product, users would sign in and land on their dashboard automatically.</p>

      <a className="secondary-link" href="/password-reset">
        Forgot password?
      </a>
    </form>
  );
}
