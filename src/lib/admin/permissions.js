export const PERMISSION_KEYS = [
  "overview",
  "subscribers",
  "customers",
  "irdai_approvals",
  "testimonials",
  "payments",
  "settings",
  "roles_permissions",
  "create_admin_user",
  "delete_admin_user",
];

export const SIDEBAR_PERMISSION_KEYS = [
  "overview",
  "subscribers",
  "customers",
  "irdai_approvals",
  "testimonials",
  "payments",
  "settings",
  "roles_permissions",
];

export const PERMISSION_LABELS = {
  overview: "Overview",
  subscribers: "Subscribers",
  customers: "Customers",
  irdai_approvals: "IRDAI Approvals",
  testimonials: "Testimonials",
  payments: "Payments",
  settings: "Settings",
  roles_permissions: "Roles & Permissions",
  create_admin_user: "Create Admin User",
  delete_admin_user: "Delete Admin User",
};

export const DEFAULT_ADMIN_PERMISSIONS = PERMISSION_KEYS.reduce(
  (accumulator, key) => {
    accumulator[key] = false;
    return accumulator;
  },
  {},
);

export const ADMIN_SECTION_ROUTE_MAP = [
  {
    permissionKey: "overview",
    pagePrefixes: ["/admin"],
    apiPrefixes: ["/api/admin/overview"],
  },
  {
    permissionKey: "subscribers",
    pagePrefixes: ["/admin/subscribers", "/admin/subscriptions", "/admin/advisors"],
    apiPrefixes: [
      "/api/admin/subscriptions",
      "/api/admin/advisors",
    ],
  },
  {
    permissionKey: "customers",
    pagePrefixes: ["/admin/customers"],
    apiPrefixes: ["/api/admin/customers"],
  },
  {
    permissionKey: "irdai_approvals",
    pagePrefixes: ["/admin/irdaiapprovals"],
    apiPrefixes: ["/api/admin/approvals", "/api/admin/irdai"],
  },
  {
    permissionKey: "testimonials",
    pagePrefixes: ["/admin/testimonials"],
    apiPrefixes: ["/api/admin/testimonials"],
  },
  {
    permissionKey: "payments",
    pagePrefixes: ["/admin/payments"],
    apiPrefixes: ["/api/admin/payments"],
  },
  {
    permissionKey: "settings",
    pagePrefixes: ["/admin/settings"],
    apiPrefixes: [],
  },
  {
    permissionKey: "roles_permissions",
    pagePrefixes: ["/admin/roles"],
    apiPrefixes: ["/api/admin/roles"],
    alternatePermissionKeys: ["create_admin_user", "delete_admin_user"],
  },
];

export function normalizePermissions(permissions) {
  const safePermissions =
    permissions && typeof permissions === "object" && !Array.isArray(permissions)
      ? permissions
      : {};

  return PERMISSION_KEYS.reduce((accumulator, key) => {
    accumulator[key] = safePermissions[key] === true;
    return accumulator;
  }, {});
}

export function isSuperAdmin(admin) {
  return admin?.role === "super_admin";
}

export function hasPermission(admin, permissionKey) {
  if (isSuperAdmin(admin)) {
    return true;
  }

  const normalizedPermissions = normalizePermissions(admin?.permissions);
  return normalizedPermissions[permissionKey] === true;
}

export function hasAnyPermission(admin, permissionKeys = []) {
  if (isSuperAdmin(admin)) {
    return true;
  }

  return permissionKeys.some((permissionKey) => hasPermission(admin, permissionKey));
}

export function canAccessRolesSection(admin) {
  return hasAnyPermission(admin, [
    "roles_permissions",
    "create_admin_user",
    "delete_admin_user",
  ]);
}

export function canAccessSidebarItem(admin, permissionKey, alternatePermissionKeys = []) {
  if (permissionKey === "roles_permissions") {
    return canAccessRolesSection(admin);
  }

  return hasAnyPermission(admin, [permissionKey, ...alternatePermissionKeys]);
}

export function getFirstAccessibleAdminRoute(admin) {
  if (isSuperAdmin(admin)) {
    return "/admin";
  }

  const firstAccessibleSection = ADMIN_SECTION_ROUTE_MAP.find((section) =>
    canAccessSidebarItem(
      admin,
      section.permissionKey,
      section.alternatePermissionKeys || [],
    ),
  );

  return firstAccessibleSection?.pagePrefixes?.[0] || "/admin/unauthorized";
}

export function getPermissionSummary(permissions) {
  const normalizedPermissions = normalizePermissions(permissions);

  return PERMISSION_KEYS.filter((permissionKey) => normalizedPermissions[permissionKey]).map(
    (permissionKey) => PERMISSION_LABELS[permissionKey],
  );
}
