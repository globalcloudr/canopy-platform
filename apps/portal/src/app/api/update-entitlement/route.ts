import { NextRequest, NextResponse } from "next/server";
import { resolvePortalSession, type ProductKey } from "@/lib/platform";
import { pauseEntitlement, resumeEntitlement, removeEntitlement } from "@/lib/provisioning";

type RequestBody = {
  workspaceId?: string;
  productKey?: ProductKey;
  action?: "pause" | "resume" | "remove";
};

export async function POST(request: NextRequest) {
  const session = await resolvePortalSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!session.isPlatformOperator) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const body = (await request.json()) as RequestBody;
  const { workspaceId, productKey, action } = body;

  if (!workspaceId?.trim()) return NextResponse.json({ error: "workspaceId is required" }, { status: 400 });
  if (!productKey) return NextResponse.json({ error: "productKey is required" }, { status: 400 });
  if (action !== "pause" && action !== "resume" && action !== "remove") {
    return NextResponse.json({ error: "action must be pause, resume, or remove" }, { status: 400 });
  }

  try {
    if (action === "pause") await pauseEntitlement(workspaceId.trim(), productKey);
    else if (action === "resume") await resumeEntitlement(workspaceId.trim(), productKey);
    else await removeEntitlement(workspaceId.trim(), productKey);
    return NextResponse.json({ ok: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to update entitlement.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
