import { createAdminClient } from "@/lib/supabase/server";
import { mapProfileUpdateRequest } from "@/lib/admin/approvals/mapProfileUpdateRequest";

export async function fetchProfileUpdateRequests(params = {}) {
  try {
    const supabase = createAdminClient();

    let query = supabase
      .from("profile_update_requests")
      .select(`
        *,
        user:users(id, name)
      `)
      .order("submitted_at", { ascending: false });

    if (params.status && params.status !== "all") {
      query = query.eq("status", params.status);
    }

    if (params.changeType && params.changeType !== "all") {
      query = query.eq("change_type", params.changeType);
    }

    const { data, error } = await query;

    if (error) {
      console.error("fetchProfileUpdateRequests failed:", error.message);
      return [];
    }

    const rows = (data || []).map((row) =>
      mapProfileUpdateRequest({
        ...row,
        name: row.user?.name || row.name || "Advisor",
      }),
    );

    const q = (params.q || "").trim().toLowerCase();
    if (q) {
      return rows.filter(
        (row) =>
          row.name.toLowerCase().includes(q) ||
          row.summary.toLowerCase().includes(q) ||
          row.changeTypeLabel.toLowerCase().includes(q),
      );
    }

    return rows;
  } catch (err) {
    console.error("fetchProfileUpdateRequests error:", err);
    return [];
  }
}
