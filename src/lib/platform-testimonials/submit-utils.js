const ALLOWED_TYPES = ["text", "audio", "video"];
const ALLOWED_RESPONDENT_TYPES = ["customer", "advisor"];

export function normalizeIndianMobile(phone) {
  return String(phone || "").replace(/\D/g, "").slice(-10);
}

export function parseRating(value) {
  const rating = Number(value);
  if (!Number.isFinite(rating) || rating < 1 || rating > 5) return null;
  return rating;
}

export function validatePlatformTestimonialDraft(draft = {}) {
  const name = String(draft.name || "").trim();
  const profession = String(draft.profession || "").trim();
  const city = String(draft.city || "").trim();
  const mobile = normalizeIndianMobile(draft.mobile_number);
  const respondentType = String(draft.respondent_type || "").trim().toLowerCase();
  const type = String(draft.testimonial_type || "").trim().toLowerCase();
  const rating = parseRating(draft.testimonial_rating);

  if (!name) return "Name is required";
  if (!profession) return "Profession is required";
  if (!city) return "City is required";
  if (!/^[6-9]\d{9}$/.test(mobile)) return "Enter a valid 10-digit mobile number";
  if (!ALLOWED_RESPONDENT_TYPES.includes(respondentType)) {
    return "Please select whether you are a customer or professional";
  }
  if (!ALLOWED_TYPES.includes(type)) return "Invalid testimonial type";
  if (!rating) return "Please select a rating between 1 and 5";

  if (type === "text" && !String(draft.content || "").trim()) {
    return "Please write your testimonial about YVITY";
  }

  if (type !== "text" && !draft.mediaFile && !draft.media_url) {
    return `Please upload your ${type} testimonial`;
  }

  return null;
}
