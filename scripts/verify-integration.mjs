#!/usr/bin/env node
/**
 * Verifies Yvity_Admin ↔ Yvity_Users local integration.
 * Run from Yvity_Admin root: npm run verify:integration
 *
 * Flags:
 *   --ci     Admin module checks only; skip sibling/.data when Users repo absent
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const adminRoot = path.resolve(__dirname, "..");
const ciMode = process.argv.includes("--ci");
const usersRoot = path.join(adminRoot, "..", "Yvity_Users");
const usersData = process.env.YVITY_DATA_DIR
  ? path.resolve(process.env.YVITY_DATA_DIR)
  : path.join(usersRoot, ".data");
const usersPresent = fs.existsSync(path.join(usersRoot, "package.json"));

function ok(label, pass, detail = "") {
  const icon = pass ? "✓" : "✗";
  console.log(`${icon} ${label}${detail ? ` — ${detail}` : ""}`);
  return pass;
}

console.log("\nYVITY Admin ↔ Users integration check\n");
console.log(`Admin root:  ${adminRoot}`);
console.log(`Shared data: ${usersData}`);
if (ciMode) console.log("Mode:        CI (sibling checks optional)\n");
else console.log("");

let passed = 0;
let failed = 0;
let skipped = 0;

const track = (result) => (result ? (passed += 1) : (failed += 1));
const skip = (label, detail = "") => {
  skipped += 1;
  console.log(`○ ${label}${detail ? ` — ${detail}` : ""} (skipped)`);
};

if (!usersPresent && ciMode) {
  skip("Yvity_Users repo sibling", "not checked out in CI");
  skip("Shared .data checks", "run locally with sibling repos");
} else {
  track(ok("Shared .data folder exists", fs.existsSync(usersData)));
}

const sharedFiles = [
  ["registration.json", "Users + Admin user lists"],
  ["advisor-profiles.json", "Profiles, analytics, ambassadors"],
  ["referrals.json", "Referral program (both apps)"],
  ["ambassadors.json", "Ambassador registry"],
  ["reward-engine-campaigns.json", "Rewards engine (Admin writes, Users grants)"],
  ["ambassador-program-config.json", "Program rules"],
  ["ambassador-rewards.json", "Earned rewards"],
];

if (usersPresent || !ciMode) {
  for (const [file, purpose] of sharedFiles) {
    track(ok(file, fs.existsSync(path.join(usersData, file)), purpose));
  }
}

const optionalFiles = [
  "advisor-payments.json",
  "marketing-communications.json",
  "admin-platform-settings.json",
  "ambassador-campaigns.json",
  "role-template-overrides.json",
];

if (usersPresent || !ciMode) {
  console.log("\nOptional (created on first use):");
  for (const file of optionalFiles) {
    const exists = fs.existsSync(path.join(usersData, file));
    console.log(`  ${exists ? "✓" : "○"} ${file}`);
  }
}

if (usersPresent) {
  track(ok("Yvity_Users repo sibling", true));
} else if (!ciMode) {
  track(ok("Yvity_Users repo sibling", false));
}

const goldUrl = process.env.YVITY_GOLD_BASE_URL || "http://localhost:3002";
console.log(`\nGold app URL (referral links / assets): ${goldUrl}`);

if (usersPresent) {
  const usersEnvLocal = path.join(usersRoot, ".env.local");
  let forceLocal = process.env.YVITY_FORCE_LOCAL_DATA === "true";
  if (!forceLocal && fs.existsSync(usersEnvLocal)) {
    const envText = fs.readFileSync(usersEnvLocal, "utf-8");
    forceLocal = /^\s*YVITY_FORCE_LOCAL_DATA\s*=\s*true\s*$/m.test(envText);
  }
  track(
    ok(
      "YVITY_FORCE_LOCAL_DATA=true (Users)",
      forceLocal,
      "profiles/payments must write JSON for Admin to see them",
    ),
  );
} else if (ciMode) {
  skip("YVITY_FORCE_LOCAL_DATA check");
}

const modules = [
  ["Analytics", "src/lib/admin/analytics/buildAnalyticsSnapshot.js"],
  ["Ambassadors", "src/lib/local-data/ambassadors-store.js"],
  ["Rewards engine", "src/lib/local-data/reward-engine-store.js"],
  ["Communications", "src/lib/local-data/communications-store.js"],
  ["Settings", "src/lib/local-data/settings-store.js"],
  ["Users (local)", "src/lib/local-data/users.js"],
  ["Approvals (local)", "src/lib/local-data/advisor-approvals.js"],
];

console.log("\nAdmin modules:");
for (const [name, rel] of modules) {
  track(ok(name, fs.existsSync(path.join(adminRoot, rel))));
}

if (usersPresent) {
  console.log("\nUsers reward/referral modules:");
  const usersModules = [
    ["referrals-store.ts", "../Yvity_Users/src/lib/server/referrals-store.ts"],
    ["reward-engine.ts", "../Yvity_Users/src/lib/server/reward-engine.ts"],
    ["payment-store.ts", "../Yvity_Users/src/lib/server/payment-store.ts"],
  ];
  for (const [name, rel] of usersModules) {
    track(ok(name, fs.existsSync(path.join(adminRoot, rel))));
  }
} else if (ciMode) {
  skip("Users reward/referral modules");
}

console.log(`\nResult: ${passed} passed, ${failed} failed${skipped ? `, ${skipped} skipped` : ""}`);
if (failed > 0) {
  console.log("\nFix: ensure Yvity_Users and Yvity_Admin are sibling folders and Users .data is populated.");
  console.log("Or set YVITY_DATA_DIR to an absolute path to the shared .data folder.\n");
  process.exit(1);
}

console.log("\nLocal integration looks good. Start both apps:");
console.log("  Yvity_Admin:  npm run dev  → http://localhost:3000");
console.log("  Yvity_Users:  npm run dev  → http://localhost:3002\n");
