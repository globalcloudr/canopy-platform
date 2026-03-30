import { Button, Input } from "@canopy/ui";
import Link from "next/link";

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
          defaultValue={defaultEmail}
          id="email"
          name="email"
          type="email"
          placeholder="you@school.edu"
          autoComplete="email"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between">
          <label htmlFor="password" className="text-sm font-medium text-ink-2">
            Password
          </label>
          <Link
            href="/password-reset"
            className="text-[0.8rem] font-medium text-muted no-underline transition-colors hover:text-ink"
          >
            Forgot password?
          </Link>
        </div>
        <Input
          id="password"
          name="password"
          type="password"
          placeholder="Enter your password"
          autoComplete="current-password"
        />
      </div>

      <Button
        type="submit"
        variant="primary"
        size="lg"
        className="mt-1 w-full justify-center"
      >
        Sign in
      </Button>

      <p className="text-[0.825rem] text-muted leading-relaxed m-0 text-center">
        Your Canopy account works across all products.
      </p>
    </form>
  );
}
