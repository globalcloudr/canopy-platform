import { NextRequest, NextResponse } from "next/server";
import { logAuditEvent } from "@/lib/audit";
import { getServiceEnv, resolvePortalSession } from "@/lib/platform";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const PREVIOUS_OWNER_HANDLING = new Set(["remove", "viewer", "uploader"] as const);

type TransferOwnerBody = {
  workspaceId?: string;
  email?: string;
  previousOwnerHandling?: "remove" | "viewer" | "uploader";
};

type OrganizationRow = {
  id: string;
  name: string | null;
  slug: string | null;
};

type MembershipRow = {
  user_id: string;
};

function getAdminEnv() {
  const env = getServiceEnv();
  if (!env) {
    throw new Error("Missing Supabase environment variables.");
  }
  return env;
}

async function requestAdminJson<T>(path: string, options?: {
  method?: "GET" | "POST" | "PATCH" | "DELETE";
  searchParams?: URLSearchParams;
  body?: unknown;
  prefer?: string;
}) {
  const env = getAdminEnv();
  const url = new URL(path, env.supabaseUrl);
  if (options?.searchParams) {
    url.search = options.searchParams.toString();
  }

  const response = await fetch(url.toString(), {
    method: options?.method ?? "GET",
    headers: {
      apikey: env.serviceRoleKey,
      Authorization: `Bearer ${env.serviceRoleKey}`,
      "Content-Type": "application/json",
      ...(options?.prefer ? { Prefer: options.prefer } : {}),
    },
    body: options?.body ? JSON.stringify(options.body) : undefined,
    cache: "no-store",
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Supabase request failed (${response.status}): ${text}`);
  }

  if (response.status === 204 || response.headers.get("content-length") === "0") {
    return undefined as T;
  }

  return (await response.json()) as T;
}

export async function POST(request: NextRequest) {
  const session = await resolvePortalSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (session.platformRole !== "super_admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const body = (await request.json()) as TransferOwnerBody;
    const workspaceId = body.workspaceId?.trim() ?? "";
    const email = body.email?.trim().toLowerCase() ?? "";
    const previousOwnerHandling = body.previousOwnerHandling ?? "remove";

    if (!UUID_RE.test(workspaceId)) {
      return NextResponse.json({ error: "A valid workspaceId is required." }, { status: 400 });
    }
    if (!EMAIL_RE.test(email)) {
      return NextResponse.json({ error: "A valid email is required." }, { status: 400 });
    }
    if (!PREVIOUS_OWNER_HANDLING.has(previousOwnerHandling)) {
      return NextResponse.json({ error: "Invalid previous owner handling." }, { status: 400 });
    }

    const organizationRows = await requestAdminJson<OrganizationRow[]>(
      "/rest/v1/organizations",
      {
        searchParams: new URLSearchParams({
          select: "id,name,slug",
          id: `eq.${workspaceId}`,
          limit: "1",
        }),
      }
    );
    const org = organizationRows[0];
    if (!org?.id) {
      return NextResponse.json({ error: "Workspace not found." }, { status: 404 });
    }

    const invitePayload = await requestAdminJson<{ user?: { id?: string | null } | null }>(
      "/auth/v1/invite",
      {
        method: "POST",
        body: {
          email,
          data: {
            workspace_id: org.id,
            workspace_slug: org.slug,
            workspace_name: org.name,
            platform_role_hint: "owner",
          },
          redirect_to: new URL("/sign-in", request.url).toString(),
        },
      }
    );

    const newOwnerUserId = invitePayload.user?.id ?? null;
    if (!newOwnerUserId) {
      return NextResponse.json({ error: "Invite sent, but no invited user id was returned." }, { status: 500 });
    }

    await requestAdminJson<unknown>(
      "/rest/v1/memberships",
      {
        method: "POST",
        prefer: "resolution=merge-duplicates,return=representation",
        searchParams: new URLSearchParams({
          on_conflict: "org_id,user_id",
        }),
        body: {
          org_id: org.id,
          user_id: newOwnerUserId,
          role: "owner",
        },
      }
    );

    const existingOwners = await requestAdminJson<MembershipRow[]>(
      "/rest/v1/memberships",
      {
        searchParams: new URLSearchParams({
          select: "user_id",
          org_id: `eq.${org.id}`,
          role: "eq.owner",
        }),
      }
    );

    const previousOwnerIds = existingOwners
      .map((row) => row.user_id)
      .filter((userId) => userId && userId !== newOwnerUserId);

    if (previousOwnerIds.length > 0) {
      if (previousOwnerHandling === "remove") {
        await requestAdminJson<unknown>(
          "/rest/v1/memberships",
          {
            method: "DELETE",
            searchParams: new URLSearchParams({
              org_id: `eq.${org.id}`,
              user_id: `in.(${previousOwnerIds.join(",")})`,
              role: "eq.owner",
            }),
          }
        );
      } else {
        await requestAdminJson<unknown>(
          "/rest/v1/memberships",
          {
            method: "PATCH",
            prefer: "return=representation",
            searchParams: new URLSearchParams({
              org_id: `eq.${org.id}`,
              user_id: `in.(${previousOwnerIds.join(",")})`,
              role: "eq.owner",
            }),
            body: {
              role: previousOwnerHandling,
            },
          }
        );
      }
    }

    await logAuditEvent({
      orgId: org.id,
      actorUserId: session.user.id,
      actorEmail: session.user.email,
      eventType: "workspace_owner_transferred",
      entityType: "membership",
      entityId: newOwnerUserId,
      metadata: {
        workspaceName: org.name,
        newOwnerEmail: email,
        newOwnerUserId,
        previousOwnerHandling,
        previousOwnerIds,
      },
    });

    const handlingMessage =
      previousOwnerIds.length === 0
        ? "No prior owner memberships needed changes."
        : previousOwnerHandling === "remove"
          ? "Previous owner memberships were removed."
          : `Previous owner memberships were changed to ${previousOwnerHandling}.`;

    return NextResponse.json({
      ok: true,
      message: `Ownership transfer started for ${org.name ?? org.slug ?? "workspace"}. ${handlingMessage}`,
      newOwnerUserId,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Ownership transfer failed." }, { status: 400 });
  }
}
