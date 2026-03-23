export function SignInForm() {
  return (
    <form className="sign-in-form">
      <div className="field">
        <label htmlFor="email">Email</label>
        <input id="email" name="email" type="email" placeholder="name@school.edu" />
      </div>

      <div className="field">
        <label htmlFor="password">Password</label>
        <input id="password" name="password" type="password" placeholder="Enter your password" />
      </div>

      <button className="launch-button" type="submit">
        Sign In
      </button>

      <a className="secondary-link" href="/password-reset">
        Forgot password?
      </a>
    </form>
  );
}
