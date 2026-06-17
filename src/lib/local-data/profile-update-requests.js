import fs from "fs";
import path from "path";
import { mapProfileUpdateRequest } from "@/lib/admin/approvals/mapProfileUpdateRequest";
import { getDataDir, readJsonFile } from "@/lib/local-data/paths";
import { localDataAvailable } from "@/lib/local-data/advisor-approvals";

const REQUESTS_FILE = "profile-update-requests.json";

const DEFAULT_REQUESTS = [];

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
  const dataDir = getDataDir();
  const filePath = path.join(dataDir, REQUESTS_FILE);
  const db = loadRequestsDb();
  const index = (db.requests || []).findIndex((item) => item.id === id);
  if (index < 0) return null;

  db.requests[index] = {
    ...db.requests[index],
    ...updates,
    updated_at: new Date().toISOString(),
  };

  fs.mkdirSync(dataDir, { recursive: true });
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
