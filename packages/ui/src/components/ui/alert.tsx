import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/cn";

const alertVariants = cva("rounded-2xl border px-4 py-3 shadow-sm", {
  variants: {
    variant: {
      info: "border-[var(--border)] bg-[var(--surface)] text-[var(--secondary-foreground)]",
      success: "border-[var(--app-pill-success-border)] bg-[var(--app-pill-success-bg)] text-[var(--app-pill-success-text)]",
      error: "border-[color:color-mix(in_srgb,var(--destructive)_16%,white)] bg-[var(--destructive-surface)] text-[var(--destructive)]",
      warning: "border-[color:color-mix(in_srgb,var(--warning)_18%,white)] bg-[color:color-mix(in_srgb,var(--warning)_10%,white)] text-[var(--warning)]",
    },
  },
  defaultVariants: {
    variant: "info",
  },
});

export interface AlertProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof alertVariants> {}

function Alert({ className, variant, ...props }: AlertProps) {
  return (
    <div role="alert" className={cn(alertVariants({ variant, className }))} {...props} />
  );
}

function AlertTitle({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return <h5 className={cn("text-sm font-semibold", className)} {...props} />;
}

function AlertDescription({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("text-sm leading-6", className)} {...props} />;
}

export { Alert, AlertDescription, AlertTitle };
