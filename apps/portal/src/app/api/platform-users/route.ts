import { NextRequest, NextResponse } from "next/server";
import { logAuditEvent } from "@/lib/audit";
import { getServiceEnv, resolvePortalSession } from "@/lib/platform";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

type PlatformRole = "super_admin" | "platform_staff";

type PlatformUserRow = {
  userId: string;
  email: string | null;
  fullName: string | null;
  role: PlatformRole | null;
  roleLabel: string;
  invited: boolean;
  lastSignInAt: string | null;
};

type ProfileRow = {
  user_id: string;
  is_super_admin: boolean | null;
  platform_role: string | null;
};

type AuthAdminUser = {
  id: string;
  email?: string | null;
  last_sign_in_at?: string | null;
  confirmed_at?: string | null;
  email_confirmed_at?: string | null;
  user_metadata?: {
    full_name?: string | null;
    name?: string | null;
  } | null;
};

type InviteBody = {
  email?: string;
  role?: string;
  orgId?: string;
};

type UpdateBody = {
  userId?: string;
  role?: string;
  orgId?: string;
};

type DeleteBody = {
  userId?: string;
  orgId?: string;
};

function roleLabel(role: PlatformRole | null) {
  if (role === "super_admin") return "Super Admin";
  if (role === "platform_staff") return "Platform Staff";
  return "Not set";
}

function normalizePlatformRole(row: { is_super_admin?: boolean | null; platform_role?: string | null }): PlatformRole | null {
  if (row.platform_role === "super_admin" || row.is_super_admin) return "super_admin";
  if (row.platform_role === "platform_staff") return "platform_staff";
  return null;
}

function isPlatformRole(value: string | null | undefined): value is PlatformRole {
  return value === "super_admin" || value === "platform_staff";
}

function formatDisplayName(user: AuthAdminUser | null) {
  const fullName =
    (typeof user?.user_metadata?.full_name === "string" && user.user_metadata.full_name.trim()) ||
    (typeof user?.user_metadata?.name === "string" && user.user_metadata.name.trim()) ||
    null;

  return fullName || null;
}

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

async function listAuthUsers() {
  const users: AuthAdminUser[] = [];
  let page = 1;

  while (page <= 10) {
    const payload = await requestAdminJson<{ users?: AuthAdminUser[] }>(
      "/auth/v1/admin/users",
      {
        searchParams: new URLSearchParams({
          page: String(page),
          per_page: "1000",
        }),
      }
    );

    const batch = payload.users ?? [];
    users.push(...batch);
    if (batch.length < 1000) {
      break;
    }
    page += 1;
  }

  return users;
}

async function findAuthUserByEmail(email: string) {
  const users = await listAuthUsers();
  return users.find((user) => (user.email ?? "").toLowerCase() === email.toLowerCase()) ?? null;
}

async function countSuperAdmins() {
  const rows = await requestAdminJson<ProfileRow[]>(
    "/rest/v1/profiles",
    {
      searchParams: new URLSearchParams({
        select: "user_id,is_super_admin,platform_role",
        or: "(is_super_admin.eq.true,platform_role.eq.super_admin)",
      }),
    }
  );

  return rows.length;
}

async function requireSuperAdminSession() {
  const session = await resolvePortalSession();
  if (!session) {
    return { ok: false as const, response: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };
  }

  if (session.platformRole !== "super_admin") {
    return { ok: false as const, response: NextResponse.json({ error: "Forbidden" }, { status: 403 }) };
  }

  return { ok: true as const, session };
}

