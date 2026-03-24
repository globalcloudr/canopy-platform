import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/cn";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0f1f3d] disabled:pointer-events-none disabled:opacity-60 [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        primary:     "bg-[#0f1f3d] text-white shadow-sm hover:bg-[#1a3260]",
        blue:        "bg-[#2563eb] text-white shadow-sm hover:bg-[#1d4ed8]",
        secondary:   "border border-[rgba(15,31,61,0.18)] bg-white text-[#0f1f3d] shadow-sm hover:bg-[#f0f4f8]",
        ghost:       "text-[#374151] hover:bg-[rgba(15,31,61,0.05)] hover:text-[#0f1f3d]",
        destructive: "border border-red-200 bg-red-50 text-red-700 hover:bg-red-100",
        link:        "h-auto rounded-none p-0 text-[#2563eb] underline-offset-4 hover:underline",
      },
      size: {
        sm:   "h-9 px-3 text-xs",
        md:   "h-10 px-4",
        lg:   "h-11 px-5 text-base",
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
