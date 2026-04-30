import Razorpay from "razorpay";
import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";
import { ValidateUser } from "@/lib/auth/ValidateUser";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

const supabase = createAdminClient();

// 🔒 Backend-controlled plans
const PLANS = {
  silver: { amount: 100, name: "SILVER" },
  gold: { amount: 10, name: "GOLD" },
};

const PLAN_ORDER = {
  gold: 0,
  silver: 1,
  gold: 2,
};

export async function POST(req) {
  try {
    const body = await req.json();
    const { planId } = body;

    //  1. AUTH (source of truth)
    const user = await ValidateUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = user.id;

    // 2. Validate plan
    const plan = PLANS[planId];
    if (!plan) {
      return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
    }

    // 3. Prevent duplicate pending orders
    const { data: existing } = await supabase
      .from("advisor_payments")
      .select("id, status")
      .eq("user_id", userId)
      .in("status", ["created", "processing"])
      .maybeSingle();

    if (existing) {
      return NextResponse.json(
        { error: "Payment already in progress" },
        { status: 409 },
      );
    }

    // plan upgrade only to the higher hirarchy
    const { data: lastPayment } = await supabase
      .from("advisor_payments")
      .select("plan_id, status")
      .eq("user_id", userId)
      .eq("status", "paid")
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (lastPayment) {
      const currentLevel = PLAN_ORDER[lastPayment.plan_id] || 0;
      const newLevel = PLAN_ORDER[planId] || 0;

      if (newLevel <= currentLevel) {
        return NextResponse.json(
          { error: "Only upgrades allowed" },
          { status: 400 },
        );
      }
    }

    // ✅ 4. Create Razorpay order
    const order = await razorpay.orders.create({
      amount: plan.amount,
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
      notes: {
        planId,
        userId,
      },
    });

    // ✅ 5. Insert into DB
    const { error } = await supabase.from("advisor_payments").insert({
      user_id: userId,
      amount: plan.amount,
      currency: "INR",
      status: "created",
      plan_id: planId,
      razorpay_order_id: order.id,
      receipt: order.receipt,
      metadata: {
        planName: plan.name,
      },
    });

    if (error) {
      console.error("DB insert error:", error);

      // ⚠️ optional: cancel order (Razorpay doesn't support true cancel, but log it)
      return NextResponse.json(
        { error: "Failed to store payment" },
        { status: 500 },
      );
    }

    // ✅ 6. Return safe response
    return NextResponse.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
    });
  } catch (err) {
    console.error("Create order error:", err);

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
