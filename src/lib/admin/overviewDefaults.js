/** Safe fallbacks when individual Supabase dashboard queries fail. */
export function queryCount(result, label) {
  if (result?.error) {
    console.warn(`[admin/overview] ${label}:`, result.error.message);
    return 0;
  }
  return result?.count ?? 0;
}

export function queryRows(result, label, fallback = []) {
  if (result?.error) {
    console.warn(`[admin/overview] ${label}:`, result.error.message);
    return fallback;
  }
  return result?.data ?? fallback;
}

export function emptyDashboardPayload() {
  return {
    advisors: {
      total: 0,
      free: 0,
      silver: 0,
      gold: 0,
      under_review: 0,
      action_required: 0,
      live: 0,
    },
    users: {
      total: 0,
      customers: 0,
      professionals: 0,
      registrationsToday: 0,
    },
    subscriptions: { active: 0 },
    revenue: {
      total: 0,
      gold: 0,
      silver: 0,
      thisMonth: 0,
      payments: [],
      recentUpgrades: [],
    },
    approvals: { pending: 0, under_review: 0 },
    operations: {
      pendingVerifications: 0,
      openComplaints: 0,
      pendingReviews: 0,
      newReviewsToday: 0,
      profileCompletionPct: 0,
    },
    growth: {
      advisorsLast30: 0,
      advisorsPrev30: 0,
      signupsLast30: 0,
      signupsPrev30: 0,
      signupDates: [],
    },
    quickActions: {
      pendingVerifications: 0,
      pendingProfiles: 0,
      openComplaints: 0,
      pendingTestimonials: 0,
      paymentsToday: 0,
    },
    activity: [],
    analytics: {
      cities: [],
      companies: [],
      services: [],
      serviceWise: [],
      roleWise: [],
    },
    degraded: true,
  };
}
