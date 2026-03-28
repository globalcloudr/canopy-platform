import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/cn";

const iconButtonVariants = cva(
  "inline-flex items-center justify-center rounded-full transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-300 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        secondary: "border border-slate-300 bg-white/95 text-slate-700 shadow-sm hover:bg-white hover:text-slate-900",
        muted: "border border-[var(--border)] bg-[var(--surface-muted)] text-[var(--foreground)] hover:bg-[var(--surface)]",
      },
      size: {
        sm: "h-8 w-8",
        md: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "secondary",
      size: "sm",
    },
  }
);

export interface IconButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof iconButtonVariants> {}

function IconButton({ className, variant, size, type = "button", ...props }: IconButtonProps) {
  return <button type={type} className={cn(iconButtonVariants({ variant, size, className }))} {...props} />;
}

export { IconButton, iconButtonVariants };
