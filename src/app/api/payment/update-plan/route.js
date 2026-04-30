import { ValidateUser } from "@/lib/auth/ValidateUser";
import { calculateUpgrade } from "@/lib/plan/upgradeCheck";
import { createAdminClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

// ⚠️ add missing imports safely
import Razorpay from "razorpay";
const supabase = createAdminClient();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export async function POST(req) {
  try {
    // ===============================
    // ✅ 1. VALIDATE REQUEST BODY
    // ===============================
    const body = await req.json();
    const { toPlan } = body;

    const allowedPlans = ["free", "silver", "gold"];

    if (!toPlan || typeof toPlan !== "string") {
      return NextResponse.json(
        { error: "Invalid plan" },
        { status: 400 }
      );
    }

    if (!allowedPlans.includes(toPlan)) {
      return NextResponse.json(
        { error: "Plan not allowed" },
        { status: 400 }
      );
    }

    // ===============================
    // ✅ 2. AUTH CHECK
    // ===============================
    const user = await ValidateUser();

    if (!user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const userId = user.id;

    // ===============================
    // ✅ 3. FETCH PROFILE SAFELY
    // ===============================
    const { data: profile, error: profileError } = await supabase
      .from("advisor_profiles")
      .select("subscription_plan, subscription_activated_at")
      .eq("advisor_id", userId)
      .single();

    if (profileError || !profile) {
      return NextResponse.json(
        { error: "Profile not found" },
        { status: 404 }
      );
    }
console.log(profile)
    const fromPlan = profile.subscription_plan;

    if (!fromPlan) {
      return NextResponse.json(
        { error: "Invalid current plan" },
        { status: 400 }
      );
    }

    // ===============================
    // ❌ 4. SAME PLAN CHECK
    // ===============================
    if (fromPlan === toPlan) {
      return NextResponse.json(
        { error: "Already on this plan" },
        { status: 400 }
      );
    }

    // ===============================
    // ❌ 5. PLAN HIERARCHY CHECK (ANTI-DOWNGRADE BUG FIX)
    // ===============================
    const planRank = {
      free: 0,
      silver: 1,
      gold: 2,
    };

    if (planRank[toPlan] < planRank[fromPlan]) {
      return NextResponse.json(
        { error: "Downgrade not allowed here" },
        { status: 400 }
      );
    }

    // ===============================
    // ✅ 6. PRORATION CALCULATION SAFETY
    // ===============================
    if (typeof calculateUpgrade !== "function") {
      return NextResponse.json(
        { error: "Billing system error" },
        { status: 500 }
      );
    }

    const { payable } = calculateUpgrade({
      fromPlan,
      toPlan,
      startDate: profile.subscription_activated_at,
    });
console.log(payable)
    if (typeof payable !== "number" || isNaN(payable)) {
      return NextResponse.json(
        { error: "Invalid billing calculation" },
        { status: 500 }
      );
    }

    // ===============================
    // ✅ 7. FREE UPGRADE HANDLING
    // ===============================
    if (payable <= 0) {
      const { error: updateError } = await supabase
        .from("advisor_profiles")
        .update({
          subscription_plan: toPlan,
          subscription_activated_at: new Date().toISOString(),
        })
        .eq("advisor_id", userId);

      if (updateError) {
        return NextResponse.json(
          { error: "Failed to upgrade" },
          { status: 500 }
        );
      }

      return NextResponse.json({ freeUpgrade: true });
    }

    // ===============================
    // ❌ 8. RAZORPAY SAFETY CHECK
    // ===============================
    if (!razorpay?.orders?.create) {
      return NextResponse.json(
        { error: "Payment gateway error" },
        { status: 500 }
      );
    }

    // ===============================
    // 💳 9. CREATE ORDER
    // ===============================
    const order = await razorpay.orders.create({
      amount: Math.round(payable), // ensure integer
      currency: "INR",
      receipt: `upgrade_${Date.now()}`,
      notes: {
        userId,
        fromPlan,
        toPlan,
        type: "upgrade_prorated",
      },
    });

    if (!order?.id) {
      return NextResponse.json(
        { error: "Order creation failed" },
        { status: 500 }
      );
    }

    // ===============================
    // 💾 10. STORE PAYMENT INTENT SAFELY
    // ===============================
    const { error: insertError } = await supabase
      .from("advisor_payments")
      .insert({
        user_id: userId,
        amount: payable,
        currency: "INR",
        status: "created",
        plan_id: toPlan,
        razorpay_order_id: order.id,
        metadata: {
          fromPlan,
          type: "prorated_upgrade",
        },
      });

    if (insertError) {
      return NextResponse.json(
        { error: "DB insert failed" },
        { status: 500 }
      );
    }

    // ===============================
    // ✅ 11. RESPONSE
    // ===============================
    return NextResponse.json({
      orderId: order.id,
      amount: payable,
    });

  } catch (err) {
    console.error("Upgrade API Error:", err);

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}