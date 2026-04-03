import { NextRequest, NextResponse } from "next/server";
import { canManageWorkspaceInvitations, resolvePortalSession, type WorkspaceRole } from "@/lib/platform";
import {
  createWorkspaceInvitation,
  listWorkspaceAdminInvitations,
} from "@/lib/provisioning";

type CreateInvitationBody = {
  workspaceId?: string;
  email?: string;
  role?: WorkspaceRole;
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

function canManageForWorkspace(
  session: NonNullable<Awaited<ReturnType<typeof resolvePortalSession>>>,
  workspaceId: string
) {
  if (session.isPlatformOperator) {
    return true;
  }

  const membership = session.memberships.find((item) => item.workspaceId === workspaceId);
  return canManageWorkspaceInvitations(membership?.role);
}

export async function GET(request: NextRequest) {
  const session = await resolvePortalSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const workspaceId = request.nextUrl.searchParams.get("workspaceId")?.trim();
  if (!workspaceId) {
    return NextResponse.json({ error: "workspaceId is required." }, { status: 400 });
  }

  if (!canManageForWorkspace(session, workspaceId)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const invitations = await listWorkspaceAdminInvitations([workspaceId]);
  return NextResponse.json({ invitations });
}

export async function POST(request: NextRequest) {
  const session = await resolvePortalSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = (await request.json()) as CreateInvitationBody;
    const workspaceId = body.workspaceId?.trim();
    const email = body.email?.trim();
    const role = body.role ?? "viewer";

    if (!workspaceId || !email) {
      return NextResponse.json({ error: "workspaceId and email are required." }, { status: 400 });
    }

    if (!canManageForWorkspace(session, workspaceId)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const result = await createWorkspaceInvitation({
      workspaceId,
      email,
      role,
      invitedByUserId: session.user.id,
      invitedByEmail: session.user.email,
      inviteRedirectTo: `${normalizeOrigin(request.nextUrl.origin)}/sign-in`,
    });

    return NextResponse.json({ result }, { status: 200 });
  } catch (error) {
    console.error(error);
    const message = "Invite failed.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
