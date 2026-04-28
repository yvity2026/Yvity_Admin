import { getUser } from "@/lib/auth/Getuser";
import { recordAdvisorLoginActivity } from "@/lib/advisor-score/recordAdvisorLoginActivity";
import { createAdminClient } from "@/lib/supabase/server";

export async function ValidateAdvisor() {
  try {
    const payload = await getUser();

    if (!payload?.id || !payload) {
      return null;
    }

    const supabase = createAdminClient();
    const { data, error } = await supabase.from("users").select("*").eq("id", payload.id).maybeSingle();
    
    if (error || !data) {
      return null;
    }

    let roles = data.roles;

    if (typeof roles === "string") {
      try {
        roles = JSON.parse(roles);
      } catch {
        return null;
      }
    }

    if (!Array.isArray(roles) || !roles.includes("advisor")) {
      return null;
    }

    await recordAdvisorLoginActivity(supabase, data);

    return data;
  } catch (error) {
    return null;
  }
}
