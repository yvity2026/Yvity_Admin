import { createAdminClient } from "@/lib/supabase/server";
import { getAuthenticatedAdmin } from "@/lib/auth/getAuthenticatedAdmin";
import { escapeIlike } from "@/lib/search/escapeIlike";
import { hasPermission } from "@/lib/admin/permissions";
import { mapComplaintRow } from "@/lib/admin/complaints/mapComplaintRecord";
import {
  getLocalComplaintById,
  getRawLocalComplaint,
  listLocalComplaints,
  updateLocalComplaint,
  useLocalComplaints,
} from "@/lib/local-data/complaints";
import {
  logComplaintPiiAccess,
  revealComplaintContact,
} from "@/lib/pii/complaintContact";
import { NextResponse } from "next/server";


async function fetchEvents(supabase, complaintIds = []) {
  if (!complaintIds.length) return new Map();

  const { data, error } = await supabase
    .from("platform_complaint_events")
    .select("id, complaint_id, event_type, message, metadata, created_at, admin_id")
    .in("complaint_id", complaintIds)
    .order("created_at", { ascending: false });

  if (error) {
    console.warn("platform_complaint_events unavailable:", error.message);
    return new Map();
  }

  const byComplaint = new Map();
  for (const event of data || []) {
    const list = byComplaint.get(event.complaint_id) || [];
    list.push(event);
    byComplaint.set(event.complaint_id, list);
  }
  return byComplaint;
}

const REPORT_ENTITY_TYPES = [
  "advisor_testimonial",
  "platform_testimonial",
  "advisor_profile",
  "user_account",
  "lead",
];

const COMPLAINT_ENTITY_TYPES = ["payment", "other"];

async function fetchOverview(supabase) {
  const [
    openReportsRes,
    openComplaintsRes,
    resolvedRes,
    closedRes,
    highPriorityRes,
  ] = await Promise.all([
    supabase
      .from("platform_complaints")
      .select("*", { count: "exact", head: true })
      .eq("status", "open")
      .in("entity_type", REPORT_ENTITY_TYPES),
    supabase
      .from("platform_complaints")
      .select("*", { count: "exact", head: true })
      .eq("status", "open")
      .in("entity_type", COMPLAINT_ENTITY_TYPES),
    supabase
      .from("platform_complaints")
      .select("*", { count: "exact", head: true })
      .eq("status", "resolved"),
    supabase
      .from("platform_complaints")
      .select("*", { count: "exact", head: true })
      .eq("status", "dismissed"),
    supabase
      .from("platform_complaints")
      .select("*", { count: "exact", head: true })
      .in("status", ["open", "in_review"])
      .in("priority", ["high", "urgent"]),
  ]);

  if (openReportsRes.error && openComplaintsRes.error) {
    return null;
  }

  const openReports = openReportsRes.error ? 0 : openReportsRes.count || 0;
  const openComplaints = openComplaintsRes.error ? 0 : openComplaintsRes.count || 0;

  return {
    openReports,
    openComplaints,
    resolvedCases: resolvedRes.error ? 0 : resolvedRes.count || 0,
    closedCases: closedRes.error ? 0 : closedRes.count || 0,
    highPriorityCases: highPriorityRes.error ? 0 : highPriorityRes.count || 0,
    attention: {
      activeQueue: openReports + openComplaints,
      highPriority: highPriorityRes.error ? 0 : highPriorityRes.count || 0,
      unassigned: 0,
    },
  };
}

function normalizeStatusFilter(status) {
  if (status === "in_progress") return "in_review";
  if (status === "closed") return "dismissed";
  return status;
}

function normalizePriorityFilter(priority) {
  if (priority === "critical") return "urgent";
  return priority;
}

function buildContext(admin) {
  return {
    canManage: hasPermission(admin, "manage_complaints"),
    canViewPii: hasPermission(admin, "view_complaint_pii"),
  };
}

async function appendComplaintEvent(supabase, complaintId, adminId, eventType, message, metadata = {}) {
  await supabase.from("platform_complaint_events").insert({
    complaint_id: complaintId,
    admin_id: adminId,
    event_type: eventType,
    message,
    metadata,
  });
}

