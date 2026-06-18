import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createAdminClient } from "@/lib/supabase/server";

async function getAdminSession() {
  const cookieStore = await cookies();
  try {
    return JSON.parse(cookieStore.get("admin_session")?.value || "null");
  } catch {
    return null;
  }
}

export async function POST(request) {
  const session = await getAdminSession();
  if (!session?.admin_id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let payload;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { action, entityType, entityId, field } = payload;
  if (!action) return NextResponse.json({ error: "action is required" }, { status: 400 });

  try {
    const supabase = createAdminClient();
    await supabase.from("admin_audit_logs").insert({
      admin_id: session.admin_id,
      admin_email: session.email || null,
      action,
      entity_type: entityType || null,
      entity_id: entityId ? String(entityId) : null,
      field: field || null,
    });
  } catch (error) {
    // Log to server console but don't fail the request — audit log failure
    // must not block the admin from doing their job
    console.error("[audit] insert failed", error?.message || error);
  }

  return NextResponse.json({ ok: true });
}
