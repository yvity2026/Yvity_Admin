import fs from "fs";
import path from "path";
import { shortUserId } from "@/lib/admin/users/mapUserRecord";
import { DATA_DIR, readJsonFile, resolveGoldAssetUrl } from "@/lib/local-data/paths";
import { localDataAvailable } from "@/lib/local-data/advisor-approvals";

const REGISTRATION_FILE = "registration.json";
const PROFILES_FILE = "advisor-profiles.json";
const ADMIN_STATE_FILE = "user-admin-state.json";

function loadRegistration() {
  return readJsonFile(REGISTRATION_FILE, { users: [] });
}

function loadProfiles() {
  return readJsonFile(PROFILES_FILE, { profiles: {} });
}

function loadAdminState() {
  return readJsonFile(ADMIN_STATE_FILE, { users: {} });
}

function saveAdminState(state) {
  const filePath = path.join(DATA_DIR, ADMIN_STATE_FILE);
  fs.mkdirSync(DATA_DIR, { recursive: true });
  fs.writeFileSync(filePath, JSON.stringify(state, null, 2), "utf-8");
}

function loadUserServices(userId) {
  const perUserFile = `services-${userId}.json`;
  const perUserPath = path.join(DATA_DIR, perUserFile);

  if (fs.existsSync(perUserPath)) {
    return readJsonFile(perUserFile, []);
  }

  return readJsonFile("services.json", []);
}

function toIsoDate(value) {
  if (!value) return null;
  if (typeof value === "number") return new Date(value).toISOString();
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed.toISOString();
}

function maskPhone(phone) {
  const digits = String(phone || "").replace(/\D/g, "");
  return digits.length >= 4 ? `••••${digits.slice(-4)}` : "—";
}

function maskEmail(email) {
  if (!email || !String(email).includes("@")) return "—";
  const domain = String(email).split("@")[1];
  return domain ? `***@${domain}` : "—";
}

function mapAccountStatus(status) {
  if (status === "deactivated") {
    return { key: "suspended", label: "Suspended", tone: "warning" };
  }
  if (status === "deleted") {
    return { key: "deleted", label: "Deleted", tone: "danger" };
  }
  return { key: "active", label: "Active", tone: "success" };
}

function findProfileForUser(profilesDb, userId) {
  return (
    profilesDb.profiles[userId] ||
    Object.values(profilesDb.profiles).find((profile) => profile.user_id === userId) ||
    null
  );
}

