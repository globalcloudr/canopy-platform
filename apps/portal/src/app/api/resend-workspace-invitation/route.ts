import { NextRequest, NextResponse } from "next/server";
import { resolvePortalSession } from "@/lib/platform";
import { resendWorkspaceAdminInvitation } from "@/lib/provisioning";

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

  if (!session.isPlatformOperator) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const body = (await request.json()) as RequestBody;
    const invitationId = body.invitationId?.trim();
    if (!invitationId) {
      return NextResponse.json({ error: "Invitation id is required." }, { status: 400 });
    }

    const invitation = await resendWorkspaceAdminInvitation({
      invitationId,
      provisionedByUserId: session.user.id,
      inviteRedirectTo: `${normalizeOrigin(request.nextUrl.origin)}/sign-in`,
    });

    return NextResponse.json({ invitation }, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Resend failed.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
