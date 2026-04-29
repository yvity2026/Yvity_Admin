import crypto from "crypto";
import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";

const supabase = createAdminClient();

export async function POST(req) {
  let rawBody;

  try {
    // ✅ 1. Read RAW body (required for signature verification)
    rawBody = await req.text();
    const signature = req.headers.get("x-razorpay-signature");

    // ✅ 2. Verify signature
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_WEBHOOK_SECRET)
      .update(rawBody)
      .digest("hex");

    if (signature !== expectedSignature) {
      return new NextResponse("Invalid signature", { status: 400 });
    }

    const event = JSON.parse(rawBody);

    // // ✅ 3. Log webhook (optional but HIGHLY recommended)
    // await supabase.from("payment_webhooks").insert({
    //   event_type: event.event,
    //   payload: event,
    //   signature,
    //   is_verified: true,
    // });

    // ==============================
    // 🎯 HANDLE EVENTS
    // ==============================

    if (event.event === "payment.captured") {
      const payment = event.payload.payment.entity;

      const paymentId = payment.id;
      const orderId = payment.order_id;

      // 🔒 4. Idempotency check
      const { data: existing } = await supabase
        .from("advisor_payments")
        .select("status")
        .eq("razorpay_payment_id", paymentId)
        .single();

      if (existing?.status === "paid") {
        return NextResponse.json({ status: "already_processed" });
      }

      // 🔍 5. Fetch by order_id (fallback if payment_id not stored yet)
      const { data: dbPayment, error: fetchError } = await supabase
        .from("advisor_payments")
        .select("*")
        .eq("razorpay_order_id", orderId)
        .single();

      if (fetchError || !dbPayment) {
        console.error("Payment not found for order:", orderId);
        return NextResponse.json({ status: "not_found" });
      }

      // ✅ 6. Update payment → SUCCESS
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

      // 🎯 7. ACTIVATE PLAN (IMPORTANT)
      // 👉 Do this ONLY here (not in verify API)

      // Example:
      await supabase.from("users").update({
        plan: dbPayment.plan_id,
        plan_active: true,
        plan_expires_at: add1Year(),
      }).eq("id", dbPayment.user_id);

    }

    // ==============================
    // ❌ HANDLE FAILURE
    // ==============================

    if (event.event === "payment.failed") {
      const payment = event.payload.payment.entity;

      await supabase
        .from("advisor_payment")
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

    // 🚨 Don't expose internal errors
    return new NextResponse("Webhook error", { status: 500 });
  }
}