import fs from "fs";
import path from "path";
import { mapProfileRow } from "@/lib/admin/profiles/mapProfileRecord";
import { HERO_SLOT_LIMIT, LANDING_SLOT_LIMIT } from "@/lib/admin/visibility/limits";
import { localDataAvailable } from "@/lib/local-data/advisor-approvals";
import { DATA_DIR, readJsonFile, resolveGoldAssetUrl, writeJsonFile } from "@/lib/local-data/paths";

const PROFILES_FILE = "advisor-profiles.json";
const REGISTRATION_FILE = "registration.json";

function loadRegistration() {
  return readJsonFile(REGISTRATION_FILE, { users: [] });
}

function loadProfilesDb() {
  return readJsonFile(PROFILES_FILE, { profiles: {} });
}

function saveProfilesDb(db) {
  writeJsonFile(PROFILES_FILE, db);
}

function findUser(registration, userId) {
  return (registration.users || []).find((user) => user.id === userId) ?? null;
}

function loadUserServices(userId) {
  const perUserPath = path.join(DATA_DIR, `services-${userId}.json`);
  if (fs.existsSync(perUserPath)) {
    return readJsonFile(`services-${userId}.json`, []);
  }
  return [];
}

function isPublishedProfile(profile = {}) {
  return (
    profile.account_status === "active" &&
    Boolean(profile.profile_status) &&
    profile.ispublic_profile !== false &&
    Boolean(profile.profile_slug)
  );
}

function mapVisibilityRow(profile, user, services) {
  const row = mapProfileRow(
    {
      ...profile,
      advisor_id: profile.user_id || profile.advisor_id,
      user: user
        ? {
            id: user.id,
            name: user.fullName || user.name,
            fullName: user.fullName,
            city: user.city,
            profession: user.profession,
            selfieUrl: user.selfieUrl,
          }
        : null,
      ispublic_profile: profile.ispublic_profile !== false,
      short_bio: profile.bio || profile.short_bio,
      created_at: profile.submitted_at || profile.created_at,
      updated_at: profile.approved_at || profile.updated_at,
    },
    services,
  );

  return {
    id: row.id,
    profileId: row.profileId,
    userId: row.userId,
    profileName: row.profileName,
    userName: row.userName,
    city: row.city || user?.city || "—",
    industry: row.industry,
    plan: row.plan,
    publicUrl: row.publicUrl,
    profilePic: resolveGoldAssetUrl(user?.selfieUrl || user?.verification_selfie_url) || row.profilePic,
    isHero: Boolean(profile.is_hero),
    isLanding: Boolean(profile.is_landing),
    profileStatus: row.profileStatus,
  };
}

function listPublishedProfiles() {
  const registration = loadRegistration();
  const db = loadProfilesDb();

  return Object.values(db.profiles || {})
    .filter(isPublishedProfile)
    .map((profile) => {
      const userId = profile.user_id || profile.advisor_id;
      const user = findUser(registration, userId);
      const services = loadUserServices(userId);
      return mapVisibilityRow(profile, user, services);
    });
}

function findProfileRecord(profileId) {
  const db = loadProfilesDb();
  return (
    Object.values(db.profiles).find((item) => item.id === profileId) ??
    db.profiles[profileId] ??
    null
  );
}

function memberSummary(profile, user) {
  return {
    id: profile.id,
    name: profile.designation || user?.fullName || user?.name || "Advisor",
    city: user?.city || "—",
  };
}

function listFeaturedMembers(slot) {
  const registration = loadRegistration();
  const db = loadProfilesDb();
  const field = slot === "hero" ? "is_hero" : "is_landing";

  return Object.values(db.profiles || {})
    .filter((profile) => isPublishedProfile(profile) && Boolean(profile[field]))
    .map((profile) => {
      const user = findUser(registration, profile.user_id || profile.advisor_id);
      return memberSummary(profile, user);
    });
}

export function useLocalVisibilityControls() {
  return localDataAvailable();
}

export function listLocalVisibilityControls(params = {}) {
  const rows = listPublishedProfiles();
  const heroMembers = listFeaturedMembers("hero");
  const landingMembers = listFeaturedMembers("landing");

  let filtered = [...rows];
  const q = (params.q || "").trim().toLowerCase();

  if (q) {
    filtered = filtered.filter(
      (row) =>
        row.profileName.toLowerCase().includes(q) ||
        row.userName.toLowerCase().includes(q) ||
        row.city.toLowerCase().includes(q) ||
        row.industry.toLowerCase().includes(q),
    );
  }

  if (params.slot === "hero") {
    filtered = filtered.filter((row) => row.isHero);
  } else if (params.slot === "landing") {
    filtered = filtered.filter((row) => row.isLanding);
  }

  const page = Math.max(Number(params.page) || 1, 1);
  const limit = Math.min(Math.max(Number(params.limit) || 20, 1), 50);
  const from = (page - 1) * limit;

  return {
    success: true,
    overview: {
      publishedProfiles: rows.length,
      heroUsed: heroMembers.length,
      heroLimit: HERO_SLOT_LIMIT,
      landingUsed: landingMembers.length,
      landingLimit: LANDING_SLOT_LIMIT,
    },
    heroMembers,
    landingMembers,
    data: filtered.slice(from, from + limit),
    pagination: {
      page,
      limit,
      total: filtered.length,
      totalPages: Math.ceil(filtered.length / limit) || 0,
    },
  };
}

export function updateLocalVisibility(profileId, payload = {}) {
  const { isHero, isLanding, replaceProfileId, slotType } = payload;
  const db = loadProfilesDb();
  const registration = loadRegistration();
  const record = findProfileRecord(profileId);

  if (!record || !isPublishedProfile(record)) {
    return { error: "Published profile not found", status: 404 };
  }

  const userId = record.user_id || record.advisor_id;

  if (replaceProfileId && slotType) {
    const replaceRecord = findProfileRecord(replaceProfileId);
    if (!replaceRecord) {
      return { error: "Replace target not found", status: 404 };
    }
    const demotionField = slotType === "hero" ? "is_hero" : "is_landing";
    replaceRecord[demotionField] = false;
    db.profiles[replaceRecord.user_id] = replaceRecord;
  }

  if (isHero === true) {
    const heroMembers = listFeaturedMembers("hero").filter((member) => member.id !== profileId);
    if (heroMembers.length >= HERO_SLOT_LIMIT && !(replaceProfileId && slotType === "hero")) {
      return {
        error: "Hero limit reached",
        status: 409,
        members: heroMembers,
      };
    }
  }

  if (isLanding === true) {
    const landingMembers = listFeaturedMembers("landing").filter((member) => member.id !== profileId);
    if (landingMembers.length >= LANDING_SLOT_LIMIT && !(replaceProfileId && slotType === "landing")) {
      return {
        error: "Landing limit reached",
        status: 409,
        members: landingMembers,
      };
    }
  }

  if (isHero !== undefined) record.is_hero = isHero;
  if (isLanding !== undefined) record.is_landing = isLanding;
  record.updated_at = new Date().toISOString();

  db.profiles[userId] = record;
  saveProfilesDb(db);

  const user = findUser(registration, userId);
  const services = loadUserServices(userId);

  return {
    success: true,
    profile: mapVisibilityRow(record, user, services),
  };
}
