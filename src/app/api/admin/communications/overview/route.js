import { NextResponse } from "next/server";
import { hasAnyPermission } from "@/lib/admin/permissions";
import { fetchCommunicationsOverview } from "@/lib/communications/communicationsFacade";
import { getAuthenticatedAdmin } from "@/lib/auth/getAuthenticatedAdmin";
import { createAdminClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const admin = await getAuthenticatedAdmin();
    if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    if (!hasAnyPermission(admin, ["campaigns", "send_campaigns"])) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const supabase = createAdminClient();
    const snapshot = await fetchCommunicationsOverview(supabase);
    return NextResponse.json({ success: true, ...snapshot });
  } catch (error) {
    console.error("GET /api/admin/communications/overview failed:", error);
    if (error?.code === "42P01") {
      return NextResponse.json(
        { error: "Communication tables are not migrated yet." },
        { status: 503 },
      );
    }
    return NextResponse.json({ error: error.message || "Unable to load overview" }, { status: 500 });
  }
}
