import { shortUserId } from "@/lib/admin/users/mapUserRecord";

const CHANGE_LABELS = {
  service_changes: "Service changes",
  profile_changes: "Profile changes",
  verification_updates: "Verification updates",
};

const STATUS_LABELS = {
  pending: { key: "pending", label: "Pending", tone: "warning" },
  approved: { key: "approved", label: "Approved", tone: "success" },
  rejected: { key: "rejected", label: "Rejected", tone: "danger" },
};

export function mapProfileUpdateRequest(row = {}) {
  const statusKey = row.status || "pending";
  const status = STATUS_LABELS[statusKey] || STATUS_LABELS.pending;
  const changeType = row.change_type || row.changeType || "profile_changes";

  return {
    id: row.id,
    profileId: row.profile_id || row.profileId || null,
    userId: row.user_id || row.userId || null,
    userShortId: shortUserId(row.user_id || row.userId),
    name: row.name || "Advisor",
    changeType,
    changeTypeLabel: CHANGE_LABELS[changeType] || changeType,
    industry: row.industry || "—",
    category: row.category || "—",
    service: row.service || "—",
    summary: row.summary || row.description || "",
    documentUrls: row.document_urls || row.documentUrls || [],
    verificationNotes: row.verification_notes || row.verificationNotes || "",
    rejectionReason: row.rejection_reason || row.rejectionReason || "",
    status: status.key,
    statusLabel: status.label,
    statusTone: status.tone,
    submittedAt: row.submitted_at || row.created_at || null,
    canReview: status.key === "pending",
  };
}
