import { Badge, BodyText, Card, Eyebrow, LabelText, MetaText, PageTitle, SectionTitle } from "@canopy/ui";
import { redirect } from "next/navigation";
import { WorkspaceInvitationsPanel } from "@/components/workspace-invitations-panel";
import { canManageWorkspaceInvitations, resolvePortalSession } from "@/lib/platform";
import { getProductDefinition } from "@/lib/products";
import type { ProductState } from "@/lib/products";
import { listWorkspaceAdminInvitations } from "@/lib/provisioning";

type AccountPageProps = {
  searchParams?: Promise<{
    email?: string;
    workspace?: string;
  }>;
};

export default async function AccountPage({ searchParams }: AccountPageProps) {
  const params = (await searchParams) ?? {};
  const session = await resolvePortalSession(params);

  if (!session) {
    redirect("/sign-in");
  }

  const { activeWorkspace, user, memberships, entitlements } = session;
  const activeMembership = activeWorkspace ? memberships.find((m) => m.workspaceId === activeWorkspace.id) : null;
  const activeEntitlements = entitlements.filter((e) => e.status !== "paused");
  const canManageInvitations =
    session.isPlatformOperator || canManageWorkspaceInvitations(activeMembership?.role);

  if (session.isPlatformOperator && !activeWorkspace) {
    return (
      <div className="space-y-5 pb-10">
        <header>
          <PageTitle className="mb-2 text-slate-900">Account</PageTitle>
          <BodyText muted className="m-0 max-w-3xl text-[0.95rem]">
            Your portal identity, workspace visibility, and current platform access.
          </BodyText>
        </header>

        <Card className="overflow-hidden">
          <div className="relative h-36 border-b border-slate-200 bg-gradient-to-r from-slate-900 to-slate-700 sm:h-44">
            <div className="absolute inset-0 bg-slate-900/20" />
            <div className="absolute inset-x-0 bottom-0 p-4 text-white sm:p-5">
              <Eyebrow className="text-slate-100">Account Context</Eyebrow>
              <SectionTitle as="h2" className="mb-1 text-white">{user.displayName}</SectionTitle>
              <BodyText muted className="m-0 text-slate-200">{user.email}</BodyText>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2 px-4 py-3">
            <Badge>{session.platformRole?.replace(/_/g, " ") ?? "platform operator"}</Badge>
            <Badge>{memberships.length} workspaces visible</Badge>
            <Badge>Workspace context not selected</Badge>
          </div>
        </Card>

        <Card padding="md" className="sm:p-6">
          <SectionTitle as="h2" className="mb-1 text-slate-900">Platform Context</SectionTitle>
          <BodyText muted className="m-0 max-w-[58ch]">
            Choose a workspace from the header when you want to review workspace-specific products, services, or
            account details. Until then, this page stays at the platform layer.
          </BodyText>
        </Card>
      </div>
    );
  }

  const workspace = activeWorkspace!;
  const workspaceInvitations = canManageInvitations
    ? await listWorkspaceAdminInvitations([workspace.id])
    : [];

  return (
    <div className="space-y-5 pb-10">
      <header>
        <PageTitle className="mb-2 text-slate-900">Account</PageTitle>
        <BodyText muted className="m-0 max-w-3xl text-[0.95rem]">
          Workspace identity, role context, and product access for {workspace.displayName}.
        </BodyText>
      </header>

      <Card className="overflow-hidden">
        <div className="relative h-36 border-b border-slate-200 bg-gradient-to-r from-slate-900 to-slate-700 sm:h-44">
          <div className="absolute inset-0 bg-slate-900/20" />
          <div className="absolute inset-x-0 bottom-0 p-4 text-white sm:p-5">
            <Eyebrow className="text-slate-100">Workspace Account</Eyebrow>
            <SectionTitle as="h2" className="mb-1 text-white">{workspace.displayName}</SectionTitle>
            <BodyText muted className="m-0 text-slate-200">
              {user.displayName} • {user.email}
            </BodyText>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2 px-4 py-3">
          <Badge>{activeMembership?.role ?? "staff"} access</Badge>
          <Badge>{activeEntitlements.length} active entitlements</Badge>
          <Badge>{memberships.length} workspace{memberships.length === 1 ? "" : "s"} visible</Badge>
        </div>
      </Card>

      <Card padding="md" className="sm:p-6">
        <div className="mb-4">
          <Eyebrow>Workspace</Eyebrow>
          <SectionTitle as="h2" className="text-slate-900">Organization details</SectionTitle>
          <BodyText muted className="m-0 max-w-[54ch]">
            The current workspace context and your role inside it.
          </BodyText>
        </div>
        <div className="grid grid-cols-3 gap-4 max-[960px]:grid-cols-2 max-[620px]:grid-cols-1">
          {[
            { label: "Organization", value: workspace.displayName, sub: workspace.slug },
            { label: "Your role", value: activeMembership?.role ?? "staff", sub: `Signed in as ${user.displayName}` },
            { label: "Active products", value: String(activeEntitlements.length), sub: "Products and services enabled" },
          ].map((stat) => (
            <div key={stat.label} className="rounded-xl border border-slate-200 bg-slate-50/60 p-5">
              <MetaText className="mb-2 uppercase tracking-[0.08em]">{stat.label}</MetaText>
              <strong className="block text-2xl font-bold tracking-[-0.02em] text-ink mb-1">{stat.value}</strong>
              <BodyText muted className="text-[0.825rem]">{stat.sub}</BodyText>
            </div>
          ))}
        </div>
      </Card>

      {canManageInvitations ? (
        <WorkspaceInvitationsPanel workspace={workspace} initialInvitations={workspaceInvitations} />
      ) : (
        <Card padding="md" className="sm:p-6">
          <SectionTitle as="h2" className="mb-1 text-slate-900">Workspace access</SectionTitle>
          <BodyText muted className="m-0 max-w-[54ch]">
            Owners and admins manage workspace invitations in Canopy Portal. Your current role does not allow changing staff access for this workspace.
          </BodyText>
        </Card>
      )}

      <Card padding="md" className="sm:p-6">
        <div className="mb-4 flex justify-between gap-6 max-sm:flex-col sm:items-end">
          <div>
            <Eyebrow>Products &amp; Services</Eyebrow>
            <SectionTitle as="h2" className="text-slate-900">What&apos;s enabled for your workspace</SectionTitle>
            <BodyText muted className="m-0 max-w-[54ch]">
              Contact Canopy when you want to adjust products or service access.
            </BodyText>
          </div>
        </div>

        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
          {activeEntitlements.map((entitlement, i) => {
            const def = getProductDefinition(entitlement.productKey);
            return (
              <div
                key={entitlement.productKey}
                className={`flex items-center justify-between gap-4 px-5 py-3.5 ${i < activeEntitlements.length - 1 ? "border-b border-slate-200" : ""}`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="grid place-items-center w-8 h-8 rounded-[7px] text-white text-[0.8rem] font-extrabold shrink-0"
                    style={{ background: def?.iconColor ?? "#374151" }}
                  >
                    {(def?.displayName ?? entitlement.productKey)[0].toUpperCase()}
                  </div>
                  <div>
                    <LabelText className="m-0 text-[0.9rem]">
                      {def?.displayName ?? entitlement.productKey}
                    </LabelText>
                    <BodyText muted className="m-0 text-[0.8rem]">
                      Setup: {entitlement.setupState.replace(/_/g, " ")}
                    </BodyText>
                  </div>
                </div>
                <Badge variant={(entitlement.status === "active" ? "enabled" : entitlement.status) as ProductState}>
                  {entitlement.status.charAt(0).toUpperCase() + entitlement.status.slice(1)}
                </Badge>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}
