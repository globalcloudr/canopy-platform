import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/cn";

const appSurfaceVariants = cva(
  "rounded-[28px] border border-[var(--app-surface-border)] text-[var(--foreground)] shadow-none",
  {
    variants: {
      variant: {
        clear: "bg-transparent",
        fill: "bg-[var(--app-surface-fill)]",
        nested: "border-[var(--app-surface-soft-border)] bg-[var(--app-surface-fill)]",
      },
      padding: {
        none: "",
        sm: "p-5",
        md: "p-6",
        lg: "p-8",
      },
    },
    defaultVariants: {
      variant: "clear",
      padding: "none",
    },
  }
);

export interface AppSurfaceProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof appSurfaceVariants> {}

export function AppSurface({ className, variant, padding, ...props }: AppSurfaceProps) {
  return <div className={cn(appSurfaceVariants({ variant, padding, className }))} {...props} />;
}

export { appSurfaceVariants };
