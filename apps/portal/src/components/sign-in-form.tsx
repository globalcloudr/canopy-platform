import { Button, Input } from "@canopy/ui";

type SignInFormProps = {
  defaultEmail?: string;
};

export function SignInForm({ defaultEmail }: SignInFormProps) {
  return (
    <form action="/auth/sign-in" className="flex flex-col gap-4 mt-6" method="POST">
      <div className="flex flex-col gap-1.5">
        <label htmlFor="email" className="text-sm font-medium text-ink-2">
          Email address
        </label>
        <Input
          defaultValue={defaultEmail ?? "sarah.zylstra@school.edu"}
          id="email"
          name="email"
          type="email"
          placeholder="you@school.edu"
          autoComplete="email"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="password" className="text-sm font-medium text-ink-2">
          Password
        </label>
        <Input
          id="password"
          name="password"
          type="password"
          placeholder="Enter your password"
          autoComplete="current-password"
        />
      </div>

      <Button variant="primary" size="lg" className="w-full justify-center mt-1">
        Sign in
      </Button>

      <div className="flex items-center justify-between mt-1">
        <p className="text-[0.825rem] text-muted leading-relaxed m-0">Sign in with your shared Canopy and PhotoVault account.</p>
        <a className="text-sm font-medium text-muted no-underline transition-colors hover:text-ink" href="/password-reset">
          Forgot password?
        </a>
      </div>
    </form>
  );
}
