import { NextRequest, NextResponse } from "next/server";
import { getServiceEnv } from "@/lib/platform";

function buildRedirect(request: NextRequest, path: string) {
  const url = new URL(path, request.url);
  if (url.hostname === "0.0.0.0") {
    url.hostname = "localhost";
  }
  return url;
}

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const email = String(formData.get("email") ?? "").trim();

  if (!email) {
    return NextResponse.redirect(buildRedirect(request, "/password-reset?error=1"));
  }

  try {
    const env = getServiceEnv();
    if (env) {
      const redirectTo = new URL("/sign-in", request.url).toString();
      await fetch(new URL("/auth/v1/recover", env.supabaseUrl), {
        method: "POST",
        headers: {
          apikey: env.anonKey,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, options: { redirectTo } }),
      });
      // Always redirect to success — never reveal whether an email exists
    }
  } catch {
    // Silent fail — still show success to avoid email enumeration
  }

  return NextResponse.redirect(buildRedirect(request, "/password-reset?sent=1"));
}
