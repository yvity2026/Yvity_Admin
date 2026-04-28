import { getUser } from "@/lib/auth/Getuser";
import { recordAdvisorLoginActivity } from "@/lib/advisor-score/recordAdvisorLoginActivity";
import { createAdminClient } from "@/lib/supabase/server";

export async function ValidateUser() {
  try {
    const payload = await getUser();
    console.log("payyyyyyyyyyyyyyyyyyy",payload);
    if (!payload?.id ||  !payload) {
      return null;
    }
    const userId = await payload.id
    console.log("dsfghjkhjgfds",payload.id)
    const supabase = createAdminClient();
    const { data, error} = await supabase.from("users").select("*").eq("id", userId).maybeSingle();
    // console.log(error, data)
    if (error || !data || !data.id || !data.roles.includes("customer")) {
      return null;
    }
    await recordAdvisorLoginActivity(supabase, data);
    console.log(data)
    return data;
  } catch (error) {
    return null;
  }
}
