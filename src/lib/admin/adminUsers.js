import { normalizePermissions } from "@/lib/admin/permissions";
import {
  extractRoleTemplateFromPermissions,
  getRoleTemplateLabel,
  resolveAdminRoleTemplate,
} from "@/lib/admin/roleDefinitions";

export function normalizeAdminPhoneNumber(phoneNumber) {
  const value = String(phoneNumber || "").trim();

  if (/^\+[1-9]\d{7,14}$/.test(value)) {
    return value;
  }

  const digitsOnly = value.replace(/\D/g, "");

  if (/^[6-9]\d{9}$/.test(digitsOnly)) {
    return `+91${digitsOnly}`;
  }

  return null;
}

export function serializeAdminUser(adminUser) {
  if (!adminUser) {
    return null;
  }

  const roleTemplate = resolveAdminRoleTemplate({
    ...adminUser,
    role_template: extractRoleTemplateFromPermissions(adminUser?.permissions),
  });

  return {
    ...adminUser,
    permissions: normalizePermissions(adminUser.permissions),
    role_template: roleTemplate,
    role_template_label: getRoleTemplateLabel(roleTemplate),
  };
}
