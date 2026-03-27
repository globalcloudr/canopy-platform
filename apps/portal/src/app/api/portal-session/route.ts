import { NextRequest, NextResponse } from "next/server";
import { resolvePortalSession } from "@/lib/platform";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const session = await resolvePortalSession({
    email: searchParams.get("email") ?? undefined,
    workspace: searchParams.get("workspace") ?? undefined,
  });

  return NextResponse.json({ session });
}
