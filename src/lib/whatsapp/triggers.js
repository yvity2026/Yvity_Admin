import { sendWhatsAppTemplate } from "@/lib/whatsapp/sender";


export const sendWhatsAppOtp = (phone, otp) =>
  WhatsAppTriggers.OTP({
    phone,
    payload: { otp },
  });



export const WhatsAppTriggers = {
  OTP: async ({ phone, payload }) =>
    sendWhatsAppTemplate({
      to: phone,
      templateKey: "LOGIN_OTP",
      data: payload,
    }),
  TESTIMONIAL_REQUEST_WITH_PROFILE: async ({ phone, payload }) =>
    sendWhatsAppTemplate({
      to: phone,
      templateKey: "TESTIMONIAL_REQUEST_WITH_PROFILE",
      data: payload,
    }),
};



export const sendWhatsAppTestimonialRequest = (phone, payload) =>
  WhatsAppTriggers.TESTIMONIAL_REQUEST_WITH_PROFILE({
    phone,
    payload,
  });
