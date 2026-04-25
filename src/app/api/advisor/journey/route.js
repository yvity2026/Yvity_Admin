import { ValidateAdvisor } from "@/lib/auth/ValidateAdvisor";
import { createAdminClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function POST(req) {
  const supabase = createAdminClient();

  const user = await ValidateAdvisor();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();

  const payload = {
    user_id: user.id,
    entry_type: body.entry_type,
    service_category: body.service_category,
    custom_service_category: body.custom_service_category,
    title: body.title,
    organisation: body.organisation,
    description: body.description,
    from_year: body.from_year,
    to_year: body.to_year,
    date: body.date,
    is_ongoing: body.is_ongoing,
  };

  const { data, error } = await supabase
    .from("advisor_journey")
    .insert(payload)
    .eq("user_id", user.id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json(data);
}



export async function GET() {
  const supabase = createAdminClient();

  const user = await ValidateAdvisor();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data, error } = await supabase
    .from("advisor_journey")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json(data);
}