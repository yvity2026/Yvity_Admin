import fs from "fs";
import {
  DATA_DIR,
  goldAppBaseUrl,
  readJsonFile,
  resolveGoldAssetUrl,
  writeJsonFile,
} from "@/lib/local-data/paths";

const PROFILES_FILE = "advisor-profiles.json";
const REGISTRATION_FILE = "registration.json";

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

function mapStatus(accountStatus) {
  if (accountStatus === "active") return "approved";
  if (accountStatus === "action_required") return "rejected";
  return "pending";
}

function mapRow(profile) {
  const user = findRegisteredUser(profile.user_id);
  const status = mapStatus(profile.account_status);
  const selfie = user?.selfieUrl ?? user?.verification_selfie_url ?? null;

  return {
    id: profile.id,
    user_id: profile.user_id,
    name: user?.fullName || "Advisor",
    email: user?.email || null,
    phone: user?.phone || null,
    profile_pic: resolveGoldAssetUrl(selfie),
    location: user?.city ? `${user.city}, IN` : "Unknown, IN",
    licenseUrl: resolveGoldAssetUrl(
      profile.iridai_certificate_url && profile.iridai_certificate_url !== "pending"
        ? profile.iridai_certificate_url
        : profile.document_urls?.[0] ?? null,
    ),
    isVerified: profile.profile_status,
    status,
    type: profile.designation || "Insurance Advisor",
    submittedAt: profile.submitted_at,
    updatedAt: profile.approved_at ?? profile.submitted_at,
    licenseNo: profile.advisor_role_id || "—",
    plan: profile.subscription_plan || "Free",
    is_hero: false,
    is_landing: false,
    document_urls: (profile.document_urls ?? []).map((url) => resolveGoldAssetUrl(url)),
    rejectionReason: profile.irdai_rejected_reason ?? null,
    source: "local",
    goldBaseUrl: goldAppBaseUrl(),
  };
}

export function localDataAvailable() {
  try {
    return fs.existsSync(DATA_DIR);
  } catch {
    return false;
  }
}

export function listLocalApprovals() {
  const db = loadProfilesDb();
  const profiles = Object.values(db.profiles).filter((item) =>
    ["under_review", "active", "action_required"].includes(item.account_status),
  );

  const stats = {
    pending: 0,
    approved: 0,
    rejected: 0,
    heroCount: 0,
    lanCount: 0,
  };

  const output = profiles
    .sort((a, b) => String(b.submitted_at ?? "").localeCompare(String(a.submitted_at ?? "")))
    .map((profile) => {
      const row = mapRow(profile);
      stats[row.status] += 1;
      return row;
    });

  return { data: output, stats };
}

export function approveLocalProfile(profileId) {
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
