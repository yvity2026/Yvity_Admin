import fs from "fs";
import path from "path";
import { mapComplaintRow } from "@/lib/admin/complaints/mapComplaintRecord";
import { DATA_DIR, readJsonFile } from "@/lib/local-data/paths";
import { localDataAvailable } from "@/lib/local-data/advisor-approvals";

const COMPLAINTS_FILE = "platform-complaints.json";
const EVENTS_FILE = "platform-complaint-events.json";

const DEFAULT_COMPLAINTS = [
  {
    id: "cmp-local-001",
    case_number: "YV-CMP-202606-00001",
    entity_type: "advisor_testimonial",
    entity_id: "tst-r05rf7w",
    reason: "fake_review",
    description:
      "This review does not sound like a real client. Same wording appeared on another advisor profile last week.",
    status: "open",
    priority: "high",
    reporter_name: "Priya Sharma",
    reporter_phone_plain: "9876543210",
    reporter_email_plain: "priya.sharma@example.com",
    reporter_phone_last4: "3210",
    reporter_email_domain: "example.com",
    target_advisor_id: "167ec15f-6db6-4e57-8222-b437aa804b3b",
    created_at: "2026-06-05T10:15:00.000Z",
    updated_at: "2026-06-05T10:15:00.000Z",
  },
  {
    id: "cmp-local-002",
    case_number: "YV-CMP-202606-00002",
    entity_type: "platform_testimonial",
    entity_id: null,
    reason: "spam",
    description: "Repeated submissions with promotional links in the review body.",
    status: "in_review",
    priority: "high",
    reporter_name: "Anonymous",
    reporter_phone_last4: "1098",
    target_user_id: null,
    assigned_admin_id: "local-dev-admin",
    created_at: "2026-06-04T14:22:00.000Z",
    updated_at: "2026-06-04T16:00:00.000Z",
  },
  {
    id: "cmp-local-003",
    case_number: "YV-CMP-202606-00003",
    entity_type: "advisor_profile",
    entity_id: "167ec15f-6db6-4e57-8222-b437aa804b3b",
    reason: "privacy",
    description: "Advisor profile is showing a client phone number in the public bio.",
    status: "resolved",
    priority: "urgent",
    reporter_name: "Ravi Kumar",
    reporter_phone_plain: "9014143132",
    reporter_phone_last4: "3132",
    target_advisor_id: "167ec15f-6db6-4e57-8222-b437aa804b3b",
    resolution_note: "Profile bio edited and republished without client PII.",
    resolved_at: "2026-06-03T11:40:00.000Z",
    created_at: "2026-06-02T09:05:00.000Z",
    updated_at: "2026-06-03T11:40:00.000Z",
  },
  {
    id: "cmp-local-004",
    case_number: "YV-CMP-202606-00004",
    entity_type: "payment",
    entity_id: null,
    reason: "fraud",
    support_category: "payment",
    description: "Payment deducted twice for the same Gold subscription renewal.",
    status: "open",
    priority: "urgent",
    reporter_name: "Amit Verma",
    reporter_phone_last4: "5544",
    target_user_id: "167ec15f-6db6-4e57-8222-b437aa804b3b",
    created_at: "2026-06-06T08:10:00.000Z",
    updated_at: "2026-06-06T08:10:00.000Z",
  },
  {
    id: "cmp-local-005",
    case_number: "YV-CMP-202606-00005",
    entity_type: "other",
    support_category: "subscription",
    reason: "other",
    description: "Subscription shows Silver but advisor dashboard still displays Free plan limits.",
    status: "open",
    priority: "high",
    reporter_name: "Neha Gupta",
    reporter_phone_last4: "7788",
    target_advisor_id: "167ec15f-6db6-4e57-8222-b437aa804b3b",
    created_at: "2026-06-06T09:30:00.000Z",
    updated_at: "2026-06-06T09:30:00.000Z",
  },
  {
    id: "cmp-local-006",
    case_number: "YV-CMP-202606-00006",
    entity_type: "other",
    support_category: "technical",
    reason: "other",
    description: "Unable to upload verification selfie — app crashes after camera permission.",
    status: "in_review",
    priority: "medium",
    reporter_name: "Rohit Singh",
    reporter_phone_last4: "9901",
    assigned_admin_id: "local-dev-admin",
    created_at: "2026-06-05T16:45:00.000Z",
    updated_at: "2026-06-05T18:00:00.000Z",
  },
];

const DEFAULT_EVENTS = {
  "cmp-local-002": [
    {
      id: "evt-001",
      complaint_id: "cmp-local-002",
      event_type: "created",
      message: "Complaint filed",
      created_at: "2026-06-04T14:22:00.000Z",
    },
    {
      id: "evt-002",
      complaint_id: "cmp-local-002",
      event_type: "assigned",
      message: "Case assigned to admin",
      created_at: "2026-06-04T16:00:00.000Z",
    },
  ],
  "cmp-local-003": [
    {
      id: "evt-003",
      complaint_id: "cmp-local-003",
      event_type: "resolved",
      message: "Profile bio edited and republished without client PII.",
      created_at: "2026-06-03T11:40:00.000Z",
    },
  ],
};

function loadComplaintsDb() {
  return readJsonFile(COMPLAINTS_FILE, { complaints: DEFAULT_COMPLAINTS });
}

function loadEventsDb() {
  return readJsonFile(EVENTS_FILE, { events: DEFAULT_EVENTS });
}

function saveComplaintsDb(db) {
  const filePath = path.join(DATA_DIR, COMPLAINTS_FILE);
  fs.mkdirSync(DATA_DIR, { recursive: true });
  fs.writeFileSync(filePath, JSON.stringify(db, null, 2), "utf-8");
}

