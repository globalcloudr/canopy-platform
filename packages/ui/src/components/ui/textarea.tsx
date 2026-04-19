import * as React from "react";
import { cn } from "../../lib/cn";

export type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>;

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(({ className, ...props }, ref) => {
  return (
    <textarea
      ref={ref}
      className={cn(
        "min-h-28 w-full rounded-2xl border border-[var(--border)] bg-[var(--secondary)] px-4 py-3 text-sm leading-6 text-[var(--foreground)] shadow-[var(--shadow-control)] outline-none transition",
        "placeholder:text-[var(--muted-light)]",
        "focus:border-[var(--border-strong)] focus:ring-4 focus:ring-[var(--ring)]",
        "disabled:cursor-not-allowed disabled:bg-[var(--surface-muted)] disabled:text-[var(--muted)]",
        className
      )}
      {...props}
    />
  );
});
Textarea.displayName = "Textarea";

export { Textarea };
