import { NextResponse } from "next/server";
import { hasPermission } from "@/lib/admin/permissions";
import { createAnnouncement } from "@/lib/communications/communicationsFacade";
import { prepareCommunicationsRuntime } from "@/lib/communications/prepareRuntime";
import { getAuthenticatedAdmin } from "@/lib/auth/getAuthenticatedAdmin";
import { createAdminClient } from "@/lib/supabase/server";

export async function POST(request) {
  try {
    await prepareCommunicationsRuntime();
    const admin = await getAuthenticatedAdmin();
    if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    if (!hasPermission(admin, "campaigns")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const title = String(body?.title || body?.name || "").trim();
    const messageBody = String(body?.messageBody || "").trim();

    if (!title) return NextResponse.json({ error: "Title is required" }, { status: 400 });
    if (!messageBody) return NextResponse.json({ error: "Message is required" }, { status: 400 });

    const supabase = createAdminClient();
    const announcement = await createAnnouncement(
      supabase,
      {
        title,
        messageBody,
        pinned: Boolean(body?.pinned),
        scheduledAt: body?.scheduledAt || null,
      },
      admin.id,
    );

    return NextResponse.json({ success: true, data: announcement });
  } catch (error) {
    console.error("POST /api/admin/communications/announcements failed:", error);
    return NextResponse.json({ error: error.message || "Unable to create announcement" }, { status: 500 });
  }
}
