import { NextRequest, NextResponse } from "next/server";
import {
  ACCESS_TOKEN_COOKIE,
  ACTIVE_WORKSPACE_COOKIE,
  REFRESH_TOKEN_COOKIE,
  getUserFromAccessToken,
} from "@/lib/platform";
import { createProductLaunchHandoff, type LaunchProductKey } from "@/lib/launch-handoff";

type LaunchBody = {
  productKey?: LaunchProductKey;
  refreshToken?: string;
  workspaceSlug?: string | null;
  path?: string | null;
};

const DEFAULT_URLS: Record<LaunchProductKey, string> = {
  photovault: "http://localhost:3000",
  stories_canopy: "http://localhost:3001",
  reach_canopy: "http://localhost:3002",
};

function getAllowedOrigins() {
  return [
    process.env.PHOTOVAULT_APP_URL?.trim(),
    process.env.STORIES_APP_URL?.trim(),
    process.env.REACH_APP_URL?.trim(),
    process.env.NEXT_PUBLIC_APP_URL?.trim(),
  ].filter(Boolean) as string[];
}

function getCorsHeaders(origin: string | null) {
  const allowedOrigins = new Set(getAllowedOrigins());
  const allowOrigin = origin && allowedOrigins.has(origin) ? origin : null;

  return {
    "Access-Control-Allow-Origin": allowOrigin ?? "null",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Authorization, Content-Type",
    "Access-Control-Allow-Credentials": "true",
    Vary: "Origin",
  };
}

function normalizeLaunchPath(value: string | null | undefined) {
  const normalized = value?.trim();
  if (!normalized || normalized === "/") {
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

export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 204,
    headers: getCorsHeaders(request.headers.get("origin")),
  });
}

export async function POST(request: NextRequest) {
  const corsHeaders = getCorsHeaders(request.headers.get("origin"));

  try {
    const authorization = request.headers.get("authorization") ?? "";
    const accessToken = authorization.startsWith("Bearer ") ? authorization.slice("Bearer ".length).trim() : "";
    const body = (await request.json()) as LaunchBody;
    const refreshToken = body.refreshToken?.trim() ?? "";
    const productKey = body.productKey;
    const workspaceSlug = body.workspaceSlug?.trim() || null;

    if (!accessToken || !refreshToken || !productKey) {
      return NextResponse.json({ error: "Missing launch credentials." }, { status: 400, headers: corsHeaders });
    }

    const user = await getUserFromAccessToken(accessToken);
    if (!user?.id || !user.email) {
      return NextResponse.json({ error: "Unauthorized launch request." }, { status: 401, headers: corsHeaders });
    }

    const handoffCode = await createProductLaunchHandoff({
      productKey,
      accessToken,
      refreshToken,
      workspaceSlug,
    });

    const launchUrl = new URL(normalizeLaunchPath(body.path), getProductAppUrl(productKey));
    launchUrl.searchParams.set("launch", handoffCode);
    if (workspaceSlug) {
      launchUrl.searchParams.set("workspace", workspaceSlug);
    }

    const response = NextResponse.json({ launchUrl: launchUrl.toString() }, { headers: corsHeaders });
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
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to launch product." },
      { status: 500, headers: corsHeaders }
    );
  }
}
