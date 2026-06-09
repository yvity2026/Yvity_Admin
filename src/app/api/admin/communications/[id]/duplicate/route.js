import { NextResponse } from "next/server";
import { hasPermission } from "@/lib/admin/permissions";
import { duplicateCampaign } from "@/lib/communications/communicationsFacade";
import { getAuthenticatedAdmin } from "@/lib/auth/getAuthenticatedAdmin";
import { createAdminClient } from "@/lib/supabase/server";

export async function POST(_request, { params }) {
  try {
    const admin = await getAuthenticatedAdmin();
    if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    if (!hasPermission(admin, "campaigns")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { id } = await params;
    const supabase = createAdminClient();
    const campaign = await duplicateCampaign(supabase, id, admin.id);
    if (!campaign) {
      return NextResponse.json({ error: "Campaign not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: campaign });
  } catch (error) {
    console.error("POST /api/admin/communications/[id]/duplicate failed:", error);
    return NextResponse.json({ error: error.message || "Unable to duplicate" }, { status: 500 });
  }
}
