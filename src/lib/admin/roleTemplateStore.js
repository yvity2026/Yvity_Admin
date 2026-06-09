import fs from "fs";
import path from "path";
import { getDataDir } from "@/lib/local-data/paths";

function overridesFile() {
  return path.join(getDataDir(), "role-template-overrides.json");
}

function readOverrides() {
  try {
    const file = overridesFile();
    if (!fs.existsSync(file)) return {};
    const parsed = JSON.parse(fs.readFileSync(file, "utf-8"));
    return parsed.overrides || parsed;
  } catch {
    return {};
  }
}

function writeOverrides(data) {
  const file = overridesFile();
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, JSON.stringify({ overrides: data }, null, 2), "utf-8");
  import("@/lib/supabase/platform-data-bootstrap")
    .then(({ shouldSyncFileToSupabase, syncFileToSupabase }) => {
      if (shouldSyncFileToSupabase("role-template-overrides.json")) {
        return syncFileToSupabase("role-template-overrides.json");
      }
      return null;
    })
    .catch((error) => {
      console.error("[roleTemplateStore] Supabase sync failed:", error);
    });
}

export function getTemplateOverride(templateId) {
  const overrides = readOverrides();
  return overrides[templateId] || null;
}

export function getAllTemplateOverrides() {
  return readOverrides();
}

export function saveTemplateOverride(templateId, permissions) {
  const overrides = readOverrides();
  overrides[templateId] = permissions;
  writeOverrides(overrides);
  return overrides[templateId];
}
