import { NextRequest, NextResponse } from "next/server";
import { resolvePortalSession } from "@/lib/platform";
import { pauseServiceState, removeServiceState, resumeServiceState } from "@/lib/provisioning";

type RequestBody = {
  workspaceId?: string;
  serviceKey?: string;
  action?: "pause" | "resume" | "remove";
};

export async function POST(request: NextRequest) {
  const session = await resolvePortalSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (session.platformRole !== "super_admin") {
    return NextResponse.json({ error: "Only Super Admin can change services." }, { status: 403 });
  }

  const body = (await request.json()) as RequestBody;
  const { workspaceId, serviceKey, action } = body;

  if (!workspaceId?.trim()) return NextResponse.json({ error: "workspaceId is required" }, { status: 400 });
  if (!serviceKey?.trim()) return NextResponse.json({ error: "serviceKey is required" }, { status: 400 });
  if (action !== "pause" && action !== "resume" && action !== "remove") {
    return NextResponse.json({ error: "action must be pause, resume, or remove" }, { status: 400 });
  }

  try {
    if (action === "pause") await pauseServiceState(workspaceId.trim(), serviceKey.trim());
    else if (action === "resume") await resumeServiceState(workspaceId.trim(), serviceKey.trim());
    else await removeServiceState(workspaceId.trim(), serviceKey.trim());
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error(error);
    const message = "Failed to update service.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
