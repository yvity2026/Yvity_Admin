export const navItems = {
  MAIN: [
    {
      label: "Overview",
      href: "/admin",
      icon: (
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width={16} height={16}>
          <rect x="3" y="3" width="7" height="7" rx="1" strokeWidth="2" />
          <rect x="14" y="3" width="7" height="7" rx="1" strokeWidth="2" />
          <rect x="3" y="14" width="7" height="7" rx="1" strokeWidth="2" />
          <rect x="14" y="14" width="7" height="7" rx="1" strokeWidth="2" />
        </svg>
      ),
    },
    {
      label: "Advisors",
      href: "/admin/advisors",
      icon: (
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width={16} height={16}>
          <circle cx="9" cy="7" r="4" strokeWidth="2" />
          <path d="M3 21v-2a4 4 0 014-4h4a4 4 0 014 4v2" strokeWidth="2" />
          <path d="M16 11l2 2 4-4" strokeWidth="2" />
        </svg>
      ),
    },
    {
      label: "Customers",
      href: "/admin/customers",
      icon: (
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width={16} height={16}>
          <circle cx="12" cy="8" r="4" strokeWidth="2" />
          <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" strokeWidth="2" />
        </svg>
      ),
    },
  ],
  APPROVALS: [
    {
      label: "IRDAI Approvals",
      href: "/admin/irdaiapprovals",
      icon: (
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width={16} height={16}>
          <circle cx="12" cy="12" r="9" strokeWidth="2" />
          <path d="M9 12l2 2 4-4" strokeWidth="2" />
        </svg>
      ),
    },
    {
      label: "Testimonials",
      href: "/admin/testimonials",
      icon: (
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width={16} height={16}>
          <path d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-3 3v-3z" strokeWidth="2" />
        </svg>
      ),
    },
  ],
  FINANCE: [
    {
      label: "Payments",
      href: "/admin/payments",
      icon: (
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width={16} height={16}>
          <path d="M3 10h18M7 15h1m4 0h1m-7 4h12a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" strokeWidth="2" />
        </svg>
      ),
    },
    {
      label: "Subscriptions",
      href: "/admin/subscriptions",
      icon: (
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width={16} height={16}>
          <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" strokeWidth="2" />
        </svg>
      ),
    },
  ],
  SYSTEM: [
    {
      label: "Settings",
      href: "/admin/settings",
      icon: (
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width={16} height={16}>
          <circle cx="12" cy="12" r="3" strokeWidth="2" />
          <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" strokeWidth="2" />
        </svg>
      ),
    },
  ],
};