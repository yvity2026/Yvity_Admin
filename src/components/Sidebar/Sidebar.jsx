"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { FaCrown } from "react-icons/fa";
import { MdOutlineLogout } from "react-icons/md";
import clsx from "clsx";
import {
  canAccessSidebarItem,
  getFirstAccessibleAdminRoute,
} from "@/lib/admin/permissions";
import { buildSidebarMenuItems, resolveAdminPageHeader } from "@/lib/admin/navConfig";
import { AdminPageTitleProvider, useAdminPageTitle } from "@/context/AdminPageTitleContext";
import { ADMIN_NAV_ICONS } from "@/lib/admin/navIcons";
import { useAdmin } from "@/context/AuthAdminContext";
import { useSidebar } from "@/context/SidebarContext";
import YvityLogo from "@/components/brand/YvityLogo";
import AdminHeaderActions from "../layout/AdminHeaderActions";
import CollapseButton from "../layout/CollapseButton";
import MobileBottomNav from "./MobileBottomNav";
import MobileMenuHub from "./MobileMenuHub";
import SidebarNav from "./SidebarNav";

const menuItems = buildSidebarMenuItems(ADMIN_NAV_ICONS);

const SIDEBAR_TRANSITION = {
  duration: 0.35,
  ease: [0.4, 0, 0.2, 1],
};

