/**
 * Maps overview quick-action counts to header notification menu items.
 */
export const ADMIN_NOTIFICATION_DEFS = [
  {
    id: "verifications",
    label: "Pending verifications",
    href: "/admin/irdaiapprovals",
    permissionKey: "irdai_approvals",
    countKey: "pendingVerifications",
  },
  {
    id: "profiles",
    label: "Profiles under review",
    href: "/admin/profiles",
    permissionKey: "profiles",
    alternatePermissionKeys: ["subscribers"],
    countKey: "pendingProfiles",
  },
  {
    id: "complaints",
    label: "Open complaints",
    href: "/admin/complaints",
    permissionKey: "reports_complaints",
    alternatePermissionKeys: ["manage_complaints"],
    countKey: "openComplaints",
  },
  {
    id: "reviews",
    label: "Platform reviews pending",
    href: "/admin/platform-testimonials",
    permissionKey: "platform_testimonials",
    alternatePermissionKeys: ["testimonials"],
    countKey: "pendingTestimonials",
  },
];

export function buildNotificationItems(quickActions = {}, admin, canAccess) {
  const items = ADMIN_NOTIFICATION_DEFS.filter((def) =>
    canAccess(admin, def.permissionKey, def.alternatePermissionKeys || []),
  )
    .map((def) => ({
      id: def.id,
      label: def.label,
      href: def.href,
      count: Number(quickActions[def.countKey]) || 0,
    }))
    .filter((item) => item.count > 0);

  const total = items.reduce((sum, item) => sum + item.count, 0);

  return { items, total };
}
