import fs from "fs";
import path from "path";

export function isSupabaseConfigured() {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() &&
      process.env.SUPABASE_SERVICE_ROLE_KEY?.trim(),
  );
}

function siblingUsersDataDir() {
  return path.join(process.cwd(), "..", "Yvity_Users", ".data");
}

/** True when API should use Supabase platform_documents (production / Vercel). */
export function useSupabasePersistence() {
  if (process.env.YVITY_FORCE_LOCAL_DATA === "true") return false;
  if (!isSupabaseConfigured()) return false;

  try {
    if (fs.existsSync(siblingUsersDataDir())) return false;
  } catch {
    // ignore
  }

  return true;
}
