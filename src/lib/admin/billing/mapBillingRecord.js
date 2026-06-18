const PAID_PLANS = new Set(["silver", "gold", "platinum"]);

export function isPaidPlan(planId) {
  const key = String(planId || "free").toLowerCase();
  return key !== "free" && key !== "";
}

export function formatPlanLabel(planId) {
  const key = String(planId || "free").toLowerCase();
  if (key === "free") return "Free";
  return key.charAt(0).toUpperCase() + key.slice(1);
}

export function resolveBillingStatus(expiresAt, now = new Date()) {
  if (!expiresAt) return { key: "unknown", label: "No expiry set", tone: "slate" };

  const expiry = new Date(expiresAt);
  if (Number.isNaN(expiry.getTime())) {
    return { key: "unknown", label: "No expiry set", tone: "slate" };
  }

  const msLeft = expiry.getTime() - now.getTime();
  const daysRemaining = Math.ceil(msLeft / (1000 * 60 * 60 * 24));

  if (daysRemaining < 0) {
    return { key: "expired", label: "Expired", tone: "danger", daysRemaining };
  }

  if (daysRemaining <= 30) {
    return { key: "expiring_soon", label: "Expiring soon", tone: "warning", daysRemaining };
  }

  return { key: "active", label: "Active", tone: "success", daysRemaining };
}

export function mapBillingRow(input = {}) {
  const planKey = String(input.subscription_plan || "free").toLowerCase();
  const billingStatus = resolveBillingStatus(input.subscription_expires_at, input.now);

  return {
    id: input.user_id || input.id,
    userId: input.user_id || input.id,
    profileId: input.profile_id || input.id,
    advisorName: input.advisor_name || "Advisor",
    designation: input.designation || null,
    email: input.email || null,
    phone: input.phone || null,
    city: input.city || null,
    planKey,
    planLabel: formatPlanLabel(planKey),
    isPaid: isPaidPlan(planKey),
    billingStatus: billingStatus.key,
    billingStatusLabel: billingStatus.label,
    billingStatusTone: billingStatus.tone,
    daysRemaining: billingStatus.daysRemaining ?? null,
    subscriptionStartedAt: input.subscription_started_at || null,
    subscriptionExpiresAt: input.subscription_expires_at || null,
    accountStatus: input.account_status || "active",
    lastPaymentAt: input.last_payment_at || null,
    lastPaymentAmountInr: input.last_payment_amount_inr ?? null,
    lastPaymentPlanId: input.last_payment_plan_id || null,
    lastPaymentOrderId: input.last_payment_order_id || null,
    profileSlug: input.profile_slug || null,
  };
}
