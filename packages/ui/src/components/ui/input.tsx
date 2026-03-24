import * as React from "react";
import { cn } from "../../lib/cn";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "w-full px-3.5 py-2.5 border-[1.5px] border-[rgba(15,31,61,0.18)] rounded-lg bg-white text-[#0f1f3d] font-[inherit] text-[0.9375rem] outline-none transition-[border-color,box-shadow]",
          "placeholder:text-[#9ca3af]",
          "focus:border-[#2563eb] focus:shadow-[0_0_0_3px_rgba(37,99,235,0.08)]",
          "disabled:cursor-not-allowed disabled:opacity-60",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export { Input };
