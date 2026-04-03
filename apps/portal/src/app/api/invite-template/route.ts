import { NextRequest, NextResponse } from "next/server";
import { normalizeInviteTemplate } from "@/lib/invite-template";
import { resolvePortalSession } from "@/lib/platform";
import { getWorkspaceInviteTemplate, saveWorkspaceInviteTemplate } from "@/lib/provisioning";

type RequestBody = {
  workspaceId?: string;
  subject?: string;
  body?: string;
  signature?: string;
};

export async function GET(request: NextRequest) {
  const session = await resolvePortalSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (session.platformRole !== "super_admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const workspaceId = request.nextUrl.searchParams.get("workspaceId")?.trim();
  if (!workspaceId) {
    return NextResponse.json({ error: "Workspace id is required." }, { status: 400 });
  }

  const canAccessWorkspace = session.memberships.some((membership) => membership.workspaceId === workspaceId);
  if (!canAccessWorkspace) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const template = await getWorkspaceInviteTemplate(workspaceId);
    return NextResponse.json({ template }, { status: 200 });
  } catch (error) {
    console.error(error);
    const message = "Failed to load invite template.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function PUT(request: NextRequest) {
  const session = await resolvePortalSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (session.platformRole !== "super_admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const body = (await request.json()) as RequestBody;
    const workspaceId = body.workspaceId?.trim();
    if (!workspaceId) {
      return NextResponse.json({ error: "Workspace id is required." }, { status: 400 });
    }

    const canAccessWorkspace = session.memberships.some((membership) => membership.workspaceId === workspaceId);
    if (!canAccessWorkspace) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const template = await saveWorkspaceInviteTemplate(
      workspaceId,
      normalizeInviteTemplate({
        subject: body.subject,
        body: body.body,
        signature: body.signature,
      }),
      session.user.id
    );

    return NextResponse.json({ ok: true, template, message: "Invite template saved." }, { status: 200 });
  } catch (error) {
    console.error(error);
    const message = "Failed to save invite template.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
