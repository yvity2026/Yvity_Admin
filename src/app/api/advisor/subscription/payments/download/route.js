import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";
import { ValidateUser } from "@/lib/auth/ValidateUser";

const supabase = createAdminClient();

/**
 * GET /api/advisor/subscription/payments/download/:paymentId
 * Download payment details as JSON/PDF
 */
export async function GET(req) {
  try {
    // 🔒 1. AUTHENTICATION
    const user = await ValidateUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = user.id;

    // 2. Extract payment ID from URL
    const paymentId = req.nextUrl.pathname.split("/").pop();
    if (!paymentId) {
      return NextResponse.json(
        { error: "Payment ID is required" },
        { status: 400 }
      );
    }

    // 3. Fetch payment with authorization check
    const { data: payment, error } = await supabase
      .from("advisor_payments")
      .select("*")
      .eq("id", paymentId)
      .eq("user_id", userId)
      .single();

    if (error || !payment) {
      return NextResponse.json(
        { error: "Payment not found or unauthorized" },
        { status: 404 }
      );
    }

    // 4. Generate payment details document
    const invoiceData = {
      invoice_number: `INV-${payment.id.slice(0, 8).toUpperCase()}`,
      date_generated: new Date().toISOString(),
      payment_id: payment.id,
      razorpay_order_id: payment.razorpay_order_id,
      razorpay_payment_id: payment.razorpay_payment_id,
      amount: payment.amount / 100,
      currency: payment.currency || "INR",
      plan: payment.plan_id,
      status: payment.status,
      payment_method: payment.payment_method || "N/A",
      paid_at: payment.paid_at,
      created_at: payment.created_at,
      updated_at: payment.updated_at,
      receipt: payment.receipt,
      failure_reason: payment.failure_reason,
      metadata: payment.metadata,
      webhook_verified: payment.webhook_verified,
    };

    // 5. Get format from query params
    const { searchParams } = new URL(req.url);
    const format = searchParams.get("format") || "json"; // json or csv

    if (format === "csv") {
      return NextResponse.json(
        {
          success: true,
          message: "CSV download initiated",
          data: invoiceData,
          format: "csv",
        },
        {
          headers: {
            "Content-Disposition": `attachment; filename="payment-${payment.id}.csv"`,
            "Content-Type": "text/csv",
          },
        }
      );
    }

    // Default JSON format
    return NextResponse.json(
      {
        success: true,
        data: invoiceData,
      },
      {
        headers: {
          "Content-Disposition": `attachment; filename="payment-${payment.id}.json"`,
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("Payment download error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
