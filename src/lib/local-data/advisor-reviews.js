import fs from "fs";
import path from "path";
import { mapAdvisorReviewRow } from "@/lib/admin/advisor-reviews/mapAdvisorReviewRecord";
import { attachReportsToReviews } from "@/lib/admin/advisor-reviews/attachReportContext";
import { DATA_DIR, readJsonFile } from "@/lib/local-data/paths";
import { localDataAvailable } from "@/lib/local-data/advisor-approvals";

const REGISTRATION_FILE = "registration.json";
const PROFILES_FILE = "advisor-profiles.json";
const ADMIN_STATE_FILE = "advisor-review-admin-state.json";

function loadRegistration() {
  return readJsonFile(REGISTRATION_FILE, { users: [] });
}

function loadProfilesDb() {
  return readJsonFile(PROFILES_FILE, { profiles: {} });
}

function loadAdminState() {
  return readJsonFile(ADMIN_STATE_FILE, { reviews: {} });
}

function saveAdminState(state) {
  const filePath = path.join(DATA_DIR, ADMIN_STATE_FILE);
  fs.mkdirSync(DATA_DIR, { recursive: true });
  fs.writeFileSync(filePath, JSON.stringify(state, null, 2), "utf-8");
}

function findUser(registration, userId) {
  return (registration.users || []).find((user) => user.id === userId) || null;
}

function findProfile(profilesDb, userId) {
  return (
    profilesDb.profiles[userId] ||
    Object.values(profilesDb.profiles).find((profile) => profile.user_id === userId) ||
    null
  );
}

function loadAdvisorComplaints() {
  return readJsonFile("platform-complaints.json", { complaints: [] }).complaints || [];
}

function buildComplaintsByReviewId() {
  const byReview = new Map();

  for (const complaint of loadAdvisorComplaints()) {
    if (complaint.entity_type !== "advisor_testimonial" || !complaint.entity_id) continue;
    const list = byReview.get(complaint.entity_id) || [];
    list.push(complaint);
    byReview.set(complaint.entity_id, list);
  }

  return byReview;
}

function loadAdvisorReviewFiles() {
  const rows = [];

  try {
    const files = fs.readdirSync(DATA_DIR);
    for (const filename of files) {
      const match = filename.match(/^testimonials-(.+)\.json$/);
      if (!match) continue;

      const advisorId = match[1];
      const testimonials = readJsonFile(filename, []);
      for (const item of testimonials) {
        rows.push({
          ...item,
          advisor_id: advisorId,
          testimonial_type: item.type || item.testimonial_type || "text",
          content: item.quote || item.content || "",
          testimonial_rating: item.rating ?? item.testimonial_rating ?? 0,
          status: item.status || "published",
          reply_text: item.advisorReply?.text || item.reply_text || "",
          reply_created_at: item.advisorReply?.repliedOn || null,
          created_at: item.submittedAt || item.created_at || null,
          mobile_number: item.mobile || item.mobile_number || "0000000000",
          is_mobile_verified: item.verified !== false,
        });
      }
    }
  } catch {
    return rows;
  }

  return rows;
}

function buildLocalRows() {
  const registration = loadRegistration();
  const profilesDb = loadProfilesDb();
  const adminState = loadAdminState();
  const rawRows = loadAdvisorReviewFiles();

  return rawRows.map((row) => {
    const advisor = findUser(registration, row.advisor_id);
    const profile = findProfile(profilesDb, row.advisor_id);
    const overrides = adminState.reviews[row.id] || {};

    const merged = {
      ...row,
      risk_score: overrides.risk_score ?? row.risk_score ?? 0,
      risk_flags: overrides.risk_flags ?? row.risk_flags ?? [],
      reported_count: overrides.reported_count ?? row.reported_count ?? 0,
      admin_visibility: overrides.admin_visibility || row.admin_visibility || "public",
      admin_note: overrides.admin_note || row.admin_note || "",
      admin_reviewed_at: overrides.admin_reviewed_at || row.admin_reviewed_at || null,
    };

    return mapAdvisorReviewRow(merged, {
      advisor: advisor
        ? { id: advisor.id, name: advisor.fullName || advisor.name, city: advisor.city }
        : null,
      profile,
    });
  });
}

function computeOverview(rows) {
  const reported = rows.filter((row) => row.reportedCount > 0).length;
  const hidden = rows.filter((row) => row.visibility === "hidden").length;
  const pending = rows.filter((row) => row.needsAction).length;

  return {
    totalReviews: rows.length,
    reportedReviews: reported,
    hiddenReviews: hidden,
    pendingActionReviews: pending,
    attention: {
      reported,
      pending,
      hidden,
    },
  };
}

function filterRows(rows, params = {}) {
  let filtered = [...rows];
  const q = (params.q || "").trim().toLowerCase();

  if (q) {
    filtered = filtered.filter(
      (row) =>
        row.reviewerName.toLowerCase().includes(q) ||
        row.advisorName.toLowerCase().includes(q) ||
        row.preview?.toLowerCase().includes(q) ||
        row.advisorId?.toLowerCase().includes(q) ||
        row.advisorShortId?.toLowerCase().includes(q),
    );
  }

  const queue = params.queue || "reported";
  if (queue === "reported") {
    filtered = filtered.filter((row) => row.reportedCount > 0);
  } else if (queue === "hidden") {
    filtered = filtered.filter((row) => row.visibility === "hidden");
  } else if (queue === "pending") {
    filtered = filtered.filter((row) => row.needsAction);
  } else if (queue === "resolved") {
    filtered = filtered.filter((row) => row.moderationStatus === "resolved");
  }

  if (params.reason && params.reason !== "all") {
    filtered = filtered.filter((row) => row.reportReason === params.reason);
  }

  if (params.type && params.type !== "all") {
    filtered = filtered.filter((row) => row.type === params.type);
  }

  if (params.reply === "with_reply") {
    filtered = filtered.filter((row) => row.hasAdvisorReply);
  } else if (params.reply === "without_reply") {
    filtered = filtered.filter((row) => !row.hasAdvisorReply);
  }

  if (params.plan && params.plan !== "all") {
    filtered = filtered.filter((row) => row.advisorPlan === params.plan);
  }

  return filtered;
}

export function useLocalAdvisorReviews() {
  return localDataAvailable();
}

export function listLocalAdvisorReviews(params = {}) {
  const page = Math.max(parseInt(params.page || "1", 10), 1);
  const limit = Math.min(Math.max(parseInt(params.limit || "10", 10), 1), 50);
  const complaintsByReview = buildComplaintsByReviewId();
  const allRows = attachReportsToReviews(buildLocalRows(), complaintsByReview);
  const overview = computeOverview(allRows);
  const filtered = filterRows(allRows, params);
  const from = (page - 1) * limit;
  const data = filtered.slice(from, from + limit);

  return {
    success: true,
    overview,
    attention: overview.attention,
    data,
    pagination: {
      page,
      limit,
      total: filtered.length,
      totalPages: Math.ceil(filtered.length / limit) || 0,
    },
    meta: { source: "local" },
  };
}

export function updateLocalAdvisorReview(reviewId, updates = {}) {
  const state = loadAdminState();
  const current = state.reviews[reviewId] || {};

  state.reviews[reviewId] = {
    ...current,
    ...updates,
    admin_reviewed_at: new Date().toISOString(),
  };

  saveAdminState(state);
  return state.reviews[reviewId];
}
