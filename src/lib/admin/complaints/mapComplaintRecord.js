import { shortUserId } from "@/lib/admin/users/mapUserRecord";
import {
  COMPLAINT_PRIORITIES,
  COMPLAINT_REASONS,
  COMPLAINT_STATUSES,
} from "@/lib/pii/constants";
import { maskComplaintReporter } from "@/lib/pii/complaintContact";

const ENTITY_LABELS = {
  advisor_testimonial: "Advisor review",
  platform_testimonial: "Platform review",
  advisor_profile: "Advisor profile",
  user_account: "User account",
  lead: "Lead",
  payment: "Payment",
  other: "Other",
};

const ENTITY_ROUTES = {
  advisor_testimonial: "/admin/advisor-testimonials",
  platform_testimonial: "/admin/platform-testimonials",
  advisor_profile: "/admin/profiles",
  user_account: "/admin/users",
  lead: null,
  payment: "/admin/payments",
  other: null,
};

const REPORT_ENTITY_TYPES = new Set([
  "advisor_testimonial",
  "platform_testimonial",
  "advisor_profile",
  "user_account",
  "lead",
]);

const COMPLAINT_ENTITY_TYPES = new Set(["payment", "other"]);

export function isReportCase(entityType) {
  return REPORT_ENTITY_TYPES.has(entityType);
}

export function mapReportSubtype(entityType) {
  if (entityType === "advisor_profile") return { key: "profile", label: "Profile report" };
  if (entityType === "advisor_testimonial" || entityType === "platform_testimonial") {
    return { key: "review", label: "Review report" };
  }
  if (entityType === "lead") return { key: "service", label: "Service report" };
  if (entityType === "user_account") return { key: "user", label: "User report" };
  return { key: "other", label: "Report" };
}

export function mapComplaintCategory(row = {}) {
  if (row.support_category) {
    const labels = {
      support: "Support request",
      payment: "Payment issue",
      subscription: "Subscription issue",
      technical: "Technical issue",
      verification: "Verification issue",
    };
    return {
      key: row.support_category,
      label: labels[row.support_category] || row.support_category,
    };
  }

  if (row.entity_type === "payment" || row.reason === "fraud") {
    return { key: "payment", label: "Payment issue" };
  }
  if (row.reason === "privacy") {
    return { key: "verification", label: "Verification issue" };
  }
  if (String(row.description || "").toLowerCase().includes("subscription")) {
    return { key: "subscription", label: "Subscription issue" };
  }
  if (
    String(row.description || "").toLowerCase().includes("technical") ||
    String(row.description || "").toLowerCase().includes("bug")
  ) {
    return { key: "technical", label: "Technical issue" };
  }
  return { key: "support", label: "Support request" };
}

export function mapComplaintStatus(status) {
  const key = status || "open";
  const labels = {
    open: "Open",
    in_review: "In Progress",
    resolved: "Resolved",
    dismissed: "Closed",
  };
  const tones = {
    open: "warning",
    in_review: "gold",
    resolved: "success",
    dismissed: "slate",
  };
  return { key, label: labels[key] || key, tone: tones[key] || "slate" };
}

export function mapComplaintPriority(priority) {
  const key = priority || "medium";
  const labels = {
    low: "Low",
    medium: "Medium",
    high: "High",
    urgent: "Critical",
  };
  const tones = {
    low: "slate",
    medium: "teal",
    high: "gold",
    urgent: "coral",
  };
  return { key, label: labels[key] || key, tone: tones[key] || "slate" };
}

export function mapComplaintReason(reason) {
  return COMPLAINT_REASONS[reason] || reason || "Other";
}

export function buildEntityLink(row = {}) {
  const type = row.entity_type || "other";
  const base = ENTITY_ROUTES[type];
  const targetId = row.target_user_id || row.target_advisor_id || row.entity_id;

  if (type === "user_account" && (row.entity_id || row.target_user_id)) {
    return `/admin/users/${row.entity_id || row.target_user_id}`;
  }

  if (type === "advisor_profile" && row.target_advisor_id) {
    return `/admin/users/${row.target_advisor_id}`;
  }

  if (base && type !== "user_account" && type !== "advisor_profile") {
    return base;
  }

  return null;
}

export function mapComplaintRow(row = {}, context = {}) {
  const entityType = row.entity_type || "other";
  const status = mapComplaintStatus(row.status);
  const priority = mapComplaintPriority(row.priority);
  const reporter = maskComplaintReporter(row);
  const isActive = ["open", "in_review"].includes(status.key);
  const caseKind = isReportCase(entityType) ? "report" : "complaint";
  const reportSubtype = mapReportSubtype(entityType);
  const complaintCategory = mapComplaintCategory(row);
  const reportedItemLabel = ENTITY_LABELS[entityType] || "Reported item";

  return {
    id: row.id,
    caseNumber: row.case_number || `CASE-${shortUserId(row.id)}`,
    caseKind,
    caseKindLabel: caseKind === "report" ? "Report" : "Complaint",
    reportSubtype: reportSubtype.key,
    reportSubtypeLabel: reportSubtype.label,
    complaintCategory: complaintCategory.key,
    complaintCategoryLabel: complaintCategory.label,
    reportedItemLabel,
    entityType,
    entityTypeLabel: ENTITY_LABELS[entityType] || "Other",
    entityId: row.entity_id || null,
    entityHref: buildEntityLink(row),
    reason: row.reason || "other",
    reasonLabel: mapComplaintReason(row.reason),
    description: row.description || "",
    descriptionPreview: (row.description || "").trim().slice(0, 160),
    status: status.key,
    statusLabel: status.label,
    statusTone: status.tone,
    priority: priority.key,
    priorityLabel: priority.label,
    priorityTone: priority.tone,
    reporterName: reporter.name,
    reporterPhoneMasked: reporter.phone,
    reporterEmailMasked: reporter.email,
    reporterUserId: row.reporter_user_id || null,
    targetUserId: row.target_user_id || null,
    targetAdvisorId: row.target_advisor_id || null,
    targetShortId: shortUserId(row.target_advisor_id || row.target_user_id),
    assignedAdminId: row.assigned_admin_id || null,
    resolutionNote: row.resolution_note || "",
    resolvedAt: row.resolved_at || null,
    createdAt: row.created_at || null,
    updatedAt: row.updated_at || null,
    isActive,
    canManage: context.canManage !== false,
    canViewPii: context.canViewPii === true,
    events: context.events || [],
    attachments: row.attachments || [],
    assignedToLabel: row.assigned_admin_id ? shortUserId(row.assigned_admin_id) : "Unassigned",
  };
}

export function isValidComplaintStatus(value) {
  return COMPLAINT_STATUSES.includes(value);
}

export function isValidComplaintPriority(value) {
  return COMPLAINT_PRIORITIES.includes(value);
}
