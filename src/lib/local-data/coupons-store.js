import { randomUUID } from "crypto";
import { localDataAvailable } from "@/lib/local-data/advisor-approvals";
import { useSupabasePersistence } from "@/lib/supabase/persistence-mode";
import {
  applyCouponToAmount,
  couponStatusLabel,
  formatDiscountLabel,
  generateCouponCode,
  normalizeCouponCode,
} from "@/lib/admin/coupons/couponUtils";
import { readJsonFile, writeJsonFile } from "@/lib/local-data/paths";

const COUPONS_FILE = "coupons.json";

function emptyDb() {
  return { coupons: {} };
}

function loadDb() {
  return readJsonFile(COUPONS_FILE, emptyDb());
}

function saveDb(db) {
  writeJsonFile(COUPONS_FILE, db);
}

function isExpired(coupon, now = new Date()) {
  if (!coupon?.expiresAt) return false;
  return new Date(coupon.expiresAt).getTime() < now.getTime();
}

function refreshCouponStatus(coupon, now = new Date()) {
  if (!coupon) return coupon;
  if (coupon.status === "revoked" || coupon.status === "redeemed") return coupon;
  if (isExpired(coupon, now)) return { ...coupon, status: "expired" };
  return coupon;
}

function normalizeCoupon(record = {}) {
  const maxRedemptions = Math.max(1, Number(record.maxRedemptions) || 1);
  const redemptionCount = Math.max(0, Number(record.redemptionCount) || 0);

  return {
    id: record.id || randomUUID(),
    code: normalizeCouponCode(record.code),
    label: record.label || "",
    discountType: record.discountType === "fixed" ? "fixed" : "percent",
    discountValue: Number(record.discountValue) || 0,
    appliesTo: Array.isArray(record.appliesTo) ? record.appliesTo : [],
    assignedEmail: record.assignedEmail ? String(record.assignedEmail).trim().toLowerCase() : null,
    assignedUserId: record.assignedUserId || null,
    maxRedemptions,
    redemptionCount,
    status: record.status || "active",
    expiresAt: record.expiresAt || null,
    createdAt: record.createdAt || new Date().toISOString(),
    createdByAdminId: record.createdByAdminId || null,
    reservedAt: record.reservedAt || null,
    reservedByUserId: record.reservedByUserId || null,
    reservedOrderId: record.reservedOrderId || null,
    redeemedAt: record.redeemedAt || null,
    redeemedByUserId: record.redeemedByUserId || null,
    redeemedByEmail: record.redeemedByEmail || null,
    redeemedPaymentId: record.redeemedPaymentId || null,
  };
}

export function enrichCoupon(coupon) {
  const normalized = refreshCouponStatus(normalizeCoupon(coupon));
  return {
    ...normalized,
    discountLabel: formatDiscountLabel(normalized),
    statusLabel: couponStatusLabel(normalized.status),
    appliesToLabel:
      normalized.appliesTo.length > 0
        ? normalized.appliesTo.map((id) => id.charAt(0).toUpperCase() + id.slice(1)).join(", ")
        : "All paid plans",
    isSingleUse: normalized.maxRedemptions === 1,
    remainingRedemptions: Math.max(0, normalized.maxRedemptions - normalized.redemptionCount),
  };
}

export function useCouponsStore() {
  return localDataAvailable() || useSupabasePersistence();
}

