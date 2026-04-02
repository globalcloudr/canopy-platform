import { NextRequest, NextResponse } from "next/server";
import { ACCESS_TOKEN_COOKIE, REFRESH_TOKEN_COOKIE } from "@/lib/platform";
import { createProductLaunchHandoff } from "@/lib/launch-handoff";

const DEFAULT_PHOTOVAULT_URL = "https://photovault.school";

function getPhotoVaultAppUrl() {
  return process.env.PHOTOVAULT_APP_URL?.trim() || DEFAULT_PHOTOVAULT_URL;
}

function normalizeLaunchPath(value: string | null) {
  const normalized = value?.trim();
  if (!normalized || normalized === "/") {
    return "/albums";
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
    getPhotoVaultAppUrl()
  );
  const workspaceSlug = request.nextUrl.searchParams.get("workspace")?.trim();
  const handoffCode = await createProductLaunchHandoff({
    productKey: "photovault",
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
