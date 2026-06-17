import fs from "fs";
import path from "path";
import { PLAN_LIMITS } from "@/lib/admin/plans/planCatalog";
import {
  getConfiguredPlanLimits,
  seedPlanLimitsFromTemplate,
} from "@/lib/local-data/feature-controls-store";
import {
  computeDiscountPercent,
  formatPriceLabel,
  hasActiveDiscount,
  slugifyPlanId,
} from "@/lib/admin/plans/planPricing";
import { localDataAvailable } from "@/lib/local-data/advisor-approvals";
import { useSupabasePersistence } from "@/lib/supabase/persistence-mode";
import { getDataDir, readJsonFile, writeJsonFile } from "@/lib/local-data/paths";

const CONFIG_FILE = "membership-plans-config.json";
const PROFILES_FILE = "advisor-profiles.json";

export const DEFAULT_PLANS_CONFIG = [
  {
    id: "free",
    name: "Free Plan",
    listPriceInr: 0,
    salePriceInr: 0,
    billingCycle: "year",
    tagline: "Perfect for trying YVITY",
    highlight: null,
    status: "active",
    limitsTemplate: "free",
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
    listPriceInr: 1999,
    salePriceInr: 1499,
    billingCycle: "year",
    tagline: "For verified professionals",
    highlight: "Most popular for active advisors",
    status: "active",
    limitsTemplate: "silver",
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
    listPriceInr: 9999,
    salePriceInr: 2999,
    billingCycle: "year",
    tagline: "For maximum visibility and growth",
    highlight: "Maximum visibility",
    status: "active",
    limitsTemplate: "gold",
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

export const DEFAULT_FEATURED_PRODUCTS = [
  {
    id: "hero_placement",
    name: "Hero placement",
    description: "Spotlight advisor card on the landing hero section (max 3 slots).",
    listPriceInr: 15000,
    salePriceInr: 9999,
    billingCycle: "month",
    durationDays: 30,
    status: "active",
  },
  {
    id: "find_advisors_placement",
    name: "Find Advisors placement",
    description: "Featured in the default Find Advisors grid without login (max 6 slots).",
    listPriceInr: 8000,
    salePriceInr: 4999,
    billingCycle: "month",
    durationDays: 30,
    status: "active",
  },
];

function normalizeStoredProduct(product = {}) {
  const salePriceInr = Number(product.salePriceInr ?? 0);
  const listPriceInr = Number(product.listPriceInr ?? salePriceInr);

  return {
    id: product.id,
    name: product.name || "Product",
    description: product.description || "",
    listPriceInr,
    salePriceInr,
    billingCycle: product.billingCycle || "month",
    durationDays: Number(product.durationDays) || 30,
    status: product.status || "active",
    updatedAt: product.updatedAt || null,
  };
}

export function enrichFeaturedProduct(product) {
  const normalized = normalizeStoredProduct(product);
  return {
    ...normalized,
    priceLabel: formatPriceLabel(normalized.salePriceInr, normalized.billingCycle),
    listPriceLabel: formatPriceLabel(normalized.listPriceInr, normalized.billingCycle),
    hasDiscount: hasActiveDiscount(normalized.listPriceInr, normalized.salePriceInr),
    discountPercent: computeDiscountPercent(normalized.listPriceInr, normalized.salePriceInr),
    statusLabel: normalized.status === "active" ? "Active" : "Inactive",
  };
}

function normalizeStoredPlan(plan = {}) {
  const salePriceInr = Number(plan.salePriceInr ?? plan.priceAnnualInr ?? 0);
  const listPriceInr = Number(plan.listPriceInr ?? salePriceInr);

  return {
    id: plan.id,
    name: plan.name || "Plan",
    listPriceInr,
    salePriceInr,
    billingCycle: plan.billingCycle || "year",
    tagline: plan.tagline || "",
    highlight: plan.highlight || null,
    status: plan.status || "active",
    limitsTemplate: plan.limitsTemplate || plan.id || "free",
    included: Array.isArray(plan.included) ? plan.included : [],
    excluded: Array.isArray(plan.excluded) ? plan.excluded : [],
    updatedAt: plan.updatedAt || null,
  };
}

export function enrichPlanConfig(plan) {
  const normalized = normalizeStoredPlan(plan);
  return {
    ...normalized,
    priceAnnualInr: normalized.salePriceInr,
    priceLabel: formatPriceLabel(normalized.salePriceInr, normalized.billingCycle),
    listPriceLabel: formatPriceLabel(normalized.listPriceInr, normalized.billingCycle),
    hasDiscount: hasActiveDiscount(normalized.listPriceInr, normalized.salePriceInr),
    discountPercent: computeDiscountPercent(normalized.listPriceInr, normalized.salePriceInr),
  };
}

function loadConfigDb() {
  const filePath = path.join(getDataDir(), CONFIG_FILE);
  if (!fs.existsSync(filePath)) {
    return {
      plans: DEFAULT_PLANS_CONFIG.map(normalizeStoredPlan),
      featuredProducts: DEFAULT_FEATURED_PRODUCTS.map(normalizeStoredProduct),
    };
  }
  const db = readJsonFile(CONFIG_FILE, {
    plans: DEFAULT_PLANS_CONFIG,
    featuredProducts: DEFAULT_FEATURED_PRODUCTS,
  });
  return {
    plans: (db.plans || DEFAULT_PLANS_CONFIG).map(normalizeStoredPlan),
    featuredProducts: (db.featuredProducts || DEFAULT_FEATURED_PRODUCTS).map(normalizeStoredProduct),
  };
}

function saveConfigDb(db) {
  writeJsonFile(CONFIG_FILE, db);
}

export function useMembershipPlansStore() {
  return localDataAvailable() || useSupabasePersistence();
}

export function listConfiguredPlans() {
  return loadConfigDb().plans.map(enrichPlanConfig);
}

export function getPlanLimitsForTemplate(templateId) {
  try {
    return getConfiguredPlanLimits(templateId);
  } catch {
    return PLAN_LIMITS[templateId] || PLAN_LIMITS.free;
  }
}

function countSubscribersByPlan() {
  const db = readJsonFile(PROFILES_FILE, { profiles: {} });
  const counts = {};

  for (const profile of Object.values(db.profiles || {})) {
    if (profile.account_status !== "active") continue;
    const key = String(profile.subscription_plan || "free").toLowerCase();
    counts[key] = (counts[key] || 0) + 1;
  }

  return counts;
}

export function listFeaturedProducts() {
  return loadConfigDb().featuredProducts.map(enrichFeaturedProduct);
}

export function getMembershipPlansSnapshot() {
  return {
    plans: listConfiguredPlans(),
    featuredProducts: listFeaturedProducts(),
    subscriberCounts: countSubscribersByPlan(),
  };
}

export function updateFeaturedProductPricing(productId, updates = {}) {
  const db = loadConfigDb();
  const index = db.featuredProducts.findIndex((item) => item.id === productId);
  if (index < 0) return { error: "Featured product not found", status: 404 };

  const current = db.featuredProducts[index];
  const next = normalizeStoredProduct({
    ...current,
    ...updates,
    id: current.id,
    listPriceInr:
      updates.listPriceInr !== undefined ? Number(updates.listPriceInr) : current.listPriceInr,
    salePriceInr:
      updates.salePriceInr !== undefined ? Number(updates.salePriceInr) : current.salePriceInr,
    durationDays:
      updates.durationDays !== undefined ? Number(updates.durationDays) : current.durationDays,
    updatedAt: new Date().toISOString(),
  });

  if (next.salePriceInr > next.listPriceInr) {
    return { error: "Sale price cannot be higher than list price", status: 400 };
  }

  db.featuredProducts[index] = next;
  saveConfigDb(db);
  return { success: true, product: enrichFeaturedProduct(next) };
}

export function updatePlanPricing(planId, updates = {}) {
  const db = loadConfigDb();
  const index = db.plans.findIndex((plan) => plan.id === planId);
  if (index < 0) return { error: "Plan not found", status: 404 };

  const current = db.plans[index];
  const next = normalizeStoredPlan({
    ...current,
    ...updates,
    id: current.id,
    listPriceInr:
      updates.listPriceInr !== undefined ? Number(updates.listPriceInr) : current.listPriceInr,
    salePriceInr:
      updates.salePriceInr !== undefined ? Number(updates.salePriceInr) : current.salePriceInr,
    updatedAt: new Date().toISOString(),
  });

  if (next.salePriceInr > next.listPriceInr) {
    return { error: "Sale price cannot be higher than list price", status: 400 };
  }

  db.plans[index] = next;
  saveConfigDb(db);
  return { success: true, plan: enrichPlanConfig(next) };
}

export function createPlanConfig(payload = {}) {
  const db = loadConfigDb();
  const id = slugifyPlanId(payload.id || payload.name);
  if (!id) return { error: "Plan id is required", status: 400 };
  if (db.plans.some((plan) => plan.id === id)) {
    return { error: "A plan with this id already exists", status: 409 };
  }

  const template = db.plans.find((plan) => plan.id === payload.templatePlanId) ||
    DEFAULT_PLANS_CONFIG.find((plan) => plan.id === payload.templatePlanId) ||
    DEFAULT_PLANS_CONFIG[0];

  const listPriceInr = Number(payload.listPriceInr) || 0;
  const salePriceInr = Number(payload.salePriceInr) || 0;

  if (salePriceInr > listPriceInr) {
    return { error: "Sale price cannot be higher than list price", status: 400 };
  }

  const templatePlanId = payload.templatePlanId || template.id;

  const plan = normalizeStoredPlan({
    id,
    name: payload.name?.trim() || "New Plan",
    listPriceInr,
    salePriceInr,
    billingCycle: payload.billingCycle || "year",
    tagline: payload.tagline || "",
    highlight: payload.highlight || null,
    status: payload.status || "active",
    limitsTemplate: id,
    included: [...(template.included || [])],
    excluded: [...(template.excluded || [])],
    updatedAt: new Date().toISOString(),
  });

  db.plans.push(plan);
  saveConfigDb(db);
  seedPlanLimitsFromTemplate(id, templatePlanId);
  return { success: true, plan: enrichPlanConfig(plan) };
}

export function updatePlanEntitlements(planId, updates = {}) {
  const db = loadConfigDb();
  const index = db.plans.findIndex((plan) => plan.id === planId);
  if (index < 0) return { error: "Plan not found", status: 404 };

  const current = db.plans[index];
  const included = Array.isArray(updates.included)
    ? updates.included.filter(Boolean)
    : current.included;
  const excluded = Array.isArray(updates.excluded)
    ? updates.excluded.filter(Boolean)
    : current.excluded;

  db.plans[index] = {
    ...current,
    included,
    excluded,
    updatedAt: new Date().toISOString(),
  };
  saveConfigDb(db);
  return { success: true, plan: enrichPlanConfig(db.plans[index]) };
}
