import { ValidateAdvisor } from "@/lib/auth/ValidateAdvisor";
import { createAdminClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";


export async function PUT(request, { params }) {
  try {
    const advisor = await ValidateAdvisor();

    if (!advisor?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();

    const { achievement_type, from_year, to_year, certificate_url } = body;

    const supabase = createAdminClient();

    const { data, error } = await supabase
      .from("advisor_achievements")
      .update({
        achievement_type,
        from_year: Number(from_year),
        to_year : String(to_year),
        certificate_url,
      })
      .eq("id", id)
      .eq("advisor_id", advisor.id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, achievement: data });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// 🗑 DELETE ACHIEVEMENT
export async function DELETE(request, { params }) {
  try {
    const advisor = await ValidateAdvisor();

    if (!advisor?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const supabase = createAdminClient();

    const { data, error } = await supabase
      .from("advisor_achievements")
      .delete()
      .eq("id", id)
      .eq("advisor_id", advisor.id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, deleted: data });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}