/**
 * Single source of truth for admin navigation, route guards, and page headers.
 * Phase 0: structure + placeholders; live pages keep their existing routes.
 */

export const ADMIN_NAV_TREE = [
  {
    sectionId: "dashboard",
    title: null,
    items: [
      {
        id: "overview",
        label: "Dashboard",
        link: "/admin",
        permissionKey: "overview",
        status: "live",
        pagePrefixes: ["/admin"],
        apiPrefixes: ["/api/admin/overview"],
        exactPath: true,
      },
    ],
  },
  {
    sectionId: "userManagement",
    title: "User Management",
    items: [
      {
        id: "users",
        label: "Users",
        link: "/admin/users",
        permissionKey: "users",
        alternatePermissionKeys: ["customers"],
        status: "live",
        pagePrefixes: ["/admin/users", "/admin/users/", "/admin/customers"],
        apiPrefixes: ["/api/admin/customers", "/api/admin/users"],
        placeholderDescription:
          "Search and manage end-user accounts, login history, and account status.",
      },
      {
        id: "profiles",
        label: "Profiles",
        link: "/admin/profiles",
        permissionKey: "profiles",
        alternatePermissionKeys: ["subscribers"],
        status: "live",
        pagePrefixes: [
          "/admin/profiles",
          "/admin/subscribers",
          "/admin/subscriptions",
          "/admin/advisors",
        ],
        apiPrefixes: [
          "/api/admin/subscriptions",
          "/api/admin/advisors",
          "/api/admin/profiles",
        ],
        placeholderDescription:
          "Advisor and subscriber profiles, verification status, and public visibility.",
        legacyLinks: ["/admin/subscribers"],
      },
      {
        id: "platform_testimonials",
        label: "Platform reviews",
        link: "/admin/platform-testimonials",
        permissionKey: "platform_testimonials",
        alternatePermissionKeys: ["testimonials"],
        status: "live",
        pagePrefixes: ["/admin/platform-testimonials", "/admin/testimonials"],
        apiPrefixes: ["/api/admin/testimonials", "/api/admin/platform-testimonials"],
        placeholderDescription:
          "Approve YVITY platform testimonials before they appear on the landing page.",
      },
      {
        id: "advisor_testimonials",
        label: "Advisor reviews",
        link: "/admin/advisor-testimonials",
        permissionKey: "advisor_testimonials",
        alternatePermissionKeys: ["testimonials", "moderate_advisor_testimonials"],
        status: "live",
        pagePrefixes: ["/admin/advisor-testimonials"],
        apiPrefixes: ["/api/admin/advisor-testimonials"],
        placeholderDescription:
          "Oversight for auto-published client reviews — flag, hide, and restore abusive content.",
      },
      {
        id: "reports_complaints",
        label: "Reports & complaints",
        link: "/admin/complaints",
        permissionKey: "reports_complaints",
        alternatePermissionKeys: ["manage_complaints", "view_complaint_pii"],
        status: "live",
        pagePrefixes: ["/admin/complaints"],
        apiPrefixes: ["/api/admin/complaints"],
        placeholderDescription:
          "Review reported content and platform complaints with audited PII access.",
      },
    ],
  },
  {
    sectionId: "profileManagement",
    title: "Profile Management",
    items: [
      {
        id: "irdai_approvals",
        label: "Approvals",
        link: "/admin/irdaiapprovals",
        permissionKey: "irdai_approvals",
        status: "live",
        pagePrefixes: ["/admin/irdaiapprovals"],
        apiPrefixes: ["/api/admin/approvals", "/api/admin/irdai"],
      },
      {
        id: "industries",
        label: "Industries",
        link: "/admin/industries",
        permissionKey: "industries",
        status: "placeholder",
        pagePrefixes: ["/admin/industries"],
        apiPrefixes: ["/api/admin/industries"],
        placeholderDescription: "Manage industry categories available to advisors.",
      },
      {
        id: "industry_configuration",
        label: "Industry config",
        link: "/admin/industry-config",
        permissionKey: "industry_configuration",
        status: "placeholder",
        pagePrefixes: ["/admin/industry-config"],
        apiPrefixes: ["/api/admin/industry-config"],
        placeholderDescription:
          "Per-industry fields, labels, and onboarding requirements.",
      },
      {
        id: "verification_rules",
        label: "Verification rules",
        link: "/admin/verification-rules",
        permissionKey: "verification_rules",
        status: "placeholder",
        pagePrefixes: ["/admin/verification-rules"],
        apiPrefixes: ["/api/admin/verification-rules"],
        placeholderDescription:
          "Define document and selfie checks required before profiles go live.",
      },
      {
        id: "visibility_controls",
        label: "Visibility controls",
        link: "/admin/visibility-controls",
        permissionKey: "visibility_controls",
        status: "live",
        pagePrefixes: ["/admin/visibility-controls"],
        apiPrefixes: ["/api/admin/visibility-controls"],
        placeholderDescription:
          "Feature published profiles on the landing hero and Find Advisors section.",
      },
    ],
  },
  {
    sectionId: "productsPlans",
    title: "Plans and Pricing",
    items: [
      {
        id: "products_plans",
        label: "Overview",
        link: "/admin/products-plans",
        permissionKey: "products_plans",
        alternatePermissionKeys: ["plans", "pricing"],
        status: "live",
        pagePrefixes: ["/admin/products-plans"],
        apiPrefixes: ["/api/admin/products-plans"],
        placeholderDescription:
          "Subscription overview, tier mix, revenue, and shortcuts across plans, pricing, and billing.",
      },
      {
        id: "plans",
        label: "Plans",
        link: "/admin/plans",
        permissionKey: "plans",
        status: "live",
        pagePrefixes: ["/admin/plans"],
        apiPrefixes: ["/api/admin/plans"],
        placeholderDescription: "Free, Silver, and Gold subscription tiers with entitlements and subscriber counts.",
      },
      {
        id: "pricing",
        label: "Pricing",
        link: "/admin/pricing",
        permissionKey: "pricing",
        status: "live",
        pagePrefixes: ["/admin/pricing"],
        apiPrefixes: ["/api/admin/pricing"],
        placeholderDescription: "Edit list and sale prices, discounts, and add new subscription plans.",
      },
      {
        id: "coupons",
        label: "Coupons",
        link: "/admin/coupons",
        permissionKey: "coupons",
        status: "live",
        pagePrefixes: ["/admin/coupons"],
        apiPrefixes: ["/api/admin/coupons"],
        placeholderDescription: "Personal one-time discount codes on top of sale pricing.",
      },
      {
        id: "feature_controls",
        label: "Feature controls",
        link: "/admin/feature-controls",
        permissionKey: "feature_controls",
        status: "live",
        pagePrefixes: ["/admin/feature-controls"],
        apiPrefixes: ["/api/admin/feature-controls"],
        placeholderDescription: "Plan tier limits and platform-wide feature toggles.",
      },
      {
        id: "billing",
        label: "Billing",
        link: "/admin/billing",
        permissionKey: "billing",
        status: "live",
        pagePrefixes: ["/admin/billing"],
        apiPrefixes: ["/api/admin/billing"],
        placeholderDescription: "Subscription lifecycle, renewals, and admin extensions.",
      },
      {
        id: "payments",
        label: "Payments",
        link: "/admin/payments",
        permissionKey: "payments",
        status: "live",
        pagePrefixes: ["/admin/payments"],
        apiPrefixes: ["/api/admin/payments"],
      },
    ],
  },
  {
    sectionId: "ambassadors",
    title: "Ambassador Program",
    items: [
      {
        id: "ambassadors",
        label: "Ambassadors",
        link: "/admin/ambassadors",
        permissionKey: "ambassadors",
        alternatePermissionKeys: ["referrals", "rewards", "leaderboard"],
        status: "live",
        pagePrefixes: ["/admin/ambassadors"],
        apiPrefixes: ["/api/admin/ambassadors"],
        placeholderDescription:
          "Referral program — ambassadors, referrals, rewards, and leaderboard.",
      },
    ],
  },
  {
    sectionId: "administration",
    title: "Administration",
    items: [
      {
        id: "analytics",
        label: "Analytics",
        link: "/admin/analytics",
        permissionKey: "analytics",
        status: "live",
        pagePrefixes: ["/admin/analytics"],
        apiPrefixes: ["/api/admin/analytics"],
      },
      {
        id: "roles_permissions",
        label: "Roles & Permissions",
        link: "/admin/roles",
        permissionKey: "roles_permissions",
        alternatePermissionKeys: ["create_admin_user", "delete_admin_user"],
        status: "live",
        pagePrefixes: ["/admin/roles"],
        apiPrefixes: ["/api/admin/roles"],
      },
      {
        id: "communications",
        label: "Communication Center",
        link: "/admin/communications",
        permissionKey: "campaigns",
        alternatePermissionKeys: ["send_campaigns"],
        status: "live",
        pagePrefixes: ["/admin/communications", "/admin/campaigns"],
        apiPrefixes: ["/api/admin/communications", "/api/admin/campaigns"],
      },
      {
        id: "settings",
        label: "Settings",
        link: "/admin/settings",
        permissionKey: "settings",
        status: "live",
        pagePrefixes: ["/admin/settings"],
        apiPrefixes: ["/api/admin/settings"],
      },
    ],
  },
];

