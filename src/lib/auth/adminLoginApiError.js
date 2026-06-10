const PRODUCTION_FALLBACK = "Unable to complete login. Please try again later.";
const PRODUCTION_WHATSAPP_FALLBACK =
  "Unable to send OTP. Please try again later.";

function isDevelopment() {
  return process.env.NODE_ENV === "development";
}

function devMessage(message, productionMessage = PRODUCTION_FALLBACK) {
  return isDevelopment() ? message : productionMessage;
}

function whatsAppErrorHint(message) {
  const lower = message.toLowerCase();

  if (lower.includes("missing api config")) {
    return "Set WHATSAPP_ACCESS_TOKEN and WHATSAPP_PHONE_NUMBER_ID (Meta) or WHATSAPP_API_URL (gateway) on Vercel.";
  }
  if (lower.includes("template") && lower.includes("not configured")) {
    return "Set WHATSAPP_OTP_TEMPLATE_NAME to your approved Meta template name.";
  }
  if (message.includes("132001") || lower.includes("does not exist")) {
    return "Template name or language mismatch. Check WHATSAPP_OTP_TEMPLATE_NAME and WHATSAPP_OTP_TEMPLATE_LANGUAGE.";
  }
  if (message.includes("190") || lower.includes("access token") || lower.includes("oauth")) {
    return "WhatsApp access token is invalid or expired. Regenerate in Meta Business Suite.";
  }
  if (lower.includes("phone number")) {
    return "Recipient number is not on WhatsApp or not in the allowed test list.";
  }
  if (lower.includes("no message id")) {
    return "Meta accepted the request but did not queue a message. Check template approval and phone number ID.";
  }

  return "Copy the same WhatsApp env vars from Yvity_Users Vercel project (token, phone id, template name).";
}

/**
 * Maps thrown errors from admin login routes to safe API responses.
 */
export function mapAdminLoginApiError(err) {
  const message = err?.message || String(err);
  const dev = isDevelopment();

  if (
    message.includes("[WHATSAPP] Missing API config") ||
    message.includes("WhatsApp OTP is not configured")
  ) {
    return {
      status: dev ? 503 : 500,
      code: "WHATSAPP_NOT_CONFIGURED",
      hint: whatsAppErrorHint(message),
      error: devMessage(
        "WhatsApp OTP is not configured. Set WHATSAPP_ACCESS_TOKEN plus WHATSAPP_API_URL or WHATSAPP_PHONE_NUMBER_ID (and WHATSAPP_OTP_TEMPLATE_NAME for Meta), same as Yvity_Users.",
        PRODUCTION_WHATSAPP_FALLBACK,
      ),
    };
  }

  if (message.includes("[WHATSAPP] Missing template name")) {
    return {
      status: dev ? 503 : 500,
      code: "WHATSAPP_TEMPLATE_MISSING",
      error: devMessage(
        "WhatsApp OTP template is not configured. Set WHATSAPP_OTP_TEMPLATE_NAME (or WHATSAPP_TEMPLATE_NAME) for Meta Graph OTP.",
        PRODUCTION_WHATSAPP_FALLBACK,
      ),
    };
  }

  if (message.includes("[WHATSAPP] Invalid template:")) {
    return {
      status: 500,
      error: devMessage(
        "WhatsApp OTP template key is invalid. Check LOGIN_OTP in src/lib/whatsapp/templates.js."
      ),
    };
  }

  if (
    message.includes("[WHATSAPP]") ||
    message.includes("Failed to send OTP via WhatsApp") ||
    message.includes("WHATSAPP_OTP_TEMPLATE_NAME")
  ) {
    return {
      status: 502,
      code: "WHATSAPP_SEND_FAILED",
      hint: whatsAppErrorHint(message),
      error: devMessage(
        message.replace(/^\[WHATSAPP\]\s*/i, "").trim() ||
          "WhatsApp could not deliver the OTP. Check template approval and API credentials.",
        PRODUCTION_WHATSAPP_FALLBACK,
      ),
    };
  }

  if (
    message.includes("NEXT_PUBLIC_SUPABASE_URL") ||
    message.includes("SUPABASE_SERVICE_ROLE_KEY") ||
    message.toLowerCase().includes("supabase") ||
    message.includes("Failed to store OTP") ||
    String(err?.code || "").startsWith("PGRST") ||
    err?.code === "23505" ||
    /invalid api key|jwt|row-level security/i.test(message)
  ) {
    return {
      status: dev ? 503 : 500,
      code: "DATABASE_ERROR",
      error: devMessage(
        `Database error during login: ${message}`,
        "Unable to complete login. Please try again later.",
      ),
    };
  }

  return {
    status: 500,
    code: "LOGIN_FAILED",
    error: devMessage(message || PRODUCTION_FALLBACK, PRODUCTION_FALLBACK),
  };
}
