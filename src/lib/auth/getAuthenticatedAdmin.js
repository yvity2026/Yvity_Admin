import { validateAdmin } from "@/lib/auth/validateAdmin";
import { createAdminClient } from "@/lib/supabase/server";

export async function getAuthenticatedAdmin() {
  const session = await validateAdmin();

  if (!session?.admin_id) {
    return null;
  }

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("admin_users")
    .select("*")
    .eq("id", session.admin_id)
    .eq("is_active", true)
    .maybeSingle();

  if (error) {
    console.error("Failed to load authenticated admin:", error);
    return null;
  }

  return data || null;
}
