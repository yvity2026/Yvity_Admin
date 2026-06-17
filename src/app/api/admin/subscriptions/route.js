import { createAdminClient } from "@/lib/supabase/server";
import { getAuthenticatedAdmin } from "@/lib/auth/getAuthenticatedAdmin";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    const admin = await getAuthenticatedAdmin();
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const supabase = createAdminClient();
    const { searchParams } = new URL(req.url);

    const page = Math.max(parseInt(searchParams.get("page") || "1"), 1);
    const limit = Math.min(parseInt(searchParams.get("limit") || "10"), 50);

    const from = (page - 1) * limit;
    const to = from + limit - 1;

    // ── Date range (next 30 days) ──
    const now = new Date();
    const thirtyDaysLater = new Date();
    thirtyDaysLater.setDate(now.getDate() + 30);

    const startDate = now.toISOString();
    const endDate = thirtyDaysLater.toISOString();

    // ── Query with proper join filtering ──
    const { data, error, count } = await supabase
      .from("advisor_payments")
      .select(
        `
        id,
        amount,
        currency,
        status,
        plan_id,
        payment_method,
        paid_at,
        razorpay_order_id,

        user:users (
          id,
          name,
          email,
          mobile,
          city,
          selfie_url,
          advisor_profiles (
            subscription_expires_at
          )
        )
      `,
        { count: "exact" }
      )
      // 🔥 correct filter (inside join)
      .gte("user.advisor_profiles.subscription_expires_at", startDate)
      .lte("user.advisor_profiles.subscription_expires_at", endDate)
      .order("paid_at", { ascending: false })
      .range(from, to);

    if (error) {
      console.error("Query failed:", error);
      return NextResponse.json(
        { success: false, error: "Unable to load expiring plans" },
        { status: 500 }
      );
    }

    // ── Map response ──
    const output = (data || []).map((item) => {
      const user = item.user || {};
      const profile = user.advisor_profiles?.[0] || {};

      return {
        id: item.id,
        name: user.name || "User",
        location: user.city || "Unknown, IN",
        email: user.email || null,
        phone: user.mobile || null,

        plan: item.plan_id,
        amount: (item.amount || 0) / 100,
        method: item.payment_method,

        profile_pic: user.selfie_url || null,
        date: item.paid_at,

        txn_id: item.razorpay_order_id,
        status: item.status || "pending",

        subscription_expires_at: profile.subscription_expires_at || null,
      };
    });

    return NextResponse.json({
      success: true,
      data: output,
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit),
      },
    });
  } catch (error) {
    console.error("GET failed:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
      },
      { status: 500 }
    );
  }
}