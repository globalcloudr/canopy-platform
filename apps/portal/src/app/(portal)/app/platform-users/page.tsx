import { redirect } from "next/navigation";
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
    <PlatformUsersPanel
      auditWorkspaceId={session.activeWorkspace?.id ?? null}
      currentUserId={session.user.id}
    />
  );
}
