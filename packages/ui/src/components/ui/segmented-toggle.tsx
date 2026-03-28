import * as React from "react";
import { cn } from "../../lib/cn";

export interface SegmentedToggleProps extends React.HTMLAttributes<HTMLDivElement> {}

function SegmentedToggle({ className, ...props }: SegmentedToggleProps) {
  return <div className={cn("inline-flex items-center gap-2 rounded-[22px] bg-white/90 p-2 shadow-sm", className)} {...props} />;
}

export interface SegmentedToggleItemProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  active?: boolean;
}

function SegmentedToggleItem({ className, active = false, type = "button", ...props }: SegmentedToggleItemProps) {
  return (
    <button
      type={type}
      className={cn(
        "inline-flex h-10 items-center justify-center gap-1.5 rounded-xl px-4 text-sm font-medium transition",
        active
          ? "bg-slate-100 text-slate-800"
          : "border border-slate-200 bg-white text-slate-800 shadow-[0_1px_2px_rgba(148,163,184,0.18),0_1px_1px_rgba(15,23,42,0.04)] hover:bg-slate-50",
        className
      )}
      {...props}
    />
  );
}

export { SegmentedToggle, SegmentedToggleItem };
