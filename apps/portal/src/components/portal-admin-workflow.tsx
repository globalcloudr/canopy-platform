import Link from "next/link";
import { AppSurface, BodyText, Eyebrow, SectionTitle } from "@canopy/ui";
import type { PortalWorkspace } from "@/lib/platform";

type PortalAdminWorkflowProps = {
  currentPage: "provisioning" | "school_ops" | "platform_users";
  activeWorkspace?: PortalWorkspace | null;
  workspaceCount: number;
  scopeLabel: string;
  scopeDetail: string;
  nextStep: string;
};

function navHref(path: string, activeWorkspace?: PortalWorkspace | null) {
  if (!activeWorkspace?.slug) {
    return path;
  }

  const params = new URLSearchParams({ workspace: activeWorkspace.slug });
  return `${path}?${params.toString()}`;
}

function navClass(active: boolean) {
  return active
    ? "inline-flex items-center rounded-full bg-[#172033] px-4 py-2 text-sm font-semibold text-white"
    : "inline-flex items-center rounded-full border border-[var(--app-surface-soft-border)] bg-white/75 px-4 py-2 text-sm font-semibold text-[#425166] transition hover:border-[#c7d5e8] hover:text-[#172033]";
}

export function PortalAdminWorkflow({
  currentPage,
  activeWorkspace = null,
  workspaceCount,
  scopeLabel,
  scopeDetail,
  nextStep,
}: PortalAdminWorkflowProps) {
  const selectedWorkspaceLabel = activeWorkspace
    ? `${activeWorkspace.displayName} (${activeWorkspace.slug})`
    : "Platform context only";

  return (
    <AppSurface variant="clear" padding="md" className="sm:p-6">
      <Eyebrow>Super Admin Workflow</Eyebrow>
      <SectionTitle as="h2" className="mb-2 text-slate-900">Connected operator flow</SectionTitle>
      <BodyText muted className="m-0 max-w-[60ch]">
        Portal is now the single operator home. Use these admin tools together instead of switching back to legacy PhotoVault platform pages.
      </BodyText>

      <div className="mt-5 flex flex-wrap gap-3">
        <Link href={navHref("/provisioning", activeWorkspace)} className={navClass(currentPage === "provisioning")}>
          Provisioning
        </Link>
        <Link href={navHref("/school-ops", activeWorkspace)} className={navClass(currentPage === "school_ops")}>
          School Ops
        </Link>
        <Link href={navHref("/platform-users", activeWorkspace)} className={navClass(currentPage === "platform_users")}>
          Platform Users
        </Link>
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-3">
        <div className="rounded-[22px] border border-[var(--app-surface-soft-border)] bg-white/72 p-4">
          <Eyebrow className="mb-2">Selected Workspace</Eyebrow>
          <p className="m-0 text-sm font-semibold text-ink">{selectedWorkspaceLabel}</p>
          <BodyText muted className="m-0 mt-1 text-[0.84rem]">
            {activeWorkspace ? "Actions on school-level pages affect this workspace context." : "Choose a workspace from the header when you want school-level context."}
          </BodyText>
        </div>
        <div className="rounded-[22px] border border-[var(--app-surface-soft-border)] bg-white/72 p-4">
          <Eyebrow className="mb-2">This Page Controls</Eyebrow>
          <p className="m-0 text-sm font-semibold text-ink">{scopeLabel}</p>
          <BodyText muted className="m-0 mt-1 text-[0.84rem]">{scopeDetail}</BodyText>
          <BodyText muted className="m-0 mt-2 text-[0.84rem]">{workspaceCount} workspaces available in your operator scope.</BodyText>
        </div>
        <div className="rounded-[22px] border border-[var(--app-surface-soft-border)] bg-white/72 p-4">
          <Eyebrow className="mb-2">Recommended Next Step</Eyebrow>
          <p className="m-0 text-sm font-semibold text-ink">{nextStep}</p>
        </div>
      </div>
    </AppSurface>
  );
}
