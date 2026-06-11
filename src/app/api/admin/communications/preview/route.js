import { NextResponse } from "next/server";
import { hasAnyPermission } from "@/lib/admin/permissions";
import { previewAudience } from "@/lib/communications/communicationsFacade";
import { prepareCommunicationsRuntime } from "@/lib/communications/prepareRuntime";
import { getAuthenticatedAdmin } from "@/lib/auth/getAuthenticatedAdmin";
import { createAdminClient } from "@/lib/supabase/server";

export async function POST(request) {
  try {
    await prepareCommunicationsRuntime();
    const admin = await getAuthenticatedAdmin();

    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!hasAnyPermission(admin, ["campaigns", "send_campaigns"])) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const supabase = createAdminClient();

    const count = await previewAudience(supabase, body);

    return NextResponse.json({
      success: true,
      data: {
        count,
        note:
          "Count only — recipient phone numbers are never exported to the admin UI.",
      },
    });
  } catch (error) {
    console.error("POST /api/admin/communications/preview failed:", error);

    return NextResponse.json(
      { error: error.message || "Unable to preview audience" },
      { status: 500 },
    );
  }
}
