import { NextRequest, NextResponse } from "next/server";
import {
  ACCESS_TOKEN_COOKIE,
  ACTIVE_WORKSPACE_COOKIE,
  REFRESH_TOKEN_COOKIE,
  getUserFromAccessToken,
} from "@/lib/platform";
import { createProductLaunchHandoff, type LaunchProductKey } from "@/lib/launch-handoff";

const DEFAULT_URLS: Record<LaunchProductKey, string> = {
  photovault: "http://localhost:3000",
  stories_canopy: "http://localhost:3001",
  reach_canopy: "http://localhost:3002",
};

function normalizeLaunchPath(productKey: LaunchProductKey, value: string | null | undefined) {
  const normalized = value?.trim();
  if (!normalized || normalized === "/") {
    if (productKey === "photovault") {
      return "/albums";
    }
    return "/";
  }
  return normalized.startsWith("/") ? normalized : `/${normalized}`;
}

function getProductAppUrl(productKey: LaunchProductKey) {
  if (productKey === "photovault") {
    return process.env.PHOTOVAULT_APP_URL?.trim() || DEFAULT_URLS.photovault;
  }
  if (productKey === "stories_canopy") {
    return process.env.STORIES_APP_URL?.trim() || DEFAULT_URLS.stories_canopy;
  }
  return process.env.REACH_APP_URL?.trim() || DEFAULT_URLS.reach_canopy;
}

function buildPortalRedirect(request: NextRequest, workspaceSlug?: string | null) {
  const url = new URL("/app", request.url);
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
    const productKey = String(formData.get("productKey") ?? "").trim() as LaunchProductKey;
    const workspaceSlug = String(formData.get("workspaceSlug") ?? "").trim() || null;
    const path = String(formData.get("path") ?? "").trim() || null;

    if (!accessToken || !refreshToken || !productKey) {
      return NextResponse.redirect(buildPortalRedirect(request, workspaceSlug));
    }

    const user = await getUserFromAccessToken(accessToken);
    if (!user?.id || !user.email) {
      return NextResponse.redirect(buildPortalRedirect(request, workspaceSlug));
    }

    const handoffCode = await createProductLaunchHandoff({
      productKey,
      accessToken,
      refreshToken,
      workspaceSlug,
    });

    const launchUrl = new URL(normalizeLaunchPath(productKey, path), getProductAppUrl(productKey));
    launchUrl.searchParams.set("launch", handoffCode);
    if (workspaceSlug) {
      launchUrl.searchParams.set("workspace", workspaceSlug);
    }

    const response = NextResponse.redirect(launchUrl);
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
    return NextResponse.redirect(buildPortalRedirect(request));
  }
}
