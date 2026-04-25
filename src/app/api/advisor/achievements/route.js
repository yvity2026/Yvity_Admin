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
      fromYear,
      toYear,
      isOngoing,
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
        from_year: Number(fromYear),
        to_year: toYear ? Number(toYear) : null,
        is_ongoing: isOngoing || false,
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, achievement: data });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Create failed" }, { status: 500 });
  }
}