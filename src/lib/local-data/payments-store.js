import { randomBytes, randomUUID } from "crypto";
import { mapPaymentLinkRow, mapPaymentRow } from "@/lib/admin/payments/mapPaymentRecord";
import { previewCouponDiscount } from "@/lib/local-data/coupons-store";
import { localDataAvailable } from "@/lib/local-data/advisor-approvals";
import { useSupabasePersistence } from "@/lib/supabase/persistence-mode";
import { listConfiguredPlans } from "@/lib/local-data/membership-plans-store";
import { goldAppBaseUrl, readJsonFile, writeJsonFile } from "@/lib/local-data/paths";

const PAYMENTS_FILE = "advisor-payments.json";
const PAYMENT_LINKS_FILE = "payment-links.json";
const REGISTRATION_FILE = "registration.json";
const PROFILES_FILE = "advisor-profiles.json";

function loadPaymentsDb() {
  return readJsonFile(PAYMENTS_FILE, { payments: {} });
}

function loadPaymentLinksDb() {
  return readJsonFile(PAYMENT_LINKS_FILE, { links: {} });
}

function savePaymentLinksDb(db) {
  writeJsonFile(PAYMENT_LINKS_FILE, db);
}

function loadRegistration() {
  return readJsonFile(REGISTRATION_FILE, { users: [] });
}

function loadProfilesDb() {
  return readJsonFile(PROFILES_FILE, { profiles: {} });
}

function findUser(registration, userId) {
  return (registration.users || []).find((user) => user.id === userId) ?? null;
}

function paidPlans() {
  return listConfiguredPlans().filter((plan) => (plan.salePriceInr || 0) > 0);
}

function resolveBaseAmount(planId) {
  const plan = listConfiguredPlans().find((item) => item.id === planId);
  return Number(plan?.salePriceInr) || 0;
}

function buildShareUrl({ planId, checkoutKind, couponCode }) {
  const base = goldAppBaseUrl();
  const params = new URLSearchParams();
  params.set("pay", planId);
  params.set("checkout", checkoutKind || "purchase");
  if (couponCode) params.set("coupon", couponCode);
  return `${base}/dashboard/my-space?${params.toString()}`;
}

function isSameMonth(iso, now = new Date()) {
  if (!iso) return false;
  const date = new Date(iso);
  return (
    date.getFullYear() === now.getFullYear() && date.getMonth() === now.getMonth()
  );
}

function buildOverview(payments = []) {
  const paid = payments.filter((payment) => payment.status === "paid");
  const thisMonth = paid.filter((payment) => isSameMonth(payment.paid_at || payment.created_at));

  const sum = (rows) => rows.reduce((acc, row) => acc + (Number(row.amount_inr) || 0), 0);

  const byPlan = {};
  for (const payment of paid) {
    const key = payment.plan_id || "unknown";
    byPlan[key] = (byPlan[key] || 0) + (Number(payment.amount_inr) || 0);
  }

  return {
    totalPayments: payments.length,
    paidCount: paid.length,
    pendingCount: payments.filter((payment) => payment.status === "created").length,
    failedCount: payments.filter((payment) => payment.status === "failed").length,
    revenueAllTimeInr: sum(paid),
    revenueThisMonthInr: sum(thisMonth),
    revenueByPlanInr: byPlan,
  };
}

function sortPayments(payments, sort = "recent") {
  const copy = [...payments];
  if (sort === "amount_desc") {
    return copy.sort((a, b) => (b.amount_inr || 0) - (a.amount_inr || 0));
  }
  return copy.sort((a, b) =>
    String(b.paid_at || b.created_at || "").localeCompare(String(a.paid_at || a.created_at || "")),
  );
}

export function usePaymentsStore() {
  return localDataAvailable() || useSupabasePersistence();
}

export function listAdvisorPaymentOptions() {
  const registration = loadRegistration();
  const profilesDb = loadProfilesDb();

  return (registration.users || []).map((user) => {
    const profile = profilesDb.profiles?.[user.id] || {};
    return {
      userId: user.id,
      name: user.fullName || user.name || "Advisor",
      email: user.email || null,
      phone: user.phone || user.mobile || null,
      currentPlan: profile.subscription_plan || "free",
    };
  });
}

