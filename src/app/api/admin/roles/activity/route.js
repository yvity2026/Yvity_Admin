import { NextResponse } from "next/server";
import { canAccessRolesSection } from "@/lib/admin/permissions";
import { getAuthenticatedAdmin } from "@/lib/auth/getAuthenticatedAdmin";
import { createAdminClient } from "@/lib/supabase/server";

const ACTION_LABELS = {
  complaint_pii_view: "Viewed complaint contact (PII)",
  complaint_export: "Exported complaint data",
  campaign_preview: "Previewed campaign audience",
  campaign_send: "Sent marketing campaign",
};

const EVENT_LABELS = {
  created: "Complaint created",
  assigned: "Assigned complaint",
  status_change: "Updated complaint status",
  note: "Added complaint note",
  pii_viewed: "Viewed complaint PII",
  resolved: "Resolved complaint",
};

function formatActivityRow({ id, adminName, action, module, createdAt }) {
  return {
    id,
    adminName: adminName || "System",
    action,
    module,
    createdAt,
  };
}

export async function GET(request) {
  try {
    const currentAdmin = await getAuthenticatedAdmin();
    if (!currentAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (!canAccessRolesSection(currentAdmin)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const limit = Math.min(Number(searchParams.get("limit") || 50), 100);

    const supabase = createAdminClient();

    const [{ data: admins }, { data: auditRows }, { data: complaintEvents }] = await Promise.all([
      supabase.from("admin_users").select("id, name"),
      supabase
        .from("pii_access_audit_log")
        .select("id, admin_id, action, entity_type, created_at")
        .order("created_at", { ascending: false })
        .limit(limit),
      supabase
        .from("platform_complaint_events")
        .select("id, admin_id, event_type, message, created_at")
        .order("created_at", { ascending: false })
        .limit(limit),
    ]);

    const adminNameById = (admins || []).reduce((acc, row) => {
      acc[row.id] = row.name;
      return acc;
    }, {});

    const auditActivity = (auditRows || []).map((row) =>
      formatActivityRow({
        id: `audit-${row.id}`,
        adminName: adminNameById[row.admin_id],
        action: ACTION_LABELS[row.action] || `PII action: ${row.action}`,
        module: row.entity_type || "Audit",
        createdAt: row.created_at,
      }),
    );

    const complaintActivity = (complaintEvents || []).map((row) =>
      formatActivityRow({
        id: `complaint-${row.id}`,
        adminName: adminNameById[row.admin_id],
        action: row.message || EVENT_LABELS[row.event_type] || row.event_type,
        module: "Reports & Complaints",
        createdAt: row.created_at,
      }),
    );

    const activity = [...auditActivity, ...complaintActivity]
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, limit);

    return NextResponse.json({ success: true, data: activity });
  } catch (error) {
    console.error("GET /api/admin/roles/activity failed:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
