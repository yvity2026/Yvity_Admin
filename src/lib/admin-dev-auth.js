import { useLocalApprovals } from "@/lib/local-data/advisor-approvals";

const DEV_OTP = process.env.YVITY_ADMIN_DEV_OTP || "123456";

export function isDevAdminAuthEnabled() {
  if (process.env.NODE_ENV === "production") return false;
  if (process.env.YVITY_ADMIN_DEV_AUTH === "false") return false;
  return useLocalApprovals();
}

export function devAdminPhone() {
  return (process.env.YVITY_ADMIN_DEV_PHONE || "9876543210").replace(/\D/g, "").slice(-10);
}

export function isDevAdminPhone(phone) {
  if (!isDevAdminAuthEnabled()) return false;
  const normalized = String(phone || "").replace(/\D/g, "").slice(-10);
  return normalized === devAdminPhone();
}

export function verifyDevAdminOtp(otp) {
  return String(otp || "").trim() === DEV_OTP;
}

export function devAdminSession() {
  return {
    admin_id: "local-dev-admin",
    role: "super_admin",
    permissions: {},
  };
}