function buildLocalUserRow(user, profilesDb, adminState) {
  const profile = findProfileForUser(profilesDb, user.id);
  const services = profile ? loadUserServices(user.id) : [];
  const overrides = adminState.users[user.id] || {};
  const accountStatus = overrides.account_status || user.account_status || "active";
  const status = mapAccountStatus(accountStatus);
  const isProfessional = Boolean(profile);
  const planRaw = profile?.subscription_plan || (isProfessional ? "free" : null);
  const planLabel = planRaw
    ? String(planRaw).charAt(0).toUpperCase() + String(planRaw).slice(1)
    : "—";

  const serviceNames = [
    ...new Set(services.map((item) => item.title || item.category).filter(Boolean)),
  ];
  const companyNames = [
    ...new Set(services.map((item) => item.provider).filter(Boolean)),
  ];

  return {
    id: user.id,
    shortId: shortUserId(user.id),
    name: user.fullName || user.name || "Unnamed user",
    city: user.city || null,
    profession: user.profession || profile?.designation || null,
    userType: isProfessional ? "professional" : "customer",
    userTypeLabel: isProfessional ? "Professional" : "Customer",
    plan: isProfessional ? planLabel : "—",
    planKey: planRaw,
    status: status.key,
    statusLabel: status.label,
    statusTone: status.tone,
    registeredAt: toIsoDate(user.createdAt || user.created_at),
    lastLogin: toIsoDate(user.last_login_at || overrides.last_login_at),
    profilePic: resolveGoldAssetUrl(user.selfieUrl || user.verification_selfie_url),
    phoneMasked: maskPhone(user.phone),
    emailMasked: maskEmail(user.email),
    services: serviceNames,
    companies: companyNames,
    advisorProfileId: profile?.id || null,
    advisorAccountStatus: profile?.account_status || null,
    _searchText: [
      user.fullName,
      user.name,
      user.city,
      user.profession,
      user.id,
      ...serviceNames,
      ...companyNames,
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase(),
  };
}

function filterLocalUsers(rows, params) {
  let filtered = [...rows];

  if (params.q) {
    const term = params.q.trim().toLowerCase();
    filtered = filtered.filter((row) => row._searchText.includes(term) || row.id.toLowerCase().includes(term));
  }

  if (params.userType === "professional") {
    filtered = filtered.filter((row) => row.userType === "professional");
  } else if (params.userType === "customer") {
    filtered = filtered.filter((row) => row.userType === "customer");
  }

  if (params.status === "active") {
    filtered = filtered.filter((row) => row.status === "active");
  } else if (params.status === "suspended") {
    filtered = filtered.filter((row) => row.status === "suspended");
  }

  if (params.plan && params.plan !== "all") {
    filtered = filtered.filter(
      (row) => row.userType === "professional" && row.planKey === params.plan,
    );
  }

  if (params.registeredFrom) {
    const from = new Date(params.registeredFrom).getTime();
    filtered = filtered.filter((row) => new Date(row.registeredAt).getTime() >= from);
  }

  if (params.registeredTo) {
    const to = new Date(`${params.registeredTo}T23:59:59.999Z`).getTime();
    filtered = filtered.filter((row) => new Date(row.registeredAt).getTime() <= to);
  }

  return filtered.map(({ _searchText, ...row }) => row);
}

export function useLocalUsers() {
  if (process.env.YVITY_USE_LOCAL_USERS === "false") return false;
  return localDataAvailable();
}

export function listLocalUsers(params = {}) {
  const registration = loadRegistration();
  const profilesDb = loadProfiles();
  const adminState = loadAdminState();

  const rows = (registration.users || []).map((user) =>
    buildLocalUserRow(user, profilesDb, adminState),
  );

  const filtered = filterLocalUsers(rows, params);
  const page = Math.max(Number(params.page) || 1, 1);
  const limit = Math.min(Math.max(Number(params.limit) || 10, 1), 50);
  const from = (page - 1) * limit;
  const slice = filtered.slice(from, from + limit);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const overview = {
    totalUsers: rows.length,
    totalProfessionals: rows.filter((row) => row.userType === "professional").length,
    totalCustomers: rows.filter((row) => row.userType === "customer").length,
    activeUsers: rows.filter((row) => row.status === "active").length,
    suspendedUsers: rows.filter((row) => row.status === "suspended").length,
    registrationsToday: rows.filter((row) => {
      if (!row.registeredAt) return false;
      return new Date(row.registeredAt) >= today;
    }).length,
  };

  return {
    success: true,
    overview,
    data: slice,
    pagination: {
      page,
      limit,
      total: filtered.length,
      totalPages: Math.ceil(filtered.length / limit),
    },
  };
}

export function getLocalUser(userId) {
  const registration = loadRegistration();
  const profilesDb = loadProfiles();
  const adminState = loadAdminState();
  const user = (registration.users || []).find((item) => item.id === userId);

  if (!user) return null;

  const row = buildLocalUserRow(user, profilesDb, adminState);
  const profile = findProfileForUser(profilesDb, user.id);
  const services = profile ? loadUserServices(user.id) : [];

  return {
    ...row,
    profileSlug: profile?.profile_slug || null,
    subscription: row.userType === "professional"
      ? {
          currentPlan: row.plan,
          planKey: row.planKey || "free",
          startDate: toIsoDate(profile?.approved_at || profile?.submitted_at),
          expiryDate: null,
          upgradeHistory: [],
        }
      : null,
    activitySummary: {
      savedProfiles: readJsonFile("saved-profiles.json", { entries: [] }).entries?.filter(
        (item) => item.userId === userId,
      ).length || 0,
      recommendationsGiven: 0,
      reviewsSubmitted: readJsonFile(`testimonials-${userId}.json`, []).length || 0,
      profileViews: row.userType === "professional" ? 0 : null,
    },
    activity: [
      row.registeredAt && {
        id: "registered",
        title: "User registered",
        detail: row.city ? `Joined from ${row.city}` : "Account created",
        at: row.registeredAt,
        tone: "success",
      },
      profile?.approved_at && {
        id: "published",
        title: "Professional profile published",
        detail: row.name,
        at: profile.approved_at,
        tone: "success",
      },
      row.lastLogin && {
        id: "login",
        title: "Last login",
        detail: row.lastLogin,
        at: row.lastLogin,
        tone: "info",
      },
    ]
      .filter(Boolean)
      .map((item) => ({
        ...item,
        time: item.at,
      })),
    servicesDetail: services,
  };
}

export function updateLocalUser(userId, action) {
  const registration = loadRegistration();
  const user = (registration.users || []).find((item) => item.id === userId);
  if (!user) return null;

  const state = loadAdminState();
  const current = state.users[userId] || {};

  if (action === "suspend") {
    state.users[userId] = { ...current, account_status: "deactivated" };
  } else if (action === "activate") {
    state.users[userId] = { ...current, account_status: "active" };
  } else if (action === "delete") {
    state.users[userId] = { ...current, account_status: "deleted" };
  } else {
    return null;
  }

  saveAdminState(state);
  return state.users[userId];
}
