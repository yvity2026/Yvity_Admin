/**
 * Quick action definitions for the dashboard right rail.
 * `live: false` routes to placeholder pages — still linked, marked "Soon".
 */

export const DASHBOARD_QUICK_ACTIONS = [
  {
    id: "search-user",
    label: "Search user",
    href: "/admin/users",
    live: false,
    primary: true,
    icon: "search",
  },
  {
    id: "verifications",
    label: "Review pending verifications",
    href: "/admin/irdaiapprovals",
    live: true,
    primary: true,
    icon: "shield",
    badgeKey: "pendingVerifications",
  },
  {
    id: "profiles",
    label: "Review pending profiles",
    href: "/admin/profiles",
    live: true,
    primary: true,
    icon: "profile",
    badgeKey: "pendingProfiles",
  },
  {
    id: "platform-reviews",
    label: "Review platform reviews",
    href: "/admin/platform-testimonials",
    live: true,
    primary: true,
    icon: "star",
    badgeKey: "pendingTestimonials",
  },
  {
    id: "testimonial-request",
    label: "Send testimonial request",
    href: "/admin/platform-testimonials",
    live: true,
    primary: false,
    icon: "star",
  },
  {
    id: "upgrade-plan",
    label: "Upgrade user plan",
    href: "/admin/subscriptions",
    live: false,
    primary: false,
    icon: "upgrade",
  },
  {
    id: "coupon",
    label: "Generate coupon",
    href: "/admin/coupons",
    live: false,
    primary: false,
    icon: "coupon",
  },
  {
    id: "announcement",
    label: "Send platform announcement",
    href: "/admin/communications",
    live: true,
    primary: false,
    icon: "megaphone",
  },
  {
    id: "ambassador-coupon",
    label: "Create ambassador coupon",
    href: "/admin/ambassadors",
    live: true,
    primary: false,
    icon: "ambassador",
  },
  {
    id: "complaints",
    label: "View open complaints",
    href: "/admin/complaints",
    live: true,
    primary: false,
    icon: "flag",
    badgeKey: "openComplaints",
  },
  {
    id: "bulk-notification",
    label: "Send bulk notification",
    href: "/admin/communications",
    live: true,
    primary: false,
    icon: "bell",
  },
];

export function mapQuickActions(badges = {}) {
  return DASHBOARD_QUICK_ACTIONS.map((action) => ({
    ...action,
    badge:
      action.badgeKey && badges[action.badgeKey] != null
        ? Number(badges[action.badgeKey])
        : null,
  }));
}
