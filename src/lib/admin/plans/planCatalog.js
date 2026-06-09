/** Advisor subscription tiers — mirrors Yvity_Users membership catalog. */

export const PLAN_ORDER = ["free", "silver", "gold"];

export const PLAN_LIMITS = {
  free: {
    testimonialsText: "Unlimited",
    testimonialsAudio: 2,
    testimonialsVideo: 1,
    galleryPhotos: 5,
    introVideoSeconds: 0,
    introVideoHeroPlacement: false,
    recommendations: 1,
    leadsVisible: 5,
    profileThemes: 1,
    serviceVerification: false,
    yvityVerifiedBadge: false,
    searchAppearance: false,
    profileAnalytics: false,
    featuredAdvisorEligibility: false,
  },
  silver: {
    testimonialsText: "Unlimited",
    testimonialsAudio: "Unlimited",
    testimonialsVideo: 5,
    galleryPhotos: 25,
    introVideoSeconds: 30,
    introVideoHeroPlacement: false,
    recommendations: 15,
    leadsVisible: 25,
    profileThemes: 2,
    serviceVerification: true,
    yvityVerifiedBadge: true,
    searchAppearance: false,
    profileAnalytics: false,
    featuredAdvisorEligibility: false,
  },
  gold: {
    testimonialsText: "Unlimited",
    testimonialsAudio: "Unlimited",
    testimonialsVideo: "Unlimited",
    galleryPhotos: "Unlimited",
    introVideoSeconds: 120,
    introVideoHeroPlacement: true,
    recommendations: "Unlimited",
    leadsVisible: "Unlimited",
    profileThemes: "Unlimited",
    serviceVerification: true,
    yvityVerifiedBadge: true,
    searchAppearance: true,
    profileAnalytics: true,
    featuredAdvisorEligibility: true,
  },
};

export const MEMBERSHIP_PLANS = [
  {
    id: "free",
    name: "Free Plan",
    priceAnnualInr: 0,
    priceLabel: "₹0",
    billingCycle: "year",
    tagline: "Perfect for trying YVITY",
    highlight: null,
    status: "active",
    included: [
      "Public Profile",
      "Identity Verified Registration",
      "Add Services",
      "Unlimited Text Testimonials",
      "2 Audio Testimonials",
      "1 Video Testimonial",
      "5 Gallery Photos",
      "1 Recommendation",
      "View First 5 Leads",
      "1 Profile Theme",
    ],
    excluded: [
      "Service Verification",
      "YVITY Verified Badge",
      "Search Appearance",
      "Profile Analytics",
      "Featured Advisor Eligibility",
    ],
  },
  {
    id: "silver",
    name: "Silver Plan",
    priceAnnualInr: 1499,
    priceLabel: "₹1,499/year",
    billingCycle: "year",
    tagline: "For verified professionals",
    highlight: "Most popular for active advisors",
    status: "active",
    included: [
      "Public Profile",
      "Identity Verification",
      "Service Verification",
      "YVITY Verified Badge",
      "Unlimited Text Testimonials",
      "Unlimited Audio Testimonials",
      "5 Video Testimonials",
      "25 Gallery Photos",
      "30 Second Intro Video",
      "15 Recommendations",
      "View First 25 Leads",
      "2 Profile Themes",
      "Priority Profile Review",
    ],
    excluded: ["Search Appearance", "Profile Analytics", "Featured Advisor Eligibility"],
  },
  {
    id: "gold",
    name: "Gold Plan",
    priceAnnualInr: 2999,
    priceLabel: "₹2,999/year",
    billingCycle: "year",
    tagline: "For maximum visibility and growth",
    highlight: "Maximum visibility",
    status: "active",
    included: [
      "Public Profile",
      "Identity Verification",
      "Service Verification",
      "YVITY Verified Badge",
      "Unlimited Text Testimonials",
      "Unlimited Audio Testimonials",
      "Unlimited Video Testimonials",
      "Unlimited Gallery Photos",
      "2 Minute Intro Video (Hero Placement)",
      "Unlimited Recommendations",
      "Unlimited Lead Visibility",
      "Search Appearance",
      "Profile Analytics",
      "Featured Advisor Eligibility",
      "Unlimited Profile Themes",
      "Highest Priority Profile Review",
    ],
    excluded: [],
  },
];

export function getPlanById(planId) {
  return MEMBERSHIP_PLANS.find((plan) => plan.id === planId) ?? MEMBERSHIP_PLANS[0];
}

export function allComparisonLabels() {
  const seen = new Set();
  const rows = [];
  for (const plan of MEMBERSHIP_PLANS) {
    for (const label of [...plan.included, ...plan.excluded]) {
      if (!seen.has(label)) {
        seen.add(label);
        rows.push(label);
      }
    }
  }
  return rows;
}

export function planIncludesFeature(planId, label) {
  const plan = getPlanById(planId);
  return plan.included.includes(label);
}
