#!/usr/bin/env node
/**
 * Logs into Yvity_Admin (dev OTP) and smoke-tests main GET APIs.
 * Run from Yvity_Admin root: npm run smoke:admin
 *
 * Env (from .env.local or shell):
 *   ADMIN_BASE_URL          default http://localhost:3000
 *   YVITY_ADMIN_DEV_PHONE   default 9014143132
 *   YVITY_ADMIN_DEV_OTP     default 123456
 *   YVITY_GOLD_BASE_URL     default http://localhost:3002
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const adminRoot = path.resolve(__dirname, "..");

function loadEnvFile(filename) {
  const filePath = path.join(adminRoot, filename);
  if (!fs.existsSync(filePath)) return;
  const text = fs.readFileSync(filePath, "utf-8");
  for (const line of text.split("\n")) {
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

const ADMIN_BASE = (process.env.ADMIN_BASE_URL || process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000").replace(/\/$/, "");
const GOLD_BASE = (process.env.YVITY_GOLD_BASE_URL || "http://localhost:3002").replace(/\/$/, "");
const DEV_PHONE = process.env.YVITY_ADMIN_DEV_PHONE || "9014143132";
const DEV_OTP = process.env.YVITY_ADMIN_DEV_OTP || "123456";
const REQUEST_TIMEOUT_MS = Number(process.env.SMOKE_TIMEOUT_MS || 120_000);

const ENDPOINTS = [
  { group: "Dashboard", path: "/api/admin/overview" },
  { group: "Users", path: "/api/admin/users?page=1&limit=5" },
  { group: "Profiles", path: "/api/admin/profiles?page=1&limit=5" },
  { group: "Approvals", path: "/api/admin/approvals?page=1&limit=5" },
  { group: "Platform reviews", path: "/api/admin/platform-testimonials" },
  { group: "Advisor reviews", path: "/api/admin/advisor-testimonials" },
  { group: "Complaints", path: "/api/admin/complaints?page=1&limit=5" },
  { group: "Visibility", path: "/api/admin/visibility-controls" },
  { group: "Products & plans", path: "/api/admin/products-plans" },
  { group: "Plans", path: "/api/admin/plans" },
  { group: "Pricing", path: "/api/admin/pricing" },
  { group: "Coupons", path: "/api/admin/coupons" },
  { group: "Feature controls", path: "/api/admin/feature-controls" },
  { group: "Billing", path: "/api/admin/billing?page=1&limit=5" },
  { group: "Payments", path: "/api/admin/payments?page=1&limit=5" },
  { group: "Ambassadors", path: "/api/admin/ambassadors" },
  { group: "Analytics", path: "/api/admin/analytics" },
  { group: "Roles", path: "/api/admin/roles/overview" },
  { group: "Roles activity", path: "/api/admin/roles/activity?page=1&limit=5" },
  { group: "Communications", path: "/api/admin/communications/overview" },
  { group: "Settings", path: "/api/admin/settings" },
];

function responseLooksValid(json) {
  if (!json || typeof json !== "object" || Array.isArray(json)) return false;
  if (json.error) return false;
  return Object.keys(json).length > 0;
}

function icon(status) {
  if (status === "pass") return "✓";
  if (status === "warn") return "⚠";
  return "✗";
}

async function fetchWithTimeout(url, options = {}) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  try {
    return await fetch(url, { ...options, signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
}

function extractSessionCookie(response) {
  const setCookies =
    typeof response.headers.getSetCookie === "function"
      ? response.headers.getSetCookie()
      : [response.headers.get("set-cookie")].filter(Boolean);

  for (const raw of setCookies) {
    const match = String(raw).match(/^admin_session=([^;]+)/);
    if (match) return `admin_session=${match[1]}`;
  }
  return null;
}

async function ping(label, url) {
  try {
    const res = await fetchWithTimeout(url, { method: "GET", redirect: "manual" });
    const ok = res.status < 500;
    console.log(`${ok ? "✓" : "✗"} ${label} reachable (${res.status}) — ${url}`);
    return ok;
  } catch (error) {
    console.log(`✗ ${label} unreachable — ${url}`);
    console.log(`  ${error.message}`);
    return false;
  }
}

async function login() {
  const url = `${ADMIN_BASE}/api/auth/admin/login/verify-otp`;
  const res = await fetchWithTimeout(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ phone: DEV_PHONE, otp: DEV_OTP }),
  });

  const body = await res.json().catch(() => ({}));
  const cookie = extractSessionCookie(res);

  if (!res.ok || !body.success || !cookie) {
    throw new Error(
      `Login failed (${res.status}): ${body.error || "missing admin_session cookie"}`,
    );
  }

  return cookie;
}

async function testEndpoint(cookie, endpoint) {
  const url = `${ADMIN_BASE}${endpoint.path}`;
  const started = Date.now();

  try {
    const res = await fetchWithTimeout(url, {
      headers: { Cookie: cookie, Accept: "application/json" },
    });
    const elapsed = Date.now() - started;
    const json = await res.json().catch(() => null);

    if (res.status === 401) {
      return { status: "fail", detail: `401 Unauthorized (${elapsed}ms)` };
    }
    if (res.status === 403) {
      return { status: "fail", detail: `403 Forbidden (${elapsed}ms)` };
    }
    if (res.status >= 500) {
      const msg = json?.error || res.statusText;
      return { status: "fail", detail: `${res.status} ${msg} (${elapsed}ms)` };
    }
    if (res.status === 501) {
      const msg = json?.error || "local data unavailable";
      return { status: "warn", detail: `501 ${msg} (${elapsed}ms)` };
    }
    if (!res.ok) {
      const msg = json?.error || res.statusText;
      return { status: "fail", detail: `${res.status} ${msg} (${elapsed}ms)` };
    }

    if (!responseLooksValid(json)) {
      return {
        status: "warn",
        detail: `200 OK but response empty or errored (${elapsed}ms)`,
      };
    }

    const keys = Object.keys(json).slice(0, 4).join(", ");
    return { status: "pass", detail: `200 OK [${keys}] (${elapsed}ms)` };
  } catch (error) {
    const elapsed = Date.now() - started;
    const msg = error.name === "AbortError" ? `timeout after ${REQUEST_TIMEOUT_MS}ms` : error.message;
    return { status: "fail", detail: `${msg} (${elapsed}ms)` };
  }
}

async function main() {
  console.log("\nYVITY Admin API smoke test\n");
  console.log(`Admin:  ${ADMIN_BASE}`);
  console.log(`Users:  ${GOLD_BASE}`);
  console.log(`Phone:  ${DEV_PHONE}  OTP: ${DEV_OTP}\n`);

  const adminUp = await ping("Admin app", ADMIN_BASE);
  const usersUp = await ping("Users app", GOLD_BASE);
  if (!adminUp) {
    console.log("\nStart Admin: npm run dev (port 3000)\n");
    process.exit(1);
  }
  if (!usersUp) {
    console.log("\nWarning: Users app not running — shared-data features may be stale.\n");
  }

  let cookie;
  try {
    cookie = await login();
    console.log(`✓ Dev login succeeded (admin_session set)\n`);
  } catch (error) {
    console.log(`✗ Dev login failed: ${error.message}`);
    console.log("\nCheck YVITY_USE_LOCAL_APPROVALS=true and dev phone/OTP in .env.local\n");
    process.exit(1);
  }

  let pass = 0;
  let warn = 0;
  let fail = 0;
  let lastGroup = "";

  for (const endpoint of ENDPOINTS) {
    if (endpoint.group !== lastGroup) {
      console.log(`\n${endpoint.group}`);
      lastGroup = endpoint.group;
    }

    const result = await testEndpoint(cookie, endpoint);
    console.log(`  ${icon(result.status)} ${endpoint.path}`);
    console.log(`    ${result.detail}`);

    if (result.status === "pass") pass += 1;
    else if (result.status === "warn") warn += 1;
    else fail += 1;
  }

  console.log(`\nResult: ${pass} passed, ${warn} warnings, ${fail} failed`);
  if (fail > 0) process.exit(1);
  if (warn > 0) process.exit(2);
  console.log("\nAll smoke tests passed.\n");
}

main().catch((error) => {
  console.error("\nSmoke test crashed:", error);
  process.exit(1);
});
