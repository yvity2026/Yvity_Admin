import { randomBytes } from "crypto";

export function normalizeCouponCode(value) {
  return String(value ?? "")
    .trim()
    .toUpperCase()
    .replace(/\s+/g, "");
}

export function generateCouponCode(prefix = "YVITY") {
  const token = randomBytes(3).toString("hex").toUpperCase();
  return `${prefix}-${token}`;
}

export function computeCouponDiscountInr(baseAmountInr, coupon) {
  const base = Math.max(0, Math.round(Number(baseAmountInr) || 0));
  if (!coupon || base <= 0) return 0;

  const discountType = coupon.discountType || "percent";
  const discountValue = Number(coupon.discountValue) || 0;

  if (discountType === "fixed") {
    return Math.min(base, Math.round(discountValue));
  }

  const percent = Math.min(100, Math.max(0, discountValue));
  return Math.round((base * percent) / 100);
}

export function applyCouponToAmount(baseAmountInr, coupon) {
  const discountInr = computeCouponDiscountInr(baseAmountInr, coupon);
  return {
    amountInr: Math.max(0, Math.round(Number(baseAmountInr) || 0) - discountInr),
    discountInr,
  };
}

export function formatDiscountLabel(coupon) {
  if (!coupon) return "";
  if (coupon.discountType === "fixed") {
    return `₹${Number(coupon.discountValue || 0).toLocaleString("en-IN")} off`;
  }
  return `${Number(coupon.discountValue || 0)}% off`;
}

export function couponStatusLabel(status) {
  const map = {
    active: "Active",
    reserved: "Reserved",
    redeemed: "Redeemed",
    revoked: "Revoked",
    expired: "Expired",
  };
  return map[status] || status;
}
