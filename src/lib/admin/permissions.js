import {
  LEGACY_PERMISSION_ALIASES,
  PERMISSION_GROUPS,
  PERMISSION_KEYS,
  PERMISSION_LABELS,
} from "@/lib/admin/permissionKeys";
import {
  NAV_PERMISSION_KEYS,
  buildAdminSectionRouteMap,
} from "@/lib/admin/navConfig";

export { PERMISSION_GROUPS, PERMISSION_KEYS, PERMISSION_LABELS };

/** Permission keys referenced in the current nav tree. */
export const SIDEBAR_PERMISSION_KEYS = NAV_PERMISSION_KEYS;

export const DEFAULT_ADMIN_PERMISSIONS = PERMISSION_KEYS.reduce(
  (accumulator, key) => {
    accumulator[key] = false;
    return accumulator;
  },
  {},
);

/** Built from navConfig — order matches sidebar priority for redirects. */
export const ADMIN_SECTION_ROUTE_MAP = buildAdminSectionRouteMap();

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

/** Strip boolean permission keys for DB write; preserves role template metadata. */
export function serializePermissionsForStorage(permissions, roleTemplate) {
  const normalized = normalizePermissions(permissions);
  if (roleTemplate) {
    return { ...normalized, _roleTemplate: roleTemplate };
  }
  return normalized;
}

export function isSuperAdmin(admin) {
  return admin?.role === "super_admin";
}

function permissionGranted(normalizedPermissions, permissionKey) {
  if (normalizedPermissions[permissionKey] === true) return true;

  const aliases = LEGACY_PERMISSION_ALIASES[permissionKey];
  if (aliases?.some((key) => normalizedPermissions[key] === true)) return true;

  return Object.entries(LEGACY_PERMISSION_ALIASES).some(
    ([legacyKey, mappedKeys]) =>
      normalizedPermissions[legacyKey] === true &&
      mappedKeys.includes(permissionKey),
  );
}

export function hasPermission(admin, permissionKey) {
  if (isSuperAdmin(admin)) {
    return true;
  }

  const normalizedPermissions = normalizePermissions(admin?.permissions);
  return permissionGranted(normalizedPermissions, permissionKey);
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
