import crypto from "crypto";
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { createAdminClient } from "@/lib/supabase/server";

const supabase = createAdminClient()

export async function POST(req) {
  try {
    const body = await req.json();

    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = body;
 
    // 🔒 1. Validate input
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json(
        { error: "Missing payment fields" },
        { status: 400 }
      );
    }

    // 🔐 2. Verify signature
    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (generatedSignature !== razorpay_signature) {
      return NextResponse.json(
        { error: "Invalid signature" },
        { status: 400 }
      );
    }

    //  3. Fetch payment from DB
    const { data: existingPayment, error: fetchError } = await supabase
      .from("advisor_payments")
      .select("*")
      .eq("razorpay_order_id", razorpay_order_id)
      .single();

    if (fetchError || !existingPayment) {
      return NextResponse.json(
        { error: "Payment record not found" },
        { status: 404 }
      );
    }

    //  4. Idempotency check
    if (existingPayment.status === "paid") {
      return NextResponse.json({
        success: true,
        message: "Already processed",
      });
    }

    // If already processing, avoid duplicate updates
    if (existingPayment.status === "processing") {
      return NextResponse.json({
        success: true,
        message: "Already in processing",
      });
    }

    // ✅ 5. Update to PROCESSING (NOT PAID)
    const { error: updateError } = await supabase
      .from("advisor_payments")
      .update({
        status: "processing",
        razorpay_payment_id,
        razorpay_signature,
      })
      .eq("razorpay_order_id", razorpay_order_id);

    if (updateError) {
      console.error("Update error:", updateError);
      return NextResponse.json(
        { error: "DB update failed" },
        { status: 500 }
      );
    }

    // ✅ 6. Return success (temporary)
    return NextResponse.json({
      success: true,
      status: "success",
    });

  } catch (err) {
    console.error("Verify payment error:", err);

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}