import { maskPhoneLast4 } from "@/lib/pii/constants";

export const PLATFORM_SUBJECT = "YVITY Platform";

export function normalizePlatformStatus(status) {
  if (status === "submitted") return "pending";
  if (status === "approved") return "published";
  if (status === "rejected") return "hidden";
  return status || "pending";
}

export function mapPlatformStatusLabel(status) {
  const normalized = normalizePlatformStatus(status);
  if (normalized === "pending") return "Pending approval";
  if (normalized === "published") return "Published";
  if (normalized === "hidden") return "Hidden";
  return normalized.charAt(0).toUpperCase() + normalized.slice(1);
}

export function mapUserTypeLabel(respondentType) {
  if (respondentType === "advisor") return "Professional";
  return "Customer";
}

export function mapPlatformReviewRow(row = {}) {
  const type = row.testimonial_type || row.type || "text";
  const status = normalizePlatformStatus(row.status);
  const phone = String(row.mobile_number || row.mobile || "");
  const respondentType = row.respondent_type || "customer";
  const content = row.content || row.quote || "";
  const platformReply = row.yvity_reply || row.platformReply || "";

  return {
    id: row.id,
    reviewerName: row.name || "Unknown",
    name: row.name || "Unknown",
    profession: row.profession || "",
    city: row.city || "",
    location: row.city ? `${row.city}, IN` : "—",
    subjectLabel: PLATFORM_SUBJECT,
    respondentType,
    respondentLabel: mapUserTypeLabel(respondentType),
    userType: mapUserTypeLabel(respondentType),
    type,
    typeLabel: type.charAt(0).toUpperCase() + type.slice(1),
    rating: Number(row.testimonial_rating ?? row.rating) || 0,
    content,
    quote: content,
    mediaUrl: row.media_url || row.mediaUrl || null,
    preview:
      type === "text"
        ? content.trim().slice(0, 140) || "No text provided"
        : `${type.charAt(0).toUpperCase() + type.slice(1)} review about YVITY`,
    status,
    statusLabel: mapPlatformStatusLabel(row.status),
    visibility: status === "published" ? "public" : status === "hidden" ? "hidden" : "pending",
    visibilityLabel:
      status === "published"
        ? "Published"
        : status === "hidden"
          ? "Hidden"
          : "Pending approval",
    yvityReply: platformReply,
    platformReply,
    hasPlatformReply: Boolean(platformReply?.trim()),
    phoneMasked: maskPhoneLast4(phone.slice(-4)),
    mobile: phone,
    submittedAt: row.created_at || row.submittedAt || null,
    updatedAt: row.updated_at || null,
    canApprove: status === "pending",
    canHide: status === "pending" || status === "published",
    canRestore: status === "hidden",
    isPublished: status === "published",
    isHidden: status === "hidden",
    isPending: status === "pending",
    source: row.source || "supabase",
  };
}

export function mapPlatformReviewForLanding(row = {}) {
  const mapped = mapPlatformReviewRow(row);
  const type = mapped.type;

  return {
    id: mapped.id,
    name: mapped.reviewerName,
    role: `${mapped.profession || "Member"} • ${mapped.city || "India"}`,
    type: mapped.respondentType === "advisor" ? "Advisor" : "Customer",
    text:
      type === "text"
        ? `"${mapped.content}"`
        : `"Shared a ${type} testimonial about their YVITY experience."`,
    rating: mapped.rating,
    status: mapped.isPublished ? "Verified" : "Submitted",
    hasAudio: type === "audio",
    hasVideo: type === "video",
    hasMedia: type === "audio" || type === "video",
    mediaUrl: mapped.mediaUrl,
    audioDuration: row.audio_duration || null,
    replyText: mapped.platformReply || null,
  };
}
