import { NextRequest, NextResponse } from "next/server";
import { resolvePortalSession, type ProductKey, type ServiceSetupState, type ServiceStatus, type SetupState, type WorkspaceRole } from "@/lib/platform";
import { provisionWorkspace, type ProvisionWorkspaceInput } from "@/lib/provisioning";

type RequestBody = {
  workspaceMode?: "existing" | "new";
  workspaceId?: string;
  workspaceName?: string;
  workspaceSlug?: string;
  primaryAdminEmail?: string;
  initialRole?: WorkspaceRole;
  products?: Array<{
    productKey?: ProductKey;
    status?: "trial" | "active" | "pilot" | "paused";
    setupState?: SetupState;
    planKey?: string;
  }>;
  services?: Array<{
    serviceKey?: string;
    status?: ServiceStatus;
    setupState?: ServiceSetupState;
  }>;
  notes?: string;
};

function parseBody(body: RequestBody): Omit<ProvisionWorkspaceInput, "provisionedByUserId"> {
  return {
    workspaceMode: body.workspaceMode === "new" ? "new" : "existing",
    workspaceId: body.workspaceId?.trim(),
    workspaceName: body.workspaceName?.trim(),
    workspaceSlug: body.workspaceSlug?.trim(),
    primaryAdminEmail: body.primaryAdminEmail?.trim() ?? "",
    initialRole: body.initialRole ?? "owner",
    products: (body.products ?? [])
      .filter((item): item is NonNullable<RequestBody["products"]>[number] & { productKey: ProductKey } => Boolean(item?.productKey))
      .map((item) => ({
        productKey: item.productKey,
        status: item.status,
        setupState: item.setupState,
        planKey: item.planKey?.trim() || undefined,
      })),
    services: (body.services ?? [])
      .filter((item): item is NonNullable<RequestBody["services"]>[number] & { serviceKey: string } => Boolean(item?.serviceKey?.trim()))
      .map((item) => ({
        serviceKey: item.serviceKey.trim(),
        status: item.status,
        setupState: item.setupState,
      })),
    notes: body.notes?.trim() || undefined,
  };
}

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
    const result = await provisionWorkspace({
      ...parseBody(body),
      provisionedByUserId: session.user.id,
      inviteRedirectTo: `${normalizeOrigin(request.nextUrl.origin)}/sign-in`,
    });

    return NextResponse.json({ result }, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Provisioning failed.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
