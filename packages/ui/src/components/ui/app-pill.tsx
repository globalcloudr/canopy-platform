import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/cn";

const appPillVariants = cva(
  "inline-flex items-center rounded-full border px-3 py-1.5 text-[12px] font-medium whitespace-nowrap shrink-0",
  {
    variants: {
      tone: {
        neutral: "border-[var(--app-pill-border)] bg-[var(--app-pill-bg)] text-[var(--app-pill-text)]",
        success: "border-[var(--app-pill-success-border)] bg-[var(--app-pill-success-bg)] text-[var(--app-pill-success-text)]",
      },
      size: {
        sm: "px-2.5 py-1 text-[11px]",
        md: "",
      },
    },
    defaultVariants: {
      tone: "neutral",
      size: "md",
    },
  }
);

export interface AppPillProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof appPillVariants> {}

export function AppPill({ className, tone, size, ...props }: AppPillProps) {
  return <span className={cn(appPillVariants({ tone, size, className }))} {...props} />;
}

export { appPillVariants };
