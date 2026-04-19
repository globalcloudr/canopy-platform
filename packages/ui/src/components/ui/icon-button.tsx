import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/cn";

const iconButtonVariants = cva(
  "inline-flex items-center justify-center rounded-full transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--border-strong)] disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        secondary: "border border-[var(--border)] bg-[var(--surface)] text-[var(--secondary-foreground)] shadow-[var(--shadow-control)] hover:bg-[var(--surface-muted)] hover:text-[var(--foreground)]",
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
