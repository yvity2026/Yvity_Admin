import fs from "fs";
import path from "path";
import {
  computePlatformOverview,
  filterPlatformReviewRows,
  paginatePlatformRows,
} from "@/lib/admin/platform-reviews/filterPlatformReviews";
import { mapPlatformReviewRow } from "@/lib/admin/platform-reviews/mapPlatformReviewRecord";
import { DATA_DIR, readJsonFile, writeJsonFile } from "@/lib/local-data/paths";
import { localDataAvailable } from "@/lib/local-data/advisor-approvals";

const PLATFORM_FILE = "yvity-testimonials.json";

const DEFAULT_ROWS = [
  {
    id: "pt-001",
    name: "Priya Sharma",
    profession: "Software Engineer",
    city: "Hyderabad",
    respondent_type: "customer",
    mobile_number: "9876543210",
    testimonial_type: "text",
    testimonial_rating: 5,
    content:
      "YVITY made it easy to compare verified advisors and pick someone I could trust for my family's insurance needs.",
    status: "submitted",
    created_at: "2026-06-01T10:00:00.000Z",
    yvity_reply: "",
  },
  {
    id: "pt-002",
    name: "Krishna Mohan",
    profession: "LIC Advisor",
    city: "Nellore",
    respondent_type: "advisor",
    mobile_number: "9123456789",
    testimonial_type: "text",
    testimonial_rating: 5,
    content:
      "My verified YVITY profile brought me 3x more serious inquiries. The platform credibility really shows.",
    status: "approved",
    created_at: "2026-05-28T08:30:00.000Z",
    yvity_reply: "Thank you for sharing your growth story with YVITY!",
  },
  {
    id: "pt-003",
    name: "Anitha Reddy",
    profession: "Health Advisor",
    city: "Bengaluru",
    respondent_type: "advisor",
    mobile_number: "9988776655",
    testimonial_type: "audio",
    testimonial_rating: 4,
    media_url: "/uploads/sample-audio.mp3",
    status: "hidden",
    created_at: "2026-05-20T14:00:00.000Z",
    yvity_reply: "",
  },
];

function ensureStore() {
  const filePath = path.join(DATA_DIR, PLATFORM_FILE);
  if (!localDataAvailable()) return { testimonials: [] };

  if (!fs.existsSync(filePath)) {
    writeJsonFile(PLATFORM_FILE, { testimonials: DEFAULT_ROWS });
  }

  return readJsonFile(PLATFORM_FILE, { testimonials: DEFAULT_ROWS });
}

function saveStore(db) {
  writeJsonFile(PLATFORM_FILE, db);
}

function loadAllRows() {
  const db = ensureStore();
  return (db.testimonials || []).map((row) =>
    mapPlatformReviewRow({ ...row, source: "local" }),
  );
}

export function useLocalPlatformReviews() {
  if (process.env.YVITY_USE_LOCAL_PLATFORM_REVIEWS === "false") return false;
  return localDataAvailable();
}

export function listLocalPlatformReviews(params = {}) {
  const allRows = loadAllRows().sort((a, b) =>
    String(b.submittedAt || "").localeCompare(String(a.submittedAt || "")),
  );
  const overview = computePlatformOverview(allRows);
  const filtered = filterPlatformReviewRows(allRows, params);
  const { data, pagination } = paginatePlatformRows(
    filtered,
    params.page || 1,
    params.limit || 10,
  );

  return {
    success: true,
    overview,
    attention: overview.attention,
    data,
    pagination,
    meta: { source: "local" },
  };
}

export function listLocalPublishedPlatformReviews() {
  const db = ensureStore();
  return (db.testimonials || [])
    .filter((row) => row.status === "approved")
    .map((row) => mapPlatformReviewForLanding(row));
}

export function insertLocalPlatformReview(payload) {
  const db = ensureStore();
  const id = `pt-${Date.now()}`;
  const record = {
    id,
    name: payload.name,
    profession: payload.profession,
    city: payload.city,
    respondent_type: payload.respondent_type,
    mobile_number: payload.mobile_number,
    testimonial_type: payload.testimonial_type,
    testimonial_rating: payload.testimonial_rating,
    content: payload.content || null,
    media_url: payload.media_url || null,
    status: "submitted",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    yvity_reply: "",
  };

  db.testimonials = [record, ...(db.testimonials || [])];
  saveStore(db);
  return record;
}

function statusToDb(action) {
  if (action === "approve") return "approved";
  if (action === "hide") return "hidden";
  if (action === "restore") return "approved";
  return null;
}

export function updateLocalPlatformReview(reviewId, { action, reply }) {
  const db = ensureStore();
  const index = (db.testimonials || []).findIndex((row) => row.id === reviewId);
  if (index < 0) return null;

  const nextStatus = statusToDb(action);
  if (nextStatus) {
    db.testimonials[index].status = nextStatus;
  }

  if (reply && (action === "approve" || action === "send_reply")) {
    db.testimonials[index].yvity_reply = reply;
  }

  db.testimonials[index].updated_at = new Date().toISOString();
  saveStore(db);
  return db.testimonials[index];
}
