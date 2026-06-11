import { NextResponse } from "next/server";
import { hasAnyPermission, hasPermission } from "@/lib/admin/permissions";
import {
  createCampaign,
  emptyCommunicationsOverview,
  fetchCommunicationsOverview,
} from "@/lib/communications/communicationsFacade";
import { prepareCommunicationsRuntime } from "@/lib/communications/prepareRuntime";
import { getAuthenticatedAdmin } from "@/lib/auth/getAuthenticatedAdmin";
import { createAdminClient } from "@/lib/supabase/server";

function canViewCommunications(admin) {
  return hasAnyPermission(admin, ["campaigns", "send_campaigns"]);
}

export async function GET() {
  try {
    await prepareCommunicationsRuntime();
    const admin = await getAuthenticatedAdmin();

    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!canViewCommunications(admin)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const supabase = createAdminClient();
    const snapshot = await fetchCommunicationsOverview(supabase);

    return NextResponse.json({ success: true, data: snapshot.campaigns, snapshot });
  } catch (error) {
    console.error("GET /api/admin/communications failed:", error);
    const snapshot = emptyCommunicationsOverview("fallback");
    return NextResponse.json({ success: true, data: snapshot.campaigns, snapshot });
  }
}

export async function POST(request) {
  try {
    await prepareCommunicationsRuntime();
    const admin = await getAuthenticatedAdmin();

    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!hasPermission(admin, "campaigns")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const name = String(body?.name || "").trim();
    const messageBody = String(body?.messageBody || "").trim();

    if (!name) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }

    if (!messageBody || messageBody.length < 10) {
      return NextResponse.json(
        { error: "Message must be at least 10 characters" },
        { status: 400 },
      );
    }

    if (messageBody.length > 900) {
      return NextResponse.json(
        { error: "Message must be under 900 characters for WhatsApp templates" },
        { status: 400 },
      );
    }

    const supabase = createAdminClient();
    const campaign = await createCampaign(supabase, body, admin.id);

    return NextResponse.json({ success: true, data: campaign });
  } catch (error) {
    console.error("POST /api/admin/communications failed:", error);

    if (error?.code === "42P01") {
      return NextResponse.json(
        {
          error:
            "Communication tables are not migrated yet. Run the Supabase migration for marketing_campaigns.",
        },
        { status: 503 },
      );
    }

    return NextResponse.json(
      { error: error.message || "Unable to create communication" },
      { status: 500 },
    );
  }
}
