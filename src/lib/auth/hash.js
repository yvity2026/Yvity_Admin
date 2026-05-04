import crypto from "crypto";

export function normalizePhone(phone) {
  return String(phone || "").replace(/\D/g, "").replace(/^91/, "");
}

export function hashPhone(phone) {
  return crypto
    .createHash("sha256")
    .update(normalizePhone(phone))
    .digest("hex");
}

export function hashOtp(otp) {
  return crypto
    .createHash("sha256")
    .update(String(otp))
    .digest("hex");
}