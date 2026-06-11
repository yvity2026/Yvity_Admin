import { NextResponse } from "next/server";
import { hasAnyPermission } from "@/lib/admin/permissions";
import {
  emptyCommunicationsOverview,
  fetchCommunicationsOverview,
} from "@/lib/communications/communicationsFacade";
import { prepareCommunicationsRuntime } from "@/lib/communications/prepareRuntime";
import { getAuthenticatedAdmin } from "@/lib/auth/getAuthenticatedAdmin";
import { createAdminClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    await prepareCommunicationsRuntime();
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
    return NextResponse.json({ success: true, ...emptyCommunicationsOverview("fallback") });
  }
}
