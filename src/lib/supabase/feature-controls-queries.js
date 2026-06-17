import { getPlatformConfig, setPlatformConfig } from "@/lib/supabase/platform-configs";
import { DEFAULT_GLOBAL_FLAGS, LIMIT_FIELD_DEFS, getDefaultPlanLimits } from "@/lib/admin/features/featureCatalog";
import { listFeatureControlPlanTiers } from "@/lib/local-data/feature-controls-store";

const KEY = "feature_controls";

async function loadConfig() {
  const stored = await getPlatformConfig(KEY);
  const defaultLimits = getDefaultPlanLimits();
  return {
    planLimits: { ...defaultLimits, ...(stored?.planLimits || {}) },
    globalFlags: { ...DEFAULT_GLOBAL_FLAGS, ...(stored?.globalFlags || {}) },
    updatedAt: stored?.updatedAt || null,
  };
}

async function saveConfig(config) {
  await setPlatformConfig(KEY, { ...config, updatedAt: new Date().toISOString() });
}

export async function getFeatureControlsFromSupabase() {
  const db = await loadConfig();
  const tiers = listFeatureControlPlanTiers();
  const defaultLimits = getDefaultPlanLimits();

  const planLimits = tiers.reduce((acc, tier) => {
    acc[tier.id] = { ...(defaultLimits[tier.id] || {}), ...(db.planLimits[tier.id] || {}) };
    return acc;
  }, {});

  const globalFlags = db.globalFlags;
  const booleanFeatures = LIMIT_FIELD_DEFS.filter((f) => f.type === "boolean").length;

  return {
    planLimits,
    globalFlags,
    globalFlagDefs: Object.keys(globalFlags).map((key) => ({ key, enabled: Boolean(globalFlags[key]) })),
    overview: {
      planTiers: tiers.length,
      limitFields: LIMIT_FIELD_DEFS.length,
      globalFlagsEnabled: Object.values(globalFlags).filter(Boolean).length,
      globalFlagsTotal: Object.keys(globalFlags).length,
      enabledByPlan: tiers.map((tier) => {
        const limits = planLimits[tier.id] || {};
        return {
          planId: tier.id,
          enabled: LIMIT_FIELD_DEFS.filter((f) => f.type === "boolean" && limits[f.key]).length,
          total: booleanFeatures,
        };
      }),
      lastUpdatedAt: db.updatedAt,
    },
  };
}

export async function updateGlobalFlagsInSupabase(flags = {}) {
  const db = await loadConfig();
  db.globalFlags = { ...db.globalFlags, ...flags };
  await saveConfig(db);
  return { success: true, globalFlags: db.globalFlags };
}

export async function updatePlanLimitsInSupabase(planId, updates = {}) {
  const tiers = listFeatureControlPlanTiers();
  if (!tiers.find((t) => t.id === planId)) return { error: "Invalid plan tier", status: 400 };

  const db = await loadConfig();
  const defaultLimits = getDefaultPlanLimits();
  const current = { ...(defaultLimits[planId] || {}), ...(db.planLimits[planId] || {}) };
  const next = { ...current };

  for (const field of LIMIT_FIELD_DEFS) {
    if (updates[field.key] !== undefined) next[field.key] = updates[field.key];
  }

  db.planLimits[planId] = next;
  await saveConfig(db);
  return { success: true, planId, limits: next };
}

export async function resetPlanLimitsInSupabase(planId) {
  const tiers = listFeatureControlPlanTiers();
  if (!tiers.find((t) => t.id === planId)) return { error: "Plan tier not found", status: 404 };

  const db = await loadConfig();
  const defaultLimits = getDefaultPlanLimits();
  db.planLimits[planId] = { ...(defaultLimits[planId] || defaultLimits.free || {}) };
  await saveConfig(db);
  return { success: true, planId, limits: db.planLimits[planId] };
}
