import { getUser } from "@/lib/auth/Getuser";
import { recordAdvisorLoginActivity } from "@/lib/advisor-score/recordAdvisorLoginActivity";
import { createAdminClient } from "@/lib/supabase/server";

export async function ValidateUser() {
  try {
    const payload = await getUser();

    if (!payload?.userId && !payload?.token) {
      return null;
    }

    const supabase = createAdminClient();
    let query = supabase.from("users").select("*");

    if (payload?.userId) {
      query = query.eq("id", payload.userId);
    } else {
      query = query.filter(
        "device_tokens",
        "cs",
        JSON.stringify([{ token: payload.token }])
      );
    }

    const { data, error } = await query.maybeSingle();

    if (error || !data) {
      return null;
    }

    await recordAdvisorLoginActivity(supabase, data);

    return data;
  } catch (error) {
    return null;
  }
}
