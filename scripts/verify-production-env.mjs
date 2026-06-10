#!/usr/bin/env node
/**
 * Verify Vercel / production environment variables for Yvity_Admin.
 *
 * Usage:
 *   npm run verify:env              # reads .env.local if present
 *   npm run verify:env -- --ci      # warn only (for CI without secrets)
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const ciMode = process.argv.includes("--ci");

function loadEnvFile(filename) {
  const filePath = path.join(root, filename);
  if (!fs.existsSync(filePath)) return;
  for (const line of fs.readFileSync(filePath, "utf-8").split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq < 1) continue;
    const key = trimmed.slice(0, eq).trim();
    const value = trimmed.slice(eq + 1).trim();
    if (!(key in process.env)) process.env[key] = value;
  }
}

loadEnvFile(".env.local");
loadEnvFile(".env");

const { getProductionEnvReport, ADMIN_UNUSED_ENV_KEYS } = await import(
  "../src/lib/env/production.js"
);
const { getWhatsAppApiUrl, isWhatsAppApiConfigured, useMetaOtpTemplate } =
  await import("../src/lib/whatsapp/config.js");

const report = getProductionEnvReport();

console.log("\nYVITY Admin — production environment check\n");

for (const item of report.checks) {
  const icon = item.ok ? "✓" : item.required ? "✗" : "⚠";
  const tag = item.required ? "required" : "recommended";
  console.log(`${icon} [${tag}] ${item.label}`);
  if (!item.ok && item.hint) console.log(`    ${item.hint}`);
}

console.log("\nWhatsApp runtime:");
console.log(`  API URL resolved: ${getWhatsAppApiUrl() || "(empty)"}`);
console.log(`  Configured: ${isWhatsAppApiConfigured() ? "yes" : "no"}`);
console.log(`  Delivery mode: ${useMetaOtpTemplate() ? "meta template" : "gateway (Yvity_Users)"}`);

if (process.env.WHATSAPP_OTP_TEMPLATE_NAME?.trim() && !useMetaOtpTemplate()) {
  console.log(
    "  Note: WHATSAPP_OTP_TEMPLATE_NAME is set but ignored (gateway URL — correct for Yvity_Users).",
  );
}

const setUnused = ADMIN_UNUSED_ENV_KEYS.filter((key) => process.env[key]?.trim());
if (setUnused.length) {
  console.log("\nSet on Vercel but unused by Yvity_Admin (safe to keep for Users app):");
  for (const key of setUnused) console.log(`  ○ ${key}`);
}

console.log("");

if (!report.ok) {
  console.log("Missing required variables:");
  for (const item of report.failedRequired) {
    console.log(`  - ${item.label}`);
  }
  console.log("\nCopy .env.example → Vercel Project → Settings → Environment Variables");
  if (ciMode) {
    console.log("\nCI mode: continuing with warnings.\n");
    process.exit(0);
  }
  process.exit(1);
}

if (report.warnings.length) {
  console.log("Optional gaps (features may be limited):");
  for (const item of report.warnings) {
    console.log(`  - ${item.label}`);
  }
}

console.log("\nProduction env looks ready for live deploy.\n");
