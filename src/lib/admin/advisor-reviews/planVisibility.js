/** Mirrors Yvity_Users plan caps for advisor testimonial display (read-only). */

export const ADVISOR_PLAN_TESTIMONIAL_CAPS = {
  free: { text: null, audio: 2, video: 1 },
  silver: { text: null, audio: null, video: 5 },
  gold: { text: null, audio: null, video: null },
};

export function normalizeAdvisorPlan(plan) {
  const key = String(plan || "free").toLowerCase();
  if (key === "silver" || key === "gold") return key;
  return "free";
}

export function formatPlanCap(value) {
  return value == null ? "Unlimited" : String(value);
}

export function planCapLabel(plan, type) {
  const planKey = normalizeAdvisorPlan(plan);
  const caps = ADVISOR_PLAN_TESTIMONIAL_CAPS[planKey];
  const cap = caps?.[type];
  if (cap == null) return `${type} · unlimited on ${planKey} plan`;
  return `${type} · up to ${cap} on ${planKey} plan`;
}

export function isAutoPublishedStatus(status) {
  const normalized = String(status || "").toLowerCase();
  return normalized === "published" || normalized === "approved";
}
