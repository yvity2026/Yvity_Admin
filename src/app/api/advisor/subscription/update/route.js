import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";
import { ValidateUser } from "@/lib/auth/ValidateUser";

const supabase = createAdminClient();

export async function POST(req) {
  try {
    const user = await ValidateUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { planId, expiryDate } = body;

    if (!planId || !expiryDate) {
      return NextResponse.json(
        { error: "Missing planId or expiryDate" },
        { status: 400 }
      );
    }

    // Calculate expiry date if not provided
    let finalExpiryDate = expiryDate;
    if (!finalExpiryDate) {
      const date = new Date();
      date.setFullYear(date.getFullYear() + 1);
      finalExpiryDate = date.toISOString();
    }

    // Update advisor profile with subscription info
    const { error: updateError } = await supabase
      .from("advisor_profiles")
      .update({
        subscription_plan: planId,
        subscription_expires_at: finalExpiryDate,
        subscription_activated_at: new Date().toISOString(),
      })
      .eq("user_id", user.id);

    if (updateError) {
      console.error("Error updating advisor profile:", updateError);
      return NextResponse.json(
        { error: "Failed to update profile" },
        { status: 500 }
      );
    }

    // Also update the users table if needed
    const { error: userUpdateError } = await supabase
      .from("users")
      .update({
        plan: planId,
        plan_active: true,
        plan_expires_at: finalExpiryDate,
      })
      .eq("id", user.id);

    if (userUpdateError) {
      console.error("Error updating user plan:", userUpdateError);
      // Don't fail completely, advisor profile was updated
    }

    return NextResponse.json({
      success: true,
      message: "Advisor profile updated with subscription",
      expiryDate: finalExpiryDate,
    });
  } catch (err) {
    console.error("Update advisor profile error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
