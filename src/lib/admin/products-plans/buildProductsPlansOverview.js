import { buildPlansResponse } from "@/lib/admin/plans/mapPlanRecord";
import { formatInr } from "@/lib/admin/payments/mapPaymentRecord";
import { getBillingSnapshot } from "@/lib/local-data/billing-store";
import { getCouponsSnapshot } from "@/lib/local-data/coupons-store";
import { getMembershipPlansSnapshot } from "@/lib/local-data/membership-plans-store";
import { getPaymentsSnapshot } from "@/lib/local-data/payments-store";
import { readJsonFile } from "@/lib/local-data/paths";

const PROFILES_FILE = "advisor-profiles.json";
const PAYMENTS_FILE = "advisor-payments.json";
const PAYMENT_LINKS_FILE = "payment-links.json";

const PLAN_EMOJI = {
  free: "🆓",
  silver: "🥈",
  gold: "🥇",
  platinum: "💎",
};

const PLAN_COLORS = {
  free: "#0D6060",
  silver: "#94A3B8",
  gold: "#F59E0B",
  platinum: "#7C3AED",
};

const FALLBACK_COLORS = ["#0D6060", "#94A3B8", "#F59E0B", "#7C3AED", "#EC4899", "#0891B2"];

const ACTIVITY_TONES = {
  upgrade: "gold",
  payment: "success",
  coupon: "info",
  expired: "warning",
  link: "info",
};

function formatRelativeTime(iso) {
  if (!iso) return "Recently";
  const then = new Date(iso).getTime();
  const now = Date.now();
  const diffMs = Math.max(0, now - then);
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins} min ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs} hr ago`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days} day${days === 1 ? "" : "s"} ago`;
  return new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short" });
}

function isSameMonth(iso, now = new Date()) {
  if (!iso) return false;
  const date = new Date(iso);
  return date.getFullYear() === now.getFullYear() && date.getMonth() === now.getMonth();
}

function planEmoji(planId) {
  return PLAN_EMOJI[planId] || "📋";
}

function planColor(planId, index = 0) {
  return PLAN_COLORS[planId] || FALLBACK_COLORS[index % FALLBACK_COLORS.length];
}

function countNewMembersThisMonth(now = new Date()) {
  const payments = Object.values(readJsonFile(PAYMENTS_FILE, { payments: {} }).payments || {});
  const byPlan = {};

  for (const payment of payments) {
    if (payment.status !== "paid") continue;
    if (!isSameMonth(payment.paid_at || payment.created_at, now)) continue;
    const key = String(payment.plan_id || "unknown").toLowerCase();
    byPlan[key] = (byPlan[key] || 0) + 1;
  }

  const profiles = Object.values(readJsonFile(PROFILES_FILE, { profiles: {} }).profiles || {});
  let freeNew = 0;
  for (const profile of profiles) {
    if (profile.account_status !== "active") continue;
    if (String(profile.subscription_plan || "free").toLowerCase() !== "free") continue;
    const anchor = profile.submitted_at || profile.approved_at || profile.created_at;
    if (isSameMonth(anchor, now)) freeNew += 1;
  }
  byPlan.free = freeNew;

  return byPlan;
}

function revenueThisMonthByPlan(now = new Date()) {
  const payments = Object.values(readJsonFile(PAYMENTS_FILE, { payments: {} }).payments || {});
  const byPlan = {};

  for (const payment of payments) {
    if (payment.status !== "paid") continue;
    if (!isSameMonth(payment.paid_at || payment.created_at, now)) continue;
    const key = String(payment.plan_id || "unknown").toLowerCase();
    byPlan[key] = (byPlan[key] || 0) + (Number(payment.amount_inr) || 0);
  }

  return byPlan;
}

