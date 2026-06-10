/** Shared WhatsApp env — keeps WHATSAPP_ACCESS_TOKEN as the primary production secret. */
export function getWhatsAppApiUrl() {
  return (process.env.WHATSAPP_API_URL || "").trim();
}

export function getWhatsAppAccessToken() {
  return (
    process.env.WHATSAPP_ACCESS_TOKEN ||
    process.env.WHATSAPP_API_TOKEN ||
    ""
  ).trim();
}

export function isWhatsAppApiConfigured() {
  return Boolean(getWhatsAppApiUrl() && getWhatsAppAccessToken());
}

export function getOtpTemplateName() {
  return (
    process.env.WHATSAPP_OTP_TEMPLATE_NAME ||
    process.env.WHATSAPP_TEMPLATE_NAME ||
    ""
  ).trim();
}

/** Meta Graph template send — only when an OTP template name is configured. */
export function useMetaOtpTemplate() {
  return Boolean(getOtpTemplateName());
}

export function isWhatsAppOtpConfigured() {
  return isWhatsAppApiConfigured();
}

export function buildOtpWhatsAppMessage(code) {
  const template = process.env.WHATSAPP_OTP_MESSAGE?.trim();
  if (template?.includes("{code}")) {
    return template.replaceAll("{code}", String(code));
  }
  return `Your YVITY verification code is ${code}. Valid for 5 minutes. Do not share this code with anyone.`;
}
