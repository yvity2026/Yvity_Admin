import { createAdminClient } from "@/lib/supabase/server";
import { getAuthenticatedAdmin } from "@/lib/auth/getAuthenticatedAdmin";
import { NextResponse } from "next/server";

function normalizeProfession(profession) {
  if (typeof profession !== "string") {
    return "Unspecified";
  }

  const cleaned = profession.trim().replace(/\s+/g, " ");

  return cleaned || "Unspecified";
}

function sumRevenue(rows = []) {
  return rows.reduce((acc, item) => acc + (Number(item.amount) || 0), 0) / 100;
}

function startOfTodayIso() {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d.toISOString();
}

function daysAgoIso(days) {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d.toISOString();
}

function monthsAgoIso(months) {
  const d = new Date();
  d.setMonth(d.getMonth() - months);
  return d.toISOString();
}

function formatINR(amount) {
  const value = Math.round(Number(amount) || 0);
  return `₹${value.toLocaleString("en-IN")}`;
}

function profileCompletionScore(profile) {
  const checks = [
    Boolean(profile.short_bio?.trim()),
    Boolean(profile.iridai_certificate_url),
    Boolean(profile.intro_url?.trim()),
    Array.isArray(profile.services)
      ? profile.services.length > 0
      : Boolean(profile.services),
    Boolean(profile.profile_status),
    profile.account_status === "active",
  ];
  const filled = checks.filter(Boolean).length;
  return Math.round((filled / checks.length) * 100);
}

function averageProfileCompletion(profiles = []) {
  if (!profiles.length) return 0;
  const total = profiles.reduce((sum, profile) => sum + profileCompletionScore(profile), 0);
  return Math.round(total / profiles.length);
}

function buildActivityFeed({
  recentUsers = [],
  recentActiveProfiles = [],
  recentPayments = [],
  recentTestimonials = [],
  recentComplaints = [],
}) {
  const items = [];

  for (const user of recentUsers) {
    items.push({
      id: `user-${user.id}`,
      type: "user",
      at: user.created_at,
      title: "New user registered",
      detail: `${user.name || "User"}${user.city ? ` · ${user.city}` : ""}`,
      tone: "success",
    });
  }

  for (const profile of recentActiveProfiles) {
    const user = profile.user || {};
    items.push({
      id: `published-${profile.id}`,
      type: "published",
      at: profile.updated_at || profile.created_at,
      title: "Professional profile published",
      detail: `${user.name || "Advisor"}${user.city ? ` · ${user.city}` : ""}`,
      tone: "success",
    });
  }

  for (const payment of recentPayments) {
    const user = payment.user || {};
    const plan = payment.plan_id || "plan";
    const amount = (Number(payment.amount) || 0) / 100;
    const planLabel = plan.charAt(0).toUpperCase() + plan.slice(1);
    items.push({
      id: `payment-${payment.id}`,
      type: "payment",
      at: payment.paid_at || payment.created_at,
      title: `${planLabel} plan upgraded`,
      detail: `${formatINR(amount)} · ${user.name || "Advisor"}${user.city ? ` · ${user.city}` : ""}`,
      tone: plan === "gold" ? "gold" : "success",
    });
  }

  for (const testimonial of recentTestimonials) {
    const typeLabel =
      testimonial.testimonial_type === "audio"
        ? "Audio"
        : testimonial.testimonial_type === "video"
          ? "Video"
          : "Text";
    items.push({
      id: `testimonial-${testimonial.id}`,
      type: "testimonial",
      at: testimonial.created_at,
      title: "New review submitted",
      detail: `${typeLabel} review · ${testimonial.respondent_type === "advisor" ? "Advisor" : "Customer"}`,
      tone: "info",
    });
  }

  for (const complaint of recentComplaints) {
    items.push({
      id: `complaint-${complaint.id}`,
      type: "complaint",
      at: complaint.created_at,
      title: "New complaint received",
      detail: complaint.case_number
        ? `Case ${complaint.case_number}`
        : "Platform complaint",
      tone: "warning",
    });
  }

  return items
    .filter((item) => item.at)
    .sort((a, b) => new Date(b.at).getTime() - new Date(a.at).getTime())
    .slice(0, 8);
}