export function listCoupons() {
  const db = loadDb();
  return Object.values(db.coupons || {})
    .map(enrichCoupon)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export function getCouponsSnapshot() {
  const coupons = listCoupons();
  return {
    coupons,
    overview: {
      total: coupons.length,
      active: coupons.filter((item) => item.status === "active").length,
      redeemed: coupons.filter((item) => item.status === "redeemed").length,
      reserved: coupons.filter((item) => item.status === "reserved").length,
      revoked: coupons.filter((item) => item.status === "revoked").length,
    },
  };
}

function findCouponByCode(code) {
  const normalized = normalizeCouponCode(code);
  if (!normalized) return null;
  const db = loadDb();
  return (
    Object.values(db.coupons || {}).find((item) => normalizeCouponCode(item.code) === normalized) ||
    null
  );
}

function validateCouponForCheckout(coupon, input = {}) {
  const now = input.now || new Date();
  const refreshed = refreshCouponStatus(normalizeCoupon(coupon), now);

  if (!refreshed.code) return { error: "Invalid coupon", status: 400 };
  if (refreshed.status === "revoked") return { error: "This coupon has been revoked", status: 400 };
  if (refreshed.status === "redeemed") return { error: "This coupon has already been used", status: 400 };
  if (refreshed.status === "expired" || isExpired(refreshed, now)) {
    return { error: "This coupon has expired", status: 400 };
  }

  if (refreshed.redemptionCount >= refreshed.maxRedemptions) {
    return { error: "This coupon has already been used", status: 400 };
  }

  if (refreshed.status === "reserved") {
    const sameUser = input.userId && refreshed.reservedByUserId === input.userId;
    if (!sameUser) {
      return { error: "This coupon is already reserved for checkout", status: 400 };
    }
  } else if (refreshed.status !== "active") {
    return { error: "This coupon is not available", status: 400 };
  }

  const planId = String(input.planId || "").toLowerCase();
  if (refreshed.appliesTo.length > 0 && planId && !refreshed.appliesTo.includes(planId)) {
    return { error: `This coupon does not apply to the ${planId} plan`, status: 400 };
  }

  if (refreshed.assignedUserId && input.userId && refreshed.assignedUserId !== input.userId) {
    return { error: "This coupon is assigned to another advisor", status: 403 };
  }

  if (refreshed.assignedEmail && input.userEmail) {
    const assigned = refreshed.assignedEmail.toLowerCase();
    const actual = String(input.userEmail).trim().toLowerCase();
    if (assigned !== actual) {
      return { error: "This coupon is assigned to a different email address", status: 403 };
    }
  }

  if (refreshed.discountValue <= 0) {
    return { error: "This coupon has no discount configured", status: 400 };
  }

  return { coupon: refreshed };
}

export function previewCouponDiscount(code, input = {}) {
  const coupon = findCouponByCode(code);
  if (!coupon) return { error: "Coupon not found", status: 404 };

  const validation = validateCouponForCheckout(coupon, input);
  if (validation.error) return validation;

  const baseAmountInr = Math.max(0, Math.round(Number(input.baseAmountInr) || 0));
  const applied = applyCouponToAmount(baseAmountInr, validation.coupon);

  return {
    coupon: enrichCoupon(validation.coupon),
    baseAmountInr,
    amountInr: applied.amountInr,
    discountInr: applied.discountInr,
  };
}

export function createCoupon(payload = {}, adminId = null) {
  const db = loadDb();
  const code = normalizeCouponCode(payload.code) || generateCouponCode();
  const duplicate = Object.values(db.coupons || {}).some(
    (item) => normalizeCouponCode(item.code) === code,
  );
  if (duplicate) return { error: "Coupon code already exists", status: 409 };

  const discountValue = Number(payload.discountValue);
  if (!discountValue || discountValue <= 0) {
    return { error: "Discount value must be greater than zero", status: 400 };
  }

  const discountType = payload.discountType === "fixed" ? "fixed" : "percent";
  if (discountType === "percent" && discountValue > 100) {
    return { error: "Percent discount cannot exceed 100", status: 400 };
  }

  const coupon = normalizeCoupon({
    id: randomUUID(),
    code,
    label: payload.label?.trim() || "",
    discountType,
    discountValue,
    appliesTo: Array.isArray(payload.appliesTo) ? payload.appliesTo : [],
    assignedEmail: payload.assignedEmail?.trim() || null,
    assignedUserId: payload.assignedUserId || null,
    maxRedemptions: Number(payload.maxRedemptions) || 1,
    status: "active",
    expiresAt: payload.expiresAt || null,
    createdByAdminId: adminId,
    createdAt: new Date().toISOString(),
  });

  db.coupons[coupon.id] = coupon;
  saveDb(db);
  return { success: true, coupon: enrichCoupon(coupon) };
}

export function revokeCoupon(couponId) {
  const db = loadDb();
  const coupon = db.coupons?.[couponId];
  if (!coupon) return { error: "Coupon not found", status: 404 };
  if (coupon.status === "redeemed") {
    return { error: "Redeemed coupons cannot be revoked", status: 400 };
  }

  db.coupons[couponId] = {
    ...coupon,
    status: "revoked",
    reservedAt: null,
    reservedByUserId: null,
    reservedOrderId: null,
  };
  saveDb(db);
  return { success: true, coupon: enrichCoupon(db.coupons[couponId]) };
}

export function reserveCouponForOrder(code, input = {}) {
  const db = loadDb();
  const coupon = findCouponByCode(code);
  if (!coupon) return { error: "Coupon not found", status: 404 };

  const validation = validateCouponForCheckout(coupon, input);
  if (validation.error) return validation;

  const record = db.coupons[validation.coupon.id];
  if (!record) return { error: "Coupon not found", status: 404 };

  if (record.status === "reserved" && record.reservedByUserId === input.userId) {
    record.reservedAt = new Date().toISOString();
    record.reservedOrderId = input.orderId || record.reservedOrderId;
    saveDb(db);
    return { coupon: enrichCoupon(record) };
  }

  record.status = "reserved";
  record.reservedAt = new Date().toISOString();
  record.reservedByUserId = input.userId || null;
  record.reservedOrderId = input.orderId || null;
  saveDb(db);
  return { coupon: enrichCoupon(record) };
}

export function redeemCoupon(code, input = {}) {
  const db = loadDb();
  const coupon = findCouponByCode(code);
  if (!coupon) return { error: "Coupon not found", status: 404 };

  const record = db.coupons[coupon.id];
  if (!record) return { error: "Coupon not found", status: 404 };

  if (record.status === "redeemed" || record.redemptionCount >= record.maxRedemptions) {
    return { error: "Coupon already redeemed", status: 400 };
  }

  if (record.status === "reserved" && input.userId && record.reservedByUserId !== input.userId) {
    return { error: "Coupon reserved by another user", status: 403 };
  }

  const nextCount = record.redemptionCount + 1;
  record.redemptionCount = nextCount;
  record.redeemedAt = new Date().toISOString();
  record.redeemedByUserId = input.userId || record.reservedByUserId || null;
  record.redeemedByEmail = input.userEmail || null;
  record.redeemedPaymentId = input.paymentId || null;
  record.reservedAt = null;
  record.reservedByUserId = null;
  record.reservedOrderId = null;
  record.status = nextCount >= record.maxRedemptions ? "redeemed" : "active";
  saveDb(db);
  return { success: true, coupon: enrichCoupon(record) };
}

export function releaseReservedCoupon(code, userId) {
  const db = loadDb();
  const coupon = findCouponByCode(code);
  if (!coupon) return { error: "Coupon not found", status: 404 };

  const record = db.coupons[coupon.id];
  if (!record || record.status !== "reserved") {
    return { success: true, coupon: enrichCoupon(record || coupon) };
  }

  if (userId && record.reservedByUserId && record.reservedByUserId !== userId) {
    return { error: "Cannot release coupon reserved by another user", status: 403 };
  }

  record.status = "active";
  record.reservedAt = null;
  record.reservedByUserId = null;
  record.reservedOrderId = null;
  saveDb(db);
  return { success: true, coupon: enrichCoupon(record) };
}
