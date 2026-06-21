import { NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/admin/adminSession";
import { createAdminClient } from "@/lib/supabase/server";
import { buildPlansResponse } from "@/lib/admin/plans/mapPlanRecord";
import { buildLocalProductsPlansOverview } from "@/lib/admin/products-plans/buildProductsPlansOverview";
import { formatInr } from "@/lib/admin/payments/mapPaymentRecord";
import { useMembershipPlansStore } from "@/lib/local-data/membership-plans-store";
import { localDataAvailable } from "@/lib/local-data/advisor-approvals";
import { getPricingFromSupabase } from "@/lib/supabase/pricing-queries";

async function countSupabaseSubscribers(planIds = []) {
  const supabase = createAdminClient();
  const counts = {};

  for (const planId of planIds) {
    const { count, error } = await supabase
      .from("advisor_profiles")
      .select("*", { count: "exact", head: true })
      .eq("account_status", "active")
      .eq("subscription_plan", planId);

    if (error) throw error;
    counts[planId] = count || 0;
  }

  return counts;
}

async function buildSupabaseOverview() {
  const supabase = createAdminClient();

  // Use live prices from platform_configs (same source as Pricing page)
  const pricingData = await getPricingFromSupabase();
  const livePlans = pricingData.plans || [];
  const subscriberCounts = await countSupabaseSubscribers(livePlans.map((plan) => plan.id));
  const plansResponse = buildPlansResponse(livePlans, subscriberCounts);

  const [recentPaymentsRes, monthPaymentsRes] = await Promise.all([
    supabase
      .from("advisor_payments")
      .select("*, user:users(*)")
      .eq("status", "paid")
      .order("paid_at", { ascending: false })
      .limit(5),
    supabase
      .from("advisor_payments")
      .select("amount")
      .gte("paid_at", new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString())
      .eq("status", "paid"),
  ]);

  const recentPayments = recentPaymentsRes.data || [];
  const revenueThisMonth = (monthPaymentsRes.data || []).reduce(
    (sum, row) => sum + (Number(row.amount) || 0),
    0,
  );

  const planTiers = configuredPlans
    .filter((plan) => plan.status === "active")
    .map((plan, index) => ({
      id: plan.id,
      name: plan.name,
      emoji: plan.id === "free" ? "🆓" : plan.id === "silver" ? "🥈" : plan.id === "gold" ? "🥇" : "📋",
      color: ["#0D6060", "#94A3B8", "#F59E0B", "#7C3AED"][index % 4],
      totalMembers: subscriberCounts[plan.id] || 0,
      newMembersThisMonth: 0,
      monthlyRevenueInr: (plan.salePriceInr || 0) > 0 ? null : null,
      monthlyRevenueLabel: null,
      isPaid: (plan.salePriceInr || 0) > 0,
    }));

  const total = planTiers.reduce((sum, tier) => sum + tier.totalMembers, 0) || 1;
  const tierMix = planTiers.map((tier) => ({
    id: tier.id,
    label: tier.name,
    emoji: tier.emoji,
    count: tier.totalMembers,
    pct: Math.round((tier.totalMembers / total) * 100),
    color: tier.color,
  }));

  return {
    success: true,
    isLive: true,
    meta: {
      updatedAt: "Just now",
      sectionLabel: "Plans and Pricing",
    },
    overview: plansResponse.overview,
    planTiers,
    tierMix,
    quickStats: [
      {
        id: "active",
        label: "Active subscribers",
        value: Number(plansResponse.overview.totalSubscribers || 0).toLocaleString("en-IN"),
        emoji: "👥",
        hint: "All plan tiers",
        accent: "teal",
      },
      {
        id: "revenue",
        label: "Revenue this month",
        value: formatInr(revenueThisMonth),
        emoji: "💰",
        hint: "Paid transactions",
        accent: "gold",
      },
    ],
    actionCards: [
      { id: "plans", label: "Plans", description: "Manage plans", href: "/admin/plans", emoji: "📋", live: true },
      { id: "pricing", label: "Pricing", description: "Manage pricing", href: "/admin/pricing", emoji: "💰", live: true },
      { id: "coupons", label: "Coupons", description: "Active coupons", href: "/admin/coupons", emoji: "🎟️", live: true },
      { id: "feature_controls", label: "Feature controls", description: "Plan features", href: "/admin/feature-controls", emoji: "⚙️", live: true },
      { id: "billing", label: "Billing", description: "Subscriptions", href: "/admin/billing", emoji: "📅", live: true },
      { id: "payments", label: "Payments", description: "Transactions", href: "/admin/payments", emoji: "💳", live: true },
    ],
    recentUpgrades: (recentPayments || []).map((row) => ({
      id: row.id,
      name: row.user?.name || "Advisor",
      city: row.user?.city || null,
      plan: row.plan_id,
      amount: formatInr(row.amount || 0),
      time: row.paid_at ? new Date(row.paid_at).toLocaleDateString("en-IN") : "Recently",
    })),
    activity: (recentPayments || []).map((row) => ({
      id: `payment-${row.id}`,
      title: `${String(row.plan_id || "Plan").replace(/^./, (c) => c.toUpperCase())} upgrade`,
      detail: `${formatInr(row.amount || 0)} · ${row.user?.name || "Advisor"}`,
      time: row.paid_at ? new Date(row.paid_at).toLocaleDateString("en-IN") : "Recently",
      tone: row.plan_id === "gold" ? "gold" : "success",
    })),
    summaries: {
      annualRunRateLabel: formatInr(plansResponse.overview.annualRunRateInr),
      revenueThisMonthLabel: formatInr(revenueThisMonth),
      paidSubscribers: plansResponse.overview.paidSubscribers,
      expiringSoon: 0,
    },
  };
}

export async function GET() {
  const adminSession = await requireAdminSession();
  if (!adminSession) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    if (localDataAvailable() && useMembershipPlansStore()) {
      return NextResponse.json(buildLocalProductsPlansOverview());
    }

    return NextResponse.json(await buildSupabaseOverview());
  } catch (error) {
    console.error("Admin products-plans GET failed", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