function buildPlanTiers(plans = [], subscriberCounts = {}, newMembers = {}, revenueByPlan = {}) {
  return plans
    .filter((plan) => plan.status === "active")
    .map((plan, index) => {
      const planId = plan.id;
      const isPaid = (plan.salePriceInr || 0) > 0;
      return {
        id: planId,
        name: plan.name,
        emoji: planEmoji(planId),
        color: planColor(planId, index),
        totalMembers: subscriberCounts[planId] || 0,
        newMembersThisMonth: newMembers[planId] || 0,
        monthlyRevenueInr: isPaid ? revenueByPlan[planId] || 0 : null,
        monthlyRevenueLabel: isPaid ? formatInr(revenueByPlan[planId] || 0) : null,
        isPaid,
      };
    });
}

function buildTierMix(planTiers = []) {
  const total = planTiers.reduce((sum, tier) => sum + tier.totalMembers, 0) || 1;
  return planTiers.map((tier) => ({
    id: tier.id,
    label: tier.name,
    emoji: tier.emoji,
    count: tier.totalMembers,
    pct: Math.round((tier.totalMembers / total) * 100),
    color: tier.color,
  }));
}

function buildRecentUpgrades(payments = [], registration = { users: [] }) {
  const usersById = new Map((registration.users || []).map((user) => [user.id, user]));

  return payments
    .filter((payment) => payment.status === "paid")
    .sort((a, b) =>
      String(b.paid_at || b.created_at || "").localeCompare(String(a.paid_at || a.created_at || "")),
    )
    .slice(0, 5)
    .map((payment) => {
      const user = usersById.get(payment.user_id) || {};
      return {
        id: payment.id,
        name: user.fullName || user.name || "Advisor",
        city: user.city || null,
        plan: String(payment.plan_id || "plan").toLowerCase(),
        amount: formatInr(payment.amount_inr),
        time: formatRelativeTime(payment.paid_at || payment.created_at),
      };
    });
}

function buildActivityFeed({ payments = [], billingRows = [], coupons = [], paymentLinks = [] }) {
  const items = [];

  for (const payment of payments) {
    if (payment.status !== "paid") continue;
    const planLabel = String(payment.plan_id || "plan")
      .replace(/^./, (c) => c.toUpperCase());
    items.push({
      id: `payment-${payment.id}`,
      type: "payment",
      at: payment.paid_at || payment.created_at,
      title: `${planLabel} upgrade`,
      detail: `${formatInr(payment.amount_inr)} · ${payment.coupon_code ? `Coupon ${payment.coupon_code}` : "Payment received"}`,
      tone: payment.plan_id === "gold" ? "gold" : ACTIVITY_TONES.payment,
    });
  }

  for (const row of billingRows) {
    if (row.billingStatus !== "expired") continue;
    items.push({
      id: `expired-${row.userId}`,
      type: "expired",
      at: row.subscriptionExpiresAt,
      title: "Plan expired",
      detail: `${row.planLabel} · ${row.advisorName}`,
      tone: ACTIVITY_TONES.expired,
    });
  }

  for (const coupon of coupons) {
    if (coupon.status !== "redeemed" || !coupon.redeemedAt) continue;
    items.push({
      id: `coupon-${coupon.id}`,
      type: "coupon",
      at: coupon.redeemedAt,
      title: "Coupon used",
      detail: `${coupon.code} · ${coupon.discountLabel}`,
      tone: ACTIVITY_TONES.coupon,
    });
  }

  for (const link of paymentLinks) {
    items.push({
      id: `link-${link.id}`,
      type: "link",
      at: link.createdAt,
      title: "Payment link created",
      detail: `${link.planLabel} · ${link.advisorName}`,
      tone: ACTIVITY_TONES.link,
    });
  }

  return items
    .filter((item) => item.at)
    .sort((a, b) => new Date(b.at).getTime() - new Date(a.at).getTime())
    .slice(0, 10)
    .map((item) => ({
      id: item.id,
      title: item.title,
      detail: item.detail,
      time: formatRelativeTime(item.at),
      tone: item.tone,
    }));
}

