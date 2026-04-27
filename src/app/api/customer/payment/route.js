// app/api/create-order/route.js (Next.js App Router)
import { createAdminClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import Razorpay from "razorpay";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export async function POST(request) {
  try {
    const { amount, planId, userEmail, userName } = await request.json();

    const supabase = createAdminClient();
    const options = {
      amount: amount,
      currency: "INR",
      receipt: `receipt_${planId}_${Date.now()}`,
      notes: {
        planId: planId,
        userEmail: userEmail,
        userName: userName,
      },
    };

    const order = await razorpay.orders.create(options);

    return NextResponse.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
    });
  } catch (error) {
    console.error("Order creation error:", error);
    return NextResponse.json(
      { error: "Failed to create order" },
      { status: 500 }
    );
  }
}