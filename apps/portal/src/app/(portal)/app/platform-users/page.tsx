import { redirect } from "next/navigation";
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
      <PlatformUsersPanel
        auditWorkspaceId={session.activeWorkspace?.id ?? null}
        currentUserId={session.user.id}
      />
    </div>
  );
}
