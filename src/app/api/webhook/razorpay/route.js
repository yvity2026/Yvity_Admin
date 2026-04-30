import crypto from "crypto";
import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";

const supabase = createAdminClient();

export async function POST(req) {
  let rawBody;

  try {
    rawBody = await req.text();
    const signature = req.headers.get("x-razorpay-signature");

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_WEBHOOK_SECRET)
      .update(rawBody)
      .digest("hex");

    if (signature !== expectedSignature) {
      return new NextResponse("Invalid signature", { status: 400 });
    }

    const event = JSON.parse(rawBody);

    let orderId = null;
    let paymentId = null;

    // ==============================
    // 🎯 PAYMENT SUCCESS
    // ==============================
    if (event.event === "payment.captured") {
      const payment = event.payload.payment.entity;

      paymentId = payment.id;
      orderId = payment.order_id;

      const { data: existing } = await supabase
        .from("advisor_payments")
        .select("status")
        .eq("razorpay_payment_id", paymentId)
        .single();

      if (existing?.status === "paid") {
        return NextResponse.json({ status: "already_processed" });
      }

      const { data: dbPayment, error: fetchError } = await supabase
        .from("advisor_payments")
        .select("*")
        .eq("razorpay_order_id", orderId)
        .single();

      if (fetchError || !dbPayment) {
        console.error("Payment not found for order:", orderId);
        return NextResponse.json({ status: "not_found" });
      }

      const { error: updateError } = await supabase
        .from("advisor_payments")
        .update({
          razorpay_payment_id: paymentId,
          payment_method: payment.method,
          status: "paid",
          webhook_verified: true,
          paid_at: new Date().toISOString(),
        })
        .eq("razorpay_order_id", orderId);

      if (updateError) {
        console.error("Update error:", updateError);
        return NextResponse.json({ status: "db_error" });
      }

      // 🚀 PLAN ACTIVATION (YOUR LOGIC)
      await supabase
        .from("advisor_profiles")
        .update({
          subscription_plan: dbPayment.plan_id,
          plan_active: true,
          subscription_expires_at: add1Year(),
        })
        .eq("id", dbPayment.user_id);

      // ✅ SAFE RPC CALL (ONLY WHEN VALID)
      await supabase.rpc("handle_successful_payment", {
        p_order_id: orderId,
        p_payment_id: paymentId,
      });
    }

    // ==============================
    // ❌ PAYMENT FAILED
    // ==============================
    if (event.event === "payment.failed") {
      const payment = event.payload.payment.entity;

      await supabase
        .from("advisor_payments")
        .update({
          status: "failed",
          failure_reason: payment.error_description,
          webhook_verified: true,
        })
        .eq("razorpay_order_id", payment.order_id);
    }

    return NextResponse.json({ status: "ok" });
  } catch (err) {
    console.error("Webhook error:", err);
    return new NextResponse("Webhook error", { status: 500 });
  }
}