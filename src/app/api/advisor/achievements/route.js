import { ValidateAdvisor } from "@/lib/auth/ValidateAdvisor";
import { createAdminClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

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
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// 🟢 CREATE ACHIEVEMENT
export async function POST(request) {
  try {
    const advisor = await ValidateAdvisor();

    if (!advisor?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { achievement_type, from_year, to_year, certificate_url } = body;

    const supabase = createAdminClient();

    const { data, error } = await supabase
      .from("advisor_achievements")
      .insert({
        advisor_id: advisor.id,
        achievement_type,
        from_year: Number(from_year),
        to_year : String(to_year),
        certificate_url,
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, achievement: data });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}