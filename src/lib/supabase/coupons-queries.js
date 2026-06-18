import { createAdminClient } from "@/lib/supabase/server";
import { enrichCoupon } from "@/lib/local-data/coupons-store";
import {
  generateCouponCode,
  normalizeCouponCode,
} from "@/lib/admin/coupons/couponUtils";

function dbRowToCoupon(row) {
  return {
    id: row.id,
    code: row.code,
    label: row.label || "",
    discountType: row.discount_type,
    discountValue: Number(row.discount_value),
    appliesTo: row.applies_to || [],
    assignedEmail: row.assigned_email || null,
    assignedUserId: row.assigned_user_id || null,
    maxRedemptions: row.max_redemptions,
    redemptionCount: row.redemption_count,
    status: row.status,
    expiresAt: row.expires_at || null,
    createdAt: row.created_at,
    createdByAdminId: row.created_by_admin_id || null,
    reservedAt: row.reserved_at || null,
    reservedByUserId: row.reserved_by_user_id || null,
    reservedOrderId: row.reserved_order_id || null,
    redeemedAt: row.redeemed_at || null,
    redeemedByUserId: row.redeemed_by_user_id || null,
    redeemedByEmail: row.redeemed_by_email || null,
    redeemedPaymentId: row.redeemed_payment_id || null,
  };
}

export async function getCouponsSnapshotFromSupabase() {
  const supabase = createAdminClient();
  const { data = [] } = await supabase
    .from("coupons")
    .select("*")
    .order("created_at", { ascending: false });

  const coupons = data.map((row) => enrichCoupon(dbRowToCoupon(row)));
  return {
    coupons,
    overview: {
      total: coupons.length,
      active: coupons.filter((c) => c.status === "active").length,
      redeemed: coupons.filter((c) => c.status === "redeemed").length,
      reserved: coupons.filter((c) => c.status === "reserved").length,
      revoked: coupons.filter((c) => c.status === "revoked").length,
    },
  };
}

export async function createCouponInSupabase(payload = {}, adminId = null) {
  const supabase = createAdminClient();

  const code = normalizeCouponCode(payload.code) || generateCouponCode();

  const { data: existing } = await supabase
    .from("coupons")
    .select("id")
    .eq("code", code)
    .maybeSingle();
  if (existing) return { error: "Coupon code already exists", status: 409 };

  const discountValue = Number(payload.discountValue);
  if (!discountValue || discountValue <= 0)
    return { error: "Discount value must be greater than zero", status: 400 };

  const discountType = payload.discountType === "fixed" ? "fixed" : "percent";
  if (discountType === "percent" && discountValue > 100)
    return { error: "Percent discount cannot exceed 100", status: 400 };

  const row = {
    code,
    label: payload.label?.trim() || "",
    discount_type: discountType,
    discount_value: discountValue,
    applies_to: Array.isArray(payload.appliesTo) ? payload.appliesTo : [],
    assigned_email: payload.assignedEmail?.trim()?.toLowerCase() || null,
    assigned_user_id: payload.assignedUserId || null,
    max_redemptions: Number(payload.maxRedemptions) || 1,
    redemption_count: 0,
    status: "active",
    expires_at: payload.expiresAt || null,
    created_by_admin_id: adminId || null,
  };

  const { data: inserted, error } = await supabase
    .from("coupons")
    .insert(row)
    .select()
    .single();

  if (error) return { error: error.message || "Failed to create coupon", status: 500 };

  return { success: true, coupon: enrichCoupon(dbRowToCoupon(inserted)) };
}

export async function revokeCouponInSupabase(couponId) {
  const supabase = createAdminClient();

  const { data: row } = await supabase
    .from("coupons")
    .select("id, status")
    .eq("id", couponId)
    .maybeSingle();

  if (!row) return { error: "Coupon not found", status: 404 };
  if (row.status === "redeemed") return { error: "Redeemed coupons cannot be revoked", status: 400 };

  const { data: updated, error } = await supabase
    .from("coupons")
    .update({
      status: "revoked",
      reserved_at: null,
      reserved_by_user_id: null,
      reserved_order_id: null,
    })
    .eq("id", couponId)
    .select()
    .single();

  if (error) return { error: "Failed to revoke coupon", status: 500 };

  return { success: true, coupon: enrichCoupon(dbRowToCoupon(updated)) };
}

export async function createCouponInSupabaseRaw(fields = {}) {
  const supabase = createAdminClient();
  const { data, error } = await supabase.from("coupons").insert(fields).select().single();
  if (error) return { error: error.message, status: 500 };
  return { success: true, coupon: enrichCoupon(dbRowToCoupon(data)), id: data.id };
}