export async function GET(req) {
  try {
    const admin = await getAuthenticatedAdmin();
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const page = Math.max(parseInt(searchParams.get("page") || "1", 10), 1);
    const limit = Math.min(Math.max(parseInt(searchParams.get("limit") || "10", 10), 1), 50);
    const q = (searchParams.get("q") || "").trim();
    const status = searchParams.get("status") || "all";
    const priority = searchParams.get("priority") || "all";
    const kind = searchParams.get("kind") || "all";
    const reportType = searchParams.get("reportType") || "all";
    const complaintCategory = searchParams.get("complaintCategory") || "all";
    const entityType = searchParams.get("entityType") || "all";
    const reason = searchParams.get("reason") || "all";
    const context = buildContext(admin);

    const listParams = {
      page,
      limit,
      q,
      status,
      priority,
      kind,
      reportType,
      complaintCategory,
      entityType,
      reason,
    };

    if (useLocalComplaints()) {
      return NextResponse.json(listLocalComplaints(listParams, context));
    }

    const supabase = createAdminClient();
    const overview = await fetchOverview(supabase);

    if (!overview) {
      return NextResponse.json(
        listLocalComplaints(listParams, context),
      );
    }

    const from = (page - 1) * limit;
    const to = from + limit - 1;

    let query = supabase
      .from("platform_complaints")
      .select("*", { count: "exact" })
      .order("created_at", { ascending: false });

    if (q) {
      const term = escapeIlike(q);
      const like = `%${term}%`;
      query = query.or(
        `case_number.ilike.${like},reporter_name.ilike.${like},description.ilike.${like}`,
      );
    }

    if (status === "active") {
      query = query.in("status", ["open", "in_review"]);
    } else if (status === "high_priority") {
      query = query.in("priority", ["high", "urgent"]).in("status", ["open", "in_review"]);
    } else if (status !== "all") {
      query = query.eq("status", normalizeStatusFilter(status));
    }

    if (kind === "report" || kind === "reports") {
      query = query.in("entity_type", REPORT_ENTITY_TYPES);
    } else if (kind === "complaint" || kind === "complaints") {
      query = query.in("entity_type", COMPLAINT_ENTITY_TYPES);
    }

    if (priority === "high_priority") {
      query = query.in("priority", ["high", "urgent"]);
    } else if (priority !== "all") {
      query = query.eq("priority", normalizePriorityFilter(priority));
    }

    if (entityType !== "all") {
      query = query.eq("entity_type", entityType);
    }

    if (reason !== "all") {
      query = query.eq("reason", reason);
    }

    const { data, error, count } = await query.range(from, to);

    if (error) {
      console.error("GET /api/admin/complaints failed:", error);
      return NextResponse.json(
        listLocalComplaints(listParams, context),
      );
    }

    const eventsByComplaint = await fetchEvents(
      supabase,
      (data || []).map((row) => row.id),
    );

    let mapped = (data || []).map((row) =>
      mapComplaintRow(row, {
        ...context,
        events: eventsByComplaint.get(row.id) || [],
      }),
    );

    if (reportType !== "all") {
      mapped = mapped.filter((row) => row.reportSubtype === reportType);
    }

    if (complaintCategory !== "all") {
      mapped = mapped.filter((row) => row.complaintCategory === complaintCategory);
    }

    const unassigned = mapped.filter((row) => row.isActive && !row.assignedAdminId).length;
    overview.attention.unassigned = unassigned;

    return NextResponse.json({
      success: true,
      overview,
      attention: overview.attention,
      data: mapped,
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit),
      },
      permissions: context,
    });
  } catch (error) {
    console.error("GET /api/admin/complaints failed:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500 },
    );
  }
}

