import * as React from "react";
import { cn } from "../../lib/cn";

export interface MenuSurfaceProps extends React.HTMLAttributes<HTMLDivElement> {}

function MenuSurface({ className, ...props }: MenuSurfaceProps) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-[var(--radius-soft)] border border-[var(--border)] bg-[var(--surface)] shadow-[var(--shadow-popover)]",
        className
      )}
      {...props}
    />
  );
}

export interface MenuHeaderProps extends React.HTMLAttributes<HTMLDivElement> {}

function MenuHeader({ className, ...props }: MenuHeaderProps) {
  return <div className={cn("flex items-start justify-between gap-3 border-b border-[var(--border)] px-4 py-3", className)} {...props} />;
}

export interface MenuSectionProps extends React.HTMLAttributes<HTMLDivElement> {}

function MenuSection({ className, ...props }: MenuSectionProps) {
  return <div className={cn("p-2", className)} {...props} />;
}

export interface MenuItemProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  asChild?: boolean;
}

function MenuItem({ className, ...props }: MenuItemProps) {
  return (
    <a
      className={cn(
        "relative flex cursor-default select-none items-center gap-2 rounded-[var(--radius-tight)] px-3 py-2 text-[0.875rem] text-[var(--foreground)] no-underline outline-none transition",
        "hover:bg-[var(--surface-muted)]",
        className
      )}
      {...props}
    />
  );
}

export interface MenuButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

function MenuButton({ className, ...props }: MenuButtonProps) {
  return (
    <button
      className={cn(
        "relative flex w-full cursor-default select-none items-center gap-2 rounded-[var(--radius-tight)] px-3 py-2 text-left text-[0.875rem] text-[var(--foreground)] outline-none transition",
        "hover:bg-[var(--surface-muted)] disabled:pointer-events-none disabled:opacity-50",
        className
      )}
      {...props}
    />
  );
}

export interface MenuSeparatorProps extends React.HTMLAttributes<HTMLDivElement> {}

function MenuSeparator({ className, ...props }: MenuSeparatorProps) {
  return <div className={cn("h-px bg-[var(--border)]", className)} {...props} />;
}

export { MenuSurface, MenuHeader, MenuSection, MenuItem, MenuButton, MenuSeparator };
