import { DEFAULT_ADMIN_PERMISSIONS, PERMISSION_KEYS } from "@/lib/admin/permissions";

export const ROLE_TEMPLATE_META_KEY = "_roleTemplate";

export const SYSTEM_ROLE_TEMPLATES = [
  {
    id: "super_admin",
    name: "Super Admin",
    description: "Full platform access across all modules, settings, and admin management.",
    isSystem: true,
    isEditable: false,
    status: "active",
    createdAt: "2025-01-01T00:00:00.000Z",
    dbRole: "super_admin",
  },
  {
    id: "operations_admin",
    name: "Operations Admin",
    description: "Manages users, profiles, industries, ambassadors, and day-to-day platform operations.",
    isSystem: true,
    isEditable: true,
    status: "active",
    createdAt: "2025-01-01T00:00:00.000Z",
    dbRole: "admin",
  },
  {
    id: "verification_admin",
    name: "Verification Admin",
    description: "Handles profile verification, IRDAI approvals, and visibility rules.",
    isSystem: true,
    isEditable: true,
    status: "active",
    createdAt: "2025-01-01T00:00:00.000Z",
    dbRole: "admin",
  },
  {
    id: "support_admin",
    name: "Support Admin",
    description: "Resolves complaints, moderates reviews, and runs support communications.",
    isSystem: true,
    isEditable: true,
    status: "active",
    createdAt: "2025-01-01T00:00:00.000Z",
    dbRole: "admin",
  },
  {
    id: "finance_admin",
    name: "Finance Admin",
    description: "Manages plans, pricing, coupons, billing, and payment operations.",
    isSystem: true,
    isEditable: true,
    status: "active",
    createdAt: "2025-01-01T00:00:00.000Z",
    dbRole: "admin",
  },
];

function allPermissionsTrue() {
  return PERMISSION_KEYS.reduce((acc, key) => {
    acc[key] = true;
    return acc;
  }, {});
}

function buildPermissions(enabledKeys = []) {
  const permissions = { ...DEFAULT_ADMIN_PERMISSIONS };
  enabledKeys.forEach((key) => {
    permissions[key] = true;
  });
  return permissions;
}

const TEMPLATE_PERMISSION_KEYS = {
  super_admin: allPermissionsTrue(),
  operations_admin: buildPermissions([
    "overview",
    "analytics",
    "users",
    "profiles",
    "irdai_approvals",
    "industries",
    "industry_configuration",
    "visibility_controls",
    "feature_controls",
    "ambassadors",
    "referrals",
    "rewards",
    "leaderboard",
    "campaigns",
    "settings",
  ]),
  verification_admin: buildPermissions([
    "overview",
    "profiles",
    "irdai_approvals",
    "industries",
    "industry_configuration",
    "verification_rules",
    "visibility_controls",
    "feature_controls",
  ]),
  support_admin: buildPermissions([
    "overview",
    "users",
    "profiles",
    "platform_testimonials",
    "advisor_testimonials",
    "moderate_advisor_testimonials",
    "reports_complaints",
    "view_complaint_pii",
    "manage_complaints",
    "campaigns",
    "send_campaigns",
  ]),
  finance_admin: buildPermissions([
    "overview",
    "plans",
    "pricing",
    "coupons",
    "feature_controls",
    "billing",
    "payments",
    "analytics",
  ]),
};

export function getRoleTemplateById(templateId, overrides = {}) {
  const base = SYSTEM_ROLE_TEMPLATES.find((row) => row.id === templateId);
  if (!base) return null;

  const defaultPermissions =
    overrides[templateId] ||
    TEMPLATE_PERMISSION_KEYS[templateId] ||
    { ...DEFAULT_ADMIN_PERMISSIONS };

  return {
    ...base,
    permissions: { ...defaultPermissions },
  };
}

export function getAllRoleTemplates(overrides = {}) {
  return SYSTEM_ROLE_TEMPLATES.map((template) => getRoleTemplateById(template.id, overrides));
}

export function getDefaultPermissionsForTemplate(templateId, overrides = {}) {
  const template = getRoleTemplateById(templateId, overrides);
  return template?.permissions || { ...DEFAULT_ADMIN_PERMISSIONS };
}

export function extractRoleTemplateFromPermissions(permissions = {}) {
  const value = permissions[ROLE_TEMPLATE_META_KEY];
  return typeof value === "string" ? value : null;
}

export function buildPermissionsPayload(permissions, roleTemplate) {
  const payload = { ...permissions };
  if (roleTemplate) {
    payload[ROLE_TEMPLATE_META_KEY] = roleTemplate;
  }
  return payload;
}

export function resolveAdminRoleTemplate(adminUser) {
  if (adminUser?.role === "super_admin") return "super_admin";

  const explicit = adminUser?.role_template || extractRoleTemplateFromPermissions(adminUser?.permissions);
  if (explicit && SYSTEM_ROLE_TEMPLATES.some((row) => row.id === explicit)) {
    return explicit;
  }

  return inferClosestRoleTemplate(adminUser?.permissions);
}

export function inferClosestRoleTemplate(permissions = {}) {
  const normalized = permissions || {};
  let bestId = "custom";
  let bestScore = 0;

  SYSTEM_ROLE_TEMPLATES.filter((row) => row.id !== "super_admin").forEach((template) => {
    const templatePerms = TEMPLATE_PERMISSION_KEYS[template.id] || DEFAULT_ADMIN_PERMISSIONS;
    const keys = PERMISSION_KEYS;
    let matches = 0;
    keys.forEach((key) => {
      if (Boolean(templatePerms[key]) === Boolean(normalized[key])) matches += 1;
    });
    const score = matches / keys.length;
    if (score > bestScore) {
      bestScore = score;
      bestId = template.id;
    }
  });

  return bestScore >= 0.75 ? bestId : "custom";
}

export function getRoleTemplateLabel(templateId) {
  if (templateId === "custom") return "Custom";
  return SYSTEM_ROLE_TEMPLATES.find((row) => row.id === templateId)?.name || "Admin";
}
