import { AppPill, AppSurface, BodyText, Eyebrow, LabelText, MetaText, SectionTitle } from "@canopy/ui";
import { redirect } from "next/navigation";
import { PortalPageHeader } from "@/components/portal-page-header";
import { WorkspaceInvitationsPanel } from "@/components/workspace-invitations-panel";
import { canManageWorkspaceInvitations, resolvePortalSession } from "@/lib/platform";
import { getProductDefinition } from "@/lib/products";
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
        <PortalPageHeader
          eyebrow="Platform Account"
          title="Account"
          subtitle="Your portal identity, workspace visibility, and current platform access."
          meta={
            <>
              <AppPill>{session.platformRole?.replace(/_/g, " ") ?? "platform operator"}</AppPill>
              <AppPill>{memberships.length} workspaces visible</AppPill>
              <AppPill>Workspace context not selected</AppPill>
            </>
          }
        />

        <AppSurface variant="clear" padding="md" className="sm:p-6">
          <SectionTitle as="h2" className="mb-1 text-slate-900">Platform Context</SectionTitle>
          <BodyText muted className="m-0 max-w-[58ch]">
            Choose a workspace from the header when you want to review workspace-specific products, services, or
            account details. Until then, this page stays at the platform layer.
          </BodyText>
        </AppSurface>
      </div>
    );
  }

  const workspace = activeWorkspace!;
  const workspaceInvitations = canManageInvitations
    ? await listWorkspaceAdminInvitations([workspace.id])
    : [];

  return (
    <div className="space-y-5 pb-10">
      <PortalPageHeader
        eyebrow="Workspace Account"
        title="Account"
        subtitle={`Workspace identity, role context, and product access for ${workspace.displayName}.`}
        meta={
          <>
            <AppPill>{activeMembership?.role ?? "staff"} access</AppPill>
            <AppPill>{activeEntitlements.length} active entitlements</AppPill>
            <AppPill>{memberships.length} workspace{memberships.length === 1 ? "" : "s"} visible</AppPill>
          </>
        }
      />

      <AppSurface variant="clear" padding="md" className="sm:p-6">
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
            <div key={stat.label} className="rounded-[22px] border border-[var(--app-surface-soft-border)] bg-white/54 p-5">
              <MetaText className="mb-2 uppercase tracking-[0.08em]">{stat.label}</MetaText>
              <strong className="block text-2xl font-bold tracking-[-0.02em] text-ink mb-1">{stat.value}</strong>
              <BodyText muted className="text-[0.825rem]">{stat.sub}</BodyText>
            </div>
          ))}
        </div>
      </AppSurface>

      {canManageInvitations ? (
        <WorkspaceInvitationsPanel workspace={workspace} initialInvitations={workspaceInvitations} />
      ) : (
        <AppSurface variant="clear" padding="md" className="sm:p-6">
          <SectionTitle as="h2" className="mb-1 text-slate-900">Workspace access</SectionTitle>
          <BodyText muted className="m-0 max-w-[54ch]">
            Owners and admins manage workspace invitations in Canopy Portal. Your current role does not allow changing staff access for this workspace.
          </BodyText>
        </AppSurface>
      )}

      <AppSurface variant="clear" padding="md" className="sm:p-6">
        <div className="mb-4 flex justify-between gap-6 max-sm:flex-col sm:items-end">
          <div>
            <Eyebrow>Products &amp; Services</Eyebrow>
            <SectionTitle as="h2" className="text-slate-900">What&apos;s enabled for your workspace</SectionTitle>
            <BodyText muted className="m-0 max-w-[54ch]">
              Contact Canopy when you want to adjust products or service access.
            </BodyText>
          </div>
        </div>

        <div className="overflow-hidden rounded-[24px] border border-[var(--app-surface-soft-border)] bg-white/72">
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
                <AppPill>{entitlement.status.charAt(0).toUpperCase() + entitlement.status.slice(1)}</AppPill>
              </div>
            );
          })}
        </div>
      </AppSurface>
    </div>
  );
}
