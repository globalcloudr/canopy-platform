import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/cn";

const alertVariants = cva("rounded-2xl border px-4 py-3 shadow-sm", {
  variants: {
    variant: {
      info: "border-slate-200 bg-white text-slate-700",
      success: "border-emerald-200 bg-emerald-50 text-emerald-800",
      error: "border-rose-200 bg-rose-50 text-rose-800",
      warning: "border-amber-200 bg-amber-50 text-amber-800",
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
