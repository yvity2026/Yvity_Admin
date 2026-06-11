import { NextResponse } from "next/server";
import { hasPermission } from "@/lib/admin/permissions";
import { sendCampaign } from "@/lib/communications/communicationsFacade";
import { prepareCommunicationsRuntime } from "@/lib/communications/prepareRuntime";
import { getAuthenticatedAdmin } from "@/lib/auth/getAuthenticatedAdmin";
import { createAdminClient } from "@/lib/supabase/server";

export async function POST(_request, { params }) {
  try {
    await prepareCommunicationsRuntime();
    const admin = await getAuthenticatedAdmin();

    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!hasPermission(admin, "send_campaigns")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { id: campaignId } = await params;

    if (!campaignId) {
      return NextResponse.json({ error: "Missing communication id" }, { status: 400 });
    }

    const supabase = createAdminClient();
    const result = await sendCampaign(supabase, campaignId, admin.id);

    return NextResponse.json({
      success: true,
      data: result,
      message: result.simulated
        ? "Sent in dev simulation mode (WhatsApp API not configured)."
        : "Communication sent.",
    });
  } catch (error) {
    console.error("POST /api/admin/communications/[id]/send failed:", error);

    const status = error.statusCode || 500;

    return NextResponse.json(
      { error: error.message || "Unable to send communication" },
      { status },
    );
  }
}
