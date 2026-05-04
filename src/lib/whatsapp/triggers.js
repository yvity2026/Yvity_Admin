import { sendWhatsAppTemplate } from "@/lib/whatsapp/sender";

export const WhatsAppTriggers = {
  OTP: async ({ phone, payload }) =>
    sendWhatsAppTemplate({
      to: phone,
      templateKey: "LOGIN_OTP",
      data: payload,
    }),
};

export const sendWhatsAppOtp = (phone, otp) =>
  WhatsAppTriggers.OTP({
    phone,
    payload: { otp },
  });