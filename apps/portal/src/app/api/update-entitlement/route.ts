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
  if (session.platformRole !== "super_admin") {
    return NextResponse.json({ error: "Only Super Admin can change products." }, { status: 403 });
  }

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
    console.error(error);
    return NextResponse.json({ error: "Failed to update entitlement." }, { status: 400 });
  }
}
