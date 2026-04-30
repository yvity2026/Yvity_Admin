import { ValidateUser } from "@/lib/auth/ValidateUser";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const user = await ValidateUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const supabase = createAdminClient();

    // optional: check if already has a plan
    const { data: existing } = await supabase
      .from("advisor_profiles")
      .select("subscription_plan")
      .eq("advisor_id", user.id)
      .single();

    if (existing) {
      return NextResponse.json(
        { error: "Plan already exists" },
        { status: 409 }
      );
    }

    await supabase
      .from("advisor_profiles")
      .update({
        subscription_plan: "free",
        plan_active: true,
      })
      .eq("advisor_id", user.id);

    return NextResponse.json({ success: true });

  } catch (err) {
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}