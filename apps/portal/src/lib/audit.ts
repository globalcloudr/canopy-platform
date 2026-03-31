export type AuditEventInput = {
  orgId: string;
  eventType: string;
  actorUserId?: string | null;
  actorEmail?: string | null;
  entityType?: string | null;
  entityId?: string | null;
  metadata?: Record<string, unknown>;
};

function getAuditEnv() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !serviceRoleKey) return null;
  return { supabaseUrl, serviceRoleKey };
}

export async function logAuditEvent(input: AuditEventInput) {
  const env = getAuditEnv();
  if (!env || !input.orgId || !input.eventType) return;

  const response = await fetch(new URL("/rest/v1/audit_events", env.supabaseUrl), {
    method: "POST",
    headers: {
      apikey: env.serviceRoleKey,
      Authorization: `Bearer ${env.serviceRoleKey}`,
      "Content-Type": "application/json",
      Prefer: "return=minimal",
    },
    body: JSON.stringify({
      org_id: input.orgId,
      actor_user_id: input.actorUserId ?? null,
      actor_email: input.actorEmail ?? null,
      event_type: input.eventType,
      entity_type: input.entityType ?? null,
      entity_id: input.entityId ?? null,
      metadata: input.metadata ?? {},
    }),
    cache: "no-store",
  });

  if (!response.ok) {
    const text = await response.text();
    console.error("Failed to write audit event", text);
  }
}
