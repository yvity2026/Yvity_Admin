import { randomBytes } from "crypto";

export const REFERRAL_STATUSES = {
  registered: "Joined (Free)",
  qualified: "Qualified",
  expired: "Expired",
  invalid: "Invalid",
};

export const REWARD_STATUSES = {
  earned: "Earned",
  claimed: "Claimed",
  pending: "Pending",
  approved: "Approved",
  issued: "Issued",
  redeemed: "Redeemed",
  cancelled: "Cancelled",
};

export const REWARD_TYPES = {
  free_silver_extension: "Free Silver Extension",
  free_gold_extension: "Free Gold Extension",
  silver_upgrade: "Silver Upgrade",
  gold_upgrade: "Gold Upgrade",
  discount_coupon: "Discount Coupon",
  feature_unlock: "Feature Unlock",
  custom_reward: "Custom Reward",
  silver_discount: "Silver upgrade discount",
  gold_discount: "Gold upgrade discount",
  free_upgrade: "Free upgrade",
  special_offer: "Special offer",
  future_credit: "Future credit",
};

export const AMBASSADOR_STATUSES = {
  active: "Active",
  paused: "Paused",
  suspended: "Suspended",
};

export function normalizeReferralCode(value) {
  return String(value ?? "")
    .trim()
    .toUpperCase()
    .replace(/\s+/g, "");
}

export function generateAmbassadorCode(prefix = "YVITY-AMB") {
  const token = randomBytes(3).toString("hex").toUpperCase();
  return `${prefix}-${token}`;
}

export function formatPlanLabel(planId) {
  const key = String(planId || "free").toLowerCase();
  if (key === "free") return "Free";
  return key.charAt(0).toUpperCase() + key.slice(1);
}

export function formatRelativeTime(iso) {
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

export function isSameMonth(iso, now = new Date()) {
  if (!iso) return false;
  const date = new Date(iso);
  return date.getFullYear() === now.getFullYear() && date.getMonth() === now.getMonth();
}
