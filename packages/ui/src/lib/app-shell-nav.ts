import { cn } from "./cn";

export function sidebarNavItemClass(active: boolean) {
  return cn(
    "flex items-center gap-2.5 rounded-2xl px-3.5 py-3 font-medium text-[15px] tracking-[-0.01em] transition-colors duration-150 ease-out",
    active
      ? "bg-[var(--surface-muted)] text-[var(--foreground)] shadow-[0_10px_24px_rgba(35,74,144,0.08)]"
      : "text-[var(--text-muted)] hover:bg-[var(--surface-muted)] hover:text-[var(--foreground)]"
  );
}

export function sidebarSubnavItemClass() {
  return "ml-[30px] flex items-center rounded-[var(--radius-tight)] px-3 py-2 text-[13px] font-medium tracking-[-0.01em] text-[var(--text-muted)] transition-colors duration-150 ease-out hover:bg-[var(--surface-muted)] hover:text-[var(--foreground)]";
}
