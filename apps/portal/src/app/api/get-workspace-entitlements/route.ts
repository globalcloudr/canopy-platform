import { NextRequest, NextResponse } from "next/server";
import { resolvePortalSession } from "@/lib/platform";
import { getWorkspaceEntitlements } from "@/lib/provisioning";

export async function GET(request: NextRequest) {
  const session = await resolvePortalSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!session.isPlatformOperator) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const workspaceId = request.nextUrl.searchParams.get("workspaceId");
  if (!workspaceId?.trim()) return NextResponse.json({ error: "workspaceId is required" }, { status: 400 });

  try {
    const entitlements = await getWorkspaceEntitlements(workspaceId.trim());
    return NextResponse.json({ entitlements });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to load entitlements.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
