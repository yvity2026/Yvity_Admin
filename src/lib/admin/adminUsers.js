import { normalizePermissions } from "@/lib/admin/permissions";
import {
  extractRoleTemplateFromPermissions,
  getRoleTemplateLabel,
  resolveAdminRoleTemplate,
} from "@/lib/admin/roleDefinitions";

export function adminPhoneDigits(phoneNumber) {
  const normalized = normalizeAdminPhoneNumber(phoneNumber);
  if (!normalized) return null;
  return normalized.replace(/\D/g, "").slice(-10);
}

export async function findActiveAdminByPhone(supabase, phone) {
  const e164 = normalizeAdminPhoneNumber(phone);
  if (!e164) {
    return { admin: null, error: null };
  }

  const digits = adminPhoneDigits(phone);

  const { data: exactMatch, error: exactError } = await supabase
    .from("admin_users")
    .select("id, phone_number, role, permissions, is_active, name")
    .eq("phone_number", e164)
    .eq("is_active", true)
    .maybeSingle();

  if (exactError) {
    return { admin: null, error: exactError };
  }

  if (exactMatch) {
    return { admin: exactMatch, error: null };
  }

  const { data: activeAdmins, error: listError } = await supabase
    .from("admin_users")
    .select("id, phone_number, role, permissions, is_active, name")
    .eq("is_active", true);

  if (listError) {
    return { admin: null, error: listError };
  }

  const legacyMatch =
    activeAdmins?.find((row) => adminPhoneDigits(row.phone_number) === digits) || null;

  return { admin: legacyMatch, error: null };
}

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
