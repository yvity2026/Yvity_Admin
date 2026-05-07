import { createAdminClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    const supabase = createAdminClient();
    const { searchParams } = new URL(req.url);

    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    // ── Paginated payments query ──
    const paymentsQuery = supabase
      .from("advisor_payments")
      .select("*, user:users(*)", { count: "exact" })
      .order("created_at", { ascending: false })
      .range(from, to);

    const { data: paymentsData, error: paymentsError, count } = await paymentsQuery;

    if (paymentsError) {
      console.error("Query failed:", paymentsError);
      return NextResponse.json(
        { error: "Unable to load payments" },
        { status: 500 }
      );
    }

    // ── Revenue aggregations ──
    const now = new Date();
    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
    const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString();

    const revenueThisMonth = await supabase
      .from("advisor_payments")
      .select("amount", { count: "exact", head: true }) // only need sum
      .gte("paid_at", firstDay)
      .lte("paid_at", lastDay)
      .eq("status", "paid");

    const sumThisMonth = await supabase
      .from("advisor_payments")
      .select("amount", { count: "exact" })
      .gte("paid_at", firstDay)
      .lte("paid_at", lastDay)
      .eq("status", "paid");

    const goldRevenueQuery = supabase
      .from("advisor_payments")
      .select("amount", { count: "exact" })
      .eq("plan_id", "gold")
      .eq("status", "paid");

    const silverRevenueQuery = supabase
      .from("advisor_payments")
      .select("amount", { count: "exact" })
      .eq("plan_id", "silver")
      .eq("status", "paid");

    // Execute all three queries in parallel
    const [goldRes, silverRes, thisMonthRes] = await Promise.all([
      goldRevenueQuery,
      silverRevenueQuery,
      supabase
        .from("advisor_payments")
        .select("amount", { count: "exact" }),
    ]);

    const sumRevenue = (arr) =>
      (arr.data || []).reduce((acc, item) => acc + (item.amount || 0), 0) / 100;

    const goldRevenue = sumRevenue(goldRes);
    const silverRevenue = sumRevenue(silverRes);
    const revenueThisMonthValue = sumRevenue(
      await supabase
        .from("advisor_payments")
        .select("amount")
        .gte("paid_at", firstDay)
        .lte("paid_at", lastDay)
        .eq("status", "paid")
    );

    // ── Map payment items ──
    const output = (paymentsData || []).map((item) => {
      const user = item.user || {};
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
        date: item.paid_at || null,
        txn_id: item.razorpay_order_id,
        status: item.status || "pending",
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
      revenue: {
        thisMonth: revenueThisMonthValue,
        goldPlan: goldRevenue,
        silverPlan: silverRevenue,
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