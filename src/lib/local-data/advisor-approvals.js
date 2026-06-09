import fs from "fs";
import {
  computeApprovalOverview,
  mapApprovalRow,
} from "@/lib/admin/approvals/mapApprovalRecord";
import {
  filterApprovalRows,
  paginateRows,
} from "@/lib/admin/approvals/filterApprovals";
import path from "path";
import {
  getDataDir,
  goldAppBaseUrl,
  readJsonFile,
  writeJsonFile,
} from "@/lib/local-data/paths";
import { listLocalProfileUpdateRequests } from "@/lib/local-data/profile-update-requests";

const PROFILES_FILE = "advisor-profiles.json";
const REGISTRATION_FILE = "registration.json";

const SEED_PENDING_USER_ID = "cd4a358b-78f7-458b-9264-45d61016d177";

const SEED_PENDING_PROFILE = {
  id: "seed-pending-profile-001",
  advisor_id: "seed-pending-profile-001",
  user_id: SEED_PENDING_USER_ID,
  account_status: "under_review",
  profile_status: false,
  request_type: "new_profile",
  profile_slug: null,
  subscription_plan: "free",
  iridai_certificate_url: "pending",
  advisor_role_id: "IRDAI-124589",
  designation: "Insurance Advisor",
  industry: "Insurance",
  category: "Life Insurance",
  bio: "Hyderabad-based insurance advisor offering life and health products. IRDAI licensed with 6+ years of client advisory experience.",
  submitted_information:
    "Completed profile setup with Life Insurance (TATA AIA) and Health Insurance (Star Health). Uploaded IRDAI certificate and insurer authorization letters — please verify documents match each listed service before publishing live.",
  document_urls: [
    "/api/advisor/verification-documents/cd4a358b-78f7-458b-9264-45d61016d177-irdai.pdf",
    "/api/advisor/verification-documents/cd4a358b-78f7-458b-9264-45d61016d177-star-auth.pdf",
  ],
  submitted_at: "2026-06-04T10:30:00.000Z",
};

const SEED_PENDING_SERVICES = [
  {
    id: "svc-hyd-life-01",
    category: "life",
    title: "Life Insurance",
    provider: "TATA AIA Life Insurance",
    experience: "6+ Years Experience",
    serviceStartDate: "2019-03-15",
    roleLabel: "Insurance Advisor",
    verified: false,
    verification: {
      status: "pending",
      documents: [
        {
          id: "setup-doc-irdai",
          url: "/api/advisor/verification-documents/cd4a358b-78f7-458b-9264-45d61016d177-irdai.pdf",
          filename: "irdai-certificate.pdf",
          label: "IRDAI license certificate",
        },
      ],
      submittedAt: "2026-06-04T10:28:30.000Z",
    },
  },
  {
    id: "svc-hyd-health-01",
    category: "health",
    title: "Health Insurance",
    provider: "Star Health",
    experience: "5+ Years Experience",
    serviceStartDate: "2020-08-01",
    roleLabel: "Health Advisor",
    verified: false,
    verification: {
      status: "pending",
      documents: [
        {
          id: "setup-doc-star",
          url: "/api/advisor/verification-documents/cd4a358b-78f7-458b-9264-45d61016d177-star-auth.pdf",
          filename: "star-health-authorization.pdf",
          label: "Star Health authorization letter",
        },
      ],
      submittedAt: "2026-06-04T10:29:15.000Z",
    },
  },
];

function loadUserServices(userId) {
  const perUserFile = `services-${userId}.json`;
  const perUserPath = path.join(getDataDir(), perUserFile);

  if (fs.existsSync(perUserPath)) {
    return readJsonFile(perUserFile, []);
  }

  if (userId === SEED_PENDING_USER_ID) {
    return SEED_PENDING_SERVICES;
  }

  return readJsonFile("services.json", []);
}

function loadProfilesDb() {
  return readJsonFile(PROFILES_FILE, { profiles: {} });
}

function saveProfilesDb(db) {
  writeJsonFile(PROFILES_FILE, db);
}

function loadRegistrationDb() {
  return readJsonFile(REGISTRATION_FILE, { users: [], selfieUrls: {} });
}

function findRegisteredUser(userId) {
  const db = loadRegistrationDb();
  return db.users.find((user) => user.id === userId) ?? null;
}

