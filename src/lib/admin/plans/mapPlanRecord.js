import { PLAN_LIMITS } from "@/lib/admin/plans/planCatalog";
import { getConfiguredPlanLimits } from "@/lib/local-data/feature-controls-store";

function formatLimitValue(value) {
  if (value === true) return "Yes";
  if (value === false) return "No";
  if (value === "Unlimited") return "Unlimited";
  return String(value);
}

function allComparisonLabelsFromPlans(plans = []) {
  const seen = new Set();
  const rows = [];
  for (const plan of plans) {
    for (const label of [...(plan.included || []), ...(plan.excluded || [])]) {
      if (!seen.has(label)) {
        seen.add(label);
        rows.push(label);
      }
    }
  }
  return rows;
}

export function mapPlanRow(plan, subscriberCount = 0, allPlanLimits = null) {
  const planId = plan.id || plan.limitsTemplate || "free";
  const templateId = plan.limitsTemplate || plan.id || "free";
  let limits;
  if (allPlanLimits) {
    // Live limits passed from API (Supabase) — preferred path on Vercel
    limits = allPlanLimits[planId] || allPlanLimits[templateId] || PLAN_LIMITS[templateId] || PLAN_LIMITS.free;
  } else {
    // Local dev fallback: read from local JSON
    try {
      limits = getConfiguredPlanLimits(planId, templateId);
    } catch {
      limits = PLAN_LIMITS[templateId] || PLAN_LIMITS.free;
    }
  }

  return {
    id: plan.id,
    name: plan.name,
    listPriceInr: plan.listPriceInr,
    salePriceInr: plan.salePriceInr,
    priceAnnualInr: plan.salePriceInr ?? plan.priceAnnualInr,
    priceLabel: plan.priceLabel,
    listPriceLabel: plan.listPriceLabel,
    hasDiscount: plan.hasDiscount,
    discountPercent: plan.discountPercent,
    billingCycle: plan.billingCycle,
    tagline: plan.tagline,
    highlight: plan.highlight,
    status: plan.status,
    statusLabel: plan.status === "active" ? "Active" : "Inactive",
    subscriberCount,
    included: plan.included,
    excluded: plan.excluded,
    limits: {
      testimonials: {
        text: limits.testimonialsText,
        audio: formatLimitValue(limits.testimonialsAudio),
        video: formatLimitValue(limits.testimonialsVideo),
      },
      galleryPhotos: formatLimitValue(limits.galleryPhotos),
      introVideoSeconds: limits.introVideoSeconds,
      introVideoHeroPlacement: limits.introVideoHeroPlacement,
      recommendations: formatLimitValue(limits.recommendations),
      leadsVisible: formatLimitValue(limits.leadsVisible),
      profileThemes: formatLimitValue(limits.profileThemes),
      serviceVerification: limits.serviceVerification,
      yvityVerifiedBadge: limits.yvityVerifiedBadge,
      searchAppearance: limits.searchAppearance,
      profileAnalytics: limits.profileAnalytics,
      featuredAdvisorEligibility: limits.featuredAdvisorEligibility,
    },
  };
}

export function buildPlansResponse(configuredPlans = [], subscriberCounts = {}, planLimits = null) {
  const plans = configuredPlans.map((plan) =>
    mapPlanRow(plan, subscriberCounts[plan.id] || 0, planLimits),
  );

  const totalSubscribers = plans.reduce((sum, plan) => sum + plan.subscriberCount, 0);
  const paidSubscribers = plans
    .filter((plan) => (plan.salePriceInr || 0) > 0)
    .reduce((sum, plan) => sum + plan.subscriberCount, 0);
  const annualRunRate = plans.reduce(
    (sum, plan) => sum + plan.subscriberCount * (plan.salePriceInr || 0),
    0,
  );

  return {
    success: true,
    overview: {
      totalPlans: plans.length,
      activePlans: plans.filter((plan) => plan.status === "active").length,
      totalSubscribers,
      paidSubscribers,
      freeSubscribers: subscriberCounts.free || 0,
      silverSubscribers: subscriberCounts.silver || 0,
      goldSubscribers: subscriberCounts.gold || 0,
      annualRunRateInr: annualRunRate,
      subscriberCountsByPlan: subscriberCounts,
    },
    plans,
    comparison: {
      labels: allComparisonLabelsFromPlans(plans),
      plans: plans.map((plan) => ({
        id: plan.id,
        name: plan.name,
        includedLabels: plan.included,
      })),
    },
  };
}
