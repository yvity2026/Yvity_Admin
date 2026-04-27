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

export async function PUT(request, context ) {
  try {
    const advisor = await ValidateAdvisor();
    if (!advisor?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const params = await context.params;
    const id = params.id;

    if (!id) {
      return NextResponse.json({ error: "Missing id" }, { status: 400 });
    }
    const body = await request.json();

    const {
      title,
      organisation,
      description,
      icon,
<<<<<<< Anil/TrustSection
      achievement_year,
=======
      year_of_achievement,
>>>>>>> main
    } = body;

    if (!title || !organisation || !year_of_achievement) {
      return NextResponse.json(
        { error: "Title, organisation, and year are required" },
        { status: 400 }
      );
    }

    const supabase = createAdminClient();

    const { data, error } = await supabase
      .from("advisor_achievements")
      .update({
        title,
        organisation,
        description,
        icon,
<<<<<<< Anil/TrustSection
        achievement_year,
=======
        year_of_achievement,
>>>>>>> main
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .eq("advisor_id", advisor.id)
      .select()
      .single();

    if (error) throw error;

    await refreshAdvisorScore(supabase, advisor.id);

    return NextResponse.json({ success: true, achievement: data });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: err.message || "Update failed" },
      { status: 500 }
    );
  }
}

export async function DELETE(request, context) {
  try {
    const advisor = await ValidateAdvisor();
    if (!advisor?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const params = await context.params;
    const id = params.id;

    if (!id) {
      return NextResponse.json({ error: "Missing id" }, { status: 400 });
    }
    const supabase = createAdminClient();

    const { error } = await supabase
      .from("advisor_achievements")
      .delete()
      .eq("id", id)
      .eq("advisor_id", advisor.id);

    if (error) throw error;

    await refreshAdvisorScore(supabase, advisor.id);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }
}
