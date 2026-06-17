import { createAdminClient } from "@/lib/supabase/server";

export async function getPlatformConfig(key) {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from("platform_configs")
    .select("config")
    .eq("key", key)
    .maybeSingle();
  return data?.config || null;
}

export async function setPlatformConfig(key, config) {
  const supabase = createAdminClient();
  const { error } = await supabase
    .from("platform_configs")
    .upsert({ key, config, updated_at: new Date().toISOString() }, { onConflict: "key" });
  if (error) throw new Error(error.message);
  return config;
}