export async function GET() {
  try {
    const admin = await getAuthenticatedAdmin();
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const supabase = createAdminClient();
    const todayIso = startOfTodayIso();
    const thirtyDaysAgo = daysAgoIso(30);
    const sixtyDaysAgo = daysAgoIso(60);
    const tenMonthsAgo = monthsAgoIso(10);
    const sixMonthsAgo = monthsAgoIso(6);

    const [
      totalRes,
      freeRes,
      silverRes,
      goldRes,
      underReviewRes,
      actionRequiredRes,
      liveProfilesRes,
      totalUsersRes,
      usersTodayRes,
      advisorsTodayRes,
      cityRes,
      companyRes,
      serviceRes,
      roleWiseRes,
      paidPaymentsRes,
      goldPaymentsRes,
      silverPaymentsRes,
      monthPaymentsRes,
      pendingTestimonialsRes,
      reviewsTodayRes,
      paymentsTodayRes,
      recentUpgradesRes,
      recentPaymentsRes,
      recentTestimonialsRes,
      recentUsersRes,
      recentActiveProfilesRes,
      recentComplaintsRes,
      advisorsLast30Res,
      advisorsPrev30Res,
      advisorSignupsRes,
      userSignupsRes,
      profileFieldsRes,
      complaintsOpenRes,
    ] = await Promise.all([
      supabase.from("advisor_profiles").select("*", { count: "exact", head: true }),
      supabase.from("advisor_profiles").select("*", { count: "exact", head: true }).eq("subscription_plan", "free"),
      supabase.from("advisor_profiles").select("*", { count: "exact", head: true }).eq("subscription_plan", "silver"),
      supabase.from("advisor_profiles").select("*", { count: "exact", head: true }).eq("subscription_plan", "gold"),
      supabase.from("advisor_profiles").select("*", { count: "exact", head: true }).eq("account_status", "under_review"),
      supabase.from("advisor_profiles").select("*", { count: "exact", head: true }).eq("account_status", "action_required"),
      supabase
        .from("advisor_profiles")
        .select("*", { count: "exact", head: true })
        .eq("account_status", "active")
        .eq("profile_status", true),
      supabase.from("users").select("*", { count: "exact", head: true }),
      supabase.from("users").select("*", { count: "exact", head: true }).gte("created_at", todayIso),
      supabase.from("advisor_profiles").select("*", { count: "exact", head: true }).gte("created_at", todayIso),
      supabase.from("city_counts").select("*"),
      supabase.from("company_counts").select("*"),
      supabase.from("service_counts").select("*"),
      supabase
        .from("users")
        .select(`
          profession,
          advisor:advisor_profiles!inner(id)
        `),
      supabase
        .from("advisor_payments")
        .select("amount, plan_id, paid_at, created_at, status")
        .eq("status", "paid"),
      supabase.from("advisor_payments").select("amount").eq("status", "paid").eq("plan_id", "gold"),
      supabase.from("advisor_payments").select("amount").eq("status", "paid").eq("plan_id", "silver"),
      supabase
        .from("advisor_payments")
        .select("amount, paid_at")
        .eq("status", "paid")
        .not("paid_at", "is", null)
        .gte("paid_at", sixMonthsAgo),
      supabase
        .from("yvity_testimonials")
        .select("*", { count: "exact", head: true })
        .in("status", ["pending", "submitted"]),
      supabase
        .from("yvity_testimonials")
        .select("*", { count: "exact", head: true })
        .gte("created_at", todayIso),
      supabase
        .from("advisor_payments")
        .select("*", { count: "exact", head: true })
        .eq("status", "paid")
        .gte("paid_at", todayIso),
      supabase
        .from("advisor_payments")
        .select("id, amount, plan_id, paid_at, created_at, user:users(name, city)")
        .eq("status", "paid")
        .in("plan_id", ["gold", "silver"])
        .order("paid_at", { ascending: false })
        .limit(5),
      supabase
        .from("advisor_payments")
        .select("id, amount, plan_id, paid_at, created_at, user:users(name, city)")
        .eq("status", "paid")
        .order("paid_at", { ascending: false })
        .limit(3),
      supabase
        .from("yvity_testimonials")
        .select("id, testimonial_type, respondent_type, created_at, status")
        .order("created_at", { ascending: false })
        .limit(3),
      supabase
        .from("users")
        .select("id, name, city, created_at")
        .order("created_at", { ascending: false })
        .limit(2),
      supabase
        .from("advisor_profiles")
        .select("id, updated_at, created_at, user:users(name, city)")
        .eq("account_status", "active")
        .eq("profile_status", true)
        .order("updated_at", { ascending: false })
        .limit(2),
      supabase
        .from("platform_complaints")
        .select("id, case_number, created_at, status")
        .order("created_at", { ascending: false })
        .limit(2),
      supabase
        .from("advisor_profiles")
        .select("*", { count: "exact", head: true })
        .gte("created_at", thirtyDaysAgo),
      supabase
        .from("advisor_profiles")
        .select("*", { count: "exact", head: true })
        .gte("created_at", sixtyDaysAgo)
        .lt("created_at", thirtyDaysAgo),
      supabase.from("advisor_profiles").select("created_at").gte("created_at", tenMonthsAgo),
      supabase.from("users").select("created_at").gte("created_at", tenMonthsAgo),
      supabase.from("advisor_profiles").select(
        "short_bio, intro_url, iridai_certificate_url, services, profile_status, account_status",
      ),
      supabase
        .from("platform_complaints")
        .select("*", { count: "exact", head: true })
        .in("status", ["open", "in_review"]),
    ]);

    if (totalRes.error) {
      console.error("Failed to fetch total advisors:", totalRes.error);
      return NextResponse.json({ error: "Failed to fetch dashboard data" }, { status: 500 });
    }

    if (cityRes.error) console.warn("city_counts unavailable:", cityRes.error.message);
    if (companyRes.error) console.warn("company_counts unavailable:", companyRes.error.message);
    if (serviceRes.error) console.warn("service_counts unavailable:", serviceRes.error.message);
    if (complaintsOpenRes.error) {
      console.warn("platform_complaints unavailable:", complaintsOpenRes.error.message);
    }
    if (recentComplaintsRes.error) {
      console.warn("recent complaints unavailable:", recentComplaintsRes.error.message);
    }

    const professionCounts = new Map();

    for (const item of roleWiseRes.data || []) {
      const profession = normalizeProfession(item.profession);
      professionCounts.set(profession, (professionCounts.get(profession) || 0) + 1);
    }

    const sortedProfessions = Array.from(professionCounts.entries())
      .map(([profession, total]) => ({ profession, total }))
      .sort((a, b) => b.total - a.total);

    const topProfessions = sortedProfessions.slice(0, 7);
    const remainingTotal = sortedProfessions.slice(7).reduce((sum, item) => sum + item.total, 0);

    const roleWise = remainingTotal
      ? [...topProfessions, { profession: "Others", total: remainingTotal }]
      : topProfessions;

    const paidPayments = paidPaymentsRes.data || [];
    const goldRevenue = sumRevenue(goldPaymentsRes.data || []);
    const silverRevenue = sumRevenue(silverPaymentsRes.data || []);
    const totalRevenue = sumRevenue(paidPayments);

    const now = new Date();
    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
    const thisMonthPayments = paidPayments.filter((p) => p.paid_at && p.paid_at >= firstDay);
    const revenueThisMonth = sumRevenue(thisMonthPayments);

    const advisorSignupDates = (advisorSignupsRes.data || []).map((row) => row.created_at);
    const userSignupDates = (userSignupsRes.data || []).map((row) => row.created_at);
    const signupDates = [...advisorSignupDates, ...userSignupDates];

    const signupsLast30 = signupDates.filter((iso) => iso >= thirtyDaysAgo).length;
    const signupsPrev30 = signupDates.filter((iso) => iso >= sixtyDaysAgo && iso < thirtyDaysAgo).length;

    const totalProfessionals = totalRes.count || 0;
    const totalUsers = totalUsersRes.count || 0;
    const totalCustomers = Math.max(0, totalUsers - totalProfessionals);
    const pendingVerifications =
      (underReviewRes.count || 0) + (actionRequiredRes.count || 0);

    const activity = buildActivityFeed({
      recentUsers: recentUsersRes.data || [],
      recentActiveProfiles: recentActiveProfilesRes.data || [],
      recentPayments: recentPaymentsRes.data || [],
      recentTestimonials: recentTestimonialsRes.data || [],
      recentComplaints: recentComplaintsRes.error ? [] : recentComplaintsRes.data || [],
    });

    return NextResponse.json({
      advisors: {
        total: totalProfessionals,
        free: freeRes.count || 0,
        silver: silverRes.count || 0,
        gold: goldRes.count || 0,
        under_review: underReviewRes.count || 0,
        action_required: actionRequiredRes.count || 0,
        live: liveProfilesRes.count || 0,
      },

      users: {
        total: totalUsers,
        customers: totalCustomers,
        professionals: totalProfessionals,
        registrationsToday: (usersTodayRes.count || 0) + (advisorsTodayRes.count || 0),
      },

      subscriptions: {
        active: (silverRes.count || 0) + (goldRes.count || 0),
      },

      revenue: {
        total: totalRevenue,
        gold: goldRevenue,
        silver: silverRevenue,
        thisMonth: revenueThisMonth,
        payments: monthPaymentsRes.data || [],
        recentUpgrades: recentUpgradesRes.data || [],
      },

      approvals: {
        pending: pendingVerifications,
        under_review: underReviewRes.count || 0,
      },

      operations: {
        pendingVerifications,
        openComplaints: complaintsOpenRes.error ? 0 : complaintsOpenRes.count || 0,
        pendingReviews: pendingTestimonialsRes.count || 0,
        newReviewsToday: reviewsTodayRes.count || 0,
        profileCompletionPct: averageProfileCompletion(profileFieldsRes.data || []),
      },

      growth: {
        advisorsLast30: advisorsLast30Res.count || 0,
        advisorsPrev30: advisorsPrev30Res.count || 0,
        signupsLast30,
        signupsPrev30,
        signupDates,
      },

      quickActions: {
        pendingVerifications,
        pendingProfiles: underReviewRes.count || 0,
        openComplaints: complaintsOpenRes.error ? 0 : complaintsOpenRes.count || 0,
        pendingTestimonials: pendingTestimonialsRes.count || 0,
        paymentsToday: paymentsTodayRes.count || 0,
      },

      activity,

      analytics: {
        cities: cityRes.error ? [] : cityRes.data || [],
        companies: companyRes.error ? [] : companyRes.data || [],
        services: serviceRes.error ? [] : serviceRes.data || [],
        serviceWise: serviceRes.error ? [] : serviceRes.data || [],
        roleWise,
      },
    });
  } catch (error) {
    console.error("GET /api/admin/overview failed:", error);
    return NextResponse.json(
      { error: "Internal Server Error", details: error.message },
      { status: 500 },
    );
  }
}
