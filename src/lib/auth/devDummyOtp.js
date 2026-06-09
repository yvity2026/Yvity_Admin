import { hashPhone } from "@/lib/auth/hash";

const OTP_TTL_MS = 5 * 60 * 1000;
const otpByPhoneHash = new Map();

export function devDummyOtpCode() {
  return process.env.YVITY_ADMIN_DEV_OTP || "123456";
}

/** Same idea as Yvity_Users: fixed OTP in development, no WhatsApp. */
export function isDevDummyOtpEnabled() {
  if (process.env.YVITY_ADMIN_DEV_AUTH === "false") return false;
  return process.env.NODE_ENV === "development";
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
