import { WHATSAPP_TEMPLATES } from "@/lib/whatsapp/templates";

export function toWhatsAppFormat(phone) {
  const digits = String(phone || "").replace(/\D/g, "");
  const mobile =
    digits.length === 12 && digits.startsWith("91") ? digits.slice(2) : digits;

  if (!/^[6-9]\d{9}$/.test(mobile)) {
    throw new Error("[WHATSAPP] Invalid Indian phone number");
  }

  return `91${mobile}`;
}

function buildParameters(
  paramKeys,
  data,
  templateKey,
  component,
  parameterType = "text"
) {
  return paramKeys.map((key) => {
    if (!(key in data)) {
      throw new Error(
        `[WHATSAPP] Missing ${component} param "${key}" for template "${templateKey}"`
      );
    }

    const text = String(data[key]).slice(0, 1024);

    if (parameterType === "coupon_code") {
      return {
        type: "coupon_code",
        coupon_code: text,
      };
    }

    return {
      type: "text",
      text,
    };
  });
}

function maskTemplatePayload(payload) {
  const safePayload = JSON.parse(JSON.stringify(payload));

  safePayload.template.components?.forEach((component) => {
    component.parameters.forEach((parameter) => {
      if ("text" in parameter) parameter.text = "***";
      if ("coupon_code" in parameter) parameter.coupon_code = "***";
    });
  });

  return safePayload;
}

const logTemplateStart = ({ templateKey, formattedPhone, template }) => {
  console.log("====================================");
  console.log("[WHATSAPP][TEMPLATE]");
  console.log("Template:", templateKey);
  console.log("To:", formattedPhone);
  console.log("Body Params:", template.bodyParams || []);
  console.log("Button Params:", template.buttonParams || []);
  console.log("====================================");
};

function createWhatsAppError(data, template, templateKey) {
  if (data?.error?.code === 132001) {
    return new Error(
      `[WHATSAPP] Template "${template.name}" does not exist for language "${template.language}". Check template "${templateKey}" in WHATSAPP_TEMPLATES.`
    );
  }

  return new Error(
    data?.error?.error_data?.details ||
      data?.error?.message ||
      "[WHATSAPP] Message could not be delivered"
  );
}

export async function sendWhatsAppTemplate({ to, templateKey, data }) {
  const template = WHATSAPP_TEMPLATES[templateKey];

  if (!template) {
    throw new Error(`[WHATSAPP] Invalid template: ${templateKey}`);
  }

  if (!template.name) {
    throw new Error(`[WHATSAPP] Missing template name for: ${templateKey}`);
  }

  const formattedPhone = toWhatsAppFormat(to);
  const components = [];

  if (template.bodyParams?.length) {
    components.push({
      type: "body",
      parameters: buildParameters(
        template.bodyParams,
        data,
        templateKey,
        "body"
      ),
    });
  }

  if (template.buttonParams?.length) {
    if (!template.button) {
      throw new Error(
        `[WHATSAPP] Button config missing for template "${templateKey}"`
      );
    }

    components.push({
      type: "button",
      sub_type: template.button.sub_type,
      index: template.button.index,
      parameters: buildParameters(
        template.buttonParams,
        data,
        templateKey,
        "button",
        template.button.parameterType
      ),
    });
  }

  const payload = {
    messaging_product: "whatsapp",
    to: formattedPhone,
    type: "template",
    template: {
      name: template.name,
      language: { code: template.language },
      ...(components.length > 0 && { components }),
    },
  };

  logTemplateStart({ templateKey, formattedPhone, template });
  console.log("[WHATSAPP][PAYLOAD]");
  console.log(JSON.stringify(maskTemplatePayload(payload), null, 2));

  const apiUrl = process.env.WHATSAPP_API_URL;
  const token = process.env.WHATSAPP_ACCESS_TOKEN;

  if (!apiUrl || !token) {
    throw new Error("[WHATSAPP] Missing API config");
  }

  for (let attempt = 1; attempt <= 3; attempt += 1) {
    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const responseText = await response.text();
      let responseData = {};

      try {
        responseData = JSON.parse(responseText);
      } catch {
        responseData = {};
      }

      console.log("[WHATSAPP][META RESPONSE]", response.status, responseText);

      if (!response.ok) {
        throw createWhatsAppError(responseData, template, templateKey);
      }

      return { status: response.status, responseText };
    } catch (error) {
      console.error(`[WHATSAPP][RETRY ${attempt}]`, error);

      if (attempt === 3) {
        throw new Error(error.message || "[WHATSAPP] Failed after 3 retries");
      }
    }
  }
}