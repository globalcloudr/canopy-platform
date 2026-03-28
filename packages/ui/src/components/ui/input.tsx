import * as React from "react";
import { cn } from "../../lib/cn";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = "text", ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-12 w-full rounded-xl border border-[var(--border)] bg-[var(--secondary)] px-4 text-base text-[var(--foreground)] shadow-[var(--shadow-control)] outline-none transition",
          "placeholder:text-[var(--muted-light)]",
          "focus:border-[var(--border-strong)] focus:ring-4 focus:ring-[var(--ring)]",
          "disabled:cursor-not-allowed disabled:bg-[var(--surface-muted)] disabled:text-[var(--muted)]",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export { Input };
