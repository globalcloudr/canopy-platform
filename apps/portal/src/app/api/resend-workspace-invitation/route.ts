import { NextRequest, NextResponse } from "next/server";
import { canManageWorkspaceInvitations, resolvePortalSession } from "@/lib/platform";
import { listWorkspaceAdminInvitations, resendWorkspaceAdminInvitation } from "@/lib/provisioning";

type RequestBody = {
  invitationId?: string;
};

function normalizeOrigin(origin: string) {
  try {
    const url = new URL(origin);
    if (url.hostname === "0.0.0.0") {
      url.hostname = "localhost";
    }
    return url.toString().replace(/\/$/, "");
  } catch {
    return origin.replace(/\/$/, "");
  }
}

export async function POST(request: NextRequest) {
  const session = await resolvePortalSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = (await request.json()) as RequestBody;
    const invitationId = body.invitationId?.trim();
    if (!invitationId) {
      return NextResponse.json({ error: "Invitation id is required." }, { status: 400 });
    }

    const accessibleWorkspaceIds = session.isPlatformOperator
      ? session.memberships.map((membership) => membership.workspaceId)
      : session.memberships
          .filter((membership) => canManageWorkspaceInvitations(membership.role))
          .map((membership) => membership.workspaceId);

    const invitations = await listWorkspaceAdminInvitations(accessibleWorkspaceIds);
    const invitationRecord = invitations.find((invitation) => invitation.id === invitationId);
    if (!invitationRecord) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const invitation = await resendWorkspaceAdminInvitation({
      invitationId,
      provisionedByUserId: session.user.id,
      actorEmail: session.user.email,
      inviteRedirectTo: `${normalizeOrigin(request.nextUrl.origin)}/sign-in`,
    });

    return NextResponse.json({ invitation }, { status: 200 });
  } catch (error) {
    console.error(error);
    const message = "Resend failed.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
