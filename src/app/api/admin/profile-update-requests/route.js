import { NextResponse } from "next/server";
import { getAuthenticatedAdmin } from "@/lib/auth/getAuthenticatedAdmin";
import { createAdminClient } from "@/lib/supabase/server";
import { mapProfileUpdateRequest } from "@/lib/admin/approvals/mapProfileUpdateRequest";

export async function POST(request) {
  const admin = await getAuthenticatedAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let payload;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { action, requestId, reason, note, verificationNotes } = payload;

  if (!requestId) {
    return NextResponse.json({ error: "requestId is required" }, { status: 400 });
  }

  if (!["approve", "reject"].includes(action)) {
    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  }

  try {
    const supabase = createAdminClient();
    const now = new Date().toISOString();

    const updates = {
      reviewed_by: admin.id,
      updated_at: now,
    };

    if (action === "approve") {
      updates.status = "approved";
      updates.approved_at = now;
      updates.rejection_reason = null;
      if (verificationNotes) updates.verification_notes = verificationNotes;
    } else {
      updates.status = "rejected";
      updates.rejected_at = now;
      updates.rejection_reason = reason || note || "Profile update requires changes";
    }

    const { data, error } = await supabase
      .from("profile_update_requests")
      .update(updates)
      .eq("id", requestId)
      .select(`*, user:users(id, name)`)
      .single();

    if (error) {
      console.error("profile-update-requests POST failed:", error.message);
      return NextResponse.json({ error: "Failed to update request" }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      request: mapProfileUpdateRequest({
        ...data,
        name: data.user?.name || "Advisor",
      }),
    });
  } catch (error) {
    console.error("profile-update-requests POST error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
