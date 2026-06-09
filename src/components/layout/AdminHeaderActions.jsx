"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import { FaBell } from "react-icons/fa";
import { IoSettingsOutline } from "react-icons/io5";
import { MdOutlineLogout } from "react-icons/md";
import { hasPermission } from "@/lib/admin/permissions";
import { useAdminNotifications } from "@/hooks/TanstankQuery/useAdminNotifications";

function useDismissOnOutsideClick(open, onClose, containerRef) {
  useEffect(() => {
    if (!open) return undefined;

    const onPointerDown = (event) => {
      if (containerRef.current?.contains(event.target)) return;
      onClose();
    };

    const onKeyDown = (event) => {
      if (event.key === "Escape") onClose();
    };

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open, onClose, containerRef]);
}

function NotificationBadge({ count }) {
  if (!count) return null;

  const label = count > 99 ? "99+" : String(count);

  return (
    <span
      className="absolute -top-0.5 -right-0.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-[#DC2626] px-1 text-[10px] font-bold text-white"
      aria-hidden="true"
    >
      {label}
    </span>
  );
}

function ProfileMenu({ admin, adminProfileImage, adminInitials, onLogout, logoutLoading, size = "md" }) {
  const router = useRouter();
  const menuId = useId();
  const containerRef = useRef(null);
  const [open, setOpen] = useState(false);
  const canOpenSettings = hasPermission(admin, "settings");

  useDismissOnOutsideClick(open, () => setOpen(false), containerRef);

  const buttonSize = size === "sm" ? "h-9 w-9" : "h-10 w-10";
  const initialsClass = size === "sm" ? "text-xs" : "text-sm";

  return (
    <div className="relative" ref={containerRef}>
      <button
        type="button"
        aria-label="Account menu"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={menuId}
        onClick={() => setOpen((current) => !current)}
        className={`relative flex ${buttonSize} cursor-pointer items-center justify-center overflow-hidden rounded-full bg-[#F59E0B] ring-2 ring-[#FEC564]`}
      >
        {adminProfileImage ? (
          <Image src={adminProfileImage} alt="" fill className="object-cover" />
        ) : (
          <span className={`font-bold text-white ${initialsClass}`} aria-hidden="true">
            {adminInitials}
          </span>
        )}
      </button>

      {open ? (
        <div
          id={menuId}
          role="menu"
          aria-label="Account options"
          className="absolute right-0 z-50 mt-2 w-56 overflow-hidden rounded-2xl border border-[#E6ECEA] bg-white shadow-[0_16px_40px_rgba(10,74,74,0.12)]"
        >
          <div className="border-b border-[#EEF2F0] px-4 py-3">
            <p className="truncate text-sm font-semibold text-[#0A4A4A]">{admin?.name || "Admin"}</p>
            <p className="text-[11px] font-medium uppercase tracking-wide text-[#7A928D]">
              {admin?.role === "super_admin" ? "Super admin" : "Admin"}
            </p>
          </div>

          {canOpenSettings ? (
            <button
              type="button"
              role="menuitem"
              onClick={() => {
                setOpen(false);
                router.push("/admin/settings");
              }}
              className="flex w-full items-center gap-2 px-4 py-3 text-left text-sm font-medium text-[#0A4A4A] hover:bg-[#F8FAFC]"
            >
              <IoSettingsOutline size={16} aria-hidden="true" />
              Settings
            </button>
          ) : null}

          <button
            type="button"
            role="menuitem"
            onClick={() => {
              setOpen(false);
              onLogout();
            }}
            disabled={logoutLoading}
            className="flex w-full items-center gap-2 border-t border-[#EEF2F0] px-4 py-3 text-left text-sm font-medium text-[#DC2626] hover:bg-[#FFF5F5] disabled:cursor-wait disabled:opacity-60"
          >
            <MdOutlineLogout size={16} aria-hidden="true" />
            {logoutLoading ? "Logging out…" : "Logout"}
          </button>
        </div>
      ) : null}
    </div>
  );
}

