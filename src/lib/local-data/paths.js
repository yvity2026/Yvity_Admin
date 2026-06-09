import fs from "fs";
import path from "path";

function resolveDataDir() {
  if (process.env.YVITY_RUNTIME_DATA_DIR) {
    return path.resolve(process.env.YVITY_RUNTIME_DATA_DIR);
  }

  if (process.env.YVITY_DATA_DIR) {
    return path.resolve(process.env.YVITY_DATA_DIR);
  }

  const siblingUsersData = path.join(process.cwd(), "..", "Yvity_Users", ".data");
  if (fs.existsSync(siblingUsersData)) {
    return siblingUsersData;
  }

  return path.join(process.cwd(), "..", ".data");
}

/** Shared `.data` with Yvity_Users when present, else runtime / parent `../.data`. */
export function getDataDir() {
  return resolveDataDir();
}

/** @deprecated Prefer getDataDir() — resolved at call time for Vercel runtime bootstrap. */
export const DATA_DIR = getDataDir();

export function readJsonFile(filename, fallback) {
  try {
    const raw = fs.readFileSync(path.join(getDataDir(), filename), "utf-8");
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

export function writeJsonFile(filename, data) {
  const dir = getDataDir();
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, filename), JSON.stringify(data, null, 2), "utf-8");

  import("@/lib/supabase/platform-data-bootstrap")
    .then(({ shouldSyncFileToSupabase, syncFileToSupabase }) => {
      if (shouldSyncFileToSupabase(filename)) {
        return syncFileToSupabase(filename);
      }
      return null;
    })
    .catch((error) => {
      console.error(`[writeJsonFile] Supabase sync failed for ${filename}:`, error);
    });
}

export function goldAppBaseUrl() {
  return (
    process.env.YVITY_GOLD_BASE_URL ||
    process.env.NEXT_PUBLIC_YVITY_GOLD_BASE_URL ||
    process.env.NEXT_PUBLIC_APP_URL ||
    "http://localhost:3002"
  ).replace(/\/$/, "");
}

export function resolveGoldAssetUrl(url) {
  const trimmed = String(url ?? "").trim();
  if (!trimmed) return null;
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) return trimmed;
  if (trimmed.startsWith("/")) return `${goldAppBaseUrl()}${trimmed}`;
  return trimmed;
}
