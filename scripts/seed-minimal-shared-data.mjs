#!/usr/bin/env node
/**
 * Creates empty shared JSON files in Yvity_Users/.data when missing.
 * Safe for CI and fresh clones — never overwrites existing files.
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const adminRoot = path.resolve(__dirname, "..");
const dataDir =
  process.env.YVITY_DATA_DIR ||
  path.join(adminRoot, "..", "Yvity_Users", ".data");

const MINIMAL_FILES = {
  "registration.json": { users: [], selfieUrls: {} },
  "advisor-profiles.json": { profiles: {} },
  "referrals.json": { referrals: {} },
  "ambassadors.json": { ambassadors: {} },
  "reward-engine-campaigns.json": { campaigns: {} },
  "ambassador-rewards.json": { rewards: {} },
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
};

fs.mkdirSync(dataDir, { recursive: true });

let created = 0;
let skipped = 0;

for (const [filename, payload] of Object.entries(MINIMAL_FILES)) {
  const filePath = path.join(dataDir, filename);
  if (fs.existsSync(filePath)) {
    skipped += 1;
    continue;
  }
  fs.writeFileSync(filePath, `${JSON.stringify(payload, null, 2)}\n`, "utf-8");
  created += 1;
  console.log(`  + ${filename}`);
}

console.log(`\nShared data: ${dataDir}`);
console.log(`Created ${created}, skipped ${skipped} (already present)\n`);