function NotificationsMenu({ admin, size = "md" }) {
  const menuId = useId();
  const containerRef = useRef(null);
  const [open, setOpen] = useState(false);
  const { data, isLoading, isError } = useAdminNotifications(admin);

  useDismissOnOutsideClick(open, () => setOpen(false), containerRef);

  const items = data?.items || [];
  const total = data?.total || 0;
  const buttonSize = size === "sm" ? "h-9 w-9" : "h-10 w-10";
  const iconSize = size === "sm" ? "h-4 w-4" : "h-5 w-5";

  const ariaLabel =
    total > 0
      ? `Notifications, ${total} item${total === 1 ? "" : "s"} need attention`
      : "Notifications";

  return (
    <div className="relative" ref={containerRef}>
      <button
        type="button"
        aria-label={ariaLabel}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={menuId}
        onClick={() => setOpen((current) => !current)}
        className={`admin-glass-card relative flex ${buttonSize} cursor-pointer items-center justify-center rounded-full`}
      >
        <FaBell
          className={iconSize}
          aria-hidden="true"
          style={{
            fill: "#F59E0B",
            stroke: "#E4E2DB",
            strokeWidth: 1,
          }}
        />
        <NotificationBadge count={total} />
      </button>

      {open ? (
        <div
          id={menuId}
          role="menu"
          aria-label="Action queue"
          className="absolute right-0 z-50 mt-2 w-72 overflow-hidden rounded-2xl border border-[#E6ECEA] bg-white shadow-[0_16px_40px_rgba(10,74,74,0.12)]"
        >
          <div className="border-b border-[#EEF2F0] px-4 py-3">
            <p className="text-sm font-semibold text-[#0A4A4A]">Needs attention</p>
            <p className="text-xs text-[#7A928D]">Queues that need admin action</p>
          </div>

          {isLoading ? (
            <p className="px-4 py-4 text-sm text-[#7A928D]">Loading…</p>
          ) : isError ? (
            <p className="px-4 py-4 text-sm text-[#DC2626]">Could not load notifications.</p>
          ) : items.length === 0 ? (
            <p className="px-4 py-4 text-sm text-[#5C7571]">You&apos;re all caught up.</p>
          ) : (
            <ul className="py-1">
              {items.map((item) => (
                <li key={item.id}>
                  <Link
                    href={item.href}
                    role="menuitem"
                    onClick={() => setOpen(false)}
                    className="flex items-center justify-between gap-3 px-4 py-3 text-sm text-[#0A4A4A] hover:bg-[#F8FAFC]"
                  >
                    <span className="font-medium">{item.label}</span>
                    <span className="rounded-full bg-[#FFF6E8] px-2 py-0.5 text-xs font-bold text-[#B45309]">
                      {item.count}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}

          <div className="border-t border-[#EEF2F0] px-4 py-3">
            <Link
              href="/admin"
              role="menuitem"
              onClick={() => setOpen(false)}
              className="text-xs font-semibold text-[#0A4A4A] hover:underline"
            >
              Open dashboard
            </Link>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default function AdminHeaderActions({
  actions = [],
  admin,
  adminProfileImage,
  adminInitials,
  onLogout,
  logoutLoading = false,
  variant = "desktop",
}) {
  const showNotifications = actions.includes("notifications");
  const showProfile = actions.includes("profile");
  const size = variant === "mobile" ? "sm" : "md";

  if (!showNotifications && !showProfile) return null;

  return (
    <div className={`flex items-center ${variant === "mobile" ? "gap-2" : "gap-4"}`}>
      {showNotifications ? <NotificationsMenu admin={admin} size={size} /> : null}
      {showProfile ? (
        <ProfileMenu
          admin={admin}
          adminProfileImage={adminProfileImage}
          adminInitials={adminInitials}
          onLogout={onLogout}
          logoutLoading={logoutLoading}
          size={size}
        />
      ) : null}
    </div>
  );
}