const DEFAULT_HEADER_ACTIONS = ["profile", "notifications"];

/** Flat list of all nav items. */
export function getAllNavItems() {
  return ADMIN_NAV_TREE.flatMap((section) => section.items);
}

/** Route guard map — order matches nav priority for first-accessible redirect. */
export function buildAdminSectionRouteMap() {
  return getAllNavItems().map((item) => ({
    permissionKey: item.permissionKey,
    alternatePermissionKeys: item.alternatePermissionKeys || [],
    pagePrefixes: item.pagePrefixes || [item.link],
    apiPrefixes: item.apiPrefixes || [],
  }));
}

/** Header titles keyed by path (longest-prefix match handled in Sidebar). */
export function buildAdminHeaderConfig() {
  const config = {
    "/admin/unauthorized": {
      title: "Access Restricted",
      actions: DEFAULT_HEADER_ACTIONS,
    },
  };

  for (const item of getAllNavItems()) {
    const prefixes = item.pagePrefixes || [item.link];
    for (const prefix of prefixes) {
      config[prefix] = {
        title: item.label,
        actions: DEFAULT_HEADER_ACTIONS,
        navItemId: item.id,
      };
    }
  }

  return config;
}

const ADMIN_HEADER_CONFIG = buildAdminHeaderConfig();

