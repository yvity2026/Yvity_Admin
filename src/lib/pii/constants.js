/** Shared enums for complaints, campaigns, and PII audit (mirror DB types). */

export const COMPLAINT_ENTITY_TYPES = [
  "advisor_testimonial",
  "platform_testimonial",
  "advisor_profile",
  "user_account",
  "lead",
  "payment",
  "other",
];

export const COMPLAINT_STATUSES = ["open", "in_review", "resolved", "dismissed"];

export const COMPLAINT_PRIORITIES = ["low", "medium", "high", "urgent"];

export const COMPLAINT_REASONS = {
  fake_review: "Fake review",
  not_a_client: "Not a client",
  harassment: "Harassment",
  spam: "Spam",
  wrong_target: "Wrong advisor / target",
  privacy: "Privacy concern",
  fraud: "Fraud",
  other: "Other",
};

export const MARKETING_CHANNELS = ["whatsapp", "email", "sms", "push"];

export const CAMPAIGN_STATUSES = [
  "draft",
  "scheduled",
  "sending",
  "sent",
  "cancelled",
  "failed",
];

export const CAMPAIGN_AUDIENCES = [
  "all_users",
  "customers",
  "advisors",
  "plan_gold",
  "plan_silver",
  "plan_free",
  "custom_segment",
];

export const PII_ACCESS_ACTIONS = [
  "view_complaint_contact",
  "view_user_contact",
  "view_lead_contact",
  "decrypt_for_campaign_send",
  "export_masked",
];

export const TESTIMONIAL_ADMIN_VISIBILITY = {
  public: "public",
  hidden: "hidden",
  removed: "removed",
};

export const RISK_FLAG_LABELS = {
  duplicate_text: "Duplicate text across advisors",
  burst_reviews: "Burst of reviews in 24h",
  cross_advisor_mobile: "Same mobile on many advisors",
  mutual_ring: "Mutual review ring",
  advisor_mobile_match: "Reviewer matches advisor mobile",
  generic_text: "Generic / very short text",
  profanity: "Blocked words",
  unverified_mobile: "Mobile not verified",
};

/** Auto-flag advisor testimonials when risk_score >= this (publish still allowed). */
export const ADVISOR_TESTIMONIAL_FLAG_THRESHOLD = 40;

/** Mask phone for admin list views: +91 •••• •••132 */
export function maskPhoneLast4(last4) {
  const tail = String(last4 || "").replace(/\D/g, "").slice(-4);
  if (!tail) return "—";
  return `+91 •••• •••${tail}`;
}

export function maskEmailDomain(domain) {
  if (!domain) return "•••@•••";
  return `•••@${domain}`;
}
