import * as React from "react";
import { cn } from "../../lib/cn";

export interface SegmentedToggleProps extends React.HTMLAttributes<HTMLDivElement> {}

function SegmentedToggle({ className, ...props }: SegmentedToggleProps) {
  return <div className={cn("inline-flex items-center gap-2 rounded-[22px] border border-[var(--border)] bg-[var(--surface)] p-2 shadow-[var(--shadow-control)]", className)} {...props} />;
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
          ? "bg-[var(--secondary)] text-[var(--foreground)]"
          : "border border-[var(--border)] bg-[var(--surface)] text-[var(--secondary-foreground)] shadow-[var(--shadow-control)] hover:bg-[var(--surface-muted)]",
        className
      )}
      {...props}
    />
  );
}

export { SegmentedToggle, SegmentedToggleItem };
