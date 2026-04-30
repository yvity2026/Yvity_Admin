import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";
import { ValidateUser } from "@/lib/auth/ValidateUser";

const supabase = createAdminClient();

/**
 * GET /api/advisor/subscription/payments
 * Fetch advisor payment history with detailed information
 * Query params:
 *  - limit: number of records (default: 50)
 *  - offset: pagination offset (default: 0)
 *  - status: filter by status (paid, failed, processing, created)
 */
export async function GET(req) {
  try {
    // 🔒 1. AUTHENTICATION (source of truth)
    const user = await ValidateUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = user.id;

    // 2. Parse query parameters
    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get("limit")) || 50;
    const offset = parseInt(searchParams.get("offset")) || 0;
    const statusFilter = searchParams.get("status");

    // 3. Build query
    let query = supabase
      .from("advisor_payments")
      .select(
        `
        id,
        user_id,
        amount,
        currency,
        status,
        plan_id,
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
        payment_method,
        receipt,
        failure_reason,
        webhook_verified,
        paid_at,
        metadata,
        created_at,
        updated_at
      `
      )
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    // 4. Apply filters
    if (statusFilter) {
      const validStatuses = ["paid", "failed", "processing", "created"];
      if (validStatuses.includes(statusFilter)) {
        query = query.eq("status", statusFilter);
      }
    }

    // 5. Apply pagination
    query = query.range(offset, offset + limit - 1);

    // 6. Execute query
    const { data, error, count } = await query;

    if (error) {
      console.error("Database error:", error);
      return NextResponse.json(
        { error: "Failed to fetch payments" },
        { status: 500 }
      );
    }

    // 7. Format response
    const formattedData = data.map((payment) => ({
      ...payment,
      // Format dates for display
      paid_at_formatted: payment.paid_at
        ? new Date(payment.paid_at).toLocaleDateString("en-IN", {
            year: "numeric",
            month: "short",
            day: "numeric",
          })
        : "-",
      created_at_formatted: new Date(payment.created_at).toLocaleDateString(
        "en-IN",
        {
          year: "numeric",
          month: "short",
          day: "numeric",
        }
      ),
      // Format amount with currency
      amount_formatted: `${payment.currency || "₹"} ${(payment.amount / 100).toFixed(2)}`,
    }));

    return NextResponse.json(
      {
        success: true,
        data: formattedData,
        pagination: {
          limit,
          offset,
          total: count,
          hasMore: offset + limit < count,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Payment fetch error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
