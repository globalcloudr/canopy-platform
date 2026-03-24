import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/cn";

const badgeVariants = cva(
  "inline-flex items-center gap-[5px] rounded-full py-[3px] px-2.5 text-[0.75rem] font-semibold tracking-[0.02em] whitespace-nowrap shrink-0 before:content-[''] before:w-1.5 before:h-1.5 before:rounded-full before:bg-current before:opacity-70",
  {
    variants: {
      variant: {
        enabled:     "bg-[rgba(5,150,105,0.08)] text-[#059669]",
        in_setup:    "bg-[rgba(217,119,6,0.08)] text-[#d97706]",
        pilot:       "bg-[rgba(124,58,237,0.08)] text-[#7c3aed]",
        paused:      "bg-[rgba(107,114,128,0.1)] text-[#6b7280]",
        not_enabled: "bg-[rgba(107,114,128,0.1)] text-[#6b7280]",
        service:     "bg-[rgba(37,99,235,0.08)] text-[#2563eb]",
      },
    },
    defaultVariants: {
      variant: "enabled",
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
