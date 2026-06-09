import { mapProfileRow } from "@/lib/admin/profiles/mapProfileRecord";
import { DATA_DIR, readJsonFile, resolveGoldAssetUrl } from "@/lib/local-data/paths";
import { localDataAvailable } from "@/lib/local-data/advisor-approvals";
import fs from "fs";
import path from "path";

const REGISTRATION_FILE = "registration.json";
const PROFILES_FILE = "advisor-profiles.json";

function loadRegistration() {
  return readJsonFile(REGISTRATION_FILE, { users: [] });
}

function loadProfilesDb() {
  return readJsonFile(PROFILES_FILE, { profiles: {} });
}

function loadUserServices(userId) {
  const perUserFile = path.join(DATA_DIR, `services-${userId}.json`);
  if (fs.existsSync(perUserFile)) {
    return readJsonFile(`services-${userId}.json`, []);
  }
  return [];
}

function findUser(registration, userId) {
  return (registration.users || []).find((user) => user.id === userId) || null;
}

function buildSearchText(row) {
  return [
    row.profileName,
    row.userName,
    row.userId,
    row.profileSlug,
    row.industry,
    row.city,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
}

function mapLocalProfile(profile, user, services) {
  const item = {
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
  };

  const row = mapProfileRow(item, services);
  return {
    ...row,
    profilePic: resolveGoldAssetUrl(user?.selfieUrl || user?.verification_selfie_url) || row.profilePic,
    _searchText: buildSearchText(row),
  };
}

function computeOverview(rows) {
  return {
    totalProfiles: rows.length,
    publishedProfiles: rows.filter((row) => row.profileStatus === "published").length,
    pendingProfiles: rows.filter((row) => row.profileStatus === "pending").length,
    rejectedProfiles: rows.filter((row) => row.profileStatus === "rejected").length,
    hiddenProfiles: rows.filter((row) => row.profileStatus === "hidden" || row.isHidden).length,
    featuredHero: rows.filter((row) => row.isHero).length,
    featuredLanding: rows.filter((row) => row.isLanding).length,
  };
}

function filterProfiles(rows, params = {}) {
  let filtered = [...rows];

  if (params.q) {
    const term = params.q.trim().toLowerCase();
    filtered = filtered.filter(
      (row) =>
        row._searchText.includes(term) ||
        row.userId?.toLowerCase().includes(term) ||
        row.profileId?.toLowerCase().includes(term),
    );
  }

  if (params.status === "published") {
    filtered = filtered.filter((row) => row.profileStatus === "published");
  } else if (params.status === "pending") {
    filtered = filtered.filter((row) => row.profileStatus === "pending");
  } else if (params.status === "rejected") {
    filtered = filtered.filter((row) => row.profileStatus === "rejected");
  } else if (params.status === "hidden") {
    filtered = filtered.filter((row) => row.isHidden || row.profileStatus === "hidden");
  }

  if (params.featured === "hero") {
    filtered = filtered.filter((row) => row.isHero);
  } else if (params.featured === "landing") {
    filtered = filtered.filter((row) => row.isLanding);
  }

  if (params.plan && params.plan !== "all") {
    filtered = filtered.filter((row) => row.planKey === params.plan);
  }

  if (params.industry && params.industry !== "all") {
    filtered = filtered.filter((row) =>
      row.industry.toLowerCase().includes(params.industry.toLowerCase()),
    );
  }

  return filtered.map(({ _searchText, ...row }) => row);
}

export function useLocalProfiles() {
  if (process.env.YVITY_USE_LOCAL_PROFILES === "false") return false;
  return localDataAvailable();
}

export function listLocalProfiles(params = {}) {
  const registration = loadRegistration();
  const profilesDb = loadProfilesDb();
  const profileList = Object.values(profilesDb.profiles || {});

  const rows = profileList.map((profile) => {
    const userId = profile.user_id || profile.advisor_id;
    const user = findUser(registration, userId);
    const services = loadUserServices(userId);
    return mapLocalProfile(profile, user, services);
  });

  const overview = computeOverview(rows);
  const filtered = filterProfiles(rows, params);
  const page = Math.max(Number(params.page) || 1, 1);
  const limit = Math.min(Math.max(Number(params.limit) || 10, 1), 50);
  const from = (page - 1) * limit;

  return {
    success: true,
    overview,
    attention: {
      pendingReview: overview.pendingProfiles,
      verificationPending: rows.filter((row) => row.verificationStatus === "pending").length,
      updateRequests: 0,
    },
    data: filtered.slice(from, from + limit),
    pagination: {
      page,
      limit,
      total: filtered.length,
      totalPages: Math.ceil(filtered.length / limit),
    },
  };
}
