/**
 * Admin permission keys — maps to admin_users.permissions JSONB.
 * Grouped for Roles UI and future nav (User Management, Profile Mgmt, etc.).
 */

export const PERMISSION_GROUPS = {
  dashboard: {
    label: "Dashboard",
    keys: ["overview", "analytics"],
  },
  userManagement: {
    label: "User Management",
    keys: [
      "users",
      "profiles",
      "platform_testimonials",
      "advisor_testimonials",
      "moderate_advisor_testimonials",
      "reports_complaints",
      "view_complaint_pii",
      "manage_complaints",
    ],
  },
  profileManagement: {
    label: "Profile Management",
    keys: [
      "irdai_approvals",
      "industries",
      "industry_configuration",
      "verification_rules",
      "visibility_controls",
    ],
  },
  productsPlans: {
    label: "Plans and Pricing",
    keys: [
      "plans",
      "pricing",
      "coupons",
      "feature_controls",
      "billing",
      "payments",
      "campaigns",
      "send_campaigns",
    ],
  },
  ambassadors: {
    label: "Ambassador Program",
    keys: ["ambassadors", "referrals", "rewards", "leaderboard"],
  },
  administration: {
    label: "Administration",
    keys: [
      "roles_permissions",
      "create_admin_user",
      "delete_admin_user",
      "settings",
      "view_audit_logs",
    ],
  },
};

/** Flat list of all permission keys (includes legacy aliases). */
export const PERMISSION_KEYS = [
  // Dashboard
  "overview",
  "analytics",
  // User management
  "users",
  "profiles",
  "customers",
  "subscribers",
  "platform_testimonials",
  "advisor_testimonials",
  "moderate_advisor_testimonials",
  "testimonials",
  "reports_complaints",
  "view_complaint_pii",
  "manage_complaints",
  // Profile management
  "irdai_approvals",
  "industries",
  "industry_configuration",
  "verification_rules",
  "visibility_controls",
  // Products & plans
  "plans",
  "pricing",
  "coupons",
  "feature_controls",
  "billing",
  "payments",
  "campaigns",
  "send_campaigns",
  // Ambassadors (future)
  "ambassadors",
  "referrals",
  "rewards",
  "leaderboard",
  // Administration
  "roles_permissions",
  "create_admin_user",
  "delete_admin_user",
  "settings",
  "view_audit_logs",
];

export const PERMISSION_LABELS = {
  overview: "Dashboard",
  analytics: "Analytics (deep reports)",
  users: "Users",
  profiles: "Profiles",
  customers: "Customers",
  subscribers: "Subscribers / advisors list",
  platform_testimonials: "Platform reviews (YVITY)",
  advisor_testimonials: "Advisor client reviews (read)",
  moderate_advisor_testimonials: "Hide / restore advisor reviews",
  testimonials: "Testimonials (legacy — all)",
  reports_complaints: "Reports & complaints (queue)",
  view_complaint_pii: "View complaint contact (decrypt phone/email)",
  manage_complaints: "Assign & resolve complaints",
  irdai_approvals: "Approvals",
  industries: "Industries",
  industry_configuration: "Industry configuration",
  verification_rules: "Verification rules",
  visibility_controls: "Visibility controls",
  plans: "Plans",
  pricing: "Pricing",
  coupons: "Coupons",
  feature_controls: "Feature controls",
  billing: "Billing & subscriptions",
  payments: "Payments",
  campaigns: "Communication Center (compose)",
  send_campaigns: "Communication Center (send)",
  ambassadors: "Ambassadors",
  referrals: "Referrals",
  rewards: "Rewards",
  leaderboard: "Leaderboard",
  roles_permissions: "Roles & permissions",
  create_admin_user: "Create admin user",
  delete_admin_user: "Delete admin user",
  settings: "Settings",
  view_audit_logs: "PII & audit logs",
};

/** Legacy keys map to new nav until pages are split. */
export const LEGACY_PERMISSION_ALIASES = {
  testimonials: ["platform_testimonials", "advisor_testimonials"],
  customers: ["users"],
  subscribers: ["profiles"],
};
