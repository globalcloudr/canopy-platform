import { redirect } from "next/navigation";
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

  return <ProvisioningForm workspaces={workspaces} invitations={invitations} />;
}
