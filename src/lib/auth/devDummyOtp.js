import { hashPhone } from "@/lib/auth/hash";
import { isWhatsAppOtpConfigured } from "@/lib/whatsapp/config";

const OTP_TTL_MS = 5 * 60 * 1000;
const otpByPhoneHash = new Map();

export function devDummyOtpCode() {
  return process.env.YVITY_ADMIN_DEV_OTP || "123456";
}

/** Demo OTP only when explicitly allowed or local dev without WhatsApp configured. */
export function isDevDummyOtpEnabled() {
  if (process.env.YVITY_ALLOW_DEMO_OTP === "true") return true;
  if (process.env.YVITY_ADMIN_DEV_AUTH === "false") return false;
  if (process.env.NODE_ENV === "production") return false;
  return !isWhatsAppOtpConfigured();
}

export function storeDevDummyOtp(phone, adminId) {
  const phoneHash = hashPhone(phone);
  otpByPhoneHash.set(phoneHash, {
    adminId,
    code: devDummyOtpCode(),
    expiresAt: Date.now() + OTP_TTL_MS,
  });
}

export function verifyDevDummyOtp(phone, otp) {
  if (String(otp || "").trim() !== devDummyOtpCode()) {
    return null;
  }

  const phoneHash = hashPhone(phone);
  const record = otpByPhoneHash.get(phoneHash);

  if (record && Date.now() <= record.expiresAt) {
    return record;
  }

  // Still accept the fixed code in dev (e.g. after dev server restart).
  return { adminId: null, code: devDummyOtpCode(), expiresAt: Date.now() + OTP_TTL_MS };
}