export function getPaymentsSnapshot(options = {}) {
  const registration = loadRegistration();
  const paymentsDb = loadPaymentsDb();
  const linksDb = loadPaymentLinksDb();

  const filter = options.filter || "all";
  const search = String(options.search || "").trim().toLowerCase();
  const sort = options.sort || "recent";
  const page = Math.max(1, Number(options.page) || 1);
  const limit = Math.min(50, Math.max(1, Number(options.limit) || 20));

  let payments = Object.values(paymentsDb.payments || {});
  if (filter === "paid") payments = payments.filter((item) => item.status === "paid");
  if (filter === "pending") payments = payments.filter((item) => item.status === "created");
  if (filter === "failed") payments = payments.filter((item) => item.status === "failed");

  payments = sortPayments(payments, sort);

  const rows = payments.map((payment) => {
    const user = findUser(registration, payment.user_id);
    return mapPaymentRow(payment, user || {});
  });

  let filteredRows = rows;
  if (search) {
    filteredRows = rows.filter((row) => {
      const haystack = [
        row.advisorName,
        row.email,
        row.planLabel,
        row.razorpayOrderId,
        row.razorpayPaymentId,
        row.statusLabel,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return haystack.includes(search);
    });
  }

  const total = filteredRows.length;
  const start = (page - 1) * limit;

  const paymentLinks = Object.values(linksDb.links || {})
    .sort((a, b) => String(b.created_at).localeCompare(String(a.created_at)))
    .slice(0, 10)
    .map((link) => {
      const user = findUser(registration, link.user_id);
      return mapPaymentLinkRow(link, user || {});
    });

  return {
    overview: buildOverview(Object.values(paymentsDb.payments || {})),
    payments: filteredRows.slice(start, start + limit),
    paymentLinks,
    planOptions: paidPlans().map((plan) => ({
      id: plan.id,
      name: plan.name,
      salePriceInr: plan.salePriceInr,
      priceLabel: plan.priceLabel,
    })),
    advisors: listAdvisorPaymentOptions(),
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.max(1, Math.ceil(total / limit)),
    },
    filters: { applied: filter, search, sort },
  };
}

export function createPaymentLink(payload = {}) {
  const userId = payload.userId?.trim();
  const planId = String(payload.planId || "").toLowerCase();
  const checkoutKind = payload.checkoutKind || "purchase";
  const couponCode = payload.couponCode?.trim() || null;

  if (!userId) return { error: "Advisor is required", status: 400 };
  if (!planId) return { error: "Plan is required", status: 400 };

  const registration = loadRegistration();
  const user = findUser(registration, userId);
  if (!user) return { error: "Advisor not found", status: 404 };

  const baseAmountInr = resolveBaseAmount(planId);
  if (baseAmountInr <= 0) {
    return { error: "Selected plan has no sale price", status: 400 };
  }

  let amountInr = baseAmountInr;
  if (couponCode) {
    const preview = previewCouponDiscount(couponCode, {
      baseAmountInr,
      userId,
      userEmail: user.email,
      planId,
    });
    if (preview.error) return preview;
    amountInr = preview.amountInr;
  }

  const token = randomBytes(5).toString("hex");
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + (Number(payload.expiresInDays) || 14));

  const shareUrl = buildShareUrl({ planId, checkoutKind, couponCode });
  const link = {
    id: randomUUID(),
    token,
    user_id: userId,
    advisor_name: user.fullName || user.name,
    email: user.email || null,
    phone: user.phone || user.mobile || null,
    plan_id: planId,
    checkout_kind: checkoutKind,
    coupon_code: couponCode,
    amount_inr: amountInr,
    base_amount_inr: baseAmountInr,
    share_url: shareUrl,
    status: "pending",
    note: payload.note?.trim() || null,
    created_at: new Date().toISOString(),
    expires_at: expiresAt.toISOString(),
  };

  const db = loadPaymentLinksDb();
  db.links[link.id] = link;
  savePaymentLinksDb(db);

  const message = [
    `Hi ${user.fullName || user.name},`,
    "",
    `Your YVITY ${planId} membership payment link is ready.`,
    `Amount: ₹${amountInr.toLocaleString("en-IN")}`,
    couponCode ? `Coupon applied: ${couponCode}` : null,
    "",
    shareUrl,
    "",
    "Sign in, then complete checkout on the membership screen.",
  ]
    .filter(Boolean)
    .join("\n");

  return {
    success: true,
    link: mapPaymentLinkRow(link, user),
    shareUrl,
    message,
  };
}
