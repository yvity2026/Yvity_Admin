/**
 * PII masking utilities — display-only, server-side data is never altered.
 */

export function maskEmail(email) {
  if (!email || typeof email !== "string") return "—";
  const [local, domain] = email.split("@");
  if (!domain) return "•".repeat(email.length);
  const visible = local.length > 3 ? local.slice(0, 3) : local.slice(0, 1);
  return `${visible}${"•".repeat(Math.max(3, local.length - visible.length))}@${domain}`;
}

export function maskPhone(phone) {
  if (!phone || typeof phone !== "string") return "—";
  const digits = phone.replace(/\D/g, "").slice(-10);
  if (digits.length < 6) return "•".repeat(10);
  // Show first 2 and last 2 digits: 98•••••210 → +91 98••• ••210
  return `+91 ${digits.slice(0, 2)}••• ••${digits.slice(-3)}`;
}

export function formatPhoneFull(phone) {
  if (!phone) return null;
  const digits = String(phone).replace(/\D/g, "").slice(-10);
  if (digits.length === 10) return `+91 ${digits.slice(0, 5)} ${digits.slice(5)}`;
  return phone;
}
