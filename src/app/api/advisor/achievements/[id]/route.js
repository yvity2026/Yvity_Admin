import { ValidateAdvisor } from "@/lib/auth/ValidateAdvisor";
import { createAdminClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

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
      fromYear,
      toYear,
      isOngoing,
    } = body;

    const supabase = createAdminClient();

    const { data, error } = await supabase
      .from("advisor_achievements")
      .update({
        title,
        organisation,
        description,
        icon,
        // from_year: Number(fromYear),
        // to_year: toYear ? Number(toYear) : null,
        is_ongoing: isOngoing || false,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .eq("advisor_id", advisor.id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, achievement: data });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
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

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }
}