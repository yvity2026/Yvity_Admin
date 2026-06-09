"use client";

import Link from "next/link";
import {
  FiArrowUpRight,
  FiBell,
  FiGift,
  FiTrash2,
  FiUserCheck,
  FiUserX,
  FiZap,
} from "react-icons/fi";

const ICONS = {
  bell: FiBell,
  upgrade: FiZap,
  coupon: FiGift,
  suspend: FiUserX,
  activate: FiUserCheck,
  delete: FiTrash2,
};

function ActionButton({ action, onAction, loading }) {
  const Icon = ICONS[action.icon] || FiArrowUpRight;

  if (action.href) {
    return (
      <Link
        href={action.href}
        className="group flex items-center gap-3 rounded-2xl border border-[#E6ECEA] bg-[#FCFDFC] px-3 py-2.5 transition hover:border-[#0A4A4A]/20 hover:bg-white"
      >
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#E8F4F3] text-[#0A4A4A] group-hover:bg-[#0A4A4A] group-hover:text-white">
          <Icon size={16} />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-[12px] font-semibold text-[#183534]">{action.label}</p>
          {!action.live && <p className="text-[10px] text-[#9AB0AB]">Coming soon</p>}
        </div>
        <FiArrowUpRight size={14} className="text-[#9AB0AB]" />
      </Link>
    );
  }

  return (
    <button
      type="button"
      disabled={loading}
      onClick={() => onAction?.(action)}
      className={`group flex w-full items-center gap-3 rounded-2xl border px-3 py-2.5 text-left transition disabled:opacity-60 ${
        action.destructive
          ? "border-[#FECACA] bg-[#FFF1F0] hover:border-[#FCA5A5]"
          : "border-[#E6ECEA] bg-[#FCFDFC] hover:border-[#0A4A4A]/20 hover:bg-white"
      }`}
    >
      <div
        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${
          action.destructive
            ? "bg-[#FEE2E2] text-[#DC2626]"
            : "bg-[#E8F4F3] text-[#0A4A4A] group-hover:bg-[#0A4A4A] group-hover:text-white"
        }`}
      >
        <Icon size={16} />
      </div>
      <div className="min-w-0 flex-1">
        <p
          className={`text-[12px] font-semibold ${
            action.destructive ? "text-[#DC2626]" : "text-[#183534]"
          }`}
        >
          {action.label}
        </p>
      </div>
    </button>
  );
}

export default function UserQuickActionsRail({
  actions = [],
  onAction,
  loading = false,
  variant = "rail",
}) {
  const primary = actions.filter((action) => action.primary);
  const secondary = actions.filter((action) => !action.primary);

  return (
    <div
      className={
        variant === "rail"
          ? "admin-glass-card sticky top-[76px] rounded-[24px] p-4 shadow-[0_8px_30px_rgba(10,74,74,0.06)] xl:p-5"
          : "admin-glass-card rounded-[24px] p-4"
      }
    >
      <p className="font-poppins text-[10px] font-semibold uppercase tracking-[0.16em] text-[#7A928D]">
        Quick actions
      </p>
      <h3 className="font-cormorant text-[20px] font-bold text-[#0A4A4A]">Manage user</h3>

      <div className="mt-4 space-y-2">
        {primary.map((action) => (
          <ActionButton key={action.id} action={action} onAction={onAction} loading={loading} />
        ))}
      </div>

      {secondary.length > 0 && (
        <div className="mt-3 space-y-2 border-t border-[#EEF2F0] pt-3">
          {secondary.map((action) => (
            <ActionButton key={action.id} action={action} onAction={onAction} loading={loading} />
          ))}
        </div>
      )}
    </div>
  );
}
