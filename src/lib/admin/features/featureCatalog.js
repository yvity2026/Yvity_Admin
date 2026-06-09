import { PLAN_LIMITS } from "@/lib/admin/plans/planCatalog";

/** Built-in tiers — custom plans (e.g. platinum) are added from membership config. */
export const BUILTIN_PLAN_TIERS = ["free", "silver", "gold"];

export const DEFAULT_GLOBAL_FLAGS = {
  membershipCheckoutEnabled: true,
  couponRedemptionEnabled: true,
  advisorSelfServiceUpgrade: true,
  galleryUploadsEnabled: true,
  introVideoUploadsEnabled: true,
  publicSearchEnabled: true,
  serviceVerificationEnabled: true,
};

export const GLOBAL_FLAG_DEFS = [
  {
    key: "membershipCheckoutEnabled",
    label: "Membership checkout",
    description: "Allow advisors to pay for Silver and Gold via Razorpay.",
  },
  {
    key: "couponRedemptionEnabled",
    label: "Coupon redemption",
    description: "Allow coupon codes at checkout (requires checkout enabled).",
  },
  {
    key: "advisorSelfServiceUpgrade",
    label: "Self-service upgrade",
    description: "Advisors can upgrade or renew from their dashboard.",
  },
  {
    key: "galleryUploadsEnabled",
    label: "Gallery uploads",
    description: "Master switch for gallery photo uploads (plan caps still apply).",
  },
  {
    key: "introVideoUploadsEnabled",
    label: "Intro video uploads",
    description: "Master switch for intro video uploads (plan limits still apply).",
  },
  {
    key: "publicSearchEnabled",
    label: "Public advisor search",
    description: "Platform-wide search directory (Gold plan still required per advisor).",
  },
  {
    key: "serviceVerificationEnabled",
    label: "Service verification",
    description: "Allow verified-service badges when plan entitlements allow it.",
  },
];

export const LIMIT_FIELD_DEFS = [
  {
    key: "testimonialsText",
    label: "Text testimonials",
    group: "Testimonials",
    type: "unlimited_or_number",
    hint: "Use Unlimited or a number",
  },
  {
    key: "testimonialsAudio",
    label: "Audio testimonials",
    group: "Testimonials",
    type: "limit",
    hint: "Number or Unlimited",
  },
  {
    key: "testimonialsVideo",
    label: "Video testimonials",
    group: "Testimonials",
    type: "limit",
    hint: "Number or Unlimited",
  },
  {
    key: "galleryPhotos",
    label: "Gallery photos",
    group: "Profile content",
    type: "limit",
  },
  {
    key: "introVideoSeconds",
    label: "Intro video length (seconds)",
    group: "Profile content",
    type: "number",
    hint: "0 disables intro video",
  },
  {
    key: "introVideoHeroPlacement",
    label: "Intro video in hero",
    group: "Profile content",
    type: "boolean",
  },
  {
    key: "recommendations",
    label: "Recommendations",
    group: "Engagement",
    type: "limit",
  },
  {
    key: "leadsVisible",
    label: "Leads visible",
    group: "Engagement",
    type: "limit",
  },
  {
    key: "profileThemes",
    label: "Profile themes",
    group: "Profile content",
    type: "limit",
  },
  {
    key: "serviceVerification",
    label: "Service verification",
    group: "Trust & visibility",
    type: "boolean",
  },
  {
    key: "yvityVerifiedBadge",
    label: "YVITY verified badge",
    group: "Trust & visibility",
    type: "boolean",
  },
  {
    key: "searchAppearance",
    label: "Search appearance",
    group: "Trust & visibility",
    type: "boolean",
  },
  {
    key: "profileAnalytics",
    label: "Profile analytics",
    group: "Trust & visibility",
    type: "boolean",
  },
  {
    key: "featuredAdvisorEligibility",
    label: "Featured advisor eligibility",
    group: "Trust & visibility",
    type: "boolean",
  },
];

export function getDefaultPlanLimits() {
  return JSON.parse(JSON.stringify(PLAN_LIMITS));
}

export function formatLimitDisplay(value) {
  if (value === true) return "Yes";
  if (value === false) return "No";
  if (value === "Unlimited") return "Unlimited";
  return String(value ?? "—");
}

export function normalizeLimitInput(value, type) {
  if (type === "boolean") return Boolean(value);

  if (type === "number") {
    const num = Number(value);
    return Number.isFinite(num) ? Math.max(0, Math.round(num)) : 0;
  }

  if (type === "unlimited_or_number") {
    const raw = String(value ?? "").trim();
    if (!raw || raw.toLowerCase() === "unlimited") return "Unlimited";
    const num = Number(raw);
    return Number.isFinite(num) ? Math.max(0, Math.round(num)) : "Unlimited";
  }

  const raw = String(value ?? "").trim();
  if (!raw) return 0;
  if (raw.toLowerCase() === "unlimited") return "Unlimited";
  const num = Number(raw);
  return Number.isFinite(num) ? Math.max(0, Math.round(num)) : "Unlimited";
}
