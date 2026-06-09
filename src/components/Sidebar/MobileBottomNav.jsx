"use client";

import Link from "next/link";
import { FiGrid, FiHome, FiShield, FiUsers } from "react-icons/fi";
import { GiMedal } from "react-icons/gi";
import { canAccessSidebarItem } from "@/lib/admin/permissions";
import { isNavItemActive } from "@/lib/admin/navConfig";

const NAV_SLOTS = [
  {
    id: "dashboard",
    label: "Dashboard",
    link: "/admin",
    icon: FiHome,
    permissionKey: "overview",
    exactPath: true,
  },
  {
    id: "users",
    label: "Users",
    link: "/admin/users",
    icon: FiUsers,
    permissionKey: "users",
    alternatePermissionKeys: ["customers"],
  },
  { id: "menu", type: "menu" },
  {
    id: "approvals",
    label: "Approvals",
    link: "/admin/irdaiapprovals",
    icon: FiShield,
    permissionKey: "irdai_approvals",
  },
  {
    id: "ambassadors",
    label: "Ambassadors",
    link: "/admin/ambassadors",
    icon: GiMedal,
    permissionKey: "ambassadors",
    alternatePermissionKeys: ["referrals", "rewards", "leaderboard"],
  },
];

function TabLink({ tab, pathname }) {
  const Icon = tab.icon;
  const active = isNavItemActive(pathname, {
    link: tab.link,
    exactPath: tab.exactPath === true,
  });

  return (
    <Link
      href={tab.link}
      className={`group flex flex-col items-center justify-end gap-1 pb-1 transition-colors ${
        active ? "text-[#0A4A4A]" : "text-[#7A928D]"
      }`}
    >
      <span
        className={`flex h-10 w-10 items-center justify-center rounded-2xl transition-all duration-200 ${
          active
            ? "bg-[#0A4A4A] text-white shadow-[0_6px_16px_rgba(10,74,74,0.28)]"
            : "bg-[#E8F4F3] text-[#0A4A4A] group-active:scale-95"
        }`}
      >
        <Icon size={18} />
      </span>
      <span className="max-w-[68px] truncate font-poppins text-[10px] font-semibold">
        {tab.label}
      </span>
    </Link>
  );
}

function CenterMenuButton({ menuOpen, onOpenMenu, onCloseMenu }) {
  return (
    <div className="relative flex flex-col items-center justify-end pb-1">
      <button
        type="button"
        aria-label="Open admin menu"
        onClick={menuOpen ? onCloseMenu : onOpenMenu}
        className={`relative -mt-7 flex h-[58px] w-[58px] items-center justify-center rounded-full transition-transform active:scale-95 ${
          menuOpen
            ? "bg-[#0A4A4A] shadow-[0_10px_28px_rgba(10,74,74,0.35)] ring-4 ring-[#F8F6F1]"
            : "bg-gradient-to-br from-[#F59E0B] via-[#FBBF24] to-[#D97706] shadow-[0_12px_32px_rgba(245,158,11,0.45)] ring-4 ring-[#F8F6F1]"
        }`}
      >
        <FiGrid size={22} className="text-white" />
        {!menuOpen ? (
          <span className="absolute -top-0.5 -right-0.5 h-3 w-3 rounded-full bg-[#0A4A4A] ring-2 ring-[#F8F6F1]" />
        ) : null}
      </button>
      <span
        className={`mt-1 font-poppins text-[10px] font-bold ${
          menuOpen ? "text-[#0A4A4A]" : "text-[#B45309]"
        }`}
      >
        Menu
      </span>
    </div>
  );
}

export default function MobileBottomNav({
  pathname,
  admin,
  menuOpen,
  onOpenMenu,
  onCloseMenu,
}) {
  const canAccess = (tab) =>
    canAccessSidebarItem(
      admin,
      tab.permissionKey,
      tab.alternatePermissionKeys || [],
    );

  return (
    <nav
      className="admin-bottom-nav fixed inset-x-0 bottom-0 z-40 md:hidden"
      aria-label="Mobile navigation"
    >
      <div className="relative mx-auto grid h-[72px] max-w-lg grid-cols-5 items-end px-2">
        {NAV_SLOTS.map((slot) => {
          if (slot.type === "menu") {
            return (
              <CenterMenuButton
                key={slot.id}
                menuOpen={menuOpen}
                onOpenMenu={onOpenMenu}
                onCloseMenu={onCloseMenu}
              />
            );
          }

          if (!canAccess(slot)) {
            return <div key={slot.id} aria-hidden="true" />;
          }

          return <TabLink key={slot.id} tab={slot} pathname={pathname} />;
        })}
      </div>
    </nav>
  );
}
