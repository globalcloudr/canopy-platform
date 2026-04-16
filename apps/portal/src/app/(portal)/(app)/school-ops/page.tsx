import { redirect } from "next/navigation";
import { PortalAdminWorkflow } from "@/components/portal-admin-workflow";
import { PortalPageHeader } from "@/components/portal-page-header";
import { SchoolOpsPanel } from "@/components/school-ops-panel";
import { canManageSchools, resolvePortalSession } from "@/lib/platform";
import { listWorkspaceOwnerStatuses } from "@/lib/provisioning";

type SchoolOpsPageProps = {
  searchParams?: Promise<{
    workspace?: string;
  }>;
};

export default async function SchoolOpsPage({ searchParams }: SchoolOpsPageProps) {
  const params = (await searchParams) ?? {};
  const session = await resolvePortalSession(params);

  if (!session) {
    redirect("/sign-in");
  }

  if (!canManageSchools(session.platformRole)) {
    redirect("/");
  }

  const workspaces = session.memberships.map((membership) => membership.workspace);
  const ownerStatuses = await listWorkspaceOwnerStatuses(workspaces.map((workspace) => workspace.id));

  return (
    <div className="space-y-5 pb-10">
      <PortalPageHeader
        eyebrow="School Ops"
        title="Workspace Operations"
        subtitle="Review workspace ownership, jump into active client context, and handle ownership transfer from the same Portal workflow."
      />
      <PortalAdminWorkflow
        currentPage="school_ops"
        activeWorkspace={session.activeWorkspace}
        workspaceCount={workspaces.length}
        scopeLabel="School ownership and operator shortcuts"
        scopeDetail="School Ops is where you review ownership health, open live client context, and handle ownership transfer when a school needs intervention."
        nextStep="Start with schools that need owner attention first, then use Provisioning when you need to change products, services, or admin invite state."
      />
      <SchoolOpsPanel
        workspaces={workspaces}
        ownerStatuses={ownerStatuses}
        activeWorkspaceId={session.activeWorkspace?.id ?? null}
      />
    </div>
  );
}
