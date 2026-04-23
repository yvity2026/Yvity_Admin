import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";

// CREATE
export async function POST(req) {
  try {
    const supabase = createAdminClient();
    const body = await req.json();

    const {
      advisor_id,
      user_id,
      recommendations,
      mobile_number,
      is_mobile_verified,
    } = body;

    if (!advisor_id || !user_id || !recommendations ||  !is_mobile_verified) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("advisor_recommendations")
      .insert({
        advisor_id,
        user_id,
        recommendations,
        mobile_number,
        is_mobile_verified: is_mobile_verified || false,
        status: "pending",
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ data });
  } catch (err) {
    return NextResponse.json(
      { error: err.message },
      { status: 500 }
    );
  }
}
