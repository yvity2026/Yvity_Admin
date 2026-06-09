import fs from "fs";
import path from "path";
import { profileCompletionScore, mapIndustry, mapProfileStatus, mapVerificationStatus } from "@/lib/admin/profiles/mapProfileRecord";
import { computeApprovalOverview } from "@/lib/admin/approvals/mapApprovalRecord";
import { buildRewardEngineOverview } from "@/lib/local-data/reward-engine-store";
import { localDataAvailable } from "@/lib/local-data/advisor-approvals";
import { useSupabasePersistence } from "@/lib/supabase/persistence-mode";
import { listLocalAdvisorReviews } from "@/lib/local-data/advisor-reviews";
import { listLocalPlatformReviews } from "@/lib/local-data/platform-reviews";
import { listLocalApprovals } from "@/lib/local-data/advisor-approvals";
import { getDataDir, readJsonFile } from "@/lib/local-data/paths";
import {
  AGE_BUCKETS,
  SCORE_BUCKETS,
  ageFromDob,
  bucketAge,
  bucketScore,
  buildDailySeries,
  buildMonthlySeries,
  countBy,
  daysAgo,
  formatINR,
  formatINRCompact,
  growthRate,
  industryCategoryFromService,
  isWithinRange,
  normalizeIndustry,
  parseDate,
  serviceCategoryLabel,
  startOfDay,
  toIsoDate,
  topN,
} from "@/lib/admin/analytics/analyticsUtils";

const REGISTRATION_FILE = "registration.json";
const PROFILES_FILE = "advisor-profiles.json";
const PAYMENTS_FILE = "advisor-payments.json";

function loadUserServices(userId) {
  const perUserFile = path.join(getDataDir(), `services-${userId}.json`);
  if (fs.existsSync(perUserFile)) {
    return readJsonFile(`services-${userId}.json`, []);
  }
  return [];
}

function loadTestimonialCount(userId) {
  const file = path.join(getDataDir(), `testimonials-${userId}.json`);
  if (!fs.existsSync(file)) return 0;
  return readJsonFile(`testimonials-${userId}.json`, []).length;
}

function findProfile(profilesDb, userId) {
  return (
    profilesDb.profiles?.[userId] ||
    Object.values(profilesDb.profiles || {}).find((p) => p.user_id === userId) ||
    null
  );
}

function estimateYvityScore(profile, user, services, testimonialCount) {
  const base = profileCompletionScore(profile, user, services);
  const bonus = Math.min(20, testimonialCount * 4);
  const verifiedBonus = profile?.profile_status ? 8 : 0;
  return Math.min(100, base + bonus + verifiedBonus);
}

function filterByLocation(rows, { state, city }) {
  let result = rows;
  if (state && state !== "all") {
    result = result.filter((row) => String(row.state || "").toLowerCase() === state.toLowerCase());
  }
  if (city && city !== "all") {
    result = result.filter((row) => String(row.city || "").toLowerCase() === city.toLowerCase());
  }
  return result;
}

function filterByIndustryProfessionals(rows, industry) {
  if (!industry || industry === "all") return rows;
  return rows.filter((row) => row.industryGroup === industry || row.industry === industry);
}

function filterByDate(rows, dateKey, from, to) {
  if (!from && !to) return rows;
  return rows.filter((row) => isWithinRange(dateKey(row), from, to));
}

function paymentAmount(payment) {
  return Number(payment.amount_inr ?? payment.amount ?? 0) / (payment.amount_inr ? 1 : 100);
}

