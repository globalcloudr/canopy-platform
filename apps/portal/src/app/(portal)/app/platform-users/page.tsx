import { redirect } from "next/navigation";
import { PortalAdminWorkflow } from "@/components/portal-admin-workflow";
import { PortalPageHeader } from "@/components/portal-page-header";
import { PlatformUsersPanel } from "@/components/platform-users-panel";
import { canManagePlatformUsers, resolvePortalSession } from "@/lib/platform";

type PlatformUsersPageProps = {
  searchParams?: Promise<{
    workspace?: string;
  }>;
};

export default async function PlatformUsersPage({ searchParams }: PlatformUsersPageProps) {
  const params = (await searchParams) ?? {};
  const session = await resolvePortalSession(params);

  if (!session) {
    redirect("/sign-in");
  }

  if (!canManagePlatformUsers(session.platformRole)) {
    redirect("/app");
  }

  return (
    <div className="space-y-5 pb-10">
      <PortalPageHeader
        eyebrow="Platform Users"
        title="Internal Team Access"
        subtitle="Invite and manage internal Portal access for Super Admin and Platform Staff from the same admin system as the rest of Canopy."
      />
      <PortalAdminWorkflow
        currentPage="platform_users"
        activeWorkspace={session.activeWorkspace}
        workspaceCount={session.memberships.length}
        scopeLabel="Platform-wide staff access"
        scopeDetail="Platform Users controls internal Akkedis Digital access. It does not change school admins, school memberships, or school-level product access."
        nextStep="Use this page only for internal team roles. Switch back to Provisioning or School Ops when the task is about a specific school."
      />
      <PlatformUsersPanel
        auditWorkspaceId={session.activeWorkspace?.id ?? null}
        currentUserId={session.user.id}
      />
    </div>
  );
}
