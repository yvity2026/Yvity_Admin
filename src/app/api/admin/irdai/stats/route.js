import { createAdminClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { listLocalApprovals, useLocalApprovals } from "@/lib/local-data/advisor-approvals";
import { goldAppBaseUrl } from "@/lib/local-data/paths";

export async function GET() {
  try {
    if (useLocalApprovals()) {
      const base = goldAppBaseUrl();
      const res = await fetch(`${base}/api/admin/irdai/stats`, { cache: "no-store" });
      if (res.ok) {
        return NextResponse.json(await res.json());
      }
      const { stats } = listLocalApprovals();
      return NextResponse.json({
        data: {
          pending: stats.pending,
          approved: stats.approved,
          rejected: stats.rejected,
        },
      });
    }

    const supabase = createAdminClient();

    const [pending, approved, rejected] = await Promise.all([
      supabase
        .from("advisor_profiles")
        .select("*", { count: "exact", head: true })
        .eq("account_status", "under_review"),

      supabase
        .from("advisor_profiles")
        .select("*", { count: "exact", head: true })
        .eq("account_status", "active"),

      supabase
        .from("advisor_profiles")
        .select("*", { count: "exact", head: true })
        .eq("account_status", "action_required"),
    ]);

    return NextResponse.json({
      data: {
        pending: pending.count || 0,
        approved: approved.count || 0,
        rejected: rejected.count || 0,
      },
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}