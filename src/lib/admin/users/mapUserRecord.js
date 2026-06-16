const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export function shortUserId(id) {
  if (!id || typeof id !== "string") return "—";
  return `…${id.replace(/-/g, "").slice(-8).toLowerCase()}`;
}

export function maskPhone(user = {}) {
  const phone = user.mobile || user.phone || "";
  if (String(phone).length >= 4) return `••••${String(phone).slice(-4)}`;
  return "—";
}

export function maskEmail(user = {}) {
  const email = user.email || "";
  const atIndex = email.indexOf("@");
  if (atIndex > 0) return `***@${email.slice(atIndex + 1)}`;
  return "—";
}

export function mapAccountStatus(status) {
  if (status === "deactivated") {
    return { key: "suspended", label: "Suspended", tone: "warning" };
  }
  if (status === "deleted") {
    return { key: "deleted", label: "Deleted", tone: "danger" };
  }
  return { key: "active", label: "Active", tone: "success" };
}

export function mapUserType(advisorProfile) {
  return advisorProfile?.id || advisorProfile?.advisor_id
    ? { key: "professional", label: "Professional" }
    : { key: "customer", label: "Customer" };
}

export function mapPlan(advisorProfile) {
  if (!advisorProfile?.subscription_plan) return "—";
  const plan = String(advisorProfile.subscription_plan);
  return plan.charAt(0).toUpperCase() + plan.slice(1);
}

export function mapUserRow(item = {}) {
  const advisor = Array.isArray(item.advisor)
    ? item.advisor[0]
    : item.advisor || null;
  const services = item.services || [];
  const userType = mapUserType(advisor);
  const status = mapAccountStatus(item.account_status || "active");

  const serviceNames = [
    ...new Set(services.map((s) => s.service_type).filter(Boolean)),
  ];
  const companyNames = [...new Set(services.map((s) => s.company).filter(Boolean))];

  return {
    id: item.id,
    shortId: shortUserId(item.id),
    name: item.name || "Unnamed user",
    city: item.city || null,
    profession: item.profession || null,
    userType: userType.key,
    userTypeLabel: userType.label,
    plan: userType.key === "professional" ? mapPlan(advisor) : "—",
    planKey: advisor?.subscription_plan || null,
    status: status.key,
    statusLabel: status.label,
    statusTone: status.tone,
    registeredAt: item.created_at || null,
    lastLogin: item.last_login_at || null,
    profilePic: item.selfie_url || null,
    phoneMasked: maskPhone(item),
    emailMasked: maskEmail(item),
    services: serviceNames,
    companies: companyNames,
    advisorProfileId: advisor?.id || null,
    advisorAccountStatus: advisor?.account_status || null,
  };
}

export function isUuid(value) {
  return UUID_PATTERN.test(String(value || "").trim());
}
