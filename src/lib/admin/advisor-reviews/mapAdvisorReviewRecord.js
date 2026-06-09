import { shortUserId } from "@/lib/admin/users/mapUserRecord";
import { publicProfileUrl } from "@/lib/admin/profiles/mapProfileRecord";
import {
  ADVISOR_TESTIMONIAL_FLAG_THRESHOLD,
  RISK_FLAG_LABELS,
  maskPhoneLast4,
} from "@/lib/pii/constants";
import {
  isAutoPublishedStatus,
  normalizeAdvisorPlan,
  planCapLabel,
} from "@/lib/admin/advisor-reviews/planVisibility";

export function mapRiskFlags(flags = []) {
  return (Array.isArray(flags) ? flags : [])
    .map((flag) => ({
      key: flag,
      label: RISK_FLAG_LABELS[flag] || flag,
    }))
    .filter((item) => item.key);
}

export function mapAdvisorReviewRow(row = {}, context = {}) {
  const type = row.testimonial_type || row.type || "text";
  const visibility = row.admin_visibility || "public";
  const riskScore = Number(row.risk_score) || 0;
  const reportedCount = Number(row.reported_count) || 0;
  const phone = String(row.mobile_number || row.mobile || "");
  const advisor = context.advisor || row.advisor || {};
  const profile = context.profile || row.profile || {};
  const advisorId = row.advisor_id || advisor.id || null;
  const advisorName = advisor.name || advisor.fullName || context.advisorName || "—";
  const advisorPlan = normalizeAdvisorPlan(
    profile.subscription_plan || context.advisorPlan || "free",
  );
  const advisorReply = row.reply_text || row.advisorReply?.text || "";
  const isAutoPublished = isAutoPublishedStatus(row.status);
  const isFlagged = riskScore >= ADVISOR_TESTIMONIAL_FLAG_THRESHOLD;
  const isLiveOnProfile =
    isAutoPublished && visibility === "public" && row.status !== "rejected";
  const needsAttention =
    isFlagged || reportedCount > 0 || visibility !== "public";

  return {
    id: row.id,
    advisorId,
    advisorName,
    advisorShortId: shortUserId(advisorId),
    advisorCity: advisor.city || profile.city || null,
    advisorPlan,
    advisorPlanLabel: advisorPlan.charAt(0).toUpperCase() + advisorPlan.slice(1),
    planCapHint: planCapLabel(advisorPlan, type),
    advisorProfileUrl: publicProfileUrl(profile) || null,
    reviewerName: row.name || "Unknown",
    reviewerUserId: row.user_id || null,
    service: row.service || row.service_type || null,
    type,
    typeLabel: type.charAt(0).toUpperCase() + type.slice(1),
    rating: Number(row.testimonial_rating ?? row.rating) || 0,
    content: row.content || row.quote || "",
    mediaUrl: row.media_url || null,
    preview:
      type === "text"
        ? (row.content || row.quote || "").trim().slice(0, 140) || "No text provided"
        : `${type.charAt(0).toUpperCase() + type.slice(1)} review attached`,
    isAutoPublished,
    publishLabel: isAutoPublished ? "Auto-published" : "Not live",
    isLiveOnProfile,
    visibility,
    visibilityLabel:
      visibility === "public"
        ? "Public"
        : visibility === "hidden"
          ? "Hidden"
          : "Removed",
    riskScore,
    isFlagged,
    riskFlags: mapRiskFlags(row.risk_flags),
    reportedCount,
    needsAttention,
    isVerified: Boolean(row.is_mobile_verified ?? row.verified),
    phoneMasked: maskPhoneLast4(phone.slice(-4)),
    hasAdvisorReply: Boolean(advisorReply?.trim()),
    advisorReply,
    advisorReplyAt: row.reply_created_at || row.advisorReply?.repliedOn || null,
    adminNote: row.admin_note || "",
    submittedAt: row.created_at || row.submittedAt || null,
    updatedAt: row.updated_at || null,
    adminReviewedAt: row.admin_reviewed_at || null,
    canModerate: visibility !== "removed",
    canRestore: visibility !== "public",
  };
}
