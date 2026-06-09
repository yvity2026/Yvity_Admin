import { mapBillingRow } from "@/lib/admin/billing/mapBillingRecord";
import { localDataAvailable } from "@/lib/local-data/advisor-approvals";
import { useSupabasePersistence } from "@/lib/supabase/persistence-mode";
import { listConfiguredPlans } from "@/lib/local-data/membership-plans-store";
import { readJsonFile, writeJsonFile } from "@/lib/local-data/paths";

const PROFILES_FILE = "advisor-profiles.json";
const REGISTRATION_FILE = "registration.json";
const PAYMENTS_FILE = "advisor-payments.json";

function loadProfilesDb() {
  return readJsonFile(PROFILES_FILE, { profiles: {} });
}

function saveProfilesDb(db) {
  writeJsonFile(PROFILES_FILE, db);
}

function loadRegistration() {
  return readJsonFile(REGISTRATION_FILE, { users: [] });
}

function loadPaymentsDb() {
  return readJsonFile(PAYMENTS_FILE, { payments: {} });
}

function findUser(registration, userId) {
  return (registration.users || []).find((user) => user.id === userId) ?? null;
}

function deriveExpiryFromProfile(profile) {
  if (profile.subscription_expires_at) return profile.subscription_expires_at;
  const anchor =
    profile.subscription_started_at ||
    profile.approved_at ||
    profile.submitted_at ||
    null;
  if (!anchor) return null;
  const started = new Date(anchor);
  if (Number.isNaN(started.getTime())) return null;
  const expires = new Date(started);
  expires.setFullYear(expires.getFullYear() + 1);
  return expires.toISOString();
}

function latestPaymentForUser(payments = [], userId) {
  return payments
    .filter((payment) => payment.user_id === userId && payment.status === "paid")
    .sort((a, b) => (b.paid_at || b.created_at || "").localeCompare(a.paid_at || a.created_at || ""))[0];
}

function buildBillingRows(now = new Date()) {
  const profilesDb = loadProfilesDb();
  const registration = loadRegistration();
  const payments = Object.values(loadPaymentsDb().payments || {});

  return Object.values(profilesDb.profiles || {}).map((profile) => {
    const userId = profile.user_id || profile.advisor_id;
    const user = findUser(registration, userId);
    const lastPayment = latestPaymentForUser(payments, userId);

    return mapBillingRow({
      id: profile.id,
      profile_id: profile.id,
      user_id: userId,
      advisor_name: profile.designation || user?.fullName || user?.name || "Advisor",
      email: user?.email || null,
      phone: user?.phone || user?.mobile || null,
      city: user?.city || null,
      subscription_plan: profile.subscription_plan,
      subscription_started_at: profile.subscription_started_at,
      subscription_expires_at: deriveExpiryFromProfile(profile),
      account_status: profile.account_status,
      profile_slug: profile.profile_slug,
      last_payment_at: lastPayment?.paid_at || null,
      last_payment_amount_inr: lastPayment?.amount_inr ?? null,
      last_payment_plan_id: lastPayment?.plan_id || null,
      last_payment_order_id: lastPayment?.razorpay_order_id || null,
      now,
    });
  });
}

function filterBillingRows(rows, filter = "all") {
  if (filter === "paid") {
    return rows.filter((row) => row.isPaid);
  }
  if (filter === "active") {
    return rows.filter((row) => row.isPaid && row.billingStatus === "active");
  }
  if (filter === "expiring_soon") {
    return rows.filter((row) => row.isPaid && row.billingStatus === "expiring_soon");
  }
  if (filter === "expired") {
    return rows.filter((row) => row.isPaid && row.billingStatus === "expired");
  }
  if (filter === "free") {
    return rows.filter((row) => !row.isPaid);
  }
  return rows;
}

