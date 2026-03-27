import { NextRequest, NextResponse } from "next/server";
import {
  ACCESS_TOKEN_COOKIE,
  REFRESH_TOKEN_COOKIE,
  signInWithSupabasePassword,
} from "@/lib/platform";

function buildRedirect(request: NextRequest, path: string) {
  return new URL(path, request.url);
}

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    const url = buildRedirect(request, "/sign-in");
    url.searchParams.set("error", "missing_credentials");
    if (email) {
      url.searchParams.set("email", email);
    }
    return NextResponse.redirect(url);
  }

  try {
    const auth = await signInWithSupabasePassword(email, password);
    const response = NextResponse.redirect(buildRedirect(request, "/app"));

    response.cookies.set({
      name: ACCESS_TOKEN_COOKIE,
      value: auth.access_token,
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: auth.expires_in,
    });

    response.cookies.set({
      name: REFRESH_TOKEN_COOKIE,
      value: auth.refresh_token,
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 30,
    });

    return response;
  } catch {
    const url = buildRedirect(request, "/sign-in");
    url.searchParams.set("error", "invalid_credentials");
    url.searchParams.set("email", email);
    return NextResponse.redirect(url);
  }
}
