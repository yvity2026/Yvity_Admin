import { localDataAvailable } from "@/lib/local-data/advisor-approvals";
import { useSupabasePersistence } from "@/lib/supabase/persistence-mode";
import {
  BUILTIN_PLAN_TIERS,
  DEFAULT_GLOBAL_FLAGS,
  getDefaultPlanLimits,
  LIMIT_FIELD_DEFS,
} from "@/lib/admin/features/featureCatalog";
import { readJsonFile, writeJsonFile } from "@/lib/local-data/paths";

const CONFIG_FILE = "feature-controls-config.json";
const MEMBERSHIP_CONFIG_FILE = "membership-plans-config.json";

function loadConfigDb() {
  const defaults = {
    planLimits: getDefaultPlanLimits(),
    globalFlags: { ...DEFAULT_GLOBAL_FLAGS },
    updatedAt: null,
  };

  const db = readJsonFile(CONFIG_FILE, defaults);
  return {
    planLimits: {
      ...getDefaultPlanLimits(),
      ...(db.planLimits || {}),
    },
    globalFlags: {
      ...DEFAULT_GLOBAL_FLAGS,
      ...(db.globalFlags || {}),
    },
    updatedAt: db.updatedAt || null,
  };
}

function saveConfigDb(db) {
  writeJsonFile(CONFIG_FILE, {
    ...db,
    updatedAt: new Date().toISOString(),
  });
}

function getBaseLimitsForTier(planId, templatePlanId = "gold") {
  const defaults = getDefaultPlanLimits();
  if (defaults[planId]) return { ...defaults[planId] };
  const template = defaults[templatePlanId] ? templatePlanId : "gold";
  return { ...(defaults[template] || defaults.gold) };
}

function loadMembershipPlanTiers() {
  const db = readJsonFile(MEMBERSHIP_CONFIG_FILE, { plans: [] });
  return (db.plans || []).map((plan) => ({
    id: plan.id,
    name: plan.name || plan.id,
    limitsTemplate: plan.limitsTemplate || plan.id,
  }));
}

export function listFeatureControlPlanTiers() {
  const plans = loadMembershipPlanTiers();
  if (!plans.length) {
    return BUILTIN_PLAN_TIERS.map((id) => ({
      id,
      name: id.charAt(0).toUpperCase() + id.slice(1),
      limitsTemplate: id,
    }));
  }
  return plans.map((plan) => ({
    id: plan.id,
    name: plan.name,
    limitsTemplate: plan.limitsTemplate || plan.id,
  }));
}

function normalizePlanLimitsRecord(planId, limits = {}, templatePlanId = "gold") {
  const defaults = getBaseLimitsForTier(planId, templatePlanId);
  const normalized = { ...defaults };

  for (const field of LIMIT_FIELD_DEFS) {
    if (limits[field.key] === undefined) continue;
    normalized[field.key] = limits[field.key];
  }

  return normalized;
}

export function useFeatureControlsStore() {
  return localDataAvailable() || useSupabasePersistence();
}

export function getConfiguredPlanLimits(planId, templatePlanId) {
  const db = loadConfigDb();
  const tier = listFeatureControlPlanTiers().find((plan) => plan.id === planId);
  const template = templatePlanId || tier?.limitsTemplate || planId;
  return normalizePlanLimitsRecord(planId, db.planLimits[planId], template);
}

export function getAllConfiguredPlanLimits() {
  const db = loadConfigDb();
  const tiers = listFeatureControlPlanTiers();
  return tiers.reduce((acc, tier) => {
    acc[tier.id] = normalizePlanLimitsRecord(
      tier.id,
      db.planLimits[tier.id],
      tier.limitsTemplate,
    );
    return acc;
  }, {});
}

export function seedPlanLimitsFromTemplate(planId, templatePlanId) {
  const db = loadConfigDb();
  const template = templatePlanId || "gold";
  const source =
    db.planLimits[template] ||
    getBaseLimitsForTier(template, template) ||
    getBaseLimitsForTier("gold", "gold");
  db.planLimits[planId] = { ...source };
  saveConfigDb(db);
  return { success: true, planId, limits: db.planLimits[planId] };
}

export function getFeatureControlsSnapshot() {
  const db = loadConfigDb();
  const planLimits = getAllConfiguredPlanLimits();
  const globalFlags = db.globalFlags;
  const planTiers = listFeatureControlPlanTiers();

  const booleanFeatures = LIMIT_FIELD_DEFS.filter((field) => field.type === "boolean").length;
  const enabledByPlan = planTiers.map((tier) => {
    const limits = planLimits[tier.id];
    const enabled = LIMIT_FIELD_DEFS.filter(
      (field) => field.type === "boolean" && limits[field.key],
    ).length;
    return { planId: tier.id, enabled, total: booleanFeatures };
  });

  return {
    planTiers,
    planLimits,
    globalFlags,
    globalFlagDefs: Object.keys(globalFlags).map((key) => ({
      key,
      enabled: Boolean(globalFlags[key]),
    })),
    overview: {
      planTiers: planTiers.length,
      limitFields: LIMIT_FIELD_DEFS.length,
      globalFlagsEnabled: Object.values(globalFlags).filter(Boolean).length,
      globalFlagsTotal: Object.keys(globalFlags).length,
      enabledByPlan,
      lastUpdatedAt: db.updatedAt,
    },
  };
}

export function updateGlobalFlags(updates = {}) {
  const db = loadConfigDb();
  db.globalFlags = {
    ...db.globalFlags,
    ...updates,
  };
  saveConfigDb(db);
  return { success: true, globalFlags: db.globalFlags };
}

export function updatePlanLimits(planId, updates = {}) {
  const tier = listFeatureControlPlanTiers().find((plan) => plan.id === planId);
  if (!tier) {
    return { error: "Invalid plan tier", status: 400 };
  }

  const db = loadConfigDb();
  const current = normalizePlanLimitsRecord(planId, db.planLimits[planId]);
  const next = normalizePlanLimitsRecord(planId, { ...current, ...updates });

  db.planLimits[planId] = next;
  saveConfigDb(db);
  return { success: true, planId, limits: next };
}

export function resetPlanLimits(planId) {
  const tier = listFeatureControlPlanTiers().find((plan) => plan.id === planId);
  if (!tier) {
    return { error: "Plan tier not found", status: 404 };
  }

  const db = loadConfigDb();
  db.planLimits[planId] = getBaseLimitsForTier(planId, tier.limitsTemplate);
  saveConfigDb(db);
  return { success: true, planId, limits: db.planLimits[planId] };
}