export async function GET() {
  const auth = await requireSuperAdminSession();
  if (!auth.ok) return auth.response;

  try {
    const [profileRows, authUsers] = await Promise.all([
      requestAdminJson<ProfileRow[]>(
        "/rest/v1/profiles",
        {
          searchParams: new URLSearchParams({
            select: "user_id,is_super_admin,platform_role",
            or: "(is_super_admin.eq.true,platform_role.eq.super_admin,platform_role.eq.platform_staff)",
          }),
        }
      ),
      listAuthUsers(),
    ]);

    const authById = new Map(authUsers.map((user) => [user.id, user]));
    const users = profileRows.reduce<PlatformUserRow[]>((acc, row) => {
      const role = normalizePlatformRole(row);
      if (!role) {
        return acc;
      }

      const authUser = authById.get(row.user_id) ?? null;
      acc.push({
        userId: row.user_id,
        email: authUser?.email ?? null,
        fullName: formatDisplayName(authUser),
        role,
        roleLabel: roleLabel(role),
        invited: Boolean(authUser) && !authUser?.last_sign_in_at && !authUser?.confirmed_at && !authUser?.email_confirmed_at,
        lastSignInAt: authUser?.last_sign_in_at ?? null,
      });
      return acc;
    }, []).sort((left, right) => {
        if (left.role !== right.role) {
          return left.role === "super_admin" ? -1 : 1;
        }
        return (left.email ?? "").localeCompare(right.email ?? "");
      });

    return NextResponse.json({ users }, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to load platform users.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const auth = await requireSuperAdminSession();
  if (!auth.ok) return auth.response;

  try {
    const body = (await request.json()) as InviteBody;
    const email = body.email?.trim().toLowerCase() ?? "";
    const role = body.role?.trim().toLowerCase() ?? "";
    const orgId = body.orgId?.trim() ?? "";

    if (!EMAIL_RE.test(email)) {
      return NextResponse.json({ error: "A valid email is required." }, { status: 400 });
    }
    if (!isPlatformRole(role)) {
      return NextResponse.json({ error: "Use super_admin or platform_staff." }, { status: 400 });
    }

    const existingUser = await findAuthUserByEmail(email);
    let targetUserId = existingUser?.id ?? null;
    let invited = false;

    if (!targetUserId) {
      const invite = await requestAdminJson<{ user?: { id?: string | null } | null }>(
        "/auth/v1/invite",
        {
          method: "POST",
          body: {
            email,
            data: {
              full_name: "",
              platform_role: role,
            },
          },
        }
      );

      targetUserId = invite.user?.id ?? null;
      invited = true;
    }

    if (!targetUserId) {
      return NextResponse.json({ error: "Could not determine invited user id." }, { status: 500 });
    }

    await requestAdminJson<ProfileRow[]>(
      "/rest/v1/profiles",
      {
        method: "POST",
        prefer: "resolution=merge-duplicates,return=representation",
        searchParams: new URLSearchParams({
          on_conflict: "user_id",
        }),
        body: {
          user_id: targetUserId,
          is_super_admin: role === "super_admin",
          platform_role: role,
        },
      }
    );

    if (UUID_RE.test(orgId)) {
      await logAuditEvent({
        orgId,
        actorUserId: auth.session.user.id,
        actorEmail: auth.session.user.email,
        eventType: invited ? "platform_user_invited" : "platform_user_role_updated",
        entityType: "profile",
        entityId: targetUserId,
        metadata: {
          email,
          role,
          invited,
        },
      });
    }

    return NextResponse.json({
      ok: true,
      message: invited
        ? `Invite sent to ${email} as ${roleLabel(role)}.`
        : `${email} updated to ${roleLabel(role)}.`,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Invite failed.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function PATCH(request: NextRequest) {
  const auth = await requireSuperAdminSession();
  if (!auth.ok) return auth.response;

  try {
    const body = (await request.json()) as UpdateBody;
    const userId = body.userId?.trim() ?? "";
    const role = body.role?.trim().toLowerCase() ?? "";
    const orgId = body.orgId?.trim() ?? "";

    if (!UUID_RE.test(userId)) {
      return NextResponse.json({ error: "A valid userId is required." }, { status: 400 });
    }
    if (!isPlatformRole(role)) {
      return NextResponse.json({ error: "Use super_admin or platform_staff." }, { status: 400 });
    }

    const currentRows = await requestAdminJson<ProfileRow[]>(
      "/rest/v1/profiles",
      {
        searchParams: new URLSearchParams({
          select: "user_id,is_super_admin,platform_role",
          user_id: `eq.${userId}`,
          limit: "1",
        }),
      }
    );

    const currentRow = currentRows[0];
    if (!currentRow?.user_id) {
      return NextResponse.json({ error: "Platform user not found." }, { status: 404 });
    }

    const currentRole = normalizePlatformRole(currentRow);
    if (currentRole === "super_admin" && role !== "super_admin") {
      const superAdminCount = await countSuperAdmins();
      if (superAdminCount <= 1) {
        return NextResponse.json({ error: "At least one Super Admin must remain." }, { status: 400 });
      }
    }

    await requestAdminJson<ProfileRow[]>(
      "/rest/v1/profiles",
      {
        method: "PATCH",
        prefer: "return=representation",
        searchParams: new URLSearchParams({
          user_id: `eq.${userId}`,
        }),
        body: {
          is_super_admin: role === "super_admin",
          platform_role: role,
        },
      }
    );

    if (UUID_RE.test(orgId)) {
      const authUser = await requestAdminJson<AuthAdminUser>(
        "/auth/v1/admin/users/" + userId
      ).catch(() => null);
      await logAuditEvent({
        orgId,
        actorUserId: auth.session.user.id,
        actorEmail: auth.session.user.email,
        eventType: "platform_user_role_updated",
        entityType: "profile",
        entityId: userId,
        metadata: {
          email: authUser?.email ?? null,
          previousRole: currentRole,
          nextRole: role,
        },
      });
    }

    return NextResponse.json({ ok: true, message: `${userId} updated to ${roleLabel(role)}.` });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Role update failed.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function DELETE(request: NextRequest) {
  const auth = await requireSuperAdminSession();
  if (!auth.ok) return auth.response;

  try {
    const body = (await request.json()) as DeleteBody;
    const userId = body.userId?.trim() ?? "";
    const orgId = body.orgId?.trim() ?? "";

    if (!UUID_RE.test(userId)) {
      return NextResponse.json({ error: "A valid userId is required." }, { status: 400 });
    }

    if (userId === auth.session.user.id) {
      return NextResponse.json({ error: "Use another Super Admin to remove your own platform access." }, { status: 400 });
    }

    const currentRows = await requestAdminJson<ProfileRow[]>(
      "/rest/v1/profiles",
      {
        searchParams: new URLSearchParams({
          select: "user_id,is_super_admin,platform_role",
          user_id: `eq.${userId}`,
          limit: "1",
        }),
      }
    );

    const currentRow = currentRows[0];
    if (!currentRow?.user_id) {
      return NextResponse.json({ error: "Platform user not found." }, { status: 404 });
    }

    const currentRole = normalizePlatformRole(currentRow);
    if (currentRole === "super_admin") {
      const superAdminCount = await countSuperAdmins();
      if (superAdminCount <= 1) {
        return NextResponse.json({ error: "At least one Super Admin must remain." }, { status: 400 });
      }
    }

    await requestAdminJson<ProfileRow[]>(
      "/rest/v1/profiles",
      {
        method: "PATCH",
        prefer: "return=representation",
        searchParams: new URLSearchParams({
          user_id: `eq.${userId}`,
        }),
        body: {
          is_super_admin: false,
          platform_role: null,
        },
      }
    );

    if (UUID_RE.test(orgId)) {
      const authUser = await requestAdminJson<AuthAdminUser>(
        "/auth/v1/admin/users/" + userId
      ).catch(() => null);
      await logAuditEvent({
        orgId,
        actorUserId: auth.session.user.id,
        actorEmail: auth.session.user.email,
        eventType: "platform_user_removed",
        entityType: "profile",
        entityId: userId,
        metadata: {
          email: authUser?.email ?? null,
          previousRole: currentRole,
        },
      });
    }

    return NextResponse.json({ ok: true, message: `${userId} removed from platform access.` });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Remove access failed.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
