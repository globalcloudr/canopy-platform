import { getServiceEnv, getUserFromAccessToken } from "@/lib/platform";

export type LaunchProductKey =
  | "photovault"
  | "stories_canopy"
  | "community_canopy"
  | "reach_canopy"
  | "create_canopy";

type LaunchHandoffParams = {
  productKey: LaunchProductKey;
  accessToken: string;
  refreshToken: string;
  workspaceSlug?: string | null;
};

export async function createProductLaunchHandoff({
  productKey,
  accessToken,
  refreshToken,
  workspaceSlug,
}: LaunchHandoffParams) {
  const env = getServiceEnv();
  if (!env) {
    throw new Error("Missing Supabase environment variables.");
  }

  const user = await getUserFromAccessToken(accessToken);
  const handoffCode = crypto.randomUUID().replace(/-/g, "");
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000).toISOString();

  const response = await fetch(new URL("/rest/v1/product_launch_handoffs", env.supabaseUrl), {
    method: "POST",
    headers: {
      apikey: env.serviceRoleKey,
      Authorization: `Bearer ${env.serviceRoleKey}`,
      "Content-Type": "application/json",
      Prefer: "return=minimal",
    },
    body: JSON.stringify({
      handoff_code: handoffCode,
      product_key: productKey,
      workspace_slug: workspaceSlug?.trim() || null,
      access_token: accessToken,
      refresh_token: refreshToken,
      issued_by_user_id: user?.id ?? null,
      expires_at: expiresAt,
    }),
    cache: "no-store",
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Failed to create product launch handoff: ${text}`);
  }

  return handoffCode;
}
