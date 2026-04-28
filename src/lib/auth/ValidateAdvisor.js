import { getUser } from "@/lib/auth/Getuser";
import { recordAdvisorLoginActivity } from "@/lib/advisor-score/recordAdvisorLoginActivity";
import { createAdminClient } from "@/lib/supabase/server";

export async function ValidateAdvisor() {
  try {
    const payload = await getUser();

    if (!payload?.id ||  !payload) {
      return null;
    }

    const supabase = createAdminClient();
    const { data, error} = await supabase.from("users").select("*").eq("id", payload.id).maybeSingle();

    if (error || !data || !data.id || !data.roles.includes("advisor")) {
      return null;
    }

    const { data: advisor, error: advisorError } = await supabase
      .from("advisor_profiles")
      .select("*")
      .eq("advisor_id", data.id)
      .maybeSingle();

    if (!advisor || advisorError) {
      return null;
    }

    await recordAdvisorLoginActivity(supabase, data);

    return data;
  } catch (error) {
    return null;
  }
}
