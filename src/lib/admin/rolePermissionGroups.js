/**
 * Roles UI permission groups — maps wireframe checkboxes to existing permission keys.
 * Multiple UI items may share the same underlying key.
 */

export const ROLE_PERMISSION_UI_GROUPS = [
  {
    id: "user_management",
    label: "User Management",
    emoji: "👥",
    items: [
      { id: "view_users", label: "View Users", keys: ["users"] },
      { id: "edit_users", label: "Edit Users", keys: ["users"] },
      { id: "suspend_users", label: "Suspend Users", keys: ["users"] },
      { id: "delete_users", label: "Delete Users", keys: ["users"] },
    ],
  },
  {
    id: "profiles",
    label: "Profiles",
    emoji: "📄",
    items: [
      { id: "view_profiles", label: "View Profiles", keys: ["profiles"] },
      { id: "approve_profiles", label: "Approve Profiles", keys: ["irdai_approvals"] },
      { id: "reject_profiles", label: "Reject Profiles", keys: ["irdai_approvals"] },
      { id: "hide_profiles", label: "Hide Profiles", keys: ["visibility_controls"] },
      { id: "feature_profiles", label: "Feature Profiles", keys: ["feature_controls", "visibility_controls"] },
    ],
  },
  {
    id: "approvals",
    label: "Approvals",
    emoji: "🛡",
    items: [
      { id: "view_approvals", label: "View Approvals", keys: ["irdai_approvals"] },
      { id: "approve_services", label: "Approve Services", keys: ["irdai_approvals"] },
      { id: "reject_services", label: "Reject Services", keys: ["irdai_approvals"] },
    ],
  },
  {
    id: "platform_reviews",
    label: "Platform Reviews",
    emoji: "⭐",
    items: [
      {
        id: "view_reviews",
        label: "View Reviews",
        keys: ["platform_testimonials", "advisor_testimonials"],
      },
      { id: "approve_reviews", label: "Approve Reviews", keys: ["moderate_advisor_testimonials"] },
      { id: "hide_reviews", label: "Hide Reviews", keys: ["moderate_advisor_testimonials"] },
    ],
  },
  {
    id: "reports_complaints",
    label: "Reports & Complaints",
    emoji: "🚩",
    items: [
      { id: "view_complaints", label: "View Complaints", keys: ["reports_complaints"] },
      { id: "assign_complaints", label: "Assign Complaints", keys: ["manage_complaints"] },
      { id: "resolve_complaints", label: "Resolve Complaints", keys: ["manage_complaints"] },
      { id: "close_complaints", label: "Close Complaints", keys: ["manage_complaints"] },
    ],
  },
  {
    id: "products_plans",
    label: "Products & Plans",
    emoji: "💳",
    items: [
      { id: "view_plans", label: "View Plans", keys: ["plans"] },
      { id: "edit_plans", label: "Edit Plans", keys: ["plans"] },
      { id: "edit_pricing", label: "Edit Pricing", keys: ["pricing"] },
      { id: "manage_coupons", label: "Manage Coupons", keys: ["coupons"] },
      { id: "manage_billing", label: "Manage Billing", keys: ["billing", "payments"] },
    ],
  },
  {
    id: "ambassadors",
    label: "Ambassador Program",
    emoji: "🤝",
    items: [
      { id: "view_ambassadors", label: "View Ambassadors", keys: ["ambassadors", "referrals"] },
      { id: "manage_campaigns", label: "Manage Campaigns", keys: ["campaigns", "send_campaigns"] },
      { id: "manage_rewards", label: "Manage Rewards", keys: ["rewards", "leaderboard"] },
    ],
  },
  {
    id: "analytics",
    label: "Analytics",
    emoji: "📊",
    items: [
      { id: "view_analytics", label: "View Analytics", keys: ["analytics", "overview"] },
      { id: "export_reports", label: "Export Reports", keys: ["analytics"] },
    ],
  },
  {
    id: "communications",
    label: "Communication Center",
    emoji: "📢",
    items: [
      { id: "send_notifications", label: "Send Notifications", keys: ["campaigns"] },
      { id: "send_email", label: "Send Email Campaigns", keys: ["send_campaigns", "campaigns"] },
      { id: "send_sms", label: "Send SMS Campaigns", keys: ["send_campaigns"] },
      { id: "send_whatsapp", label: "Send WhatsApp Campaigns", keys: ["send_campaigns"] },
    ],
  },
  {
    id: "settings",
    label: "Settings",
    emoji: "⚙",
    items: [
      { id: "view_settings", label: "View Settings", keys: ["settings"] },
      { id: "edit_settings", label: "Edit Settings", keys: ["settings"] },
    ],
  },
  {
    id: "administration",
    label: "Administration",
    emoji: "🔐",
    items: [
      { id: "roles_permissions", label: "Roles & Permissions", keys: ["roles_permissions"] },
      { id: "create_admin", label: "Create Admin Users", keys: ["create_admin_user"] },
      { id: "delete_admin", label: "Delete Admin Users", keys: ["delete_admin_user"] },
      { id: "audit_logs", label: "View Activity Logs", keys: ["view_audit_logs"] },
    ],
  },
];

export function isUiPermissionChecked(permissions, item) {
  return item.keys.some((key) => permissions[key] === true);
}

export function applyUiPermissionToggle(permissions, item, checked) {
  const next = { ...permissions };
  item.keys.forEach((key) => {
    next[key] = checked;
  });
  return next;
}

export function countEnabledUiPermissions(permissions) {
  let total = 0;
  let enabled = 0;
  ROLE_PERMISSION_UI_GROUPS.forEach((group) => {
    group.items.forEach((item) => {
      total += 1;
      if (isUiPermissionChecked(permissions, item)) enabled += 1;
    });
  });
  return { enabled, total };
}
