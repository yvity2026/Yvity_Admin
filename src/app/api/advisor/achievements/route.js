import { ValidateAdvisor } from "@/lib/auth/ValidateAdvisor";
import { createAdminClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

async function refreshAdvisorScore(supabase, advisorId) {
  const recalcResult = await supabase.rpc("recalculate_advisor_score", {
    p_advisor: advisorId,
  });

  if (recalcResult.error) {
    console.error(
      "recalculate_advisor_score failed after achievement change:",
      recalcResult.error
    );
  }
}

export async function GET() {
  try {
    const advisor = await ValidateAdvisor();
    if (!advisor?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const supabase = createAdminClient();

    const { data, error } = await supabase
      .from("advisor_achievements")
      .select("*")
      .eq("advisor_id", advisor.id)
      .order("created_at", { ascending: false });

    if (error) throw error;

    return NextResponse.json({ achievements: data });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Fetch failed" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const advisor = await ValidateAdvisor();
    if (!advisor?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();

    const {
      title,
      organisation,
      description,
      icon,
      achievement_year,
    } = body;

    const supabase = createAdminClient();

    const { data, error } = await supabase
      .from("advisor_achievements")
      .insert({
        advisor_id: advisor.id,
        title,
        organisation,
        description,
        icon,
        achievement_year,
      })
      .select()
      .single();

    if (error) throw error;

    await refreshAdvisorScore(supabase, advisor.id);

    return NextResponse.json({ success: true, achievement: data });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Create failed" }, { status: 500 });
  }
}