function findProfileById(profileId) {
  const db = loadProfilesDb();
  return (
    Object.values(db.profiles).find((item) => item.id === profileId) ??
    db.profiles[profileId] ??
    null
  );
}

function mapRow(profile) {
  const user = findRegisteredUser(profile.user_id);
  const services = loadUserServices(profile.user_id);
  return mapApprovalRow(
    {
      ...profile,
      document_urls: profile.document_urls ?? [],
      source: "local",
    },
    {
      ...user,
      fullName: user?.fullName,
      selfieUrl: user?.selfieUrl ?? user?.verification_selfie_url,
      phone: user?.phone,
    },
    services,
  );
}

export function localDataAvailable() {
  try {
    return fs.existsSync(getDataDir());
  } catch {
    return false;
  }
}

function listApprovalProfiles() {
  const db = loadProfilesDb();
  const profiles = Object.values(db.profiles).filter((item) =>
    ["under_review", "active", "action_required"].includes(item.account_status),
  );

  const hasPendingProfile = profiles.some((item) => item.account_status === "under_review");
  const seedAlreadyStored = profiles.some(
    (item) => item.id === SEED_PENDING_PROFILE.id || item.user_id === SEED_PENDING_USER_ID,
  );

  if (!hasPendingProfile && !seedAlreadyStored) {
    return [...profiles, SEED_PENDING_PROFILE];
  }

  return profiles;
}

export function listLocalApprovals(params = {}) {
  const profiles = listApprovalProfiles();

  const allRows = profiles
    .sort((a, b) => String(b.submitted_at ?? "").localeCompare(String(a.submitted_at ?? "")))
    .map((profile) => mapRow(profile));

  const profileUpdates = listLocalProfileUpdateRequests(params);
  const overview = computeApprovalOverview(allRows, profileUpdates);
  const filtered = filterApprovalRows(allRows, params);
  const { data, pagination } = paginateRows(
    filtered,
    params.page || 1,
    params.limit || 10,
  );

  const stats = {
    pending: overview.pendingApprovals,
    approvedToday: overview.approvedToday,
    rejectedToday: overview.rejectedToday,
    profileUpdates: overview.profileUpdateRequests,
  };

  return {
    success: true,
    data,
    profileUpdates,
    stats,
    overview,
    attention: overview.attention,
    pagination,
    meta: { source: "local", goldBaseUrl: goldAppBaseUrl() },
  };
}

export function approveLocalProfile(profileId) {
  if (profileId === SEED_PENDING_PROFILE.id) {
    const db = loadProfilesDb();
    const approved = {
      ...SEED_PENDING_PROFILE,
      account_status: "active",
      profile_status: true,
      approved_at: new Date().toISOString(),
      iridai_certificate_url: SEED_PENDING_PROFILE.document_urls[0],
      profile_slug: "krishna-mohan-noti-hyderabad",
    };
    db.profiles[SEED_PENDING_USER_ID] = approved;
    saveProfilesDb(db);
    return approved;
  }

  const db = loadProfilesDb();
  const record = findProfileById(profileId);
  if (!record) return null;

  record.account_status = "active";
  record.profile_status = true;
  record.approved_at = new Date().toISOString();
  if (!record.iridai_certificate_url || record.iridai_certificate_url === "pending") {
    record.iridai_certificate_url = record.document_urls?.[0] ?? "/profile";
  }

  db.profiles[record.user_id] = record;
  saveProfilesDb(db);
  return record;
}

export function rejectLocalProfile(profileId, reason) {
  if (profileId === SEED_PENDING_PROFILE.id) {
    const db = loadProfilesDb();
    const rejected = {
      ...SEED_PENDING_PROFILE,
      account_status: "action_required",
      profile_status: false,
      irdai_rejected_reason: reason?.trim() || "Profile requires changes",
    };
    db.profiles[SEED_PENDING_USER_ID] = rejected;
    saveProfilesDb(db);
    return rejected;
  }

  const db = loadProfilesDb();
  const record = findProfileById(profileId);
  if (!record) return null;

  record.account_status = "action_required";
  record.profile_status = false;
  record.irdai_rejected_reason = reason?.trim() || "Profile requires changes";

  db.profiles[record.user_id] = record;
  saveProfilesDb(db);
  return record;
}

export function useLocalApprovals() {
  if (process.env.YVITY_USE_LOCAL_APPROVALS === "false") return false;
  return localDataAvailable();
}
