import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createAdminClient } from "@/lib/supabase/server";
import {
  createPaymentLink,
  getPaymentsSnapshot,
  usePaymentsStore,
} from "@/lib/local-data/payments-store";

async function parseAdminSession() {
  const cookieStore = await cookies();
  const sessionValue = cookieStore.get("admin_session")?.value;
  if (!sessionValue) return null;

  try {
    return JSON.parse(sessionValue);
  } catch {
    return null;
  }
}

async function requireAdmin() {
  const session = await parseAdminSession();
  if (!session?.admin_id || !session?.role) return null;
  return session;
}

async function getSupabasePayments(request) {
  const supabase = createAdminClient();
  const { searchParams } = new URL(request.url);

  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = parseInt(searchParams.get("limit") || "10", 10);
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  const { data: paymentsData, error: paymentsError, count } = await supabase
    .from("advisor_payments")
    .select("*, user:users(*)", { count: "exact" })
    .order("created_at", { ascending: false })
    .range(from, to);

  if (paymentsError) throw paymentsError;

  const now = new Date();
  const firstDay = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
  const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString();

  const sumRevenue = (arr) =>
    (arr || []).reduce((acc, item) => acc + (item.amount || 0), 0) / 100;

  const [goldRes, silverRes, thisMonthRes] = await Promise.all([
    supabase.from("advisor_payments").select("amount").eq("plan_id", "gold").eq("status", "paid"),
    supabase.from("advisor_payments").select("amount").eq("plan_id", "silver").eq("status", "paid"),
    supabase
      .from("advisor_payments")
      .select("amount")
      .gte("paid_at", firstDay)
      .lte("paid_at", lastDay)
      .eq("status", "paid"),
  ]);

  const output = (paymentsData || []).map((item) => {
    const user = item.user || {};
    return {
      id: item.id,
      userId: user.id,
      advisorName: user.name || "User",
      email: user.email || null,
      phone: user.mobile || null,
      city: user.city || null,
      planKey: item.plan_id,
      planLabel: item.plan_id,
      amountInr: (item.amount || 0) / 100,
      amountLabel: `₹${((item.amount || 0) / 100).toLocaleString("en-IN")}`,
      status: item.status || "pending",
      statusLabel: item.status || "pending",
      razorpayOrderId: item.razorpay_order_id,
      razorpayPaymentId: item.razorpay_payment_id,
      paidAt: item.paid_at,
      createdAt: item.created_at,
      paymentMethod: item.payment_method || "Razorpay",
    };
  });

  return {
    success: true,
    overview: {
      revenueThisMonthInr: sumRevenue(thisMonthRes.data),
      revenueAllTimeInr: sumRevenue(goldRes.data) + sumRevenue(silverRes.data),
      revenueByPlanInr: {
        gold: sumRevenue(goldRes.data),
        silver: sumRevenue(silverRes.data),
      },
      paidCount: output.filter((row) => row.status === "paid").length,
      pendingCount: output.filter((row) => row.status === "created").length,
    },
    payments: output,
    paymentLinks: [],
    planOptions: [],
    advisors: [],
    pagination: {
      page,
      limit,
      total: count || 0,
      totalPages: Math.ceil((count || 0) / limit) || 1,
    },
  };
}

export async function GET(request) {
  const adminSession = await requireAdmin();
  if (!adminSession) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    if (usePaymentsStore()) {
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
  const adminSession = await requireAdmin();
  if (!adminSession) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!usePaymentsStore()) {
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