function buildQuickStats(overview, billingOverview, paymentsOverview, couponsOverview, tierMix) {
  return [
    {
      id: "active",
      label: "Active subscribers",
      value: Number(overview.totalSubscribers || 0).toLocaleString("en-IN"),
      emoji: "👥",
      hint: "All plan tiers",
      accent: "teal",
    },
    {
      id: "revenue",
      label: "Revenue this month",
      value: formatInr(paymentsOverview.revenueThisMonthInr),
      emoji: "💰",
      hint: "Paid transactions",
      accent: "gold",
    },
    {
      id: "expiring",
      label: "Expiring soon",
      value: String(billingOverview.expiringSoon || 0),
      emoji: "⏳",
      hint: "Within 30 days",
      accent: "coral",
      href: "/admin/billing?filter=expiring_soon",
    },
    {
      id: "coupons",
      label: "Active coupons",
      value: String(couponsOverview.active || 0),
      emoji: "🎟️",
      hint: `${couponsOverview.redeemed || 0} redeemed`,
      accent: "slate",
      href: "/admin/coupons",
    },
  ];
}

function buildActionCards(couponsOverview, billingOverview) {
  return [
    {
      id: "plans",
      label: "Plans",
      description: "Manage plans",
      href: "/admin/plans",
      emoji: "📋",
      live: true,
    },
    {
      id: "pricing",
      label: "Pricing",
      description: "Manage pricing",
      href: "/admin/pricing",
      emoji: "💰",
      live: true,
    },
    {
      id: "coupons",
      label: "Coupons",
      description: "Active coupons",
      href: "/admin/coupons",
      emoji: "🎟️",
      badge: couponsOverview.active || 0,
      live: true,
    },
    {
      id: "feature_controls",
      label: "Feature controls",
      description: "Plan features",
      href: "/admin/feature-controls",
      emoji: "⚙️",
      live: true,
    },
    {
      id: "billing",
      label: "Billing",
      description: "Subscriptions",
      href: "/admin/billing",
      emoji: "📅",
      badge: billingOverview.expiringSoon || 0,
      live: true,
    },
    {
      id: "payments",
      label: "Payments",
      description: "Transactions",
      href: "/admin/payments",
      emoji: "💳",
      live: true,
    },
  ];
}

export function buildLocalProductsPlansOverview() {
  const now = new Date();
  const { plans, subscriberCounts } = getMembershipPlansSnapshot();
  const plansResponse = buildPlansResponse(plans, subscriberCounts);
  const billing = getBillingSnapshot({ limit: 500 });
  const payments = getPaymentsSnapshot({ limit: 50 });
  const coupons = getCouponsSnapshot();
  const newMembers = countNewMembersThisMonth(now);
  const revenueByPlan = revenueThisMonthByPlan(now);
  const planTiers = buildPlanTiers(plans, subscriberCounts, newMembers, revenueByPlan);
  const tierMix = buildTierMix(planTiers);
  const registration = readJsonFile("registration.json", { users: [] });
  const rawPayments = Object.values(readJsonFile(PAYMENTS_FILE, { payments: {} }).payments || {});
  const rawLinks = Object.values(readJsonFile(PAYMENT_LINKS_FILE, { links: {} }).links || {});

  return {
    success: true,
    isLive: true,
    meta: {
      updatedAt: formatRelativeTime(now.toISOString()),
      sectionLabel: "Plans and Pricing",
    },
    overview: plansResponse.overview,
    planTiers,
    tierMix,
    quickStats: buildQuickStats(
      plansResponse.overview,
      billing.overview,
      payments.overview,
      coupons.overview,
      tierMix,
    ),
    actionCards: buildActionCards(coupons.overview, billing.overview),
    recentUpgrades: buildRecentUpgrades(rawPayments, registration),
    activity: buildActivityFeed({
      payments: rawPayments,
      billingRows: billing.subscriptions || [],
      coupons: coupons.coupons || [],
      paymentLinks: rawLinks,
    }),
    summaries: {
      annualRunRateLabel: formatInr(plansResponse.overview.annualRunRateInr),
      revenueThisMonthLabel: formatInr(payments.overview.revenueThisMonthInr),
      paidSubscribers: plansResponse.overview.paidSubscribers,
      expiringSoon: billing.overview.expiringSoon,
    },
  };
}
