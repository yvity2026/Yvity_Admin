import { NextResponse } from "next/server";
import { buildAnalyticsSnapshot } from "@/lib/admin/analytics/buildAnalyticsSnapshot";
import { getAuthenticatedAdmin } from "@/lib/auth/getAuthenticatedAdmin";

export async function GET(request) {
  try {
    const admin = await getAuthenticatedAdmin();
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const filters = {
      dateFrom: searchParams.get("dateFrom") || "",
      dateTo: searchParams.get("dateTo") || "",
      industry: searchParams.get("industry") || "all",
      state: searchParams.get("state") || "all",
      city: searchParams.get("city") || "all",
    };

    const snapshot = buildAnalyticsSnapshot(filters);

    if (!snapshot.success) {
      return NextResponse.json({ error: snapshot.error }, { status: 501 });
    }

    return NextResponse.json(snapshot);
  } catch (error) {
    console.error("GET /api/admin/analytics failed:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
