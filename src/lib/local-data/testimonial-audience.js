import fs from "fs";
import path from "path";
import { shortUserId } from "@/lib/admin/users/mapUserRecord";
import {
  parseAudienceParams,
  toPreviewRecipient,
} from "@/lib/admin/platform-reviews/resolveTestimonialAudience";
import { DATA_DIR, readJsonFile } from "@/lib/local-data/paths";
import { localDataAvailable } from "@/lib/local-data/advisor-approvals";
const REGISTRATION_FILE = "registration.json";
const PROFILES_FILE = "advisor-profiles.json";
const PLATFORM_FILE = "yvity-testimonials.json";

function loadRegistration() {
  return readJsonFile(REGISTRATION_FILE, { users: [] });
}

function loadProfiles() {
  return readJsonFile(PROFILES_FILE, { profiles: {} });
}

function loadUserServices(userId) {
  const perUserFile = `services-${userId}.json`;
  if (fs.existsSync(path.join(DATA_DIR, perUserFile))) {
    return readJsonFile(perUserFile, []);
  }
  return readJsonFile("services.json", []);
}

function maskPhone(phone) {
  const digits = String(phone || "").replace(/\D/g, "");
  return digits.length >= 4 ? `••••${digits.slice(-4)}` : "—";
}

function submittedMobiles() {
  const db = readJsonFile(PLATFORM_FILE, { testimonials: [] });
  return new Set(
    (db.testimonials || [])
      .map((row) => String(row.mobile_number || "").replace(/\D/g, "").slice(-10))
      .filter(Boolean),
  );
}

function registrationCutoff(params) {
  if (params.registeredFrom) {
    return {
      from: new Date(params.registeredFrom).getTime(),
      to: params.registeredTo
        ? new Date(`${params.registeredTo}T23:59:59.999Z`).getTime()
        : null,
    };
  }

  const map = { "7d": 7, "30d": 30, "90d": 90 };
  const days = map[params.registeredWithin];
  if (!days) return { from: null, to: null };

  const from = Date.now() - days * 86400000;
  return { from, to: null };
}

function matchesServiceFilter(services, service, company) {
  if (service === "all" && company === "all") return true;
  return services.some((item) => {
    const serviceType = String(item.title || item.category || "").toLowerCase();
    const companyName = String(item.provider || "").toLowerCase();
    return (
      (service === "all" || serviceType.includes(String(service).toLowerCase())) &&
      (company === "all" || companyName.includes(String(company).toLowerCase()))
    );
  });
}

function buildLocalAudienceRows() {
  const registration = loadRegistration();
  const profilesDb = loadProfiles();

  return (registration.users || []).map((user) => {
    const profile =
      profilesDb.profiles[user.id] ||
      Object.values(profilesDb.profiles).find((item) => item.user_id === user.id) ||
      null;
    const services = profile ? loadUserServices(user.id) : [];
    const isProfessional = Boolean(profile);

    return {
      id: user.id,
      name: user.fullName || user.name || "User",
      mobile: String(user.phone || "").replace(/\D/g, "").slice(-10),
      city: user.city || null,
      profession: user.profession || profile?.designation || null,
      created_at: user.createdAt || user.created_at || null,
      registeredAt: user.createdAt || user.created_at || null,
      userType: isProfessional ? "professional" : "customer",
      userTypeLabel: isProfessional ? "Professional" : "Customer",
      planKey: profile?.subscription_plan || null,
      plan: profile?.subscription_plan
        ? String(profile.subscription_plan).charAt(0).toUpperCase() +
          String(profile.subscription_plan).slice(1)
        : "—",
      services,
      phoneMasked: maskPhone(user.phone),
      shortId: shortUserId(user.id),
    };
  });
}

export function useLocalTestimonialAudience() {
  return localDataAvailable();
}

export function listLocalAudienceOptions() {
  const rows = buildLocalAudienceRows();

  return {
    cities: [...new Set(rows.map((row) => row.city).filter(Boolean))].sort(),
    services: [
      ...new Set(
        rows.flatMap((row) =>
          (row.services || []).map((item) => item.title || item.category).filter(Boolean),
        ),
      ),
    ].sort(),
    companies: [
      ...new Set(
        rows.flatMap((row) =>
          (row.services || []).map((item) => item.provider).filter(Boolean),
        ),
      ),
    ].sort(),
  };
}

export function resolveLocalTestimonialAudience(rawParams = {}) {
  const params = parseAudienceParams(rawParams);
  const { from, to } = registrationCutoff(params);
  const excluded = params.excludeWithPlatformTestimonial ? submittedMobiles() : new Set();

  let rows = buildLocalAudienceRows().filter((row) => {
    const mobile = row.mobile;
    if (!/^[6-9]\d{9}$/.test(mobile)) return false;
    if (excluded.has(mobile)) return false;

    if (params.userType === "professional" && row.userType !== "professional") return false;
    if (params.userType === "customer" && row.userType !== "customer") return false;

    if (params.city && params.city !== "all") {
      if (!String(row.city || "").toLowerCase().includes(String(params.city).toLowerCase())) {
        return false;
      }
    }

    if (params.plan && params.plan !== "all") {
      if (row.planKey !== params.plan) return false;
    }

    if (!matchesServiceFilter(row.services || [], params.service, params.company)) {
      return false;
    }

    const registeredAt = row.registeredAt ? new Date(row.registeredAt).getTime() : null;
    if (from && registeredAt && registeredAt < from) return false;
    if (to && registeredAt && registeredAt > to) return false;

    return true;
  });

  rows.sort((a, b) => {
    const aTime = new Date(a.registeredAt || 0).getTime();
    const bTime = new Date(b.registeredAt || 0).getTime();
    return params.sort === "oldest" ? aTime - bTime : bTime - aTime;
  });

  const recipients = rows.slice(0, params.limit).map((row) => ({
    id: row.id,
    name: row.name,
    mobile: row.mobile,
    city: row.city,
    userType: row.userType,
    userTypeLabel: row.userTypeLabel,
    plan: row.plan,
    phoneMasked: row.phoneMasked,
    registeredAt: row.registeredAt,
  }));

  return {
    recipients,
    params,
    options: listLocalAudienceOptions(),
  };
}

export function previewLocalTestimonialAudience(rawParams = {}) {
  const { recipients, params, options } = resolveLocalTestimonialAudience(rawParams);

  return {
    count: recipients.length,
    sample: recipients.slice(0, 8).map(toPreviewRecipient),
    params,
    options,
    meta: { source: "local" },
  };
}
