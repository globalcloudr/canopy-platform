import * as React from "react";
import { cn } from "../../lib/cn";

export interface MenuSurfaceProps extends React.HTMLAttributes<HTMLDivElement> {}

function MenuSurface({ className, ...props }: MenuSurfaceProps) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-xl border border-slate-200 bg-white shadow-md",
        className
      )}
      {...props}
    />
  );
}

export interface MenuHeaderProps extends React.HTMLAttributes<HTMLDivElement> {}

function MenuHeader({ className, ...props }: MenuHeaderProps) {
  return <div className={cn("flex items-start justify-between gap-3 border-b border-slate-200 px-4 py-3", className)} {...props} />;
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
        "relative flex cursor-default select-none items-center gap-2 rounded-md px-3 py-2 text-[0.875rem] text-slate-800 no-underline outline-none transition hover:bg-slate-100",
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
        "relative flex w-full cursor-default select-none items-center gap-2 rounded-md px-3 py-2 text-left text-[0.875rem] text-slate-800 outline-none transition hover:bg-slate-100 disabled:pointer-events-none disabled:opacity-50",
        className
      )}
      {...props}
    />
  );
}

export interface MenuSeparatorProps extends React.HTMLAttributes<HTMLDivElement> {}

function MenuSeparator({ className, ...props }: MenuSeparatorProps) {
  return <div className={cn("h-px bg-slate-200", className)} {...props} />;
}

export { MenuSurface, MenuHeader, MenuSection, MenuItem, MenuButton, MenuSeparator };
