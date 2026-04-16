import { NextRequest, NextResponse } from "next/server";
import {
  ACCESS_TOKEN_COOKIE,
  ACTIVE_WORKSPACE_COOKIE,
  REFRESH_TOKEN_COOKIE,
  getUserFromAccessToken,
} from "@/lib/platform";

function buildRedirect(request: NextRequest, workspaceSlug?: string | null) {
  const url = new URL("/", request.url);
  if (url.hostname === "0.0.0.0") {
    url.hostname = "localhost";
  }
  if (workspaceSlug?.trim()) {
    url.searchParams.set("workspace", workspaceSlug.trim());
  }
  return url;
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const accessToken = String(formData.get("accessToken") ?? "").trim();
    const refreshToken = String(formData.get("refreshToken") ?? "").trim();
    const workspaceSlug = String(formData.get("workspaceSlug") ?? "").trim() || null;

    if (!accessToken || !refreshToken) {
      return NextResponse.redirect(buildRedirect(request), 303);
    }

    const user = await getUserFromAccessToken(accessToken);
    if (!user?.id || !user.email) {
      return NextResponse.redirect(buildRedirect(request), 303);
    }

    const response = NextResponse.redirect(buildRedirect(request, workspaceSlug), 303);

    response.cookies.set({
      name: ACCESS_TOKEN_COOKIE,
      value: accessToken,
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60,
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

    if (workspaceSlug) {
      response.cookies.set({
        name: ACTIVE_WORKSPACE_COOKIE,
        value: workspaceSlug,
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        path: "/",
        maxAge: 60 * 60 * 24 * 365,
      });
    }

    return response;
  } catch {
    return NextResponse.redirect(buildRedirect(request), 303);
  }
}
