import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/cn";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-medium transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-400 disabled:pointer-events-none disabled:opacity-60 [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        primary: "bg-slate-950 text-white shadow-[0_12px_24px_rgba(15,23,42,0.16)] hover:bg-slate-800",
        blue: "bg-[#2563eb] text-white shadow-[0_12px_24px_rgba(37,99,235,0.16)] hover:bg-[#1d4ed8]",
        secondary: "border border-slate-200 bg-white text-slate-800 shadow-[0_1px_2px_rgba(148,163,184,0.18),0_1px_1px_rgba(15,23,42,0.04)] hover:border-slate-300 hover:bg-slate-50",
        subtle: "bg-slate-100/85 text-slate-800 hover:bg-slate-200/90",
        ghost: "text-slate-700 hover:bg-slate-100 hover:text-slate-950",
        destructive: "border border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100",
        link: "h-auto rounded-none p-0 text-slate-700 underline-offset-4 hover:text-slate-950 hover:underline",
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
