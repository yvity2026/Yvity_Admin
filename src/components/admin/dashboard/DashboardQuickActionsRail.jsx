"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiBell,
  FiChevronDown,
  FiFlag,
  FiSearch,
  FiShield,
  FiStar,
  FiUser,
  FiZap,
  FiGift,
  FiSend,
  FiUsers,
  FiArrowUpRight,
} from "react-icons/fi";
import { MdOutlineCampaign } from "react-icons/md";

const ICONS = {
  search: FiSearch,
  shield: FiShield,
  profile: FiUser,
  star: FiStar,
  upgrade: FiZap,
  coupon: FiGift,
  megaphone: MdOutlineCampaign,
  ambassador: FiUsers,
  flag: FiFlag,
  bell: FiBell,
};

function ActionRow({ action }) {
  const Icon = ICONS[action.icon] || FiArrowUpRight;

  return (
    <Link
      href={action.href}
      className="group flex items-center gap-3 rounded-2xl border border-[#E6ECEA] bg-[#FCFDFC] px-3 py-2.5 transition-all hover:border-[#0A4A4A]/20 hover:bg-white hover:shadow-[0_6px_20px_rgba(10,74,74,0.08)]"
    >
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#E8F4F3] text-[#0A4A4A] transition-colors group-hover:bg-[#0A4A4A] group-hover:text-white">
        <Icon size={16} />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[12px] font-semibold leading-snug text-[#183534]">{action.label}</p>
        {!action.live && (
          <p className="text-[10px] font-medium text-[#9AB0AB]">Coming soon</p>
        )}
      </div>
      <div className="flex shrink-0 items-center gap-1.5">
        {action.badge != null && action.badge > 0 && (
          <span className="admin-num rounded-full bg-[#FFF1F0] px-2 py-0.5 text-[10px] font-bold text-[#DC2626] ring-1 ring-[#FCA5A5]/50">
            {action.badge}
          </span>
        )}
        <FiArrowUpRight
          size={14}
          className="text-[#9AB0AB] transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-[#0A4A4A]"
        />
      </div>
    </Link>
  );
}

export default function DashboardQuickActionsRail({ actions = [], variant = "rail" }) {
  const [showMore, setShowMore] = useState(false);
  const primary = actions.filter((action) => action.primary);
  const secondary = actions.filter((action) => !action.primary);
  const isRail = variant === "rail";

  return (
    <div
      className={
        isRail
          ? "admin-glass-card sticky top-[76px] rounded-[24px] p-4 shadow-[0_8px_30px_rgba(10,74,74,0.06)] xl:p-5"
          : "admin-glass-card rounded-[24px] p-4"
      }
    >
      <div className="mb-4 flex items-center justify-between gap-2">
        <div>
          <p className="font-poppins text-[10px] font-semibold uppercase tracking-[0.16em] text-[#7A928D]">
            Quick actions
          </p>
          <h3 className="font-cormorant text-[20px] font-bold text-[#0A4A4A]">⚡ Take action</h3>
        </div>
      </div>

      <div className="space-y-2">
        {primary.map((action) => (
          <ActionRow key={action.id} action={action} />
        ))}
      </div>

      {secondary.length > 0 && (
        <div className="mt-3">
          <button
            type="button"
            onClick={() => setShowMore((open) => !open)}
            className="flex w-full items-center justify-between rounded-xl px-2 py-2 text-[12px] font-semibold text-[#0A4A4A] transition hover:bg-[#E8F4F3]/60"
          >
            <span>{showMore ? "Fewer actions" : "More actions"}</span>
            <FiChevronDown
              size={16}
              className={`transition-transform ${showMore ? "rotate-180" : ""}`}
            />
          </button>

          <AnimatePresence initial={false}>
            {showMore && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="space-y-2 pt-2">
                  {secondary.map((action) => (
                    <ActionRow key={action.id} action={action} />
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
