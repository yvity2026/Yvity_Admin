import { createAdminClient } from "@/lib/supabase/server";
import { readJsonFile } from "@/lib/local-data/paths";
import { useLocalUsers } from "@/lib/local-data/users";

function normalizeIndianMobile(value) {
  const mobile = String(value || "").replace(/\D/g, "").slice(-10);
  return /^[6-9]\d{9}$/.test(mobile) ? mobile : null;
}

function resolveLocalRecipient(userId) {
  const registration = readJsonFile("registration.json", { users: [] });
  const user = (registration.users || []).find((item) => item.id === userId);

  if (!user) return null;

  const accountStatus = user.account_status || "active";
  if (accountStatus === "deleted" || accountStatus === "deactivated") {
    return null;
  }

  const mobile = normalizeIndianMobile(user.phone || user.mobile);
  if (!mobile) return null;

  return {
    id: user.id,
    name: user.fullName || user.name || "User",
    mobile,
  };
}

async function resolveSupabaseRecipient(userId) {
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from("users")
    .select("id, name, mobile, account_status")
    .eq("id", userId)
    .maybeSingle();

  if (error || !data) return null;

  if (data.account_status === "deleted" || data.account_status === "deactivated") {
    return null;
  }

  const mobile = normalizeIndianMobile(data.mobile);
  if (!mobile) return null;

  return {
    id: data.id,
    name: data.name || "User",
    mobile,
  };
}

export async function resolveTestimonialRecipientById(userId) {
  if (!userId) return null;

  if (useLocalUsers()) {
    return resolveLocalRecipient(userId);
  }

  return resolveSupabaseRecipient(userId);
}
