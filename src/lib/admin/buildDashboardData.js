import { mapQuickActions } from "@/lib/admin/dashboardQuickActions";

const MONTH_LABELS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function formatINRCompact(amount) {
  const value = Number(amount) || 0;
  if (value >= 100000) return `₹${(value / 100000).toFixed(1)}L`;
  if (value >= 1000) return `₹${(value / 1000).toFixed(1)}K`;
  return `₹${Math.round(value).toLocaleString("en-IN")}`;
}

function formatINRFull(amount) {
  const value = Math.round(Number(amount) || 0);
  return `₹${value.toLocaleString("en-IN")}`;
}

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

function monthKey(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}

function buildMonthlyRevenue(payments = [], monthCount = 6) {
  const now = new Date();
  const buckets = [];

  for (let i = monthCount - 1; i >= 0; i -= 1) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    buckets.push({
      key: monthKey(d),
      month: MONTH_LABELS[d.getMonth()],
      amount: 0,
    });
  }

  const bucketMap = new Map(buckets.map((b) => [b.key, b]));

  for (const payment of payments) {
    if (!payment.paid_at) continue;
    const paidAt = new Date(payment.paid_at);
    const key = monthKey(paidAt);
    const bucket = bucketMap.get(key);
    if (bucket) {
      bucket.amount += Number(payment.amount) || 0;
    }
  }

  const maxAmount = Math.max(...buckets.map((b) => b.amount), 1);

  return buckets.map((b) => ({
    month: b.month,
    amount: Math.round(b.amount),
    label: formatINRCompact(b.amount),
    highlight: b.amount >= maxAmount * 0.85 && b.amount > 0,
  }));
}

function mapPlans(advisors = {}) {
  const free = Number(advisors.free) || 0;
  const silver = Number(advisors.silver) || 0;
  const gold = Number(advisors.gold) || 0;
  const total = free + silver + gold || 1;

  return [
    {
      id: "free",
      label: "Free members",
      emoji: "🆓",
      count: free,
      pct: Math.round((free / total) * 100),
      color: "#0D6060",
    },
    {
      id: "silver",
      label: "Silver members",
      emoji: "🥈",
      count: silver,
      pct: Math.round((silver / total) * 100),
      color: "#94A3B8",
    },
    {
      id: "gold",
      label: "Gold members",
      emoji: "🥇",
      count: gold,
      pct: Math.round((gold / total) * 100),
      color: "#F59E0B",
    },
  ];
}

function mapRecentUpgrades(rows = []) {
  return rows.map((row) => {
    const user = row.user || {};
    const plan = row.plan_id || "plan";
    const amount = (Number(row.amount) || 0) / 100;
    return {
      id: row.id,
      name: user.name || "Advisor",
      city: user.city || null,
      plan,
      amount: formatINRCompact(amount),
      time: formatRelativeTime(row.paid_at || row.created_at),
    };
  });
}

function mapActivity(feed = []) {
  return feed.slice(0, 8).map((item, index) => ({
    id: item.id || `${item.type}-${index}`,
    title: item.title,
    detail: item.detail,
    time: formatRelativeTime(item.at),
    tone: item.tone || "info",
  }));
}

function metric(id, label, value, options = {}) {
  return {
    id,
    label,
    value,
    emoji: options.emoji || null,
    hint: options.hint || null,
    href: options.href || null,
    accent: options.accent || "teal",
    raw: options.raw ?? null,
  };
}

export function buildDashboardData(api = {}, adminName = "Admin") {
  const advisors = api.advisors || {};
  const users = api.users || {};
  const revenue = api.revenue || {};
  const operations = api.operations || {};
  const quick = api.quickActions || {};

  const totalUsers = Number(users.total) || 0;
  const totalProfessionals = Number(users.professionals) || Number(advisors.total) || 0;
  const totalCustomers = Number(users.customers) || Math.max(0, totalUsers - totalProfessionals);
  const liveProfiles = Number(advisors.live) || 0;
  const registrationsToday = Number(users.registrationsToday) || 0;

  return {
    meta: {
      adminName,
      periodLabel: "Last 6 months",
      updatedAt: "Just updated",
    },

    platformGrowth: [
      metric("total-users", "Total users", totalUsers.toLocaleString("en-IN"), {
        emoji: "👥",
        hint: "All accounts",
        accent: "teal",
        raw: totalUsers,
      }),
      metric("professionals", "Total professionals", totalProfessionals.toLocaleString("en-IN"), {
        emoji: "👨‍💼",
        hint: "Advisor profiles",
        href: "/admin/subscribers",
        accent: "teal",
        raw: totalProfessionals,
      }),
      metric("customers", "Total customers", totalCustomers.toLocaleString("en-IN"), {
        emoji: "🙋",
        hint: "Non-advisor users",
        href: "/admin/users",
        accent: "slate",
        raw: totalCustomers,
      }),
      metric("live-profiles", "Live professional profiles", liveProfiles.toLocaleString("en-IN"), {
        emoji: "📄",
        hint: "Verified & active",
        href: "/admin/irdaiapprovals",
        accent: "gold",
        raw: liveProfiles,
      }),
      metric("registrations-today", "New registrations today", registrationsToday.toLocaleString("en-IN"), {
        emoji: "📈",
        hint: "Users + professionals",
        accent: registrationsToday > 0 ? "success" : "slate",
        raw: registrationsToday,
      }),
    ],

    revenue: {
      monthly: formatINRFull(Number(revenue.thisMonth) || 0),
      monthlyCompact: formatINRCompact(Number(revenue.thisMonth) || 0),
      total: formatINRFull(Number(revenue.total) || 0),
      months: buildMonthlyRevenue(revenue.payments || []),
      plans: mapPlans(advisors),
      recentUpgrades: mapRecentUpgrades(revenue.recentUpgrades || []),
    },

    operations: [
      metric(
        "verifications",
        "Pending service verifications",
        String(Number(operations.pendingVerifications) || 0),
        {
          emoji: "🛡",
          hint: "IRDAI & profile queue",
          href: "/admin/irdaiapprovals",
          accent: Number(operations.pendingVerifications) > 0 ? "coral" : "teal",
          raw: Number(operations.pendingVerifications) || 0,
        },
      ),
      metric(
        "complaints",
        "Open complaints",
        String(Number(operations.openComplaints) || 0),
        {
          emoji: "🚩",
          hint: "Needs resolution",
          href: "/admin/complaints",
          accent: Number(operations.openComplaints) > 0 ? "coral" : "slate",
          raw: Number(operations.openComplaints) || 0,
        },
      ),
      metric(
        "reviews",
        "New reviews",
        String(Number(operations.pendingReviews) || 0),
        {
          emoji: "⭐",
          hint:
            Number(operations.newReviewsToday) > 0
              ? `${operations.newReviewsToday} submitted today`
              : "Awaiting moderation",
          href: "/admin/platform-testimonials",
          accent: "gold",
          raw: Number(operations.pendingReviews) || 0,
        },
      ),
      metric(
        "completion",
        "Profile completion",
        `${Number(operations.profileCompletionPct) || 0}%`,
        {
          emoji: "📊",
          hint: "Average across professionals",
          href: "/admin/profiles",
          accent: "teal",
          raw: Number(operations.profileCompletionPct) || 0,
        },
      ),
    ],

    activity: mapActivity(api.activity || []),

    quickActions: mapQuickActions(quick),
  };
}
