import { NextRequest, NextResponse } from "next/server";
import { resolvePortalSession } from "@/lib/platform";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const session = await resolvePortalSession({
    workspace: searchParams.get("workspace") ?? undefined,
  });

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.json({ session });
}
