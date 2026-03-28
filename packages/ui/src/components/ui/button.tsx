import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/cn";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-medium transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--border-strong)] disabled:pointer-events-none disabled:opacity-60 [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        primary: "bg-[var(--primary)] text-[var(--primary-foreground)] shadow-[0_12px_24px_rgba(15,23,42,0.16)] hover:bg-[var(--navy-mid)]",
        blue: "bg-[var(--blue)] text-white shadow-[0_12px_24px_rgba(37,99,235,0.16)] hover:bg-[var(--blue-hover)]",
        secondary: "border border-[var(--border)] bg-[var(--secondary)] text-[var(--secondary-foreground)] shadow-[var(--shadow-control)] hover:border-[var(--border-strong)] hover:bg-[var(--surface-muted)]",
        subtle: "bg-[var(--surface-muted)] text-[var(--secondary-foreground)] hover:bg-[var(--background)]",
        ghost: "text-[var(--muted)] hover:bg-[var(--surface-muted)] hover:text-[var(--foreground)]",
        destructive: "border border-[color:color-mix(in_srgb,var(--destructive)_16%,white)] bg-[var(--destructive-surface)] text-[var(--destructive)] hover:bg-[color:color-mix(in_srgb,var(--destructive-surface)_80%,white)]",
        link: "h-auto rounded-none p-0 text-[var(--muted)] underline-offset-4 hover:text-[var(--foreground)] hover:underline",
      },
      size: {
        sm: "h-10 px-4",
        md: "h-11 px-[1.125rem]",
        lg:   "h-12 px-5 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "secondary",
      size: "md",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, type = "button", ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        type={asChild ? undefined : type}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
