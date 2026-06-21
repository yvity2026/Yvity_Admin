import { createAdminClient } from "@/lib/supabase/server";
import { mapBillingRow } from "@/lib/admin/billing/mapBillingRecord";
import { getPlatformConfig } from "@/lib/supabase/platform-configs";

async function fetchAllRows() {
  const supabase = createAdminClient();

  const [{ data: profiles = [] }, { data: payments = [] }] = await Promise.all([
    supabase.from("advisor_profiles").select(
      "id, advisor_id, designation, subscription_plan, subscription_activated_at, subscription_expires_at, account_status, profile_slug",
    ),
    supabase
      .from("advisor_payments")
      .select("user_id, paid_at, amount, plan_id, razorpay_order_id, status")
      .eq("status", "paid")
      .order("paid_at", { ascending: false }),
  ]);

  const userIds = [...new Set(profiles.map((p) => p.advisor_id).filter(Boolean))];
  const { data: users = [] } = userIds.length
    ? await supabase.from("users").select("id, name, email, mobile, city").in("id", userIds)
    : { data: [] };

  const userMap = Object.fromEntries(users.map((u) => [u.id, u]));
  const latestPaymentMap = {};
  for (const p of payments) {
    if (!latestPaymentMap[p.user_id]) latestPaymentMap[p.user_id] = p;
  }

  const now = new Date();
  return profiles.map((profile) => {
    const userId = profile.advisor_id;
    const user = userMap[userId] || {};
    const pmt = latestPaymentMap[userId] || null;
    return mapBillingRow({
      id: profile.id,
      profile_id: profile.id,
      user_id: userId,
      advisor_name: user.name || "Advisor",
      designation: profile.designation || null,
      email: user.email || null,
      phone: user.mobile || null,
      city: user.city || null,
      subscription_plan: profile.subscription_plan,
      subscription_started_at: profile.subscription_activated_at || null,
      subscription_expires_at: profile.subscription_expires_at || null,
      account_status: profile.account_status,
      profile_slug: profile.profile_slug,
      last_payment_at: pmt?.paid_at || null,
      last_payment_amount_inr: pmt?.amount ?? null,
      last_payment_plan_id: pmt?.plan_id || null,
      last_payment_order_id: pmt?.razorpay_order_id || null,
      now,
    });
  });
}

function filterRows(rows, filter) {
  if (filter === "paid") return rows.filter((r) => r.isPaid);
  if (filter === "active") return rows.filter((r) => r.isPaid && r.billingStatus === "active");
  if (filter === "expiring_soon")
    return rows.filter((r) => r.isPaid && r.billingStatus === "expiring_soon");
  if (filter === "expired") return rows.filter((r) => r.isPaid && r.billingStatus === "expired");
  if (filter === "free") return rows.filter((r) => !r.isPaid);
  return rows;
}

function sortRows(rows, sort) {
  const copy = [...rows];
  if (sort === "expiry_desc")
    return copy.sort((a, b) =>
      String(b.subscriptionExpiresAt || "").localeCompare(String(a.subscriptionExpiresAt || "")),
    );
  if (sort === "name") return copy.sort((a, b) => a.advisorName.localeCompare(b.advisorName));
  return copy.sort((a, b) =>
    String(a.subscriptionExpiresAt || "9999").localeCompare(
      String(b.subscriptionExpiresAt || "9999"),
    ),
  );
}

async function loadLivePriceMap() {
  try {
    const stored = await getPlatformConfig("plan_pricing");
    if (stored?.plans?.length) {
      return Object.fromEntries(
        stored.plans.map((p) => [p.id, Number(p.salePriceInr) || 0]),
      );
    }
  } catch {}
  return {};
}

async function buildOverview(rows) {
  const paid = rows.filter((r) => r.isPaid);
  const active = paid.filter((r) => r.billingStatus === "active");
  let annualRunRate = 0;
  try {
    const priceMap = await loadLivePriceMap();
    annualRunRate = active.reduce((sum, r) => sum + (priceMap[r.planKey] || 0), 0);
  } catch {}
  return {
    totalSubscriptions: rows.length,
    paidSubscriptions: paid.length,
    activePaid: active.length,
    expiringSoon: paid.filter((r) => r.billingStatus === "expiring_soon").length,
    expired: paid.filter((r) => r.billingStatus === "expired").length,
    freePlans: rows.filter((r) => !r.isPaid).length,
    annualRunRateInr: annualRunRate,
  };
}

export async function getBillingSnapshotFromSupabase(options = {}) {
  const filter = options.filter || "all";
  const sort = options.sort || "expiry_asc";
  const search = String(options.search || "").trim().toLowerCase();
  const page = Math.max(1, Number(options.page) || 1);
  const limit = Math.min(50, Math.max(1, Number(options.limit) || 20));

  const allRows = await fetchAllRows();
  let rows = filterRows(allRows, filter);
  rows = sortRows(rows, sort);

  if (search) {
    rows = rows.filter((row) =>
      [row.advisorName, row.email, row.phone, row.planLabel, row.planKey, row.userId, row.lastPaymentOrderId]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(search),
    );
  }

  const total = rows.length;
  const paginated = rows.slice((page - 1) * limit, page * limit);
  return {
    overview: await buildOverview(allRows),
    subscriptions: paginated,
    pagination: { page, limit, total, totalPages: Math.max(1, Math.ceil(total / limit)) },
    filters: { applied: filter, sort, search },
  };
}

export async function extendSubscriptionInSupabase(userId, input = {}) {
  const supabase = createAdminClient();

  const { data: profile, error } = await supabase
    .from("advisor_profiles")
    .select(
      "id, subscription_plan, subscription_expires_at, subscription_activated_at, designation",
    )
    .eq("advisor_id", userId)
    .maybeSingle();

  if (error || !profile) return { error: "Advisor profile not found", status: 404 };

  const planKey = String(profile.subscription_plan || "free").toLowerCase();
  if (planKey === "free") return { error: "Cannot extend billing for a free plan", status: 400 };

  const extendDays = Number(input.extendDays) || 365;
  const base =
    profile.subscription_expires_at && new Date(profile.subscription_expires_at) > new Date()
      ? new Date(profile.subscription_expires_at)
      : new Date();
  const nextExpiry = new Date(base);
  nextExpiry.setDate(nextExpiry.getDate() + extendDays);

  const updates = {
    subscription_expires_at: nextExpiry.toISOString(),
    billing_extended_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
  if (input.note) updates.billing_admin_note = String(input.note).trim();

  const { error: upErr } = await supabase
    .from("advisor_profiles")
    .update(updates)
    .eq("advisor_id", userId);

  if (upErr) return { error: "Failed to extend subscription", status: 500 };

  return {
    success: true,
    subscription: mapBillingRow({
      user_id: userId,
      advisor_name: profile.designation,
      subscription_plan: planKey,
      subscription_expires_at: nextExpiry.toISOString(),
      now: new Date(),
    }),
  };
}
