import fs from "fs";
import path from "path";

/** Shared `.data` directory from the parent YVITY-Gold workspace. */
export const DATA_DIR = path.join(process.cwd(), "..", ".data");

export function readJsonFile(filename, fallback) {
  try {
    const raw = fs.readFileSync(path.join(DATA_DIR, filename), "utf-8");
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

export function writeJsonFile(filename, data) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
  fs.writeFileSync(path.join(DATA_DIR, filename), JSON.stringify(data, null, 2), "utf-8");
}

export function goldAppBaseUrl() {
  return (
    process.env.YVITY_GOLD_BASE_URL ||
    process.env.NEXT_PUBLIC_YVITY_GOLD_BASE_URL ||
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
