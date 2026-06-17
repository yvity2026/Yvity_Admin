import { createAdminClient } from "@/lib/supabase/server";
import { getPlatformConfig, setPlatformConfig } from "@/lib/supabase/platform-configs";
import {
  DEFAULT_FEATURED_PRODUCTS,
  DEFAULT_PLANS_CONFIG,
  enrichFeaturedProduct,
  enrichPlanConfig,
} from "@/lib/local-data/membership-plans-store";
import { buildPlansResponse } from "@/lib/admin/plans/mapPlanRecord";
import { slugifyPlanId } from "@/lib/admin/plans/planPricing";

const KEY = "plan_pricing";

async function loadPricingConfig() {
  const stored = await getPlatformConfig(KEY);
  const defaultPlans = DEFAULT_PLANS_CONFIG.map((p) => ({ ...p }));
  const defaultFeatured = DEFAULT_FEATURED_PRODUCTS.map((p) => ({ ...p }));
  if (!stored) return { plans: defaultPlans, featuredProducts: defaultFeatured };

  const storedPlansById = Object.fromEntries((stored.plans || []).map((p) => [p.id, p]));
  const plans = defaultPlans.map((p) => ({ ...p, ...(storedPlansById[p.id] || {}) }));
  for (const p of stored.plans || []) {
    if (!defaultPlans.find((d) => d.id === p.id)) plans.push(p);
  }

  const storedFeaturedById = Object.fromEntries((stored.featuredProducts || []).map((p) => [p.id, p]));
  const featuredProducts = defaultFeatured.map((p) => ({ ...p, ...(storedFeaturedById[p.id] || {}) }));

  return { plans, featuredProducts };
}

async function countSubscribersByPlan(planIds = []) {
  const supabase = createAdminClient();
  const counts = {};
  await Promise.all(
    planIds.map(async (planId) => {
      const { count } = await supabase
        .from("advisor_profiles")
        .select("*", { count: "exact", head: true })
        .eq("subscription_plan", planId);
      counts[planId] = count || 0;
    }),
  );
  return counts;
}

export async function getPricingFromSupabase() {
  const { plans: rawPlans, featuredProducts: rawFeatured } = await loadPricingConfig();
  const plans = rawPlans.map(enrichPlanConfig);
  const featuredProducts = rawFeatured.map(enrichFeaturedProduct);
  const subscriberCounts = await countSubscribersByPlan(plans.map((p) => p.id));

  const response = buildPlansResponse(plans, subscriberCounts);

  return {
    ...response,
    featuredProducts,
    pricingOverview: {
      subscriptionPlans: plans.length,
      plansOnDiscount: plans.filter((p) => p.hasDiscount).length,
      featuredProducts: featuredProducts.length,
      featuredOnDiscount: featuredProducts.filter((p) => p.hasDiscount).length,
    },
    templates: plans.map((p) => ({ id: p.id, name: p.name })),
  };
}

export async function updatePlanPricingInSupabase(planId, updates = {}) {
  const db = await loadPricingConfig();
  const index = db.plans.findIndex((p) => p.id === planId);
  if (index < 0) return { error: "Plan not found", status: 404 };

  const current = db.plans[index];
  const listPriceInr =
    updates.listPriceInr !== undefined ? Number(updates.listPriceInr) : current.listPriceInr;
  const salePriceInr =
    updates.salePriceInr !== undefined ? Number(updates.salePriceInr) : current.salePriceInr;
  if (salePriceInr > listPriceInr)
    return { error: "Sale price cannot be higher than list price", status: 400 };

  db.plans[index] = {
    ...current,
    ...updates,
    id: current.id,
    listPriceInr,
    salePriceInr,
    updatedAt: new Date().toISOString(),
  };
  await setPlatformConfig(KEY, db);
  return { success: true, plan: enrichPlanConfig(db.plans[index]) };
}

export async function createPlanInSupabase(payload = {}) {
  const db = await loadPricingConfig();
  const id = slugifyPlanId(payload.id || payload.name);
  if (!id) return { error: "Plan id is required", status: 400 };
  if (db.plans.some((p) => p.id === id))
    return { error: "A plan with this id already exists", status: 409 };

  const template =
    db.plans.find((p) => p.id === payload.templatePlanId) || DEFAULT_PLANS_CONFIG[0];
  const listPriceInr = Number(payload.listPriceInr) || 0;
  const salePriceInr = Number(payload.salePriceInr) || 0;
  if (salePriceInr > listPriceInr)
    return { error: "Sale price cannot be higher than list price", status: 400 };

  const plan = {
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
  };

  db.plans.push(plan);
  await setPlatformConfig(KEY, db);
  return { success: true, plan: enrichPlanConfig(plan) };
}

export async function updateFeaturedPricingInSupabase(productId, updates = {}) {
  const db = await loadPricingConfig();
  const index = db.featuredProducts.findIndex((p) => p.id === productId);
  if (index < 0) return { error: "Featured product not found", status: 404 };

  const current = db.featuredProducts[index];
  const listPriceInr =
    updates.listPriceInr !== undefined ? Number(updates.listPriceInr) : current.listPriceInr;
  const salePriceInr =
    updates.salePriceInr !== undefined ? Number(updates.salePriceInr) : current.salePriceInr;
  if (salePriceInr > listPriceInr)
    return { error: "Sale price cannot be higher than list price", status: 400 };

  db.featuredProducts[index] = {
    ...current,
    ...updates,
    id: current.id,
    listPriceInr,
    salePriceInr,
    updatedAt: new Date().toISOString(),
  };
  await setPlatformConfig(KEY, db);
  return { success: true, product: enrichFeaturedProduct(db.featuredProducts[index]) };
}