function saveEventsDb(db) {
  const filePath = path.join(DATA_DIR, EVENTS_FILE);
  fs.mkdirSync(DATA_DIR, { recursive: true });
  fs.writeFileSync(filePath, JSON.stringify(db, null, 2), "utf-8");
}

function getEventsForComplaint(complaintId, eventsDb) {
  const map = eventsDb.events || {};
  return (map[complaintId] || []).slice().sort((a, b) => {
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });
}

function computeOverview(rows) {
  const openReports = rows.filter((row) => row.caseKind === "report" && row.status === "open").length;
  const openComplaints = rows.filter(
    (row) => row.caseKind === "complaint" && row.status === "open",
  ).length;

  return {
    openReports,
    openComplaints,
    resolvedCases: rows.filter((row) => row.status === "resolved").length,
    closedCases: rows.filter((row) => row.status === "dismissed").length,
    highPriorityCases: rows.filter(
      (row) => row.isActive && (row.priority === "high" || row.priority === "urgent"),
    ).length,
    attention: {
      activeQueue: rows.filter((row) => row.isActive).length,
      highPriority: rows.filter(
        (row) => row.isActive && (row.priority === "high" || row.priority === "urgent"),
      ).length,
      unassigned: rows.filter((row) => row.isActive && !row.assignedAdminId).length,
    },
  };
}

function filterComplaints(rows, params = {}) {
  let filtered = [...rows];
  const q = (params.q || "").trim().toLowerCase();

  if (q) {
    filtered = filtered.filter(
      (row) =>
        row.caseNumber.toLowerCase().includes(q) ||
        row.reporterName.toLowerCase().includes(q) ||
        row.description.toLowerCase().includes(q) ||
        row.reasonLabel.toLowerCase().includes(q),
    );
  }

  const status = params.status || "all";
  if (status === "active") {
    filtered = filtered.filter((row) => row.isActive);
  } else if (status === "in_progress") {
    filtered = filtered.filter((row) => row.status === "in_review");
  } else if (status === "closed") {
    filtered = filtered.filter((row) => row.status === "dismissed");
  } else if (status !== "all") {
    filtered = filtered.filter((row) => row.status === status);
  }

  if (params.kind && params.kind !== "all") {
    filtered = filtered.filter((row) => row.caseKind === params.kind);
  }

  if (params.reportType && params.reportType !== "all") {
    filtered = filtered.filter((row) => row.reportSubtype === params.reportType);
  }

  if (params.complaintCategory && params.complaintCategory !== "all") {
    filtered = filtered.filter((row) => row.complaintCategory === params.complaintCategory);
  }

  if (params.priority === "high_priority") {
    filtered = filtered.filter((row) => row.priority === "high" || row.priority === "urgent");
  } else if (params.priority && params.priority !== "all") {
    const priority = params.priority === "critical" ? "urgent" : params.priority;
    filtered = filtered.filter((row) => row.priority === priority);
  }

  if (params.entityType && params.entityType !== "all") {
    filtered = filtered.filter((row) => row.entityType === params.entityType);
  }

  if (params.reason && params.reason !== "all") {
    filtered = filtered.filter((row) => row.reason === params.reason);
  }

  return filtered;
}

export function useLocalComplaints() {
  return localDataAvailable();
}

export function listLocalComplaints(params = {}, context = {}) {
  const page = Math.max(parseInt(params.page || "1", 10), 1);
  const limit = Math.min(Math.max(parseInt(params.limit || "10", 10), 1), 50);
  const complaintsDb = loadComplaintsDb();
  const eventsDb = loadEventsDb();

  const allRows = (complaintsDb.complaints || []).map((row) =>
    mapComplaintRow(row, {
      ...context,
      events: getEventsForComplaint(row.id, eventsDb),
    }),
  );

  const overview = computeOverview(allRows);
  const filtered = filterComplaints(allRows, params);
  const from = (page - 1) * limit;

  return {
    success: true,
    overview,
    attention: overview.attention,
    data: filtered.slice(from, from + limit),
    pagination: {
      page,
      limit,
      total: filtered.length,
      totalPages: Math.ceil(filtered.length / limit) || 0,
    },
    meta: { source: "local" },
    permissions: {
      canManage: context.canManage !== false,
      canViewPii: context.canViewPii === true,
    },
  };
}

export function getRawLocalComplaint(id) {
  const complaintsDb = loadComplaintsDb();
  return (complaintsDb.complaints || []).find((item) => item.id === id) || null;
}

export function getLocalComplaintById(id, context = {}) {
  const row = getRawLocalComplaint(id);
  if (!row) return null;
  const eventsDb = loadEventsDb();

  return mapComplaintRow(row, {
    ...context,
    events: getEventsForComplaint(row.id, eventsDb),
  });
}

export function updateLocalComplaint(id, updates = {}, event = null) {
  const complaintsDb = loadComplaintsDb();
  const eventsDb = loadEventsDb();
  const index = (complaintsDb.complaints || []).findIndex((item) => item.id === id);
  if (index < 0) return null;

  complaintsDb.complaints[index] = {
    ...complaintsDb.complaints[index],
    ...updates,
    updated_at: new Date().toISOString(),
  };

  if (event) {
    const map = eventsDb.events || {};
    const list = map[id] || [];
    list.unshift({
      id: `evt-${Date.now()}`,
      complaint_id: id,
      ...event,
      created_at: new Date().toISOString(),
    });
    map[id] = list;
    eventsDb.events = map;
    saveEventsDb(eventsDb);
  }

  saveComplaintsDb(complaintsDb);
  return complaintsDb.complaints[index];
}
