import fs from "fs";
import path from "path";
import { mapProfileUpdateRequest } from "@/lib/admin/approvals/mapProfileUpdateRequest";
import { DATA_DIR, readJsonFile } from "@/lib/local-data/paths";
import { localDataAvailable } from "@/lib/local-data/advisor-approvals";

const REQUESTS_FILE = "profile-update-requests.json";

const DEFAULT_REQUESTS = [
  {
    id: "upd-local-001",
    profile_id: null,
    user_id: "167ec15f-6db6-4e57-8222-b437aa804b3b",
    name: "Ravi Kumar",
    change_type: "service_changes",
    industry: "Insurance",
    category: "Life Insurance",
    service: "Term Life Plans",
    summary: "Added two new term plans and updated commission disclosure on existing ULIP service.",
    document_urls: ["/profile"],
    verification_notes: "IRDAI license covers life products; service list diff reviewed.",
    status: "pending",
    submitted_at: "2026-06-06T11:20:00.000Z",
  },
  {
    id: "upd-local-002",
    profile_id: null,
    user_id: "167ec15f-6db6-4e57-8222-b437aa804b3b",
    name: "Ravi Kumar",
    change_type: "profile_changes",
    industry: "Insurance",
    category: "Advisor profile",
    service: "—",
    summary: "Updated professional bio, city, and profile headline for Gold plan landing visibility.",
    document_urls: [],
    verification_notes: "",
    status: "pending",
    submitted_at: "2026-06-05T15:40:00.000Z",
  },
  {
    id: "upd-local-003",
    profile_id: null,
    user_id: "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    name: "Priya Sharma",
    change_type: "verification_updates",
    industry: "Insurance",
    category: "Health Insurance",
    service: "Family Health Cover",
    summary: "Re-submitted IRDAI certificate after renewal; selfie verification refreshed.",
    document_urls: ["/profile"],
    verification_notes: "Certificate expiry extended to Dec 2027.",
    status: "approved",
    submitted_at: "2026-06-04T09:10:00.000Z",
  },
];

function loadRequestsDb() {
  return readJsonFile(REQUESTS_FILE, { requests: DEFAULT_REQUESTS });
}

export function useLocalProfileUpdateRequests() {
  return localDataAvailable();
}

export function listLocalProfileUpdateRequests(params = {}) {
  const db = loadRequestsDb();
  let rows = (db.requests || []).map(mapProfileUpdateRequest);

  if (params.status && params.status !== "all") {
    rows = rows.filter((row) => row.status === params.status);
  }

  if (params.changeType && params.changeType !== "all") {
    rows = rows.filter((row) => row.changeType === params.changeType);
  }

  const q = (params.q || "").trim().toLowerCase();
  if (q) {
    rows = rows.filter(
      (row) =>
        row.name.toLowerCase().includes(q) ||
        row.summary.toLowerCase().includes(q) ||
        row.changeTypeLabel.toLowerCase().includes(q),
    );
  }

  return rows.sort(
    (a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime(),
  );
}

export function updateLocalProfileUpdateRequest(id, updates = {}) {
  const filePath = path.join(DATA_DIR, REQUESTS_FILE);
  const db = loadRequestsDb();
  const index = (db.requests || []).findIndex((item) => item.id === id);
  if (index < 0) return null;

  db.requests[index] = {
    ...db.requests[index],
    ...updates,
    updated_at: new Date().toISOString(),
  };

  fs.mkdirSync(DATA_DIR, { recursive: true });
  fs.writeFileSync(filePath, JSON.stringify(db, null, 2), "utf-8");
  return mapProfileUpdateRequest(db.requests[index]);
}

export function approveLocalProfileUpdateRequest(id, verificationNotes = "") {
  return updateLocalProfileUpdateRequest(id, {
    status: "approved",
    approved_at: new Date().toISOString(),
    rejection_reason: "",
    ...(verificationNotes ? { verification_notes: verificationNotes } : {}),
  });
}

export function rejectLocalProfileUpdateRequest(id, reason = "") {
  return updateLocalProfileUpdateRequest(id, {
    status: "rejected",
    rejected_at: new Date().toISOString(),
    rejection_reason: reason || "Profile update requires changes",
  });
}
