import { redirect } from "next/navigation";
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
    redirect("/app");
  }

  const workspaces = session.memberships.map((membership) => membership.workspace);
  const ownerStatuses = await listWorkspaceOwnerStatuses(workspaces.map((workspace) => workspace.id));

  return (
    <SchoolOpsPanel
      workspaces={workspaces}
      ownerStatuses={ownerStatuses}
      activeWorkspaceId={session.activeWorkspace?.id ?? null}
    />
  );
}
