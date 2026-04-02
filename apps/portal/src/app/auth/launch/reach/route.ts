import { NextRequest, NextResponse } from "next/server";
import { ACCESS_TOKEN_COOKIE, REFRESH_TOKEN_COOKIE } from "@/lib/platform";
import { createProductLaunchHandoff } from "@/lib/launch-handoff";

const DEFAULT_REACH_URL = "https://canopy-reach.vercel.app";

function getReachAppUrl() {
  return process.env.REACH_APP_URL?.trim() || DEFAULT_REACH_URL;
}

function normalizeLaunchPath(value: string | null) {
  const normalized = value?.trim();
  if (!normalized || normalized === "/") {
    return "/";
  }
  return normalized.startsWith("/") ? normalized : `/${normalized}`;
}

function buildSignInRedirect(request: NextRequest) {
  const url = new URL("/sign-in", request.url);
  if (url.hostname === "0.0.0.0") {
    url.hostname = "localhost";
  }
  return url;
}

export async function GET(request: NextRequest) {
  const accessToken = request.cookies.get(ACCESS_TOKEN_COOKIE)?.value;
  const refreshToken = request.cookies.get(REFRESH_TOKEN_COOKIE)?.value;

  if (!accessToken || !refreshToken) {
    return NextResponse.redirect(buildSignInRedirect(request));
  }

  const targetUrl = new URL(
    normalizeLaunchPath(request.nextUrl.searchParams.get("path")),
    getReachAppUrl()
  );
  const workspaceSlug = request.nextUrl.searchParams.get("workspace")?.trim();
  const handoffCode = await createProductLaunchHandoff({
    productKey: "reach_canopy",
    accessToken,
    refreshToken,
    workspaceSlug,
  });

  if (workspaceSlug) {
    targetUrl.searchParams.set("workspace", workspaceSlug);
  }
  targetUrl.searchParams.set("launch", handoffCode);

  return NextResponse.redirect(targetUrl);
}
