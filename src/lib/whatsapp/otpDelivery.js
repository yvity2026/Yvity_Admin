import {
  buildOtpWhatsAppMessage,
  getOtpTemplateName,
  getWhatsAppAccessToken,
  getWhatsAppMessagesUrl,
  isWhatsAppApiConfigured,
  useMetaOtpTemplate,
} from "@/lib/whatsapp/config";
import { toWhatsAppFormat } from "@/lib/whatsapp/sender";

function parseWhatsAppApiError(responseText) {
  try {
    const data = JSON.parse(responseText);
    return (
      data?.error?.error_data?.details ||
      data?.error?.message ||
      responseText.slice(0, 300)
    );
  } catch {
    return responseText.slice(0, 300);
  }
}

function hasMetaMessageId(responseText) {
  try {
    const data = JSON.parse(responseText);
    return Boolean(data?.messages?.[0]?.id);
  } catch {
    return false;
  }
}

function buildMetaOtpPayload(to, code, { includeButton, buttonSubType }) {
  const templateName = getOtpTemplateName();
  if (!templateName) {
    throw new Error("[WHATSAPP] WHATSAPP_OTP_TEMPLATE_NAME is not configured");
  }

  const language = process.env.WHATSAPP_OTP_TEMPLATE_LANGUAGE?.trim() || "en";
  const subType =
    buttonSubType ||
    process.env.WHATSAPP_OTP_BUTTON_SUB_TYPE?.trim() ||
    "url";
  const buttonParamType = subType === "copy_code" ? "coupon_code" : "text";
  const buttonParameter =
    buttonParamType === "coupon_code"
      ? { type: "coupon_code", coupon_code: code }
      : { type: "text", text: code };

  const components = [
    {
      type: "body",
      parameters: [{ type: "text", text: code }],
    },
  ];

  if (includeButton) {
    components.push({
      type: "button",
      sub_type: subType,
      index: "0",
      parameters: [buttonParameter],
    });
  }

  return {
    messaging_product: "whatsapp",
    recipient_type: "individual",
    to,
    type: "template",
    template: {
      name: templateName,
      language: { code: language },
      components,
    },
  };
}

async function postWhatsAppRequest({ url, token, body, preview, to }) {
  let lastError;

  for (let attempt = 1; attempt <= 3; attempt += 1) {
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      const responseText = await response.text();
      const isMeta = url.includes("graph.facebook.com");
      const metaAccepted = !isMeta || hasMetaMessageId(responseText);
      const apiError = response.ok
        ? metaAccepted
          ? undefined
          : "Meta API accepted request but returned no message id"
        : parseWhatsAppApiError(responseText);

      console.log(
        `[WHATSAPP][OTP RESPONSE attempt ${attempt}]`,
        response.status,
        responseText.slice(0, 500),
      );

      if (response.ok && metaAccepted) {
        return { ok: true };
      }

      lastError = apiError;
    } catch (error) {
      lastError = error instanceof Error ? error.message : "send failed";
      console.error(`[WHATSAPP][OTP RETRY ${attempt}]`, lastError);
    }
  }

  return { ok: false, error: lastError };
}

async function sendMetaOtpTemplate({ phone, code, apiUrl, apiToken }) {
  const includeButtonEnv = process.env.WHATSAPP_OTP_INCLUDE_BUTTON?.trim();
  const explicitSubType = process.env.WHATSAPP_OTP_BUTTON_SUB_TYPE?.trim();

  let attempts;
  if (includeButtonEnv === "false") {
    attempts = [{ includeButton: false }];
  } else if (explicitSubType) {
    attempts = [
      { includeButton: false },
      { includeButton: true, buttonSubType: explicitSubType },
    ];
  } else if (includeButtonEnv === "true") {
    attempts = [{ includeButton: true, buttonSubType: "url" }];
  } else {
    attempts = [
      { includeButton: false },
      { includeButton: true, buttonSubType: "url" },
      { includeButton: true, buttonSubType: "copy_code" },
    ];
  }

  let lastError;

  for (const attempt of attempts) {
    const payload = buildMetaOtpPayload(phone, code, attempt);
    const label = attempt.includeButton
      ? `+button:${attempt.buttonSubType || "url"}`
      : "+body";

    const result = await postWhatsAppRequest({
      url: apiUrl,
      token: apiToken,
      body: payload,
      preview: `template:${payload.template.name}${label}`,
      to: phone,
    });

    if (result.ok) return result;
    lastError = result.error;

    const errorText = String(result.error || "").toLowerCase();
    const needsUrlButton = errorText.includes("type url");
    const needsCopyButton =
      errorText.includes("copy_code") || errorText.includes("copy code");

    if (needsUrlButton && attempt.includeButton && attempt.buttonSubType !== "url") {
      continue;
    }
    if (
      needsCopyButton &&
      attempt.includeButton &&
      attempt.buttonSubType !== "copy_code"
    ) {
      continue;
    }

    const retryable =
      !attempt.includeButton &&
      (errorText.includes("button") ||
        errorText.includes("component") ||
        String(result.error || "").includes("132000") ||
        errorText.includes("parameter"));

    if (!retryable || includeButtonEnv !== undefined || explicitSubType) {
      return result;
    }
  }

  return { ok: false, error: lastError };
}

/**
 * Admin OTP delivery — aligned with Yvity_Users sendOtpWhatsApp().
 */
export async function sendOtpViaGateway(phone, otp) {
  if (!isWhatsAppApiConfigured()) {
    throw new Error("[WHATSAPP] Missing API config");
  }

  const to = toWhatsAppFormat(phone);
  const apiUrl = getWhatsAppMessagesUrl();
  const apiToken = getWhatsAppAccessToken();
  const mode = useMetaOtpTemplate() ? "meta" : "gateway";

  console.log("[WHATSAPP][OTP SEND]", { mode, url: apiUrl, to });

  let result;
  if (useMetaOtpTemplate()) {
    result = await sendMetaOtpTemplate({
      phone: to,
      code: String(otp),
      apiUrl,
      apiToken,
    });
  } else {
    const message = buildOtpWhatsAppMessage(otp);
    result = await postWhatsAppRequest({
      url: apiUrl,
      token: apiToken,
      body: { to, message },
      preview: message.slice(0, 80),
      to,
    });
  }

  if (!result.ok) {
    throw new Error(`[WHATSAPP] ${result.error || "Failed to send OTP via WhatsApp"}`);
  }

  return { to, mode };
}
