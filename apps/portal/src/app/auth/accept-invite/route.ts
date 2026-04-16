import { NextRequest, NextResponse } from "next/server";
import {
  ACCESS_TOKEN_COOKIE,
  REFRESH_TOKEN_COOKIE,
  getUserFromAccessToken,
} from "@/lib/platform";
import { finalizeWorkspaceAdminInvitationsForUser } from "@/lib/provisioning";

type AcceptInviteBody = {
  access_token?: string;
  refresh_token?: string;
  expires_in?: number;
};

function buildRedirect(request: NextRequest, path: string) {
  const url = new URL(path, request.url);
  if (url.hostname === "0.0.0.0") {
    url.hostname = "localhost";
  }
  return url;
}

export async function POST(request: NextRequest) {
  const body = (await request.json()) as AcceptInviteBody;
  const accessToken = body.access_token?.trim();
  const refreshToken = body.refresh_token?.trim();

  if (!accessToken || !refreshToken) {
    return NextResponse.json({ error: "Missing invite tokens." }, { status: 400 });
  }

  const user = await getUserFromAccessToken(accessToken);
  if (!user?.id || !user.email) {
    return NextResponse.json({ error: "Could not resolve invited user." }, { status: 400 });
  }

  const finalized = await finalizeWorkspaceAdminInvitationsForUser({
    id: user.id,
    email: user.email,
  });

  const redirectTo = finalized.preferredWorkspaceSlug
    ? buildRedirect(request, `/?workspace=${encodeURIComponent(finalized.preferredWorkspaceSlug)}`).toString()
    : buildRedirect(request, "/").toString();

  const response = NextResponse.json({ ok: true, redirectTo }, { status: 200 });

  response.cookies.set({
    name: ACCESS_TOKEN_COOKIE,
    value: accessToken,
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: typeof body.expires_in === "number" && body.expires_in > 0 ? body.expires_in : 60 * 60,
  });

  response.cookies.set({
    name: REFRESH_TOKEN_COOKIE,
    value: refreshToken,
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });

  return response;
}
