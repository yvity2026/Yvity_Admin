export const USER_QUICK_ACTIONS = [
  {
    id: "notify",
    label: "Send notification",
    href: "/admin/communications",
    live: true,
    icon: "bell",
    primary: true,
  },
  {
    id: "upgrade",
    label: "Upgrade plan",
    href: "/admin/subscriptions",
    live: false,
    icon: "upgrade",
    primary: true,
    professionalOnly: true,
  },
  {
    id: "coupon",
    label: "Apply coupon",
    href: "/admin/coupons",
    live: false,
    icon: "coupon",
    primary: true,
  },
  {
    id: "suspend",
    label: "Suspend user",
    action: "suspend",
    live: true,
    icon: "suspend",
    primary: false,
    showWhen: "active",
  },
  {
    id: "activate",
    label: "Activate user",
    action: "activate",
    live: true,
    icon: "activate",
    primary: false,
    showWhen: "suspended",
  },
  {
    id: "delete",
    label: "Delete user",
    action: "delete",
    live: true,
    icon: "delete",
    primary: false,
    destructive: true,
  },
];

export function getUserQuickActions(user) {
  if (!user) return [];

  return USER_QUICK_ACTIONS.filter((action) => {
    if (action.professionalOnly && user.userType !== "professional") {
      return false;
    }

    if (action.showWhen === "active" && user.status !== "active") {
      return false;
    }

    if (action.showWhen === "suspended" && user.status !== "suspended") {
      return false;
    }

    if (user.status === "deleted" && action.action === "suspend") {
      return false;
    }

    return true;
  });
}
