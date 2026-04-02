import { redirect } from "next/navigation";
import { PortalAdminWorkflow } from "@/components/portal-admin-workflow";
import { PortalPageHeader } from "@/components/portal-page-header";
import { ProvisioningForm } from "@/components/provisioning-form";
import { resolvePortalSession } from "@/lib/platform";
import { listWorkspaceAdminInvitations } from "@/lib/provisioning";

type ProvisioningPageProps = {
  searchParams?: Promise<{
    email?: string;
    workspace?: string;
  }>;
};

export default async function ProvisioningPage({ searchParams }: ProvisioningPageProps) {
  const params = (await searchParams) ?? {};
  const session = await resolvePortalSession(params);

  if (!session) {
    redirect("/sign-in");
  }

  if (!session.isPlatformOperator) {
    redirect("/app");
  }

  const workspaces = session.memberships.map((membership) => membership.workspace);
  const invitations = await listWorkspaceAdminInvitations(workspaces.map((workspace) => workspace.id));

  return (
    <div className="space-y-5 pb-10">
      <PortalPageHeader
        eyebrow="Admin"
        title="Workspace Provisioning"
        subtitle="Create or update a client workspace, assign the initial school admin, and manage product, service, and invite setup from one place."
      />
      <PortalAdminWorkflow
        currentPage="provisioning"
        activeWorkspace={session.activeWorkspace}
        workspaceCount={workspaces.length}
        scopeLabel="School-level setup"
        scopeDetail="Provisioning handles workspace creation plus product, service, and invite setup for the selected school."
        nextStep="Save workspace products and services first, then invite or assign the school admin in the separate admin step below."
      />
      <ProvisioningForm
        workspaces={workspaces}
        invitations={invitations}
        activeWorkspaceId={session.activeWorkspace?.id ?? null}
        canManageProductAccess={session.platformRole === "super_admin"}
        canManageInviteTemplate={session.platformRole === "super_admin"}
        currentUserEmail={session.user.email}
      />
    </div>
  );
}
