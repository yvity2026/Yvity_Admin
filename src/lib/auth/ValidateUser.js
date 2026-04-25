import { getUser } from "@/lib/auth/Getuser";
import { recordAdvisorLoginActivity } from "@/lib/advisor-score/recordAdvisorLoginActivity";
import { createAdminClient } from "@/lib/supabase/server";

export async function ValidateUser() {
  try {
    const payload = await getUser();
    console.log(payload?.token);

    if (!payload?.token) {
      return null;
    }
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .filter("device_tokens", "cs", JSON.stringify([{ token: payload.token }]))
      .maybeSingle();
    console.log("errorrrrr", error);
    console.log("lklkjlkjlkjkll", data);

    if (error || !data) {
      return null;
    }

    await recordAdvisorLoginActivity(supabase, data);

    return data;
  } catch (error) {
    return null;
  }
}
