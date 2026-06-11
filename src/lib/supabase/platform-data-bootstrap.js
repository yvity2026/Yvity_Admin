import fs from "fs";
import path from "path";
import os from "os";
import { getDataDir } from "@/lib/local-data/paths";
import { useSupabasePersistence } from "@/lib/supabase/persistence-mode";
import { listPlatformDocuments } from "@/lib/supabase/platform-documents";

/** JSON filenames synced with platform_documents.document_key */
export const PLATFORM_DOCUMENT_FILES = [
  "admin-platform-settings.json",
  "membership-plans-config.json",
  "feature-controls-config.json",
  "coupons.json",
  "ambassador-program-config.json",
  "ambassadors.json",
  "referrals.json",
  "ambassador-rewards.json",
  "reward-engine-campaigns.json",
  "ambassador-campaigns.json",
  "marketing-communications.json",
  "platform-announcements.json",
  "role-template-overrides.json",
  "payment-links.json",
  "profile-update-requests.json",
];

const DEFAULT_DOCUMENTS = {
  "admin-platform-settings.json": {
    platform: {
      name: "YVITY",
      tagline: "Credibility that Connects",
      status: "active",
    },
    updatedAt: null,
  },
  "membership-plans-config.json": { plans: [] },
  "feature-controls-config.json": { planLimits: {}, globalFlags: {}, updatedAt: null },
  "coupons.json": { coupons: {} },
  "ambassador-program-config.json": {
    config: {
      status: "active",
      referralRules: {
        qualifyingPlans: ["silver", "gold"],
        qualifyingCheckoutKinds: ["purchase"],
        attributionWindowDays: 30,
        linkParam: "ref",
      },
      rewardRules: {
        onQualifiedReferral: {
          rewardType: "discount_coupon",
          discountType: "percent",
          discountValue: 10,
          appliesTo: ["silver", "gold"],
          label: "Ambassador referral reward",
        },
      },
      eligibilityRules: {
        autoEnrollAllAdvisors: true,
        allowFreeReferrers: true,
        requireApproval: false,
      },
    },
  },
  "ambassadors.json": { ambassadors: {} },
  "referrals.json": { referrals: {} },
  "ambassador-rewards.json": { rewards: {} },
  "reward-engine-campaigns.json": { campaigns: {} },
  "ambassador-campaigns.json": { campaigns: [] },
  "marketing-communications.json": { campaigns: [], updatedAt: null },
  "platform-announcements.json": { announcements: [] },
  "role-template-overrides.json": { overrides: {} },
  "payment-links.json": { links: {} },
  "profile-update-requests.json": { requests: [] },
};

let bootstrapPromise = null;
let bootstrapFailed = false;

function runtimeDataDir() {
  return path.join(os.tmpdir(), "yvity-admin-data");
}

export function isRuntimeDataBootstrapped() {
  return Boolean(process.env.YVITY_RUNTIME_DATA_DIR);
}

/**
 * On Vercel (no sibling .data), hydrate /tmp JSON from Supabase so existing stores work unchanged.
 * Never throws — auth and dashboard APIs must stay available if bootstrap fails.
 */
export async function ensurePlatformDataReady() {
  if (!useSupabasePersistence()) return true;

  if (process.env.YVITY_RUNTIME_DATA_DIR && fs.existsSync(process.env.YVITY_RUNTIME_DATA_DIR)) {
    return true;
  }

  if (bootstrapFailed) return false;

  if (!bootstrapPromise) {
    bootstrapPromise = bootstrapRuntimeData()
      .then(() => true)
      .catch((error) => {
        bootstrapFailed = true;
        bootstrapPromise = null;
        console.error("[platform-data-bootstrap] failed:", error);
        return false;
      });
  }

  return bootstrapPromise;
}

async function bootstrapRuntimeData() {
  const dir = runtimeDataDir();
  fs.mkdirSync(dir, { recursive: true });

  const rows = await listPlatformDocuments();
  const byKey = new Map(rows.map((row) => [row.document_key, row.document]));

  for (const filename of PLATFORM_DOCUMENT_FILES) {
    const filePath = path.join(dir, filename);
    if (byKey.has(filename)) {
      fs.writeFileSync(filePath, `${JSON.stringify(byKey.get(filename), null, 2)}\n`, "utf-8");
      continue;
    }

    const fallback = DEFAULT_DOCUMENTS[filename];
    if (fallback !== null && fallback !== undefined) {
      fs.writeFileSync(filePath, `${JSON.stringify(fallback, null, 2)}\n`, "utf-8");
    }
  }

  try {
    const { hydrateCoreTablesToRuntimeData } = await import("@/lib/supabase/hydrate-runtime-data");
    await hydrateCoreTablesToRuntimeData(dir);
  } catch (error) {
    console.warn("[platform-data-bootstrap] core table hydrate skipped:", error?.message || error);
  }

  process.env.YVITY_RUNTIME_DATA_DIR = dir;
  return true;
}

export function shouldSyncFileToSupabase(filename) {
  return useSupabasePersistence() && PLATFORM_DOCUMENT_FILES.includes(filename);
}

export async function syncFileToSupabase(filename) {
  if (!shouldSyncFileToSupabase(filename)) return;

  const filePath = path.join(getDataDir(), filename);
  if (!fs.existsSync(filePath)) return;

  const { writePlatformDocument } = await import("@/lib/supabase/platform-documents");
  const document = JSON.parse(fs.readFileSync(filePath, "utf-8"));
  await writePlatformDocument(filename, document);
}
