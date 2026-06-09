import { shortUserId } from "@/lib/admin/users/mapUserRecord";

import { resolveGoldAssetUrl } from "@/lib/local-data/paths";



const REQUEST_TYPE_LABELS = {

  new_profile: "New profile",

  service_verification: "Service verification",

  profile_update: "Profile update",

};



export function mapApprovalStatus(accountStatus) {

  if (accountStatus === "active") {

    return { key: "approved", label: "Approved", tone: "success" };

  }

  if (accountStatus === "action_required") {

    return { key: "rejected", label: "Rejected", tone: "danger" };

  }

  return { key: "pending", label: "Pending", tone: "warning" };

}



export function mapRequestType(item = {}) {

  if (item.request_type) return item.request_type;

  if (item.pending_update_type) return "profile_update";

  if (item.service_verification_pending) return "service_verification";

  return "new_profile";

}



export function daysWaiting(submittedAt) {

  if (!submittedAt) return 0;

  const submitted = new Date(submittedAt);

  if (Number.isNaN(submitted.getTime())) return 0;

  return Math.max(0, Math.floor((Date.now() - submitted.getTime()) / 86400000));

}



export function waitingTone(days) {

  if (days >= 7) return "coral";

  if (days >= 3) return "gold";

  return "teal";

}



function primaryService(services = []) {

  const first = services[0] || {};

  return first.title || first.category || first.service_type || "—";

}



function primaryIndustry(item = {}, services = []) {

  return item.industry || services[0]?.industry || item.sector || "Insurance";

}



function primaryCategory(item = {}, services = []) {

  return item.category || services[0]?.category || item.designation || "—";

}



export function mapApprovalRow(item = {}, user = {}, services = []) {

  const accountStatus = item.account_status || "under_review";

  const status = mapApprovalStatus(accountStatus);

  const submittedAt = item.submitted_at || item.created_at || null;

  const waitDays = daysWaiting(submittedAt);

  const plan = String(item.subscription_plan || item.plan || "free").toLowerCase();

  const requestType = mapRequestType(item);



  const licenseUrl = resolveGoldAssetUrl(

    item.iridai_certificate_url && item.iridai_certificate_url !== "pending"

      ? item.iridai_certificate_url

      : item.document_urls?.[0] || item.licenseUrl || null,

  );



  const documentUrls = (item.document_urls || [])

    .map((url) => resolveGoldAssetUrl(url))

    .filter(Boolean);



  const industry = primaryIndustry(item, services);

  const category = primaryCategory(item, services);

  const service = primaryService(services);

  const serviceDetails = services.map((entry) => ({
    id: entry.id,
    title: entry.title || entry.category || "Service",
    provider: entry.provider || "—",
    category: entry.category || "—",
    roleLabel: entry.roleLabel || entry.role || "—",
    verificationStatus: entry.verification?.status || (entry.verified ? "verified" : "pending"),
    documents: (entry.verification?.documents || [])
      .map((doc) => ({
        id: doc.id,
        url: resolveGoldAssetUrl(doc.url),
        label: doc.label || doc.filename || "Verification document",
      }))
      .filter((doc) => doc.url),
  }));



  return {

    id: item.id,

    profileId: item.id,

    userId: item.advisor_id || item.user_id,

    userShortId: shortUserId(item.advisor_id || item.user_id),

    name: user.name || user.fullName || item.name || "Advisor",

    email: user.email || item.email || null,

    phone: user.mobile || user.phone || item.phone || null,

    location: user.city ? `${user.city}, IN` : item.location || "—",

    profilePic: resolveGoldAssetUrl(user.selfie_url || user.selfieUrl || item.profile_pic),

    designation: item.designation || item.type || "Insurance Advisor",

    industry,

    category,

    service,

    services: services.map((s) => s.title || s.category || s.service_type).filter(Boolean),

    serviceDetails,

    requestType,

    requestTypeLabel: REQUEST_TYPE_LABELS[requestType] || requestType,

    plan,

    planLabel: plan.charAt(0).toUpperCase() + plan.slice(1),

    licenseUrl,

    licenseNo: item.advisor_role_id || item.licenseNo || "—",

    documentUrls,

    uploadedProofs: documentUrls,

    submittedInformation: item.submitted_information || item.bio || item.summary || item.designation || "—",

    verificationNotes: item.verification_notes || item.admin_notes || item.irdai_rejected_reason || "",

    isVerified: Boolean(item.profile_status ?? item.isVerified),

    status: status.key,

    statusLabel: status.label,

    statusTone: status.tone,

    accountStatus,

    isHero: Boolean(item.is_hero),

    isLanding: Boolean(item.is_landing),

    submittedAt,

    approvedAt: item.approved_at || null,

    updatedAt: item.updated_at || item.approved_at || item.updatedAt || null,

    rejectionReason: item.irdai_rejected_reason || item.rejectionReason || null,

    waitingDays: waitDays,

    waitingTone: waitingTone(waitDays),

    canReview: status.key === "pending",

    source: item.source || "supabase",

    type: item.designation || item.type || "Insurance Advisor",

    user_id: item.advisor_id || item.user_id,

    is_hero: Boolean(item.is_hero),

    is_landing: Boolean(item.is_landing),

    profileHref: item.advisor_id || item.user_id ? `/admin/users/${item.advisor_id || item.user_id}` : null,

  };

}



function isToday(value) {

  if (!value) return false;

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return false;

  const start = new Date();

  start.setHours(0, 0, 0, 0);

  return date >= start;

}



export function computeApprovalOverview(rows = [], profileUpdates = []) {

  return {

    pendingApprovals: rows.filter((row) => row.status === "pending").length,

    approvedToday: rows.filter(

      (row) => row.status === "approved" && isToday(row.approvedAt || row.updatedAt),

    ).length,

    rejectedToday: rows.filter(

      (row) => row.status === "rejected" && isToday(row.updatedAt),

    ).length,

    profileUpdateRequests: profileUpdates.filter((row) => row.status === "pending").length,

    attention: {

      pendingReview: rows.filter((row) => row.status === "pending").length,

      profileUpdates: profileUpdates.filter((row) => row.status === "pending").length,

      rejected: rows.filter((row) => row.status === "rejected").length,

    },

  };

}