function sortBillingRows(rows, sort = "expiry_asc") {
  const copy = [...rows];
  if (sort === "expiry_desc") {
    return copy.sort((a, b) =>
      String(b.subscriptionExpiresAt || "").localeCompare(String(a.subscriptionExpiresAt || "")),
    );
  }
  if (sort === "name") {
    return copy.sort((a, b) => a.advisorName.localeCompare(b.advisorName));
  }
  return copy.sort((a, b) =>
    String(a.subscriptionExpiresAt || "9999").localeCompare(String(b.subscriptionExpiresAt || "9999")),
  );
}

function buildOverview(rows, planPrices = {}) {
  const paid = rows.filter((row) => row.isPaid);
  const active = paid.filter((row) => row.billingStatus === "active");
  const expiringSoon = paid.filter((row) => row.billingStatus === "expiring_soon");
  const expired = paid.filter((row) => row.billingStatus === "expired");

  const annualRunRate = active.reduce((sum, row) => {
    const price = planPrices[row.planKey] || 0;
    return sum + price;
  }, 0);

  return {
    totalSubscriptions: rows.length,
    paidSubscriptions: paid.length,
    activePaid: active.length,
    expiringSoon: expiringSoon.length,
    expired: expired.length,
    freePlans: rows.filter((row) => !row.isPaid).length,
    annualRunRateInr: annualRunRate,
  };
}

function planPriceMap() {
  const plans = listConfiguredPlans();
  return plans.reduce((acc, plan) => {
    acc[plan.id] = plan.salePriceInr || 0;
    return acc;
  }, {});
}

export function useBillingStore() {
  return localDataAvailable() || useSupabasePersistence();
}

export function getBillingSnapshot(options = {}) {
  const filter = options.filter || "all";
  const sort = options.sort || "expiry_asc";
  const search = String(options.search || "").trim().toLowerCase();
  const page = Math.max(1, Number(options.page) || 1);
  const limit = Math.min(50, Math.max(1, Number(options.limit) || 20));

  const allRows = buildBillingRows();
  let rows = filterBillingRows(allRows, filter);
  rows = sortBillingRows(rows, sort);

  if (search) {
    rows = rows.filter((row) => {
      const haystack = [
        row.advisorName,
        row.email,
        row.planLabel,
        row.planKey,
        row.userId,
        row.lastPaymentOrderId,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return haystack.includes(search);
    });
  }

  const total = rows.length;
  const start = (page - 1) * limit;
  const paginated = rows.slice(start, start + limit);

  return {
    overview: buildOverview(allRows, planPriceMap()),
    subscriptions: paginated,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.max(1, Math.ceil(total / limit)),
    },
    filters: {
      applied: filter,
      sort,
      search,
    },
  };
}

export function extendSubscription(userId, input = {}) {
  const db = loadProfilesDb();
  const profile = db.profiles?.[userId];
  if (!profile) return { error: "Advisor profile not found", status: 404 };

  const planKey = String(profile.subscription_plan || "free").toLowerCase();
  if (planKey === "free") {
    return { error: "Cannot extend billing for a free plan", status: 400 };
  }

  const extendDays = Number(input.extendDays) || 365;
  const currentExpiry = deriveExpiryFromProfile(profile);
  const base = currentExpiry && new Date(currentExpiry) > new Date()
    ? new Date(currentExpiry)
    : new Date();

  const nextExpiry = new Date(base);
  nextExpiry.setDate(nextExpiry.getDate() + extendDays);

  profile.subscription_expires_at = nextExpiry.toISOString();
  if (!profile.subscription_started_at) {
    profile.subscription_started_at = new Date().toISOString();
  }
  if (input.note) {
    profile.billing_admin_note = String(input.note).trim();
  }
  profile.billing_extended_at = new Date().toISOString();

  db.profiles[userId] = profile;
  saveProfilesDb(db);

  return {
    success: true,
    subscription: mapBillingRow({
      ...profile,
      user_id: userId,
      advisor_name: profile.designation,
      subscription_expires_at: profile.subscription_expires_at,
      now: new Date(),
    }),
  };
}