export async function POST(req) {
  try {
    const admin = await getAuthenticatedAdmin();
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const complaintId = String(body?.complaintId || "").trim();
    const action = String(body?.action || "").trim().toLowerCase();
    const note = String(body?.note || body?.resolutionNote || "").trim();

    if (!complaintId) {
      return NextResponse.json({ error: "complaintId is required" }, { status: 400 });
    }

    if (action === "view_pii") {
      if (!hasPermission(admin, "view_complaint_pii")) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      }

      if (useLocalComplaints()) {
        const raw = getRawLocalComplaint(complaintId);
        if (!raw) {
          return NextResponse.json({ error: "Complaint not found" }, { status: 404 });
        }
        const contact = await revealComplaintContact(raw);
        await logComplaintPiiAccess({
          adminId: admin.id,
          complaintId,
          metadata: { source: contact.source },
          req,
        });
        updateLocalComplaint(complaintId, {}, {
          event_type: "pii_viewed",
          message: "Reporter contact viewed",
          admin_id: admin.id,
        });
        return NextResponse.json({ success: true, contact });
      }

      const supabase = createAdminClient();
      const { data: row, error } = await supabase
        .from("platform_complaints")
        .select("*")
        .eq("id", complaintId)
        .single();

      if (error || !row) {
        return NextResponse.json({ error: "Complaint not found" }, { status: 404 });
      }

      const contact = await revealComplaintContact(row);
      await logComplaintPiiAccess({
        adminId: admin.id,
        complaintId,
        metadata: { source: contact.source },
        req,
      });
      await appendComplaintEvent(
        supabase,
        complaintId,
        admin.id,
        "pii_viewed",
        "Reporter contact viewed",
      );

      return NextResponse.json({ success: true, contact });
    }

    if (!hasPermission(admin, "manage_complaints")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    if (!["take", "start_review", "resolve", "dismiss", "add_note"].includes(action)) {
      return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }

    if (useLocalComplaints()) {
      const existing = getLocalComplaintById(complaintId, buildContext(admin));
      if (!existing) {
        return NextResponse.json({ error: "Complaint not found" }, { status: 404 });
      }

      const updates = {};
      let event = null;

      if (action === "take") {
        updates.assigned_admin_id = admin.id;
        event = { event_type: "assigned", message: "Case taken by admin", admin_id: admin.id };
      } else if (action === "start_review") {
        updates.status = "in_review";
        updates.assigned_admin_id = existing.assignedAdminId || admin.id;
        event = { event_type: "status_change", message: "Moved to in review", admin_id: admin.id };
      } else if (action === "resolve") {
        updates.status = "resolved";
        updates.resolution_note = note;
        updates.resolved_at = new Date().toISOString();
        updates.resolved_by = admin.id;
        event = { event_type: "resolved", message: note || "Case resolved", admin_id: admin.id };
      } else if (action === "dismiss") {
        updates.status = "dismissed";
        updates.resolution_note = note;
        updates.resolved_at = new Date().toISOString();
        updates.resolved_by = admin.id;
        event = { event_type: "status_change", message: note || "Case dismissed", admin_id: admin.id };
      } else if (action === "add_note" && note) {
        event = { event_type: "note", message: note, admin_id: admin.id };
      }

      updateLocalComplaint(complaintId, updates, event);
      const refreshed = getLocalComplaintById(complaintId, buildContext(admin));
      return NextResponse.json({ success: true, data: refreshed });
    }

    const supabase = createAdminClient();
    const { data: existing, error: loadError } = await supabase
      .from("platform_complaints")
      .select("*")
      .eq("id", complaintId)
      .single();

    if (loadError || !existing) {
      return NextResponse.json({ error: "Complaint not found" }, { status: 404 });
    }

    const updates = { updated_at: new Date().toISOString() };

    if (action === "take") {
      updates.assigned_admin_id = admin.id;
      await appendComplaintEvent(supabase, complaintId, admin.id, "assigned", "Case taken by admin");
    } else if (action === "start_review") {
      updates.status = "in_review";
      updates.assigned_admin_id = existing.assigned_admin_id || admin.id;
      await appendComplaintEvent(
        supabase,
        complaintId,
        admin.id,
        "status_change",
        "Moved to in review",
      );
    } else if (action === "resolve") {
      updates.status = "resolved";
      updates.resolution_note = note;
      updates.resolved_at = new Date().toISOString();
      updates.resolved_by = admin.id;
      await appendComplaintEvent(
        supabase,
        complaintId,
        admin.id,
        "resolved",
        note || "Case resolved",
      );
    } else if (action === "dismiss") {
      updates.status = "dismissed";
      updates.resolution_note = note;
      updates.resolved_at = new Date().toISOString();
      updates.resolved_by = admin.id;
      await appendComplaintEvent(
        supabase,
        complaintId,
        admin.id,
        "status_change",
        note || "Case dismissed",
      );
    } else if (action === "add_note" && note) {
      await appendComplaintEvent(supabase, complaintId, admin.id, "note", note);
    }

    const { data, error } = await supabase
      .from("platform_complaints")
      .update(updates)
      .eq("id", complaintId)
      .select("*")
      .single();

    if (error) {
      console.error("Failed to update complaint", error);
      return NextResponse.json({ error: "Failed to update complaint" }, { status: 500 });
    }

    const events = await fetchEvents(supabase, [complaintId]);
    return NextResponse.json({
      success: true,
      data: mapComplaintRow(data, {
        ...buildContext(admin),
        events: events.get(complaintId) || [],
      }),
    });
  } catch (error) {
    console.error("POST /api/admin/complaints failed:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
