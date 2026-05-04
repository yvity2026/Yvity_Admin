import { createAdminClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET() {
  try {
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