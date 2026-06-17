import { shortUserId } from "@/lib/admin/users/mapUserRecord";
import { goldAppBaseUrl } from "@/lib/local-data/paths";

const ROLE_LABELS = {
  "role-life": "Life Insurance",
  "role-health": "Health Insurance",
  "role-general": "General Insurance",
};

export function profileCompletionScore(profile = {}, user = {}, services = []) {
  const checks = [
    Boolean(profile.designation || user?.profession),
    Boolean(profile.short_bio || profile.bio),
    Boolean(profile.iridai_certificate_url),
    Boolean(profile.intro_url),
    Boolean(profile.profile_slug),
    Array.isArray(services) ? services.length > 0 : Boolean(profile.services?.length),
    Boolean(profile.profile_status),
    profile.account_status === "active",
  ];

  const filled = checks.filter(Boolean).length;
  return Math.round((filled / checks.length) * 100);
}

export function mapProfileStatus(profile = {}) {
  const accountStatus = profile.account_status || "under_review";
  const isPublic = profile.ispublic_profile !== false;

  if (accountStatus === "deleted") {
    return { key: "deleted", label: "Deleted", tone: "danger" };
  }

  if (accountStatus === "action_required") {
    return { key: "rejected", label: "Rejected", tone: "danger" };
  }

  if (accountStatus === "under_review") {
    return { key: "pending", label: "Pending review", tone: "warning" };
  }

  if (accountStatus === "active" && profile.profile_status && isPublic) {
    return { key: "published", label: "Published", tone: "success" };
  }

  if (!isPublic) {
    return { key: "hidden", label: "Hidden", tone: "slate" };
  }

  if (accountStatus === "active") {
    return { key: "published", label: "Published", tone: "success" };
  }

  return { key: "pending", label: "Pending review", tone: "warning" };
}

export function mapVerificationStatus(profile = {}) {
  if (profile.profile_status) {
    return { key: "verified", label: "Verified", tone: "success" };
  }

  if (profile.account_status === "action_required") {
    return { key: "rejected", label: "Rejected", tone: "danger" };
  }

  return { key: "pending", label: "Pending", tone: "warning" };
}

export function mapIndustry(profile = {}, user = {}) {
  const roleId = profile.advisor_role_id || "";
  if (ROLE_LABELS[roleId]) return ROLE_LABELS[roleId];
  if (profile.designation) return profile.designation;
  if (user?.profession) return user.profession;
  return "—";
}

export function publicProfileUrl(profile = {}) {
  const slug = profile.profile_slug;
  if (!slug) return null;
  const base = goldAppBaseUrl();
  return `${base}/profile/${slug}`;
}

export function mapPlan(profile = {}) {
  const plan = profile.subscription_plan || "free";
  return String(plan).charAt(0).toUpperCase() + String(plan).slice(1);
}

export function mapProfileRow(item = {}, services = []) {
  const user = Array.isArray(item.user) ? item.user[0] : item.user || {};
  const profileStatus = mapProfileStatus(item);
  const verification = mapVerificationStatus(item);
  const completion = profileCompletionScore(item, user, services);

  return {
    id: item.id,
    profileId: item.id,
    userId: item.advisor_id || item.user_id || user.id,
    userShortId: shortUserId(item.advisor_id || item.user_id || user.id),
    profileName: item.designation || user.name || "Unnamed profile",
    userName: user.name || user.fullName || "—",
    industry: mapIndustry(item, user),
    plan: mapPlan(item),
    planKey: item.subscription_plan || "free",
    profileStatus: profileStatus.key,
    profileStatusLabel: profileStatus.label,
    profileStatusTone: profileStatus.tone,
    verificationStatus: verification.key,
    verificationLabel: verification.label,
    verificationTone: verification.tone,
    completionPct: completion,
    createdAt: item.created_at || item.submitted_at || null,
    updatedAt: item.updated_at || item.approved_at || null,
    profileSlug: item.profile_slug || null,
    publicUrl: publicProfileUrl(item),
    isHero: Boolean(item.is_hero),
    isLanding: Boolean(item.is_landing),
    isHidden: item.ispublic_profile === false,
    profilePic: user.selfie_url || user.selfieUrl || null,
    city: user.city || null,
    userAccountStatus: user.account_status || "active",
    canReview: ["pending", "rejected"].includes(profileStatus.key) ||
      item.account_status === "under_review" ||
      item.account_status === "action_required",
  };
}