function AppShellInner({ children }) {
  const { collapsed } = useSidebar();
  const { setLoading, setAdmin, admin } = useAdmin();
  const [logoutLoading, setLogoutLoading] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const { titleOverride } = useAdminPageTitle();
  const currentHeader = useMemo(
    () => resolveAdminPageHeader(pathname, titleOverride),
    [pathname, titleOverride],
  );

  useEffect(() => {
    document.title = `${currentHeader.title} · YVITY Admin`;
  }, [currentHeader.title]);

  const sidebarWidth = collapsed ? 80 : 260;

  const [tooltip, setTooltip] = useState({
    visible: false,
    text: "",
    x: 0,
    y: 0,
  });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/auth/me");
        const data = await res.json();

        if (!res.ok || !data.success) {
          return;
        }

        setAdmin(data.data);
      } catch {
        // Session fetch failed — layout auth guard handles redirect.
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [pathname, setLoading, setAdmin]);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const visibleMenuItems = menuItems
    .map((section) => ({
      ...section,
      navitems: section.navitems.filter((item) =>
        canAccessSidebarItem(
          admin,
          item.permissionKey,
          item.alternatePermissionKeys || [],
        ),
      ),
    }))
    .filter((section) => section.navitems.length > 0);

  const handleLogout = async () => {
    if (logoutLoading) return;

    try {
      setLogoutLoading(true);
      await fetch("/api/auth/admin/logout", { method: "POST" });
      setAdmin(null);
      window.location.href = "/";
    } catch {
      setAdmin(null);
      window.location.href = "/";
    }
  };

  const role = admin?.role === "super_admin" ? "SUPER ADMIN" : "ADMIN";
  const fallbackRoute = getFirstAccessibleAdminRoute(admin || {});
  const adminProfileImage = admin?.profile_image_url || admin?.selfie_url || "";
  const adminInitials =
    admin?.name
      ?.split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase() || "")
      .join("") || "KM";

  return (
    <div className="admin-shell-bg flex h-screen overflow-hidden">
      <motion.aside
        animate={{ width: collapsed ? 80 : 260 }}
        transition={SIDEBAR_TRANSITION}
        className={clsx(
          "admin-sidebar-glass relative sticky top-0 hidden h-screen shrink-0 flex-col overflow-hidden md:flex",
          collapsed ? "w-20" : "w-[260px]",
        )}
      >
        <div className="flex h-full min-h-0 flex-col">
          <div className="admin-logo-bar flex h-[60px] shrink-0 items-center justify-center px-3">
            <YvityLogo
              size={collapsed ? "sm" : "md"}
              layout="horizontal"
              showName={!collapsed}
              namePosition="right"
              surface="none"
              imageClassName={collapsed ? "h-8" : "h-10"}
              nameClassName="text-[22px] leading-none"
            />
          </div>

          <div
            className={clsx(
              "shrink-0 border-b border-white/8 px-4 py-4",
              collapsed ? "flex flex-col items-center gap-2" : "flex flex-col items-start gap-2",
            )}
          >
            <div
              className={clsx(
                "relative flex items-center justify-center overflow-hidden rounded-full bg-[#F59E0B] ring-2 ring-[#FEC564]/80",
                collapsed ? "h-10 w-10" : "h-12 w-12",
              )}
            >
              {adminProfileImage ? (
                <Image
                  src={adminProfileImage}
                  alt={admin?.name ? `${admin.name} profile` : "Admin profile"}
                  fill
                  className="object-cover"
                />
              ) : (
                <span className="font-semibold text-white">{adminInitials}</span>
              )}
            </div>

            {!collapsed && (
              <p className="font-poppins text-sm font-semibold text-[#F8F6F1]">
                {admin?.name}
              </p>
            )}

            <div
              className={clsx(
                "flex items-center justify-center rounded-full bg-[rgba(245,158,11,0.18)] text-[#F59E0B] ring-1 ring-[#F59E0B]/25",
                collapsed ? "p-2" : "gap-1.5 px-3 py-1",
              )}
            >
              <FaCrown className={collapsed ? "text-sm" : "text-xs"} />
              {!collapsed && (
                <p className="text-[10px] font-bold uppercase tracking-wide">{role}</p>
              )}
            </div>
          </div>

          <div className="admin-sidebar-scroll min-h-0 flex-1 py-3">
            <SidebarNav
              sections={visibleMenuItems}
              pathname={pathname}
              collapsed={collapsed}
              fallbackRoute={fallbackRoute}
              setTooltip={setTooltip}
            />
          </div>

          <div className="shrink-0 border-t border-white/10 px-3 py-3">
            <motion.button
              type="button"
              onClick={handleLogout}
              disabled={logoutLoading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={clsx(
                "flex w-full items-center rounded-xl px-3 py-2.5 font-semibold text-[#8BBEBE] transition-colors hover:bg-white/8 hover:text-white disabled:cursor-wait disabled:opacity-60",
                collapsed ? "justify-center" : "gap-3",
              )}
            >
              <MdOutlineLogout className="text-lg" />
              {!collapsed && (
                <span className="font-cormorant text-[15px] font-bold">
                  {logoutLoading ? "Logging out..." : "Logout"}
                </span>
              )}
            </motion.button>
          </div>
        </div>
      </motion.aside>

      <CollapseButton sidebarWidth={sidebarWidth} />

      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <header className="admin-header-bar sticky top-0 right-0 left-0 z-30 flex min-h-[60px] shrink-0 items-center gap-3 px-3 md:gap-4 md:px-8">
          <div className="flex min-w-0 shrink-0 items-center md:hidden">
            <YvityLogo
              size="sm"
              layout="horizontal"
              showName
              namePosition="right"
              surface="none"
              imageClassName="h-8"
              nameClassName="text-[17px] leading-none"
            />
          </div>

          <div className="min-w-0 flex-1 md:hidden">
            {currentHeader.sectionLabel ? (
              <p className="truncate font-poppins text-[10px] font-semibold uppercase tracking-[0.14em] text-[#7A928D]">
                {currentHeader.sectionLabel}
              </p>
            ) : null}
            <h1 className="truncate font-cormorant text-base font-bold leading-tight text-[#0A4A4A]">
              {currentHeader.title}
            </h1>
          </div>

          <h2 className="hidden min-w-0 flex-1 truncate font-cormorant text-xl font-bold leading-none text-[#0A4A4A] md:block">
            {currentHeader.title}
          </h2>

          {currentHeader.actions.length > 0 ? (
            <div className="flex h-10 shrink-0 items-center gap-2 md:gap-4">
              <div className="md:hidden">
                <AdminHeaderActions
                  actions={currentHeader.actions}
                  admin={admin}
                  adminProfileImage={adminProfileImage}
                  adminInitials={adminInitials}
                  onLogout={handleLogout}
                  logoutLoading={logoutLoading}
                  variant="mobile"
                />
              </div>

              <div className="hidden h-10 items-center gap-4 md:flex">
                <AdminHeaderActions
                  actions={currentHeader.actions}
                  admin={admin}
                  adminProfileImage={adminProfileImage}
                  adminInitials={adminInitials}
                  onLogout={handleLogout}
                  logoutLoading={logoutLoading}
                  variant="desktop"
                />
              </div>
            </div>
          ) : null}
        </header>

        <MobileMenuHub
          open={mobileOpen}
          onClose={() => setMobileOpen(false)}
          sections={visibleMenuItems}
          pathname={pathname}
          currentPageTitle={currentHeader.title}
          currentSectionLabel={currentHeader.sectionLabel}
          currentSectionId={currentHeader.sectionId}
        />

        <main className="admin-mobile-main min-w-0 flex-1 overflow-auto overscroll-y-contain">
          {children}
        </main>

        <MobileBottomNav
          pathname={pathname}
          admin={admin}
          menuOpen={mobileOpen}
          onOpenMenu={() => setMobileOpen(true)}
          onCloseMenu={() => setMobileOpen(false)}
        />
      </div>

      {tooltip.visible && collapsed ? (
        <div
          style={{
            position: "fixed",
            top: tooltip.y,
            left: tooltip.x,
            zIndex: 99999,
          }}
          className="pointer-events-none whitespace-nowrap rounded-lg border border-white/15 bg-[#0A4A4A]/95 px-3 py-1.5 font-poppins text-xs text-white shadow-lg backdrop-blur-md"
        >
          {tooltip.text}
        </div>
      ) : null}
    </div>
  );
}

export default function AppShell({ children }) {
  return (
    <AdminPageTitleProvider>
      <AppShellInner>{children}</AppShellInner>
    </AdminPageTitleProvider>
  );
}
