import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/cn";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-medium transition-[transform,box-shadow,background-color,border-color,color,opacity] duration-150 ease-out focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--border-strong)] disabled:pointer-events-none disabled:opacity-60 enabled:cursor-pointer enabled:hover:-translate-y-px enabled:active:translate-y-0 enabled:active:scale-[0.985] [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        primary:
          "bg-[var(--primary)] text-[var(--primary-foreground)] visited:text-[var(--primary-foreground)] shadow-[0_12px_24px_rgba(15,23,42,0.16)] hover:bg-[var(--navy-mid)] hover:text-[var(--primary-foreground)] hover:shadow-[0_16px_30px_rgba(15,23,42,0.2)] active:shadow-[0_8px_18px_rgba(15,23,42,0.18)]",
        blue: "bg-[var(--blue)] text-white shadow-[0_12px_24px_rgba(37,99,235,0.16)] hover:bg-[var(--blue-hover)] hover:shadow-[0_16px_30px_rgba(37,99,235,0.22)] active:shadow-[0_8px_18px_rgba(37,99,235,0.2)]",
        secondary: "border border-[var(--border)] bg-[var(--secondary)] text-[var(--secondary-foreground)] shadow-[var(--shadow-control)] hover:border-[var(--border-strong)] hover:bg-[var(--surface-muted)] hover:shadow-[0_8px_18px_rgba(148,163,184,0.2)] active:bg-[color:color-mix(in_srgb,var(--surface-muted)_82%,var(--foreground)_6%)]",
        subtle: "bg-[var(--surface-muted)] text-[var(--secondary-foreground)] hover:bg-[var(--background)] hover:shadow-[0_8px_18px_rgba(148,163,184,0.14)] active:bg-[color:color-mix(in_srgb,var(--background)_88%,var(--foreground)_4%)]",
        ghost: "text-[var(--muted)] hover:bg-[var(--surface-muted)] hover:text-[var(--foreground)] active:bg-[color:color-mix(in_srgb,var(--surface-muted)_82%,var(--foreground)_6%)]",
        destructive: "border border-[color:color-mix(in_srgb,var(--destructive)_16%,white)] bg-[var(--destructive-surface)] text-[var(--destructive)] hover:bg-[color:color-mix(in_srgb,var(--destructive-surface)_80%,white)] hover:shadow-[0_10px_22px_rgba(185,28,28,0.12)] active:bg-[color:color-mix(in_srgb,var(--destructive-surface)_72%,white)]",
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