export function buildAnalyticsSnapshot(filters = {}) {
  if (!localDataAvailable() && !useSupabasePersistence()) {
    return {
      success: false,
      error:
        "Analytics storage unavailable. Configure Supabase or shared Yvity_Users/.data for local dev.",
      isLive: false,
    };
  }

  const dateFrom = filters.dateFrom ? parseDate(filters.dateFrom) : null;
  const dateTo = filters.dateTo ? parseDate(`${filters.dateTo}T23:59:59.999Z`) : null;

  const registration = readJsonFile(REGISTRATION_FILE, { users: [] });
  const profilesDb = readJsonFile(PROFILES_FILE, { profiles: {} });
  const payments = Object.values(readJsonFile(PAYMENTS_FILE, { payments: {} }).payments || {});
  const referrals = Object.values(readJsonFile("referrals.json", { referrals: {} }).referrals || {});
  const ambassadors = Object.values(readJsonFile("ambassadors.json", { ambassadors: {} }).ambassadors || {});

  const platformReviews = listLocalPlatformReviews({ limit: 500 }).data || [];
  const advisorReviews = listLocalAdvisorReviews({ limit: 500 }).data || [];
  const approvals = listLocalApprovals({ limit: 500 });

  const now = new Date();
  const todayStart = startOfDay();
  const weekStart = daysAgo(7);
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const yearStart = new Date(now.getFullYear(), 0, 1);
  const last30 = daysAgo(30);
  const prev30Start = daysAgo(60);
  const prev30End = daysAgo(30);

  let users = (registration.users || []).map((user) => {
    const profile = findProfile(profilesDb, user.id);
    const services = profile ? loadUserServices(user.id) : [];
    const isProfessional = Boolean(profile);
    const testimonialCount = isProfessional ? loadTestimonialCount(user.id) : 0;
    const completion = profile ? profileCompletionScore(profile, user, services) : 0;
    const yvityScore = profile ? estimateYvityScore(profile, user, services, testimonialCount) : null;
    const profileStatus = profile ? mapProfileStatus(profile) : null;
    const verification = profile ? mapVerificationStatus(profile) : null;
    const industry = profile ? mapIndustry(profile, user) : null;
    const industryGroup = normalizeIndustry(industry || user.profession);

    return {
      id: user.id,
      name: user.fullName || user.name || "User",
      gender: (user.gender || "other").toLowerCase(),
      dob: user.dob,
      age: ageFromDob(user.dob),
      city: user.city || "Unknown",
      state: user.state || "Unknown",
      profession: user.profession || profile?.designation || null,
      registeredAt: toIsoDate(user.createdAt || user.created_at),
      isProfessional,
      planKey: String(profile?.subscription_plan || "free").toLowerCase(),
      industry,
      industryGroup,
      designation: profile?.designation || services[0]?.roleLabel || "Advisor",
      companies: [...new Set(services.map((s) => s.provider).filter(Boolean))],
      services: services.map((s) => ({
        title: s.title || serviceCategoryLabel(s.category),
        category: industryCategoryFromService(s.category),
        serviceType: serviceCategoryLabel(s.category),
        company: s.provider || "Others",
        roleLabel: s.roleLabel || profile?.designation,
      })),
      profileStatus: profileStatus?.key || null,
      verificationStatus: verification?.key || null,
      completion,
      yvityScore,
      testimonialCount,
      isFeatured: Boolean(profile?.is_hero || profile?.is_landing),
      isHidden: profile?.ispublic_profile === false,
    };
  });

  users = filterByLocation(users, filters);
  users = filterByDate(users, (row) => row.registeredAt, dateFrom, dateTo);

  const professionals = users.filter((u) => u.isProfessional);
  const customers = users.filter((u) => !u.isProfessional);
  const filteredProfessionals = filterByIndustryProfessionals(professionals, filters.industry);

  const paidPayments = payments.filter((p) => p.status === "paid");
  const filteredPayments = filterByDate(
    paidPayments,
    (p) => p.paid_at || p.created_at,
    dateFrom,
    dateTo,
  );

  const revenueToday = filteredPayments
    .filter((p) => parseDate(p.paid_at) >= todayStart)
    .reduce((sum, p) => sum + paymentAmount(p), 0);
  const revenueMonth = filteredPayments
    .filter((p) => parseDate(p.paid_at) >= monthStart)
    .reduce((sum, p) => sum + paymentAmount(p), 0);
  const revenueYear = filteredPayments
    .filter((p) => parseDate(p.paid_at) >= yearStart)
    .reduce((sum, p) => sum + paymentAmount(p), 0);

  const planCounts = {
    free: professionals.filter((p) => p.planKey === "free").length,
    silver: professionals.filter((p) => p.planKey === "silver").length,
    gold: professionals.filter((p) => p.planKey === "gold").length,
  };

  const serviceRows = filteredProfessionals.flatMap((p) =>
    p.services.length
      ? p.services.map((s) => ({ ...s, state: p.state, city: p.city, userId: p.id, name: p.name }))
      : [{ title: "Unspecified", category: "Other", serviceType: "Other", company: "Others", state: p.state, city: p.city, userId: p.id, name: p.name }],
  );

  const ambassadorOverview = buildRewardEngineOverview(
    ambassadors.map((a) => ({ status: a.status })),
    referrals,
  );

  const approvalOverview = computeApprovalOverview(approvals.data || []);

  const registrationsInRange = (from, to = now) =>
    users.filter((u) => {
      const d = parseDate(u.registeredAt);
      return d && d >= from && d <= to;
    }).length;

  const scoreRows = filteredProfessionals.filter((p) => p.yvityScore != null);

  const filterOptions = {
    industries: [...new Set(professionals.map((p) => p.industryGroup))].sort(),
    states: [...new Set(users.map((u) => u.state).filter((s) => s !== "Unknown"))].sort(),
    cities: [...new Set(users.map((u) => u.city).filter((c) => c !== "Unknown"))].sort(),
  };

  const founder = {
    platformGrowthRate: growthRate(registrationsInRange(last30), registrationsInRange(prev30Start, prev30End)),
    professionalGrowthRate: growthRate(
      professionals.filter((p) => isWithinRange(p.registeredAt, last30, now)).length,
      professionals.filter((p) => isWithinRange(p.registeredAt, prev30Start, prev30End)).length,
    ),
    revenueGrowthRate: growthRate(
      filteredPayments.filter((p) => isWithinRange(p.paid_at, last30, now)).reduce((s, p) => s + paymentAmount(p), 0),
      filteredPayments.filter((p) => isWithinRange(p.paid_at, prev30Start, prev30End)).reduce((s, p) => s + paymentAmount(p), 0),
    ),
    profileCompletionRate: scoreRows.length
      ? Math.round(scoreRows.reduce((s, p) => s + p.completion, 0) / scoreRows.length)
      : 0,
    verificationApprovalRate: (() => {
      const rows = approvals.data || [];
      if (!rows.length) return 0;
      const approved = rows.filter((row) => row.status === "approved").length;
      return Math.round((approved / rows.length) * 100);
    })(),
    freeToSilverRate: planCounts.free
      ? Math.round((planCounts.silver / (planCounts.free + planCounts.silver + planCounts.gold)) * 100)
      : 0,
    silverToGoldRate: planCounts.silver
      ? Math.round((planCounts.gold / (planCounts.silver + planCounts.gold)) * 100)
      : 0,
    topIndustry: topN(countBy(filteredProfessionals, (p) => p.industryGroup), 1)[0]?.label || "—",
    topCategory: topN(countBy(serviceRows, (s) => s.category), 1)[0]?.label || "—",
    topService: topN(countBy(serviceRows, (s) => s.serviceType), 1)[0]?.label || "—",
    topCompany: topN(countBy(serviceRows, (s) => s.company), 1)[0]?.label || "—",
    topState: topN(countBy(users, (u) => u.state), 1)[0]?.label || "—",
    topCity: topN(countBy(users, (u) => u.city), 1)[0]?.label || "—",
  };

  return {
    success: true,
    isLive: true,
    meta: {
      updatedAt: new Date().toISOString(),
      filters,
      filterOptions,
    },
    founderInsights: founder,
    userAnalytics: {
      overview: {
        totalUsers: users.length,
        totalProfessionals: professionals.length,
        totalCustomers: customers.length,
      },
      gender: countBy(users, (u) => {
        const g = u.gender;
        if (g === "male") return "Male";
        if (g === "female") return "Female";
        return "Other";
      }),
      age: AGE_BUCKETS.map((bucket) => ({
        id: bucket.id,
        label: bucket.id,
        count: users.filter((u) => bucketAge(u.age) === bucket.id).length,
      })),
      location: {
        states: topN(countBy(users, (u) => u.state), 15),
        cities: topN(countBy(users, (u) => u.city), 15),
      },
      registration: {
        today: users.filter((u) => parseDate(u.registeredAt) >= todayStart).length,
        thisWeek: users.filter((u) => parseDate(u.registeredAt) >= weekStart).length,
        thisMonth: users.filter((u) => parseDate(u.registeredAt) >= monthStart).length,
        thisYear: users.filter((u) => parseDate(u.registeredAt) >= yearStart).length,
      },
      growth: {
        daily: buildDailySeries(users, (u) => u.registeredAt, 30),
        monthly: buildMonthlySeries(users, (u) => u.registeredAt, 12),
        yearly: buildMonthlySeries(users, (u) => u.registeredAt, 36),
      },
    },
    professionalAnalytics: {
      overview: { totalProfessionals: filteredProfessionals.length },
      industry: topN(countBy(filteredProfessionals, (p) => p.industryGroup), 12),
      category: topN(countBy(serviceRows, (s) => s.category), 12),
      service: topN(countBy(serviceRows, (s) => s.serviceType), 12),
      designation: topN(countBy(filteredProfessionals, (p) => p.designation), 12),
      company: topN(countBy(serviceRows, (s) => s.company), 15),
      location: {
        states: topN(countBy(filteredProfessionals, (p) => p.state), 15),
        cities: topN(countBy(filteredProfessionals, (p) => p.city), 15),
      },
    },
    subscriptionAnalytics: {
      plans: [
        { id: "free", label: "Free Members", count: planCounts.free },
        { id: "silver", label: "Silver Members", count: planCounts.silver },
        { id: "gold", label: "Gold Members", count: planCounts.gold },
      ],
      revenue: {
        today: revenueToday,
        todayLabel: formatINR(revenueToday),
        monthly: revenueMonth,
        monthlyLabel: formatINRCompact(revenueMonth),
        yearly: revenueYear,
        yearlyLabel: formatINRCompact(revenueYear),
        monthlyTrend: buildMonthlySeries(
          filteredPayments,
          (p) => p.paid_at,
          6,
        ).map((b, _, arr) => {
          const paymentMonth = filteredPayments.filter((p) => {
            const d = parseDate(p.paid_at);
            if (!d) return false;
            const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
            return key === b.key;
          });
          const amount = paymentMonth.reduce((s, p) => s + paymentAmount(p), 0);
          return { ...b, amount: Math.round(amount), label: formatINRCompact(amount) };
        }),
      },
      conversions: {
        freeToSilver: planCounts.silver,
        silverToGold: planCounts.gold,
        freeToSilverRate: founder.freeToSilverRate,
        silverToGoldRate: founder.silverToGoldRate,
      },
      renewals: {
        upcoming: professionals.filter((p) => ["silver", "gold"].includes(p.planKey)).length,
        expired: 0,
        renewed: filteredPayments.filter((p) => p.checkout_kind === "renewal").length,
      },
    },
    platformAnalytics: {
      profiles: {
        published: professionals.filter((p) => p.profileStatus === "published").length,
        pending: professionals.filter((p) => p.profileStatus === "pending").length,
        hidden: professionals.filter((p) => p.profileStatus === "hidden" || p.isHidden).length,
        featured: professionals.filter((p) => p.isFeatured).length,
      },
      completion: {
        average: founder.profileCompletionRate,
        fullyCompleted: scoreRows.filter((p) => p.completion >= 90).length,
        incomplete: scoreRows.filter((p) => p.completion < 70).length,
      },
      platformReviews: {
        text: platformReviews.filter((r) => r.testimonialType === "text").length,
        audio: platformReviews.filter((r) => r.testimonialType === "audio").length,
        video: platformReviews.filter((r) => r.testimonialType === "video").length,
      },
      advisorReviews: {
        total: advisorReviews.length,
        reported: advisorReviews.filter((r) => r.hasOpenReport).length,
        hidden: advisorReviews.filter((r) => r.status === "hidden").length,
      },
      testimonials: {
        text: advisorReviews.filter((r) => r.type === "text").length,
        audio: advisorReviews.filter((r) => r.type === "audio").length,
        video: advisorReviews.filter((r) => r.type === "video").length,
      },
      verification: {
        approved: professionals.filter((p) => p.verificationStatus === "verified").length,
        rejected: professionals.filter((p) => p.verificationStatus === "rejected").length,
        pending: professionals.filter((p) => p.verificationStatus === "pending").length,
      },
    },
    growthAnalytics: {
      overview: {
        newRegistrations: users.filter((u) => parseDate(u.registeredAt) >= last30).length,
        newProfiles: professionals.filter((p) => parseDate(p.registeredAt) >= last30).length,
        newSubscribers: filteredPayments.filter(
          (p) => parseDate(p.paid_at) >= last30 && ["silver", "gold"].includes(p.plan_id),
        ).length,
      },
      topLocations: {
        states: topN(countBy(users, (u) => u.state), 10),
        cities: topN(countBy(users, (u) => u.city), 10),
      },
      topIndustries: topN(countBy(filteredProfessionals, (p) => p.industryGroup), 10),
      topCategories: topN(countBy(serviceRows, (s) => s.category), 10),
      topServices: topN(countBy(serviceRows, (s) => s.serviceType), 10),
      ambassadors: ambassadorOverview,
    },
    yvityScoreAnalytics: {
      overview: {
        average: scoreRows.length
          ? Math.round(scoreRows.reduce((s, p) => s + p.yvityScore, 0) / scoreRows.length)
          : 0,
        highest: scoreRows.length ? Math.max(...scoreRows.map((p) => p.yvityScore)) : 0,
        lowest: scoreRows.length ? Math.min(...scoreRows.map((p) => p.yvityScore)) : 0,
      },
      topOverall: topN(
        [...scoreRows].sort((a, b) => b.yvityScore - a.yvityScore),
        10,
      ).map((p) => ({ name: p.name, score: p.yvityScore, city: p.city, industry: p.industryGroup })),
      topMale: topN(
        scoreRows.filter((p) => p.gender === "male").sort((a, b) => b.yvityScore - a.yvityScore),
        10,
      ).map((p) => ({ name: p.name, score: p.yvityScore, city: p.city })),
      topFemale: topN(
        scoreRows.filter((p) => p.gender === "female").sort((a, b) => b.yvityScore - a.yvityScore),
        10,
      ).map((p) => ({ name: p.name, score: p.yvityScore, city: p.city })),
      topByIndustry: topN(countBy(scoreRows, (p) => p.industryGroup), 8),
      topByLocation: {
        states: topN(
          countBy(
            scoreRows,
            (p) => p.state,
            (p) => p.state,
          ).map((row) => ({
            ...row,
            avgScore: Math.round(
              scoreRows
                .filter((p) => p.state === row.label)
                .reduce((s, p) => s + p.yvityScore, 0) / Math.max(row.count, 1),
            ),
          })),
          10,
        ),
        cities: topN(
          countBy(scoreRows, (p) => p.city).map((row) => ({
            ...row,
            avgScore: Math.round(
              scoreRows
                .filter((p) => p.city === row.label)
                .reduce((s, p) => s + p.yvityScore, 0) / Math.max(row.count, 1),
            ),
          })),
          10,
        ),
      },
      distribution: SCORE_BUCKETS.map((bucket) => ({
        id: bucket.id,
        label: bucket.id,
        count: scoreRows.filter((p) => bucketScore(p.yvityScore) === bucket.id).length,
      })),
      performance: {
        mostImproved: topN(scoreRows.sort((a, b) => b.completion - a.completion), 1)[0]
          ? {
              name: topN(scoreRows.sort((a, b) => b.completion - a.completion), 1)[0].name,
              metric: `${topN(scoreRows.sort((a, b) => b.completion - a.completion), 1)[0].completion}% completion`,
            }
          : null,
        highestRising: topN(scoreRows.sort((a, b) => b.yvityScore - a.yvityScore), 1)[0]
          ? {
              name: topN(scoreRows.sort((a, b) => b.yvityScore - a.yvityScore), 1)[0].name,
              metric: `Score ${topN(scoreRows.sort((a, b) => b.yvityScore - a.yvityScore), 1)[0].yvityScore}`,
            }
          : null,
        mostActive: topN(
          scoreRows.sort((a, b) => b.testimonialCount - a.testimonialCount),
          1,
        )[0]
          ? {
              name: topN(scoreRows.sort((a, b) => b.testimonialCount - a.testimonialCount), 1)[0].name,
              metric: `${topN(scoreRows.sort((a, b) => b.testimonialCount - a.testimonialCount), 1)[0].testimonialCount} testimonials`,
            }
          : null,
      },
      quality: {
        avgCompletion: founder.profileCompletionRate,
        avgTestimonialScore: advisorReviews.length
          ? (
              advisorReviews.reduce((s, r) => s + (Number(r.rating) || 0), 0) / advisorReviews.length
            ).toFixed(1)
          : "0",
        avgRecommendationScore: "—",
      },
    },
  };
}