/** Detail routes that inherit a parent nav item but need their own shell title. */
const DETAIL_ROUTE_HEADERS = [
  {
    test: (path) => /^\/admin\/users\/[^/]+$/.test(path),
    fallbackTitle: "User detail",
    parentNavItemId: "users",
  },
];

function findNavItemForPath(normalizedPath) {
  let bestItem = null;
  let bestPrefixLength = 0;

  for (const item of getAllNavItems()) {
    const prefixes = item.pagePrefixes || [item.link];

    for (const prefix of prefixes) {
      const matches =
        normalizedPath === prefix ||
        (prefix !== "/admin" && normalizedPath.startsWith(prefix));

      if (!matches) continue;
      if (item.exactPath && normalizedPath !== prefix) continue;
      if (prefix.length <= bestPrefixLength) continue;

      bestPrefixLength = prefix.length;
      bestItem = item;
    }
  }

  return bestItem;
}

function findSectionForNavItem(navItem) {
  if (!navItem) return null;
  return ADMIN_NAV_TREE.find((section) =>
    section.items.some((item) => item.id === navItem.id),
  );
}

function resolveHeaderEntry(normalizedPath) {
  const exact = ADMIN_HEADER_CONFIG[normalizedPath];
  if (exact) return exact;

  const prefixEntry = Object.entries(ADMIN_HEADER_CONFIG)
    .filter(([key]) => key !== "/admin" && normalizedPath.startsWith(key))
    .sort((a, b) => b[0].length - a[0].length)[0];

  return prefixEntry?.[1] || null;
}

/**
 * Resolve shell header title + nav context for a pathname.
 * Optional titleOverride lets detail views set a dynamic label (e.g. user name).
 */
export function resolveAdminPageHeader(pathname, titleOverride = null) {
  const normalizedPath = (pathname || "").replace(/\/+$/, "") || "/admin";
  const headerEntry = resolveHeaderEntry(normalizedPath);

  const detailRoute = DETAIL_ROUTE_HEADERS.find((route) => route.test(normalizedPath));
  const navItem =
    findNavItemForPath(normalizedPath) ||
    (detailRoute ? getNavItemById(detailRoute.parentNavItemId) : null);
  const section = findSectionForNavItem(navItem);

  let title = headerEntry?.title || "Dashboard";

  if (detailRoute) {
    title = titleOverride || detailRoute.fallbackTitle;
  } else if (titleOverride) {
    title = titleOverride;
  }

  return {
    title,
    actions: headerEntry?.actions || DEFAULT_HEADER_ACTIONS,
    sectionId: section?.sectionId || null,
    sectionLabel:
      section?.title ||
      (section?.sectionId === "dashboard" ? "Dashboard" : null),
    navItemId: navItem?.id || headerEntry?.navItemId || null,
    navItemLabel: navItem?.label || title,
    isDetailRoute: Boolean(detailRoute),
  };
}

/** Sidebar menu shape: { title, navitems[] }. */
export function isNavItemActive(pathname, item) {
  if (!item?.link) return false;

  return item.exactPath
    ? pathname === item.link
    : pathname === item.link || pathname.startsWith(`${item.link}/`);
}

export function buildSidebarMenuItems(iconById = {}) {
  return ADMIN_NAV_TREE.map((section) => ({
    sectionId: section.sectionId,
    title: section.title,
    navitems: section.items.map((item) => ({
      id: item.id,
      label: item.label,
      link: item.link,
      permissionKey: item.permissionKey,
      alternatePermissionKeys: item.alternatePermissionKeys || [],
      icon: iconById[item.id] || null,
      exactPath: item.exactPath === true,
    })),
  })).filter((section) => section.navitems.length > 0);
}

export function getNavItemById(id) {
  return getAllNavItems().find((item) => item.id === id);
}

export function getPlaceholderMeta(id) {
  const item = getNavItemById(id);
  if (!item) return null;

  return {
    title: item.label,
    description: item.placeholderDescription || `${item.label} will be built in a later phase.`,
    status: item.status,
    link: item.link,
  };
}

/** All permission keys referenced in the nav (for roles defaults). */
export const NAV_PERMISSION_KEYS = [
  ...new Set(getAllNavItems().flatMap((item) => [
    item.permissionKey,
    ...(item.alternatePermissionKeys || []),
  ])),
];
