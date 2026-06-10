#!/usr/bin/env node
/**
 * Ensure admin_users exist in the configured Supabase project.
 * Usage: npm run bootstrap:admin
 *
 * Env (from .env.local):
 *   NEXT_PUBLIC_SUPABASE_URL
 *   SUPABASE_SERVICE_ROLE_KEY
 *   YVITY_BOOTSTRAP_ADMIN_PHONE  optional single admin (+91...)
 *   YVITY_BOOTSTRAP_ADMIN_NAME   optional name for single admin
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { createClient } from "@supabase/supabase-js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");

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

function normalizePhone(phone) {
  const digits = String(phone || "").replace(/\D/g, "");
  if (/^[6-9]\d{9}$/.test(digits)) return `+91${digits}`;
  if (/^91[6-9]\d{9}$/.test(digits)) return `+${digits}`;
  if (/^\+[1-9]\d{7,14}$/.test(String(phone || "").trim())) {
    return String(phone).trim();
  }
  return null;
}

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !key) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local");
  process.exit(1);
}

const supabase = createClient(url, key);

const defaultAdmins = [
  {
    phone_number: "+919014143132",
    role: "super_admin",
    name: "Krishna Mohan Noti",
    permissions: {},
  },
];

const bootstrapPhone = normalizePhone(process.env.YVITY_BOOTSTRAP_ADMIN_PHONE);
const bootstrapName = process.env.YVITY_BOOTSTRAP_ADMIN_NAME || "Super Admin";
const adminsToEnsure = bootstrapPhone
  ? [
      {
        phone_number: bootstrapPhone,
        role: "super_admin",
        name: bootstrapName,
        permissions: {},
      },
    ]
  : defaultAdmins;

const { data: existing, error: listError } = await supabase
  .from("admin_users")
  .select("id, phone_number, name, role, is_active");

if (listError) {
  console.error("Failed to read admin_users:", listError.message);
  process.exit(1);
}

console.log(`Supabase: ${url}`);
console.log(`Existing admins: ${existing?.length || 0}`);

for (const admin of adminsToEnsure) {
  const digits = admin.phone_number.replace(/\D/g, "").slice(-10);
  const already = existing?.find(
    (row) => String(row.phone_number || "").replace(/\D/g, "").slice(-10) === digits,
  );

  if (already) {
    console.log(`✓ ${admin.phone_number} already exists (${already.name})`);
    continue;
  }

  const { data, error } = await supabase
    .from("admin_users")
    .insert({
      phone_number: admin.phone_number,
      role: admin.role,
      name: admin.name,
      permissions: admin.permissions,
      is_active: true,
    })
    .select("id, phone_number, name, role")
    .single();

  if (error) {
    console.error(`✗ Failed to insert ${admin.phone_number}:`, error.message);
    process.exit(1);
  }

  console.log(`✓ Created admin ${data.phone_number} (${data.name}, ${data.role})`);
}

console.log("\nDone. Retry admin login with a registered mobile number.");
