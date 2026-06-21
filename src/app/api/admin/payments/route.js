import { NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/admin/adminSession";
import { createAdminClient } from "@/lib/supabase/server";
import { createPaymentLink, getPaymentsSnapshot } from "@/lib/local-data/payments-store";
import { localDataAvailable } from "@/lib/local-data/advisor-approvals";

function formatPlanLabel(planId) {
  const key = String(planId || "—").toLowerCase();
  if (key === "free") return "Free";
  return key.charAt(0).toUpperCase() + key.slice(1);
}

function formatPhone(phone) {
  if (!phone) return null;
  const digits = String(phone).replace(/\D/g, "").slice(-10);
  if (digits.length === 10) return `+91 ${digits.slice(0, 5)} ${digits.slice(5)}`;
  return phone;
}

async function getSupabasePayments(request) {
  const supabase = createAdminClient();
  const { searchParams } = new URL(request.url);

  const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
  const limit = Math.min(50, Math.max(1, parseInt(searchParams.get("limit") || "20", 10)));
  const filter = searchParams.get("filter") || "all";
  const search = (searchParams.get("search") || "").trim().toLowerCase();
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  // Build filtered query
  let query = supabase
    .from("advisor_payments")
    .select("*, user:users(id, name, email, mobile, city)", { count: "exact" })
    .order("created_at", { ascending: false });

  if (filter === "paid") query = query.eq("status", "paid");
  else if (filter === "pending") query = query.eq("status", "created");
  else if (filter === "failed") query = query.eq("status", "failed");

  // Fetch all for search (then paginate in-memory), or paginate directly when no search
  let allRows = [];
  let total = 0;

  if (search) {
    // Need all rows to search across fields
    const { data, error } = await query;
    if (error) throw error;
    allRows = (data || []).filter((item) => {
      const u = item.user || {};
      return [u.name, u.email, u.mobile, item.plan_id, item.razorpay_order_id, item.razorpay_payment_id]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(search);
    });
    total = allRows.length;
    allRows = allRows.slice(from, to + 1);
  } else {
    const { data, error, count } = await query.range(from, to);
    if (error) throw error;
    allRows = data || [];
    total = count || 0;
  }

  // Fetch advisor profiles for designation
  const userIds = [...new Set(allRows.map((r) => r.user_id).filter(Boolean))];
  const profileMap = {};
  if (userIds.length) {
    const { data: profiles } = await supabase
      .from("advisor_profiles")
      .select("advisor_id, designation")
      .in("advisor_id", userIds);
    for (const p of profiles || []) profileMap[p.advisor_id] = p;
  }

  // Overview totals (always across ALL paid payments — not just current page)
  const now = new Date();
  const firstDay = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();

  const [allPaidRes, thisMonthRes, goldRes, silverRes, pendingRes] = await Promise.all([
    supabase.from("advisor_payments").select("amount").eq("status", "paid"),
    supabase.from("advisor_payments").select("amount").eq("status", "paid").gte("paid_at", firstDay),
    supabase.from("advisor_payments").select("amount").eq("plan_id", "gold").eq("status", "paid"),
    supabase.from("advisor_payments").select("amount").eq("plan_id", "silver").eq("status", "paid"),
    supabase.from("advisor_payments").select("id", { count: "exact", head: true }).eq("status", "created"),
  ]);

  const sumInr = (arr) => (arr || []).reduce((acc, r) => acc + (r.amount || 0), 0);

  const output = allRows.map((item) => {
    const user = item.user || {};
    const profile = profileMap[item.user_id] || {};
    return {
      id: item.id,
      userId: item.user_id,
      advisorName: user.name || "Advisor",
      designation: profile.designation || null,
      email: user.email || null,
      phone: formatPhone(user.mobile),
      city: user.city || null,
      planKey: item.plan_id,
      planLabel: formatPlanLabel(item.plan_id),
      amountInr: item.amount || 0,
      amountLabel: `₹${(item.amount || 0).toLocaleString("en-IN")}`,
      checkoutKind: item.checkout_kind || "purchase",
      couponCode: item.coupon_code || null,
      couponDiscountInr: item.coupon_discount || 0,
      status: item.status || "created",
      statusLabel: item.status === "paid" ? "Paid" : item.status === "failed" ? "Failed" : "Pending",
      razorpayOrderId: item.razorpay_order_id || null,
      razorpayPaymentId: item.razorpay_payment_id || null,
      paidAt: item.paid_at || null,
      createdAt: item.created_at || null,
      paymentMethod: item.payment_method || "Razorpay",
    };
  });

  return {
    success: true,
    overview: {
      revenueThisMonthInr: sumInr(thisMonthRes.data),
      revenueAllTimeInr: sumInr(allPaidRes.data),
      revenueByPlanInr: {
        gold: sumInr(goldRes.data),
        silver: sumInr(silverRes.data),
      },
      paidCount: (allPaidRes.data || []).length,
      pendingCount: pendingRes.count || 0,
    },
    payments: output,
    paymentLinks: [],
    planOptions: [],
    advisors: [],
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.max(1, Math.ceil(total / limit)),
    },
  };
}

export async function GET(request) {
  const adminSession = await requireAdminSession();
  if (!adminSession) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    if (localDataAvailable()) {
      const { searchParams } = new URL(request.url);
      return NextResponse.json(
        getPaymentsSnapshot({
          filter: searchParams.get("filter") || "all",
          search: searchParams.get("search") || "",
          sort: searchParams.get("sort") || "recent",
          page: searchParams.get("page") || 1,
          limit: searchParams.get("limit") || 20,
        }),
      );
    }

    return NextResponse.json(await getSupabasePayments(request));
  } catch (error) {
    console.error("Admin payments GET failed", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request) {
  const adminSession = await requireAdminSession();
  if (!adminSession) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!localDataAvailable()) {
    return NextResponse.json(
      { error: "Payment links are available in local data mode only for now" },
      { status: 501 },
    );
  }

  let payload;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { action } = payload;

  try {
    if (action === "create_payment_link") {
      const result = createPaymentLink(payload);
      if (result.error) {
        return NextResponse.json({ error: result.error }, { status: result.status || 400 });
      }
      return NextResponse.json(result);
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error) {
    console.error("Admin payments POST failed", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
