import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/cn";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-3 py-1 text-sm font-medium whitespace-nowrap shrink-0",
  {
    variants: {
      variant: {
        neutral: "border-slate-200 bg-slate-50 text-slate-700",
        sky: "border-sky-200 bg-sky-50 text-sky-700",
        emerald: "border-emerald-200 bg-emerald-50 text-emerald-700",
        outline: "border-slate-300 bg-white text-slate-700",
        enabled: "border-emerald-200 bg-emerald-50 text-emerald-700",
        in_setup: "border-amber-200 bg-amber-50 text-amber-700",
        pilot: "border-violet-200 bg-violet-50 text-violet-700",
        paused: "border-slate-200 bg-slate-50 text-slate-700",
        not_enabled: "border-slate-200 bg-slate-50 text-slate-700",
        service: "border-slate-200 bg-slate-50 text-slate-700",
      },
    },
    defaultVariants: {
      variant: "neutral",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ variant, className }))} {...props} />
  );
}

export { Badge, badgeVariants };
